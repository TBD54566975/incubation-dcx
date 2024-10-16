import { randomBytes } from '@noble/hashes/utils';
import { Coder, CoderType } from 'micro-packed';
export { randomBytes };
/**
 * Base64-armored values are commonly used in cryptographic applications, such as PGP and SSH.
 * @param name - The name of the armored value.
 * @param lineLen - Maximum line length for the armored value (e.g., 64 for GPG, 70 for SSH).
 * @param inner - Inner CoderType for the value.
 * @param checksum - Optional checksum function.
 * @returns Coder representing the base64-armored value.
 * @example
 * // Base64-armored value without checksum
 * const armoredValue = P.base64armor('EXAMPLE', 64, P.bytes(null));
 */
export declare function base64armor<T>(name: string, lineLen: number, inner: CoderType<T>, checksum?: (data: Uint8Array) => Uint8Array): Coder<T, string>;
//# sourceMappingURL=utils.d.ts.map