import { Web5PlatformAgent } from '@web5/agent';
import { Record, Web5 } from '@web5/api';
import { generateMnemonic } from 'bip39';
import { writeFile } from 'fs/promises';
import { exit } from 'process';
import { Config } from '../index.js';
import { ProtocolHandlers } from '../protocol/handlers.js';
import { credentialIssuerProtocol } from '../protocol/index.js';
import { CredentialManifest } from '../types/dcx.js';
import { DcxServerError } from '../utils/error.js';
import { FileSystem } from '../utils/file-system.js';
import { stringifier } from '../utils/json.js';
import { Time } from '../utils/time.js';
import { DidManager, Web5Manager } from './web5-manager.js';
import terminalLink from 'terminal-link';
import Logger from '../utils/logger.js';

type DcxServerOptions = { manifests?: CredentialManifest[] };

export class DcxServer extends Config {
  isPolling: boolean;
  isInitialized?: boolean;
  manifests: CredentialManifest[];

  constructor(options: DcxServerOptions) {
    super();
    this.isPolling = false;
    this.isInitialized = !!this.WEB5_CONNECT_RECOVERY_PHRASE;
    this.manifests = Web5Manager.manifests = options.manifests ?? [];
  }

  public useManifest(name: string, manifest: CredentialManifest): void {
    Web5Manager.manifests.push({ ...manifest, name });
  }

  /**
   * 
   * @returns string
   */
  public async createPassword(): Promise<string> {
    try {
      const mnemonic = generateMnemonic(128).split(' ');
      const words: string[] = [];
      for (let i = 0; i < 6; i++) {
        const rand = Math.floor(Math.random() * mnemonic.length);
        words.push(mnemonic[rand]);
      }
      const password = words.join(' ');
      this.WEB5_CONNECT_PASSWORD = password;
      await writeFile('password.key', password);
      return password;
    } catch (error: any) {
      Logger.error(DcxServer.name, error);
      throw error;
    }
  }

  /**
  * @summary Configures the DCX server by creating a new password, initializing Web5,
  * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
  */
  public async setup(): Promise<void> {
    try {
      if (!this.WEB5_CONNECT_PASSWORD) {
        Logger.security('No WEB5_CONNECT_PASSWORD detected!');
        Logger.security('New Web5 password saved to password.key')
        Logger.security('Be sure to set WEB5_CONNECT_PASSWORD in .env going forward')
        await this.createPassword();
      }

      Logger.log('Initializing Web5 connection ... ');
      const { web5, did: connectedDid, recoveryPhrase: newSeedPhrase } = await Web5.connect({
        sync: 'off',
        password: this.WEB5_CONNECT_PASSWORD,
        recoveryPhrase: this.WEB5_CONNECT_RECOVERY_PHRASE,
        techPreview: { dwnEndpoints: Config.DWN_ENDPOINTS },
      });

      if (!this.WEB5_CONNECT_RECOVERY_PHRASE && newSeedPhrase) {
        Logger.security('No WEB5_CONNECT_RECOVERY_PHRASE detected!')
        Logger.security('New Web5 recovery phrase saved to recovery.key');
        Logger.security('Set .env WEB5_CONNECT_RECOVERY_PHRASE to this recovery.key to reuse this Web5 data');
        await writeFile('recovery.key', newSeedPhrase);

        Logger.info(
          'New Web5 connection created and includes:',
          `\n    1. Agent ${terminalLink('Web5 Agent', 'https://www.npmjs.com/package/@web5/agent')}; see agent.json` +
          `\n    2. Connection DID; see connection.json` +
          '\n    3. Recovery Phrase; see recovery.key'
        );

        const portable = await Web5Manager.agent.agentDid.export();
        await writeFile('agent.json', stringifier(portable));
        await writeFile('connection.json', stringifier(Web5Manager.connectedDid.portableDid));
      }

      Web5Manager.web5 = web5;
      Web5Manager.agent = web5.agent as Web5PlatformAgent;
      await Web5Manager.agent.sync.registerIdentity({ did: connectedDid });

      const ids = await Web5Manager.agent.identity.list();
      Logger.debug("ids", ids);

      const { did: connectedBearerDid } = await Web5Manager.agent.identity.get({ didUri: connectedDid }) ?? {};
      if (!connectedBearerDid) {
        throw new DcxServerError('Failed to get bearer DID');
      }
      const portableConnectedDid = await connectedBearerDid.export();
      Web5Manager.connectedDid = new DidManager(connectedDid, connectedBearerDid, portableConnectedDid);

      this.isInitialized = true;
    } catch (error: any) {
      Logger.error(DcxServer.name, error);
      throw error;
    }
  }

  /**
   * @summary Polls the DWN for incoming records
   */
  public async poll(): Promise<void> {
    try {
      Logger.log('DCX Server polling!');

      const DWN_CURSOR = Config.DWN_CURSOR;
      const DWN_LAST_RECORD_ID = Config.DWN_LAST_RECORD_ID;

      let cursor = await FileSystem.readToJson(DWN_CURSOR);
      const pagination = !!cursor ? { limit: 10, cursor } : { limit: 10 };

      let lastRecordId = await FileSystem.readToString(DWN_LAST_RECORD_ID);

      while (this.isPolling) {
        const { records = [], cursor: nextCursor } = await Web5Manager.web5.dwn.records.query({
          from: Web5Manager.agent.agentDid.uri,
          message: {
            filter: {
              protocol: credentialIssuerProtocol.protocol,
            },
            pagination,
          },
        });
        Logger.log(`Found ${records.length} records`);

        Logger.log(DcxServer.name, 'records', records)
        Logger.log(DcxServer.name, 'cursor', cursor)
        Logger.log(DcxServer.name, 'nextCursor', nextCursor)

        if (cursor && !records.length) {
          cursor = undefined;
        }

        const recordIds = records.map((record: { id: any }) => record.id);
        Logger.log(DcxServer.name, 'recordIds', recordIds)

        const recordReads: Record[] = await Promise.all(
          recordIds.map(async (recordId: string) => {
            const { record }: { record: Record } = await Web5Manager.web5.dwn.records.read({
              from: Web5Manager.agent.agentDid.uri,
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

        Logger.log(DcxServer.name, 'recordReads', recordReads);

        for (const record of recordReads) {
          Logger.log(DcxServer.name, 'record of recordReads', record);
          Logger.log(DcxServer.name, 'record.id', record.id);

          if (record.id != lastRecordId) {
            Logger.log(DcxServer.name, 'record.protocolPath === ', record.protocolPath);

            if (record.protocolPath === 'application') {
              Logger.log(DcxServer.name, 'Web5Manager.manifests', Web5Manager.manifests)

              const applicationManifest = Web5Manager.manifests.find(
                (manifest: CredentialManifest) =>
                  manifest.presentation_definition.id === record.schema,
              );
              Logger.log(DcxServer.name, '!!applicationManifest', !!applicationManifest)
              if (!!applicationManifest) {
                Logger.log(DcxServer.name, 'applicationManifest', applicationManifest)

                await ProtocolHandlers.processApplicationRecord(record, applicationManifest);
              } else {
                Logger.log('Skipped message with protocol path', record.protocolPath);
              }
              lastRecordId = record.id;
              await writeFile(DWN_LAST_RECORD_ID, lastRecordId);
            }
          } else {
            await Time.sleep(100000);
          }
        }

        if (nextCursor) {
          Logger.log('Updated cursor for next query', nextCursor);
          cursor = nextCursor;
          await writeFile(DWN_CURSOR, cursor);
        }

        if (!recordReads.length) {
          Logger.log('No records found!', recordReads.length);
          await Time.sleep(100000);
        }
      }
    } catch (error: any) {
      Logger.error(DcxServer.name, error);
      return error;
    }
  }

  public static stop() {
    Logger.log('Server stopping...');
    exit(0);
  }

  /**
   *  
   * @summary Starts the DCX server
   * @returns void
   */
  public async start(): Promise<void> {
    try {
      await this.setup();
      Logger.log('Web5 connection initialized', this.isInitialized);
      await Web5Manager.setup();

      // Start polling for incoming records
      this.isPolling = true;
      await this.poll();
    } catch (error: any) {
      Logger.error(DcxServer.name, 'Failed to setup DCX DWN', error?.message);
      Logger.error(DcxServer.name, error);
    }
  }
}

process.on('SIGTERM', () => {
  DcxServer.stop();
});

export default new DcxServer({});
