import {
  applicationSchema,
  CredentialManifest,
  DcxAgent,
  DcxDwnError,
  DcxError,
  DcxIdentityVault,
  DwnError,
  DwnUtils,
  FileSystem,
  Logger,
  manifestSchema,
  Mnemonic,
  responseSchema,
  ServerOptions
} from '@dcx-protocol/common';
import {
  ProtocolsConfigureResponse,
  ProtocolsQueryResponse,
  Record,
  RecordsCreateResponse,
  RecordsQueryResponse,
  Web5
} from '@web5/api';
import { applicant, applicantConfig, ApplicantConfig } from './index.js';
import { PresentationDefinitionV2, PresentationExchange } from '@web5/credentials';

type PresentationExchangeArgs = {
  vcJwts: string[];
  presentationDefinition: PresentationDefinitionV2
};

type ApplicantParams = {
  config?  : ApplicantConfig;
  options? : ServerOptions;
};

/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class ApplicantCore {
  options                  : ServerOptions;
  config                   : ApplicantConfig;
  _isSetup                 : boolean = false;
  _isInitialized           : boolean = false;

  public static web5       : Web5;
  public static agent      : DcxAgent;
  public static agentVault : DcxIdentityVault;

  constructor(params: ApplicantParams = {}) {
    this.config = params.config ?? applicantConfig;
    this.options = params.options ?? {
      handlers  : [],
      providers : [],
      manifests : [this.config.DCX_HANDSHAKE_MANIFEST],
      issuers   : this.config.DCX_INPUT_ISSUERS,
      gateways  : this.config.gatewayUris,
      dwns      : this.config.dwnEndpoints,
    };
  }

  /**
   * Query DWN for credential-applicant protocol
   * @returns Protocol[]; see {@link Protocol}
   */
  public static async queryProtocols(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-applicant protocol
    const { status: query, protocols = [] } = await ApplicantCore.web5.dwn.protocols.query({
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
  public static async configureProtocols(): Promise<ProtocolsConfigureResponse> {
    const { status: configure, protocol } = await ApplicantCore.web5.dwn.protocols.configure({
      message: { definition: applicant },
    });

    if (DwnUtils.isFailure(configure.code) || !protocol) {
      const { code, detail } = configure;
      Logger.error('DWN protocol configure fail', configure, protocol);
      throw new DwnError(code, detail);
    }

    const { status: send } = await protocol.send(ApplicantCore.agent.agentDid.uri);

    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error('DWN protocols send failed', send);
      throw new DwnError(code, detail);
    }

    Logger.log('Sent protocol to remote DWN', send);
    return { status: send, protocol };
  }

  public static async queryApplicationResponses(): Promise<RecordsQueryResponse> {
    const { status, records = [], cursor } = await ApplicantCore.web5.dwn.records.query({
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
  public static async readApplicationResponses(applicationResponseRecords: Record[]): Promise<{ applicationResponses: any[] }> {
    const applicationResponses = await Promise.all(
      applicationResponseRecords.map(async (applicationResponseRecord) => {
        const { record } = await ApplicantCore.web5.dwn.records.read({
          message: {
            filter: {
              recordId: applicationResponseRecord.id,
            },
          },
        });
        return record.data.json();
      }),
    );
    return { applicationResponses };
  }


  public static async queryIssuerManifests(issuerDid: string): Promise<RecordsQueryResponse> {
    const { status, records = [], cursor } = await ApplicantCore.web5.dwn.records.query({
      from    : issuerDid,
      message : {
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
   * Filter manifest records
   * @param manifestRecords Record[]; see {@link Record}
   * @returns issuerManifests[]; see {@link responseSchema}
   */
  public static async readIssuerManifests(manifestRecords: Record[]): Promise<{ manifests: CredentialManifest[] }> {
    const manifests = await Promise.all(
      manifestRecords.map(async (manifestRecord) => {
        const { record } = await ApplicantCore.web5.dwn.records.read({
          from    : manifestRecord.author,
          message : {
            filter: {
              recordId: manifestRecord.id,
            },
          },
        });
        return record.data.json();
      }),
    );
    return { manifests };
  }
  /**
   *
   * { vcJwts: string[], presentationDefinition: PresentationDefinitionV2 }
   * @param pex Presentation Exchange object; see {@link PresentationExchangeArgs}
   * @param pex.vcJwts The list of Verifiable Credentials (VCs) in JWT format to be evaluated.
   * @param pex.presentationDefinition The Presentation Definition V2 to match the VCs against.
   * @param issuerDid The DID of the issuer to send the application record to.
   */
  public static async createApplicationRecord(
    pex: PresentationExchangeArgs,
    issuerDid: string
  ): Promise<RecordsCreateResponse> {
    //   presentationDefinition: manifest.presentation_definition
    const presentationResult = PresentationExchange.createPresentationFromCredentials(pex);

    const { record, status: create } = await ApplicantCore.web5.dwn.records.create({
      store   : true,
      data    : presentationResult.presentation,
      message : {
        recipient    : issuerDid,
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

    const { status: remote } = await record.send(issuerDid);
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
  public static async setupDwn(): Promise<void> {
    // Logger.log('Setting up dwn ...');
    try {
      // Query DWN for credential-applicant protocols
      const { protocols } = await ApplicantCore.queryProtocols();
      Logger.log(`Found ${protocols.length} dcx applicant protocol in dwn`, protocols);

      // Configure DWN with credential-applicant protocol if not found
      if (!protocols.length) {
        Logger.log('Configuring dwn with dcx applicant protocol ...');
        const { status, protocol } = await ApplicantCore.configureProtocols();
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
    Logger.log('Initializing Web5 ... ');

    // Create a new DcxIdentityVault instance
    const agentVault = new DcxIdentityVault();
    const dataPath = this.config.agentDataPath;

    // Create a new DcxAgent instance
    const agent = await DcxAgent.create({ agentVault, dataPath });

    // Check if this is the first launch of the agent
    const firstLaunch = await agent.firstLaunch();

    // TODO: consider checking if vault is locked
    // const isLocked = agent.vault.isLocked();

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await this.checkWeb5Config(firstLaunch);

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.options.dwns!;
    const initializeParams = !recoveryPhrase
      ? { password, dwnEndpoints }
      : { password, recoveryPhrase, dwnEndpoints };

    // Initialize the agent with the options
    if (firstLaunch) {
      await agent.initialize(initializeParams);
    }

    // Start the agent and create a new Web5 instance
    await agent.start({ password });

    // Initialize the Web5 instance
    const web5 = new Web5({ agent, connectedDid: agent.agentDid.uri });

    // Set the DcxManager properties
    ApplicantCore.web5 = web5;
    ApplicantCore.agent = agent;
    ApplicantCore.agentVault = agentVault;

    // Set the server initialized flag
    this._isInitialized = true;
  }
}
