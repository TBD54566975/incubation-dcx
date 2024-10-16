/**
 * @packageDocumentation
 *
 * A [Hash Mapped Trie](https://en.wikipedia.org/wiki/Hash_array_mapped_trie) implementation for JavaScript.
 *
 * This is used by [@helia/unixfs](https://www.npmjs.com/package/@helia/unixfs) for it's HAMT-sharded directory implementation.
 *
 * @example
 *
 * ```TypeScript
 * import { createHAMT } from 'hamt-sharding'
 * import crypto from 'crypto-promise'
 *
 * // decide how to hash buffers made from keys, can return a Promise
 * const hashFn = async (buf) => {
 *   return crypto
 *     .createHash('sha256')
 *     .update(buf)
 *     .digest()
 * }
 *
 * const bucket = createHAMT({
 *   hashFn: hashFn
 * })
 *
 * await bucket.put('key', 'value')
 *
 * const output = await bucket.get('key')
 * // output === 'value'
 * ```
 */
import { Bucket } from './bucket.js';
import type { BucketOptions, BucketPosition, BucketChild } from './bucket.js';
interface UserBucketOptions {
    hashFn(value: Uint8Array): Promise<Uint8Array>;
    bits?: number;
}
export declare function createHAMT<T>(options: UserBucketOptions): Bucket<T>;
export { Bucket };
export type { BucketOptions, BucketPosition, BucketChild };
//# sourceMappingURL=index.d.ts.map