import type { MulticodecCode, MulticodecDefinition } from '@web5/common';
import type { Jwk, CryptoApi, KeyCompressor, KeyIdentifier, KmsExportKeyParams, KmsImportKeyParams, KeyImporterExporter, AsymmetricKeyConverter, InferKeyGeneratorAlgorithm } from '@web5/crypto';
import { LocalKeyManager } from '@web5/crypto';
import type { PortableDid } from '../types/portable-did.js';
import type { DidCreateOptions, DidCreateVerificationMethod } from './did-method.js';
import type { DidDocument, DidResolutionOptions, DidResolutionResult, DidVerificationMethod } from '../types/did-core.js';
import { DidMethod } from './did-method.js';
import { BearerDid } from '../bearer-did.js';
/**
 * Defines the set of options available when creating a new Decentralized Identifier (DID) with the
 * 'did:key' method.
 *
 * Either the `algorithm` or `verificationMethods` option can be specified, but not both.
 * - A new key will be generated using the algorithm identifier specified in either the `algorithm`
 *   property or the `verificationMethods` object's `algorithm` property.
 * - If `verificationMethods` is given, it must contain exactly one entry since DID Key only
 *   supports a single verification method.
 * - If neither is given, the default is to generate a new Ed25519 key.
 *
 * @example
 * ```ts
  * // By default, when no options are given, a new Ed25519 key will be generated.
 * const did = await DidKey.create();
 *
 * // The algorithm to use for key generation can be specified as a top-level option.
 * const did = await DidKey.create({
 *   options: { algorithm = 'secp256k1' }
 * });
 *
 * // Or, alternatively as a property of the verification method.
 * const did = await DidKey.create({
 *   options: {
 *     verificationMethods: [{ algorithm = 'secp256k1' }]
 *   }
 * });
 *
 * // DID Creation with a KMS
 * const keyManager = new LocalKeyManager();
 * const did = await DidKey.create({ keyManager });
 *
 * // DID Resolution
 * const resolutionResult = await DidKey.resolve({ did: did.uri });
 *
 * // Signature Operations
 * const signer = await did.getSigner();
 * const signature = await signer.sign({ data: new TextEncoder().encode('Message') });
 * const isValid = await signer.verify({ data: new TextEncoder().encode('Message'), signature });
 *
 * // Import / Export
 *
 * // Export a BearerDid object to the PortableDid format.
 * const portableDid = await did.export();
 *
 * // Reconstruct a BearerDid object from a PortableDid
 * const did = await DidKey.import(portableDid);
 * ```
 */
export interface DidKeyCreateOptions<TKms> extends DidCreateOptions<TKms> {
    /**
     * Optionally specify the algorithm to be used for key generation.
     */
    algorithm?: TKms extends CryptoApi ? InferKeyGeneratorAlgorithm<TKms> : InferKeyGeneratorAlgorithm<LocalKeyManager>;
    /**
     * Optionally specify an array of JSON-LD context links for the @context property of the DID
     * document.
     *
     * The @context property provides a JSON-LD processor with the information necessary to interpret
     * the DID document JSON. The default context URL is 'https://www.w3.org/ns/did/v1'.
     */
    defaultContext?: string;
    /**
     * Optionally enable encryption key derivation during DID creation.
     *
     * By default, this option is set to `false`, which means encryption key derivation is not
     * performed unless explicitly enabled.
     *
     * When set to `true`, an `X25519` key will be derived from the `Ed25519` public key used to
     * create the DID. This feature enables the same DID to be used for encrypted communication, in
     * addition to signature verification.
     *
     * Notes:
     * - This option is ONLY applicable when the `algorithm` of the DID's public key is `Ed25519`.
     * - Enabling this introduces specific cryptographic considerations that should be understood
     *   before using the same key pair for digital signatures and encrypted communication. See the following for more information:
     */
    enableEncryptionKeyDerivation?: boolean;
    /**
     * Optionally enable experimental public key types during DID creation.
     * By default, this option is set to `false`, which means experimental public key types are not
     * supported.
     *
     * Note: This implementation of the DID Key method does not support any experimental public key
     * types.
     */
    enableExperimentalPublicKeyTypes?: boolean;
    /**
     * Optionally specify the format of the public key to be used for DID creation.
     */
    publicKeyFormat?: keyof typeof DidKeyVerificationMethodType;
    /**
     * Alternatively, specify the algorithm to be used for key generation of the single verification
     * method in the DID Document.
     */
    verificationMethods?: DidCreateVerificationMethod<TKms>[];
}
/**
 * Enumerates the types of keys that can be used in a DID Key document.
 *
 * The DID Key method supports various cryptographic key types. These key types are essential for
 * the creation and management of DIDs and their associated cryptographic operations like signing
 * and encryption.
 */
export declare enum DidKeyRegisteredKeyType {
    /**
     * Ed25519: A public-key signature system using the EdDSA (Edwards-curve Digital Signature
     * Algorithm) and Curve25519.
     */
    Ed25519 = "Ed25519",
    /**
     * secp256k1: A cryptographic curve used for digital signatures in a range of decentralized
     * systems.
     */
    secp256k1 = "secp256k1",
    /**
     * secp256r1: Also known as P-256 or prime256v1, this curve is used for cryptographic operations
     * and is widely supported in various cryptographic libraries and standards.
     */
    secp256r1 = "secp256r1",
    /**
     * X25519: A Diffie-Hellman key exchange algorithm using Curve25519.
     */
    X25519 = "X25519"
}
/**
 * Enumerates the verification method types supported by the DID Key method.
 *
 * This enum defines the URIs associated with common verification methods used in DID Documents.
 * These URIs represent cryptographic suites or key types standardized for use across decentralized
 * identifiers (DIDs).
 */
export declare const DidKeyVerificationMethodType: {
    /** Represents an Ed25519 public key used for digital signatures. */
    readonly Ed25519VerificationKey2020: "https://w3id.org/security/suites/ed25519-2020/v1";
    /** Represents a JSON Web Key (JWK) used for digital signatures and key agreement protocols. */
    readonly JsonWebKey2020: "https://w3id.org/security/suites/jws-2020/v1";
    /** Represents an X25519 public key used for key agreement protocols. */
    readonly X25519KeyAgreementKey2020: "https://w3id.org/security/suites/x25519-2020/v1";
};
/**
 * The `DidKey` class provides an implementation of the 'did:key' DID method.
 *
 * Features:
 * - DID Creation: Create new `did:key` DIDs.
 * - DID Key Management: Instantiate a DID object from an existing verification method key set or
 *                       or a key in a Key Management System (KMS). If supported by the KMS, a DID's
 *                       key can be exported to a portable DID format.
 * - DID Resolution: Resolve a `did:key` to its corresponding DID Document.
 * - Signature Operations: Sign and verify messages using keys associated with a DID.
 *
 * @remarks
 * The `did:key` DID method uses a single public key to generate a DID and does not rely
 * on any external system such as a blockchain or centralized database. This characteristic makes
 * it suitable for use cases where a assertions about a DID Subject can be self-verifiable by
 * third parties.
 *
 * The method-specific identifier is formed by
 * {@link https://datatracker.ietf.org/doc/html/draft-multiformats-multibase#name-base-58-bitcoin-encoding | Multibase base58-btc}
 * encoding the concatenation of the
 * {@link https://github.com/multiformats/multicodec/blob/master/README.md | Multicodec} identifier
 * for the public key type and the raw public key bytes. To form the DID URI, the method-specific
 * identifier is prefixed with the string 'did:key:'.
 *
 * This method can optionally derive an encryption key from the public key used to create the DID
 * if and only if the public key algorithm is `Ed25519`. This feature enables the same DID to be
 * used for encrypted communication, in addition to signature verification. To enable this
 * feature when calling {@link DidKey.create | `DidKey.create()`}, first specify an `algorithm` of
 * `Ed25519` or provide a `keySet` referencing an `Ed25519` key and then set the
 * `enableEncryptionKeyDerivation` option to `true`.
 *
 * Note:
 * - The authors of the DID Key specification have indicated that use of this method for long-lived
 *   use cases is only recommended when accompanied with high confidence that private keys are
 *   securely protected by software or hardware isolation.
 *
 * @see {@link https://w3c-ccg.github.io/did-method-key/ | DID Key Specification}
 *
* @example
 * ```ts
 * // DID Creation
 * const did = await DidKey.create();
 *
 * // DID Creation with a KMS
 * const keyManager = new LocalKeyManager();
 * const did = await DidKey.create({ keyManager });
 *
 * // DID Resolution
 * const resolutionResult = await DidKey.resolve({ did: did.uri });
 *
 * // Signature Operations
 * const signer = await did.getSigner();
 * const signature = await signer.sign({ data: new TextEncoder().encode('Message') });
 * const isValid = await signer.verify({ data: new TextEncoder().encode('Message'), signature });
 *
 * // Key Management
 *
 * // Instantiate a DID object from an existing key in a KMS
 * const did = await DidKey.fromKeyManager({
 *  didUri: 'did:key:z6MkpUzNmYVTGpqhStxK8yRKXWCRNm1bGYz8geAg2zmjYHKX',
 *  keyManager
 * });
 *
 * // Instantiate a DID object from an existing verification method key
 * const did = await DidKey.fromKeys({
 *   verificationMethods: [{
 *     publicKeyJwk: {
 *       kty: 'OKP',
 *       crv: 'Ed25519',
 *       x: 'cHs7YMLQ3gCWjkacMURBsnEJBcEsvlsE5DfnsfTNDP4'
 *     },
 *     privateKeyJwk: {
 *       kty: 'OKP',
 *       crv: 'Ed25519',
 *       x: 'cHs7YMLQ3gCWjkacMURBsnEJBcEsvlsE5DfnsfTNDP4',
 *       d: 'bdcGE4KzEaekOwoa-ee3gAm1a991WvNj_Eq3WKyqTnE'
 *     }
 *   }]
 * });
 *
 * // Convert a DID object to a portable format
 * const portableDid = await DidKey.toKeys({ did });
 *
 * // Reconstruct a DID object from a portable format
 * const did = await DidKey.fromKeys(portableDid);
 * ```
 */
export declare class DidKey extends DidMethod {
    /**
     * Name of the DID method, as defined in the DID Key specification.
     */
    static methodName: string;
    /**
     * Creates a new DID using the `did:key` method formed from a newly generated key.
     *
     * @remarks
     * The DID URI is formed by
     * {@link https://datatracker.ietf.org/doc/html/draft-multiformats-multibase#name-base-58-bitcoin-encoding | Multibase base58-btc}
     * encoding the
     * {@link https://github.com/multiformats/multicodec/blob/master/README.md | Multicodec}-encoded
     * public key and prefixing with `did:key:`.
     *
     * This method can optionally derive an encryption key from the public key used to create the DID
     * if and only if the public key algorithm is `Ed25519`. This feature enables the same DID to be
     * used for encrypted communication, in addition to signature verification. To enable this
     * feature, specify an `algorithm` of `Ed25519` as either a top-level option or in a
     * `verificationMethod` and set the `enableEncryptionKeyDerivation` option to `true`.
     *
     * Notes:
     * - If no `options` are given, by default a new Ed25519 key will be generated.
     * - The `algorithm` and `verificationMethods` options are mutually exclusive. If both are given,
     *   an error will be thrown.
     *
     * @example
     * ```ts
     * // DID Creation
     * const did = await DidKey.create();
     *
     * // DID Creation with a KMS
     * const keyManager = new LocalKeyManager();
     * const did = await DidKey.create({ keyManager });
     * ```
     *
     * @param params - The parameters for the create operation.
     * @param params.keyManager - Key Management System (KMS) used to generate keys and sign data.
     * @param params.options - Optional parameters that can be specified when creating a new DID.
     * @returns A Promise resolving to a {@link BearerDid} object representing the new DID.
     */
    static create<TKms extends CryptoApi | undefined = undefined>({ keyManager, options }?: {
        keyManager?: TKms;
        options?: DidKeyCreateOptions<TKms>;
    }): Promise<BearerDid>;
    /**
     * Given the W3C DID Document of a `did:key` DID, return the verification method that will be used
     * for signing messages and credentials. With DID Key, the first verification method in the
     * authentication property in the DID Document is used.
     *
     * Note that for DID Key, only one verification method intended for signing can exist so
     * specifying `methodId` could be considered redundant or unnecessary. The option is provided for
     * consistency with other DID method implementations.
     *
     * @param params - The parameters for the `getSigningMethod` operation.
     * @param params.didDocument - DID Document to get the verification method from.
     * @param params.methodId - ID of the verification method to use for signing.
     * @returns Verification method to use for signing.
     */
    static getSigningMethod({ didDocument }: {
        didDocument: DidDocument;
        methodId?: string;
    }): Promise<DidVerificationMethod>;
    /**
     * Instantiates a {@link BearerDid} object for the DID Key method from a given {@link PortableDid}.
     *
     * This method allows for the creation of a `BearerDid` object using a previously created DID's
     * key material, DID document, and metadata.
     *
     * @remarks
     * The `verificationMethod` array of the DID document must contain exactly one key since the
     * `did:key` method only supports a single verification method.
     *
     * @example
     * ```ts
     * // Export an existing BearerDid to PortableDid format.
     * const portableDid = await did.export();
     * // Reconstruct a BearerDid object from the PortableDid.
     * const did = await DidKey.import({ portableDid });
     * ```
     *
     * @param params - The parameters for the import operation.
     * @param params.portableDid - The PortableDid object to import.
     * @param params.keyManager - Optionally specify an external Key Management System (KMS) used to
     *                            generate keys and sign data. If not given, a new
     *                            {@link LocalKeyManager} instance will be created and
     *                            used.
     * @returns A Promise resolving to a `BearerDid` object representing the DID formed from the provided keys.
     * @throws An error if the DID document does not contain exactly one verification method.
     */
    static import({ portableDid, keyManager }: {
        keyManager?: CryptoApi & KeyImporterExporter<KmsImportKeyParams, KeyIdentifier, KmsExportKeyParams>;
        portableDid: PortableDid;
    }): Promise<BearerDid>;
    /**
     * Resolves a `did:key` identifier to a DID Document.
     *
     * @param didUri - The DID to be resolved.
     * @param options - Optional parameters for resolving the DID.
     * @returns A Promise resolving to a {@link DidResolutionResult} object representing the result of the resolution.
     */
    static resolve(didUri: string, options?: DidResolutionOptions): Promise<DidResolutionResult>;
    /**
     * Expands a did:key identifier to a DID Document.
     *
     * Reference: https://w3c-ccg.github.io/did-method-key/#document-creation-algorithm
     *
     * @param options
     * @returns - A DID dodcument.
     */
    private static createDocument;
    /**
     * Decoding a multibase-encoded multicodec value into a verification method
     * that is suitable for verifying that encrypted information will be
     * received by the intended recipient.
     */
    private static createEncryptionMethod;
    /**
     * Decodes a multibase-encoded multicodec value into a verification method
     * that is suitable for verifying digital signatures.
     * @param options - Signature method creation algorithm inputs.
     * @returns - A verification method.
     */
    private static createSignatureMethod;
    /**
     * Transform a multibase-encoded multicodec value to public encryption key
     * components that are suitable for encrypting messages to a receiver. A
     * mathematical proof elaborating on the safety of performing this operation
     * is available in:
     * {@link https://eprint.iacr.org/2021/509.pdf | On using the same key pair for Ed25519 and an X25519 based KEM}
     */
    private static deriveEncryptionKey;
    /**
     * Validates the structure and components of a DID URI against the `did:key` method specification.
     *
     * @param parsedDid - An object representing the parsed components of a DID URI, including the
     *                    scheme, method, and method-specific identifier.
     * @returns `true` if the DID URI meets the `did:key` method's structural requirements, `false` otherwise.
     *
     */
    private static validateIdentifier;
}
/**
 * The `DidKeyUtils` class provides utility functions to support operations in the DID Key method.
 */
export declare class DidKeyUtils {
    /**
     * A mapping from JSON Web Key (JWK) property descriptors to multicodec names.
     *
     * This mapping is used to convert keys in JWK (JSON Web Key) format to multicodec format.
     *
     * @remarks
     * The keys of this object are strings that describe the JOSE key type and usage,
     * such as 'Ed25519:public', 'Ed25519:private', etc. The values are the corresponding multicodec
     * names used to represent these key types.
     *
     * @example
     * ```ts
     * const multicodecName = JWK_TO_MULTICODEC['Ed25519:public'];
     * // Returns 'ed25519-pub', the multicodec name for an Ed25519 public key
     * ```
     */
    private static JWK_TO_MULTICODEC;
    /**
     * Defines the expected byte lengths for public keys associated with different cryptographic
     * algorithms, indexed by their multicodec code values.
     */
    static MULTICODEC_PUBLIC_KEY_LENGTH: Record<number, number>;
    /**
     * A mapping from multicodec names to their corresponding JOSE (JSON Object Signing and Encryption)
     * representations. This mapping facilitates the conversion of multicodec key formats to
     * JWK (JSON Web Key) formats.
     *
     * @remarks
     * The keys of this object are multicodec names, such as 'ed25519-pub', 'ed25519-priv', etc.
     * The values are objects representing the corresponding JWK properties for that key type.
     *
     * @example
     * ```ts
     * const joseKey = MULTICODEC_TO_JWK['ed25519-pub'];
     * // Returns a partial JWK for an Ed25519 public key
     * ```
     */
    private static MULTICODEC_TO_JWK;
    /**
     * Converts a JWK (JSON Web Key) to a Multicodec code and name.
     *
     * @example
     * ```ts
     * const jwk: Jwk = { crv: 'Ed25519', kty: 'OKP', x: '...' };
     * const { code, name } = await DidKeyUtils.jwkToMulticodec({ jwk });
     * ```
     *
     * @param params - The parameters for the conversion.
     * @param params.jwk - The JSON Web Key to be converted.
     * @returns A promise that resolves to a Multicodec definition.
     */
    static jwkToMulticodec({ jwk }: {
        jwk: Jwk;
    }): Promise<MulticodecDefinition<MulticodecCode>>;
    /**
     * Returns the appropriate public key compressor for the specified cryptographic curve.
     *
     * @param curve - The cryptographic curve to use for the key conversion.
     * @returns A public key compressor for the specified curve.
     */
    static keyCompressor(curve: string): KeyCompressor['compressPublicKey'];
    /**
     * Returns the appropriate key converter for the specified cryptographic curve.
     *
     * @param curve - The cryptographic curve to use for the key conversion.
     * @returns An `AsymmetricKeyConverter` for the specified curve.
     */
    static keyConverter(curve: string): AsymmetricKeyConverter;
    /**
     * Converts a Multicodec code or name to parial JWK (JSON Web Key).
     *
     * @example
     * ```ts
     * const partialJwk = await DidKeyUtils.multicodecToJwk({ name: 'ed25519-pub' });
     * ```
     *
     * @param params - The parameters for the conversion.
     * @param params.code - Optional Multicodec code to convert.
     * @param params.name - Optional Multicodec name to convert.
     * @returns A promise that resolves to a JOSE format key.
     */
    static multicodecToJwk({ code, name }: {
        code?: MulticodecCode;
        name?: string;
    }): Promise<Jwk>;
    /**
     * Converts a public key in JWK (JSON Web Key) format to a multibase identifier.
     *
     * @remarks
     * Note: All secp public keys are converted to compressed point encoding
     *       before the multibase identifier is computed.
     *
     * Per {@link https://github.com/multiformats/multicodec/blob/master/table.csv | Multicodec table}:
     *    Public keys for Elliptic Curve cryptography algorithms (e.g., secp256k1,
     *    secp256k1r1, secp384r1, etc.) are always represented with compressed point
     *    encoding (e.g., secp256k1-pub, p256-pub, p384-pub, etc.).
     *
     * Per {@link https://datatracker.ietf.org/doc/html/rfc8812#name-jose-and-cose-secp256k1-cur | RFC 8812}:
     *    "As a compressed point encoding representation is not defined for JWK
     *    elliptic curve points, the uncompressed point encoding defined there
     *    MUST be used. The x and y values represented MUST both be exactly
     *    256 bits, with any leading zeros preserved."
     *
     * @example
     * ```ts
     * const publicKey = { crv: 'Ed25519', kty: 'OKP', x: '...' };
     * const multibaseId = await DidKeyUtils.publicKeyToMultibaseId({ publicKey });
     * ```
     *
     * @param params - The parameters for the conversion.
     * @param params.publicKey - The public key in JWK format.
     * @returns A promise that resolves to the multibase identifier.
     */
    static publicKeyToMultibaseId({ publicKey }: {
        publicKey: Jwk;
    }): Promise<string>;
}
//# sourceMappingURL=did-key.d.ts.map