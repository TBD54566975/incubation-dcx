import {
  applicationSchema,
  DcxApplicantParams,
  DcxApplicantProcessRecordParams,
  DcxDwnError,
  DcxError,
  DcxManager,
  DcxOptions,
  DcxRecordsQueryResponse,
  DcxRecordsReadResponse,
  DwnError,
  DwnUtils,
  FileSystem,
  Logger,
  manifestSchema,
  Mnemonic,
  RecordsParams,
  responseSchema
} from '@dcx-protocol/common';
import { HdIdentityVault, Web5PlatformAgent } from '@web5/agent';
import {
  ProtocolsConfigureResponse,
  ProtocolsQueryResponse,
  Record,
  RecordsCreateResponse,
  Web5
} from '@web5/api';
import { PresentationExchange } from '@web5/credentials';
import { Web5UserAgent } from '@web5/user-agent';
import { applicant, applicantConfig, DcxApplicantConfig } from './index.js';


const applicantOptions: DcxOptions = {
  handlers  : [],
  providers : [],
  manifests : [applicantConfig.DCX_HANDSHAKE_MANIFEST],
  issuers   : applicantConfig.DCX_INPUT_ISSUERS,
  gateways  : applicantConfig.gatewayUris,
  dwns      : applicantConfig.dwnEndpoints,
};

/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class DcxApplicant implements DcxManager {

  options : DcxOptions;
  config  : DcxApplicantConfig;

  isSetup       : boolean = false;
  isInitialized : boolean = false;

  public static web5       : Web5;
  public static agent      : Web5PlatformAgent;
  public static agentVault : HdIdentityVault;

  constructor(params: DcxApplicantParams = {}) {
    this.config = { ...applicantConfig, ...params.config };
    this.options = params.options ?? applicantOptions;
  }

  /**
   * Query DWN for credential-applicant protocol
   * @returns Protocol[]; see {@link Protocol}
   */
  public async queryProtocols(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-applicant protocol
    const { status: query, protocols = [] } = await DcxApplicant.web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: applicant.protocol,
        },
      },
    });

    if (DwnUtils.isFailure(query.code)) {
      const { code, detail } = query;
      Logger.error('DWN protocols query failed', query);
      throw new DwnError(code, detail);
    }

    Logger.log(`DWN has ${protocols.length} protocols available`);
    return { status: query, protocols };
  }

  /**
   * Configure DWN for credential-applicant protocol
   * @returns DwnResponseStatus; see {@link DwnResponseStatus}
   */
  public async configureProtocols(): Promise<ProtocolsConfigureResponse> {
    const { status: configure, protocol } = await DcxApplicant.web5.dwn.protocols.configure({
      message: { definition: applicant },
    });

    if (DwnUtils.isFailure(configure.code) || !protocol) {
      const { code, detail } = configure;
      Logger.error('DWN protocol configure fail', configure, protocol);
      throw new DwnError(code, detail);
    }

    const { status: send } = await protocol.send(DcxApplicant.agent.agentDid.uri);

    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error('DWN protocols send failed', send);
      throw new DwnError(code, detail);
    }

    Logger.log('Sent protocol to remote DWN', send);
    return { status: send, protocol };
  }

  public static async queryRecords(): Promise<DcxRecordsQueryResponse> {
    const { status, records = [], cursor } = await DcxApplicant.web5.dwn.records.query({
      message: {
        filter: {
          protocol     : applicant.protocol,
          protocolPath : 'application/response',
          schema       : responseSchema.$id,
          dataFormat   : 'application/json',
        },
      },
    });

    if (DwnUtils.isFailure(status.code)) {
      const { code, detail } = status;
      Logger.error('DWN manifest records query failed', status);
      throw new DwnError(code, detail);
    }

    return { status, records, cursor };
  }

  /**
   * Filter manifest records
   * @param applicationResponseRecords Record[]; see {@link Record}
   * @returns applicationResponses[]; see {@link responseSchema}
   */
  public async readRecords({ records, type }: RecordsParams & { type: string }): Promise<DcxRecordsReadResponse> {
    const recordReads = await Promise.all(
      records.map(async (record: Record) => {
        const baseReadRequest = {
          message: {
            filter: {
              recordId: record.id,
            },
          },
        };
        const readRequest = type === 'manifest'
          ? { ...baseReadRequest, from: record.author }
          : baseReadRequest;
        const { record: read } = await DcxApplicant.web5.dwn.records.read(readRequest);
        return read.data.json();
      }),
    );
    return { records: recordReads };
  }

  /**
   * Query records
   */
  public async queryRecords({ from }: { from: string }): Promise<DcxRecordsQueryResponse> {
    const { status, records = [], cursor } = await DcxApplicant.web5.dwn.records.query({
      from,
      message: {
        filter: {
          protocol     : applicant.protocol,
          protocolPath : 'manifest',
          schema       : manifestSchema.$id,
          dataFormat   : 'application/json',
        },
      },
    });

    if (DwnUtils.isFailure(status.code)) {
      const { code, detail } = status;
      Logger.error('DWN manifest records query failed', status);
      throw new DwnError(code, detail);
    }

    return { status, records, cursor };
  }

  /**
   *
   * { vcJwts: string[], presentationDefinition: PresentationDefinitionV2 }
   * @param pex Presentation Exchange object; see {@link PresentationExchangeArgs}
   * @param pex.vcJwts The list of Verifiable Credentials (VCs) in JWT format to be evaluated.
   * @param pex.presentationDefinition The Presentation Definition V2 to match the VCs against.
   * @param issuerDid The DID of the issuer to send the application record to.
   */
  public static async processRecord(
    { pex, recipient }: DcxApplicantProcessRecordParams
  ): Promise<RecordsCreateResponse> {
    const presentationResult = PresentationExchange.createPresentationFromCredentials(pex);

    const { record, status: create } = await DcxApplicant.web5.dwn.records.create({
      store   : true,
      data    : presentationResult.presentation,
      message : {
        recipient,
        schema       : applicationSchema.$id,
        dataFormat   : 'application/json',
        protocol     : applicant.protocol,
        protocolPath : 'application'
      }
    });

    if (DwnUtils.isFailure(create.code)) {
      const { code, detail } = create;
      Logger.error('Failed to create missing manifest record', create);
      throw new DwnError(code, detail);
    }

    if (!record) {
      throw new DcxDwnError(`Failed to create application record: ${create.code} - ${create.detail}`);
    }

    const { status: local } = await record.send();
    if (DwnUtils.isFailure(local.code)) {
      const { code, detail } = local;
      Logger.error('Failed to send dwn application record to local', local);
      throw new DwnError(code, detail);
    }

    const { status: remote } = await record.send(recipient);
    if (DwnUtils.isFailure(remote.code)) {
      const { code, detail } = remote;
      Logger.error('Failed to send dwn application record to remote', remote);
      throw new DwnError(code, detail);
    }

    Logger.debug('Sent application record to remote dwn', remote);

    return { status: remote, record };
  }

  /**
   * Setup DWN with credential-applicant protocol and manifest records
   * @returns boolean indicating success or failure
   */
  public async setupDwn(): Promise<void> {
    // Logger.log('Setting up dwn ...');
    try {
      // Query DWN for credential-applicant protocols
      const { protocols } = await this.queryProtocols();
      Logger.log(`Found ${protocols.length} dcx applicant protocol in dwn`, protocols);

      // Configure DWN with credential-applicant protocol if not found
      if (!protocols.length) {
        Logger.log('Configuring dwn with dcx applicant protocol ...');
        const { status, protocol } = await this.configureProtocols();
        Logger.log(
          `Configured credential applicant protocol in dwn: ${status.code} - ${status.detail}`,
          protocol,
        );
      }

      Logger.log('DWN Setup Complete!');
    } catch (error: any) {
      Logger.error(`DWN Setup Failed!`, error);
      throw error;
    }
  }

  /**
   *
   * Checks the state of the password and recovery phrase
   *
   * @param firstLaunch A boolean indicating if this is the first launch of the agent
   * @returns { password: string, recoveryPhrase?: string }
   * @throws DcxServerError
   *
   */
  public async checkWeb5Config(
    firstLaunch: boolean,
  ): Promise<{ password: string; recoveryPhrase?: string }> {
    const web5Password = this.config.web5Password;
    const web5RecoveryPhrase = this.config.web5RecoveryPhrase;

    // TODO: consider generating a new recovery phrase if one is not provided
    // this.config.APPLICANT_WEB5_RECOVERY_PHRASE = Mnemonic.createRecoveryPhrase();

    if (firstLaunch && !web5Password && !web5RecoveryPhrase) {
      Logger.security(
        'APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE not found on first launch! ' +
        'New APPLICANT_WEB5_PASSWORD saved to applicant.password.key file. ' +
        'New APPLICANT_WEB5_RECOVERY_PHRASE saved to applicant.recovery.key file.',
      );
      const password = Mnemonic.createPassword();
      await FileSystem.overwrite('applicant.password.key', password);

      const recoveryPhrase = Mnemonic.createRecoveryPhrase();
      await FileSystem.overwrite('applicant.recovery.key', recoveryPhrase);

      this.config.web5Password = password;
      this.config.web5RecoveryPhrase = recoveryPhrase;
      return { password, recoveryPhrase };
    }

    if (firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxError(
        'APPLICANT_WEB5_RECOVERY_PHRASE found without APPLICANT_WEB5_PASSWORD on first launch! ' +
        'APPLICANT_WEB5_PASSWORD is required to unlock the vault recovered by APPLICANT_WEB5_RECOVERY_PHRASE. ' +
        'Please set APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE in .env file.', 'DcxApplicantError'
      );
    }

    if (!firstLaunch && !web5Password && !web5RecoveryPhrase) {
      throw new DcxError(
        'APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE not found on non-first launch! ' +
        'Either set both APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
        'to create a new password and recovery phrase.', 'DcxApplicantError'
      );
    }

    if (!firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxError(
        'APPLICANT_WEB5_RECOVERY_PHRASE found without APPLICANT_WEB5_PASSWORD on non-first launch! ' +
        'Either set both APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
        'to create a new recovery phrase with the given password.', 'DcxApplicantError'
      );
    }

    if (!firstLaunch && web5Password && !web5RecoveryPhrase) {
      Logger.warn(
        'APPLICANT_WEB5_PASSWORD found without APPLICANT_WEB5_RECOVERY_PHRASE on non-first launch! ' +
        'Attempting to unlock the vault with APPLICANT_WEB5_PASSWORD.',
      );
      return { password: web5Password };
    }

    return {
      password       : web5Password,
      recoveryPhrase : web5RecoveryPhrase,
    };
  }
  /**
   *
   * Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX applicant protocol
   *
   */
  public async initializeWeb5(): Promise<void> {
    Logger.log('Initializing Web5 for DcxApplicant ... ');

    // Create a new DcxIdentityVault instance
    const agentVault = new HdIdentityVault();
    const dataPath = this.config.agentDataPath;

    // Create a new DcxAgent instance
    const agent = await Web5UserAgent.create({ agentVault, dataPath });

    // Check if this is the first launch of the agent
    const firstLaunch = await agent.firstLaunch();

    // TODO: consider checking if vault is locked
    // const isLocked = agent.vault.isLocked();

    // Check the state of the password and recovery phrase
    const { password: userPassword, recoveryPhrase: userRecoveryPhrase } = await this.checkWeb5Config(firstLaunch);

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.options.dwns!;
    const initializeParams = !userRecoveryPhrase
      ? {
        password         : userPassword,
        didCreateOptions : { dwnEndpoints }
      }
      : {
        password         : userPassword,
        recoveryPhrase   : userRecoveryPhrase,
        didCreateOptions : { dwnEndpoints }
      };

    const { web5 } = await Web5.connect({ agent, agentVault, ...initializeParams});

    // Set the DcxManager properties
    DcxApplicant.web5 = web5;
    DcxApplicant.agent = agent;
    DcxApplicant.agentVault = agentVault;

    // Set the server initialized flag
    this.isInitialized = true;
  }
}
