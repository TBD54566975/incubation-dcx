import {
    DwnPaginationCursor,
    DwnResponseStatus,
    Web5PlatformAgent
} from '@web5/agent';
import {
    Protocol,
    ProtocolsConfigureResponse,
    ProtocolsQueryResponse,
    Record,
    RecordsCreateResponse,
    Web5
} from '@web5/api';
import {
    BearerDid,
    DidDht,
    DidDhtCreateOptions,
    DidRegistrationResult,
    DidResolutionResult,
    PortableDid,
} from '@web5/dids';
import { readFile } from 'fs/promises';
import { credentialIssuerProtocol, manifestSchema } from '../protocol/index.js';
import { CredentialManifest, Manifest } from '../types/dcx.js';
import { DwnUtils } from '../utils/dwn.js';
import { DcxDwnError, DwnError } from '../utils/error.js';
import { Logger } from '../utils/logger.js';
import { Config } from './config.js';
import { server } from './dcx-server.js';
import { DcxIdentityVault } from './dcx-identity-vault.js';

/**
 * DidManager handles interactions between the DCX server and the DID
 */
export class DidManager {
    public did: string;
    public bearerDid: BearerDid;
    public portableDid: PortableDid;

    constructor(did: string, bearerDid: BearerDid, portableDid: PortableDid) {
        this.did = did;
        this.bearerDid = bearerDid;
        this.portableDid = portableDid;
    }

    /**
     *
     * Uses DidDht to create BearerDid; see {@link DidDht.create()}
     * @param options The did dht create options object; see {@link DidDhtCreateOptions}
     * @returns BearerDid; see {@link BearerDid}
     */
    public async createBearerDid(options: DidDhtCreateOptions<any>): Promise<BearerDid> {
        this.bearerDid = await DidDht.create({ options });
        return this.bearerDid;
    }

    /**
     *
     * Uses DidDht and a didUri to resolve the corresponding didDocument; see {@link DidDht.resolve()}
     * @param didUri the uri to resolve
     * @returns DidResolutionResult; see {@link DidResolutionResult}
     */
    public async resolveDidDoc(didUri: string): Promise<DidResolutionResult> {
        return await DidDht.resolve(didUri);
    }

    /**
     *
     * @param gatewayUri the uri of the gateway to publish the did to
     * @returns DidRegistrationResult; see {@link DidRegistrationResult}
     */
    public async publishDidDoc(
        gatewayUri: string = Config.DHT_GATEWAY_ENDPOINT,
    ): Promise<DidRegistrationResult> {
        return await DidDht.publish({ did: this.bearerDid, gatewayUri });
    }

    /**
     *
     * Uses DidDht to handle importing a portable did bearer did; see {@link DidDht.import()}
     * @param didFilepath the path to the file containing the portable did object; see {@link PortableDid}
     * @returns BearerDid; see {@link BearerDid}
     */
    public async importPortableDidFromFile(didFilepath: string): Promise<BearerDid> {
        const didFileString = (await readFile(didFilepath))?.toString();
        this.portableDid = JSON.parse(didFileString);
        return await this.importPortableDid(this.portableDid);
    }

    /**
     * Uses DidDht to handle instantiating bearer did from corresponding portable did; see {@link DidDht.import()}
     * @param portableDid a portable did object; see {@link PortableDid}
     * @returns BearerDid; see {@link BearerDid}
     */
    public async importPortableDid(portableDid: PortableDid): Promise<BearerDid> {
        this.bearerDid = await DidDht.import({ portableDid: this.portableDid ?? portableDid });
        return this.bearerDid;
    }
}


/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class DwnManager {

    /**
     * 
     * Query DWN for credential-issuer protocol
     * @returns Protocol[]; see {@link Protocol}
     */
    public static async queryIssuerProtocols(): Promise<ProtocolsQueryResponse> {
        try {
            // Query DWN for credential-issuer protocol
            const { status: query, protocols = [] } = await DcxManager.web5.dwn.protocols.query({
                message: {
                    filter: {
                        protocol: credentialIssuerProtocol.protocol,
                    },
                },
            });

            if (DwnUtils.isFailure(query.code)) {
                const { code, detail } = query;
                Logger.error(`${this.name}: DWN protocols query failed`, query);
                throw new DwnError(code, detail);
            }

            Logger.debug(`DWN has ${protocols.length} protocols available`);
            return { status: query, protocols };
        } catch (error: any) {
            Logger.error(`${this.name}: Failed to query DWN protocols`, error);
            throw error;
        }
    }

    /**
     * 
     * Configure DWN for credential-issuer protocol
     * @returns DwnResponseStatus; see {@link DwnResponseStatus}
     */
    public static async configureIssuerProtocols(): Promise<ProtocolsConfigureResponse> {
        try {
            const { status: configure, protocol } = await DcxManager.web5.dwn.protocols.configure({
                message: { definition: credentialIssuerProtocol },
            });

            if (DwnUtils.isFailure(configure.code) || !protocol) {
                const { code, detail } = configure;
                Logger.error('DWN protocol configure fail', configure, protocol);
                throw new DwnError(code, detail);
            }

            const { status: send } = await protocol.send(DcxManager.dcxAgent.agentDid.uri);

            if (DwnUtils.isFailure(send.code)) {
                const { code, detail } = send;
                Logger.error('DWN protocols send failed', send);
                throw new DwnError(code, detail);
            }

            Logger.debug('Sent protocol to remote DWN', send);
            return { status: send, protocol };
        } catch (error: any) {
            Logger.error(`${this.name}: Failed to configure DWN protocols`, error);
            throw error;
        }
    }

    /**
     *
     * Query DWN for manifest records
     * @returns Record[]; see {@link Record}
     */
    public static async queryManifestRecords(): Promise<DwnResponseStatus & { records: Record[], cursor?: DwnPaginationCursor }> {
        try {
            const { status, records: manifestRecords = [], cursor } = await DcxManager.web5.dwn.records.query({
                message: {
                    filter: {
                        schema: manifestSchema.$id,
                        dataFormat: 'application/json',
                        protocol: credentialIssuerProtocol.protocol,
                        protocolPath: 'manifest',
                    },
                },
            });

            if (DwnUtils.isFailure(status.code)) {
                const { code, detail } = status;
                Logger.error('DWN manifest records query failed', status);
                throw new DwnError(code, detail);
            }

            return { status, records: manifestRecords, cursor };
        } catch (error: any) {
            Logger.warn(error)
            throw error;
        }
    }

    /**
     *
     * Filter manifest records
     * @param manifestRecords Record[]; see {@link Record}
     * @returns CredentialManifest[]; see {@link CredentialManifest}
     */
    public static async readManifestRecordsData(manifestRecords: Record[]): Promise<{ manifests: CredentialManifest[] }> {
        try {
            const manifests = await Promise.all(
                manifestRecords.map(async (manifestRecord) => {
                    const { record } = await DcxManager.web5.dwn.records.read({
                        message: {
                            filter: {
                                recordId: manifestRecord.id,
                            },
                        },
                    });
                    return record.data.json();
                }),
            );
            return { manifests }
        } catch (error: any) {
            Logger.error(`${this.name}: Failed to filter dwn manifest records`, error);
            throw error;
        }
    }

    /**
    *
    * Filter local {@link Manifest} against remote manifest record reads to find missing manifests
    * @param manifestReads list of {@link CredentialManifest} objects read from the remote DWN; 
    * @returns list of missing CredentialManifest objects that need writing to remote DWN
    */
    public static async filterManifestRecords(manifestReads: CredentialManifest[]): Promise<CredentialManifest[]> {
        const manifests = Array.from(server.manifests.values());
        try {
            return manifests.filter((manifest: CredentialManifest) => manifestReads.find(
                (manifestRead: CredentialManifest) => manifest.id !== manifestRead.id)
            );
        } catch (error: any) {
            Logger.error(`${this.name}: Failed to filter dwn manifest records`, error);
            throw error;
        }
    }

    /**
     *
     * Create missing manifest record
     * @param unwrittenManifest CredentialManifest; see {@link CredentialManifest}
     * @returns Record | undefined; see {@link Record}
     */
    public static async createMissingManifest(unwrittenManifest: CredentialManifest): Promise<RecordsCreateResponse> {
        try {
            unwrittenManifest.issuer.id = DcxManager.dcxAgent.agentDid.uri;
            const { record, status: create } = await DcxManager.web5.dwn.records.create({
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

            if (DwnUtils.isFailure(create.code)) {
                const { code, detail } = create;
                Logger.error('Failed to create missing manifest record', create);
                throw new DwnError(code, detail);
            }

            if (!record) {
                throw new DcxDwnError(`Failed to create missing dwn manifest record: ${unwrittenManifest.id}`);
            }

            const { status: send } = await record.send(DcxManager.dcxAgent.agentDid.uri);

            if (DwnUtils.isFailure(send.code)) {
                const { code, detail } = send;
                Logger.error(`${this.name}: Failed to send dwn manifest record`, send);
                throw new DwnError(code, detail);
            }

            Logger.debug(`Sent protocol to remote dwn`, send);
            return { status: send, record };
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * 
     * Create missing manifests
     * @param missingManifests CredentialManifest[]; see {@link CredentialManifest}
     * @returns Record[]; see {@link Record}
     */
    public static async createManifestRecords(missingManifests: CredentialManifest[]): Promise<Record[]> {
        try {
            const createdManifestRecords = await Promise.all(
                missingManifests.map(
                    async (unwrittenManifest: CredentialManifest) =>
                        (await DwnManager.createMissingManifest(unwrittenManifest))?.record,
                ),
            );
            return createdManifestRecords.filter((record?: Record) => record !== undefined) as Record[];
        } catch (error: any) {
            Logger.error(`${this.name}: Failed to create manifest records`, error);
            throw error;
        }
    }

    /**
     * 
     * Setup DWN with credential-issuer protocol and manifest records
     * @returns boolean indicating success or failure
     */
    public static async setup(): Promise<boolean> {
        Logger.log('Setting up dwn ...')
        const useManifests = Array.from(server.manifests.values());
        try {
            // Query DWN for credential-issuer protocols
            const { protocols } = await DwnManager.queryIssuerProtocols();
            Logger.log(`Found ${protocols.length} dcx issuer protocol(s) in dwn`, protocols);

            // Configure DWN with credential-issuer protocol if not found
            if (!protocols.length) {
                Logger.log('Configuring dwn with dcx issuer protocol ...');
                const { status, protocol } = await DwnManager.configureIssuerProtocols();
                Logger.debug(`Configured credential issuer protocol in dwn: ${status.code} - ${status.detail}`, protocol);
            }

            // Query DWN for manifest records
            const { records } = await DwnManager.queryManifestRecords();
            Logger.log(`Found ${records.length} dwn manifest records`);

            // Read manifest records data
            const { manifests } = await DwnManager.readManifestRecordsData(records);
            Logger.debug(`Read ${manifests.length} manifest records`, manifests);

            // Create missing manifest records
            if (!manifests.length) {
                const manifestRecords = await DwnManager.createManifestRecords(useManifests);
                Logger.log(`Created ${manifestRecords.length} records`, manifestRecords);
                // Filter and create missing manifest records
            } else {
                const unwrittenManifests = await DwnManager.filterManifestRecords(manifests);
                Logger.debug(`Found ${unwrittenManifests.length} unwritten manifests`);
                const manifestRecords = await DwnManager.createManifestRecords(unwrittenManifests);
                Logger.log(`Created ${manifestRecords.length} records`, manifestRecords);
            }

            Logger.log("DWN setup complete!")
            return true;
        } catch (error: any) {
            Logger.error(`${this.name} failed!`, error);
            throw error;
        }
    }
}

/**
 * DcxManager handles interactions between the DCX server and the Web5 platform
 */
export class DcxManager {
    public static web5: Web5;
    public static connected: DidManager;
    public static dcxAgent: Web5PlatformAgent;
    public static dcxAgentVault: DcxIdentityVault;
}
