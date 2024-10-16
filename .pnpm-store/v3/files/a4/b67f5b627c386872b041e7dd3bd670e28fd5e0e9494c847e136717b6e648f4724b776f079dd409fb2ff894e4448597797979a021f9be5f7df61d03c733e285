var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Convert } from '@web5/common';
import { CryptoError, CryptoErrorCode } from '../crypto-error.js';
/**
 * Checks if the provided object is a valid JWE (JSON Web Encryption) header.
 *
 * This function evaluates whether the given object adheres to the structure expected for
 * a JWE header, specifically looking for the presence and proper format of the "alg" (algorithm)
 * and "enc" (encryption algorithm) properties, which are essential for defining the JWE's
 * cryptographic operations.
 *
 * @example
 * ```ts
 * const header = {
 *   alg: 'dir',
 *   enc: 'A256GCM'
 * };
 *
 * if (isValidJweHeader(header)) {
 *   console.log('The object is a valid JWE header.');
 * } else {
 *   console.log('The object is not a valid JWE header.');
 * }
 * ```
 *
 * @param obj - The object to be validated as a JWE header.
 * @returns Returns `true` if the object is a valid JWE header, otherwise `false`.
 */
export function isValidJweHeader(obj) {
    return typeof obj === 'object' && obj !== null
        && 'alg' in obj && obj.alg !== undefined
        && 'enc' in obj && obj.enc !== undefined;
}
/**
 * The `JweKeyManagement` class implements the key management aspects of JSON Web Encryption (JWE)
 * as specified in {@link https://datatracker.ietf.org/doc/html/rfc7516 | RFC 7516}.
 *
 * It supports algorithms for encrypting and decrypting keys, thereby enabling the secure
 * transmission of information where the payload is encrypted, and the encryption key is also
 * encrypted or agreed upon using key agreement techniques.
 *
 * The choice of algorithm is determined by the "alg" parameter in the JWE
 * header, and the class is designed to handle the intricacies associated with each algorithm,
 * ensuring the secure handling of the encryption keys.
 *
 * Supported algorithms include:
 * - `"dir"`: Direct Encryption Mode
 * - `"PBES2-HS256+A128KW"`, `"PBES2-HS384+A192KW"`, `"PBES2-HS512+A256KW"`: Password-Based
 *   Encryption Mode with Key Wrapping (PBES2) using HMAC-SHA and AES Key Wrap algorithms for key
 *   wrapping and encryption.
 *
 * @example
 * // To encrypt a key:
 * const keyEncryptionKey = Convert.string(passphrase).toUint8Array()
 * const { cek, encryptedKey: encryptedCek } = await JweKeyManagement.encrypt({
 *   key: keyEncryptionKey,
 *   joseHeader: {
 *     alg: 'PBES2-HS512+A256KW',
 *     enc: 'A256GCM',
 *     p2c : 210_000,
       p2s : Convert.uint8Array(saltInput).toBase64Url()
 *   },
 *   crypto: new AgentCryptoApi(),
 * });
 *
 * // To decrypt a key:
 * const cek = await JweKeyManagement.decrypt({
 *   key: keyEncryptionKey,
 *   encryptedKey: encryptedCek,
 *   joseHeader: {
 *     alg: 'PBES2-HS512+A256KW',
 *     enc: 'A256GCM',
 *     p2c : 210_000,
       p2s : Convert.uint8Array(saltInput).toBase64Url()
 *   },
 *   crypto: new AgentCryptoApi(),
 * });
 */
export class JweKeyManagement {
    /**
     * Decrypts the encrypted key (JWE Encrypted Key) using the specified key encryption algorithm
     * defined in the JWE Header's "alg" parameter.
     *
     * This method supports multiple key management algorithms, including Direct Encryption (dir) and
     * PBES2 schemes with key wrapping.
     *
     * The method takes a key, which can be a Key Identifier, JWK, or raw byte array, and the
     * encrypted key along with the JWE header. It returns the decrypted Content Encryption Key (CEK)
     * which can then be used to decrypt the JWE ciphertext.
     *
     * @example
     * ```ts
     * // Decrypting the CEK with the PBES2-HS512+A256KW algorithm
     * const cek = await JweKeyManagement.decrypt({
     *   key: Convert.string(passphrase).toUint8Array(),
     *   encryptedKey: encryptedCek,
     *   joseHeader: {
     *     alg: 'PBES2-HS512+A256KW',
     *     enc: 'A256GCM',
     *     p2c: 210_000,
     *     p2s: Convert.uint8Array(saltInput).toBase64Url(),
     *   },
     *   crypto: new AgentCryptoApi()
     * });
     * ```
     *
     * @param params - The decryption parameters.
     * @throws Throws an error if the key management algorithm is not supported or if required
     *         parameters are missing or invalid.
     */
    static decrypt({ key, encryptedKey, joseHeader, crypto }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the Key Management Mode employed by the algorithm specified by the "alg"
            // (algorithm) Header Parameter.
            switch (joseHeader.alg) {
                case 'dir': {
                    // In Direct Encryption mode, a JWE "Encrypted Key" is not provided. Instead, the
                    // provided key management `key` is directly used as the Content Encryption Key (CEK) to
                    // decrypt the JWE payload.
                    // Verify that the JWE Encrypted Key value is empty.
                    if (encryptedKey !== undefined) {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'JWE "encrypted_key" is not allowed when using "dir" (Direct Encryption Mode).');
                    }
                    // Verify the key management `key` is a Key Identifier or JWK.
                    if (key instanceof Uint8Array) {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'Key management "key" must be a Key URI or JWK when using "dir" (Direct Encryption Mode).');
                    }
                    // return the key management `key` as the CEK.
                    return key;
                }
                case 'PBES2-HS256+A128KW':
                case 'PBES2-HS384+A192KW':
                case 'PBES2-HS512+A256KW': {
                    // In Key Encryption mode (PBES2) with key wrapping (A128KW, A192KW, A256KW), the given
                    // passphrase, salt (p2s), and iteration count (p2c) are used with the PBKDF2 key derivation
                    // function to derive the Key Encryption Key (KEK).  The KEK is then used to decrypt the JWE
                    // Encrypted Key to obtain the Content Encryption Key (CEK).
                    if (typeof joseHeader.p2c !== 'number') {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'JOSE Header "p2c" (PBES2 Count) is missing or not a number.');
                    }
                    if (typeof joseHeader.p2s !== 'string') {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'JOSE Header "p2s" (PBES2 salt) is missing or not a string.');
                    }
                    // Throw an error if the key management `key` is not a byte array. For PBES2, the key is
                    // expected to be a low-entropy passphrase as a byte array.
                    if (!(key instanceof Uint8Array)) {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'Key management "key" must be a Uint8Array when using "PBES2" (Key Encryption Mode).');
                    }
                    // Verify that the JWE Encrypted Key value is present.
                    if (encryptedKey === undefined) {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'JWE "encrypted_key" is required when using "PBES2" (Key Encryption Mode).');
                    }
                    // Per {@link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.8.1.1 | RFC 7518, Section 4.8.1.1},
                    // the salt value used with PBES2 should be of the format (UTF8(Alg) || 0x00 || Salt Input),
                    // where Alg is the "alg" (algorithm) Header Parameter value. This reduces the potential for
                    // a precomputed dictionary attack (also known as a rainbow table attack).
                    let salt;
                    try {
                        salt = new Uint8Array([
                            ...Convert.string(joseHeader.alg).toUint8Array(),
                            0x00,
                            ...Convert.base64Url(joseHeader.p2s).toUint8Array()
                        ]);
                    }
                    catch (_a) {
                        throw new CryptoError(CryptoErrorCode.EncodingError, 'Failed to decode the JOSE Header "p2s" (PBES2 salt) value.');
                    }
                    // Derive the Key Encryption Key (KEK) from the given passphrase, salt, and iteration count.
                    const kek = yield crypto.deriveKey({
                        algorithm: joseHeader.alg,
                        baseKeyBytes: key,
                        iterations: joseHeader.p2c,
                        salt
                    });
                    if (!(kek.alg && ['A128KW', 'A192KW', 'A256KW'].includes(kek.alg))) {
                        throw new CryptoError(CryptoErrorCode.AlgorithmNotSupported, `Unsupported Key Encryption Algorithm (alg) value: ${kek.alg}`);
                    }
                    // Decrypt the Content Encryption Key (CEK) with the derived KEK.
                    return yield crypto.unwrapKey({
                        decryptionKey: kek,
                        wrappedKeyBytes: encryptedKey,
                        wrappedKeyAlgorithm: joseHeader.enc
                    });
                }
                default: {
                    throw new CryptoError(CryptoErrorCode.AlgorithmNotSupported, `Unsupported "alg" (Algorithm) Header Parameter value: ${joseHeader.alg}`);
                }
            }
        });
    }
    /**
     * Encrypts a Content Encryption Key (CEK) using the key management algorithm specified in the
     * JWE Header's "alg" parameter.
     *
     * This method supports various key management algorithms, including Direct Encryption (dir) and
     * PBES2 with key wrapping.
     *
     * It generates a random CEK for the specified encryption algorithm in the JWE header, which
     * can then be used to encrypt the actual payload. For algorithms that require an encrypted key,
     * it returns the CEK along with the encrypted key.
     *
     * @example
     * ```ts
     * // Encrypting the CEK with the PBES2-HS512+A256KW algorithm
     * const { cek, encryptedKey } = await JweKeyManagement.encrypt({
     *   key: Convert.string(passphrase).toUint8Array(),
     *   joseHeader: {
     *     alg: 'PBES2-HS512+A256KW',
     *     enc: 'A256GCM',
     *     p2c: 210_000,
     *     p2s: Convert.uint8Array(saltInput).toBase64Url(),
     *   },
     *   crypto: crypto: new AgentCryptoApi()
     * });
     * ```
     *
     * @param params - The encryption parameters.
     * @returns The encrypted key result containing the CEK and optionally the encrypted CEK
     *          (JWE Encrypted Key).
     * @throws Throws an error if the key management algorithm is not supported or if required
     *         parameters are missing or invalid.
     */
    static encrypt({ key, joseHeader, crypto }) {
        return __awaiter(this, void 0, void 0, function* () {
            let cek;
            let encryptedKey;
            // Determine the Key Management Mode employed by the algorithm specified by the "alg"
            // (algorithm) Header Parameter.
            switch (joseHeader.alg) {
                case 'dir': {
                    // In Direct Encryption mode (dir), a JWE "Encrypted Key" is not provided. Instead, the
                    // provided key management `key` is directly used as the Content Encryption Key (CEK) to
                    // decrypt the JWE payload.
                    // Verify that the JWE Encrypted Key value is empty.
                    if (encryptedKey !== undefined) {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'JWE "encrypted_key" is not allowed when using "dir" (Direct Encryption Mode).');
                    }
                    // Verify the key management `key` is a Key Identifier or JWK.
                    if (key instanceof Uint8Array) {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'Key management "key" must be a Key URI or JWK when using "dir" (Direct Encryption Mode).');
                    }
                    // Set the CEK to the key management `key`.
                    cek = key;
                    break;
                }
                case 'PBES2-HS256+A128KW':
                case 'PBES2-HS384+A192KW':
                case 'PBES2-HS512+A256KW': {
                    // In Key Encryption mode (PBES2) with key wrapping (A128KW, A192KW, A256KW), a randomly
                    // generated Content Encryption Key (CEK) is encrypted with a Key Encryption Key (KEK)
                    // derived from the given passphrase, salt (p2s), and iteration count (p2c) using the
                    // PBKDF2 key derivation function.
                    if (typeof joseHeader.p2c !== 'number') {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'JOSE Header "p2c" (PBES2 Count) is missing or not a number.');
                    }
                    if (typeof joseHeader.p2s !== 'string') {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'JOSE Header "p2s" (PBES2 salt) is missing or not a string.');
                    }
                    // Throw an error if the key management `key` is not a byte array.
                    if (!(key instanceof Uint8Array)) {
                        throw new CryptoError(CryptoErrorCode.InvalidJwe, 'Key management "key" must be a Uint8Array when using "PBES2" (Key Encryption Mode).');
                    }
                    // Generate a random Content Encryption Key (CEK) using the algorithm specified by the "enc"
                    // (encryption) Header Parameter.
                    cek = yield crypto.generateKey({ algorithm: joseHeader.enc });
                    // Per {@link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.8.1.1 | RFC 7518, Section 4.8.1.1},
                    // the salt value used with PBES2 should be of the format (UTF8(Alg) || 0x00 || Salt Input),
                    // where Alg is the "alg" (algorithm) Header Parameter value. This reduces the potential for
                    // a precomputed dictionary attack (also known as a rainbow table attack).
                    let salt;
                    try {
                        salt = new Uint8Array([
                            ...Convert.string(joseHeader.alg).toUint8Array(),
                            0x00,
                            ...Convert.base64Url(joseHeader.p2s).toUint8Array()
                        ]);
                    }
                    catch (_a) {
                        throw new CryptoError(CryptoErrorCode.EncodingError, 'Failed to decode the JOSE Header "p2s" (PBES2 salt) value.');
                    }
                    // Derive a Key Encryption Key (KEK) from the given passphrase, salt, and iteration count.
                    const kek = yield crypto.deriveKey({
                        algorithm: joseHeader.alg,
                        baseKeyBytes: key,
                        iterations: joseHeader.p2c,
                        salt
                    });
                    // Encrypt the randomly generated CEK with the derived Key Encryption Key (KEK).
                    encryptedKey = yield crypto.wrapKey({ encryptionKey: kek, unwrappedKey: cek });
                    break;
                }
                default: {
                    throw new CryptoError(CryptoErrorCode.AlgorithmNotSupported, `Unsupported "alg" (Algorithm) Header Parameter value: ${joseHeader.alg}`);
                }
            }
            return { cek, encryptedKey };
        });
    }
}
//# sourceMappingURL=jwe.js.map