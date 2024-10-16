var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { isPrivateJwk, Sha2Algorithm, EcdsaAlgorithm, EdDsaAlgorithm, AesGcmAlgorithm, KEY_URI_PREFIX_JWK, computeJwkThumbprint, } from '@web5/crypto';
import { InMemoryKeyStore } from './store-key.js';
import { AesKwAlgorithm } from './prototyping/crypto/algorithms/aes-kw.js';
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
    },
    'AES-KW': {
        implementation: AesKwAlgorithm,
        names: ['A128KW', 'A192KW', 'A256KW'],
    },
    'Ed25519': {
        implementation: EdDsaAlgorithm,
        names: ['Ed25519'],
    },
    'secp256k1': {
        implementation: EcdsaAlgorithm,
        names: ['ES256K', 'secp256k1'],
    },
    'secp256r1': {
        implementation: EcdsaAlgorithm,
        names: ['ES256', 'secp256r1'],
    },
    'SHA-256': {
        implementation: Sha2Algorithm,
        names: ['SHA-256']
    }
};
export class LocalKeyManager {
    constructor({ agent, keyStore } = {}) {
        /**
         * A private map that stores instances of cryptographic algorithm implementations. Each key in
         * this map is an `AlgorithmConstructor`, and its corresponding value is an instance of a class
         * that implements a specific cryptographic algorithm. This map is used to cache and reuse
         * instances for performance optimization, ensuring that each algorithm is instantiated only once.
         */
        this._algorithmInstances = new Map();
        this._agent = agent;
        this._keyStore = keyStore !== null && keyStore !== void 0 ? keyStore : new InMemoryKeyStore();
    }
    /**
     * Retrieves the `Web5PlatformAgent` execution context.
     *
     * @returns The `Web5PlatformAgent` instance that represents the current execution context.
     * @throws Will throw an error if the `agent` instance property is undefined.
     */
    get agent() {
        if (this._agent === undefined) {
            throw new Error('LocalKeyManager: Unable to determine agent execution context.');
        }
        return this._agent;
    }
    set agent(agent) {
        this._agent = agent;
    }
    decrypt(_a) {
        var { keyUri } = _a, params = __rest(_a, ["keyUri"]);
        return __awaiter(this, void 0, void 0, function* () {
            // Get the private key from the key store.
            const privateKey = yield this.getPrivateKey({ keyUri });
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: privateKey });
            // Get the cipher algorithm based on the algorithm name.
            const cipher = this.getAlgorithm({ algorithm });
            // Encrypt the data.
            const ciphertext = yield cipher.decrypt(Object.assign({ key: privateKey }, params));
            return ciphertext;
        });
    }
    digest(_params) {
        throw new Error('Method not implemented.');
    }
    encrypt(_a) {
        var { keyUri } = _a, params = __rest(_a, ["keyUri"]);
        return __awaiter(this, void 0, void 0, function* () {
            // Get the private key from the key store.
            const privateKey = yield this.getPrivateKey({ keyUri });
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: privateKey });
            // Get the cipher algorithm based on the algorithm name.
            const cipher = this.getAlgorithm({ algorithm });
            // Encrypt the data.
            const ciphertext = yield cipher.encrypt(Object.assign({ key: privateKey }, params));
            return ciphertext;
        });
    }
    /**
     * Exports a private key identified by the provided key URI from the local KMS.
     *
     * @remarks
     * This method retrieves the key from the key store and returns it. It is primarily used
     * for extracting keys for backup or transfer purposes.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const privateKey = await keyManager.exportKey({ keyUri });
     * ```
     *
     * @param params - Parameters for exporting the key.
     * @param params.keyUri - The key URI identifying the key to export.
     *
     * @returns A Promise resolving to the JWK representation of the exported key.
     */
    exportKey({ keyUri }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the private key from the key store.
            const privateKey = yield this.getPrivateKey({ keyUri });
            return privateKey;
        });
    }
    /**
     * Generates a new cryptographic key in the local KMS with the specified algorithm and returns a
     * unique key URI which can be used to reference the key in subsequent operations.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * console.log(keyUri); // Outputs the key URI
     * ```
     *
     * @param params - The parameters for key generation.
     * @param params.algorithm - The algorithm to use for key generation, defined in `SupportedAlgorithm`.
     *
     * @returns A Promise that resolves to the key URI, a unique identifier for the generated key.
     */
    generateKey({ algorithm: algorithmIdentifier }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the algorithm name based on the given algorithm identifier.
            const algorithm = this.getAlgorithmName({ key: { alg: algorithmIdentifier } });
            // Get the key generator implementation based on the algorithm.
            const keyGenerator = this.getAlgorithm({ algorithm });
            // Generate the key.
            const privateKey = yield keyGenerator.generateKey({ algorithm: algorithmIdentifier });
            // If the key ID is undefined, set it to the JWK thumbprint.
            (_a = privateKey.kid) !== null && _a !== void 0 ? _a : (privateKey.kid = yield computeJwkThumbprint({ jwk: privateKey }));
            // Compute the key URI for the key.
            const keyUri = yield this.getKeyUri({ key: privateKey });
            // Store the key in the key store.
            yield this._keyStore.set({
                id: keyUri,
                data: privateKey,
                agent: this.agent,
                preventDuplicates: false,
                useCache: true
            });
            return keyUri;
        });
    }
    /**
     * Computes the Key URI for a given public JWK (JSON Web Key).
     *
     * @remarks
     * This method generates a {@link https://datatracker.ietf.org/doc/html/rfc3986 | URI}
     * (Uniform Resource Identifier) for the given JWK, which uniquely identifies the key across all
     * `CryptoApi` implementations. The key URI is constructed by appending the
     * {@link https://datatracker.ietf.org/doc/html/rfc7638 | JWK thumbprint} to the prefix
     * `urn:jwk:`. The JWK thumbprint is deterministically computed from the JWK and is consistent
     * regardless of property order or optional property inclusion in the JWK. This ensures that the
     * same key material represented as a JWK will always yield the same thumbprint, and therefore,
     * the same key URI.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const publicKey = await keyManager.getPublicKey({ keyUri });
     * const keyUriFromPublicKey = await keyManager.getKeyUri({ key: publicKey });
     * console.log(keyUri === keyUriFromPublicKey); // Outputs `true`
     * ```
     *
     * @param params - The parameters for getting the key URI.
     * @param params.key - The JWK for which to compute the key URI.
     *
     * @returns A Promise that resolves to the key URI as a string.
     */
    getKeyUri({ key }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Compute the JWK thumbprint.
            const jwkThumbprint = yield computeJwkThumbprint({ jwk: key });
            // Construct the key URI by appending the JWK thumbprint to the key URI prefix.
            const keyUri = `${KEY_URI_PREFIX_JWK}${jwkThumbprint}`;
            return keyUri;
        });
    }
    /**
     * Retrieves the public key associated with a previously generated private key, identified by
     * the provided key URI.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const publicKey = await keyManager.getPublicKey({ keyUri });
     * ```
     *
     * @param params - The parameters for retrieving the public key.
     * @param params.keyUri - The key URI of the private key to retrieve the public key for.
     *
     * @returns A Promise that resolves to the public key in JWK format.
     */
    getPublicKey({ keyUri }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the private key from the key store.
            const privateKey = yield this.getPrivateKey({ keyUri });
            // Determine the algorithm name based on the JWK's `alg` and `crv` properties.
            const algorithm = this.getAlgorithmName({ key: privateKey });
            // Get the key generator based on the algorithm name.
            const keyGenerator = this.getAlgorithm({ algorithm });
            // Get the public key properties from the private JWK.
            const publicKey = yield keyGenerator.getPublicKey({ key: privateKey });
            return publicKey;
        });
    }
    /**
     * Imports a private key into the local KMS.
     *
     * @remarks
     * This method stores the provided JWK in the key store, making it available for subsequent
     * cryptographic operations. It is particularly useful for initializing the KMS with pre-existing
     * keys or for restoring keys from backups.
     *
     * Note that, if defined, the `kid` (key ID) property of the JWK is used as the key URI for the
     * imported key. If the `kid` property is not provided, the key URI is computed from the JWK
     * thumbprint of the key.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const privateKey = { ... } // A private key in JWK format
     * const keyUri = await keyManager.importKey({ key: privateKey });
     * ```
     *
     * @param params - Parameters for importing the key.
     * @param params.key - The private key to import to in JWK format.
     *
     * @returns A Promise resolving to the key URI, uniquely identifying the imported key.
     */
    importKey({ key }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!isPrivateJwk(key))
                throw new TypeError('Invalid key provided. Must be a private key in JWK format.');
            // Make a deep copy of the key to avoid mutating the original.
            const privateKey = structuredClone(key);
            // If the key ID is undefined, set it to the JWK thumbprint.
            (_a = privateKey.kid) !== null && _a !== void 0 ? _a : (privateKey.kid = yield computeJwkThumbprint({ jwk: privateKey }));
            // Compute the key URI for the key.
            const keyUri = yield this.getKeyUri({ key: privateKey });
            // Store the key in the key store.
            yield this._keyStore.set({
                id: keyUri,
                data: privateKey,
                agent: this.agent,
                preventDuplicates: true,
                useCache: true
            });
            return keyUri;
        });
    }
    /**
     * Signs the provided data using the private key identified by the provided key URI.
     *
     * @remarks
     * This method uses the signature algorithm determined by the `alg` and/or `crv` properties of the
     * private key identified by the provided key URI to sign the provided data. The signature can
     * later be verified by parties with access to the corresponding public key, ensuring that the
     * data has not been tampered with and was indeed signed by the holder of the private key.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const data = new TextEncoder().encode('Message to sign');
     * const signature = await keyManager.sign({ keyUri, data });
     * ```
     *
     * @param params - The parameters for the signing operation.
     * @param params.keyUri - The key URI of the private key to use for signing.
     * @param params.data - The data to sign.
     *
     * @returns A Promise resolving to the digital signature as a `Uint8Array`.
     */
    sign({ keyUri, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the private key from the key store.
            const privateKey = yield this.getPrivateKey({ keyUri });
            // Determine the algorithm name based on the JWK's `alg` and `crv` properties.
            const algorithm = this.getAlgorithmName({ key: privateKey });
            // Get the signature algorithm based on the algorithm name.
            const signer = this.getAlgorithm({ algorithm });
            // Sign the data.
            const signature = signer.sign({ data, key: privateKey });
            return signature;
        });
    }
    unwrapKey({ wrappedKeyBytes, wrappedKeyAlgorithm, decryptionKeyUri }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the private key from the key store.
            const decryptionKey = yield this.getPrivateKey({ keyUri: decryptionKeyUri });
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: decryptionKey });
            // Get the key wrapping algorithm based on the algorithm name.
            const keyWrapper = this.getAlgorithm({ algorithm });
            // Decrypt the key.
            const unwrappedKey = yield keyWrapper.unwrapKey({ wrappedKeyBytes, wrappedKeyAlgorithm, decryptionKey });
            return unwrappedKey;
        });
    }
    /**
     * Verifies a digital signature associated the provided data using the provided key.
     *
     * @remarks
     * This method uses the signature algorithm determined by the `alg` and/or `crv` properties of the
     * provided key to check the validity of a digital signature against the original data. It
     * confirms whether the signature was created by the holder of the corresponding private key and
     * that the data has not been tampered with.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const data = new TextEncoder().encode('Message to sign');
     * const signature = await keyManager.sign({ keyUri, data });
     * const isSignatureValid = await keyManager.verify({ keyUri, data, signature });
     * ```
     *
     * @param params - The parameters for the verification operation.
     * @param params.key - The key to use for verification.
     * @param params.signature - The signature to verify.
     * @param params.data - The data to verify.
     *
     * @returns A Promise resolving to a boolean indicating whether the signature is valid.
     */
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
    wrapKey({ unwrappedKey, encryptionKeyUri }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the private key from the key store.
            const encryptionKey = yield this.getPrivateKey({ keyUri: encryptionKeyUri });
            // Determine the algorithm name based on the JWK's `alg` property.
            const algorithm = this.getAlgorithmName({ key: encryptionKey });
            // Get the key wrapping algorithm based on the algorithm name.
            const keyWrapper = this.getAlgorithm({ algorithm });
            // Encrypt the key.
            const wrappedKeyBytes = yield keyWrapper.wrapKey({ unwrappedKey, encryptionKey });
            return wrappedKeyBytes;
        });
    }
    deleteKey({ keyUri }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the private key from the key store.
            const jwk = yield this._keyStore.get({ id: keyUri, agent: this.agent, useCache: true });
            if (!jwk) {
                throw new Error(`Key not found: ${keyUri}`);
            }
            yield this._keyStore.delete({ id: keyUri, agent: this.agent });
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
    /**
     * Determines the algorithm name based on the key's properties.
     *
     * @remarks
     * This method facilitates the identification of the correct algorithm for cryptographic
     * operations based on the `alg` or `crv` properties of a {@link Jwk | JWK}.
     *
     * @example
     * ```ts
     * const publicKey = { ... }; // Public key in JWK format
     * const algorithm = this.getAlgorithmName({ key: publicKey });
     * ```
     *
     * @param params - The parameters for determining the algorithm name.
     * @param params.key - A JWK containing the `alg` or `crv` properties.
     *
     * @returns The algorithm name associated with the key.
     *
     * @throws Error if the algorithm name cannot be determined from the provided input.
     */
    getAlgorithmName({ key }) {
        const algProperty = key.alg;
        const crvProperty = key.crv;
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
    /**
     * Retrieves a private key from the key store based on the provided key URI.
     *
     * @example
     * ```ts
     * const privateKey = this.getPrivateKey({ keyUri: 'urn:jwk:...' });
     * ```
     *
     * @param params - Parameters for retrieving the private key.
     * @param params.keyUri - The key URI identifying the private key to retrieve.
     *
     * @returns A Promise resolving to the JWK representation of the private key.
     *
     * @throws Error if the key is not found in the key store.
     */
    getPrivateKey({ keyUri }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the private key from the key store.
            const privateKey = yield this._keyStore.get({ id: keyUri, agent: this.agent, useCache: true });
            if (!privateKey) {
                throw new Error(`Key not found: ${keyUri}`);
            }
            return privateKey;
        });
    }
}
//# sourceMappingURL=local-key-manager.js.map