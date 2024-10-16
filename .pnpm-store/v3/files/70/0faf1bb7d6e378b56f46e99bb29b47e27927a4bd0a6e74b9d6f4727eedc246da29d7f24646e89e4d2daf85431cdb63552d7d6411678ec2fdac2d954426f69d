var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LocalKeyManager } from '@web5/crypto';
import { isValidJweHeader } from './jwe.js';
import { FlattenedJwe } from './jwe-flattened.js';
import { AgentCryptoApi } from '../../../crypto-api.js';
import { CryptoError, CryptoErrorCode } from '../crypto-error.js';
/**
 * The `CompactJwe` class facilitates encryption and decryption processes using the JSON Web
 * Encryption (JWE) Compact Serialization format. This class adheres to the specifications
 * outlined in {@link https://datatracker.ietf.org/doc/html/rfc7516 | RFC 7516}, enabling secure
 * data encapsulation through various cryptographic algorithms.
 *
 * Compact Serialization is a space-efficient representation of JWE, suitable for contexts
 * where verbose data structures are impractical, such as HTTP headers. It provides mechanisms to
 * encrypt content and protect its integrity with authenticated encryption, ensuring
 * confidentiality, authenticity, and non-repudiation.
 *
 * This class supports the following operations:
 * - Decrypting data from a compact serialized JWE string.
 * - Encrypting data and producing a compact serialized JWE string.
 *
 * Usage involves specifying the cryptographic details, such as keys and algorithms, and the class
 * handles the complexities of the JWE processing, including parsing, validating, and applying the
 * cryptographic operations defined in the JWE specification.
 *
 * @example
 * ```ts
 *  // Example usage of encrypt method
 * const plaintext = new TextEncoder().encode("Secret Message");
 * const key = { kty: "oct", k: "your-secret-key" }; // Example symmetric key
 * const protectedHeader = { alg: "dir", enc: "A256GCM" };
 * const encryptedJweString = await CompactJwe.encrypt({
 *   plaintext,
 *   protectedHeader,
 *   key,
 * });
 * console.log(encryptedJweString); // Outputs the JWE string in Compact Serialization format
 * ```
 *
 * @example
 * ```ts
 * // Example usage of decrypt method
 * const jweString = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // A JWE in Compact Serialization
 * const decryptionKey = { kty: "oct", k: "your-secret-key" }; // The key must match the one used for encryption
 * const { plaintext, protectedHeader } = await CompactJwe.decrypt({
 *   jwe: jweString,
 *   key: decryptionKey,
 * });
 * console.log(new TextDecoder().decode(plaintext)); // Outputs the decrypted message
 * ```
 */
export class CompactJwe {
    /**
     * Decrypts a JWE string in Compact Serialization format, extracting the plaintext and
     * reconstructing the JWE Protected Header.
     *
     * This method parses the compact JWE, validates its structure, and applies the appropriate
     * decryption algorithm as specified in the JWE Protected Header. It returns the decrypted
     * plaintext along with the reconstructed protected header, ensuring the data's authenticity
     * and integrity.
     *
     * @param params - The decryption parameters including the JWE string, cryptographic key, and
     *                 optional instances of Key Manager and Crypto API.
     * @returns A promise resolving to the decrypted content and the JWE Protected Header.
     * @throws {@link CryptoError} if the JWE format is invalid or decryption fails.
     */
    static decrypt({ jwe, key, keyManager = new LocalKeyManager(), crypto = new AgentCryptoApi(), options = {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof jwe !== 'string') {
                throw new CryptoError(CryptoErrorCode.InvalidJwe, 'Invalid JWE format. JWE must be a string.');
            }
            // Split the JWE into its constituent parts.
            const { 0: protectedHeader, 1: encryptedKey, 2: initializationVector, 3: ciphertext, 4: authenticationTag, length, } = jwe.split('.');
            // Ensure that the JWE has the required number of parts.
            if (length !== 5) {
                throw new CryptoError(CryptoErrorCode.InvalidJwe, 'Invalid JWE format. JWE must have 5 parts.');
            }
            // Decrypt the JWE using the provided Key URI.
            const flattenedJwe = yield FlattenedJwe.decrypt({
                jwe: {
                    ciphertext,
                    encrypted_key: encryptedKey || undefined,
                    iv: initializationVector || undefined,
                    protected: protectedHeader,
                    tag: authenticationTag || undefined,
                },
                key,
                keyManager,
                crypto,
                options
            });
            if (!isValidJweHeader(flattenedJwe.protectedHeader)) {
                throw new CryptoError(CryptoErrorCode.InvalidJwe, 'Decrypt operation failed due to missing or malformed JWE Protected Header');
            }
            return { plaintext: flattenedJwe.plaintext, protectedHeader: flattenedJwe.protectedHeader };
        });
    }
    /**
     * Encrypts plaintext to a JWE string in Compact Serialization format, encapsulating the content
     * with the specified cryptographic protections.
     *
     * It constructs the JWE by encrypting the plaintext, then serializing the output to the
     * compact format, which includes concatenating various components like the protected header,
     * encrypted key, initialization vector, ciphertext, and authentication tag.
     *
     * @param params - The encryption parameters, including plaintext, JWE Protected Header,
     *                 cryptographic key, and optional Key Manager and Crypto API instances.
     * @returns A promise that resolves to a string representing the JWE in Compact Serialization
     *          format.
     * @throws {@link CryptoError} if encryption fails or the input parameters are invalid.
     */
    static encrypt({ plaintext, protectedHeader, key, keyManager = new LocalKeyManager(), crypto = new AgentCryptoApi(), options = {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwe = yield FlattenedJwe.encrypt({ plaintext, protectedHeader, key, keyManager, crypto, options });
            // Create the Compact Serialization, which is the string BASE64URL(UTF8(JWE Protected Header))
            // || '.' || BASE64URL(JWE Encrypted Key) || '.' || BASE64URL(JWE Initialization Vector)
            // || '.' || BASE64URL(JWE Ciphertext) || '.' || BASE64URL(JWE Authentication Tag).
            return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join('.');
        });
    }
}
//# sourceMappingURL=jwe-compact.js.map