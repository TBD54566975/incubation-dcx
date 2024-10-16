import type { AbstractLevel } from 'abstract-level';
import type { DidResolutionResult } from '../types/did-core.js';
import type { DidResolverCache } from '../types/did-resolution.js';
/**
 * Configuration parameters for creating a LevelDB-based cache for DID resolution results.
 *
 * Allows customization of the underlying database instance, storage location, and cache
 * time-to-live (TTL) settings.
 */
export type DidResolverCacheLevelParams = {
    /**
     * Optional. An instance of `AbstractLevel` to use as the database. If not provided, a new
     * LevelDB instance will be created at the specified `location`.
     */
    db?: AbstractLevel<string | Buffer | Uint8Array, string, string>;
    /**
     * Optional. The file system path or IndexedDB name where the LevelDB store will be created.
     * Defaults to 'DATA/DID_RESOLVERCACHE' if not specified.
     */
    location?: string;
    /**
     * Optional. The time-to-live for cache entries, expressed as a string (e.g., '1h', '15m').
     * Determines how long a cache entry should remain valid before being considered expired. Defaults
     * to '15m' if not specified.
     */
    ttl?: string;
};
/**
 * A Level-based cache implementation for storing and retrieving DID resolution results.
 *
 * This cache uses LevelDB for storage, allowing data persistence across process restarts or
 * browser refreshes. It's suitable for both Node.js and browser environments.
 *
 * @remarks
 * The LevelDB cache keeps data in memory for fast access and also writes to the filesystem in
 * Node.js or indexedDB in browsers. Time-to-live (TTL) for cache entries is configurable.
 *
 * @example
 * ```
 * const cache = new DidResolverCacheLevel({ ttl: '15m' });
 * ```
 */
export declare class DidResolverCacheLevel implements DidResolverCache {
    /** The underlying LevelDB store used for caching. */
    protected cache: AbstractLevel<string | Uint8Array | Buffer, string, string>;
    /** The time-to-live for cache entries in milliseconds. */
    protected ttl: number;
    constructor({ db, location, ttl }?: DidResolverCacheLevelParams);
    /**
     * Retrieves a DID resolution result from the cache.
     *
     * If the cached item has exceeded its TTL, it's scheduled for deletion and undefined is returned.
     *
     * @param did - The DID string used as the key for retrieving the cached result.
     * @returns The cached DID resolution result or undefined if not found or expired.
     */
    get(did: string): Promise<DidResolutionResult | void>;
    /**
     * Stores a DID resolution result in the cache with a TTL.
     *
     * @param did - The DID string used as the key for storing the result.
     * @param value - The DID resolution result to be cached.
     * @returns A promise that resolves when the operation is complete.
     */
    set(did: string, value: DidResolutionResult): Promise<void>;
    /**
     * Deletes a DID resolution result from the cache.
     *
     * @param did - The DID string used as the key for deletion.
     * @returns A promise that resolves when the operation is complete.
     */
    delete(did: string): Promise<void>;
    /**
     * Clears all entries from the cache.
     *
     * @returns A promise that resolves when the operation is complete.
     */
    clear(): Promise<void>;
    /**
     * Closes the underlying LevelDB store.
     *
     * @returns A promise that resolves when the store is closed.
     */
    close(): Promise<void>;
}
//# sourceMappingURL=resolver-cache-level.d.ts.map