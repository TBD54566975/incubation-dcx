import {
  applicationSchema,
  CredentialApplication,
  CredentialManifest,
  DcxAgentRecovery,
  DcxApplicationRecordsCreateResponse,
  dcxConfig,
  DcxConfig,
  DcxCreateApplicationRecordParams,
  DcxDwnError,
  DcxManager,
  dcxOptions,
  DcxOptions,
  DcxParams,
  DcxPresentation,
  DcxPresentationSubmission,
  DcxQueryRecordsParams,
  DcxRecordsQueryResponse,
  DcxRecordsReadResponse,
  DwnError,
  DwnUtils,
  Format,
  FORMFREE,
  Issuer,
  Logger,
  manifestSchema,
  PresentationExchangeParams,
  RecordsParams,
  responseSchema
} from '@dcx-protocol/common';
import { Web5PlatformAgent } from '@web5/agent';
import {
  ProtocolsConfigureResponse,
  ProtocolsQueryResponse,
  Record,
  Web5
} from '@web5/api';
import { PresentationDefinitionV2, PresentationExchange, VerifiablePresentation } from '@web5/credentials';
import { dcxApplicant } from './index.js';
export type ValidateApplicationParams = {
  presentationDefinition: PresentationDefinitionV2;
  presentation: DcxPresentation
};
export type DcxValidated = {
  tag: string;
  status: string;
  message: string
};
export type ValidateVerifiablePresentationResponse = {
  areRequiredCredentialsPresent: 'info' | 'warn' | 'error';
  verifiableCredential: Array<any>;
}
export type CreateCredentialApplicationParams = {
  presentationSubmission: DcxPresentationSubmission;
  manifestId: string;
}
export class DcxCredentialApplication implements CredentialApplication {
  constructor(
    public id: string,
    public spec_version: string = 'https://identity.foundation/credential-manifest/#versioning',
    public applicant: string,
    public manifest_id: string,
    public format: Format,
    public presentation_submission: DcxPresentationSubmission,
  ) {}
}
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

  public async readApplicationResponseRecords(
    { records: manifestRecords }: RecordsParams
  ): Promise<DcxRecordsReadResponse> {
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
  ): Promise<DcxRecordsReadResponse> {
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
  public async readRecords({ records }: RecordsParams): Promise<DcxRecordsReadResponse> {
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
  public async queryRecords({ from, protocolPath }: DcxQueryRecordsParams): Promise<DcxRecordsQueryResponse> {
    const { status, records = [], cursor } = await DcxApplicant.web5.dwn.records.query({
      from,
      message : {
        filter : {
          protocolPath,
          protocol     : dcxApplicant.protocol,
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
   * Query records from DWN
   */
  public async queryManifestRecords({ from }: DcxQueryRecordsParams): Promise<DcxRecordsQueryResponse> {
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
  ): Promise<DcxCredentialApplication> {
    const app = {
      id                      : crypto.randomUUID(),
      spec_version            : 'https://identity.foundation/credential-manifest/#versioning',
      applicant               : DcxApplicant.did,
      manifest_id             : manifestId,
      format                  : { jwt_vc: { alg: ['EdDSA'] }},
      presentation_submission : presentationSubmission,
    };
    return new DcxCredentialApplication(
      app.id,
      app.spec_version,
      app.applicant,
      app.manifest_id,
      app.format,
      app.presentation_submission
    );
  }

  public validatePresentationSubmission(presentationSubmission: DcxPresentationSubmission): DcxValidated {
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

  /**
   * Create missing manifest record
   * @param unwrittenManifest CredentialManifest; see {@link CredentialManifest}
   * @returns Record | undefined; see {@link Record}
   */
  public async createApplicationRecord(
    { vcJwts, presentationDefinition, applicationRecord, recipient, manifestRecord }: DcxCreateApplicationRecordParams
  ): Promise<DcxApplicationRecordsCreateResponse> {
    const application = PresentationExchange.createPresentationFromCredentials({ vcJwts, presentationDefinition });
    /*
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
    */

    const applicationManifest = manifestRecord?.issuer ?? this.options.manifests.find(
      (manifest) => applicationRecord.manifest_id === manifest.id
    );

    if(!applicationManifest) {
      throw new DcxDwnError(
        `Failed to find manifest id ${applicationRecord.manifest_id} for application record ${applicationRecord.id}`
      );
    }

    const { record, status } = await DcxApplicant.web5.dwn.records.create({
      store   : true,
      data    : application.presentation,
      message : {
        schema       : applicationSchema.$id,
        dataFormat   : 'application/json',
        protocol     : dcxApplicant.protocol,
        protocolPath : 'application',
        published    : true,
      },
    });

    if (DwnUtils.isFailure(status.code)) {
      const { code, detail } = status;
      Logger.error('Failed to create application record', status);
      throw new DwnError(code, detail);
    }

    if (!record) {
      Logger.error(`No application record returned from create`, applicationRecord);
      throw new DcxDwnError(
        `Failed to create application record in local DWN: ${applicationRecord.id}`,
      );
    }
    Logger.debug(`Created application record`, record);

    const applicant = await record.send();
    const { status: applicantStatus } = applicant ?? {};
    if (DwnUtils.isFailure(applicantStatus.code)) {
      const { code, detail } = applicantStatus;
      Logger.error('Failed to send application record to applicant dwn', applicantStatus);
      throw new DwnError(code, detail);
    }
    Logger.debug(`Sent application record to applicant dwns`, applicant);

    const issuer = await record.send(recipient);
    const { status: issuerStatus } = issuer ?? {};
    if (DwnUtils.isFailure(issuerStatus.code)) {
      const { code, detail } = issuerStatus;
      Logger.error('Failed to send application record to issuer dwn', issuer);
      throw new DwnError(code, detail);
    }

    Logger.debug(`Sent application record to issuer dwns`, issuer);
    return { record, applicant, issuer };
  }

  /**
   *
   * Find issuer by name or id
   *
   * @param param.name the name of the issuer to find
   * @param param.id the id of the issuer to find
   * @returns Issuer or FORMFREE; see {@link Issuer}, {@link FORMFREE}
   */
  public findIssuer({ name, id }: Partial<Issuer>): Issuer {
    return this.options.issuers.find((issuer: Issuer) => issuer.name === name || issuer.id === id) ?? FORMFREE;
  }

  /**
   *
   * Get manifests by issuer name or id
   *
   * @param param.name the name of the issuer to find
   * @param param.id the id of the issuer to find
   * @returns DcxRecordsReadResponse; see {@link DcxRecordsReadResponse}
   */
  public async getManifests({ name, id }: Partial<Issuer>): Promise<DcxRecordsReadResponse> {
    const issuer = this.findIssuer({ name, id });
    const { records: query } = await this.queryRecords({ from: issuer.id, protocolPath: 'manifest' });
    Logger.log(`Found ${query.length} manifest records in ${issuer.name} dwn`);
    const { records } = await this.readRecords({ records: query });
    Logger.log(`Read ${records.length} manifest records from ${issuer.name} dwn`);
    return { records };
  }

  /**
   *
   * Find a manifest by name or id
   *
   * @param param.name the name of the manifest to find
   * @param param.id the id of the manifest to find
   * @returns CredentialManifest or undefined; see {@link CredentialManifest}
   */
  public findManifest({ name, id }: Partial<CredentialManifest>): CredentialManifest | undefined {
    return this.options.manifests.find(
      (manifest: CredentialManifest) => manifest.name === name || manifest.id  === id);
  }

  /**
   *
   * Find a manifest by name or id
   *
   * @param param.name the name of the manifest to find
   * @param param.id the id of the manifest to find
   * @returns CredentialManifest or undefined; see {@link CredentialManifest}
   */
  public findManifests({ name, id }: Partial<CredentialManifest>): CredentialManifest[] {
    return this.options.manifests.filter(
      (manifest: CredentialManifest) => this.findManifest({ name, id })?.id === manifest.id);
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
      password       : this.config.applicantProtocol.web5Password,
      recoveryPhrase : this.config.applicantProtocol.web5RecoveryPhrase,
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
