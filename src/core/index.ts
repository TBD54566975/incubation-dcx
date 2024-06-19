import crypto from 'crypto';

import { ProtocolsQueryResponse, Record, Web5, Web5ConnectResult } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { generateMnemonic } from 'bip39';
import { writeFile } from 'fs/promises';

import { DwnResponseStatus } from '@web5/agent';
import { config, type DcxServerConfig, config as defaultConfig } from '../config/index.js';
import { credentialIssuerProtocol, DcxHandlers, manifestSchema } from '../protocol/index.js';
import ExampleManifest from '../protocol/manifests/EXAMPLE-MANIFEST.json';
import { DcxServerOptions, Manifest } from '../types/dcx.js';
import { CIPHER_KEY_WARNING, WEB5_CONNECT_PASSWORD_WARNING, WEB5_CONNECT_RECOVERY_PHRASE_WARNING } from '../utils/constants.js';
import { didManager } from '../utils/did-manager.js';
import { DcxDwnError, DcxServerError } from '../utils/error.js';
import { readFileToJSON, readFileToString } from '../utils/file-system.js';
import { stringify } from '../utils/json.js';
import { Time } from '../utils/time.js';

const defaultWeb5Options = {
    sync: 'off',
    techPreview: {
        dwnEndpoints: config.DWN_ENDPOINTS
    },
}

export class DcxServer {
    initialization: boolean;
    web5?: Web5;
    did?: string;
    agent?: Web5UserAgent;
    manifest?: string;
    config: DcxServerConfig;

    constructor(options: DcxServerOptions = {}) {
        this.initialization = options.initialization ?? true;
        this.config = options.config ?? defaultConfig;
        this.web5 = options.web5;
        this.did = options.did ?? config.DCX_DID_URI;
        this.manifest = options.manifest;
        this.agent = options.agent;
    }

    use(name: string, value: { [key: string]: any }): void {
        (this as any)[name] = value?.[name];
        console.log("use name value", name, value?.[name]);
        console.log("use this", this);
    }

    async createDwnPassword(): Promise<string> {
        console.warn(WEB5_CONNECT_PASSWORD_WARNING)
        const mnemonic = generateMnemonic(128).split(' ');
        const words: string[] = [];
        for (let i = 0; i < 6; i++) {
            const rand = Math.floor(Math.random() * mnemonic.length);
            words.push(mnemonic[rand]);
        }
        const password = words.join(' ');
        this.config.WEB5_CONNECT_PASSWORD = password;
        await writeFile("dwn-password.txt", password);
        return password;
    }

    async initWeb5(): Promise<Web5ConnectResult & { agent: Web5UserAgent }> {
        console.info(WEB5_CONNECT_RECOVERY_PHRASE_WARNING);
        const agentDid = await didManager.createBearerDid({ gatewayUri: this.config.DHT_GATEWAY_ENDPOINT })
        const agent = await Web5UserAgent.create({ agentDid });
        const recoveryPhrase = await agent.initialize({ password: this.config.WEB5_CONNECT_PASSWORD });
        this.config.WEB5_CONNECT_RECOVERY_PHRASE = recoveryPhrase;
        await writeFile("dwn-recovery-phrase.txt", recoveryPhrase);
        await writeFile("dcx-issuer-did.json", stringify(agentDid));
        const response = await Web5.connect({
            ...defaultWeb5Options,
            agent,
            recoveryPhrase,
            connectedDid: agentDid.uri,
            password: this.config.WEB5_CONNECT_PASSWORD,
        });
        return { ...response, agent };
    }

    async startWeb5(): Promise<Web5ConnectResult & { agent: Web5UserAgent }> {
        const did = await readFileToJSON(this.config.DCX_DID_FILEPATH);
        const agentDid = await didManager.importPortableDid(did)
        const agent = await Web5UserAgent.create({ agentDid });
        await agent.start({ password: this.config.WEB5_CONNECT_PASSWORD });
        const response = await Web5.connect({
            ...defaultWeb5Options,
            agent,
            connectedDid: agentDid.uri,
            recoveryPhrase: this.config.WEB5_CONNECT_RECOVERY_PHRASE,
        });
        return { ...response, agent };
    }

    /**
     * @summary Sets up the DCX server
     */
    async setupDcxServer(): Promise<any> {
        /**
         * 
         * If no WEB5_CONNECT_PASSWORD set, warn user and create one
         * Else continue
         * 
         * If no WEB5_CONNECT_RECOVERY_PHRASE set, warn user, create new did, initialize new agent and start web5 connection
         * Else read and import did from local file, 
         */
        const DCX_DID_URI = this.config.DCX_DID_URI
        const DCX_DID_JWK_D = this.config.DCX_DID_JWK_D
        const DCX_DID_FILEPATH = this.config.DCX_DID_FILEPATH

        if (!(DCX_DID_URI && DCX_DID_JWK_D && DCX_DID_FILEPATH)) {

        }

        if (!DCX_DID_URI) {
            const didDocument = await didManager.resolveDid(this.config.DCX_DID_URI);
            console.log('Resolved didDocument', didDocument);
            didManager.computeDidJwkPublicKey(this.config.DCX_DID_JWK_D)
        }

        if (!this.config.WEB5_CONNECT_PASSWORD) {
            await this.createDwnPassword();
        }

        const { web5, did, recoveryPhrase: seed, agent } = !this.config.WEB5_CONNECT_RECOVERY_PHRASE ? await this.initWeb5() : await this.startWeb5();

        this.web5 = web5;
        this.did = did;
        this.agent = agent;

        console.log('Web5 initialized & connected!');
        console.log('web5  =>\n~~~~~~~~~~~~~~~~~~~~~~\n', web5);
        console.log('did   =>\n~~~~~~~~~~~~~~~~~~~~~~\n', did);
        console.log('seed  =>\n~~~~~~~~~~~~~~~~~~~~~~\n', seed);
        console.log('agent =>\n~~~~~~~~~~~~~~~~~~~~~~\n', agent);

        if (!this.config.CIPHER_KEY) {
            console.warn(CIPHER_KEY_WARNING);
            this.config.CIPHER_KEY = crypto.randomBytes(32);
            await writeFile("cipher-key.txt", this.config.CIPHER_KEY.toString('base64'));
        }

        const { status, protocols } = await this.queryDcxIssuerProtocol(web5, did);
        console.log(`DWN credential-issuer protocol query status ${status}`);
        if (!protocols.length) {
            console.log('No credential-issuer protocol in DWN. Configuring credential-issuer protocol ...');
            const result = await this.configureDcxIssuerProtocol(web5, did);
            console.log('Credential-issuer protocol configured in DWN', result);
        }

        const manifestRecords = await this.queryDcxIssuerManifest(web5, did);
        const missingManifests = await this.findUnwrittenManifests(web5, did, manifestRecords);
        if (!!missingManifests.length) {
            const manifestWrites: (Record | undefined)[] = await Promise.all(
                missingManifests.map(async (unwrittenManifest: Manifest) => await this.createMissingManifests(web5, did, unwrittenManifest))
            );
            console.log(`Wrote ${manifestWrites.length} manifests`);
        }
        return { web5, did, recoveryPhrase: seed, agent };
    }

    /**
     * 
     * @returns DWN response status object; see {@link DwnResponseStatus}
     */
    async configureDcxIssuerProtocol(web5: Web5, did: string): Promise<DwnResponseStatus> {
        const { status: configure, protocol } = await web5.dwn.protocols.configure({
            message: { definition: credentialIssuerProtocol },
        });
        if (configure.code < 200 || configure.code >= 300) {
            const { code, detail } = configure;
            console.error('configureDcxIssuerProtocol configure.code < 200 || configure.code >= 300', configure);
            throw new DcxDwnError(code, detail);
        }
        if (!protocol) {
            const { code, detail } = configure;
            console.error('configureDcxIssuerProtocol !protocol', protocol);
            throw new DcxDwnError(code, detail);
        }
        console.log('Configured credential issuer protocol', protocol);

        const { status: send } = await protocol.send(did) ?? {};
        if (send.code < 200 || send.code >= 300) {
            const { code, detail } = send;
            console.error('configureDcxIssuerProtocol send.code < 200 || send.code >= 300', send);
            throw new DcxDwnError(code, detail);
        }
        console.log('Successfully sent protocol to remote DWN');
        return { status: send };
    }

    /**
    * 
    * @returns DWN response status object; see {@link ProtocolsQueryResponse}
    */
    async queryDcxIssuerProtocol(web5: Web5, did: string): Promise<ProtocolsQueryResponse> {
        // Query DWN for credential-issuer protocol
        const { status: query, protocols = [] } = await web5.dwn.protocols.query({
            from: did,
            message: {
                filter: {
                    protocol: credentialIssuerProtocol.protocol,
                },
            },
        });
        if (query.code < 200 || query.code >= 300) {
            const { code, detail } = query;
            console.error('queryDcxIssuerProtocol query.code < 200 || query.code >= 300', query);
            throw new DcxDwnError(code, detail);
        }
        console.log(`DWN has ${protocols.length} protocols available`);
        return { status: query, protocols };
    }

    async queryDcxIssuerManifest(web5: Web5, did: string): Promise<Record[]> {
        const { records: manifestRecords = [] } = await web5.dwn.records.query({
            from: did,
            message: {
                filter: {
                    schema: manifestSchema.$id,
                    dataFormat: 'application/json',
                    protocol: credentialIssuerProtocol.protocol,
                    protocolPath: 'manifest',
                },
            },
        });
        console.log(`Found ${manifestRecords.length} manifests`);
        return manifestRecords;
    }

    /**
     * 
     * @param manifestRecords 
     * @returns List of DWN record objects; see {@link Record}
     */
    async findUnwrittenManifests(web5: Web5, did: string, manifestRecords: Record[]): Promise<Manifest[]> {
        const manifestsRead = await Promise.all(
            manifestRecords.map(async (manifestRecord) => {
                const { record } = await web5.dwn.records.read({
                    from: did,
                    message: {
                        filter: {
                            recordId: manifestRecord.id,
                        },
                    },
                });
                return record.data.json();
            }),
        );
        console.log(`Read ${manifestsRead.length} manifest records`, manifestsRead);
        const missingManifests = [ExampleManifest].filter(
            (manifest) => !manifestsRead.find((manifestRead) => manifestRead?.id === manifest.id),
        );
        console.log(`Found ${missingManifests.length} unwritten manifests`);
        if (!missingManifests.length) {
            console.log("All manifests have been written to DWN");
            return [];
        }
        return missingManifests;
    }

    async createMissingManifests(web5: Web5, did: string, unwrittenManifest: Manifest) {
        unwrittenManifest.issuer.id = did;
        const { record } = await web5.dwn.records.create({
            store: false,
            data: unwrittenManifest,
            message: {
                schema: manifestSchema.$id,
                dataFormat: 'application/json',
                protocol: credentialIssuerProtocol.protocol,
                protocolPath: 'manifest',
                published: true,
            },
        });
        const sendResult = await record?.send(this.did);
        console.log('Sent manifest to remote DWN', sendResult);
        if (!!record) return record;
    }

    /*
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

    /**
     * 
     * @summary Starts the DCX server
     * @returns void
     */
    async start(): Promise<void> {
        try {
            const { web5, did, recoveryPhrase: seed, agent } = await this.setupDcxServer();

            console.log("DCX server setup complete, polling for incoming records ...");
            let cursor = await readFileToJSON(this.config.DWN_CURSOR);
            let lastRecordId = await readFileToString(this.config.DWN_LAST_RECORD_ID);

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
                    records.map(async (recordResponse: { id: any; }) => {
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
                            await DcxHandlers.processApplicationRecord(web5, agent.agentDid, record);
                        } else {
                            console.log('Skipped message with protocol path', record.protocolPath);
                        }
                        lastRecordId = record.id;
                        if (!!lastRecordId) await writeFile(config.DWN_LAST_RECORD_ID, lastRecordId);
                    } else {
                        await Time.sleep();
                    }
                }

                if (nextCursor) {
                    console.log('Updated cursor for next query', nextCursor);
                    cursor = nextCursor;
                    await writeFile(config.DWN_CURSOR, cursor);
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
