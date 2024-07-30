import {
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
  ServerOptions,
  stringifier,
  Time
} from '@dcx-protocol/common';
import { DwnRegistrar, IdentityVaultParams } from '@web5/agent';
import { Record, Web5 } from '@web5/api';
import { argv, exit } from 'process';
import { IssuerProtocolHandlers, IssuerConfig, issuerConfig, issuer, Web5Manager } from './index.js';

type UsePath = 'manifests' | 'handlers' | 'providers' | 'issuers' | 'gateways' | 'dwns';
type IssuerServerParams = { options?: ServerOptions; config?: IssuerConfig };

export default class IssuerServer {
  useOptions: ServerOptions = {
    handlers  : [],
    providers : [],
    manifests : [issuerConfig.DCX_HANDSHAKE_MANIFEST],
    issuers   : issuerConfig.DCX_INPUT_ISSUERS,
    gateways  : issuerConfig.ISSUER_GATEWAY_URIS,
    dwns      : issuerConfig.ISSUER_DWN_ENDPOINTS,
  };

  _isPolling: boolean = false;
  _isInitialized: boolean = false;
  _isSetup: boolean = false;
  _isTest: boolean = issuerConfig.DCX_ENV.includes('test') || argv.slice(2).some((arg) => ['--test', '-t'].includes(arg));

  constructor(params: IssuerServerParams = { options: this.useOptions, config: issuerConfig }) {
    /**
     *
     * Setup the DcxManager and the DcxServer with the provided options
     *
     * @param options The options to use for the DcxServer
     * @param options.issuers The issuers to use; array
     * @param options.manifests The manifests to use; array
     * @param options.providers The providers to use; array
     * @param options.handlers The handlers to use; array
     * @param options.dwns The dwns to use; array
     * @param options.gateways The gateways to use; array
     * @example see README.md for usage information
     *
     */
    this.useOptions.manifests = params?.options?.manifests  ?? this.useOptions.manifests;
    this.useOptions.issuers   = params?.options?.issuers    ?? this.useOptions.issuers;
    this.useOptions.gateways  = params?.options?.gateways   ?? this.useOptions.gateways;
    this.useOptions.dwns      = params?.options?.dwns       ?? this.useOptions.dwns;
    this.useOptions.providers = params?.options?.providers  ?? this.useOptions.providers;
    this.useOptions.handlers  = params?.options?.handlers   ?? this.useOptions.handlers;
  }

  /**
   *
   * Sets the server options
   *
   * @param path The type of server option; must be one of 'handler', 'providers', 'manifest', or 'issuer'
   * @param id Some unique, accessible identifier to map the obj to
   * @param obj The object to use; see {@link ServerOptions}
   * @example see README.md for usage information
   *
   */
  public use(path: UsePath, obj: any): void {
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
    this.useOptions.manifests!.push(manifest);
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
    this.useOptions.handlers!.push(handler);
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
    this.useOptions.providers!.push(provider);
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
    this.useOptions.issuers!.push(issuer);
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
    this.useOptions.dwns!.push(dwn);
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
    if (!this.useOptions.gateways || !this.useOptions.gateways.length) {
      this.useOptions.gateways = [];
    }
    this.useOptions.gateways.push(gateway);
  }

  public static async createVaultAgent(params: IdentityVaultParams = {}): Promise<{ agent: DcxAgent; agentVault: DcxIdentityVault }> {
    // Create a new DcxIdentityVault instance, a new DcxAgent instance and return them
    const agentVault = new DcxIdentityVault(params);
    const agent = await DcxAgent.create({ agentVault });
    return { agentVault, agent };
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
    const web5Password = issuerConfig.ISSUER_WEB5_PASSWORD;
    const web5RecoveryPhrase = issuerConfig.ISSUER_WEB5_RECOVERY_PHRASE;

    // TODO: consider generating a new recovery phrase if one is not provided
    // Config.WEB5_RECOVERY_PHRASE = generateMnemonic(128);

    if (firstLaunch && !(web5Password && web5RecoveryPhrase)) {
      Logger.security(
        'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found on first launch! ' +
        'New WEB5_PASSWORD saved to password.issuer.key file. ' +
        'New WEB5_RECOVERY_PHRASE saved to recovery.issuer.key file.',
      );
      const password = Mnemonic.createPassword();
      await FileSystem.overwrite('password.issuer.key', password);
      const recoveryPhrase = Mnemonic.createRecoveryPhrase();
      await FileSystem.overwrite('recovery.issuer.key', recoveryPhrase);
      issuerConfig.ISSUER_WEB5_PASSWORD = password;
      issuerConfig.ISSUER_WEB5_RECOVERY_PHRASE = recoveryPhrase;
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
   * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
   *
   */
  public async initialize(): Promise<void> {
    Logger.debug('Initializing Web5 ... ');

    // Create a new DcxIdentityVault instance and a new DcxAgent instance
    const { agent, agentVault } = await IssuerServer.createVaultAgent();

    // Check if this is the first launch of the agent
    const firstLaunch = await agent.firstLaunch();

    // TODO: consider checking if vault is locked
    // const isLocked = agent.vault.isLocked();

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await this.checkWeb5Config(firstLaunch);

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = !this.useOptions.dwns || !this.useOptions.dwns.length
      ? issuerConfig.ISSUER_DWN_ENDPOINTS
      : [...this.useOptions.dwns, ...issuerConfig.ISSUER_DWN_ENDPOINTS];

    const startParams = { password };
    const initializeParams = !recoveryPhrase
      ? { ...startParams, dwnEndpoints }
      : { ...startParams, recoveryPhrase, dwnEndpoints };

    // Initialize the agent with the options
    if (firstLaunch) {
      issuerConfig.ISSUER_WEB5_RECOVERY_PHRASE = await agent.initialize(initializeParams);
      await FileSystem.overwrite('recovery.issuer.key', issuerConfig.ISSUER_WEB5_RECOVERY_PHRASE);
    }

    // Start the agent and create a new Web5 instance
    await agent.start(startParams);
    const web5 = new Web5({ agent, connectedDid: agent.agentDid.uri });

    await DwnRegistrar.registerTenant(dwnEndpoints[0], agent.agentDid.uri);

    // Set the Web5Manager properties
    Web5Manager.web5 = web5;
    Web5Manager.issuerAgent = agent;
    Web5Manager.issuerAgentVault = agentVault;

    // Set the server initialized flag
    this._isInitialized = true;
  }

  /**
   *
   * Polls the DWN for incoming records
   *
   */
  public async poll(): Promise<void> {
    Logger.debug('DCX server starting ...');

    const CURSOR = issuerConfig.ISSUER_CURSOR;
    const LAST_RECORD_ID = issuerConfig.ISSUER_LAST_RECORD_ID;

    let cursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(cursor) ? {} : { cursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this._isPolling) {
      const { records = [], cursor: nextCursor } = await Web5Manager.web5.dwn.records.query({
        message: {
          filter: {
            protocol: issuer.protocol,
          },
          pagination,
        },
      });

      Logger.debug(`Found ${records.length} records`);
      if (nextCursor) {
        Logger.debug(`Next cursor update for next query`, stringifier(nextCursor));
        cursor = nextCursor;
        const overwritten = await FileSystem.overwrite(CURSOR, cursor);
        Logger.debug(`${CURSOR} overwritten ${overwritten}`, cursor);
      } else {
        Logger.debug(`Next cursor not found!`);
      }

      if (cursor && !records.length) {
        cursor = undefined;
      }

      const recordIds = records.map((record: Record) => record.id);

      const recordReads: Record[] = await Promise.all(
        recordIds.map(async (recordId: string) => {
          const { record }: { record: Record } = await Web5Manager.web5.dwn.records.read({
            message: {
              filter: {
                recordId,
              },
            },
          });
          return record;
        }),
      );

      Logger.debug(`Read ${recordReads.length} records`);

      if (!recordReads.length) {
        Logger.debug('No records found!', recordReads.length);
        if (this._isTest) {
          Logger.debug('Test Complete! Stopping DCX server ...');
          this.stop();
        }
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
              await IssuerProtocolHandlers.processApplicationRecord(
                record,
                manifest,
                manifest.output_descriptors[0].id,
              );
            } else {
              Logger.debug(`Skipped message with protocol path ${record.protocolPath}`);
            }

            lastRecordId = record.id;
            const overwritten = await FileSystem.overwrite(LAST_RECORD_ID, lastRecordId);
            Logger.debug(`Overwritten last record id ${overwritten}`, lastRecordId);
          }
        } else {
          await Time.sleep();
        }
      }
    }
  }

  /**
   *
   * Stops the DCX server
   * @returns void
   */
  public stop(): void {
    Logger.debug('DCX server stopping...');
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
        Logger.debug('Web5 initialized', this._isInitialized);
        await Web5Manager.setup();
      }

      this._isPolling = true;
      await this.poll();
    } catch (error: unknown) {
      Logger.error(error);
      this.stop();
    }
  }
}

export const server = new IssuerServer();