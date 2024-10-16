import type { Jwk } from '@web5/crypto';
import type { UnwrapKeyParams, WrapKeyParams } from '../types/params-direct.js';
/**
 * Constant defining the AES key length values in bits.
 *
 * @remarks
 * NIST publication FIPS 197 states:
 * > The AES algorithm is capable of using cryptographic keys of 128, 192, and 256 bits to encrypt
 * > and decrypt data in blocks of 128 bits.
 *
 * This implementation does not support key lengths that are different from the three values
 * defined by this constant.
 *
 * @see {@link https://doi.org/10.6028/NIST.FIPS.197-upd1 | NIST FIPS 197}
 */
declare const AES_KEY_LENGTHS: readonly [128, 192, 256];
export declare class AesKw {
    /**
     * Converts a raw private key in bytes to its corresponding JSON Web Key (JWK) format.
     *
     * @remarks
     * This method takes a symmetric key represented as a byte array (Uint8Array) and
     * converts it into a JWK object for use with AES (Advanced Encryption Standard)
     * for key wrapping. The conversion process involves encoding the key into
     * base64url format and setting the appropriate JWK parameters.
     *
     * The resulting JWK object includes the following properties:
     * - `kty`: Key Type, set to 'oct' for Octet Sequence (representing a symmetric key).
     * - `k`: The symmetric key, base64url-encoded.
     * - `kid`: Key ID, generated based on the JWK thumbprint.
     *
     * @example
     * ```ts
     * const privateKeyBytes = new Uint8Array([...]); // Replace with actual symmetric key bytes
     * const privateKey = await AesKw.bytesToPrivateKey({ privateKeyBytes });
     * ```
     *
     * @param params - The parameters for the symmetric key conversion.
     * @param params.privateKeyBytes - The raw symmetric key as a Uint8Array.
     *
     * @returns A Promise that resolves to the symmetric key in JWK format.
     */
    static bytesToPrivateKey({ privateKeyBytes }: {
        privateKeyBytes: Uint8Array;
    }): Promise<Jwk>;
    /**
     * Generates a symmetric key for AES for key wrapping in JSON Web Key (JWK) format.
     *
     * @remarks
     * This method creates a new symmetric key of a specified length suitable for use with
     * AES key wrapping. It uses cryptographically secure random number generation to
     * ensure the uniqueness and security of the key. The generated key adheres to the JWK
     * format, making it compatible with common cryptographic standards and easy to use in
     * various cryptographic processes.
     *
     * The generated key includes the following components:
     * - `kty`: Key Type, set to 'oct' for Octet Sequence.
     * - `k`: The symmetric key component, base64url-encoded.
     * - `kid`: Key ID, generated based on the JWK thumbprint.
     * - `alg`: Algorithm, set to 'A128KW', 'A192KW', or 'A256KW' for AES Key Wrap with the
     *   specified key length.
     *
     * @example
     * ```ts
     * const length = 256; // Length of the key in bits (e.g., 128, 192, 256)
     * const privateKey = await AesKw.generateKey({ length });
     * ```
     *
     * @param params - The parameters for the key generation.
     * @param params.length - The length of the key in bits. Common lengths are 128, 192, and 256 bits.
     *
     * @returns A Promise that resolves to the generated symmetric key in JWK format.
     */
    static generateKey({ length }: {
        length: typeof AES_KEY_LENGTHS[number];
    }): Promise<Jwk>;
    /**
     * Converts a private key from JSON Web Key (JWK) format to a raw byte array (Uint8Array).
     *
     * @remarks
     * This method takes a symmetric key in JWK format and extracts its raw byte representation.
     * It decodes the 'k' parameter of the JWK value, which represents the symmetric key in base64url
     * encoding, into a byte array.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // A symmetric key in JWK format
     * const privateKeyBytes = await AesKw.privateKeyToBytes({ privateKey });
     * ```
     *
     * @param params - The parameters for the symmetric key conversion.
     * @param params.privateKey - The symmetric key in JWK format.
     *
     * @returns A Promise that resolves to the symmetric key as a Uint8Array.
     */
    static privateKeyToBytes({ privateKey }: {
        privateKey: Jwk;
    }): Promise<Uint8Array>;
    static unwrapKey({ wrappedKeyBytes, wrappedKeyAlgorithm, decryptionKey }: UnwrapKeyParams): Promise<Jwk>;
    static wrapKey({ unwrappedKey, encryptionKey }: WrapKeyParams): Promise<Uint8Array>;
}
export {};
//# sourceMappingURL=aes-kw.d.ts.map