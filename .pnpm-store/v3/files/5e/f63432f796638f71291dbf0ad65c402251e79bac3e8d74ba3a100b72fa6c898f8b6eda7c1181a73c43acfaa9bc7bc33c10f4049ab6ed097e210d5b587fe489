var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ms from 'ms';
import { Level } from 'level';
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
export class DidResolverCacheLevel {
    constructor({ db, location = 'DATA/DID_RESOLVERCACHE', ttl = '15m' } = {}) {
        this.cache = db !== null && db !== void 0 ? db : new Level(location);
        this.ttl = ms(ttl);
    }
    /**
     * Retrieves a DID resolution result from the cache.
     *
     * If the cached item has exceeded its TTL, it's scheduled for deletion and undefined is returned.
     *
     * @param did - The DID string used as the key for retrieving the cached result.
     * @returns The cached DID resolution result or undefined if not found or expired.
     */
    get(did) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const str = yield this.cache.get(did);
                const cachedDidResolutionResult = JSON.parse(str);
                if (Date.now() >= cachedDidResolutionResult.ttlMillis) {
                    // defer deletion to be called in the next tick of the js event loop
                    this.cache.nextTick(() => this.cache.del(did));
                    return;
                }
                else {
                    return cachedDidResolutionResult.value;
                }
            }
            catch (error) {
                // Don't throw when a key wasn't found.
                if (error.notFound) {
                    return;
                }
                throw error;
            }
        });
    }
    /**
     * Stores a DID resolution result in the cache with a TTL.
     *
     * @param did - The DID string used as the key for storing the result.
     * @param value - The DID resolution result to be cached.
     * @returns A promise that resolves when the operation is complete.
     */
    set(did, value) {
        const cachedDidResolutionResult = { ttlMillis: Date.now() + this.ttl, value };
        const str = JSON.stringify(cachedDidResolutionResult);
        return this.cache.put(did, str);
    }
    /**
     * Deletes a DID resolution result from the cache.
     *
     * @param did - The DID string used as the key for deletion.
     * @returns A promise that resolves when the operation is complete.
     */
    delete(did) {
        return this.cache.del(did);
    }
    /**
     * Clears all entries from the cache.
     *
     * @returns A promise that resolves when the operation is complete.
     */
    clear() {
        return this.cache.clear();
    }
    /**
     * Closes the underlying LevelDB store.
     *
     * @returns A promise that resolves when the store is closed.
     */
    close() {
        return this.cache.close();
    }
}
//# sourceMappingURL=resolver-cache-level.js.map