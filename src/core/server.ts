import crypto from 'crypto';

import { Web5, Web5ConnectResult } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { generateMnemonic } from 'bip39';
import { writeFile } from 'fs/promises';

import { Web5PlatformAgent } from '@web5/agent';
import { BearerDid, PortableDid } from '@web5/dids';
import { DcxEnvConfig, dcxEnvConfig } from '../config/index.js';
import { credentialIssuerProtocol, DcxHandlers } from '../protocol/index.js';
import { CredentialManifest } from '../types/dcx.js';
import {
  CIPHER_KEY_WARNING,
  WEB5_CONNECT_PASSWORD_WARNING,
  WEB5_CONNECT_RECOVERY_PHRASE_WARNING,
} from '../utils/constants.js';
import { DidManager } from '../utils/did-manager.js';
import { DcxServerError } from '../utils/error.js';
import { readFileToJSON, readFileToString } from '../utils/file-system.js';
import { stringify } from '../utils/json.js';
import { Time } from '../utils/time.js';
import { setupDcxDwn } from './dwn.js';

const defaultWeb5Options = {
  sync: 'off',
  techPreview: { dwnEndpoints: dcxEnvConfig.DWN_ENDPOINTS },
};

export type DcxServerOptions = {
  initialization?: boolean;
  dcxEnvConfig?: DcxEnvConfig;
  credentialManifests?: CredentialManifest[];
};
class DcxServerConfig extends DcxEnvConfig {
  public initialization: boolean;
  public credentialManifests?: CredentialManifest[];
  public dcxEnvConfig: DcxEnvConfig;

  public web5: Web5;
  public didManager: DidManager;
  public platformAgent: Web5PlatformAgent;

  constructor(options: DcxServerOptions) {
    super();
    this.dcxEnvConfig = options.dcxEnvConfig ?? dcxEnvConfig;
    this.credentialManifests = options.credentialManifests;
    this.initialization = options.initialization ?? true;
    this.web5 = {} as Web5;
    this.didManager = new DidManager({
      did: '',
      bearerDid: {} as BearerDid,
      portableDid: {} as PortableDid,
    });
    this.platformAgent = {} as Web5PlatformAgent;
  }
}

export class DcxServer extends DcxServerConfig {
  use(name: string, value: { [key: string]: any }): void {
    (this as any)[name] = value?.[name];
    console.log('use name value', name, value?.[name]);
    console.log('use this', this);
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
    return password;
  }

  async web5ConnectInit(): Promise<void> {
    console.info(WEB5_CONNECT_RECOVERY_PHRASE_WARNING);

    const agentDid = await this.didManager.createBearerDid({
      gatewayUri: this.DHT_GATEWAY_ENDPOINT,
    });
    const platformAgent = await Web5UserAgent.create({ agentDid });
    const recoveryPhrase = await platformAgent.initialize({ password: this.WEB5_CONNECT_PASSWORD });
    const portableDid = await agentDid.export();
    const { web5 } = await Web5.connect({
      sync: 'off',
      agent: platformAgent,
      connectedDid: agentDid.uri,
      recoveryPhrase: this.WEB5_CONNECT_RECOVERY_PHRASE,
      techPreview: { dwnEndpoints: this.DWN_ENDPOINTS },
    });
    this.web5 = web5;
    this.platformAgent = platformAgent;
    this.didManager = new DidManager({ did: agentDid.uri, portableDid, bearerDid: agentDid });
    this.WEB5_CONNECT_RECOVERY_PHRASE = recoveryPhrase;

    console.info('INFO: DCX DID initialized and saved to portable.json');

    await writeFile('web5.seed', recoveryPhrase);
    await writeFile('portable.json', stringify(portableDid));
  }

  async web5Connect(): Promise<Web5ConnectResult> {
    if (!this.WEB5_CONNECT_PASSWORD) await this.createDwnPassword();

    const { web5, did, recoveryPhrase } = await Web5.connect({
      sync: 'off',
      connectedDid: this.didManager.bearerDid?.uri,
      password: this.WEB5_CONNECT_PASSWORD,
      techPreview: { dwnEndpoints: this.DWN_ENDPOINTS },
    });

    // const { did: bearerDid } =  web5.agent.agentDid;
    return { web5, did, recoveryPhrase };
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
      console.log('Cipher key created!');
    }
    if (!this.WEB5_CONNECT_PASSWORD) {
      await this.createDwnPassword();
      console.log('DWN password created!');
    }
    if (!this.WEB5_CONNECT_RECOVERY_PHRASE) {
      await this.web5ConnectInit();
      console.log('Web5 initialized & connected!');
    } else {
      await this.web5Connect();
      console.log('Web5 connected!');
    }
    console.log('this  =>\n~~~~~~~~~~~~~~~~~~~~~~\n', this);
    console.log('web5  =>\n~~~~~~~~~~~~~~~~~~~~~~\n', this.web5);
    console.log('did   =>\n~~~~~~~~~~~~~~~~~~~~~~\n', this.didManager.bearerDid);
    console.log('recovery phrase  =>\n~~~~~~~~~~~~~~~~~~~~~~\n', this.WEB5_CONNECT_RECOVERY_PHRASE);
    await setupDcxDwn(this.web5, this.didManager.did);
    console.log('DCX DWN setup complete!');
  }

  /**
   *
   * @summary Starts the DCX server
   * @returns void
   */
  async start(): Promise<void> {
    try {
      const web5 = this.web5;
      const did = this.didManager.bearerDid.uri;
      const DWN_CURSOR = this.DWN_CURSOR;
      const DWN_LAST_RECORD_ID = this.DWN_LAST_RECORD_ID;

      await this.setupDcxServer();
      await setupDcxDwn(web5, did);

      console.log('DCX server setup complete, polling for incoming records ...');

      let cursor = await readFileToJSON(DWN_CURSOR);
      let lastRecordId = await readFileToString(DWN_LAST_RECORD_ID);
      while (true) {
        const { records = [], cursor: nextCursor } = await web5.dwn.records.query({
          from: did,
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
            const { record } = await web5.dwn.records.read({
              from: did,
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
              await DcxHandlers.processApplicationRecord(web5, this.didManager.bearerDid, record);
            } else {
              console.log('Skipped message with protocol path', record.protocolPath);
            }
            lastRecordId = record.id;
            if (!!lastRecordId) await writeFile(DWN_LAST_RECORD_ID, lastRecordId);
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
      console.error('web5Connect error', error);
      throw new DcxServerError('Failed to connect to Web5', error);
    }
  }
}

const server = new DcxServer({ initialization: true });
export { server };
