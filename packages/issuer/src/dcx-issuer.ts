import {
  CredentialManifest,
  DcxAgent,
  DcxAgentRecovery,
  DcxConfig,
  dcxConfig,
  DcxDwnError,
  DcxIdentityVault,
  DcxIssuerProcessRecordParams,
  DcxManager,
  dcxOptions,
  DcxOptions,
  DcxParams,
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
  Objects,
  Provider,
  RecordsParams,
  RequestCredentialParams,
  responseSchema,
  ServerHandler,
  stringifier
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
import { issuer } from './index.js';

type VerifyCredentialsParams = {
  vcJwts: string[];
  manifest: CredentialManifest;
  subjectDid: string;
}
type SelectCredentialsParams = {
  vp: VerifiablePresentation;
  manifest: CredentialManifest;
}
type CreateCredentialParams = {
  data: any,
  subjectDid: string,
  manifest: CredentialManifest,
}
type Fulfillment = {
  fulfillment: {
    descriptor_map: DescriptorMap;
  }
}
type DescriptorMap = {
  id?: string;
  format?: string;
  path?: string;
}
type DcxVerifiableCredentialData = {
  vcJwts?: string[];
  id?: string;
  format?: string;
  path?: string;
};
type DcxVerifiableCredentialType = {
  verifiableCredential: string[];
  fulfillment: Fulfillment
};
type IssueCredentialParams = {
  vc: DcxVerifiableCredentialType,
  subjectDid: string
};
class DcxVerifiableCredential {
  constructor({
    vcJwts,
    id,
    format,
    path
  }: DcxVerifiableCredentialData = {
    format : 'jwt_vc',
    path   : '$.verifiableCredential[0]'
  }) {

    return {
      verifiableCredential : vcJwts,
      fulfillment          : {
        descriptor_map : [
          {
            id,
            format,
            path,
          },
        ],
      },
    };
  }
}
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
 * issuer.initializeWeb5();
 * issuer.setupDwn();
 */
export class DcxIssuer implements DcxManager {
  options : DcxOptions;
  config  : DcxConfig = dcxConfig;

  isSetup       : boolean = false;
  isInitialized : boolean = false;

  public static web5       : Web5;
  public static agent      : DcxAgent;
  public static agentVault : DcxIdentityVault = new DcxIdentityVault();

  constructor(params: DcxParams) {
    this.options = params.options ?? dcxOptions;
    this.config = params.config ?? this.config;

    /**
     * Set the default handlers if none are provided
     */
    if(!this.options.handlers || this.options.handlers.length === 0) {
      dcxOptions.handlers = [
        { id: 'selectCredentials', handler: this.selectCredentials },
        { id: 'verifyCredentials', handler: this.verifyCredentials },
        { id: 'requestCredentialData', handler: this.requestCredentialData },
        { id: 'createCredential', handler: this.createCredential },
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
  public findHandler(id: string, staticHandler: Handler): Handler {
    return this.options.handlers.find((serverHandler: ServerHandler) => serverHandler.id === id)?.handler ?? staticHandler ?? this.options.handlers.push({ id, handler: staticHandler });
  }

  /**
   *
   * Verify the credentials in a Verifiable Presentation
   * @param vcs The selected credentials to verify
   * @param subjectDid The DID of the subject of the credentials
   * @returns An array of verified credentials
   */
  public async verifyCredentials({ vcJwts, manifest, subjectDid }: VerifyCredentialsParams): Promise<VerifiableCredential[]> {
    try {
      PresentationExchange.satisfiesPresentationDefinition({
        vcJwts,
        presentationDefinition : manifest.presentation_definition,
      });
    } catch (error) {
      console.log('VC does not satisfy Presentation Definition: ' + error);
    }
    const verifiedCredentials: VerifiableCredential[] = [];

    for (const vcJwt of vcJwts) {
      Logger.debug('Parsing credential ...', vcJwt);

      const vc = VerifiableCredential.parseJwt({ vcJwt });
      Logger.debug('Parsed credential', stringifier(vc));

      if (vc.subject !== subjectDid) {
        Logger.debug(`Credential subject ${vc.subject} doesn't match subjectDid ${subjectDid}`);
        continue;
      }

      const issuers = [...this.options.issuers, ...this.config.issuers].map((issuer: Issuer) => issuer.id);
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
  public selectCredentials({ vp, manifest }: SelectCredentialsParams): string[] {
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
  public async createCredential({ data, subjectDid, manifest }: CreateCredentialParams): Promise<any> {
    const manifestOutputDescriptor = manifest.output_descriptors[0];
    Logger.debug(`Issuing ${manifestOutputDescriptor.id} credential`);

    const vc = await VerifiableCredential.create({
      data,
      subject : subjectDid,
      issuer  : DcxIssuer.agent.agentDid.uri,
      type    : manifestOutputDescriptor.name,
    });
    Logger.debug(`Created ${manifestOutputDescriptor.id} credential`, stringifier(vc));

    const signedVc = await vc.sign({ did: DcxIssuer.agent.agentDid });
    Logger.debug(`Signed ${manifestOutputDescriptor.id} credential`, stringifier(signedVc));

    return new DcxVerifiableCredential({
      vcJwts : [signedVc],
      id     : manifestOutputDescriptor.id
    });
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
    const provider = this.options.providers.find((provider: Provider) => provider.id === params?.id);

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

  public async issueCredential({ vc, subjectDid }: IssueCredentialParams): Promise<DwnResponseStatus> {
    const { record, status } = await DcxIssuer.web5.dwn.records.create({
      store   : true,
      data    : {
        ...vc,
        id                   : '',
        spec_version         : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
        manifest_id          : ''
      },
      message : {
        schema       : responseSchema.$id,
        protocol     : issuer.protocol,
        dataFormat   : 'application/json',
        protocolPath : 'application/response',
      },
    });

    if (DwnUtils.isFailure(status.code)) {
      const { code, detail } = status;
      Logger.error(`DWN records create failed`, status);
      throw new DwnError(code, detail);
    }

    if (!record) {
      throw new DcxProtocolHandlerError('Failed to create application response record.');
    }

    const { status: send } = await record?.send(subjectDid);
    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error(`DWN records send failed`, send);
      throw new DwnError(code, detail);
    }

    Logger.debug(`Sent application response to applicant DWN`, send, status);

    return { status: send };
  }

  /**
   * Query DWN for dcx issuer protocols
   *
   * @returns Protocol[]; see {@link Protocol}
   */
  public async queryProtocols(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-issuer protocol
    const { status: query, protocols = [] } = await DcxIssuer.web5.dwn.protocols.query({
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
    const { status: configure, protocol } = await DcxIssuer.web5.dwn.protocols.configure({
      message : { definition: issuer },
    });

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
   *
   * @returns Record[]; see {@link Record}
   */
  public async queryRecords(): Promise<DcxRecordsQueryResponse> {
    const { status, records = [], cursor } = await DcxIssuer.web5.dwn.records.query({
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
   * @returns a list of records that have been read into json; see {@link DcxRecordsReadResponse}
   */
  public async readRecords({ records: manifestRecords }: RecordsParams): Promise<DcxRecordsReadResponse> {
    const records = await Promise.all(
      manifestRecords.map(async (manifestRecord: Record) => {
        const { record } = await DcxIssuer.web5.dwn.records.read({
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
   * Filter manifests passed to to options against manifest record
   * reads in dwn to find missing manifests; See {@link CredentialManifest}
   *
   * @param params.records list of CredentialManifest objects; see {@link ManifestParams}
   * @returns list of CredentialManifest objects that need writing to remote DWN
   */
  public async filterRecords({ records: manifestRecords }: ManifestParams): Promise<DcxRecordsFilterResponse> {
    const records = this.options.manifests.filter((manifest: CredentialManifest) =>
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
  public async createRecords({ records: manifestRecords }: DcxRecordsCreateResponse): Promise<DcxRecordsCreateResponse> {
    const records = await Promise.all(
      manifestRecords.map(
        async (manifestRecord: CredentialManifest) =>
          (await this.createManifestRecord({ manifestRecord }))?.record,
      ),
    );
    return { records };
  }

  /**
   *
   * Process an application record
   * @param record The application record to process
   * @param manifest The credential manifest
   * @returns The status of the application record processing
   */
  public async processRecord({ record, manifest, providerId }: DcxIssuerProcessRecordParams): Promise<DwnResponseStatus> {
    Logger.debug('Processing application record', stringifier(record));

    // Parse the JSON VP from the application record; this will contain the credentials
    const vp: VerifiablePresentation = await record.data.json();
    Logger.debug('Application record verifiable presentation', stringifier(vp));

    // Select valid credentials against the manifest
    const vcJwts = this.selectCredentials({ vp, manifest });
    Logger.debug(`Selected ${vcJwts.length} credentials`);

    const subjectDid = record.author;
    const verified = await this.verifyCredentials({ vcJwts, manifest, subjectDid });
    Logger.debug(`Verified ${verified.length} credentials`);

    // request vc data
    const data = await this.requestCredentialData({ body: { vcs: verified }, id: providerId });
    Logger.debug('VC data from provider', stringifier(data));

    const vc = await this.createCredential({ data, subjectDid, manifest });

    const { status } = await this.issueCredential({vc, subjectDid});

    return { status };
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
        const { records } = await this.createRecords({ records: this.options.manifests });
        Logger.log(`Created ${records.length} manifest records in dcx issuer dwn`, records);
      } else {
        // Filter and create missing manifest records
        const { records } = await this.filterRecords({ records: manifests });
        Logger.debug(`Found ${records.length} unwritten manifests`);

        const { records: create } = await this.createRecords({ records });
        Logger.log(`Created ${create.length} records`, create);
      }

      Logger.log('Dcx Issuer DWN Setup Complete!');
      this.isSetup = true;
    } catch (error: any) {
      Logger.error('DWN Setup Failed!', error);
      throw error;
    }
  }


  /**
   * Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX issuer protocol
   */
  public async initializeWeb5(): Promise<void> {
    const issuerConfig = this.config.issuerProtocol;
    Logger.log('Initializing Web5 for DcxIssuer ... ');

    // Create a new DcxAgent instance
    const agent = await DcxAgent.create({
      agentVault : DcxIssuer.agentVault,
      dataPath   : issuerConfig.agentDataPath
    });

    // Check if this is the first launch of the agent
    const firstLaunch = await agent.firstLaunch();

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await DcxAgentRecovery.validate({
      firstLaunch,
      type           : 'issuer',
      password       : issuerConfig.web5Password,
      recoveryPhrase : issuerConfig.web5RecoveryPhrase,
    });

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.options.dwns;
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
    const web5 = new Web5({ agent, connectedDid: agent.agentDid.uri });

    // Set the DcxManager properties
    DcxIssuer.web5 = web5;
    DcxIssuer.agent = agent;

    // Set the server initialized flag
    this.isInitialized = true;
  }

}
