import type { Jwk, KeyIdentifier } from '@web5/crypto';
import type { CryptoApi } from '../types/crypto-api.js';
import type { KeyManager } from '../types/key-manager.js';
import type { JweDecryptOptions, JweEncryptOptions, JweHeaderParams } from './jwe.js';
/**
 * Parameters required for decrypting a flattened JWE.
 *
 * @typeParam TKeyManager - The Key Manager used to manage cryptographic keys.
 * @typeParam TCrypto - The Crypto API used to perform cryptographic operations.
 */
export interface FlattenedJweDecryptParams<TKeyManager, TCrypto> {
    /** The flattened JWE. */
    jwe: FlattenedJweParams | FlattenedJwe;
    /**
     * The decryption key which can be a Key Identifier such as a KMS key URI, a JSON Web Key (JWK),
     * or raw key material represented as a byte array.
     */
    key: KeyIdentifier | Jwk | Uint8Array;
    /** Key Manager instanceß responsible for managing cryptographic keys. */
    keyManager?: TKeyManager;
    /** Crypto API instance that provides the necessary cryptographic operations. */
    crypto?: TCrypto;
    /** {@inheritDoc JweDecryptOptions} */
    options?: JweDecryptOptions;
}
/**
 * Result of decrypting a flattened JWE, containing the plaintext and related information.
 */
export interface FlattenedJweDecryptResult {
    /** JWE Additional Authenticated Data (AAD). */
    additionalAuthenticatedData?: Uint8Array;
    /** Plaintext. */
    plaintext: Uint8Array;
    /** JWE Protected Header. */
    protectedHeader?: Partial<JweHeaderParams>;
    /** JWE Shared Unprotected Header. */
    sharedUnprotectedHeader?: Partial<JweHeaderParams>;
    /** JWE Per-Recipient Unprotected Header. */
    unprotectedHeader?: Partial<JweHeaderParams>;
}
/**
 * Parameters for encrypting data into a flattened JWE format.
 *
 * @typeParam TKeyManager - The Key Manager used to manage cryptographic keys.
 * @typeParam TCrypto - The Crypto API used to perform cryptographic operations.
 */
export interface FlattenedJweEncryptParams<TKeyManager, TCrypto> extends FlattenedJweDecryptResult {
    /**
     * The encryption key which can be a Key Identifier such as a KMS key URI, a JSON Web Key (JWK),
     * or raw key material represented as a byte array.
     */
    key: KeyIdentifier | Jwk | Uint8Array;
    /** Key Manager instanceß responsible for managing cryptographic keys. */
    keyManager?: TKeyManager;
    /** Crypto API instance that provides the necessary cryptographic operations. */
    crypto?: TCrypto;
    /** {@inheritDoc JweEncryptOptions} */
    options?: JweEncryptOptions;
}
/**
 * Represents the parameters for a flattened JWE object, typically used in single-recipient
 * scenarios.
 */
export interface FlattenedJweParams {
    /** Base64URL encoded additional authenticated data. */
    aad?: string;
    /** Base64URL encoded ciphertext. */
    ciphertext: string;
    /** Base64URL encoded encrypted key. */
    encrypted_key?: string;
    /** Per-Recipient Unprotected Header parameters. */
    header?: Partial<JweHeaderParams>;
    /** Base64URL encoded initialization vector. */
    iv?: string;
    /** Base64URL encoded string of the Protected Header. */
    protected?: string;
    /** Base64URL encoded authentication tag. */
    tag?: string;
    /** Shared Unprotected Header parameters. */
    unprotected?: Partial<JweHeaderParams>;
}
/**
 * The `FlattenedJwe` class handles the encryption and decryption of JSON Web Encryption (JWE)
 * objects in the flattened serialization format. This format is a compact, URL-safe means of
 * representing encrypted content, typically used when dealing with a single recipient or when
 * bandwidth efficiency is important.
 *
 * This class provides methods to encrypt plaintext to a flattened JWE and decrypt a flattened JWE
 * back to plaintext, utilizing a variety of supported cryptographic algorithms as specified in the
 * JWE header parameters.
 *
 * @example
 * ```ts
 *  // Example usage of encrypt method
 * const plaintext = new TextEncoder().encode("Secret Message");
 * const key = { kty: "oct", k: "your-secret-key" }; // Example symmetric key
 * const protectedHeader = { alg: "dir", enc: "A256GCM" };
 * const encryptedJwe = await FlattenedJwe.encrypt({
 *   plaintext,
 *   protectedHeader,
 *   key,
 * });
 * ```
 *
 * @example
 * // Decryption example
 * const { plaintext, protectedHeader } = await FlattenedJwe.decrypt({
 *   jwe: yourFlattenedJweObject,
 *   key: yourDecryptionKey,
 *   crypto: new YourCryptoApi(),
 * });
 */
export declare class FlattenedJwe {
    /** Base64URL encoded additional authenticated data. */
    aad?: string;
    /** Base64URL encoded ciphertext. */
    ciphertext: string;
    /** Base64URL encoded encrypted key. */
    encrypted_key?: string;
    /** Per-Recipient Unprotected Header parameters. */
    header?: Partial<JweHeaderParams>;
    /** Base64URL encoded initialization vector. */
    iv?: string;
    /** Base64URL encoded string of the Protected Header. */
    protected?: string;
    /** Base64URL encoded authentication tag. */
    tag?: string;
    /** Shared Unprotected Header parameters. */
    unprotected?: Partial<JweHeaderParams>;
    constructor(params: FlattenedJweParams);
    static decrypt<TKeyManager extends KeyManager | undefined = KeyManager, TCrypto extends CryptoApi | undefined = CryptoApi>({ jwe, key, keyManager, crypto, options }: FlattenedJweDecryptParams<TKeyManager, TCrypto>): Promise<FlattenedJweDecryptResult>;
    static encrypt<TKeyManager extends KeyManager | undefined = KeyManager, TCrypto extends CryptoApi | undefined = CryptoApi>({ key, plaintext, additionalAuthenticatedData, protectedHeader, sharedUnprotectedHeader, unprotectedHeader, keyManager, crypto, }: FlattenedJweEncryptParams<TKeyManager, TCrypto>): Promise<FlattenedJwe>;
}
//# sourceMappingURL=jwe-flattened.d.ts.map