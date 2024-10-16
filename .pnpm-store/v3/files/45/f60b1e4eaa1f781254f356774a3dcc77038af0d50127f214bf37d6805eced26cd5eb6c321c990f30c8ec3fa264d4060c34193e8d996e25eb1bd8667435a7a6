import type { Filter, KeyValues, PaginationCursor, QueryOptions } from '../types/query-types.js';
import type { GenericMessage, MessageSort, Pagination } from '../types/message-types.js';
import type { MessageStore, MessageStoreOptions } from '../types/message-store.js';
import { BlockstoreLevel } from './blockstore-level.js';
import { createLevelDatabase } from './level-wrapper.js';
import { IndexLevel } from './index-level.js';
/**
 * A simple implementation of {@link MessageStore} that works in both the browser and server-side.
 * Leverages LevelDB under the hood.
 */
export declare class MessageStoreLevel implements MessageStore {
    config: MessageStoreLevelConfig;
    blockstore: BlockstoreLevel;
    index: IndexLevel;
    /**
     * @param {MessageStoreLevelConfig} config
     * @param {string} config.blockstoreLocation - must be a directory path (relative or absolute) where
     *  LevelDB will store its files, or in browsers, the name of the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase IDBDatabase} to be opened.
     * @param {string} config.indexLocation - same as config.blockstoreLocation
     */
    constructor(config?: MessageStoreLevelConfig);
    open(): Promise<void>;
    close(): Promise<void>;
    get(tenant: string, cidString: string, options?: MessageStoreOptions): Promise<GenericMessage | undefined>;
    query(tenant: string, filters: Filter[], messageSort?: MessageSort, pagination?: Pagination, options?: MessageStoreOptions): Promise<{
        messages: GenericMessage[];
        cursor?: PaginationCursor;
    }>;
    /**
     * Builds the IndexLevel QueryOptions object given MessageStore sort and pagination parameters.
     */
    static buildQueryOptions(messageSort?: MessageSort, pagination?: Pagination): QueryOptions;
    delete(tenant: string, cidString: string, options?: MessageStoreOptions): Promise<void>;
    put(tenant: string, message: GenericMessage, indexes: KeyValues, options?: MessageStoreOptions): Promise<void>;
    /**
     * deletes everything in the underlying blockstore and indices.
     */
    clear(): Promise<void>;
}
type MessageStoreLevelConfig = {
    blockstoreLocation?: string;
    indexLocation?: string;
    createLevelDatabase?: typeof createLevelDatabase;
};
export {};
//# sourceMappingURL=message-store-level.d.ts.map