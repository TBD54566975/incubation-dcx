import { CID } from 'multiformats';
import type { AbortOptions, AwaitIterable } from 'interface-store';
import type { Blockstore, Pair } from 'interface-blockstore';
import { createLevelDatabase, LevelWrapper } from './level-wrapper.js';
/**
 * Blockstore implementation using LevelDB for storing the actual messages (in the case of MessageStore)
 * or the data associated with messages (in the case of a DataStore).
 */
export declare class BlockstoreLevel implements Blockstore {
    config: BlockstoreLevelConfig;
    db: LevelWrapper<Uint8Array>;
    constructor(config: BlockstoreLevelConfig, db?: LevelWrapper<Uint8Array>);
    open(): Promise<void>;
    close(): Promise<void>;
    partition(name: string): Promise<BlockstoreLevel>;
    put(key: CID | string, val: Uint8Array, options?: AbortOptions): Promise<CID>;
    get(key: CID | string, options?: AbortOptions): Promise<Uint8Array>;
    has(key: CID | string, options?: AbortOptions): Promise<boolean>;
    delete(key: CID | string, options?: AbortOptions): Promise<void>;
    isEmpty(options?: AbortOptions): Promise<boolean>;
    putMany(source: AwaitIterable<Pair>, options?: AbortOptions): AsyncIterable<CID>;
    getMany(source: AwaitIterable<CID>, options?: AbortOptions): AsyncIterable<Pair>;
    getAll(options?: AbortOptions): AsyncIterable<Pair>;
    deleteMany(source: AwaitIterable<CID>, options?: AbortOptions): AsyncIterable<CID>;
    /**
     * deletes all entries
     */
    clear(): Promise<void>;
}
type BlockstoreLevelConfig = {
    location: string;
    createLevelDatabase?: typeof createLevelDatabase;
};
export {};
//# sourceMappingURL=blockstore-level.d.ts.map