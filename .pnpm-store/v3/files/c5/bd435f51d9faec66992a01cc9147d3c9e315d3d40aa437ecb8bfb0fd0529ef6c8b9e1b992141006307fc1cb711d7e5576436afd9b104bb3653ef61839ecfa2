/// <reference types="node" resolution-mode="require"/>
import type { AbstractBatchOperation, AbstractDatabaseOptions, AbstractIteratorOptions, AbstractLevel } from 'abstract-level';
export type CreateLevelDatabaseOptions<V> = AbstractDatabaseOptions<string, V>;
export type LevelDatabase<V> = AbstractLevel<string | Buffer | Uint8Array, string, V>;
export declare function createLevelDatabase<V>(location: string, options?: CreateLevelDatabaseOptions<V>): Promise<LevelDatabase<V>>;
export interface LevelWrapperOptions {
    signal?: AbortSignal;
}
export type LevelWrapperBatchOperation<V> = AbstractBatchOperation<LevelDatabase<V>, string, V>;
export type LevelWrapperIteratorOptions<V> = AbstractIteratorOptions<string, V>;
export declare class LevelWrapper<V> {
    config: LevelWrapperConfig<V>;
    db: LevelDatabase<V>;
    /**
     * @param config.location - must be a directory path (relative or absolute) where `Level`` will
     * store its files, or in browsers, the name of the {@link https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase `IDBDatabase`}
     * to be opened.
     */
    constructor(config: LevelWrapperConfig<V>, db?: LevelDatabase<V>);
    open(): Promise<void>;
    close(): Promise<void>;
    partition(name: string): Promise<LevelWrapper<V>>;
    get(key: string, options?: LevelWrapperOptions): Promise<V | undefined>;
    has(key: string, options?: LevelWrapperOptions): Promise<boolean>;
    keys(options?: LevelWrapperOptions): AsyncGenerator<string>;
    iterator(iteratorOptions?: LevelWrapperIteratorOptions<V>, options?: LevelWrapperOptions): AsyncGenerator<[string, V]>;
    put(key: string, value: V, options?: LevelWrapperOptions): Promise<void>;
    delete(key: string, options?: LevelWrapperOptions): Promise<void>;
    isEmpty(options?: LevelWrapperOptions): Promise<boolean>;
    clear(): Promise<void>;
    batch(operations: Array<LevelWrapperBatchOperation<V>>, options?: LevelWrapperOptions): Promise<void>;
    /**
     * Wraps the given LevelWrapperBatchOperation as an operation for the specified partition.
     */
    createPartitionOperation(partitionName: string, operation: LevelWrapperBatchOperation<V>): LevelWrapperBatchOperation<V>;
    private compactUnderlyingStorage;
    /**
     * Gets the min and max key value of this partition.
     */
    private get sublevelRange();
    private get root();
    private createLevelDatabase;
}
type LevelWrapperConfig<V> = CreateLevelDatabaseOptions<V> & {
    location: string;
    createLevelDatabase?: typeof createLevelDatabase;
};
export {};
//# sourceMappingURL=level-wrapper.d.ts.map