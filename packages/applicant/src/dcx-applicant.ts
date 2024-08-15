import {
  applicationSchema,
  DcxAgentRecovery,
  DcxApplicantProcessRecordParams,
  dcxConfig,
  DcxConfig,
  DcxDwnError,
  DcxManager,
  dcxOptions,
  DcxOptions,
  DcxParams,
  DcxRecordsQueryResponse,
  DcxRecordsReadResponse,
  DwnError,
  DwnUtils,
  Logger,
  manifestSchema,
  RecordsParams,
  responseSchema
} from '@dcx-protocol/common';
import { Web5PlatformAgent } from '@web5/agent';
import {
  ProtocolsConfigureResponse,
  ProtocolsQueryResponse,
  Record,
  RecordsCreateResponse,
  Web5
} from '@web5/api';
import { PresentationExchange } from '@web5/credentials';
import { dcxApplicant } from './index.js';

/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class DcxApplicant implements DcxManager {
  isSetup       : boolean = false;
  isInitialized : boolean = false;
  config        : DcxConfig = dcxConfig;
  options       : DcxOptions;

  public static did   : string;
  public static web5  : Web5;
  public static agent : Web5PlatformAgent;

  constructor(params: DcxParams) {
    this.options = params.options ?? dcxOptions;
    this.config = params.config ?? this.config;
  }

  /**
   * Query DWN for credential-applicant protocol
   * @returns Protocol[]; see {@link Protocol}
   */
  public async queryProtocols(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-applicant protocol
    const { status: query, protocols = [] } = await DcxApplicant.web5.dwn.protocols.query({
      message : {
        filter : {
          protocol : dcxApplicant.protocol,
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
      message : { definition: dcxApplicant },
    });

    if (DwnUtils.isFailure(configure.code) || !protocol) {
      const { code, detail } = configure;
      Logger.error('DWN protocol configure fail', configure, protocol);
      throw new DwnError(code, detail);
    }

    const { status: send } = await protocol.send(DcxApplicant.did);

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
      message : {
        filter : {
          protocol     : dcxApplicant.protocol,
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
          message : {
            filter : {
              recordId : record.id,
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
      message : {
        filter : {
          protocol     : dcxApplicant.protocol,
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
        protocol     : dcxApplicant.protocol,
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
      this.isSetup = true;
      Logger.log('DWN Setup Complete!');
    } catch (error: any) {
      Logger.error(`DWN Setup Failed!`, error);
      throw error;
    }
  }

  /**
   *
   * Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX applicant protocol
   *
   */
  public async initializeWeb5(): Promise<void> {
    Logger.log('Initializing Web5 for DcxApplicant ... ');

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await DcxAgentRecovery.validate({
      password       : this.config.applicantProtocol.web5Password,
      recoveryPhrase : this.config.applicantProtocol.web5RecoveryPhrase,
      type           : 'applicant'
    });

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.options.dwns!;
    const connectParams = !recoveryPhrase
      ? {
        password,
        didCreateOptions : { dwnEndpoints }
      } : {
        password,
        recoveryPhrase,
        didCreateOptions : { dwnEndpoints }
      };

    const { web5, did } = await Web5.connect(connectParams);
    const agent = web5.agent as Web5PlatformAgent;
    // Set the DcxManager properties
    DcxApplicant.web5 = web5;
    DcxApplicant.agent = agent;
    DcxApplicant.did = did;

    // Set the server initialized flag
    this.isInitialized = true;
  }
}
