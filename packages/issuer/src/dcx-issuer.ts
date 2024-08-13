import {
  CredentialManifest,
  DcxAgent,
  DcxDwnError,
  DcxIdentityVault,
  DcxIssuerParams,
  DcxManager,
  DcxOptions,
  DcxProcessRecordResponse,
  DcxProtocolHandlerError,
  DcxRecordsCreateResponse,
  DcxRecordsFilterResponse,
  DcxRecordsQueryResponse,
  DcxRecordsReadResponse,
  DwnError,
  DwnUtils,
  Handler,
  Issuer,
  Logger,
  ManifestParams,
  manifestSchema,
  Mnemonic,
  Objects,
  Provider,
  RecordsParams,
  responseSchema,
  ServerHandler,
  stringifier,
  FileSystem,
  DcxIssuerError
} from '@dcx-protocol/common';
import { DwnResponseStatus } from '@web5/agent';
import {
  ProtocolsConfigureResponse,
  ProtocolsQueryResponse,
  Record,
  RecordsCreateResponse,
  Web5,
} from '@web5/api';
import {
  PresentationExchange,
  VerifiableCredential,
  VerifiablePresentation,
} from '@web5/credentials';
import { dcxIssuerConfig, DcxIssuerConfig, issuer } from './index.js';

/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class DcxIssuer implements DcxManager {

  isInitialized: boolean = false;
  isSetup: boolean = false;
  dcxConfig: DcxIssuerConfig;
  dcxOptions: DcxOptions;

  public static agentVault: DcxIdentityVault = new DcxIdentityVault();
  public static agent: DcxAgent;
  public static web5: Web5;

  constructor(params: DcxIssuerParams = {}) {
    this.selectCredentials = this.findHandler('selectCredentials', this.selectCredentials);
    this.verifyCredentials = this.findHandler('verifyCredentials', this.verifyCredentials);
    this.requestCredential = this.findHandler('requestCredential', this.requestCredential);
    this.issueCredential = this.findHandler('issueCredential', this.issueCredential);

    this.dcxConfig = { ...dcxIssuerConfig, ...params.config };
    this.dcxOptions = params.options ?? {
      handlers  : [],
      providers : [],
      manifests : [this.dcxConfig.DCX_HANDSHAKE_MANIFEST],
      issuers   : this.dcxConfig.DCX_INPUT_ISSUERS,
      gateways  : this.dcxConfig.gatewayUris,
      dwns      : this.dcxConfig.dwnEndpoints,
    };
  }

  public findHandler(id: string, staticHandler: Handler): Handler {
    return this.dcxOptions.handlers.find((serverHandler: ServerHandler) => serverHandler.id === id)?.handler ?? staticHandler;
  }

  /**
   *
   * Verify the credentials in a Verifiable Presentation
   * @param vcs The selected credentials to verify
   * @param subjectDid The DID of the subject of the credentials
   * @returns An array of verified credentials
   */
  public async verifyCredentials(
    vcJwts: string[],
    manifest: CredentialManifest,
    subjectDid: string,
  ): Promise<VerifiableCredential[]> {
    PresentationExchange.satisfiesPresentationDefinition({
      vcJwts,
      presentationDefinition: manifest.presentation_definition,
    });

    const verifiedCredentials: VerifiableCredential[] = [];

    for (const vcJwt of vcJwts) {
      Logger.debug('Parsing credential ...', vcJwt);

      const vc = VerifiableCredential.parseJwt({ vcJwt });
      Logger.debug('Parsed credential', stringifier(vc));

      if (vc.subject !== subjectDid) {
        Logger.debug(`Credential subject ${vc.subject} doesn't match subjectDid ${subjectDid}`);
        continue;
      }

      const issuers = [...this.dcxOptions.issuers, ...dcxIssuerConfig.DCX_INPUT_ISSUERS].map((issuer: Issuer) => issuer.id);
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
  public selectCredentials(
    vp: VerifiablePresentation,
    manifest: CredentialManifest,
  ): string[] {
    Logger.debug('Using verifiable presentation for credential selection', stringifier(vp));
    return PresentationExchange.selectCredentials({
      vcJwts                 : vp.verifiableCredential,
      presentationDefinition : manifest.presentation_definition,
    });
  }

  /**
   *
   * Issue a credential
   * @param data The data to include in the credential
   * @param subjectDid The DID of the subject of the credential
   * @param manifest The credential manifest
   * @returns The issued credential
   */
  public async issueCredential(
    data: any,
    subjectDid: string,
    manifest: CredentialManifest,
  ): Promise<any> {
    const manifestOutputDescriptor = manifest.output_descriptors[0];
    Logger.debug(`Issuing ${manifestOutputDescriptor.id} credential`);

    const vc = await VerifiableCredential.create({
      data,
      subject : subjectDid,
      issuer  : DcxIssuer.agent.agentDid.uri,
      type    : manifestOutputDescriptor.name,
    });
    Logger.debug(`Created ${manifestOutputDescriptor.id} credential`, stringifier(vc));

    const signed = await vc.sign({ did: DcxIssuer.agent.agentDid });
    Logger.debug(`Signed ${manifestOutputDescriptor.id} credential`, stringifier(signed));

    return {
      fulfillment: {
        descriptor_map: [
          {
            id     : manifestOutputDescriptor.id,
            format : 'jwt_vc',
            path   : '$.verifiableCredential[0]',
          },
        ],
      },
      verifiableCredential: [signed],
    };
  }

  /**
   *
   * Request credential data from a VC data provider
   * @param body The body of the request
   * @param method The HTTP method to use
   * @param headers The headers to include in the request
   * @returns The response from the VC data provider
   */
  public async requestCredential(
    params: {
      body : { vcs: VerifiableCredential[] | any },
      id?  : string
    }): Promise<any> {
    const provider = this.dcxOptions.providers.find((provider: Provider) => provider.id === params?.id);

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

  /**
   * Query DWN for credential-issuer protocol
   * @returns Protocol[]; see {@link Protocol}
   */
  public async queryProtocols(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-issuer protocol
    const { status: query, protocols = [] } = await DcxIssuer.web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: issuer.protocol,
        },
      },
    });

    if (DwnUtils.isFailure(query.code)) {
      const { code, detail } = query;
      Logger.error(`DWN protocols query failed`, query);
      throw new DwnError(code, detail);
    }

    Logger.debug(`DWN has ${protocols.length} protocols available`);
    Logger.debug('protocols', stringifier(protocols));
    return { status: query, protocols };
  }

  /**
   * Configure DWN for credential-issuer protocol
   * @returns DwnResponseStatus; see {@link DwnResponseStatus}
   */
  public async configureProtocols(): Promise<ProtocolsConfigureResponse> {
    const { status: configure, protocol } = await DcxIssuer.web5.dwn.protocols.configure({
      message: { definition: issuer },
    });

    Logger.debug('configureProtocols configure', stringifier(configure));
    Logger.debug('configureProtocols protocol', stringifier(protocol));


    if (DwnUtils.isFailure(configure.code) || !protocol) {
      const { code, detail } = configure;
      Logger.error('DWN protocol configure fail', configure, protocol);
      throw new DwnError(code, detail);
    }

    const { status: send } = await protocol.send(DcxIssuer.agent.agentDid.uri);

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
   * @returns Record[]; see {@link Record}
   */
  public async queryRecords(): Promise<DcxRecordsQueryResponse> {
    const {
      status,
      records = [],
      cursor,
    } = await DcxIssuer.web5.dwn.records.query({
      message: {
        filter: {
          schema       : manifestSchema.$id,
          dataFormat   : 'application/json',
          protocol     : issuer.protocol,
          protocolPath : 'manifest',
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
   *
   * @param params.records list of Record objects to read; see {@link RecordsParams}
   * @returns a list of records that have been read into json; see {@link DcxRecordsReadResponse}
   */
  public async readRecords({ records: manifestRecords }: RecordsParams): Promise<DcxRecordsReadResponse> {
    const records = await Promise.all(
      manifestRecords.map(async (manifestRecord: Record) => {
        const { record } = await DcxIssuer.web5.dwn.records.read({
          message: {
            filter: {
              recordId: manifestRecord.id,
            },
          },
        });
        return record.data.json();
      }),
    );
    return { records };
  }

  /**
   * Filter manifests passed to to dcxOptions against manifest record
   * reads in dwn to find missing manifests; See {@link CredentialManifest}
   *
   * @param params.records list of CredentialManifest objects; see {@link ManifestParams}
   * @returns list of CredentialManifest objects that need writing to remote DWN
   */
  public async filterRecords({ records: manifestRecords }: ManifestParams): Promise<DcxRecordsFilterResponse> {
    const records = this.dcxOptions.manifests.filter((manifest: CredentialManifest) =>
      manifestRecords.find((manifestRecord: CredentialManifest) => manifest.id !== manifestRecord.id),
    );
    return { records };
  }

  /**
   * Create missing manifest record
   * @param unwrittenManifest CredentialManifest; see {@link CredentialManifest}
   * @returns Record | undefined; see {@link Record}
   */
  public async createManifestRecord({ manifestRecord }: { manifestRecord: CredentialManifest }): Promise<RecordsCreateResponse> {
    manifestRecord.issuer.id = DcxIssuer.agent.agentDid.uri;
    const { record, status: create } = await DcxIssuer.web5.dwn.records.create({
      store   : true,
      data    : manifestRecord,
      message : {
        schema       : manifestSchema.$id,
        dataFormat   : 'application/json',
        protocol     : issuer.protocol,
        protocolPath : 'manifest',
        published    : true,
      },
    });

    if (DwnUtils.isFailure(create.code)) {
      const { code, detail } = create;
      Logger.error('Failed to create missing manifest record', create);
      throw new DwnError(code, detail);
    }

    if (!record) {
      throw new DcxDwnError(
        `Failed to create missing dwn manifest record: ${manifestRecord.id}`,
      );
    }

    const { status: send } = await record.send();

    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error('Failed to send dwn manifest record', send);
      throw new DwnError(code, detail);
    }

    Logger.debug(`Sent manifest record to remote dwn`, send);
    return { status: send, record };
  }

  /**
   * Create missing manifests
   * @param missingManifests CredentialManifest[]; see {@link CredentialManifest}
   * @returns Record[]; see {@link Record}
   */
  public async createRecords({ records: manifestRecords }: DcxRecordsReadResponse): Promise<DcxRecordsCreateResponse> {
    const records = await Promise.all(
      manifestRecords.map(
        async (manifestRecord: CredentialManifest) =>
          (await this.createManifestRecord({ manifestRecord }))?.record,
      ),
    );
    return { records: records.filter((record?: Record) => record !== undefined) as Record[]};
  }

  /**
   *
   * Process an application record
   * @param record The application record to process
   * @param manifest The credential manifest
   * @returns The status of the application record processing
   */
  public async processRecord({ record, manifest, providerId }: DcxProcessRecordResponse): Promise<DwnResponseStatus> {
    Logger.debug('Processing application record', stringifier(record));

    // Parse the JSON VP from the application record; this will contain the credentials
    const vp: VerifiablePresentation = await record.data.json();
    Logger.debug('Application record verifiable presentation', stringifier(vp));

    // Select valid credentials against the manifest
    const vcJwts = this.selectCredentials(vp, manifest);
    Logger.debug(`Selected ${vcJwts.length} credentials`);

    const recordAuthor = record.author;
    const verified = await this.verifyCredentials(vcJwts, manifest, recordAuthor);
    Logger.debug(`Verified ${verified.length} credentials`);

    // request vc data
    const data = await this.requestCredential({ body: { vcs: verified }, id: providerId });
    Logger.debug('VC data from provider', stringifier(data));

    const vc = await this.issueCredential(data, recordAuthor, manifest);

    const { record: responseRecord, status: create } = await DcxIssuer.web5.dwn.records.create({
      data    : vc,
      store   : true,
      message : {
        schema       : responseSchema.$id,
        protocol     : issuer.protocol,
        dataFormat   : 'application/json',
        protocolPath : 'application/response',
      },
    });

    if (DwnUtils.isFailure(create.code)) {
      const { code, detail } = create;
      Logger.error(`DWN records create failed`, create);
      throw new DwnError(code, detail);
    }

    if (!responseRecord) {
      throw new DcxProtocolHandlerError('Failed to create application response record.');
    }

    const { status: send } = await responseRecord?.send(recordAuthor);
    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error(`DWN records send failed`, send);
      throw new DwnError(code, detail);
    }

    Logger.debug(`Sent application response to applicant DWN`, send, create);

    return { status: send };
  }

  /**
   *
   * Checks the state of the password and recovery phrase
   *
   * @param firstLaunch A boolean indicating if this is the first launch of the agent
   * @returns { password: string, recoveryPhrase?: string }
   * @throws DcxIssuerError
   *
   */
  public async checkWeb5Config(
    firstLaunch: boolean
  ): Promise<{ password: string; recoveryPhrase?: string }> {
    const web5Password = this.dcxConfig.web5Password;
    const web5RecoveryPhrase = this.dcxConfig.web5RecoveryPhrase;

    if (firstLaunch && !(web5Password && web5RecoveryPhrase)) {
      Logger.security(
        'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found on first launch! ' +
          'New WEB5_PASSWORD saved to issuer.password.key file. ' +
          'New WEB5_RECOVERY_PHRASE saved to issuer.recovery.key file.',
      );
      const password = Mnemonic.createPassword();
      await FileSystem.overwrite('issuer.password.key', password);

      const recoveryPhrase = Mnemonic.createRecoveryPhrase();
      await FileSystem.overwrite('issuer.recovery.key', recoveryPhrase);

      this.dcxConfig.web5Password = password;
      this.dcxConfig.web5RecoveryPhrase = recoveryPhrase;
      return { password, recoveryPhrase };
    }

    if (firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxIssuerError(
        'WEB5_RECOVERY_PHRASE found without WEB5_PASSWORD on first launch! ' +
          'WEB5_PASSWORD is required to unlock the vault recovered by WEB5_RECOVERY_PHRASE. ' +
          'Please set WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file.',
      );
    }

    if (!firstLaunch && !(web5Password && web5RecoveryPhrase)) {
      throw new DcxIssuerError(
        'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found on non-first launch! ' +
          'Either set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
          'to create a new password and recovery phrase.',
      );
    }

    if (!firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxIssuerError(
        'WEB5_RECOVERY_PHRASE found without WEB5_PASSWORD on non-first launch! ' +
          'Either set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
          'to create a new recovery phrase with the given password.',
      );
    }

    if (!firstLaunch && web5Password && !web5RecoveryPhrase) {
      Logger.warn(
        'WEB5_PASSWORD found without WEB5_RECOVERY_PHRASE on non-first launch! ' +
          'Attempting to unlock the vault with WEB5_PASSWORD.',
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
     * connecting to the remote DWN and configuring the DWN with the DCX issuer protocol
     *
     */
  public async initializeWeb5(): Promise<void> {
    Logger.log('Initializing Web5 ... ');

    // Create a new DcxIdentityVault instance
    const agentVault = new DcxIdentityVault();
    const dataPath = this.dcxConfig.agentDataPath;

    // Create a new DcxAgent instance
    const agent = await DcxAgent.create({ agentVault, dataPath });

    // Check if this is the first launch of the agent
    const firstLaunch = await agent.firstLaunch();

    // TODO: consider checking if vault is locked
    // const isLocked = agent.vault.isLocked();

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await this.checkWeb5Config(firstLaunch);

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.dcxOptions.dwns!;
    const initializeParams = !recoveryPhrase
      ? { password, dwnEndpoints }
      : { password, dwnEndpoints, recoveryPhrase };

    // Initialize the agent with the options
    // TODO: rethink how im doing this
    if (firstLaunch) {
      await agent.initialize(initializeParams);
    }

    // Start the agent and create a new Web5 instance
    await agent.start({ password });
    // Initialize the Web5 instance
    const web5 = new Web5({ agent, connectedDid: agent.agentDid.uri });

    // Set the DcxManager properties
    DcxIssuer.web5 = web5;
    DcxIssuer.agent = agent;
    DcxIssuer.agentVault = agentVault;

    // Set the server initialized flag
    this.isInitialized = true;
  }

  /**
   * Setup DWN with credential-issuer protocol and manifest records
   * @returns boolean indicating success or failure
   */
  public async setupDwn(): Promise<void> {
    Logger.log('Setting up dcx issuer dwn ...');

    try {
      // Query DWN for credential-issuer protocols
      const { protocols } = await this.queryProtocols();
      Logger.log(`Found ${protocols.length} dcx issuer protocol in dwn`, protocols);

      // Configure DWN with credential-issuer protocol if not found
      if (!protocols.length) {
        Logger.log('Configuring dcx issuer protocol in dwn ...');
        const { status, protocol } = await this.configureProtocols();
        Logger.debug(`Dcx issuer protocol configured: ${status.code} - ${status.detail}`, protocol);
      }

      // Query DWN for manifest records
      const { records: query } = await this.queryRecords();
      Logger.log(`Found ${query.length} manifest records in dcx issuer dwn`);

      // Read manifest records data
      const { records: manifests } = await this.readRecords({ records: query });
      Logger.debug(`Read ${manifests.length} manifest records`, manifests);

      if (!manifests.length) {
      // Create missing manifest records
        const { records } = await this.createRecords({ records: this.dcxOptions.manifests });
        Logger.log(`Created ${records.length} manifest records in dcx issuer dwn`, records);
      } else {
        // Filter and create missing manifest records
        const { records } = await this.filterRecords({ records: manifests });
        Logger.debug(`Found ${records.length} unwritten manifests`);

        const { records: create } = await this.createRecords({ records });
        Logger.log(`Created ${create.length} records`, create);
      }

      Logger.log('Dcx Issuer DWN Setup Complete!');
    } catch (error: any) {
      Logger.error('DWN Setup Failed!', error);
      throw error;
    }
  }
}
