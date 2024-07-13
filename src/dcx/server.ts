import { argv } from "process";

import { Web5PlatformAgent } from '@web5/agent';
import { Record, Web5 } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { generateMnemonic } from 'bip39';
import { exit } from 'process';
import { Config, Objects, ProtocolHandlers } from '../index.js';

import { credentialIssuerProtocol } from '../protocol/index.js';
import {
  CredentialManifest,
  Gateway,
  Handler,
  Issuer,
  Manifest,
  Provider,
  UseGateways,
  UseHandlers,
  UseIssuers,
  UseManifests,
  UseOptions,
  UseProviders,
} from '../types/dcx.js';
import { DcxServerError } from '../utils/error.js';
import { FileSystem } from '../utils/file-system.js';
import { stringifier } from '../utils/json.js';
import { Logger } from '../utils/logger.js';
import { Time } from '../utils/time.js';
import { DwnManager } from './dwn-manager.js';
import { Web5Manager } from './web5-manager.js';

type UsePath = 'manifest' | 'handler' | 'provider' | 'issuer' | 'gateway';
export class DcxServer {
  static [key: string]: any;

  _isPolling: boolean = false;
  _isInitialized: boolean = false;
  _isNewAgent: boolean = argv.slice(2).some(arg => ['--new-agent', '-n'].includes(arg));

  issuers: UseIssuers;
  manifests: UseManifests;
  providers: UseProviders;
  handlers: UseHandlers;
  gateways: UseGateways;

  constructor(options: UseOptions = {}) {

    /**
     * Setup the Web5Manager and the DcxServer with the provided options
     */
    this.issuers = options.issuers ?? new Map<string | number | symbol, Issuer>();
    this.manifests = options.manifests ?? new Map<string | number | symbol, Manifest>();
    this.providers = options.providers ?? new Map<string | number | symbol, Provider>();
    this.handlers = options.handlers ?? new Map<string | number | symbol, Handler>();
    this.gateways = options.gateways ?? new Map<string | number | symbol, Gateway>();
  }

  /**
   *
   * @param path The type of server option; must be one of 'handler', 'providers', 'manifest', or 'issuer'
   * @param id Some unique, accessible identifier to map the obj to
   * @param obj The object to use; see {@link UseOption}
   * @example
   * import { server } from '@formfree/dcx';
   * server.use('issuer', 'mx', { name: 'MX Technologies', id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo' });
   * {
   *  "issuers": Map(1){ "mx" => { "name": "MX Technologies", "id": "did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo" } },
   *  "handlers": Map(1){ "hello" => () => console.log("Hello Web5!") },
   *  "providers": Map(1){ "dev" => { "name": "localhost", "endpoint": "http://localhost:3000" } },
   *  "manifests": Map(1){ "EXAMPLE-MANIFEST" => { "id": "EXAMPLE-MANIFEST", "name": "DCX Credential Manifest Example" ... } }
   * }
   *
   */
  public use(path: UsePath, id: string | number | symbol = 'default', obj: any): void {
    const validPaths = ['issuer', 'manifest', 'provider', 'handler', 'gateway'];
    if (!validPaths.includes(path)) {
      throw new DcxServerError(
        `Invalid server.use() name: ${path}. Must be one of: ${validPaths.join(', ')}`,
      );
    }
    this[`${path}s`].set(id, obj);
  }

  /**
   *
   * Sets the manifest to use
   *
   * @param id Some unique, accessible identifier for the manifest
   * @param manifest The credential manifest to use
   */
  public useManifest(id: string | number | symbol, manifest: CredentialManifest): void {
    this.manifests.set(id, manifest);
  }

  /**
   *
   * @param id Some unique, accessible identifier for the handler
   * @param handler The handler to use
   */
  public useHandler(id: string | number | symbol, handler: Handler): void {
    this.handlers.set(id, handler);
  }

  /**
   *
   * Sets the provider to use
   *
   * @param id Some unique, accessible identifier for the provider
   * @param provider The provider to use
   */
  public useProvider(id: string | number | symbol, provider: Provider): void {
    this.providers.set(id, provider);
  }

  /**
   *
   * Sets the issuer to use
   *
   * @param id Some unique, accessible identifier for the issuer
   * @param issuer The issuer to use
   */
  public useIssuer(id: string | number | symbol, issuer: Issuer): void {
    this.issuers.set(id, issuer);
  }

  /**
   *
   * Creates a new password for the DCX server
   *
   * @returns string
   */
  public async createPassword(): Promise<string> {
    const mnemonic = generateMnemonic(128).split(' ');
    const words: string[] = [];
    for (let i = 0; i < 6; i++) {
      const rand = Math.floor(Math.random() * mnemonic.length);
      words.push(mnemonic[rand]);
    }
    return words.join(' ');
  }

  /**
   * 
   * Checks the state of the password and recovery phrase
   * @param firstLaunch A boolean indicating if this is the first launch of the agent
   * @returns void
   * @throws DcxServerError 
   * 
   * first launch means DATA folder does not exist
   * if no data folder, no password and no recovery phrase, create new password and initialize new agent
   * if no data folder, no password and recovery phrase, throw error bc password is unique to recovery phrase
   * if no data folder, password and no recovery phrase, warn user and provide option to create new agent
   * if no data folder, password and recovery phrase, initialize new agent
   * 
   * if data folder, no password and no recovery phrase, throw error bc password needed to unlock data folder
   * if data folder, no password and recovery phrase, throw error bc password is requried to unlock data folder
   * if data folder, password and no recovery phrase, warn user and attempt data folder unlock with password
   * if data folder, password and recovery phrase, attempt data folder unlock with password
   */
  public async checkWeb5Config(firstLaunch: boolean): Promise<void> {
    const web5Password = Config.WEB5_PASSWORD;
    const web5RecoveryPhrase = Config.WEB5_RECOVERY_PHRASE;
    // If no password and recovery phrase, throw error since password is unique to recovery phrase
    if (!web5Password && web5RecoveryPhrase) {
      // TODO: consider trying to recover, catching the error and prompting the user to change the password
      throw new DcxServerError(
        'WEB5_RECOVERY_PHRASE found without WEB5_PASSWORD! ' +
        'WEB5_PASSWORD is required to unlock the vault recovered by WEB5_RECOVERY_PHRASE. ' +
        'Please set WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file.'
      );
      // If password and no recovery phrase, warn user and provide option to create new agent
    } else if (web5Password && !web5RecoveryPhrase) {
      if (!this._isNewAgent) {
        Logger.warn(
          'WEB5_PASSWORD found without WEB5_RECOVERY_PHRASE! ' +
          'WEB5_PASSWORD is used to unlock the vault recovered by WEB5_RECOVERY_PHRASE. ' +
          'Setting WEB5_PASSWORD without WEB5_RECOVERY_PHRASE will create a new agent locked by WEB5_PASSWORD. ' +
          'If this is intended, please run DCX with flag `--new-agent` to bypass this warning. To recover an existing ' +
          'agent, please set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file.'
        );
        this.stop();
      }
      if (!firstLaunch) {
        throw new DcxServerError(
          'WEB5_PASSWORD found without WEB5_RECOVERY_PHRASE on non-first launch! ' +
          'Either set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
          'to create a new agent.'
        )
      }
    } else if (!(web5Password && web5RecoveryPhrase)) {
      if (!firstLaunch) {
        throw new DcxServerError(
          'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found on non-first launch! ' +
          'Either set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
          'to create a new agent.'
        )
      }
      // Notify the user, create a new password and save it to password.key
      Logger.security(
        'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found! ' +
        'New WEB5_PASSWORD saved to password.key file. ' +
        'New WEB5_RECOVERY_PHRASE saved to recovery.key file.'
      );
      const password = await this.createPassword();
      await FileSystem.overwrite('password.key', password);
      Config.WEB5_PASSWORD = password;
    }
  }

  /**
   *
   * Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
   *
   */
  public async initialize(): Promise<void> {
    const web5Password = Config.WEB5_PASSWORD;
    const web5RecoveryPhrase = Config.WEB5_RECOVERY_PHRASE;
    Logger.debug('Initializing Web5 ... ');

    // Create a new Web5UserAgent instance
    const agent = await Web5UserAgent.create();

    // Check if this is the first launch of the agent
    const noDataFolder = await agent.firstLaunch()
    /**
     * first launch means DATA folder does not exist
     * 
     * if no data folder
     *      and no password
     *            and no recovery phrase, create new password and initialize new agent
     *            and recovery phrase, throw error bc password is unique to recovery phrase
     *      and password
     *            and no recovery phrase, warn user and provide option to create new agent
     *            and recovery phrase, initialize new agent
     * 
     * if data folder
     *      and no password
     *            and no recovery phrase, throw error bc password needed to unlock data folder
     *            and recovery phrase, throw error bc password is requried to unlock data folder
     *      and password
     *            and no recovery phrase, warn user and attempt data folder unlock with password
     *            and recovery phrase, attempt data folder unlock with password
     */


    if (noDataFolder && !web5Password && !web5RecoveryPhrase) {
      Logger.warn('First launch detected! Creating new agent ...');

      if (!web5Password && web5RecoveryPhrase) {
        // TODO: consider trying to recover, catching the error and prompting the user to change the password
        throw new DcxServerError(
          'WEB5_RECOVERY_PHRASE found without WEB5_PASSWORD! ' +
          'WEB5_PASSWORD is required to unlock the vault recovered by WEB5_RECOVERY_PHRASE. ' +
          'Please set WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file.'
        );
        // If password and no recovery phrase, warn user and provide option to create new agent
      } else if (web5Password && !web5RecoveryPhrase) {
        if (!this._isNewAgent) {
          Logger.warn(
            'WEB5_PASSWORD found without WEB5_RECOVERY_PHRASE! ' +
            'WEB5_PASSWORD is used to unlock the vault recovered by WEB5_RECOVERY_PHRASE. ' +
            'Setting WEB5_PASSWORD without WEB5_RECOVERY_PHRASE will create a new agent locked by WEB5_PASSWORD. ' +
            'If this is intended, please run DCX with flag `--new-agent` to bypass this warning. To recover an existing ' +
            'agent, please set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file.'
          );
          this.stop();
        }
        if (!noDataFolder) {
          throw new DcxServerError(
            'WEB5_PASSWORD found without WEB5_RECOVERY_PHRASE on non-first launch! ' +
            'Either set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
            'to create a new agent.'
          )
        }
      } else if (!(web5Password && web5RecoveryPhrase)) {
        if (!noDataFolder) {
          throw new DcxServerError(
            'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found on non-first launch! ' +
            'Either set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
            'to create a new agent.'
          )
        }
        // Notify the user, create a new password and save it to password.key
        Logger.security(
          'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found! ' +
          'New WEB5_PASSWORD saved to password.key file. ' +
          'New WEB5_RECOVERY_PHRASE saved to recovery.key file.'
        );
        const password = await this.createPassword();
        await FileSystem.overwrite('password.key', password);
        Config.WEB5_PASSWORD = password;
      }
    } else {

    }

    // Check if the vault is locked
    // const isLocked = agent.vault.isLocked();

    // Check the state of the password and recovery phrase
    // If both password and recovery phrase exist, continue with server initialize
    // Note: the password must be correct for the given recovery phrase
    await this.checkWeb5Config(firstLaunch);

    // Check if this is the first launch of the agent
    if (firstLaunch) {
      // Initialize the agent, set the environment variable and save the recovery phrase
      Config.WEB5_RECOVERY_PHRASE = await agent.initialize({
        password: Config.WEB5_PASSWORD,
        recoveryPhrase: Config.WEB5_RECOVERY_PHRASE
      });
      await FileSystem.overwrite('recovery.key', Config.WEB5_RECOVERY_PHRASE);
    }

    // Start the agent and create a new Web5 instance
    await agent.start({ password: Config.WEB5_PASSWORD });
    const web5 = new Web5({ agent, connectedDid: agent.agentDid.uri });

    // Set the Web5Manager properties
    Web5Manager.web5 = web5;
    Web5Manager.agent = agent as Web5PlatformAgent;

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

    const DWN_CURSOR = Config.DWN_CURSOR;
    const DWN_LAST_RECORD_ID = Config.DWN_LAST_RECORD_ID;

    let cursor = await FileSystem.readToJson(DWN_CURSOR);
    const pagination = Objects.isEmptyObject(cursor) ? {} : { cursor };
    let lastRecordId = await FileSystem.readToString(DWN_LAST_RECORD_ID);

    while (this._isPolling) {
      const { records = [], cursor: nextCursor } = await Web5Manager.web5.dwn.records.query({
        message: {
          filter: {
            protocol: credentialIssuerProtocol.protocol,
          },
          pagination,
        },
      });

      Logger.debug(`Found ${records.length} records`);
      Logger.debug(`Next cursor ${stringifier(nextCursor)}`);

      if (cursor && !records.length) {
        cursor = undefined;
      }

      const recordIds = records.map((record: { id: any }) => record.id);

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

      for (const record of recordReads) {
        if (record.id != lastRecordId) {
          if (record.protocolPath === 'application') {
            const manifest = Object.values(this.manifests).find(
              (manifest: CredentialManifest) =>
                manifest.presentation_definition.id === record.schema,
            );

            if (!!manifest) {
              await ProtocolHandlers.processApplicationRecord(record, manifest);
            } else {
              Logger.debug(`Skipped message with protocol path ${record.protocolPath}`);
            }

            lastRecordId = record.id;
            const overwritten = await FileSystem.overwrite(DWN_LAST_RECORD_ID, lastRecordId);
            Logger.debug(`Overwritten last record id ${overwritten}`, lastRecordId);
          }
        } else {
          await Time.sleep();
        }
      }

      if (nextCursor) {
        Logger.debug('Updated cursor for next query', nextCursor);
        cursor = nextCursor;
        const overwritten = await FileSystem.overwrite(DWN_CURSOR, cursor);
        Logger.debug(`${DWN_CURSOR} overwritten ${overwritten}`, cursor);
      }

      if (!recordReads.length) {
        Logger.debug('No records found!', recordReads.length);
        await Time.sleep();
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
        await DwnManager.setup();
      }

      this._isPolling = true;
      await this.poll();
    } catch (error: any) {
      Logger.error(error);
      this.stop();
    }
  }
}

const server = new DcxServer({});
export { server };

export default DcxServer;
