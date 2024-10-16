import type { Jwk } from '@web5/crypto';
import type { Web5PlatformAgent } from './types/agent.js';
import { AgentDataStore, DataStoreDeleteParams, DataStoreGetParams, DataStoreListParams, DataStoreSetParams, DwnDataStore, InMemoryDataStore } from './store-data.js';
export declare class DwnKeyStore extends DwnDataStore<Jwk> implements AgentDataStore<Jwk> {
    protected name: string;
    protected _recordProtocolDefinition: import("./types/dwn.js").DwnProtocolDefinition;
    /**
     * Properties to use when writing and querying Private Key records with the DWN store.
     */
    protected _recordProperties: {
        dataFormat: string;
        protocol: string;
        protocolPath: string;
        schema: string | undefined;
    };
    delete(params: DataStoreDeleteParams): Promise<boolean>;
    get(params: DataStoreGetParams): Promise<Jwk | undefined>;
    set(params: DataStoreSetParams<Jwk>): Promise<void>;
    list(params: DataStoreListParams): Promise<Jwk[]>;
    protected getAllRecords({ agent, tenantDid }: {
        agent: Web5PlatformAgent;
        tenantDid: string;
    }): Promise<Jwk[]>;
}
export declare class InMemoryKeyStore extends InMemoryDataStore<Jwk> implements AgentDataStore<Jwk> {
    protected name: string;
    delete(params: DataStoreDeleteParams): Promise<boolean>;
    get(params: DataStoreGetParams): Promise<Jwk | undefined>;
    list(params: DataStoreListParams): Promise<Jwk[]>;
    set(params: DataStoreSetParams<Jwk>): Promise<void>;
}
//# sourceMappingURL=store-key.d.ts.map