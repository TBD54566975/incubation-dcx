var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Sha2Algorithm, computeJwkThumbprint } from '@web5/crypto';
import { HkdfAlgorithm } from './prototyping/crypto/algorithms/hkdf.js';
import { EcdsaAlgorithm } from './prototyping/crypto/algorithms/ecdsa.js';
import { EdDsaAlgorithm } from './prototyping/crypto/algorithms/eddsa.js';
import { AesKwAlgorithm } from './prototyping/crypto/algorithms/aes-kw.js';
import { Pbkdf2Algorithm } from './prototyping/crypto/algorithms/pbkdf2.js';
import { AesGcmAlgorithm } from './prototyping/crypto/algorithms/aes-gcm.js';
import { CryptoError, CryptoErrorCode } from './prototyping/crypto/crypto-error.js';
/**
 * `supportedAlgorithms` is an object mapping algorithm names to their respective implementations
 * Each entry in this map specifies the algorithm name and its associated properties, including the
 * implementation class and any relevant names or identifiers for the algorithm. This structure
 * allows for easy retrieval and instantiation of algorithm implementations based on the algorithm
 * name or key specification. It facilitates the support of multiple algorithms within the
 * `LocalKeyManager` class.
 */
const supportedAlgorithms = {
    'AES-GCM': {
        implementation: AesGcmAlgorithm,
        names: ['A128GCM', 'A192GCM', 'A256GCM'],
        operations: ['bytesToPrivateKey', 'decrypt', 'encrypt', 'generateKey'],
    },
    'AES-KW': {
        implementation: AesKwAlgorithm,
        names: ['A128KW', 'A192KW', 'A256KW'],
        operations: ['bytesToPrivateKey', 'generateKey', 'privateKeyToBytes', 'wrapKey', 'unwrapKey'],
    },
    'Ed25519': {
        implementation: EdDsaAlgorithm,
        names: ['Ed25519'],
        operations: ['bytesToPrivateKey', 'bytesToPublicKey', 'generateKey', 'sign', 'verify'],
    },
    'HKDF': {
        implementation: HkdfAlgorithm,
        names: ['HKDF-256', 'HKDF-384', 'HKDF-512'],
        operations: ['deriveKey', 'deriveKeyBytes'],
    },
    'PBKDF2': {
        implementation: Pbkdf2Algorithm,
        names: ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'],
        operations: ['deriveKey', 'deriveKeyBytes'],
    },
    'secp256k1': {
        implementation: EcdsaAlgorithm,
        names: ['ES256K', 'secp256k1'],
        operations: ['bytesToPrivateKey', 'bytesToPublicKey', 'generateKey', 'sign', 'verify'],
    },
    'secp256r1': {
        implementation: EcdsaAlgorithm,
        names: ['ES256', 'secp256r1'],
        operations: ['bytesToPrivateKey', 'bytesToPublicKey', 'generateKey', 'sign', 'verify'],
    },
    'SHA-256': {
        implementation: Sha2Algorithm,
        names: ['SHA-256'],
        operations: ['digest'],
    }
};
export class AgentCryptoApi {
    constructor() {
        /**
         * A private map that stores instances of cryptographic algorithm implementations. Each key in
         * this map is an `AlgorithmConstructor`, and its corresponding value is an instance of a class
         * that implements a specific cryptographic algorithm. This map is used to cache and reuse
         * instances for performance optimization, ensuring that each algorithm is instantiated only once.
         */
        this._algorithmInstances = new Map();
    }
    bytesToPrivateKey({ algorithm: algorithmIdentifier, privateKeyBytes }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the given algorithm identifier.
            const algorithm = this.getAlgorithmName({ algorithm: algorithmIdentifier });
            // Get the key converter based on the algorithm name.
            const keyConverter = this.getAlgorithm({ algorithm });
            // Convert the byte array to a JWK.
            const privateKey = yield keyConverter.bytesToPrivateKey({ algorithm: algorithmIdentifier, privateKeyBytes });
            return privateKey;
        });
    }
    bytesToPublicKey({ algorithm: algorithmIdentifier, publicKeyBytes }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the given algorithm identifier.
            const algorithm = this.getAlgorithmName({ algorithm: algorithmIdentifier });
            // Get the key converter based on the algorithm name.
            const keyConverter = this.getAlgorithm({ algorithm });
            // Convert the byte array to a JWK.
            const publicKey = yield keyConverter.bytesToPublicKey({ algorithm: algorithmIdentifier, publicKeyBytes });
            return publicKey;
        });
    }
    decrypt(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: params.key });
            // Get the cipher algorithm based on the algorithm name.
            const cipher = this.getAlgorithm({ algorithm });
            // Decrypt the data.
            return yield cipher.decrypt(params);
        });
    }
    deriveKey(params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the given algorithm identifier.
            const algorithm = this.getAlgorithmName({ algorithm: params.algorithm });
            // Get the key derivation function based on the algorithm name.
            const kdf = this.getAlgorithm({ algorithm });
            let derivedKeyAlgorithm;
            switch (params.algorithm) {
                case 'HKDF-256':
                case 'HKDF-384':
                case 'HKDF-512': {
                    derivedKeyAlgorithm = params.derivedKeyAlgorithm;
                    break;
                }
                case 'PBES2-HS256+A128KW':
                case 'PBES2-HS384+A192KW':
                case 'PBES2-HS512+A256KW': {
                    derivedKeyAlgorithm = params.algorithm.split(/[-+]/)[2];
                    break;
                }
                default:
                    throw new CryptoError(CryptoErrorCode.AlgorithmNotSupported, `The specified "algorithm" is not supported: ${params.algorithm}`);
            }
            // Determine the bit length of the derived key based on the given algorithm.
            const length = +((_b = (_a = derivedKeyAlgorithm.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : -1);
            if (length === -1) {
                throw new CryptoError(CryptoErrorCode.AlgorithmNotSupported, `The derived key algorithm" is not supported: ${derivedKeyAlgorithm}`);
            }
            // Derive the byte array.
            const privateKeyBytes = yield kdf.deriveKeyBytes(Object.assign(Object.assign({}, params), { length }));
            return yield this.bytesToPrivateKey({ algorithm: derivedKeyAlgorithm, privateKeyBytes });
        });
    }
    deriveKeyBytes(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the given algorithm identifier.
            const algorithm = this.getAlgorithmName({ algorithm: params.algorithm });
            // Get the key derivation function based on the algorithm name.
            const kdf = this.getAlgorithm({ algorithm });
            // Derive the byte array.
            const derivedKeyBytes = yield kdf.deriveKeyBytes(params);
            return derivedKeyBytes;
        });
    }
    /**
     * Generates a hash digest of the provided data.
     *
     * @remarks
     * A digest is the output of the hash function. It's a fixed-size string of bytes that uniquely
     * represents the data input into the hash function. The digest is often used for data integrity
     * checks, as any alteration in the input data results in a significantly different digest.
     *
     * It takes the algorithm identifier of the hash function and data to digest as input and returns
     * the digest of the data.
     *
     * @example
     * ```ts
     * const cryptoApi = new AgentCryptoApi();
     * const data = new Uint8Array([...]);
     * const digest = await cryptoApi.digest({ algorithm: 'SHA-256', data });
     * ```
     *
     * @param params - The parameters for the digest operation.
     * @param params.algorithm - The name of hash function to use.
     * @param params.data - The data to digest.
     *
     * @returns A Promise which will be fulfilled with the hash digest.
     */
    digest({ algorithm, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the hash function implementation based on the specified `algorithm` parameter.
            const hasher = this.getAlgorithm({ algorithm });
            // Compute the hash.
            const hash = yield hasher.digest({ algorithm, data });
            return hash;
        });
    }
    encrypt(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // If th
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: params.key });
            // Get the cipher algorithm based on the algorithm name.
            const cipher = this.getAlgorithm({ algorithm });
            // Encrypt the data and return the ciphertext.
            return yield cipher.encrypt(params);
        });
    }
    generateKey(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the given algorithm identifier.
            const algorithm = this.getAlgorithmName({ algorithm: params.algorithm });
            // Get the key generator implementation based on the algorithm.
            const keyGenerator = this.getAlgorithm({ algorithm });
            // Generate the key.
            const privateKey = yield keyGenerator.generateKey({ algorithm: params.algorithm });
            // If the key ID is undefined, set it to the JWK thumbprint.
            (_a = privateKey.kid) !== null && _a !== void 0 ? _a : (privateKey.kid = yield computeJwkThumbprint({ jwk: privateKey }));
            return privateKey;
        });
    }
    // ! TODO: Remove this once the `Dsa` interface is updated in @web5/crypto to remove KMS-specific methods.
    getKeyUri(_params) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    getPublicKey({ key }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the JWK's `alg` and `crv` properties.
            const algorithm = this.getAlgorithmName({ key });
            // Get the key generator based on the algorithm name.
            const keyGenerator = this.getAlgorithm({ algorithm });
            // Get the public key properties from the private JWK.
            const publicKey = yield keyGenerator.getPublicKey({ key });
            return publicKey;
        });
    }
    privateKeyToBytes({ privateKey }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: privateKey });
            // Get the key converter based on the algorithm name.
            const keyConverter = this.getAlgorithm({ algorithm });
            // Convert the JWK to a byte array.
            const privateKeyBytes = yield keyConverter.privateKeyToBytes({ privateKey });
            return privateKeyBytes;
        });
    }
    publicKeyToBytes({ publicKey }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: publicKey });
            // Get the key converter based on the algorithm name.
            const keyConverter = this.getAlgorithm({ algorithm });
            // Convert the JWK to a byte array.
            const publicKeyBytes = yield keyConverter.publicKeyToBytes({ publicKey });
            return publicKeyBytes;
        });
    }
    sign({ key, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the JWK's `alg` and `crv` properties.
            const algorithm = this.getAlgorithmName({ key });
            // Get the signature algorithm based on the algorithm name.
            const signer = this.getAlgorithm({ algorithm });
            // Sign the data.
            const signature = signer.sign({ data, key });
            return signature;
        });
    }
    unwrapKey(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: params.decryptionKey });
            // Get the key wrapping algorithm based on the algorithm name.
            const keyWrapper = this.getAlgorithm({ algorithm });
            // decrypt the key and return the ciphertext.
            return yield keyWrapper.unwrapKey(params);
        });
    }
    verify({ key, signature, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the JWK's `alg` and `crv` properties.
            const algorithm = this.getAlgorithmName({ key });
            // Get the signature algorithm based on the algorithm name.
            const signer = this.getAlgorithm({ algorithm });
            // Verify the signature.
            const isSignatureValid = signer.verify({ key, signature, data });
            return isSignatureValid;
        });
    }
    wrapKey(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: params.encryptionKey });
            // Get the key wrapping algorithm based on the algorithm name.
            const keyWrapper = this.getAlgorithm({ algorithm });
            // Encrypt the key and return the ciphertext.
            return yield keyWrapper.wrapKey(params);
        });
    }
    /**
     * Retrieves an algorithm implementation instance based on the provided algorithm name.
     *
     * @remarks
     * This method checks if the requested algorithm is supported and returns a cached instance
     * if available. If an instance does not exist, it creates and caches a new one. This approach
     * optimizes performance by reusing algorithm instances across cryptographic operations.
     *
     * @example
     * ```ts
     * const signer = this.getAlgorithm({ algorithm: 'Ed25519' });
     * ```
     *
     * @param params - The parameters for retrieving the algorithm implementation.
     * @param params.algorithm - The name of the algorithm to retrieve.
     *
     * @returns An instance of the requested algorithm implementation.
     *
     * @throws Error if the requested algorithm is not supported.
     */
    getAlgorithm({ algorithm }) {
        var _a;
        // Check if algorithm is supported.
        const AlgorithmImplementation = (_a = supportedAlgorithms[algorithm]) === null || _a === void 0 ? void 0 : _a['implementation'];
        if (!AlgorithmImplementation) {
            throw new CryptoError(CryptoErrorCode.AlgorithmNotSupported, `Algorithm not supported: ${algorithm}`);
        }
        // Check if instance already exists for the `AlgorithmImplementation`.
        if (!this._algorithmInstances.has(AlgorithmImplementation)) {
            // If not, create a new instance and store it in the cache
            this._algorithmInstances.set(AlgorithmImplementation, new AlgorithmImplementation());
        }
        // Return the cached instance
        return this._algorithmInstances.get(AlgorithmImplementation);
    }
    getAlgorithmName({ algorithm, key }) {
        var _a;
        const algProperty = (_a = key === null || key === void 0 ? void 0 : key.alg) !== null && _a !== void 0 ? _a : algorithm;
        const crvProperty = key === null || key === void 0 ? void 0 : key.crv;
        for (const algorithmIdentifier of Object.keys(supportedAlgorithms)) {
            const algorithmNames = supportedAlgorithms[algorithmIdentifier].names;
            if (algProperty && algorithmNames.includes(algProperty)) {
                return algorithmIdentifier;
            }
            else if (crvProperty && algorithmNames.includes(crvProperty)) {
                return algorithmIdentifier;
            }
        }
        throw new CryptoError(CryptoErrorCode.AlgorithmNotSupported, `Algorithm not supported based on provided input: alg=${algProperty}, crv=${crvProperty}. ` +
            'Please check the documentation for the list of supported algorithms.');
    }
}
//# sourceMappingURL=crypto-api.js.map