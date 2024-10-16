import type { Jwk, AesGcmParams, KeyIdentifier, KmsSignParams, KmsDigestParams, KmsVerifyParams, KmsExportKeyParams, KmsGetKeyUriParams, KmsImportKeyParams, KmsGenerateKeyParams, KmsGetPublicKeyParams } from '@web5/crypto';
import type { AgentDataStore } from './store-data.js';
import type { Web5PlatformAgent } from './types/agent.js';
import type { AgentKeyManager } from './types/key-manager.js';
import type { InferType } from './prototyping/common/type-utils.js';
import type { KmsCipherParams, KmsUnwrapKeyParams, KmsWrapKeyParams } from './prototyping/crypto/types/params-kms.js';
type SupportedKeyGeneratorAlgorithm = 'Ed25519' | 'secp256k1' | 'ES256K' | 'secp256r1' | 'ES256' | 'A128GCM' | 'A192GCM' | 'A256GCM' | 'A128KW' | 'A192KW' | 'A256KW';
/**
 * The `LocalKmsParams` interface specifies the parameters for initializing an instance of
 * {@link LocalKeyManager}. It allows the optional inclusion of a {@link AgentDataStore} instance
 * for key management. If not provided, a default {@link InMemoryKeyStore} instance will be used for
 * storing keys. Note that the {@link InMemoryKeyStore} is not persistent and will be cleared when
 * the application exits.
 */
export type LocalKmsParams = {
    agent?: Web5PlatformAgent;
    /**
     * An optional property to specify a custom {@link AgentDataStore} instance for key management. If
     * not provided, {@link LocalKeyManager} uses a default {@link InMemoryKeyStore} instance. This
     * store is responsible for managing cryptographic keys, allowing them to be retrieved, stored,
     * and managed during cryptographic operations.
     */
    keyStore?: AgentDataStore<Jwk>;
};
/**
 * The `LocalKmsGenerateKeyParams` interface defines the algorithm-specific parameters that
 * should be passed into the {@link LocalKeyManager.generateKey | `LocalKeyManager.generateKey()`}
 * method when generating a key in the local KMS.
 */
export interface LocalKmsGenerateKeyParams extends KmsGenerateKeyParams {
    /**
     * A string defining the type of key to generate.
     */
    algorithm: InferType<SupportedKeyGeneratorAlgorithm>;
}
/**
 * The `LocalKmsUnwrapKeyParams` interface defines the algorithm-specific parameters that
 * should be passed into the {@link LocalKeyManager.wrapKey} method when wrapping a key using a
 * key stored in the local KMS to encrypt the key material.
 */
export interface LocalKmsUnwrapKeyParams extends KmsUnwrapKeyParams {
    /**
     * A string defining the type of wrapped key. The value must be one of the following:
     * - `"A128GCM"`: AES GCM using a 128-bit key.
     * - `"A192GCM"`: AES GCM using a 192-bit key.
     * - `"A256GCM"`: AES GCM using a 256-bit key.
     * - `"A128KW"`: AES Key Wrap using a 128-bit key.
     * - `"A192KW"`: AES Key Wrap using a 192-bit key.
     * - `"A256KW"`: AES Key Wrap using a 256-bit key.
     */
    wrappedKeyAlgorithm: 'A128GCM' | 'A192GCM' | 'A256GCM' | 'A128KW' | 'A192KW' | 'A256KW';
}
export declare class LocalKeyManager implements AgentKeyManager {
    /**
     * Holds the instance of a `Web5PlatformAgent` that represents the current execution context for
     * the `LocalKeyManager`. This agent is used to interact with other Web5 agent components. It's
     * vital to ensure this instance is set to correctly contextualize operations within the broader
     * Web5 Agent framework.
     */
    private _agent?;
    /**
     * A private map that stores instances of cryptographic algorithm implementations. Each key in
     * this map is an `AlgorithmConstructor`, and its corresponding value is an instance of a class
     * that implements a specific cryptographic algorithm. This map is used to cache and reuse
     * instances for performance optimization, ensuring that each algorithm is instantiated only once.
     */
    private _algorithmInstances;
    /**
     * The `_keyStore` private variable in `LocalKeyManager` is a {@link AgentDataStore} instance used
     * for storing and managing cryptographic keys. It allows the `LocalKeyManager` class to save,
     * retrieve, and handle keys efficiently within the local Key Management System (KMS) context.
     * This variable can be configured to use different storage backends, like in-memory storage or
     * persistent storage, providing flexibility in key management according to the application's
     * requirements.
     */
    private _keyStore;
    constructor({ agent, keyStore }?: LocalKmsParams);
    /**
     * Retrieves the `Web5PlatformAgent` execution context.
     *
     * @returns The `Web5PlatformAgent` instance that represents the current execution context.
     * @throws Will throw an error if the `agent` instance property is undefined.
     */
    get agent(): Web5PlatformAgent;
    set agent(agent: Web5PlatformAgent);
    decrypt({ keyUri, ...params }: KmsCipherParams & AesGcmParams): Promise<Uint8Array>;
    digest(_params: KmsDigestParams): Promise<Uint8Array>;
    encrypt({ keyUri, ...params }: KmsCipherParams & AesGcmParams): Promise<Uint8Array>;
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
    exportKey({ keyUri }: KmsExportKeyParams): Promise<Jwk>;
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
    generateKey({ algorithm: algorithmIdentifier }: LocalKmsGenerateKeyParams): Promise<KeyIdentifier>;
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
    getKeyUri({ key }: KmsGetKeyUriParams): Promise<KeyIdentifier>;
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
    getPublicKey({ keyUri }: KmsGetPublicKeyParams): Promise<Jwk>;
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
    importKey({ key }: KmsImportKeyParams): Promise<KeyIdentifier>;
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
    sign({ keyUri, data }: KmsSignParams): Promise<Uint8Array>;
    unwrapKey({ wrappedKeyBytes, wrappedKeyAlgorithm, decryptionKeyUri }: LocalKmsUnwrapKeyParams): Promise<Jwk>;
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
    verify({ key, signature, data }: KmsVerifyParams): Promise<boolean>;
    wrapKey({ unwrappedKey, encryptionKeyUri }: KmsWrapKeyParams): Promise<Uint8Array>;
    deleteKey({ keyUri }: {
        keyUri: KeyIdentifier;
    }): Promise<void>;
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
    private getAlgorithm;
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
    private getAlgorithmName;
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
    private getPrivateKey;
}
export {};
//# sourceMappingURL=local-key-manager.d.ts.map