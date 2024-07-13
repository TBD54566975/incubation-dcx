import { argv } from "process";
import { exit } from 'process';
import { generateMnemonic } from 'bip39';
import { Record, Web5 } from '@web5/api';

import {
  CredentialManifest,
  Dwn,
  Gateway,
  Handler,
  Issuer,
  Manifest,
  Provider,
  UseDwns,
  UseGateways,
  UseHandlers,
  UseIssuers,
  UseManifests,
  UseOptions,
  UseProviders,
} from '../types/dcx.js';
import { Config, Objects, ProtocolHandlers } from '../index.js';
import { credentialIssuerProtocol } from '../protocol/index.js';
import { DcxServerError } from '../utils/error.js';
import { FileSystem } from '../utils/file-system.js';
import { stringifier } from '../utils/json.js';
import { Logger } from '../utils/logger.js';
import { Time } from '../utils/time.js';
import { DcxAgent } from "./agent.js";
import { DwnManager } from './dwn-manager.js';
import { DcxIdentityVault } from "./identity-vault.js";
import { DcxManager } from './manager.js';

type UsePath = 'manifest' | 'handler' | 'provider' | 'issuer' | 'gateway' | 'dwn';
export class DcxServer {
  static [key: string]: any;

  _isPolling: boolean = false;
  _isInitialized: boolean = false;
  _isNewAgent: boolean = argv.slice(2).some(arg => ['--new-agent', '-n'].includes(arg));

  issuers: UseIssuers;
  manifests: UseManifests;
  providers: UseProviders;
  handlers: UseHandlers;
  dwns: UseDwns;
  gateways: UseGateways;

  constructor(options: UseOptions = {}) {

    /**
     * 
     * Setup the DcxManager and the DcxServer with the provided options
     * 
     * @param options The options to use for the DcxServer
     * @param options.issuers The issuers to use
     * @param options.manifests The manifests to use
     * @param options.providers The providers to use
     * @param options.handlers The handlers to use
     * @param options.dwns The dwns to use
     * @param options.gateways The gateways to use
     * @example see README.md for usage information
     * 
     */
    this.issuers = options.issuers ?? new Map<string | number | symbol, Issuer>();
    this.manifests = options.manifests ?? new Map<string | number | symbol, Manifest>();
    this.providers = options.providers ?? new Map<string | number | symbol, Provider>();
    this.handlers = options.handlers ?? new Map<string | number | symbol, Handler>();
    this.dwns = options.dwns ?? [];
    this.gateways = options.gateways ?? []
  }

  /**
   *
   * Sets the server options
   * 
   * @param path The type of server option; must be one of 'handler', 'providers', 'manifest', or 'issuer'
   * @param id Some unique, accessible identifier to map the obj to
   * @param obj The object to use; see {@link UseOption}
   * @example see README.md for usage information
   * 
   */
  public use(path: UsePath, id?: string | number | symbol, obj: any): void {
    const validPaths = ['issuer', 'manifest', 'provider', 'handler', 'gateway', 'dwn'];
    if (!validPaths.includes(path)) {
      throw new DcxServerError(
        `Invalid server.use() name: ${path}. Must be one of: ${validPaths.join(', ')}`
      );
    }

    switch (path) {
      case 'issuer':
      case 'manifest':
      case 'provider':
      case 'handler':
        if (!id) {
          throw new DcxServerError(`Invalid id: ${id}`);
        }
        this[`${path}s`].set(id, obj);
        break;
      case 'gateway':
      case 'dwn':
        this[`${path}s`].push(obj);
        break;
      default:
        throw new DcxServerError(`Invalid server.use() name: ${path}`);
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
  public useManifest(id: string | number | symbol, manifest: CredentialManifest): void {
    this.manifests.set(id, manifest);
  }

  /**
   *
   * @param id Some unique, accessible identifier for the handler
   * @param handler The handler to use
   * @example see README.md for usage information
   * 
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
   * @example see README.md for usage information
   * 
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
   * @example see README.md for usage information
   * 
   */
  public useIssuer(id: string | number | symbol, issuer: Issuer): void {
    this.issuers.set(id, issuer);
  }

  /**
  *
  * Sets the dwn to use
  *
  * @param id Some unique, accessible identifier for the issuer
  * @param dwn The dwn to use
  * @example see README.md for usage information
  * 
  */
  public useDwn(id: string | number | symbol, dwn: Dwn): void {
    this.dwns.set(id, dwn);
  }

  /**
  *
  * Sets the gateway to use
  *
  * @param id Some unique, accessible identifier for the issuer
  * @param gateway The gateway to use'
  * @example see README.md for usage information
  * 
  */
  public useGateway(id: string | number | symbol, gateway: Gateway): void {
    this.gateways.set(id, gateway);
  }

  /**
   *
   * Creates a new password for the DCX server
   *
   * @returns string
   * 
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
   * 
   * @param firstLaunch A boolean indicating if this is the first launch of the agent
   * @returns { password: string, recoveryPhrase?: string }
   * @throws DcxServerError 
   * 
   */
  public async checkWeb5Config(firstLaunch: boolean): Promise<{ password: string, recoveryPhrase?: string }> {
    const web5Password = Config.WEB5_PASSWORD;
    const web5RecoveryPhrase = Config.WEB5_RECOVERY_PHRASE;

    // TODO: consider generating a new recovery phrase if one is not provided
    // Config.WEB5_RECOVERY_PHRASE = generateMnemonic(128);

    if (firstLaunch && !web5Password && !web5RecoveryPhrase) {
      Logger.security(
        'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found on first launch! ' +
        'New WEB5_PASSWORD saved to password.key file. ' +
        'New WEB5_RECOVERY_PHRASE saved to recovery.key file.'
      );
      const password = await this.createPassword();
      await FileSystem.overwrite('password.key', password);
      Config.WEB5_PASSWORD = password;
      return { password };
    }

    if (firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxServerError(
        'WEB5_RECOVERY_PHRASE found without WEB5_PASSWORD on first launch! ' +
        'WEB5_PASSWORD is required to unlock the vault recovered by WEB5_RECOVERY_PHRASE. ' +
        'Please set WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file.'
      );
    }

    if (!firstLaunch && !web5Password && !web5RecoveryPhrase) {
      throw new DcxServerError(
        'WEB5_PASSWORD and WEB5_RECOVERY_PHRASE not found on non-first launch! ' +
        'Either set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
        'to create a new password and recovery phrase.'
      );
    }

    if (!firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxServerError(
        'WEB5_RECOVERY_PHRASE found without WEB5_PASSWORD on non-first launch! ' +
        'Either set both WEB5_PASSWORD and WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
        'to create a new recovery phrase with the given password.'
      );
    }

    if (!firstLaunch && web5Password && !web5RecoveryPhrase) {
      Logger.warn(
        'WEB5_PASSWORD found without WEB5_RECOVERY_PHRASE on non-first launch! ' +
        'Attempting to unlock the vault with WEB5_PASSWORD.'
      );
      return { password: web5Password };
    }

    return {
      password: web5Password,
      recoveryPhrase: web5RecoveryPhrase
    };
  }


  /**
   *
   * Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
   *
   * @returns void
   * 
   */
  public async initialize(): Promise<void> {
    Logger.debug('Initializing Web5 ... ');

    // Create a new DcxIdentityVault instance
    const agentVault = new DcxIdentityVault();

    // Create a new DcxAgent instance
    const agent = await DcxAgent.create({ agentVault });

    // Check if this is the first launch of the agent
    const firstLaunch = await agent.firstLaunch()

    // TODO: consider checking if vault is locked
    // const isLocked = agent.vault.isLocked();

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await this.checkWeb5Config(firstLaunch);

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.dwns.get(Config.NODE_ENV)?.endpoints ?? ;
    const startParams = { password };
    const initializeParams = !recoveryPhrase ? { ...startParams, dwnEndpoints } : { ...startParams, recoveryPhrase, dwnEndpoints };

    // Initialize the agent with the options
    if (firstLaunch) {
      Config.WEB5_RECOVERY_PHRASE = await agent.initialize(initializeParams);
      await FileSystem.overwrite('recovery.key', Config.WEB5_RECOVERY_PHRASE);
    }

    // Start the agent and create a new Web5 instance
    await agent.start(startParams);
    const web5 = new Web5({ agent, connectedDid: agent.agentDid.uri });

    // Set the DcxManager properties
    DcxManager.web5 = web5;
    DcxManager.dcxAgent = agent;
    DcxManager.dcxAgentVault = agentVault;

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
      const { records = [], cursor: nextCursor } = await DcxManager.web5.dwn.records.query({
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
          const { record }: { record: Record } = await DcxManager.web5.dwn.records.read({
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
