
import { DwnResponseStatus, Web5PlatformAgent } from '@web5/agent';
import { ProtocolsQueryResponse, Record, Web5 } from '@web5/api';
import {
    BearerDid,
    DidDht,
    DidDhtCreateOptions,
    DidRegistrationResult,
    DidResolutionResult,
    PortableDid,
} from '@web5/dids';
import { readFile } from 'fs/promises';
import { DcxEnv } from '../config/env.js';
import { credentialIssuerProtocol, ExampleManifest, manifestSchema } from '../protocol/index.js';
import { CredentialManifest } from '../types/dcx.js';
import { DcxDwnError } from '../utils/error.js';

export class DidManager {
    public static did: string;
    public static bearerDid: BearerDid;
    public static portableDid: PortableDid;

    /**
     *
     * Uses DidDht to create BearerDid; see {@link DidDht.create()}
     * @param options The did dht create options object; see {@link DidDhtCreateOptions}
     * @returns BearerDid; see {@link BearerDid}
     */
    // @handleAsyncErrors
    public static async createBearerDid(options: DidDhtCreateOptions<any>): Promise<BearerDid> {
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
    public static async resolveDidDoc(didUri: string): Promise<DidResolutionResult> {
        return await DidDht.resolve(didUri);
    }

    /**
     *
     * @param gatewayUri the uri of the gateway to publish the did to
     * @returns DidRegistrationResult; see {@link DidRegistrationResult}
     */
    // @handleAsyncErrors
    public static async publishDidDoc(
        gatewayUri: string = DcxEnv.DHT_GATEWAY_ENDPOINT,
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
    public static async importPortableDidFromFile(didFilepath: string): Promise<BearerDid> {
        const didFileString = (await readFile(didFilepath))?.toString();
        const portableDid = JSON.parse(didFileString);
        this.portableDid = portableDid;
        return await this.importPortableDid(portableDid);
    }

    /**
     * Uses DidDht to handle instantiating bearer did from corresponding portable did; see {@link DidDht.import()}
     * @param portableDid a portable did object; see {@link PortableDid}
     * @returns BearerDid; see {@link BearerDid}
     */
    // @handleAsyncErrors
    public static async importPortableDid(portableDid: PortableDid): Promise<BearerDid> {
        const bearerDid = await DidDht.import({ portableDid: this.portableDid ?? portableDid });
        this.bearerDid = bearerDid;
        return bearerDid;
    }
}


/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class DwnManager extends DidManager {
    public static web5: Web5;
    public static agent: Web5PlatformAgent;
    public static manifests: CredentialManifest[] = [];

    /**
    *
    * Query credential issuer protocol in DWN
    * @returns ProtocolsQueryResponse; see {@link ProtocolsQueryResponse}
    */
    public static async queryDcxIssuerProtocol(): Promise<ProtocolsQueryResponse> {
        // Query DWN for credential-issuer protocol
        const { status: query, protocols = [] } = await DwnManager.web5.dwn.protocols.query({
            from: DwnManager.agent.agentDid.uri,
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

    /**
     *
     * Query credential issuer manifest in DWN
     * @returns Record[]; see {@link Record}
     */
    public static async queryManifests(): Promise<Record[]> {
        const { records: manifestRecords = [] } = await DwnManager.web5.dwn.records.query({
            from: DidManager.did,
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
    }

    /**
    *
    * Configure credential issuer protocol in DWN
    * @returns DwnResponseStatus; see {@link DwnResponseStatus}
    */
    public static async configureProtocols(): Promise<DwnResponseStatus> {
        console.log('configureProtocols web5', DwnManager.web5)
        console.log('configureProtocols DwnManager.web5.agent.agentDid.uri', DwnManager.web5.agent.agentDid.uri)

        const { status: configure, protocol } = await DwnManager.web5.dwn.protocols.configure({
            message: { definition: credentialIssuerProtocol },
        });

        if ((configure.code < 200 || configure.code >= 300) || !protocol) {
            const { code, detail } = configure;
            console.error('DWN protocol configure fail', configure, protocol);
            throw new DcxDwnError(code, detail);
        }

        console.log('Configured credential issuer protocol', protocol);

        const { status: send = { code: 500, detail: "DWN Server Error" } } = await protocol.send(DidManager.did);

        if (send.code < 200 || send.code >= 300) {
            const { code, detail } = send;
            console.error('DWN protocol send fail', send);
            throw new DcxDwnError(code, detail);
        }

        console.log('Successfully sent protocol to remote DWN');

        return { status: send };
    }

    /**
     *
     * Find unwritten manifests in DWN
     * @param manifestRecords Record[]; see {@link Record}
     * @returns CredentialManifest[]; see {@link CredentialManifest}
     */
    public static async filterManifests(manifestRecords: Record[]): Promise<CredentialManifest[]> {
        const manifestsRead = await Promise.all(
            manifestRecords.map(async (manifestRecord) => {
                const { record } = await DwnManager.web5.dwn.records.read({
                    from: DidManager.did,
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
            console.log('All manifests have been written to DWN');
            return [];
        }
        return missingManifests;
    }

    /**
     *
     * Create missing manifests in DWN
     * @param unwrittenManifest CredentialManifest; see {@link CredentialManifest}
     * @returns Record; see {@link Record}
     */
    public static async createMissingManifest(unwrittenManifest: CredentialManifest): Promise<Record> {
        unwrittenManifest.issuer.id = DwnManager.web5.agent.agentDid.uri;
        const { record } = await DwnManager.web5.dwn.records.create({
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
        const sendResult = await record?.send(DwnManager.web5.agent.agentDid.uri);
        console.log('Sent manifest to remote DWN', sendResult);
        return !record ? ({} as Record) : record;
    }

    public static async createManifests(missingManifests: CredentialManifest[]): Promise<Record[]> {
        return await Promise.all(
            missingManifests.map(
                async (unwrittenManifest: CredentialManifest) =>
                    await DwnManager.createMissingManifest(unwrittenManifest),
            ),
        );
    }

    /**
     *
     * Setup DWN for credential-issuer protocol
     * @returns Promise<void>
     */
    // @handleDwnErrors
    public static async setup(): Promise<void> {
        console.log('Setting up DWN ...')
        const { status, protocols } = await DwnManager.queryDcxIssuerProtocol();
        console.log('Query status', status);
        console.log(`Found ${protocols.length} credential-issuer protocols in DWN`);

        if (!protocols.length) {
            console.log('No dcx protocol manifests found. Configuring ...');
            const result = await DwnManager.configureProtocols();
            console.log('Credential-issuer protocol configured in DWN', result);
        }

        const records = await DwnManager.queryManifests();
        console.log(`Found ${records.length} manifests`);

        const unwrittenManifests = await DwnManager.filterManifests(records);
        console.log(`Found ${unwrittenManifests.length} unwritten manifests`);

        const createdManifests = await DwnManager.createManifests(unwrittenManifests);
        console.log(`Created ${createdManifests.length} manifests`);
    }
}

export abstract class Web5Manager extends DwnManager {
    constructor() {
        super();
    }
}