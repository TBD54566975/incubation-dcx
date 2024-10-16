import type { Cache } from '../types/cache.js';
/**
 * A cache using local memory.
 */
export declare class MemoryCache implements Cache {
    private timeToLiveInSeconds;
    private cache;
    /**
     * @param timeToLiveInSeconds time-to-live for every key-value pair set in the cache
     */
    constructor(timeToLiveInSeconds: number);
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any | undefined>;
}
//# sourceMappingURL=memory-cache.d.ts.map