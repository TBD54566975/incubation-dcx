import { Web5 } from '@web5/api';
import { generateMnemonic } from 'bip39';
import crypto from 'crypto';
import { writeFile } from 'fs/promises';
import { DcxEnv } from '../index.js';
import { ProtocolHandlers } from '../protocol/handlers.js';
import { credentialIssuerProtocol } from '../protocol/index.js';
import { CredentialManifest } from '../types/dcx.js';
import { DcxServerError } from '../utils/error.js';
import { readFileToJSON, readFileToString } from '../utils/file-system.js';
import { stringifier } from '../utils/json.js';
import { Time } from '../utils/time.js';
import { DidManager } from './did-manager.js';
import { DwnManager } from './dwn-manager.js';
import { Web5PlatformAgent } from '@web5/agent';

type DcxServerOptions = { manifests?: CredentialManifest[] };

export class DcxServer extends DcxEnv {
  isInitialized?: boolean;
  manifests: CredentialManifest[];

  constructor(options: DcxServerOptions) {
    super();
    this.isInitialized = false;
    this.manifests = DwnManager.manifests = options.manifests ?? [];
  }

  public useManifest(name: string, manifest: CredentialManifest): void {
    DwnManager.manifests.push({ ...manifest, name });
  }

  // @handleAsyncErrors
  public async createDwnPassword(): Promise<string> {
    try {
      const mnemonic = generateMnemonic(128).split(' ');
      const words: string[] = [];
      for (let i = 0; i < 6; i++) {
        const rand = Math.floor(Math.random() * mnemonic.length);
        words.push(mnemonic[rand]);
      }
      const password = words.join(' ');
      this.WEB5_CONNECT_PASSWORD = password;
      await writeFile('web5.password', password);
      console.info(
        'New Web5.connect password created and saved to file web5.password\n' +
        '   to unlock and reuse the Web5 data created in this DCX server, set\n' +
        '   WEB5_CONNECT_PASSWORD to this value in .env',
      );
      return password;
    } catch (error) {
      console.error('DcxServer.createDwnPassword', error);
      throw new DcxServerError(error);
    }
  }

  // @handleAsyncErrors
  async web5Connect(): Promise<boolean> {
    try {
      if (!this.WEB5_CONNECT_RECOVERY_PHRASE) {
        console.warn(
          'SECURITY WARNING: You have not set a WEB5_CONNECT_RECOVERY_PHRASE,\n' +
          '   one will be generated for you and saved to file web5.seed'
        );
      }
      console.log('Web5 initializing and connecting ... ');

      const { web5, did, recoveryPhrase: newSeedPhrase } = await Web5.connect({
        password: this.WEB5_CONNECT_PASSWORD,
        sync: 'off',
        recoveryPhrase: this.WEB5_CONNECT_RECOVERY_PHRASE,
        techPreview: { dwnEndpoints: DcxEnv.DWN_ENDPOINTS },
      });
      console.log("web5 =>", web5);

      
      DwnManager.web5 = web5;
      DwnManager.agent = web5.agent as Web5PlatformAgent;

      const { did: bearerDid } = await DwnManager.agent.identity.get({ didUri: did }) ?? {};
      if (!bearerDid) {
        throw new DcxServerError('Failed to get bearer DID');
      }

      DidManager.did = did;
      DidManager.bearerDid = bearerDid;
      DidManager.portableDid = await bearerDid.export();

      console.log("DidManager.portableDid", DidManager.portableDid, "\n~~~~~~~~~~~~~~~~~~~~~~\n");

      if (newSeedPhrase) {
        console.info(
          'ADVISORY: New Web5.connect recovery phrase created and saved to file web5.seed,\n' +
          '   to reuse the Web5 data created in this DCX server, set\n' +
          '   WEB5_CONNECT_RECOVERY_PHRASE to this value in .env',
        );
        await writeFile('web5.seed', newSeedPhrase);
      }

      console.info(
        'ADVISORY: New DCX DID created and saved to file portable.json\n' +
        '   to reuse the DID created for this DCX server, set\n' +
        '   WEB5_CONNECT_RECOVERY_PHRASE and WEB5_CONNECT_PASSWORD in .env',
      );
      await writeFile('portable.json', stringifier(DidManager.portableDid));
      console.log('Web5 initialized & connected!');
      return true;
    } catch (error) {
      console.error('DcxServer.web5Connect', error);
      throw new DcxServerError(error);
    }
  }

  /**
   * @summary Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
   */
  // @handleAsyncErrors
  public async setupDcxServer(): Promise<void> {
    try {
      if (!this.CIPHER_KEY) {
        console.warn(
          'SECURITY WARNING: You have not set a CIPHER_KEY, one ' +
          'will be generated for you and saved to cipher.key'
        );

        this.CIPHER_KEY = crypto.randomBytes(32);
        await writeFile('cipher.key', this.CIPHER_KEY.toString('base64'));
        console.log('New cipher key created, saved to file cipher.key');
      }

      if (!this.WEB5_CONNECT_PASSWORD) {
        console.warn(
          'SECURITY WARNING: You have not set a WEB5_CONNECT_PASSWORD, one ' +
          'will be generated for you and saved to web5.password'
        );
        await this.createDwnPassword();
      }

      const connected = await this.web5Connect();
      console.log('Web5 connected', connected);
      console.log('this  =>', this, '\n~~~~~~~~~~~~~~~~~~~~~~\n');
      console.log('web5  =>', DwnManager.web5, '\n~~~~~~~~~~~~~~~~~~~~~~\n');
      console.log('did   =>', DidManager.bearerDid, '\n~~~~~~~~~~~~~~~~~~~~~~\n');;

      await DwnManager.setupDcxDwn();
      console.log('DCX DWN setup complete!');
    } catch (error: any) {
      console.error('DcxServer.setupDcxServer', error);
      throw new DcxServerError(error);
    }
  }

  // @handleAsyncErrors
  public async poll(): Promise<void> {
    try {
      const DWN_CURSOR = DcxEnv.DWN_CURSOR;
      const DWN_LAST_RECORD_ID = DcxEnv.DWN_LAST_RECORD_ID;
      let cursor = await readFileToJSON(DWN_CURSOR);
      let lastRecordId = await readFileToString(DWN_LAST_RECORD_ID);
      console.log('DCX server running!');

      while (true) {
        const { records = [], cursor: nextCursor } = await DwnManager.web5.dwn.records.query({
          from: DidManager.bearerDid.uri,
          message: {
            filter: {
              protocol: credentialIssuerProtocol.protocol,
            },
            pagination: {
              cursor,
              limit: 1,
            },
          },
        });

        if (cursor && !records.length) {
          cursor = undefined;
        }

        const recordReads = await Promise.all(
          records.map(async (recordResponse: { id: any }) => {
            const { record } = await DwnManager.web5.dwn.records.read({
              from: DidManager.bearerDid.uri,
              message: {
                filter: {
                  recordId: recordResponse.id,
                },
              },
            });
            return record;
          }),
        );

        for (const record of recordReads) {
          if (record.id != lastRecordId) {
            if (record.protocolPath === 'application') {
              const applicationManifest = DwnManager.manifests.find(
                (manifest: CredentialManifest) =>
                  manifest.presentation_definition.id === record.schema,
              );
              if (!!applicationManifest) {
                await ProtocolHandlers.processDcxApplication(record, applicationManifest);
              } else {
                console.log('Skipped message with protocol path', record.protocolPath);
              }
              lastRecordId = record.id;
              await writeFile(DWN_LAST_RECORD_ID, lastRecordId);
            }
          } else {
            await Time.sleep();
          }
        }

        if (nextCursor) {
          console.log('Updated cursor for next query', nextCursor);
          cursor = nextCursor;
          await writeFile(DWN_CURSOR, cursor);
        }

        if (!recordReads.length) {
          await Time.sleep();
        }
      }
    } catch (error: any) {
      console.error('DcxServer.poll', error);
      throw new DcxServerError(error);
    }
  }

  public async setup(): Promise<void> {
    try {
      console.log('Setting up DCX server ...');

      // Setup DCX server
      await this.setupDcxServer();
      console.log('DCX server setup complete!');

      // Setup DCX DWN
      await DwnManager.setupDcxDwn();
      console.log('DCX DWN setup complete!');

      this.isInitialized = true;
      console.log('DCX initialized! Polling for incoming records ...')
    } catch (error: any) {
      console.error('DcxServer.setup', error);
      throw new DcxServerError('Failed to setup DCX server');
    }
  }

  /**
   *  
   * @summary Starts the DCX server
   * @returns void
   */
  public async start(): Promise<void> {
    // Start polling for incoming records
    try {
      await this.setup();
      await this.poll()
    } catch (error) {
      console.error('Failed to start DCX server', error);
    }
  }
}
