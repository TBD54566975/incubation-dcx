import type { DataStore, DataStoreGetResult, DataStorePutResult } from '../types/data-store.js';
import { BlockstoreLevel } from './blockstore-level.js';
import { createLevelDatabase } from './level-wrapper.js';
import { Readable } from 'readable-stream';
/**
 * A simple implementation of {@link DataStore} that works in both the browser and server-side.
 * Leverages LevelDB under the hood.
 *
 * It has the following structure (`+` represents an additional sublevel/partition):
 *   'data' + <tenant> + <recordId> + <dataCid> -> <data>
 */
export declare class DataStoreLevel implements DataStore {
    config: DataStoreLevelConfig;
    blockstore: BlockstoreLevel;
    constructor(config?: DataStoreLevelConfig);
    open(): Promise<void>;
    close(): Promise<void>;
    put(tenant: string, recordId: string, dataCid: string, dataStream: Readable): Promise<DataStorePutResult>;
    get(tenant: string, recordId: string, dataCid: string): Promise<DataStoreGetResult | undefined>;
    delete(tenant: string, recordId: string, dataCid: string): Promise<void>;
    /**
     * Deletes everything in the store. Mainly used in tests.
     */
    clear(): Promise<void>;
    /**
     * Gets the blockstore used for storing data for the given `tenant -> `recordId` -> `dataCid`.
     */
    private getBlockstoreForStoringData;
}
type DataStoreLevelConfig = {
    blockstoreLocation?: string;
    createLevelDatabase?: typeof createLevelDatabase;
};
export {};
//# sourceMappingURL=data-store-level.d.ts.map