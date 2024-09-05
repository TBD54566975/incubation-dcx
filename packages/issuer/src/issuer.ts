import {
  CredentialApplication,
  CredentialManifest,
  DcxAgent,
  DcxAgentRecovery,
  DcxDwnError,
  DcxIdentityVault,
  DcxIssuerError,
  DcxManager,
  DcxManagerStatus,
  DcxProtocolHandlerError,
  DwnError,
  DwnUtils,
  Handler,
  HandlerFunction,
  InitializeParams,
  Logger,
  manifestSchema,
  Objects,
  OptionsUtil,
  PresentationDefinition,
  PresentationSubmission,
  Provider,
  RecordCreateParams,
  RecordCreateResponse,
  RecordsCreateParams,
  RecordsParams,
  RecordsQueryResponse,
  RecordsReadResponse,
  RequestCredentialParams,
  responseSchema,
  stringifier,
  TrustedIssuer,
  VPCredentialApplication,
  VPCredentialResponse
} from '@dcx-protocol/common';
import { DwnResponseStatus } from '@web5/agent';
import {
  ProtocolsConfigureResponse,
  ProtocolsQueryResponse,
  Record,
  Web5
} from '@web5/api';
import { LevelStore } from '@web5/common';
import { PresentationExchange, VerifiableCredential } from '@web5/credentials';
import { issuer, issuerConfig, IssuerConfig } from './index.js';


export type IssuerPexParams = {
  vcJwts: string[];
  presentationDefinition: PresentationDefinition
};
export type ValidateVerifiablePresentationResponse = {
  areRequiredCredentialsPresent: 'info' | 'warn' | 'error';
  verifiableCredential: Array<any>;
};
export type CreateCredentialApplicationParams = { presentationSubmission: PresentationSubmission; manifestId: string; };

export type GetManifestsResponse = { manifests: CredentialManifest[] };

/**
 * DcxIssuer is the core class for the issuer side of the DCX protocol.
 * It handles the credential issuance, verification, selection, as well as
 * requests to 3rd party VC data provider. It also manages the setup and
 * initialization of the Web5 connection, the DCX agent, DCX Identity Vault, and the DWN.
 * @class DcxIssuer implements DcxManager; see {@link DcxManager} for more details.
 * @param params DcxParams; see {@link DcxParams}: {@link DcxOptions}, {@link DcxConfig}
 * @returns DcxIssuer
 * @example
 * const issuer = new DcxIssuer({ options: dcxOptions, config: dcxConfig });
 * await issuer.initialize();
 * await issuer.setup();
 *
 * @example
 * const issuer = new DcxIssuer();
 * const agent = await DcxAgent.create();
 * const web5 = new Web5({ agent, connectedDid: agent.agentDid.uri });
 * await issuer.initialize({ agent, web5 });
 */
export class DcxIssuer implements DcxManager {
  public status: DcxManagerStatus = {
    setup       : false,
    initialized : false,
  };

  public config: IssuerConfig;
  public web5!: Web5;
  public agent!: DcxAgent;
  public agentVault: DcxIdentityVault;

  constructor(params?: { config: IssuerConfig }) {
    this.config = params?.config
      ? { ...issuerConfig, ...params.config }
      : issuerConfig;

    this.agentVault = new DcxIdentityVault({ store: new LevelStore<string, string>({ location: `${this.config.agentDataPath}/VAULT_STORE` }) });

    /**
     * Set the default handlers if none are provided
     */
    if(!this.config.handlers || this.config.handlers.length === 0) {
      this.config.handlers = [
        { id: 'selectCredentials', handler: this.selectCredentials },
        { id: 'verifyCredentials', handler: this.verifyCredentials },
        { id: 'requestCredentialData', handler: this.requestCredentialData },
        { id: 'createCredential', handler: this.createCredential },
        { id: 'createCredentialResponse', handler: this.createCredentialResponse },
        { id: 'issueCredential', handler: this.issueCredential },
      ];
    }

    /**
     * Search the handlers passed into DcxParams and bind them to the class.
     * Default to the static handler if not found. To truncate a prebuilt
     * handler, name your custom handler the same as the static handler.
     */
    this.selectCredentials = this.findHandler('selectCredentials', this.selectCredentials);
    this.verifyCredentials = this.findHandler('verifyCredentials', this.verifyCredentials);
    this.requestCredentialData = this.findHandler('requestCredentialData', this.requestCredentialData);
    this.createCredential = this.findHandler('createCredential', this.createCredential);
    this.createCredentialResponse = this.findHandler('createCredentialResponse', this.createCredentialResponse);
    this.issueCredential = this.findHandler('issueCredential', this.issueCredential);

  }

  /**
   *
   * Find a handler by id
   *
   * @param id The id of the handler to find
   * @param staticHandler The static handler to use if the handler is not found
   * @returns The handler if found, otherwise the static handler
   */
  public findHandler(id: string, staticHandler: HandlerFunction): HandlerFunction {
    return this.config.handlers.find(
      (dcxHandler: Handler) => dcxHandler.id === id
    )?.handler ?? staticHandler ?? this.config.handlers.push({ id, handler: staticHandler });
  }

  /**
   *
   * Verify the credentials in a Verifiable Presentation
   * @param vcs The selected credentials to verify
   * @param subjectDid The DID of the subject of the credentials
   * @returns An array of verified credentials
   */
  public async verifyCredentials({ vcJwts, manifest, applicant }: {
    vcJwts: string[];
    manifest: CredentialManifest;
    applicant: string;
  }): Promise<VerifiableCredential[]> {
    try {
      PresentationExchange.satisfiesPresentationDefinition({ vcJwts, presentationDefinition: manifest.presentation_definition });
    } catch (error) {
      Logger.error('VC does not satisfy Presentation Definition', error);
    }
    const verifiedCredentials: VerifiableCredential[] = [];

    for (const vcJwt of vcJwts) {
      Logger.debug('Parsing credential ...', vcJwt);
      const vc = VerifiableCredential.parseJwt({ vcJwt });
      Logger.debug('Parsed credential', stringifier(vc));

      if (vc.subject !== applicant) {
        Logger.debug(`Credential subject ${vc.subject} doesn't match applicant ${applicant}`);
        continue;
      }

      const issuers = this.config.issuers.map((issuer: TrustedIssuer) => issuer.id);
      const issuerDidSet = new Set<string>(issuers);

      if (!issuerDidSet.has(vc.vcDataModel.issuer as string)) {
        continue;
      }

      const verified = await VerifiableCredential.verify({ vcJwt });
      if (!verified || Objects.isEmpty(verified)) {
        Logger.debug('Credential verification failed');
        continue;
      }
      verifiedCredentials.push(vc);
    }
    return verifiedCredentials;
  }

  /**
   *
   * Select credentials from a Verifiable Presentation
   * @param vp The verifiable presentation
   * @param manifest The credential manifest
   * @returns An array of selected credentials
   */
  public selectCredentials({ verifiableCredential, manifest }: {
    verifiableCredential: string[];
    manifest: CredentialManifest;
  }): string[] {
    Logger.debug('Selecting credentials from manifest ...');
    Logger.debug('Verifiable credentials', stringifier(verifiableCredential));
    Logger.debug('Credential manifest', stringifier(manifest));

    return PresentationExchange.selectCredentials({
      vcJwts                 : verifiableCredential,
      presentationDefinition : manifest.presentation_definition,
    });
  }

  /**
   *
   * Issue a credential
   * @param data The data to include in the credential
   * @param applicant The DID of the subject of the credential
   * @param manifest The credential manifest
   * @returns The issued credential
   */
  public async createCredential({ data, application, manifest }: {
    data: any,
    application: CredentialApplication,
    manifest: CredentialManifest,
  }): Promise<{ signedVc: string }> {
    const { id: credentialId, name } = manifest.output_descriptors[0];
    Logger.debug(`Creating vc ${credentialId} ...`);

    const vc = await VerifiableCredential.create({
      data,
      subject : application.applicant,
      issuer  : this.agent.agentDid.uri,
      type    : name,
    });
    Logger.debug(`Created vc ${credentialId}`, stringifier(vc));

    const signedVc = await vc.sign({ did: this.agent.agentDid });
    Logger.debug(`Signed vc ${credentialId}`, stringifier(signedVc));

    return { signedVc };
  }

  /**
   *
   * Request credential data from a VC data provider
   * @param body The body of the request
   * @param method The HTTP method to use
   * @param headers The headers to include in the request
   * @returns The response from the VC data provider
   */
  public async requestCredentialData(params: RequestCredentialParams): Promise<any> {
    const provider = this.config.providers.find((provider: Provider) => provider.id === params?.id);

    if (!provider) {
      throw new DcxProtocolHandlerError('No VC data provider configured');
    }
    Logger.debug(`Requesting VC data from ${provider.id} at ${provider.endpoint}`);

    const response = await fetch(provider.endpoint, {
      method  : provider.method ?? 'POST',
      headers : provider.headers,
      body    : stringifier(params.body),
    });
    Logger.debug('VC request response', stringifier(response));

    const data = await response.json();
    Logger.debug('VC request data', stringifier(data));

    return data;
  }

  public async issueCredential({ response, recipient }: {
    response: VPCredentialResponse,
    recipient: string
  }): Promise<DwnResponseStatus> {
    const { record, status } = await this.web5.dwn.records.create({
      data    : response,
      store   : true,
      message : {
        protocol     : issuer.protocol,
        protocolPath : 'application/response',
        schema       : responseSchema.$id,
        dataFormat   : 'application/json',
      },
    });

    if (DwnUtils.isFailure(status.code)) {
      const { code, detail } = status;
      Logger.error('DWN records create failed', status);
      throw new DwnError(code, detail);
    }

    if (!record) {
      throw new DcxProtocolHandlerError('Failed to create application response record');
    }

    const { status: send } = await record.send(recipient);
    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error('DWN records send failed', send);
      throw new DwnError(code, detail);
    }

    Logger.debug('Sent application response to applicant DWN', send, status);
    return { status: send };
  }

  /**
   * Query DWN for dcx issuer protocols
   *
   * @returns Protocol[]; see {@link Protocol}
   */
  public async queryProtocols(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-issuer protocol
    const { status: query, protocols = [] } = await this.web5.dwn.protocols.query({
      message : {
        filter : {
          protocol : issuer.protocol,
        },
      },
    });

    if (DwnUtils.isFailure(query.code)) {
      const { code, detail } = query;
      Logger.error(`DWN protocols query failed`, query);
      throw new DwnError(code, detail);
    }

    Logger.debug(`DWN has ${protocols.length} protocols available`);
    return { status: query, protocols };
  }

  /**
   * Configure DWN with dcx issuer protocol
   *
   * @returns DwnResponseStatus; see {@link DwnResponseStatus}
   */
  public async configureProtocols(): Promise<ProtocolsConfigureResponse> {
    const { status: configure, protocol } = await this.web5.dwn.protocols.configure({
      message : { definition: issuer },
    });

    if (DwnUtils.isFailure(configure.code) || !protocol) {
      const { code, detail } = configure;
      Logger.error('DWN protocol configure fail', configure, protocol);
      throw new DwnError(code, detail);
    }

    const { status: send } = await protocol.send(this.agent.agentDid.uri);

    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error('DWN protocols send failed', send);
      throw new DwnError(code, detail);
    }

    Logger.debug('Sent protocol to remote DWN', send);
    return { status: send, protocol };
  }

  /**
   * Query DWN for manifest records
   *
   * @returns Record[]; see {@link Record}
   */
  public async queryRecords(): Promise<RecordsQueryResponse> {
    const { status, records = [], cursor } = await this.web5.dwn.records.query({
      message : {
        filter : {
          protocol     : issuer.protocol,
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
   * Read records from DWN
   *
   * @param params.records list of Record objects to read; see {@link RecordsParams}
   * @returns a list of records that have been read into json; see {@link RecordsReadResponse}
   */
  public async readRecords({ records: manifestRecords }: RecordsParams): Promise<RecordsReadResponse> {
    const records = await Promise.all(
      manifestRecords.map(async (manifestRecord: Record) => {
        const { record } = await this.web5.dwn.records.read({
          message : {
            filter : {
              recordId : manifestRecord.id,
            },
          },
        });
        return record.data.json();
      }),
    );
    return { records };
  }

  /**
   * Create missing manifests
   * @param missingManifests CredentialManifest[]; see {@link CredentialManifest}
   * @returns Record[]; see {@link Record}
   */
  public async createRecord(
    { data, schema, protocolPath }: RecordCreateParams
  ): Promise<RecordCreateResponse> {
    if(protocolPath === 'manifest') {
      data = data as CredentialManifest;
    }
    const { record, status } = await this.web5.dwn.records.create({
      data,
      store   : true,
      message : {
        schema,
        protocolPath,
        dataFormat   : 'application/json',
        protocol     : issuer.protocol,
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

    if(process.env.NODE_ENV === 'test') return { record };

    const { status: local } = await record.send();
    if (DwnUtils.isFailure(local.code)) {
      const { code, detail } = local;
      Logger.error('Failed to send record to local dwn', local);
      throw new DwnError(code, detail);
    }
    Logger.debug('Sent manifest record to local dwn', local);

    if(protocolPath === 'application/response') {
      const manifest = OptionsUtil.findManifest({ manifests: this.config.manifests, id: data.manifest_id });
      const { id: recipient } = OptionsUtil.findIssuer({ issuers: this.config.issuers, id: manifest?.issuer.id });
      const { status: applicant } = await record.send(recipient);
      if (DwnUtils.isFailure(applicant.code)) {
        const { code, detail } = applicant;
        Logger.error('Failed to send record to applicant dwn', applicant);
        throw new DwnError(code, detail);
      }
      Logger.debug('Sent application/response record to remote dwn', applicant);
    }

    return { record };
  }

  public async createRecords({ data: creates, protocolPath, schema }: RecordsCreateParams): Promise<{records: Record[]}>{
    const records = await Promise.all(
      creates.map(async (data: any) => (await this.createRecord({ protocolPath, data, schema }))?.record)
    );
    return { records };
  }

  public createCredentialResponse({ verifiableCredential, application, manifest }: {
    manifest: CredentialManifest,
    verifiableCredential: string[],
    application: CredentialApplication,
  }): VPCredentialResponse {
    const { id: credentialId } = manifest.output_descriptors[0];
    return {
      '@context'           : ['https://www.w3.org/2018/credentials/v1', 'https://identity.foundation/credential-manifest/response/v1'],
      'type'               : ['VerifiablePresentation', 'CredentialResponse'],
      credential_response  : {
        id             : crypto.randomUUID(),
        manifest_id    : manifest.id,
        applicant      : application.applicant,
        spec_version   : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
        application_id : application.id,
        fulfillment    :  {
          descriptor_map : [{
            id     : credentialId,
            format : 'jwt',
            path   : '$.verifiableCredential[0]'
          }]
        }
      },
      verifiableCredential
    };
  }

  /**
   *
   * Process an application record
   * @param record The application record to process
   * @param manifest The credential manifest
   * @returns The status of the application record processing
   */
  public async processApplicationRecord({ record, manifest, providerId }: {
    record: Record,
    manifest: CredentialManifest,
    providerId?: string
  }): Promise<DwnResponseStatus> {
    Logger.debug('Processing application record ...', stringifier(record));

    // Parse the JSON VP from the application record; this will contain the credentials
    const vpApplication: VPCredentialApplication = await record.data.json();
    Logger.info('Processing vp credential application ...', stringifier(vpApplication));

    // Select valid credentials against the manifest
    const vcJwts = this.selectCredentials({
      manifest,
      verifiableCredential : vpApplication.verifiableCredential,
    });
    Logger.info(`Selected ${vcJwts.length} credentials`, stringifier(vcJwts));

    const applicant = record.author;
    const verified = await this.verifyCredentials({ vcJwts, manifest, applicant });
    Logger.info(`Verified ${verified.length} credentials`, stringifier(verified));

    // request vc data
    const data = await this.requestCredentialData({ body: { vcs: verified }, id: providerId});
    Logger.info('Requested data from provider', stringifier(data));

    const application = vpApplication.credential_application;
    const { signedVc } = await this.createCredential({ data, manifest, application });
    Logger.info('Created credential', signedVc);

    const response = this.createCredentialResponse({
      manifest,
      verifiableCredential : [signedVc],
      application          : vpApplication.credential_application,
    });
    Logger.info('Created credential response', stringifier(response));

    const issuance = await this.issueCredential({ response, recipient: applicant });
    Logger.info('Issued credential', stringifier(issuance));

    return { status: issuance.status };
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
   * Setup Dwn associated with the DcxIssuer
   */
  public async setup(): Promise<void> {
    try {
      if(!this.isInitialized()) {
        throw new DcxIssuerError('DcxIssuer not initialized');
      }
      // Query DWN for credential-issuer protocols
      const { protocols } = await this.queryProtocols();
      Logger.log(`Found ${protocols.length} DcxIssuer dwn protocol(s)`, protocols);

      // Configure DWN with credential-issuer protocol if not found
      if (!protocols.length) {
        Logger.log('Configuring DcxIssuer dwn protocol ...');
        const { status, protocol } = await this.configureProtocols();
        Logger.debug(`Dcx issuer protocol configured: ${status.code} - ${status.detail}`, protocol);
      }

      // Query DWN for manifest records
      const { records: query } = await this.queryRecords();
      Logger.log(`Found ${query.length} manifest records in DcxIssuer dwn`);

      // Read manifest records data
      const { records: manifests } = await this.readRecords({ records: query });
      Logger.debug(`Read ${manifests.length} manifest records from DcxIssuer dwn`, manifests);

      if (!manifests.length) {
      // Create missing manifest records
        const { records } = await this.createRecords({
          protocolPath : 'manifest',
          schema       : manifestSchema.$id,
          data         : this.config.manifests
        });
        Logger.log(`Created ${records.length} manifest records in DcxIssuer dwn`, records);

      } else {
        // Filter and create missing manifest records
        const { missing: records } = OptionsUtil.findMissingManifests({
          dwnManifests   : manifests,
          localManifests : this.config.manifests
        });
        Logger.debug(`Found ${records.length} unwritten manifests`);

        const { records: create } = await this.createRecords({
          data         : records,
          protocolPath : 'manifest',
          schema       : manifestSchema.$id
        });
        Logger.log(`Created ${create.length} records in DcxIssuer dwn`, create);

      }
      Logger.log('DcxIssuer dwn setup complete');
      this.status.setup = true;
    } catch (error: any) {
      Logger.error('Failed to setup DcxIssuer dwn', error);
      throw error;
    }
  }

  /**
   * Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX issuer protocol
   */
  public async initialize({ agent, web5 }: InitializeParams = {}): Promise<void> {
    Logger.log('Initializing DcxIssuer ... ');

    // Create a new DcxAgent instance
    agent ??= await DcxAgent.create({
      agentVault : this.agentVault,
      dataPath   : this.config.agentDataPath
    });

    // Check if this is the first launch of the agent
    const firstLaunch = await agent.firstLaunch();

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await DcxAgentRecovery.validate({
      firstLaunch,
      type           : 'issuer',
      password       : this.config.web5Password,
      recoveryPhrase : this.config.web5RecoveryPhrase,
    });

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.config.dwns;
    const initializeParams = !recoveryPhrase
      ? { password, dwnEndpoints }
      : { password, dwnEndpoints, recoveryPhrase };

    // Initialize the agent with the options
    if (firstLaunch) {
      await agent.initialize(initializeParams);
    }

    // Start the agent and create a new Web5 instance
    await agent.start({ password });

    // Initialize the Web5 instance
    web5 ??= new Web5({ agent, connectedDid: agent.agentDid.uri });

    // Set the DcxManager properties
    this.web5 = web5;
    this.agent = agent;

    // Set the server initialized flag
    this.status.initialized = true;
  }
}