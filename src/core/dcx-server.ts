import { Web5PlatformAgent } from '@web5/agent';
import { Web5 } from '@web5/api';
import { BearerDid, PortableDid } from '@web5/dids';
import { Web5UserAgent } from '@web5/user-agent';
import { generateMnemonic } from 'bip39';
import crypto from 'crypto';
import { writeFile } from 'fs/promises';
import { stringify } from 'querystring';
import { dcxEnvConfig, DcxEnvConfig } from '../index.js';
import { DcxProtocolHandlers } from '../protocol/handlers.js';
import { credentialIssuerProtocol } from '../protocol/index.js';
import { CredentialManifest } from '../types/dcx.js';
import {
  CIPHER_KEY_WARNING,
  WEB5_CONNECT_PASSWORD_WARNING,
  WEB5_CONNECT_RECOVERY_PHRASE_WARNING,
} from '../utils/constants.js';
import { DidManager } from '../utils/did-manager.js';
import { DcxServerError, handleAsyncErrors } from '../utils/error.js';
import { readFileToJSON, readFileToString } from '../utils/file-system.js';
import { Time } from '../utils/time.js';
import { DwnManager } from './dwn-manager.js';

type DcxServerOptions = {
  isInitialized?: boolean;
  dcxEnvConfig?: DcxEnvConfig;
  credentialManifests?: CredentialManifest[];
};

class DcxServerConfig extends DcxEnvConfig {
  public dcxEnvConfig: DcxEnvConfig;
  public isInitialized: boolean;

  public web5: Web5;
  public didManager: DidManager;
  public platformAgent: Web5PlatformAgent;
  public dwnManager: DwnManager;
  public credentialManifests: CredentialManifest[];

  constructor(options: DcxServerOptions) {
    super();

    this.dcxEnvConfig = options.dcxEnvConfig ?? dcxEnvConfig;
    this.isInitialized = false;
    this.credentialManifests = options.credentialManifests ?? [];
    this.web5 = {} as Web5;
    this.platformAgent = {} as Web5PlatformAgent;
    this.didManager = new DidManager({
      did: '',
      portableDid: {} as PortableDid,
      bearerDid: {} as BearerDid,
    });
    this.dwnManager = new DwnManager(this.web5, this.didManager.did);
  }
}

export class DcxServer extends DcxServerConfig {
  public useManifest(name: string, manifest: CredentialManifest): void {
    this.credentialManifests.push({ ...manifest, name });
  }

  @handleAsyncErrors
  async #createDwnPassword(): Promise<string> {
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
      'WEB5_CONNECT_PASSWORD to this value in .env',
    );
    return password;
  }

  @handleAsyncErrors
  async web5ConnectInit(): Promise<void> {
    console.warn(WEB5_CONNECT_RECOVERY_PHRASE_WARNING);

    const agentDid = await DidManager.createBearerDid({ gatewayUri: this.DHT_GATEWAY_ENDPOINT });
    const platformAgent = await Web5UserAgent.create({ agentDid });
    const recoveryPhrase = await platformAgent.initialize({
      password: this.WEB5_CONNECT_PASSWORD,
    });
    const portableDid: PortableDid & { [key: string]: any } = await agentDid.export();

    this.didManager.did = agentDid.uri;
    this.didManager.bearerDid = agentDid;
    this.didManager.portableDid = portableDid;

    const { web5 } = await Web5.connect({
      sync: 'off',
      agent: platformAgent,
      connectedDid: agentDid.uri,
      recoveryPhrase: this.WEB5_CONNECT_RECOVERY_PHRASE,
      techPreview: { dwnEndpoints: this.DWN_ENDPOINTS },
    });

    this.web5 = web5;
    this.platformAgent = platformAgent;
    this.WEB5_CONNECT_RECOVERY_PHRASE = recoveryPhrase;

    this.dwnManager.web5 = web5;
    this.didManager.did = agentDid.uri;

    await writeFile('web5.seed', recoveryPhrase);
    console.info(
      'New Web5.connect recovery phrase created and saved to file web5.seed, ' +
      'to reuse the Web5 data created in this DCX server, set ' +
      'WEB5_CONNECT_RECOVERY_PHRASE to this value in .env',
    );

    await writeFile('portable.json', stringify(portableDid));
    console.info(
      'New DCX DID created and saved to file portable.json ' +
      'to reuse the DID created for this DCX server, set ' +
      'WEB5_CONNECT_RECOVERY_PHRASE and WEB5_CONNECT_PASSWORD in .env',
    );
  }

  @handleAsyncErrors
  async web5Connect(): Promise<void> {
    const agentDid = await DidManager.createBearerDid({ gatewayUri: this.DHT_GATEWAY_ENDPOINT });
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

    this.dwnManager.web5 = web5;
    this.didManager.did = agentDid.uri;
  }

  /**
   * @summary Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
   */
  @handleAsyncErrors
  async #setupDcxServer(): Promise<void> {
    if (!this.CIPHER_KEY) {
      console.warn(CIPHER_KEY_WARNING);
      this.CIPHER_KEY = crypto.randomBytes(32);
      await writeFile('cipher.key', this.CIPHER_KEY.toString('base64'));
      console.log('New cipher key created, saved to file cipher.key');
    }

    if (!this.WEB5_CONNECT_PASSWORD) {
      await this.#createDwnPassword();
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

    if (!this.didManager) {
      throw new DcxServerError('Failed to create bearerDid');
    }

    await this.dwnManager.setupDcxDwn();
    console.log('DCX DWN setup complete!');
  }

  @handleAsyncErrors
  public async poll(): Promise<void> {
    const DWN_CURSOR = this.DWN_CURSOR;
    const DWN_LAST_RECORD_ID = this.DWN_LAST_RECORD_ID;
    let cursor = await readFileToJSON(DWN_CURSOR);
    let lastRecordId = await readFileToString(DWN_LAST_RECORD_ID);
    console.log('DCX server running!');

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

      for (const record of recordReads) {
        if (record.id != lastRecordId) {
          if (record.protocolPath === 'application') {
            const applicationManifest = this.credentialManifests.find(
              (manifest: CredentialManifest) =>
                manifest.presentation_definition.id === record.schema,
            );
            if (!!applicationManifest) {
              await DcxProtocolHandlers.processDcxApplication(
                this.web5,
                this.didManager.bearerDid,
                record,
                applicationManifest,
              );
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
    console.log('Setting up DCX server ...');

    // Setup DCX server
    await this.#setupDcxServer();
    console.log('DCX server setup complete!');

    // Setup DCX DWN
    await this.dwnManager.setupDcxDwn();
    console.log('DCX DWN setup complete!');

    this.isInitialized = true;
    console.log('DCX initialized! Polling for incoming records ...')
  }

  /**
   *  
   * @summary Starts the DCX server
   * @returns void
   */
  public start(): void {
    // Start polling for incoming records
    this.setup().then(this.poll).catch(console.error);
  }
}
