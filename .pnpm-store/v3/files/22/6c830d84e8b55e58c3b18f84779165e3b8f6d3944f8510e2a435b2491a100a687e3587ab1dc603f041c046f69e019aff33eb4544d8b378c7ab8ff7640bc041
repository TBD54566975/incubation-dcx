import type { PortableDid } from '@web5/dids';
import type { Web5PlatformAgent } from './types/agent.js';
import type { AgentDataStore, DataStoreDeleteParams, DataStoreGetParams, DataStoreListParams, DataStoreSetParams } from './store-data.js';
import { DwnDataStore, InMemoryDataStore } from './store-data.js';
export declare class DwnDidStore extends DwnDataStore<PortableDid> implements AgentDataStore<PortableDid> {
    protected name: string;
    protected _recordProtocolDefinition: import("./types/dwn.js").DwnProtocolDefinition;
    /**
     * Properties to use when writing and querying DID records with the DWN store.
     */
    protected _recordProperties: {
        dataFormat: string;
        protocol: string;
        protocolPath: string;
        schema: string | undefined;
    };
    delete(params: DataStoreDeleteParams): Promise<boolean>;
    get(params: DataStoreGetParams): Promise<PortableDid | undefined>;
    list(params: DataStoreListParams): Promise<PortableDid[]>;
    set(params: DataStoreSetParams<PortableDid>): Promise<void>;
    protected getAllRecords({ agent, tenantDid }: {
        agent: Web5PlatformAgent;
        tenantDid: string;
    }): Promise<PortableDid[]>;
}
export declare class InMemoryDidStore extends InMemoryDataStore<PortableDid> implements AgentDataStore<PortableDid> {
    protected name: string;
    delete(params: DataStoreDeleteParams): Promise<boolean>;
    get(params: DataStoreGetParams): Promise<PortableDid | undefined>;
    list(params: DataStoreListParams): Promise<PortableDid[]>;
    set(params: DataStoreSetParams<PortableDid>): Promise<void>;
}
//# sourceMappingURL=store-did.d.ts.map