import { CID } from 'multiformats';
import type { AbortOptions, AwaitIterable } from 'interface-store';
import type { Blockstore, Pair } from 'interface-blockstore';
/**
 * Mock implementation for the Blockstore interface.
 *
 * WARNING!!! Purely to be used with `ipfs-unixfs-importer` to compute CID without needing consume any memory.
 * This is particularly useful when dealing with large files and a necessity in a large-scale production service environment.
 */
export declare class BlockstoreMock implements Blockstore {
    open(): Promise<void>;
    close(): Promise<void>;
    put(key: CID, _val: Uint8Array, _options?: AbortOptions): Promise<CID>;
    get(_key: CID, _options?: AbortOptions): Promise<Uint8Array>;
    has(_key: CID, _options?: AbortOptions): Promise<boolean>;
    delete(_key: CID, _options?: AbortOptions): Promise<void>;
    isEmpty(_options?: AbortOptions): Promise<boolean>;
    putMany(source: AwaitIterable<Pair>, options?: AbortOptions): AsyncIterable<CID>;
    getMany(source: AwaitIterable<CID>, options?: AbortOptions): AsyncIterable<Pair>;
    getAll(options?: AbortOptions): AsyncIterable<Pair>;
    deleteMany(source: AwaitIterable<CID>, options?: AbortOptions): AsyncIterable<CID>;
    /**
     * deletes all entries
     */
    clear(): Promise<void>;
}
//# sourceMappingURL=blockstore-mock.d.ts.map