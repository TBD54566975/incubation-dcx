
import { DwnResponseStatus, Web5PlatformAgent } from '@web5/agent';
import { Protocol, ProtocolsQueryResponse, Record, Web5 } from '@web5/api';
import {
    BearerDid,
    DidDht,
    DidDhtCreateOptions,
    DidRegistrationResult,
    DidResolutionResult,
    PortableDid,
} from '@web5/dids';
import { readFile } from 'fs/promises';
import { Config } from '../config.js';
import { credentialIssuerProtocol, ExampleManifest, manifestSchema } from '../protocol/index.js';
import { CredentialManifest, ServerOptionIssuers, ServerOptionManifests, ServerOptionProviders } from '../types/dcx.js';
import { DwnUtils } from '../utils/dwn.js';
import { DcxDwnError, dwn500Error, DwnError } from '../utils/error.js';
import { Logger } from '../utils/logger.js';

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
    // @handleAsyncErrors
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
    // @handleAsyncErrors
    public async resolveDidDoc(didUri: string): Promise<DidResolutionResult> {
        return await DidDht.resolve(didUri);
    }

    /**
     *
     * @param gatewayUri the uri of the gateway to publish the did to
     * @returns DidRegistrationResult; see {@link DidRegistrationResult}
     */
    // @handleAsyncErrors
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
    // @handleAsyncErrors
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
    // @handleAsyncErrors
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
    * Query credential issuer protocol in DWN
    * @returns ProtocolsQueryResponse; see {@link ProtocolsQueryResponse}
    */
    public static async queryProtocol(): Promise<Protocol[]> {

        // Query DWN for credential-issuer protocol
        const { status: query, protocols = [] } = await Web5Manager.web5.dwn.protocols.query({
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
        return protocols;

    }

    /**
    *
    * Configure credential issuer protocol in DWN
    * @returns DwnResponseStatus; see {@link DwnResponseStatus}
    */
    public static async configureProtocols(): Promise<DwnResponseStatus> {
        try {
            Logger.debug('configureProtocols Web5Manager', Web5Manager)

            const { status: configure, protocol } = await Web5Manager.web5.dwn.protocols.configure({
                message: { definition: credentialIssuerProtocol },
            });

            if (DwnUtils.isFailure(configure.code) || !protocol) {
                const { code, detail } = configure;
                Logger.error('DWN protocol configure fail', configure, protocol);
                throw new DwnError(code, detail);
            }

            Logger.debug('Configured credential issuer protocol', protocol);

            const { status: send = dwn500Error } = await protocol.send(Web5Manager.connection.did);

            if (DwnUtils.isFailure(send.code)) {
                const { code, detail } = send;
                Logger.error('DWN protocol send fail', send);
                throw new DwnError(code, detail);
            }

            Logger.debug('Successfully sent protocol to remote DWN');

            return { status: send };
        } catch (error: any) {
            Logger.error(`${this.name}: Failed to configure credential issuer protocol`, error);
            throw new DcxDwnError(error);
        }
    }

    /**
    *
    * Query credential issuer manifest in DWN
    * @returns Record[]; see {@link Record}
    */
    public static async queryManifests(): Promise<Record[] | undefined> {
        try {
            const { records: manifestRecords = [] } = await Web5Manager.web5.dwn.records.query({
                from: Web5Manager.connection.did,
                message: {
                    filter: {
                        schema: manifestSchema.$id,
                        dataFormat: 'application/json',
                        protocol: credentialIssuerProtocol.protocol,
                        protocolPath: 'manifest',
                    },
                },
            });
            return manifestRecords;
        } catch (error: any) {
            Logger.warn(error)
        }
    }

    /**
     *
     * Find unwritten manifests in DWN
     * @param manifestRecords Record[]; see {@link Record}
     * @returns CredentialManifest[]; see {@link CredentialManifest}
     */
    public static async filterManifests(manifestRecords: Record[]): Promise<CredentialManifest[]> {
        try {
            const manifestsRead = await Promise.all(
                manifestRecords.map(async (manifestRecord) => {
                    const { record } = await Web5Manager.web5.dwn.records.read({
                        from: Web5Manager.connection.did,
                        message: {
                            filter: {
                                recordId: manifestRecord.id,
                            },
                        },
                    });
                    return record.data.json();
                }),
            );
            Logger.debug(`Read ${manifestsRead.length} manifest records`, manifestsRead);
            const missingManifests = [ExampleManifest].filter(
                (manifest) => !manifestsRead.find((manifestRead) => manifestRead?.id === manifest.id),
            );
            Logger.debug(`Found ${missingManifests.length} unwritten manifests`);
            if (!missingManifests.length) {
                Logger.debug('All manifests have been written to DWN');
                return [];
            }
            return missingManifests;
        } catch (error: any) {
            Logger.error(`${this.name}: Failed to filter manifest records`, error);
            throw new DcxDwnError(error);
        }
    }

    /**
     *
     * Create missing manifests in DWN
     * @param unwrittenManifest CredentialManifest; see {@link CredentialManifest}
     * @returns Record; see {@link Record}
     */
    public static async createMissingManifest(unwrittenManifest: CredentialManifest): Promise<Record | undefined> {
        unwrittenManifest.issuer.id = Web5Manager.connection.did;
        const { record, status: create } = await Web5Manager.web5.dwn.records.create({
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
        if (!record) {
            return record;
        }


        if (DwnUtils.isFailure(create.code)) {
            const { code, detail } = create;
            Logger.error('DWN protocol create fail', create);
            throw new DwnError(code, detail);
        }

        const { status: send } = await record.send(Web5Manager.connection.did);
        if (DwnUtils.isFailure(send.code)) {
            const { code, detail } = send;
            Logger.error('DWN protocol send fail', send);
            throw new DwnError(code, detail);
        }
        Logger.log('Sent manifest to remote DWN', send);
        return record;
    }

    public static async createManifests(missingManifests: CredentialManifest[]): Promise<Record[]> {
        try {
            const manifestRecords = await Promise.all(
                missingManifests.map(
                    async (unwrittenManifest: CredentialManifest) =>
                        await Web5Manager.createMissingManifest(unwrittenManifest),
                ),
            );
            return manifestRecords.filter((record?: Record) => record !== undefined) as Record[];
        } catch (error: any) {
            Logger.error(`${this.name}: Failed to create manifest records`, error);
            throw new DcxDwnError(error);
        }
    }

    /**
     *
     * Setup DWN for credential-issuer protocol
     * @returns Promise<void>
     */
    public static async setup(): Promise<boolean> {
        try {
            Logger.log('Configuring DWN with DCX protocol ...')
            const protocols = await Web5Manager.queryProtocol();
            Logger.log(`Found ${protocols.length} credential-issuer protocol(s) in DWN`);

            if (!protocols.length) {
                Logger.log('No dcx protocol manifests found. Configuring ...');
                const result = await Web5Manager.configureProtocols();
                Logger.log('Credential-issuer protocol configured in DWN', result);
            }

            const records = await Web5Manager.queryManifests();
            if (records) {
                Logger.log(`Found ${records.length} manifests`);
                Logger.log('records', records)

                const unwrittenManifests = await Web5Manager.filterManifests(records);
                Logger.log(`Found ${unwrittenManifests.length} unwritten manifests`);

                const createdManifests = await Web5Manager.createManifests(unwrittenManifests);
                Logger.log(`Created ${createdManifests.length} manifests`);
            }

            Logger.log("Dwn setup complete!")
            return true;
        } catch (error: any) {
            Logger.error('DwnManager.setup failed!', error);
            throw error;
        }
    }
}

export abstract class Web5Manager extends DwnManager {
    public static web5: Web5;
    public static connection: DidManager;
    public static agent: Web5PlatformAgent;

    public static manifests: ServerOptionManifests;
    public static providers: ServerOptionProviders;
    public static issuers: ServerOptionIssuers;

    constructor() {
        super();
    }
}
