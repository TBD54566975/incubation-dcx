import {
  config as dcxConfig,
  CredentialManifest,
  DcxAgent,
  DcxIdentityVault,
  DcxServerError,
  FileSystem,
  Issuer,
  Logger,
  Mnemonic,
  Objects,
  Provider,
  ServerHandler,
  DcxOptions,
  ServerPath,
  stringifier,
  Time
} from '@dcx-protocol/common';
import { Record, Web5 } from '@web5/api';
import { argv, exit } from 'process';
import {
  issuer,
  IssuerConfig,
  issuerConfig,
  IssuerHandlers,
  IssuerManager
} from './index.js';

type IssuerServerParams = { options?: DcxOptions; config?: IssuerConfig };

export class IssuerServer {
  config         : IssuerConfig;
  useOptions     : DcxOptions;
  _isPolling     : boolean = false;
  _isInitialized : boolean = false;
  _isSetup       : boolean = false;
  _isTest        : boolean = dcxConfig.DCX_ENV.includes('test') || argv.slice(2).some((arg) => ['--test', '-t'].includes(arg));

  /**
   *
   * Setup the server with the provided options and config
   *
   * @param params.options The options to use for the DcxServer
   * @param params.options.issuers The issuers to use; array
   * @param params.options.manifests The manifests to use; array
   * @param params.options.providers The providers to use; array
   * @param params.options.handlers The handlers to use; array
   * @param params.options.dwns The dwns to use; array
   * @param params.options.gateways The gateways to use; array
   * @example see README.md for usage information
   *
   */
  constructor(params: IssuerServerParams = {}) {
    this.config = params.config ?? issuerConfig;
    this.useOptions = params.options ?? {
      handlers  : [],
      providers : [],
      manifests : [this.config.DCX_HANDSHAKE_MANIFEST],
      issuers   : this.config.DCX_INPUT_ISSUERS,
      gateways  : this.config.gatewayUris,
      dwns      : this.config.dwnEndpoints,
    };
  }

  public static create(): IssuerServer {
    return new IssuerServer();
  }

  /**
   *
   * Sets the server options
   *
   * @param path The type of server option; see {@link ServerPath}
   * @param id Some unique, accessible identifier to map the obj to
   * @param obj The object to use; see {@link DcxOptions}
   * @example see README.md for usage information
   *
   */
  public use(path: ServerPath, obj: any): void {
    const validPaths = ['gateways', 'dwns', 'issuers', 'manifests', 'providers', 'handlers'];
    if (!validPaths.includes(path)) {
      throw new DcxServerError(
        `Invalid server.use() name: ${path}. Must be one of: ${validPaths.join(', ')}`,
      );
    }
    if (validPaths.includes(path)) {
      this.useOptions[path].push(obj);
    } else {
      throw new DcxServerError(`Invalid server.use() object: ${obj}`);
    }
  }

  /**
   *
   * Sets the manifest to use
   *
   * @param id Some unique, accessible identifier for the manifest
   * @param manifest The credential manifest to use
   * @example see README.md for usage information
   *
   */
  public useManifest(manifest: CredentialManifest): void {
    this.useOptions.manifests.push(manifest);
  }

  /**
   *
   * Sets the handler to use
   *
   * @param id Some unique, accessible identifier for the handler
   * @param handler The handler to use
   * @example see README.md for usage information
   *
   */
  public useHandler(handler: ServerHandler): void {
    this.useOptions.handlers.push(handler);
  }

  /**
   *
   * Sets the provider to use
   *
   * @param id Some unique, accessible identifier for the provider
   * @param provider The provider to use
   * @example see README.md for usage information
   *
   */
  public useProvider(provider: Provider): void {
    this.useOptions.providers.push(provider);
  }

  /**
   *
   * Sets the issuer to use
   *
   * @param id Some unique, accessible identifier for the issuer
   * @param issuer The issuer to use
   * @example see README.md for usage information
   *
   */
  public useIssuer(issuer: Issuer): void {
    this.useOptions.issuers.push(issuer);
  }

  /**
   *
   * Sets the dwns to use
   *
   * @param dwn The dwn to use
   * @example see README.md for usage information
   *
   */
  public useDwn(dwn: string): void {
    this.useOptions.dwns.push(dwn);
  }

  /**
   *
   * Sets the gateways to use
   *
   * @param gateway The gateway to use'
   * @example see README.md for usage information
   *
   */
  public useGateway(gateway: string): void {
    this.useOptions.gateways.push(gateway);
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
    firstLaunch: boolean
  ): Promise<{ password: string; recoveryPhrase?: string }> {
    const web5Password = this.config.web5Password;
    const web5RecoveryPhrase = this.config.web5RecoveryPhrase;

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

      this.config.web5Password = password;
      this.config.web5RecoveryPhrase = recoveryPhrase;
      return { password, recoveryPhrase };
    }

    if (firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxServerError(
        'WEB5_RECOVERY_PHRASE found without WEB5_PASSWORD on first launch! ' +
        'WEB5_PASSWORD is required to unlock the vault recovered by WEB5_RECOVERY_PHRASE. ' +
        'Please set WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file.',
      );
    }

    if (!firstLaunch && !(web5Password && web5RecoveryPhrase)) {
      throw new DcxServerError(
        'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found on non-first launch! ' +
        'Either set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
        'to create a new password and recovery phrase.',
      );
    }

    if (!firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxServerError(
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
  public async initialize(): Promise<void> {
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
    const dwnEndpoints = this.useOptions.dwns!;
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
    IssuerManager.web5 = web5;
    IssuerManager.agent = agent;
    IssuerManager.agentVault = agentVault;
    IssuerManager.serverOptions = this.useOptions;

    // Set the server initialized flag
    this._isInitialized = true;
  }

  /**
   *
   * Polls the DWN for incoming records
   *
   */
  public async poll(): Promise<void> {
    this._isPolling = true;
    Logger.log('DCX server starting ...');

    const CURSOR = this.config.cursorFile;
    const LAST_RECORD_ID = this.config.lastRecordIdFile;

    let cursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(cursor) ? {} : { cursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this._isPolling) {
      const { records = [], cursor: nextCursor } = await IssuerManager.web5.dwn.records.query({
        message: {
          pagination,
          filter: { protocol: issuer.protocol },
        },
      });

      Logger.log(`Found ${records.length} records`);
      if (nextCursor) {
        Logger.log(`Next cursor update for next query`, stringifier(nextCursor));
        cursor = nextCursor;
        const overwritten = await FileSystem.overwrite(CURSOR, cursor);
        Logger.log(`${CURSOR} overwritten ${overwritten}`, cursor);
      } else {
        Logger.log(`Next cursor not found!`);
      }

      if (cursor && !records.length) {
        cursor = undefined;
      }

      const recordIds = records.map((record: Record) => record.id);

      const recordReads: Record[] = await Promise.all(
        recordIds.map(async (recordId: string) => {
          const { record }: { record: Record } = await IssuerManager.web5.dwn.records.read({
            message: {
              filter: {
                recordId,
              },
            },
          });
          return record;
        }),
      );

      Logger.log(`Read ${recordReads.length} records`);

      if (this._isTest) {
        Logger.log('Test Complete! Stopping DCX server ...');
        this.stop();
      }

      if (!recordReads.length) {
        Logger.log('No records found!', recordReads.length);
        await Time.sleep();
      }

      for (const record of recordReads) {
        if (record.id != lastRecordId) {
          if (record.protocolPath === 'application') {
            const manifest = this.useOptions.manifests!.find(
              (manifest: CredentialManifest) =>
                manifest.presentation_definition.id === record.schema,
            );

            if (manifest) {
              const { status } = await IssuerHandlers.processApplicationRecord(
                record,
                manifest,
                manifest.output_descriptors[0].id,
              );
              Logger.debug(`Processed application id ${record.id}`, status);
            } else {
              Logger.log(`Skipped message with protocol path ${record.protocolPath}`);
            }

            lastRecordId = record.id;
            const overwritten = await FileSystem.overwrite(LAST_RECORD_ID, lastRecordId);
            Logger.log(`Overwritten last record id: ${overwritten}`, lastRecordId);
          }
        } else {
          await Time.sleep();
        }
      }
    }
  }

  public async setupDwn(): Promise<void> {
    await IssuerManager.setup();
    this._isSetup = true;
  }

  /**
   *
   * Stops the DCX server
   * @returns void
   */
  public stop(): void {
    Logger.log('DCX server stopping...');
    this._isPolling = false;
    exit(0);
  }

  /**
   *
   * Starts the DCX server
   * @returns void
   */
  public async start(): Promise<void> {
    try {
      if (!this._isInitialized) {
        await this.initialize();
        Logger.log('Web5 initialized', this._isInitialized);
        await this.setupDwn();
      }
      await this.poll();
    } catch (error: any) {
      Logger.error(error);
      this.stop();
    }
  }
}