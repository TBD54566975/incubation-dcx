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
export class DwnServerInfoCacheMemory {
    constructor({ ttl = '15m' } = {}) {
        this.cache = new TtlCache({ ttl: ms(ttl) });
    }
    /**
     * Retrieves a DWN ServerInfo entry from the cache.
     *
     * If the cached item has exceeded its TTL, it's scheduled for deletion and undefined is returned.
     *
     * @param dwnUrl - The DWN URL endpoint string used as the key for getting the entry.
     * @returns The cached DWN ServerInfo entry or undefined if not found or expired.
     */
    get(dwnUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cache.get(dwnUrl);
        });
    }
    /**
     * Stores a DWN ServerInfo entry in the cache with a TTL.
     *
     * @param dwnUrl - The DWN URL endpoint string used as the key for storing the entry.
     * @param value - The DWN ServerInfo entry to be cached.
     * @returns A promise that resolves when the operation is complete.
     */
    set(dwnUrl, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cache.set(dwnUrl, value);
        });
    }
    /**
     * Deletes a DWN ServerInfo entry from the cache.
     *
     * @param dwnUrl - The DWN URL endpoint string used as the key for deletion.
     * @returns A promise that resolves when the operation is complete.
     */
    delete(dwnUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cache.delete(dwnUrl);
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
     * This method is a no-op but exists to be consistent with other DWN ServerInfo Cache
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
//# sourceMappingURL=dwn-server-info-cache-memory.js.map