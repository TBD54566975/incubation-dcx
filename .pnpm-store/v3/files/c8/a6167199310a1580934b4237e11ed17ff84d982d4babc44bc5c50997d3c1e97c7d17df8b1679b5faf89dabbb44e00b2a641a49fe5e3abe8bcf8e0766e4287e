import type { Jwk, SignParams, AesGcmParams, DigestParams, VerifyParams, GenerateKeyParams, GetPublicKeyParams, KmsGetKeyUriParams } from '@web5/crypto';
import { Sha2Algorithm } from '@web5/crypto';
import type { CryptoApi } from './prototyping/crypto/types/crypto-api.js';
import type { HkdfParams } from './prototyping/crypto/primitives/hkdf.js';
import type { Pbkdf2Params } from './prototyping/crypto/primitives/pbkdf2.js';
import type { BytesToPrivateKeyParams, BytesToPublicKeyParams, CipherParams, DeriveKeyBytesParams, DeriveKeyParams, PrivateKeyToBytesParams, PublicKeyToBytesParams, UnwrapKeyParams, WrapKeyParams } from './prototyping/crypto/types/params-direct.js';
import { HkdfAlgorithm } from './prototyping/crypto/algorithms/hkdf.js';
import { EcdsaAlgorithm } from './prototyping/crypto/algorithms/ecdsa.js';
import { EdDsaAlgorithm } from './prototyping/crypto/algorithms/eddsa.js';
import { AesKwAlgorithm } from './prototyping/crypto/algorithms/aes-kw.js';
import { Pbkdf2Algorithm } from './prototyping/crypto/algorithms/pbkdf2.js';
import { AesGcmAlgorithm } from './prototyping/crypto/algorithms/aes-gcm.js';
export interface CryptoApiBytesToPrivateKeyParams extends BytesToPrivateKeyParams {
    algorithm: KeyConversionAlgorithm;
}
export interface CryptoApiBytesToPublicKeyParams extends BytesToPublicKeyParams {
    algorithm: AsymmetricKeyConversionAlgorithm;
}
/**
 * The `CryptoApiCipherParams` interface defines the algorithm-specific parameters that should
 * be passed into the {@link AgentCryptoApi.encrypt | `AgentCryptoApi.encrypt()`} or
 * {@link AgentCryptoApi.decrypt | `AgentCryptoApi.decrypt()`} method.
 */
export interface CryptoApiCipherParams extends CipherParams, AesGcmParams {
}
/**
 * The `CryptoApiDigestParams` interface defines the algorithm-specific parameters that should
 * be passed into the {@link AgentCryptoApi.digest | `AgentCryptoApi.digest()`} method.
 */
export interface CryptoApiDigestParams extends DigestParams {
    /**
     * A string defining the name of hash function to use. The value must be one of the following:
     * - `"SHA-256"`: Generates a 256-bit digest.
     */
    algorithm: DigestAlgorithm;
}
export interface CryptoApiDeriveKeyOptions {
    'HKDF-256': Omit<HkdfParams, 'hash'> & {
        derivedKeyAlgorithm: CipherAlgorithm | KeyWrappingAlgorithm;
    };
    'HKDF-384': Omit<HkdfParams, 'hash'> & {
        derivedKeyAlgorithm: CipherAlgorithm | KeyWrappingAlgorithm;
    };
    'HKDF-512': Omit<HkdfParams, 'hash'> & {
        derivedKeyAlgorithm: CipherAlgorithm | KeyWrappingAlgorithm;
    };
    'PBES2-HS256+A128KW': Omit<Pbkdf2Params, 'hash'> & {
        derivedKeyAlgorithm?: never;
    };
    'PBES2-HS384+A192KW': Omit<Pbkdf2Params, 'hash'> & {
        derivedKeyAlgorithm?: never;
    };
    'PBES2-HS512+A256KW': Omit<Pbkdf2Params, 'hash'> & {
        derivedKeyAlgorithm?: never;
    };
}
export interface CryptoApiDeriveKeyBytesOptions {
    'HKDF-256': Omit<HkdfParams, 'hash'>;
    'HKDF-384': Omit<HkdfParams, 'hash'>;
    'HKDF-512': Omit<HkdfParams, 'hash'>;
    'PBES2-HS256+A128KW': Omit<Pbkdf2Params, 'hash'>;
    'PBES2-HS384+A192KW': Omit<Pbkdf2Params, 'hash'>;
    'PBES2-HS512+A256KW': Omit<Pbkdf2Params, 'hash'>;
}
/**
 * The `CryptoApiDeriveKeyParams` interface defines the algorithm-specific parameters that
 * should be passed into the {@link AgentCryptoApi.deriveKey | `AgentCryptoApi.deriveKey()`} method.
 */
export type CryptoApiDeriveKeyParams<T extends DeriveKeyAlgorithm> = DeriveKeyParams & {
    /**
     * A string defining the name of key derivation function to use. The value must be one of the
     * following:
     * - `"HKDF-256"`: HKDF with SHA-256.
     * - `"HKDF-384"`: HKDF with SHA-384.
     * - `"HKDF-512"`: HKDF with SHA-512.
     * - `"PBKDF2-HS256+A128KW"`: PBKDF2 with HMAC SHA-256 and A128KW key wrapping.
     * - `"PBKDF2-HS384+A192KW"`: PBKDF2 with HMAC SHA-384 and A192KW key wrapping.
     * - `"PBKDF2-HS512+A256KW"`: PBKDF2 with HMAC SHA-512 and A256KW key wrapping.
     */
    algorithm: T;
} & CryptoApiDeriveKeyOptions[T];
/**
 * The `CryptoApiDeriveKeyBytesParams` interface defines the algorithm-specific parameters that
 * should be passed into the {@link AgentCryptoApi.deriveKeyBytes | `AgentCryptoApi.deriveKeyBytes()`} method.
 */
export type CryptoApiDeriveKeyBytesParams<T extends DeriveKeyByteAlgorithm> = DeriveKeyBytesParams & {
    /**
     * A string defining the name of key derivation function to use. The value must be one of the
     * following:
     * - `"HKDF-256"`: HKDF with SHA-256.
     * - `"HKDF-384"`: HKDF with SHA-384.
     * - `"HKDF-512"`: HKDF with SHA-512.
     * - `"PBKDF2-HS256+A128KW"`: PBKDF2 with HMAC SHA-256 and A128KW key wrapping.
     * - `"PBKDF2-HS384+A192KW"`: PBKDF2 with HMAC SHA-384 and A192KW key wrapping.
     * - `"PBKDF2-HS512+A256KW"`: PBKDF2 with HMAC SHA-512 and A256KW key wrapping.
     */
    algorithm: T;
} & CryptoApiDeriveKeyBytesOptions[T];
export interface CryptoApiGenerateKeyParams extends GenerateKeyParams {
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
    readonly 'AES-GCM': {
        readonly implementation: typeof AesGcmAlgorithm;
        readonly names: readonly ["A128GCM", "A192GCM", "A256GCM"];
        readonly operations: readonly ["bytesToPrivateKey", "decrypt", "encrypt", "generateKey"];
    };
    readonly 'AES-KW': {
        readonly implementation: typeof AesKwAlgorithm;
        readonly names: readonly ["A128KW", "A192KW", "A256KW"];
        readonly operations: readonly ["bytesToPrivateKey", "generateKey", "privateKeyToBytes", "wrapKey", "unwrapKey"];
    };
    readonly Ed25519: {
        readonly implementation: typeof EdDsaAlgorithm;
        readonly names: readonly ["Ed25519"];
        readonly operations: readonly ["bytesToPrivateKey", "bytesToPublicKey", "generateKey", "sign", "verify"];
    };
    readonly HKDF: {
        readonly implementation: typeof HkdfAlgorithm;
        readonly names: readonly ["HKDF-256", "HKDF-384", "HKDF-512"];
        readonly operations: readonly ["deriveKey", "deriveKeyBytes"];
    };
    readonly PBKDF2: {
        readonly implementation: typeof Pbkdf2Algorithm;
        readonly names: readonly ["PBES2-HS256+A128KW", "PBES2-HS384+A192KW", "PBES2-HS512+A256KW"];
        readonly operations: readonly ["deriveKey", "deriveKeyBytes"];
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
type CipherAlgorithms = {
    [K in keyof SupportedAlgorithms]: 'encrypt' extends SupportedAlgorithms[K]['operations'][number] ? K : never;
}[keyof SupportedAlgorithms];
type CipherAlgorithm = typeof supportedAlgorithms[CipherAlgorithms]['names'][number];
type DeriveKeyAlgorithms = {
    [K in keyof SupportedAlgorithms]: 'deriveKey' extends SupportedAlgorithms[K]['operations'][number] ? K : never;
}[keyof SupportedAlgorithms];
type DeriveKeyAlgorithm = typeof supportedAlgorithms[DeriveKeyAlgorithms]['names'][number];
type DeriveKeyBytesAlgorithms = {
    [K in keyof SupportedAlgorithms]: 'deriveKeyBytes' extends SupportedAlgorithms[K]['operations'][number] ? K : never;
}[keyof SupportedAlgorithms];
type DeriveKeyByteAlgorithm = typeof supportedAlgorithms[DeriveKeyBytesAlgorithms]['names'][number];
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
type KeyWrappingAlgorithms = {
    [K in keyof SupportedAlgorithms]: 'wrapKey' extends SupportedAlgorithms[K]['operations'][number] ? K : never;
}[keyof SupportedAlgorithms];
type KeyWrappingAlgorithm = typeof supportedAlgorithms[KeyWrappingAlgorithms]['names'][number];
type KeyGenerationAlgorithms = {
    [K in keyof SupportedAlgorithms]: 'generateKey' extends SupportedAlgorithms[K]['operations'][number] ? K : never;
}[keyof SupportedAlgorithms];
type KeyGenerationAlgorithm = typeof supportedAlgorithms[KeyGenerationAlgorithms]['names'][number];
export declare class AgentCryptoApi implements CryptoApi<CryptoApiGenerateKeyParams, Jwk, GetPublicKeyParams, CryptoApiDigestParams, SignParams, VerifyParams, CryptoApiCipherParams, CryptoApiCipherParams, CryptoApiBytesToPublicKeyParams, PublicKeyToBytesParams, CryptoApiBytesToPrivateKeyParams, PrivateKeyToBytesParams, CryptoApiDeriveKeyParams<DeriveKeyAlgorithm>, Jwk, CryptoApiDeriveKeyBytesParams<DeriveKeyAlgorithm>, Uint8Array, WrapKeyParams, UnwrapKeyParams> {
    /**
     * A private map that stores instances of cryptographic algorithm implementations. Each key in
     * this map is an `AlgorithmConstructor`, and its corresponding value is an instance of a class
     * that implements a specific cryptographic algorithm. This map is used to cache and reuse
     * instances for performance optimization, ensuring that each algorithm is instantiated only once.
     */
    private _algorithmInstances;
    bytesToPrivateKey({ algorithm: algorithmIdentifier, privateKeyBytes }: CryptoApiBytesToPrivateKeyParams): Promise<Jwk>;
    bytesToPublicKey({ algorithm: algorithmIdentifier, publicKeyBytes }: CryptoApiBytesToPublicKeyParams): Promise<Jwk>;
    decrypt(params: CryptoApiCipherParams): Promise<Uint8Array>;
    deriveKey<T extends DeriveKeyAlgorithm>(params: CryptoApiDeriveKeyParams<T>): Promise<Jwk>;
    deriveKeyBytes<T extends DeriveKeyAlgorithm>(params: CryptoApiDeriveKeyBytesParams<T>): Promise<Uint8Array>;
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
    digest({ algorithm, data }: CryptoApiDigestParams): Promise<Uint8Array>;
    encrypt(params: CryptoApiCipherParams): Promise<Uint8Array>;
    generateKey(params: CryptoApiGenerateKeyParams): Promise<Jwk>;
    getKeyUri(_params: KmsGetKeyUriParams): Promise<string>;
    getPublicKey({ key }: GetPublicKeyParams): Promise<Jwk>;
    privateKeyToBytes({ privateKey }: {
        privateKey: Jwk;
    }): Promise<Uint8Array>;
    publicKeyToBytes({ publicKey }: {
        publicKey: Jwk;
    }): Promise<Uint8Array>;
    sign({ key, data }: SignParams): Promise<Uint8Array>;
    unwrapKey(params: UnwrapKeyParams): Promise<Jwk>;
    verify({ key, signature, data }: VerifyParams): Promise<boolean>;
    wrapKey(params: WrapKeyParams): Promise<Uint8Array>;
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
//# sourceMappingURL=crypto-api.d.ts.map