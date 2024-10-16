import { DwnServerInfoCache, ServerInfo } from './server-info-types.js';
/**
 * Configuration parameters for creating an in-memory cache for DWN ServerInfo entries.
 *
 * Allows customization of the cache time-to-live (TTL) setting.
 */
export type DwnServerInfoCacheMemoryParams = {
    /**
     * Optional. The time-to-live for cache entries, expressed as a string (e.g., '1h', '15m').
     * Determines how long a cache entry should remain valid before being considered expired.
     *
     * Defaults to '15m' if not specified.
     */
    ttl?: string;
};
export declare class DwnServerInfoCacheMemory implements DwnServerInfoCache {
    private cache;
    constructor({ ttl }?: DwnServerInfoCacheMemoryParams);
    /**
     * Retrieves a DWN ServerInfo entry from the cache.
     *
     * If the cached item has exceeded its TTL, it's scheduled for deletion and undefined is returned.
     *
     * @param dwnUrl - The DWN URL endpoint string used as the key for getting the entry.
     * @returns The cached DWN ServerInfo entry or undefined if not found or expired.
     */
    get(dwnUrl: string): Promise<ServerInfo | undefined>;
    /**
     * Stores a DWN ServerInfo entry in the cache with a TTL.
     *
     * @param dwnUrl - The DWN URL endpoint string used as the key for storing the entry.
     * @param value - The DWN ServerInfo entry to be cached.
     * @returns A promise that resolves when the operation is complete.
     */
    set(dwnUrl: string, value: ServerInfo): Promise<void>;
    /**
     * Deletes a DWN ServerInfo entry from the cache.
     *
     * @param dwnUrl - The DWN URL endpoint string used as the key for deletion.
     * @returns A promise that resolves when the operation is complete.
     */
    delete(dwnUrl: string): Promise<void>;
    /**
     * Clears all entries from the cache.
     *
     * @returns A promise that resolves when the operation is complete.
     */
    clear(): Promise<void>;
    /**
     * This method is a no-op but exists to be consistent with other DWN ServerInfo Cache
     * implementations.
     *
     * @returns A promise that resolves immediately.
     */
    close(): Promise<void>;
}
//# sourceMappingURL=dwn-server-info-cache-memory.d.ts.map