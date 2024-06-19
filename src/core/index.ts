import crypto from 'crypto';

import { ProtocolsQueryResponse, Record, Web5, Web5ConnectResult } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { generateMnemonic } from 'bip39';
import { writeFile } from 'fs/promises';

import { DwnResponseStatus } from '@web5/agent';
import { config, type DcxServerConfig, config as defaultConfig } from '../config/index.js';
import { credentialIssuerProtocol, DcxHandlers, manifestSchema } from '../protocol/index.js';
import ExampleManifest from '../protocol/manifests/EXAMPLE-MANIFEST.json';
import { DcxServerOptions, DcxServerUse, Manifest } from '../types/dcx.js';
import { CIPHER_KEY_WARNING, DWN_PASSWORD_WARNING, DWN_RECOVERY_PHRASE_WARNING } from '../utils/constants.js';
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

export class DcxServerConfigurer {
    web5: Web5;
    did: string;
    agent: Web5UserAgent;
    manifest: string;
    config: DcxServerConfig;

    constructor(options: DcxServerOptions) {
        this.config = options.config ?? defaultConfig;
        this.web5 = options.web5;
        this.did = options.did;
        this.agent = options.agent;
        this.manifest = options.manifest;
    }
    use(name: string, value: DcxServerUse): void {
        (this as any)[name] = value?.[name];
    }
}
export class DcxServer extends DcxServerConfigurer {

    async createDwnPassword(): Promise<string> {
        console.warn(DWN_PASSWORD_WARNING)
        const mnemonic = generateMnemonic(128).split(' ');
        const words: string[] = [];
        for (let i = 0; i < 6; i++) {
            const rand = Math.floor(Math.random() * mnemonic.length);
            words.push(mnemonic[rand]);
        }
        const password = words.join(' ');
        this.config.DWN_PASSWORD = password;
        await writeFile("dwn-password.txt", password);
        return password;
    }

    async initWeb5(): Promise<Web5ConnectResult & { agent: Web5UserAgent }> {
        console.info(DWN_RECOVERY_PHRASE_WARNING);
        const agentDid = await didManager.createBearerDid({ gatewayUri: this.config.DHT_GATEWAY_ENDPOINT })
        const agent = await Web5UserAgent.create({ agentDid });
        const recoveryPhrase = await agent.initialize({ password: this.config.DWN_PASSWORD });
        this.config.DWN_RECOVERY_PHRASE = recoveryPhrase;
        await writeFile("dwn-recovery-phrase.txt", recoveryPhrase);
        await writeFile("dcx-issuer-did.json", stringify(agentDid));
        const response = await Web5.connect({
            ...defaultWeb5Options,
            agent,
            recoveryPhrase,
            connectedDid: agentDid.uri,
            password: this.config.DWN_PASSWORD,
        });
        return { ...response, agent };
    }

    async startWeb5(): Promise<Web5ConnectResult & { agent: Web5UserAgent }> {
        const did = await readFileToJSON(this.config.DCX_ISSUER_DID_FILEPATH);
        const agentDid = await didManager.importPortableDid(did)
        const agent = await Web5UserAgent.create({ agentDid });
        await agent.start({ password: this.config.DWN_PASSWORD });
        const response = await Web5.connect({
            ...defaultWeb5Options,
            agent,
            connectedDid: agentDid.uri,
            recoveryPhrase: this.config.DWN_RECOVERY_PHRASE,
        });
        return { ...response, agent };
    }

    /**
     * @summary Sets up the DCX server
     */
    async setupDcxServer(): Promise<boolean> {
        /**
         * 
         * If no DWN_PASSWORD set, warn user and create one
         * Else continue
         * 
         * If no DWN_RECOVERY_PHRASE set, warn user, create new did, initialize new agent and start web5 connection
         * Else read and import did from local file, 
         */
        const DWN_RECOVERY_PHRASE = this.config.DWN_RECOVERY_PHRASE
        const DCX_ISSUER_DID_FILEPATH = this.config.DCX_ISSUER_DID_FILEPATH

        if (!(DWN_RECOVERY_PHRASE && DCX_ISSUER_DID_FILEPATH)) {
            throw new DcxServerError('DWN_RECOVERY_PHRASE and DCX_ISSUER_DID_FILEPATH cannot both be undefined', null)
        }

        if (!this.config.DWN_PASSWORD) {
            await this.createDwnPassword();
        }

        const { web5, did, recoveryPhrase: seed, agent } = !this.config.DWN_RECOVERY_PHRASE ? await this.initWeb5() : await this.startWeb5();

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

        const { status, protocols } = await this.queryDcxIssuerProtocol();
        console.log(`DWN credential-issuer protocol query status ${status}`);
        if (!protocols.length) {
            console.log('No credential-issuer protocol in DWN. Configuring credential-issuer protocol ...');
            const result = await this.configureDcxIssuerProtocol();
            console.log('Credential-issuer protocol configured in DWN', result);
        }

        const manifestRecords = await this.queryDcxIssuerManifest();
        const missingManifests = await this.findUnwrittenManifests(manifestRecords);
        if (!!missingManifests.length) {
            const manifestWrites: (Record | undefined)[] = await Promise.all(
                missingManifests.map(async (unwrittenManifest: Manifest) => await this.createMissingManifests(unwrittenManifest))
            );
            console.log(`Wrote ${manifestWrites.length} manifests`);
        }
        return true;
    }

    /**
     * 
     * @returns DWN response status object; see {@link DwnResponseStatus}
     */
    async configureDcxIssuerProtocol(): Promise<DwnResponseStatus> {
        const { status: configure, protocol } = await this.web5.dwn.protocols.configure({
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

        const { status: send } = await protocol.send(this.did) ?? {};
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
    async queryDcxIssuerProtocol(): Promise<ProtocolsQueryResponse> {
        // Query DWN for credential-issuer protocol
        const { status: query, protocols = [] } = await this.web5.dwn.protocols.query({
            from: this.did,
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

    async queryDcxIssuerManifest(): Promise<Record[]> {
        const { records: manifestRecords = [] } = await this.web5.dwn.records.query({
            from: this.did,
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
    async findUnwrittenManifests(manifestRecords: Record[]): Promise<Manifest[]> {
        const manifestsRead = await Promise.all(
            manifestRecords.map(async (manifestRecord) => {
                const { record } = await this.web5.dwn.records.read({
                    from: this.did,
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

    async createMissingManifests(unwrittenManifest: Manifest) {
        unwrittenManifest.issuer.id = this.did;
        const { record } = await this.web5.dwn.records.create({
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
            const success = await this.setupDcxServer();
            if (!success) {
                throw new DcxServerError('Failed to setup DCX server', null);
            }

            console.log("DCX server setup complete, polling for incoming records ...");
            let cursor = await readFileToJSON(this.config.DWN_CURSOR_FILEPATH);
            let lastRecordId = await readFileToString(this.config.DWN_LAST_RECORD_ID_FILEPATH);

            while (true) {
                const { records = [], cursor: nextCursor } = await this.web5.dwn.records.query({
                    from: this.did,
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
                            await DcxHandlers.processApplicationRecord(this.web5, this.agent.agentDid, record);
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

