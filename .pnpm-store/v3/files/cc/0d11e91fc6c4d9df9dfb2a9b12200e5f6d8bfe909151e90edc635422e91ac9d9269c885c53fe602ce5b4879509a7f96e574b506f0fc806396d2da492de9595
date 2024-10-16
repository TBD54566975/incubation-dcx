import type { Jwk, SignParams, DigestParams, VerifyParams, GenerateKeyParams, GetPublicKeyParams, KmsGetKeyUriParams } from '@web5/crypto';
import { Sha2Algorithm } from '@web5/crypto';
import type { DsaApi } from './types/crypto-api.js';
import type { BytesToPrivateKeyParams, BytesToPublicKeyParams } from './types/params-direct.js';
import { EcdsaAlgorithm } from './algorithms/ecdsa.js';
import { EdDsaAlgorithm } from './algorithms/eddsa.js';
export interface DsaBytesToPrivateKeyParams extends BytesToPrivateKeyParams {
    algorithm: KeyConversionAlgorithm;
}
export interface DsaBytesToPublicKeyParams extends BytesToPublicKeyParams {
    algorithm: AsymmetricKeyConversionAlgorithm;
}
/**
 * The `DsaDigestParams` interface defines the algorithm-specific parameters that should
 * be passed into the {@link AgentDsa.digest | `AgentDsa.digest()`} method.
 */
export interface DsaDigestParams extends DigestParams {
    /**
     * A string defining the name of hash function to use. The value must be one of the following:
     * - `"SHA-256"`: Generates a 256-bit digest.
     */
    algorithm: DigestAlgorithm;
}
export interface DsaGenerateKeyParams extends GenerateKeyParams {
    algorithm: KeyGenerationAlgorithm;
}
/**
 * `supportedAlgorithms` is an object mapping algorithm names to their respective implementations
 * Each entry in this map specifies the algorithm name and its associated properties, including the
 * implementation class and any relevant names or identifiers for the algorithm. This structure
 * allows for easy retrieval and instantiation of algorithm implementations based on the algorithm
 * name or key specification. It facilitates the support of multiple algorithms within the
 * `LocalKeyManager` class.
 */
declare const supportedAlgorithms: {
    readonly Ed25519: {
        readonly implementation: typeof EdDsaAlgorithm;
        readonly names: readonly ["Ed25519"];
        readonly operations: readonly ["bytesToPrivateKey", "bytesToPublicKey", "generateKey", "sign", "verify"];
    };
    readonly secp256k1: {
        readonly implementation: typeof EcdsaAlgorithm;
        readonly names: readonly ["ES256K", "secp256k1"];
        readonly operations: readonly ["bytesToPrivateKey", "bytesToPublicKey", "generateKey", "sign", "verify"];
    };
    readonly secp256r1: {
        readonly implementation: typeof EcdsaAlgorithm;
        readonly names: readonly ["ES256", "secp256r1"];
        readonly operations: readonly ["bytesToPrivateKey", "bytesToPublicKey", "generateKey", "sign", "verify"];
    };
    readonly 'SHA-256': {
        readonly implementation: typeof Sha2Algorithm;
        readonly names: readonly ["SHA-256"];
        readonly operations: readonly ["digest"];
    };
};
type SupportedAlgorithms = typeof supportedAlgorithms;
type DigestAlgorithms = {
    [K in keyof SupportedAlgorithms]: 'digest' extends SupportedAlgorithms[K]['operations'][number] ? K : never;
}[keyof SupportedAlgorithms];
type DigestAlgorithm = typeof supportedAlgorithms[DigestAlgorithms]['names'][number];
type KeyConversionAlgorithms = {
    [K in keyof SupportedAlgorithms]: 'bytesToPrivateKey' extends SupportedAlgorithms[K]['operations'][number] ? K : never;
}[keyof SupportedAlgorithms];
type KeyConversionAlgorithm = typeof supportedAlgorithms[KeyConversionAlgorithms]['names'][number];
type AsymmetricKeyConversionAlgorithms = {
    [K in keyof SupportedAlgorithms]: 'bytesToPublicKey' extends SupportedAlgorithms[K]['operations'][number] ? K : never;
}[keyof SupportedAlgorithms];
type AsymmetricKeyConversionAlgorithm = typeof supportedAlgorithms[AsymmetricKeyConversionAlgorithms]['names'][number];
type KeyGenerationAlgorithms = {
    [K in keyof SupportedAlgorithms]: 'generateKey' extends SupportedAlgorithms[K]['operations'][number] ? K : never;
}[keyof SupportedAlgorithms];
type KeyGenerationAlgorithm = typeof supportedAlgorithms[KeyGenerationAlgorithms]['names'][number];
export declare class Dsa implements DsaApi<DsaGenerateKeyParams, Jwk, GetPublicKeyParams, DsaDigestParams, SignParams, VerifyParams> {
    /**
     * A private map that stores instances of cryptographic algorithm implementations. Each key in
     * this map is an `AlgorithmConstructor`, and its corresponding value is an instance of a class
     * that implements a specific cryptographic algorithm. This map is used to cache and reuse
     * instances for performance optimization, ensuring that each algorithm is instantiated only once.
     */
    private _algorithmInstances;
    bytesToPrivateKey({ algorithm: algorithmIdentifier, privateKeyBytes }: DsaBytesToPrivateKeyParams): Promise<Jwk>;
    bytesToPublicKey({ algorithm: algorithmIdentifier, publicKeyBytes }: DsaBytesToPublicKeyParams): Promise<Jwk>;
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
     * const Dsa = new AgentDsa();
     * const data = new Uint8Array([...]);
     * const digest = await Dsa.digest({ algorithm: 'SHA-256', data });
     * ```
     *
     * @param params - The parameters for the digest operation.
     * @param params.algorithm - The name of hash function to use.
     * @param params.data - The data to digest.
     *
     * @returns A Promise which will be fulfilled with the hash digest.
     */
    digest({ algorithm, data }: DsaDigestParams): Promise<Uint8Array>;
    generateKey(params: DsaGenerateKeyParams): Promise<Jwk>;
    getKeyUri(_params: KmsGetKeyUriParams): Promise<string>;
    getPublicKey({ key }: GetPublicKeyParams): Promise<Jwk>;
    privateKeyToBytes({ privateKey }: {
        privateKey: Jwk;
    }): Promise<Uint8Array>;
    publicKeyToBytes({ publicKey }: {
        publicKey: Jwk;
    }): Promise<Uint8Array>;
    sign({ key, data }: SignParams): Promise<Uint8Array>;
    verify({ key, signature, data }: VerifyParams): Promise<boolean>;
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
     * const key = { ... }; // Public key in JWK format
     * const algorithm = this.getAlgorithmName({ key });
     * ```
     *
     * @example
     * ```ts
     * const algorithm = this.getAlgorithmName({ algorithm: 'ES256' });
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
}
export {};
//# sourceMappingURL=dsa.d.ts.map