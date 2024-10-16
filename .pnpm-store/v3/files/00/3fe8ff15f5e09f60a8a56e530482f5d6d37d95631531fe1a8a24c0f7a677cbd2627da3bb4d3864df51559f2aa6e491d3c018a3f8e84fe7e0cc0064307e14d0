import { CryptoAlgorithm } from '@web5/crypto';
import type { DeriveKeyBytesParams } from '../types/params-direct.js';
import { HkdfParams } from '../primitives/hkdf.js';
import { KeyBytesDeriver } from '../types/key-deriver.js';
/**
 * The `HkdfDeriveKeyBytesParams` interface defines the algorithm-specific parameters that should be
 * passed into the `deriveKeyBytes()` method when using the HKDF algorithm.
 */
export interface HkdfDeriveKeyBytesParams extends DeriveKeyBytesParams {
    /** Specifies the algorithm variant for HKDF key derivation.
     * The value determines the hash function that will be used and must be one of the following:
     * - `"HKDF-256"`: HKDF with SHA-256.
     * - `"HKDF-384"`: HKDF with SHA-384.
     * - `"HKDF-512"`: HKDF with SHA-512.
     */
    algorithm: 'HKDF-256' | 'HKDF-384' | 'HKDF-512';
}
export declare class HkdfAlgorithm extends CryptoAlgorithm implements KeyBytesDeriver<HkdfDeriveKeyBytesParams, Uint8Array> {
    deriveKeyBytes({ algorithm, ...params }: HkdfDeriveKeyBytesParams & Omit<HkdfParams, 'hash'>): Promise<Uint8Array>;
}
//# sourceMappingURL=hkdf.d.ts.map