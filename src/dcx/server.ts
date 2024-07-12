import { HdIdentityVault } from '@web5/agent';
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
import { Web5Manager } from './web5-manager.js';
import { DwnManager } from './dwn-manager.js';

type UsePath = 'manifest' | 'handler' | 'provider' | 'issuer' | 'gateway';
export class DcxServer extends Config {
  static [key: string]: any;

  _isPolling: boolean;
  _isInitialized?: boolean;

  issuers: UseIssuers;
  manifests: UseManifests;
  providers: UseProviders;
  handlers: UseHandlers;
  gateways: UseGateways;

  constructor(options: UseOptions = {}) {
    super();

    this._isPolling = false;
    this._isInitialized = false;

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
   * Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
   *
   */
  public async initialize(): Promise<void> {
    if (!this.WEB5_CONNECT_PASSWORD) {
      Logger.security('No WEB5_CONNECT_PASSWORD detected!');
      Logger.security('New Web5 password saved to password.key');

      this.WEB5_CONNECT_PASSWORD = await this.createPassword();
      Logger.debug('New password created', this.WEB5_CONNECT_PASSWORD);
      await FileSystem.overwrite('password.key', this.WEB5_CONNECT_PASSWORD);
    }

    Logger.debug('Initializing Web5 ... ');

    const agentVault = new HdIdentityVault();
    const recoveryPhrase = await agentVault.initialize({
      password: this.WEB5_CONNECT_PASSWORD,
      recoveryPhrase: this.WEB5_CONNECT_RECOVERY_PHRASE,
    });

    const agentDid = await agentVault.getDid();
    Web5Manager.agent = await Web5UserAgent.create({ agentDid, agentVault });

    if (await Web5Manager.agent.firstLaunch()) {
      Logger.security('No WEB5_CONNECT_RECOVERY_PHRASE detected!');
      Logger.security('New Web5 recovery phrase saved to recovery.key');

      await FileSystem.overwrite('recovery.key', recoveryPhrase);
      // add dwnEndpoints to agent.initialize once merged
      await Web5Manager.agent.initialize({ password: this.WEB5_CONNECT_PASSWORD, recoveryPhrase });
    }

    await Web5Manager.agent.start({ password: this.WEB5_CONNECT_PASSWORD });
    Web5Manager.web5 = new Web5({ agent: Web5Manager.agent, connectedDid: agentDid.uri });

    this._isInitialized = true;
  }

  /**
   *
   * Polls the DWN for incoming records
   *
   */
  public async poll(): Promise<void> {
    Logger.debug('DCX Server polling!');

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
    Logger.debug('Server stopping...');
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
      Logger.error('DcxServer: Failed to start DCX Server');
      Logger.error(DcxServer.name, error);
      this.stop();
    }
  }
}

const server = new DcxServer({});
export { server };

export default DcxServer;
