import crypto from 'crypto';

import { HdIdentityVault } from '@web5/agent';
import { Web5, Web5ConnectResult } from '@web5/api';
import { LevelStore } from '@web5/common';
import { Web5UserAgent } from '@web5/user-agent';
import { generateMnemonic } from 'bip39';
import { writeFile } from 'fs/promises';

import { config, type DcxServerConfig, config as defaultConfig } from '../config/index.js';
import { credentialIssuerProtocol, DcxHandlers, manifestSchema } from '../protocol/index.js';
import Manifest from '../protocol/manifests/EXAMPLE-MANIFEST.json';
import { Web5ConnectResponse } from '../types/web5.js';
import { CIPHER_KEY_WARNING, DWN_PASSWORD_WARNING, DWN_RECOVERY_PHRASE_WARNING } from '../utils/constants.js';
import { DidManager, didManager } from '../utils/did-manager.js';
import { DcxDwnError, DcxServerError } from '../utils/error.js';
import { readFileToJSON, readFileToString } from '../utils/file-system.js';
import { stringify } from '../utils/json.js';
import { Time } from '../utils/time.js';
import { BearerDid, BearerDidSigner, PortableDid } from '@web5/dids';

const defaultWeb5Options = {
    sync: 'off',
    techPreview: {
        dwnEndpoints: config.DWN_ENDPOINTS
    },
}

export type DcxServerUse = {
    manifest: string,
    config: string | DcxServerConfig,
    [key: string]: any
}
export type DcxServerOptions = {
    web5: Web5;
    did: string;
    signer: BearerDidSigner;
    manifest: string;
    config: DcxServerConfig;
};

export class DcxServer {
    web5: Web5;
    did: string;
    signer: BearerDidSigner;
    manifest: string;
    config: DcxServerConfig;

    constructor(options: DcxServerOptions) {
        this.config = options.config ?? defaultConfig;
        this.web5 = options.web5;
        this.did = options.did;
        this.signer = options.signer;
        this.manifest = options.manifest;
    }

    use(name: string, value: DcxServerUse) {
        (this as any)[name] = value?.[name];
    }

    async createDwnPassword() {
        try {
            console.warn(DWN_PASSWORD_WARNING)
            const mnemonic = generateMnemonic(128).split(' ');
            const words: string[] = [];
            for (let i = 0; i < 6; i++) {
                const rand = Math.floor(Math.random() * mnemonic.length);
                words.push(mnemonic[rand]);
            }
            this.config.DWN_PASSWORD = words.join(' ');
            return this.config.DWN_PASSWORD;
        } catch (error: any) {
            console.error('createDwnPassword error', error);
            throw new DcxServerError('Failed to create DWN password', error);
        }
    }

    async createInitializeWeb5UserAgent(agentDid: BearerDid) {
        try {
            const agent = await Web5UserAgent.create({ agentDid });
            const recoveryPhrase = await agent.initialize({ password: this.config.DWN_PASSWORD });
            return { agent, recoveryPhrase };
        } catch (error: any) {
            console.error('createWeb5UserAgent error', error);
            throw new DcxServerError('Failed to create Web5UserAgent', error);
        }
    }

    async startWeb5UserAgent() {
        try {
            const agentDid = await didManager.importPortableDidFromFile(config.DWN_AGENT_DID_FILEPATH)
            return await this.createInitializeWeb5UserAgent(agentDid);
        } catch (error: any) {
            console.error('initializeWeb5UserAgent error', error);
            throw new DcxServerError('Failed to connect to Web5', error);
        }
    }

    async newWeb5AgentConnect() {
        try {
            console.info(DWN_RECOVERY_PHRASE_WARNING);
            const agentDid = await didManager.createBearerDid({ gatewayUri: config.DHT_GATEWAY_ENDPOINT })
            const agent = await Web5UserAgent.create({ agentDid });
            const recoveryPhrase = await agent.initialize({ password: this.config.DWN_PASSWORD });
            return await Web5.connect({
                ...defaultWeb5Options,
                connectedDid: agentDid.uri,
                password: config.DWN_PASSWORD,
                recoveryPhrase
            });
        } catch (error: any) {
            console.error('initializeWeb5Connect error', error);
            throw new DcxServerError('Failed to connect to Web5', error);
        }
    }


    async startWeb5Connection() {
        try {
            return await Web5.connect({
                ...defaultWeb5Options,
                password: config.DWN_PASSWORD,
                recoveryPhrase: config.DWN_RECOVERY_PHRASE,
            });
        } catch (error: any) {
            console.error('startWeb5Connection error', error);
            throw new DcxServerError('Failed to connect to Web5', error);
        }
    }


    async setupDcxServer() {
        try {
            /**
             * 
             * If no DWN_PASSWORD set, create one
             * If no DWN_RECOVERY_PHRASE set, assume new agent / first-time connection
             */
            config.DWN_PASSWORD = config.DWN_PASSWORD ?? await this.createDwnPassword();
            // 
            // else start connection with password & recovery phrase
            const { web5, did, recoveryPhrase } = !config.DWN_RECOVERY_PHRASE ? await this.newWeb5AgentConnect() : await this.startWeb5Connection();
            config.DWN_RECOVERY_PHRASE = recoveryPhrase || '';
            // if (!!)
            console.log('Web5 initialized & connected!');
            console.log('~~~~~~~~~~~~~~~~~~~~~~');
            console.log('web5.agent.agentDid =>', web5.agent.agentDid);
            console.log('~~~~~~~~~~~~~~~~~~~~~~');
            console.log('did =>', did);
            console.log('~~~~~~~~~~~~~~~~~~~~~~');
            console.log('recoveryPhrase =>', recoveryPhrase);
            console.log('~~~~~~~~~~~~~~~~~~~~~~');
            this.web5 = web5;
            this.did = did;
            this.signer = await web5.agent.agentDid.getSigner();
            return recoveryPhrase;
        } catch (error: any) {
            console.error('setupDcxServer error', error);
            throw new DcxServerError('Failed to connect to Web5', error);
        }
    }



    async configIssuerProtocol(web5: Web5, did: string) {
        try {
            const { status: configure, protocol } = await web5.dwn.protocols.configure({
                message: { definition: credentialIssuerProtocol },
            });

            if (!configure.code.toString().startsWith('2')) {
                const { code, detail } = configure;
                console.error('configureDcxProtocol configure.code !startwith 2', configure);
                throw new DcxDwnError(code, detail);
            }
            if (!protocol) {
                const { code, detail } = configure;
                console.error('configureDcxProtocol !protocol', protocol);
                throw new DcxDwnError(code, detail);
            }

            console.log('Configured credential issuer protocol', protocol);

            const { status: send } = await protocol.send(did) ?? {};
            if (!send?.code.toString().startsWith('2')) {
                const { code, detail } = send;
                console.error('configureDcxProtocol send.code !startwith 2', send);
                throw new DcxDwnError(code, detail);
            }
            console.log('Sent protocol to remote DWN');
            return send;
        } catch (error: any) {
            console.error('configureDcxProtocol error', error);
            throw new DcxServerError('Failed to configure credential issuer protocol', error);
        }
    }





    /**
     * 
     * @summary Starts the DCX server
     *  1. Create and start Web5 instance locally, connect to remote DWN using password & recovery phrase
     *  2. Check if protocol is installed on remote DWN
     *  3. If protocol not installed, install it on remote DWN
     *  4. Query for manifest records in remote DWN
     *  5. Read each manifest record from DWN and check if credential-issuer protocol manifest installed
     *  6. Find unwritten manifests and write them to DWN
     *  7. If current cursor.json invalid, reset it
     *  8. Read protocol records from DWN
     *  9. If lastRecordId exists, skip ahead to that record id
     * 10. Process incoming records from DWN
     */
    async start(): Promise<void> {
        try {
            if (!config.CIPHER_KEY) {
                console.warn(CIPHER_KEY_WARNING);
                config.CIPHER_KEY = config.CIPHER_KEY ?? crypto.randomBytes(32).toString();
            }
            await this.setupDcxServer();
            await writeFile(config.DCX_SECRETS_FILEPATH, stringify({ dcx: { CIPHER_KEY: config.CIPHER_KEY }, dwn: { recoveryPhrase: config.DWN_RECOVERY_PHRASE, password: config.DWN_PASSWORD } }));
            const { protocols } = await this.web5.dwn.protocols.query({
                from: this.did,
                message: {
                    filter: {
                        protocol: credentialIssuerProtocol.protocol,
                    },
                },
            });
            console.log(`DWN has ${protocols.length} protocols available`);

            if (!protocols.length) {
                console.log('Configuring credential-issuer protocol ...');
                const result = await configIssuerProtocol(web5, did);
                console.log('Credential-issuer protocol configured on DWN', result);
            }

            const { records: manifestRecords = [] } = await this.web5.dwn.records
                .query({
                    from: did,
                    message: {
                        filter: {
                            schema: manifestSchema.$id,
                            dataFormat: 'application/json',
                            protocol: credentialIssuerProtocol.protocol,
                            protocolPath: 'manifest',
                        },
                    },
                }) ?? {};

            console.log(`Found ${manifestRecords.length} manifests`);

            const manifestsRead = await Promise.all(
                manifestRecords.map(async (manifestResponse) => {
                    const { record } = await this.web5.dwn.records.read({
                        from: did,
                        message: {
                            filter: {
                                recordId: manifestResponse.id,
                            },
                        },
                    });
                    return record.data.json();
                }),
            );
            console.log(`Read ${manifestsRead.length} manifest records`, manifestsRead);

            const unwrittenManifests = [Manifest].filter(
                (manifest) => !manifestsRead.find((manifestRead) => manifestRead?.id === manifest.id),
            );
            console.log(`Found ${unwrittenManifests.length} unwritten manifests`);

            if (!!unwrittenManifests.length) {
                const manifestWrites = await Promise.all(
                    unwrittenManifests.map(async (manifest) => {
                        manifest.issuer.id = did;

                        const { record } = await this.web5.dwn.records.create({
                            store: false,
                            data: manifest,
                            message: {
                                schema: manifestSchema.$id,
                                dataFormat: 'application/json',
                                protocol: credentialIssuerProtocol.protocol,
                                protocolPath: 'manifest',
                                published: true,
                            },
                        });

                        const sendResult = await record?.send(did);
                        console.log('Sent manifest to remote DWN', sendResult);

                        return record;
                    }),
                );
                console.log(`Wrote ${manifestWrites.length} manifests`);
            }

            let cursor = await readFileToJSON(config.DWN_CURSOR_FILEPATH);
            let lastRecordId = await readFileToString(config.DWN_LAST_RECORD_ID_FILEPATH);

            while (true) {
                const { records = [], cursor: nextCursor } = await this.web5.dwn.records.query({
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
                    records.map(async (recordResponse) => {
                        const { record } = await this.web5.dwn.records.read({
                            from: this.did,
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
                            await DcxHandlers.processApplicationRecord(this.web5, bearerDid, record);
                        } else {
                            console.log('Skipped message with protocol path', record.protocolPath);
                        }
                        lastRecordId = record.id;
                        await writeFile(config.DWN_LAST_RECORD_ID_FILEPATH, lastRecordId);
                    } else {
                        await Time.sleep();
                    }
                }

                if (nextCursor) {
                    console.log('Updated cursor for next query', nextCursor);
                    cursor = nextCursor;
                    await writeFile(config.DWN_CURSOR_FILEPATH, cursor);
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
