import {
  CreateCredentialApplicationParams,
  CredentialApplication,
  DcxAgentRecovery,
  dcxConfig,
  DcxConfig,
  DcxDwnError,
  DcxError,
  DcxManager,
  dcxOptions,
  DcxOptions,
  DcxParams,
  DcxValidated,
  DwnError,
  DwnUtils,
  GetManifestsResponse,
  Issuer,
  Logger,
  manifestSchema,
  OptionsUtil,
  PresentationExchangeParams,
  PresentationSubmission,
  RecordCreateParams,
  RecordReadParams,
  RecordsCreateParams,
  RecordsParams,
  RecordsQueryParams,
  RecordsQueryResponse,
  RecordsReadParams,
  RecordsReadResponse,
  responseSchema,
  ValidateApplicationParams,
  ValidateVerifiablePresentationResponse
} from '@dcx-protocol/common';
import { Web5PlatformAgent } from '@web5/agent';
import {
  ProtocolsConfigureResponse,
  ProtocolsQueryResponse,
  Record,
  Web5
} from '@web5/api';
import { PresentationExchange, VerifiablePresentation } from '@web5/credentials';
import { dcxApplicant } from './index.js';

/**
 * DcxApplicant is the core class for the applicant side of the DCX protocol.
 * It handles the credential issuance, verification, selection, as well as
 * requests to 3rd party VC data provider. It also manages the setup and
 * initialization of the Web5 connection, the DCX agent, DCX Identity Vault, and the DWN.
 * @class DcxApplicant implements DcxManager; see {@link DcxManager} for more details.
 * @param params DcxParams; see {@link DcxParams}: {@link DcxOptions}, {@link DcxConfig}
 * @returns DcxApplicant
 * @example
 * const applicant = new Dcxapplicant({ options: dcxOptions, config: dcxConfig });
 * applicant.initializeWeb5();
 * applicant.setupDwn();
 */
export class DcxApplicant implements DcxManager {
  options       : DcxOptions = dcxOptions;
  config        : DcxConfig = dcxConfig;

  isSetup       : boolean = false;
  isInitialized : boolean = false;

  public static did   : string;
  public static web5  : Web5;
  public static agent : Web5PlatformAgent;

  constructor(params: DcxParams) {
    this.options = params.options ? { ...this.options, ...params.options } : this.options;
    this.config = params.config ? { ...this.config, ...params.config } : this.config;
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

  public static async queryRecords(): Promise<RecordsQueryResponse> {
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

  public async readRecord({ record }: RecordReadParams): Promise<RecordsReadResponse> {
    throw new DcxError('Method not implemented.', record);
  }

  public async readApplicationResponseRecords(
    { records: manifestRecords }: RecordsParams
  ): Promise<RecordsReadParams> {
    const records = await Promise.all(
      manifestRecords.map(async (manifestRecord: Record) => {
        const { record: read } = await DcxApplicant.web5.dwn.records.read({
          from    : manifestRecord.author,
          message : {
            filter : {
              recordId : manifestRecord.id,
            },
          },
        });
        return read.data.json();
      }),
    );
    return { records };
  }

  public async readManifestRecords(
    { records: manifestRecords }: RecordsParams
  ): Promise<RecordsReadParams> {
    const records = await Promise.all(
      manifestRecords.map(async (manifestRecord: Record) => {
        const { record: read } = await DcxApplicant.web5.dwn.records.read({
          from    : manifestRecord.author,
          message : {
            filter : {
              recordId : manifestRecord.id,
            },
          },
        });
        return read.data.json();
      }),
    );
    return { records };
  }

  /**
   * Filter manifest records
   * @param applicationResponseRecords Record[]; see {@link Record}
   * @returns applicationResponses[]; see {@link responseSchema}
   */
  public async readRecords({ records }: RecordsParams): Promise<RecordsReadResponse> {
    const reads = await Promise.all(
      records.map(async (record: Record) => {
        const { record: read } = await DcxApplicant.web5.dwn.records.read({
          from    : record.author,
          message : {
            filter : {
              recordId : record.id,
            },
          },
        });
        return read.data.json();
      }),
    );
    return { records: reads };
  }

  /**
   * Query records from DWN
   */
  public async queryRecords({ from, protocolPath, options }: RecordsQueryParams): Promise<RecordsQueryResponse> {
    const { status, records = [], cursor } = await DcxApplicant.web5.dwn.records.query({
      from,
      message : {
        filter : {
          protocolPath,
          protocol     : dcxApplicant.protocol,
          schema       : manifestSchema.$id,
          dataFormat   : 'application/json',
        },
        ...options
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
   * Query records from DWN
   */
  public async queryManifestRecords({ from }: RecordsQueryParams): Promise<RecordsQueryResponse> {
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

  public async createVerifiablePresentation(
    { vcJwts, presentationDefinition }: PresentationExchangeParams
  ): Promise<{vp: VerifiablePresentation}> {
    const { presentationSubmission } = PresentationExchange.createPresentationFromCredentials({
      vcJwts,
      presentationDefinition
    });
    Logger.log('Presentation Submission', presentationSubmission);
    const vp = await VerifiablePresentation.create({
      holder         : DcxApplicant.did,
      vcJwts         : vcJwts,
      additionalData : { presentationSubmission }
    });
    Logger.log('Verifiable Presentation', vp);
    return { vp };
  }

  public async createCredentialApplication(
    { presentationSubmission, manifestId }: CreateCredentialApplicationParams
  ): Promise<CredentialApplication> {
    const app = {
      id                      : crypto.randomUUID(),
      spec_version            : 'https://identity.foundation/credential-manifest/#versioning',
      applicant               : DcxApplicant.did,
      manifest_id             : manifestId,
      format                  : { jwt_vc: { alg: ['EdDSA'] }},
      presentation_submission : presentationSubmission,
    };
    return new CredentialApplication(
      app.id,
      app.spec_version,
      app.applicant,
      app.manifest_id,
      app.format,
      app.presentation_submission
    );
  }

  public validatePresentationSubmission(presentationSubmission: PresentationSubmission): DcxValidated {
    const validation = PresentationExchange.validateSubmission({ presentationSubmission }) as DcxValidated[];
    Logger.log('Presentation Submission Validation', validation);
    const { tag, status, message } = validation?.[0];
    Logger.log('Presentation Submission Checked: tag, status, message', tag, status, message);
    return { tag, status, message };
  }


  public validateVerifiablePresentation(
    { presentationDefinition, presentation }: ValidateApplicationParams
  ): ValidateVerifiablePresentationResponse {
    const validation = PresentationExchange.evaluatePresentation({ presentationDefinition, presentation });
    Logger.log('Verifiable Presentation Validation', validation);
    const { areRequiredCredentialsPresent, verifiableCredential } = validation;
    Logger.log('Are required credentials present?', areRequiredCredentialsPresent);
    Logger.log('Verifiable Credentials', verifiableCredential);
    return { areRequiredCredentialsPresent, verifiableCredential };
  }

  public async createRecords({ data: creates, protocolPath, schema }: RecordsCreateParams): Promise<{records: Record[]}>{
    const records = await Promise.all(
      creates.map(async (data: any) => (await this.createRecord({ protocolPath, data, schema }))?.record)
    );
    return { records };
  }

  public async createRecord(
    { protocolPath, data, schema }: RecordCreateParams
  ): Promise<{record: Record}> {
    const { record, status } = await DcxApplicant.web5.dwn.records.create({
      data,
      store   : true,
      message : {
        schema,
        protocolPath,
        dataFormat   : 'application/json',
        protocol     : dcxApplicant.protocol,
      },
    });

    const { code, detail } = status;
    if (DwnUtils.isFailure(status.code)) {
      Logger.error('Failed to create record', status);
      throw new DwnError(code, detail);
    }

    if (!record) {
      throw new DcxDwnError(`Record not returned from create: ${code} - ${detail}`);
    }

    const { status: applicant } = await record.send();
    if (DwnUtils.isFailure(applicant.code)) {
      const { code, detail } = applicant;
      Logger.error('Failed to send record to applicant dwn', applicant);
      throw new DwnError(code, detail);
    }
    Logger.debug('Sent application record to local dwn', applicant);

    const manifest = OptionsUtil.findManifest({ manifests: this.options.manifests, id: data.manifest_id });
    const { id: recipient } = OptionsUtil.findIssuer({ issuers: this.options.issuers, id: manifest?.issuer.id });

    const { status: issuer } = await record.send(recipient);
    if (DwnUtils.isFailure(issuer.code)) {
      const { code, detail } = issuer;
      Logger.error('Failed to send record to issuer dwn', issuer);
      throw new DwnError(code, detail);
    }

    Logger.debug('Sent application record to remote dwn', issuer);

    return { record };
  }

  /**
   *
   * Get manifests by issuer name or id
   *
   * @param param.name the name of the issuer to find
   * @param param.id the id of the issuer to find
   * @returns RecordsReadParams; see {@link RecordsReadParams}
   */
  public async getManifests({ name, id }: Partial<Issuer>): Promise<GetManifestsResponse> {
    const issuer = OptionsUtil.findIssuer({ issuers: this.options.issuers, name, id });
    const { records: query } = await this.queryRecords({ from: issuer.id, protocolPath: 'manifest' });
    Logger.log(`Found ${query.length} manifest records in ${issuer.name} dwn`);
    const { records: manifests } = await this.readRecords({ records: query });
    Logger.log(`Read ${manifests.length} manifest records from ${issuer.name} dwn`);
    return { manifests };
  }

  /**
   * Setup DWN with dcx applicant protocol
   *
   * @returns boolean indicating success or failure
   * @throws DcxDwnError if the setup fails
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
        const { code, detail } = status;
        Logger.log(`Configured dcx applicant protocol in applicant dwn: ${code} - ${detail}`, protocol?.definition.protocol);
      }

      Logger.log('Dcx applicant dwn setup complete');
      this.isSetup = true;
    } catch (error: any) {
      Logger.error(`Dwn setup failed`, error);
      throw error;
    }
  }

  /**
   * Initialize Web5 for DcxApplicant
   */
  public async initializeWeb5(): Promise<void> {
    Logger.log('Initializing Web5 for DcxApplicant ... ');

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await DcxAgentRecovery.validate({
      password       : this.config.applicant.web5Password,
      recoveryPhrase : this.config.applicant.web5RecoveryPhrase,
      type           : 'applicant'
    });

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.options.dwns;
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