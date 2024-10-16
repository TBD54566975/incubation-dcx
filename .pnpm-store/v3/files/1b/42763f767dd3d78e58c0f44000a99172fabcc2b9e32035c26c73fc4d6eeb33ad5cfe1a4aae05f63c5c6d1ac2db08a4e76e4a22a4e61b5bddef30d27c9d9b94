import type { Web5PlatformAgent } from './types/agent.js';
import type { IdentityMetadata } from './types/identity.js';
import type { AgentDataStore, DataStoreDeleteParams, DataStoreGetParams, DataStoreListParams, DataStoreSetParams } from './store-data.js';
import { DwnDataStore, InMemoryDataStore } from './store-data.js';
export declare function isIdentityMetadata(obj: unknown): obj is IdentityMetadata;
export declare class DwnIdentityStore extends DwnDataStore<IdentityMetadata> implements AgentDataStore<IdentityMetadata> {
    protected name: string;
    protected _recordProtocolDefinition: import("./types/dwn.js").DwnProtocolDefinition;
    /**
     * Properties to use when writing and querying Identity records with the DWN store.
     */
    protected _recordProperties: {
        dataFormat: string;
        protocol: string;
        protocolPath: string;
        schema: string | undefined;
    };
    delete(params: DataStoreDeleteParams): Promise<boolean>;
    get(params: DataStoreGetParams): Promise<IdentityMetadata | undefined>;
    set(params: DataStoreSetParams<IdentityMetadata>): Promise<void>;
    list(params: DataStoreListParams): Promise<IdentityMetadata[]>;
    protected getAllRecords({ agent, tenantDid }: {
        agent: Web5PlatformAgent;
        tenantDid: string;
    }): Promise<IdentityMetadata[]>;
}
export declare class InMemoryIdentityStore extends InMemoryDataStore<IdentityMetadata> implements AgentDataStore<IdentityMetadata> {
    protected name: string;
    delete(params: DataStoreDeleteParams): Promise<boolean>;
    get(params: DataStoreGetParams): Promise<IdentityMetadata | undefined>;
    list(params: DataStoreListParams): Promise<IdentityMetadata[]>;
    set(params: DataStoreSetParams<IdentityMetadata>): Promise<void>;
}
//# sourceMappingURL=store-identity.d.ts.map