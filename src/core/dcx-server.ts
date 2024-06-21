import { Web5PlatformAgent } from '@web5/agent';
import { Web5 } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { generateMnemonic } from 'bip39';
import crypto from 'crypto';
import { writeFile } from 'fs/promises';

import { DcxEnv } from '../index.js';
import { DcxProtocolHandlers } from '../protocol/handlers.js';
import { credentialIssuerProtocol } from '../protocol/index.js';
import { AdditionalProperties, CredentialManifest } from '../types/dcx.js';
import { DcxServerError } from '../utils/error.js';
import { readFileToJSON, readFileToString } from '../utils/file-system.js';
import { Time } from '../utils/time.js';
import { stringifier } from '../utils/json.js';
import { DidManager } from './did-manager.js';
import { DwnManager } from './dwn-manager.js';

type DcxServerOptions = {
  isInitialized?: boolean;
  credentialManifests?: CredentialManifest[];
};

export class DcxServer extends DcxEnv {
  isInitialized: boolean;
  credentialManifests: CredentialManifest[];

  constructor(options: DcxServerOptions) {
    super();
<<<<<<< Updated upstream

    this.dcxEnvConfig = options.dcxEnvConfig ?? dcxEnvConfig;
=======
>>>>>>> Stashed changes
    this.isInitialized = false;
    this.credentialManifests = options.credentialManifests ?? [];
  }

  public useManifest(name: string, manifest: CredentialManifest): void {
    DwnManager.credentialManifests.push({ ...manifest, name });
  }

<<<<<<< Updated upstream
  @handleAsyncErrors
  private async createDwnPassword(): Promise<string> {
    console.warn(WEB5_CONNECT_PASSWORD_WARNING);

    const mnemonic = generateMnemonic(128).split(' ');
    const words: string[] = [];
    for (let i = 0; i < 6; i++) {
      const rand = Math.floor(Math.random() * mnemonic.length);
      words.push(mnemonic[rand]);
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
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

      const password = this.WEB5_CONNECT_PASSWORD;
      const gatewayUri = DcxEnv.DHT_GATEWAY_ENDPOINT;
      const dwnEndpoints = DcxEnv.DWN_ENDPOINTS;

      const agent = await Web5UserAgent.create();
      const firstLaunch = await agent.firstLaunch()
      console.log("agent", agent, "\n~~~~~~~~~~~~~~~~~~~~~~\n")
      console.log("firstLaunch", firstLaunch, "\n~~~~~~~~~~~~~~~~~~~~~~\n")
      const agentDid = firstLaunch ? await DidManager.createBearerDid({ gatewayUri }) : agent.agentDid;
      const recoveryPhrase = firstLaunch ? await agent.initialize({ password }) : this.WEB5_CONNECT_RECOVERY_PHRASE
      await agent.start({ password });

      const { web5 } = await Web5.connect({
        agent,
        password,
        sync: 'off',
        recoveryPhrase,
        connectedDid: agentDid.uri,
        techPreview: { dwnEndpoints },
      });
      DwnManager.web5 = web5;
      DwnManager.agent = agent;

      DidManager.bearerDid = agentDid;
      DidManager.portableDid = await agentDid.export();

      console.log("DidManager.portableDid", DidManager.portableDid, "\n~~~~~~~~~~~~~~~~~~~~~~\n");
      if (firstLaunch) {
        console.info(
          'ADVISORY: New Web5.connect recovery phrase created and saved to file web5.seed,\n' +
          '   to reuse the Web5 data created in this DCX server, set\n' +
          '   WEB5_CONNECT_RECOVERY_PHRASE to this value in .env',
        );
        await writeFile('web5.seed', recoveryPhrase);

        console.info(
          'ADVISORY: New DCX DID created and saved to file portable.json\n' +
          '   to reuse the DID created for this DCX server, set\n' +
          '   WEB5_CONNECT_RECOVERY_PHRASE and WEB5_CONNECT_PASSWORD in .env',
        );
        await writeFile('portable.json', stringifier(DidManager.portableDid));
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
>>>>>>> Stashed changes
  }

  /**
   * @summary Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
   */
<<<<<<< Updated upstream
  @handleAsyncErrors
  private async setupDcxServer(): Promise<void> {
    if (!this.CIPHER_KEY) {
      console.warn(CIPHER_KEY_WARNING);
      this.CIPHER_KEY = crypto.randomBytes(32);
      await writeFile('cipher.key', this.CIPHER_KEY.toString('base64'));
      console.log('New cipher key created, saved to file cipher.key');
=======
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
>>>>>>> Stashed changes
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

    if (!this.didManager) {
      throw new DcxServerError('Failed to create bearerDid');
    }

    await this.dwnManager.setupDcxDwn();
    console.log('DCX DWN setup complete!');
  }

  @handleAsyncErrors
  public async poll(): Promise<void> {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      const recordReads = await Promise.all(
        records.map(async (recordResponse: { id: any }) => {
          const { record } = await this.web5.dwn.records.read({
            from: this.didManager.bearerDid.uri,
            message: {
              filter: {
                recordId: recordResponse.id,
=======
        const recordReads = await Promise.all(
          records.map(async (recordResponse: { id: any }) => {
            const { record } = await DwnManager.web5.dwn.records.read({
              from: DidManager.bearerDid.uri,
              message: {
                filter: {
                  recordId: recordResponse.id,
                },
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            } else {
              console.log('Skipped message with protocol path', record.protocolPath);
=======
              if (!!applicationManifest) {
                await DcxProtocolHandlers.processDcxApplication(record, applicationManifest);
              } else {
                console.log('Skipped message with protocol path', record.protocolPath);
              }
              lastRecordId = record.id;
              await writeFile(DWN_LAST_RECORD_ID, lastRecordId);
>>>>>>> Stashed changes
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
    await this.setupDcxServer();
    console.log('DCX server setup complete!');

<<<<<<< Updated upstream
    // Setup DCX DWN
    await this.dwnManager.setupDcxDwn();
    console.log('DCX DWN setup complete!');
=======
      // Setup DCX DWN
      await DwnManager.setupDcxDwn();
      console.log('DCX DWN setup complete!');
>>>>>>> Stashed changes

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
