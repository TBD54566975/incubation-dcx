import crypto from 'crypto';
import { Web5 } from "@web5/api";
import { Web5UserAgent } from "@web5/user-agent";
import { generateMnemonic } from "bip39";
import { writeFile } from "fs/promises";
import { stringify } from "querystring";
import { DcxServerConfig } from "../config/server-config.js";
import { DcxProtocolHandlers } from "../protocol/handlers.js";
import { credentialIssuerProtocol } from "../protocol/index.js";
import { CredentialManifest } from "../types/dcx.js";
import { WEB5_CONNECT_PASSWORD_WARNING, WEB5_CONNECT_RECOVERY_PHRASE_WARNING, CIPHER_KEY_WARNING } from "../utils/constants.js";
import { DcxServerError } from "../utils/error.js";
import { readFileToJSON, readFileToString } from "../utils/file-system.js";
import { Time } from "../utils/time.js";
import { setupDcxDwn } from "./dcx-dwn.js";
import { PortableDid } from "@web5/dids";

export class DcxServer extends DcxServerConfig {
  public useManifest(name: string, manifest: CredentialManifest): void {
    this.credentialManifests.push({ ...manifest, name });
  }

  async createDwnPassword(): Promise<string> {
    console.warn(WEB5_CONNECT_PASSWORD_WARNING);

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
      'New Web5.connect password created and saved to file web5.password ' +
      'to unlock and reuse the Web5 data created in this DCX server, set ' +
      'WEB5_CONNECT_PASSWORD to this value in .env'
    );
    return password;
  }

  // @handleAsyncErrors
  async web5ConnectInit(): Promise<void> {
    try {
      console.warn(WEB5_CONNECT_RECOVERY_PHRASE_WARNING);

      const agentDid = await this.didManager.createBearerDid({ gatewayUri: this.DHT_GATEWAY_ENDPOINT })

      const platformAgent = await Web5UserAgent.create({ agentDid })

      const recoveryPhrase = await platformAgent.initialize({ password: this.WEB5_CONNECT_PASSWORD })

      const portableDid: PortableDid & { [key: string]: any } = await agentDid.export()

      this.didManager.did = agentDid.uri;
      this.didManager.bearerDid = agentDid;
      this.didManager.portableDid = portableDid;

      const { web5 } = await Web5.connect({
        sync: 'off',
        agent: platformAgent,
        connectedDid: agentDid.uri,
        recoveryPhrase: this.WEB5_CONNECT_RECOVERY_PHRASE,
        techPreview: { dwnEndpoints: this.DWN_ENDPOINTS },
      })

      this.web5 = web5;
      this.platformAgent = platformAgent;
      this.WEB5_CONNECT_RECOVERY_PHRASE = recoveryPhrase;

      await writeFile('web5.seed', recoveryPhrase)
      console.info(
        'New Web5.connect recovery phrase created and saved to file web5.seed, ' +
        'to reuse the Web5 data created in this DCX server, set ' +
        'WEB5_CONNECT_RECOVERY_PHRASE to this value in .env'
      );

      await writeFile('portable.json', stringify(portableDid))
      console.info(
        'New DCX DID created and saved to file portable.json ' +
        'to reuse the DID created for this DCX server, set ' +
        'WEB5_CONNECT_RECOVERY_PHRASE and WEB5_CONNECT_PASSWORD in .env'
      );

    } catch (error: any) {
      console.error('DcxServer.web5ConnectInit error', error);
      throw new DcxServerError(error);
    }
  }

  async web5Connect(): Promise<void> {
    try {
      const agentDid = await this.didManager.createBearerDid({ gatewayUri: this.DHT_GATEWAY_ENDPOINT });

      const platformAgent = await Web5UserAgent.create({ agentDid });

      await platformAgent.start({ password: this.WEB5_CONNECT_PASSWORD });

      const portableDid = await agentDid.export();

      this.didManager.did = agentDid.uri;
      this.didManager.bearerDid = agentDid;
      this.didManager.portableDid = portableDid;

      const { web5 } = await Web5.connect({
        sync: 'off',
        connectedDid: this.didManager.bearerDid?.uri,
        password: this.WEB5_CONNECT_PASSWORD,
        techPreview: { dwnEndpoints: this.DWN_ENDPOINTS },
      });

      this.web5 = web5;
      this.platformAgent = platformAgent;

    } catch (error: any) {
      console.error('DcxServer.web5Connect error', error);
      throw new DcxServerError(error);
    }
  }

  /**
   * @summary Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
   */
  async setupDcxServer(): Promise<any> {
    if (!this.CIPHER_KEY) {
      console.warn(CIPHER_KEY_WARNING);
      this.CIPHER_KEY = crypto.randomBytes(32);
      await writeFile('cipher.key', this.CIPHER_KEY.toString('base64'));
      console.log('New cipher key created, saved to file cipher.key');
    }

    if (!this.WEB5_CONNECT_PASSWORD) {
      await this.createDwnPassword();
      console.log('DWN password created!');
    }


    if (!this.WEB5_CONNECT_RECOVERY_PHRASE) {
      await this.web5ConnectInit().catch((error: any) => { throw new DcxServerError(error) });
      console.log('Web5 initialized & connected!');
    } else {
      await this.web5Connect().catch((error: any) => { throw new DcxServerError(error) });
      console.log('Web5 connected!');
    }

    console.log('this  =>\n~~~~~~~~~~~~~~~~~~~~~~\n', this);
    console.log('web5  =>\n~~~~~~~~~~~~~~~~~~~~~~\n', this.web5);
    console.log('did   =>\n~~~~~~~~~~~~~~~~~~~~~~\n', this.didManager.bearerDid);
    console.log('recovery phrase  =>\n~~~~~~~~~~~~~~~~~~~~~~\n', this.WEB5_CONNECT_RECOVERY_PHRASE);

    if (!this.didManager) {
      throw new DcxServerError('Failed to create bearerDid');
    }

    await setupDcxDwn(this.web5, this?.didManager?.did);
    console.log('DCX DWN setup complete!');
  }

  public async poll(): Promise<void> {
    const DWN_CURSOR = this.DWN_CURSOR;
    const DWN_LAST_RECORD_ID = this.DWN_LAST_RECORD_ID;
    let cursor = await readFileToJSON(DWN_CURSOR);
    let lastRecordId = await readFileToString(DWN_LAST_RECORD_ID);
    while (true) {
      const { records = [], cursor: nextCursor } = await this.web5.dwn.records.query({
        from: this.didManager.bearerDid.uri,
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
          const { record } = await this.web5.dwn.records.read({
            from: this.didManager.bearerDid.uri,
            message: {
              filter: {
                recordId: recordResponse.id,
              },
            },
          });
          return record;
        }),
      );
      /**
       
      for (const record of recordReads) {
        if (record.id != lastRecordId) {
          if (record.protocolPath === 'application') {
            await DcxProtocolHandlers.processDcxApplication(this.web5, this.didManager.bearerDid, record);
          } else {
            console.log('Skipped message with protocol path', record.protocolPath);
          }
          lastRecordId = record.id;
          if (!!lastRecordId) await writeFile(DWN_LAST_RECORD_ID, lastRecordId);
        } else {
          await Time.sleep();
        }
      }
      */

      for (const record of recordReads) {
        if (record.id != lastRecordId) {
          if (record.protocolPath === 'application') {
            const applicationManifest = this.credentialManifests.find((manifest: CredentialManifest) =>
              manifest.presentation_definition.id === record.schema
            );
            if (!!applicationManifest) {
              await DcxProtocolHandlers.processDcxApplication(this.web5, this.didManager.bearerDid, record, applicationManifest);
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
  }

  public async setup(): Promise<void> {
    // Setup DCX server
    try {
      await this.setupDcxServer();
      if (this.needWeb5Init) {
        this.needWeb5Init = false;
      }
    } catch (error: any) {
      console.error('DcxServer.setupDcxServer error', error);
      throw new DcxServerError(error);
    }

    // Setup DCX DWN
    try {
      await setupDcxDwn(this.web5, this.didManager.bearerDid.uri);
      console.log('DCX server setup complete, polling for incoming records ...');
    } catch (error: any) {
      console.error('DcxServer.setupDcxDwn error', error);
      throw new DcxServerError(error);
    }

  }

  /**
   *  try {

      } catch (error: any) {
        console.error('DcxServer.web5Connect error', error);
        throw new DcxServerError('Failed to connect to Web5', error);
      }
   * @summary Starts the DCX server
   * @returns void
   */
  public start(): void {
    // Start polling for incoming records
    try {
      this.setup().then(this.poll);
    } catch (error: any) {
      console.error('DcxServer.start', error);
      throw new DcxServerError(error);
    }
  }
}