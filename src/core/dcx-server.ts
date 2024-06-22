import { Web5PlatformAgent } from '@web5/agent';
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
import { Web5Manager } from './web5-manager.js';

type DcxServerOptions = { manifests?: CredentialManifest[] };

export class DcxServer extends DcxEnv {
  isInitialized?: boolean;
  manifests: CredentialManifest[];

  constructor(options: DcxServerOptions) {
    super();
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
      await writeFile('web5.password', password);
      console.info(
        'New Web5.connect password created and saved to file web5.password\n' +
        '   to unlock and reuse the Web5 data created in this DCX server, set\n' +
        '   WEB5_CONNECT_PASSWORD to this value in .env',
      );
      return password;
    } catch (error) {
      console.error('DcxServer.createPassword', error);
      throw new DcxServerError(error);
    }
  }

  /**
  * @summary Configures the DCX server by creating a new password, initializing Web5,
  * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
  */
  public async setup(): Promise<void> {
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
        await this.createPassword();
      }

      console.log('Initializing Web5 connection ... ');
      if (!this.WEB5_CONNECT_RECOVERY_PHRASE) {
        console.warn(
          'SECURITY WARNING: You have not set a WEB5_CONNECT_RECOVERY_PHRASE, ' +
          'one will be generated for you and saved to file web5.seed'
        );
      }
      const { web5, did, recoveryPhrase: newSeedPhrase } = await Web5.connect({
        sync: 'off',
        password: this.WEB5_CONNECT_PASSWORD,
        recoveryPhrase: this.WEB5_CONNECT_RECOVERY_PHRASE,
        techPreview: { dwnEndpoints: DcxEnv.DWN_ENDPOINTS },
      });

      Web5Manager.web5 = web5;
      Web5Manager.agent = web5.agent as Web5PlatformAgent;

      const { did: bearerDid } = await Web5Manager.agent.identity.get({ didUri: did }) ?? {};
      if (!bearerDid) {
        throw new DcxServerError('Failed to get bearer DID');
      }

      Web5Manager.did = did;
      Web5Manager.bearerDid = bearerDid;
      Web5Manager.portableDid = await bearerDid.export();

      if (!this.WEB5_CONNECT_RECOVERY_PHRASE && newSeedPhrase) {
        console.info(
          'ADVISORY: New Web5.connect recovery phrase created and saved to file web5.seed, ' +
          'to reuse the Web5 data created in this DCX server, set ' +
          'WEB5_CONNECT_RECOVERY_PHRASE to this value in .env',
        );
        await writeFile('web5.seed', newSeedPhrase);

        console.info(
          'ADVISORY: New DCX DID created and saved to file portable.json ' +
          'to reuse the DID created for this DCX server, set ' +
          'WEB5_CONNECT_RECOVERY_PHRASE and WEB5_CONNECT_PASSWORD in .env',
        );
        await writeFile('portable.json', stringifier(Web5Manager.portableDid));
      }

      console.log('Web5 connection initialized!');
      // console.log('this  =>', this, '\n~~~~~~~~~~~~~~~~~~~~~~\n');
      // console.log('web5  =>', Web5Manager.web5, '\n~~~~~~~~~~~~~~~~~~~~~~\n');
      // console.log('did   =>', Web5Manager.bearerDid, '\n~~~~~~~~~~~~~~~~~~~~~~\n');;
      this.isInitialized = true;
    } catch (error: any) {
      console.error('DcxServer.setup', error);
      throw new DcxServerError(error);
    }
  }

  /**
   * @summary Polls the DWN for incoming records
   */
  public static async poll(): Promise<void> {
    try {
      const DWN_CURSOR = DcxEnv.DWN_CURSOR;
      const DWN_LAST_RECORD_ID = DcxEnv.DWN_LAST_RECORD_ID;
      let cursor = await readFileToJSON(DWN_CURSOR);
      let lastRecordId = await readFileToString(DWN_LAST_RECORD_ID);
      console.log('DCX server running!');

      while (true) {
        const { records = [], cursor: nextCursor } = await Web5Manager.web5.dwn.records.query({
          from: Web5Manager.bearerDid.uri,
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
            const { record } = await Web5Manager.web5.dwn.records.read({
              from: Web5Manager.bearerDid.uri,
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
              const applicationManifest = Web5Manager.manifests.find(
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

  /**
   *  
   * @summary Starts the DCX server
   * @returns void
   */
  public async start(): Promise<void> {

    try {
      await this.setup();
    } catch (error) {
      console.error('Failed to setup DCX server', error);
    }

    try {
      await Web5Manager.setup();
    } catch (error) {
      console.error('Failed to setup DCX DWN', error);
    }

    // Start polling for incoming records
    await DcxServer.poll().catch((error: any) => console.error('Error while polling DWN', error));
  }
}
