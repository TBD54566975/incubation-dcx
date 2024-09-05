import {
  applicationSchema,
  CredentialApplication,
  CredentialApplicationVP,
  CredentialManifest,
  DcxAgentRecovery,
  DcxDwnError,
  DcxError,
  DcxManager,
  DcxManagerStatus,
  DwnError,
  DwnUtils,
  Format,
  Logger,
  manifestSchema,
  OptionsUtil,
  PresentationDefinition,
  PresentationSubmission,
  RecordCreateParams,
  RecordResponse,
  RecordsCreateParams,
  RecordsParams,
  RecordsQueryParams,
  RecordsQueryResponse,
  RecordsReadParams,
  RecordsReadResponse,
  TrustedIssuer
} from '@dcx-protocol/common';
import { DwnResponseStatus, Web5PlatformAgent } from '@web5/agent';
import { ProtocolsConfigureResponse, ProtocolsQueryResponse, Record, Web5 } from '@web5/api';
import { PresentationDefinitionV2, PresentationExchange } from '@web5/credentials';
import { ApplicantConfig, applicantConfig } from './config.js';
import { applicant } from './index.js';

export type GetManifestsResponse = { manifests: CredentialManifest[] };
export type ValidateVerifiablePresentationResponse = {
  areRequiredCredentialsPresent: 'info' | 'warn' | 'error';
  verifiableCredential: Array<any>;
};
export type DcxValidated = {
  tag: string;
  status: string;
  message: string
};
export type ValidateApplicationParams = {
  presentation: any;
  presentationDefinition: PresentationDefinitionV2;
};
export type CreateApplicationParams = {
  id?: string;
  spec_version?: string;
  applicant?: string;
  manifest_id: string;
  format?: Format;
  presentation_submission: PresentationSubmission;
};
/**
 * DcxApplicant is the core class for the applicant side of the DCX protocol.
 * It handles the credential issuance, verification, selection, as well as
 * requests to 3rd party VC data provider. It also manages the setup and
 * initialization of the Web5 connection, the DCX agent, DCX Identity Vault, and the DWN.
 * @class DcxApplicant implements DcxManager; see {@link DcxManager} for more details.
 * @param params DcxParams; see {@link DcxParams} and {@link DcxConfig}
 * @returns DcxApplicant
 * @example
 * const applicant = new Dcxapplicant({ options: dcxOptions, config: dcxConfig });
 * applicant.initialize();
 * applicant.setup();
 */
export class DcxApplicant implements DcxManager {
  public config: ApplicantConfig;
  public status: DcxManagerStatus = {
    setup       : false,
    initialized : false,
  };

  public did!: string;
  public web5!: Web5;
  public agent!: Web5PlatformAgent;

  constructor(params?: { config: ApplicantConfig }) {
    this.config = params?.config
      ? { ...applicantConfig, ...params?.config }
      : applicantConfig;
  }

  /**
   * Query DWN for credential-applicant protocol
   * @returns Protocol[]; see {@link Protocol}
   */
  public async queryProtocols(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-applicant protocol
    const { status: query, protocols = [] } = await this.web5.dwn.protocols.query({
      from    : this.did,
      message : {
        filter : {
          protocol : applicant.protocol,
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
    const { status: configure, protocol } = await this.web5.dwn.protocols.configure({
      message : { definition: applicant },
    });

    if (DwnUtils.isFailure(configure.code) || !protocol) {
      const { code, detail } = configure;
      Logger.error('DWN protocol configure fail', configure, protocol);
      throw new DwnError(code, detail);
    }

    const { status: send } = await protocol.send(this.did);
    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error('DWN protocols send failed', send);
      throw new DwnError(code, detail);
    }

    Logger.log('Sent protocol to remote DWN', send);
    return { status: send, protocol };
  }

  public async readRecord(): Promise<RecordsReadResponse> {
    throw new DcxError('Method not implemented');
  }

  /**
   * Filter manifest records
   * @param applicationResponseRecords Record[]; see {@link Record}
   * @returns applicationResponses[]; see {@link responseSchema}
   */
  public async readRecords({ records }: RecordsParams): Promise<RecordsReadResponse> {
    const reads = await Promise.all(
      records.map(async (record: Record) => {
        const { record: read } = await this.web5.dwn.records.read({
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
    return { reads };
  }

  /**
   * Query records from DWN
   */
  public async queryRecords({ from, protocolPath, options, schema }: RecordsQueryParams): Promise<RecordsQueryResponse> {
    const { status, records = [], cursor } = await this.web5.dwn.records.query({
      from,
      message : {
        filter : {
          protocolPath,
          schema,
          protocol     : applicant.protocol,
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
    const { status, records = [], cursor } = await this.web5.dwn.records.query({
      from,
      message : {
        filter : {
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

  public async readManifestRecords(
    { records: manifestRecords }: RecordsParams
  ): Promise<RecordsReadParams> {
    const records = await Promise.all(
      manifestRecords.map(async (manifestRecord: Record) => {
        const { record: read } = await this.web5.dwn.records.read({
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

  public async readApplicationResponseRecords(
    { records: manifestRecords }: RecordsParams
  ): Promise<RecordsReadParams> {
    const records = await Promise.all(
      manifestRecords.map(async (manifestRecord: Record) => {
        const { record: read } = await this.web5.dwn.records.read({
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

  public createPresentationSubmission({ vcJwts, definition }: { vcJwts: string[], definition: PresentationDefinition }): PresentationSubmission {
    return PresentationExchange.createPresentationFromCredentials({ vcJwts, presentationDefinition: definition })?.presentationSubmission;
  }

  public createCredentialApplication({ manifest, presentation_submission }: {
    manifest: CredentialManifest;
    presentation_submission: PresentationSubmission
  },): CredentialApplication {
    return {
      id                      : crypto.randomUUID(),
      spec_version            : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
      applicant               : this.did,
      manifest_id             : manifest.id,
      format                  : { jwt: { alg: ['EdDSA'] }},
      presentation_submission
    };
  }

  public createCredentialApplicationVP({ manifest, verifiableCredential, submission }: {
    manifest: CredentialManifest,
    verifiableCredential: string[],
    submission?: PresentationSubmission
  }): CredentialApplicationVP {
    submission ??= this.createPresentationSubmission({ vcJwts: verifiableCredential, definition: manifest.presentation_definition });
    return {
      '@context'             : ['https://www.w3.org/2018/credentials/v1', 'https://identity.foundation/credential-manifest/response/v1'],
      'type'                 : ['VerifiablePresentation', 'CredentialResponse'],
      credential_application : {
        id                      : crypto.randomUUID(),
        spec_version            : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
        applicant               : this.did,
        manifest_id             : manifest.id,
        format                  : { jwt: { alg: ['EdDSA'] }},
        presentation_submission : submission,
      },
      verifiableCredential
    };
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
    const { record, status } = await this.web5.dwn.records.create({
      data,
      store   : true,
      message : {
        schema,
        protocolPath,
        dataFormat   : 'application/json',
        protocol     : applicant.protocol,
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
    Logger.debug('Created application record in local dwn', status);

    const { status: applicantSend } = await record.send();
    if (DwnUtils.isFailure(applicantSend.code)) {
      const { code, detail } = applicantSend;
      Logger.error('Failed to send record to applicantSend dwn', applicantSend);
      throw new DwnError(code, detail);
    }
    Logger.debug('Sent application record to applicant dwn', applicantSend);

    const manifest = OptionsUtil.findManifest({ manifests: this.config.manifests, id: data.manifest_id });
    const { id: issuer } = OptionsUtil.findIssuer({ issuers: this.config.issuers, id: manifest?.issuer.id });

    const { status: issuerSend } = await record.send(issuer);
    if (DwnUtils.isFailure(issuerSend.code)) {
      const { code, detail } = issuerSend;
      Logger.error('Failed to send record to issuer dwn', issuerSend);
      throw new DwnError(code, detail);
    }
    Logger.debug('Sent application record to issuer dwn', issuerSend);

    return { record };
  }

  public async createApplicationRecord({ application, issuer }: {
    application: CredentialApplicationVP;
    issuer: string
  }): Promise<DwnResponseStatus & RecordResponse> {
    const { record, status } = await this.web5.dwn.records.create({
      data    : application,
      store   : true,
      message : {
        protocol     : applicant.protocol,
        protocolPath : 'application',
        schema       : applicationSchema.$id,
        dataFormat   : 'application/json',
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
    Logger.debug('Created application record in local dwn', status);

    const { status: issuerSend } = await record.send(issuer);
    if (DwnUtils.isFailure(issuerSend.code)) {
      const { code, detail } = issuerSend;
      Logger.error('Failed to send record to issuer dwn', issuerSend);
      throw new DwnError(code, detail);
    }
    Logger.debug('Sent application record to issuer dwn', issuerSend);

    return { status: issuerSend, record };
  }

  /**
   *
   * Get manifests by issuer name or id
   *
   * @param param.name the name of the issuer to find
   * @param param.id the id of the issuer to find
   * @returns RecordsReadParams; see {@link RecordsReadParams}
   */
  public async getManifestRecords({ name, id }: Partial<TrustedIssuer>): Promise<GetManifestsResponse> {
    const issuer = OptionsUtil.findIssuer({ issuers: this.config.issuers, name, id });
    const { records: query } = await this.queryRecords({ from: issuer.id, protocolPath: 'manifest', schema: manifestSchema.$id });
    // TODO: application/response query
    //  const { records: query } = await this.queryRecords({ protocolPath: 'application/response', schema: responseSchema.$id, options: { author: issuer.id } });
    Logger.log(`Found ${query.length} manifest records in ${issuer.name} dwn`);
    const { reads: manifests } = await this.readRecords({ records: query });
    Logger.log(`Read ${manifests.length} manifest records from ${issuer.name} dwn`);
    return { manifests };
  }

  /**
   * Check if the DcxIssuer is initialized
   * @returns boolean
   */
  public isInitialized(): boolean {
    return this.status.initialized && !!(this.web5 && this.agent);
  }

  /**
   * Check if the DcxIssuer is setup
   * @returns boolean
   */
  public isSetup(): boolean {
    return this.status.setup === true;
  }

  /**
   * Setup Dwn associated with the DcxApplicant
   */
  public async setup(): Promise<void> {
    try {
      // Query DWN for credential-applicant protocols
      const { protocols } = await this.queryProtocols();
      Logger.log(`Found ${protocols.length} DcxApplicant dwn protocol(s)`, protocols);

      // Configure DWN with credential-applicant protocol if not found
      if (!protocols.length) {
        Logger.log('Configuring DcxApplicant dwn protocol ...');
        const { status, protocol } = await this.configureProtocols();
        const { code, detail } = status;
        Logger.log(`DcxApplicant dwn protocol configured: ${code} - ${detail}`, protocol?.definition.protocol);
      }

      this.status.setup = true;
    } catch (error: any) {
      Logger.error(`Failed to setup DcxApplicant dwn `, error);
      throw error;
    }
  }

  /**
   * Initialize DcxApplicant with Web5 connection, DCX agent, and DCX Identity Vault
   */
  public async initialize(): Promise<void> {
    Logger.log('Initializing DcxApplicant ... ');

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await DcxAgentRecovery.validate({
      password       : this.config.web5Password,
      recoveryPhrase : this.config.web5RecoveryPhrase,
      type           : 'applicant'
    });

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.config.dwns;
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
    this.web5 = web5 as Web5;
    this.agent = agent;
    this.did = did;

    // Set the server initialized flag
    this.status.initialized = true;
  }
}