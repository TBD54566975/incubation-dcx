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
import { TtlCache } from '@web5/common';
export class DidResolverCacheMemory {
    constructor({ ttl = '15m' } = {}) {
        this.cache = new TtlCache({ ttl: ms(ttl) });
    }
    /**
     * Retrieves a DID resolution result from the cache.
     *
     * If the cached item has exceeded its TTL, it's scheduled for deletion and undefined is returned.
     *
     * @param didUri - The DID string used as the key for retrieving the cached result.
     * @returns The cached DID resolution result or undefined if not found or expired.
     */
    get(didUri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!didUri) {
                throw new Error('Key cannot be null or undefined');
            }
            return this.cache.get(didUri);
        });
    }
    /**
     * Stores a DID resolution result in the cache with a TTL.
     *
     * @param didUri - The DID string used as the key for storing the result.
     * @param resolutionResult - The DID resolution result to be cached.
     * @returns A promise that resolves when the operation is complete.
     */
    set(didUri, resolutionResult) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cache.set(didUri, resolutionResult);
        });
    }
    /**
     * Deletes a DID resolution result from the cache.
     *
     * @param didUri - The DID string used as the key for deletion.
     * @returns A promise that resolves when the operation is complete.
     */
    delete(didUri) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cache.delete(didUri);
        });
    }
    /**
     * Clears all entries from the cache.
     *
     * @returns A promise that resolves when the operation is complete.
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cache.clear();
        });
    }
    /**
     * This method is a no-op but exists to be consistent with other DID Resolver Cache
     * implementations.
     *
     * @returns A promise that resolves immediately.
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            // No-op since there is no underlying store to close.
        });
    }
}
//# sourceMappingURL=resolver-cache-memory.js.map