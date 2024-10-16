var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CryptoAlgorithm } from '@web5/crypto';
import { AesKw } from '../primitives/aes-kw.js';
/**
 * The `AesKwAlgorithm` class provides a concrete implementation for cryptographic operations using
 * the AES algorithm for key wrapping. This class implements both
 * {@link KeyGenerator | `KeyGenerator`} and {@link KeyWrapper | `KeyWrapper`} interfaces, providing
 * key generation, key wrapping, and key unwrapping features.
 *
 * This class is typically accessed through implementations that extend the
 * {@link CryptoApi | `CryptoApi`} interface.
 */
export class AesKwAlgorithm extends CryptoAlgorithm {
    bytesToPrivateKey({ privateKeyBytes }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert the byte array to a JWK.
            const privateKey = yield AesKw.bytesToPrivateKey({ privateKeyBytes });
            // Set the `alg` property based on the key length.
            privateKey.alg = { 16: 'A128KW', 24: 'A192KW', 32: 'A256KW' }[privateKeyBytes.length];
            return privateKey;
        });
    }
    /**
     * Generates a symmetric key for AES for key wrapping in JSON Web Key (JWK) format.
     *
     * @remarks
     * This method generates a symmetric AES key for use in key wrapping mode, based on the specified
     * `algorithm` parameter which determines the key length. It uses cryptographically secure random
     * number generation to ensure the uniqueness and security of the key. The key is returned in JWK
     * format.
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
     * const aesKw = new AesKwAlgorithm();
     * const privateKey = await aesKw.generateKey({ algorithm: 'A256KW' });
     * ```
     *
     * @param params - The parameters for the key generation.
     *
     * @returns A Promise that resolves to the generated symmetric key in JWK format.
     */
    generateKey({ algorithm }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Map algorithm name to key length.
            const length = { A128KW: 128, A192KW: 192, A256KW: 256 }[algorithm];
            // Generate a random private key.
            const privateKey = yield AesKw.generateKey({ length });
            // Set the `alg` property based on the specified algorithm.
            privateKey.alg = algorithm;
            return privateKey;
        });
    }
    privateKeyToBytes({ privateKey }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert the JWK to a byte array.
            const privateKeyBytes = yield AesKw.privateKeyToBytes({ privateKey });
            return privateKeyBytes;
        });
    }
    /**
     * Decrypts a wrapped key using the AES Key Wrap algorithm.
     *
     * @remarks
     * This method unwraps a previously wrapped cryptographic key using the AES Key Wrap algorithm.
     * The wrapped key, provided as a byte array, is unwrapped using the decryption key specified in
     * the parameters.
     *
     * This operation is useful for securely receiving keys transmitted over untrusted mediums. The
     * method returns the unwrapped key as a JSON Web Key (JWK).
     *
     * @example
     * ```ts
     * const aesKw = new AesKwAlgorithm();
     * const wrappedKeyBytes = new Uint8Array([...]); // Byte array of a wrapped AES-256 GCM key
     * const decryptionKey = { ... }; // A Jwk object representing the AES unwrapping key
     * const unwrappedKey = await aesKw.unwrapKey({
     *   wrappedKeyBytes,
     *   wrappedKeyAlgorithm: 'A256GCM',
     *   decryptionKey
     * });
     * ```
     *
     * @param params - The parameters for the key unwrapping operation.
     *
     * @returns A Promise that resolves to the unwrapped key in JWK format.
     */
    unwrapKey(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const unwrappedKey = yield AesKw.unwrapKey(params);
            return unwrappedKey;
        });
    }
    /**
     * Encrypts a given key using the AES Key Wrap algorithm.
     *
     * @remarks
     * This method wraps a given cryptographic key using the AES Key Wrap algorithm. The private key
     * to be wrapped is provided in the form of a JSON Web Key (JWK).
     *
     * This operation is useful for securely transmitting keys over untrusted mediums. The method
     * returns the wrapped key as a byte array.
     *
     * @example
     * ```ts
     * const aesKw = new AesKwAlgorithm();
     * const unwrappedKey = { ... }; // A Jwk object representing the key to be wrapped
     * const encryptionKey = { ... }; // A Jwk object representing the AES wrapping key
     * const wrappedKeyBytes = await aesKw.wrapKey({ unwrappedKey, encryptionKey });
     * ```
     *
     * @param params - The parameters for the key wrapping operation.
     *
     * @returns A Promise that resolves to the wrapped key as a Uint8Array.
     */
    wrapKey(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedKeyBytes = AesKw.wrapKey(params);
            return wrappedKeyBytes;
        });
    }
}
//# sourceMappingURL=aes-kw.js.map