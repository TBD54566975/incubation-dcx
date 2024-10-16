import type { CryptoApi, KeyIdentifier, KmsExportKeyParams, KmsImportKeyParams, KeyImporterExporter, InferKeyGeneratorAlgorithm } from '@web5/crypto';
import { LocalKeyManager } from '@web5/crypto';
import type { PortableDid } from '../types/portable-did.js';
import type { DidCreateOptions, DidCreateVerificationMethod } from './did-method.js';
import type { DidDocument, DidResolutionOptions, DidResolutionResult, DidVerificationMethod } from '../types/did-core.js';
import { DidMethod } from './did-method.js';
import { BearerDid } from '../bearer-did.js';
/**
 * Defines the set of options available when creating a new Decentralized Identifier (DID) with the
 * 'did:jwk' method.
 *
 * Either the `algorithm` or `verificationMethods` option can be specified, but not both.
 * - A new key will be generated using the algorithm identifier specified in either the `algorithm`
 *   property or the `verificationMethods` object's `algorithm` property.
 * - If `verificationMethods` is given, it must contain exactly one entry since DID JWK only
 *   supports a single verification method.
 * - If neither is given, the default is to generate a new Ed25519 key.
 *
 * @example
 * ```ts
 * // DID Creation
 *
 * // By default, when no options are given, a new Ed25519 key will be generated.
 * const did = await DidJwk.create();
 *
 * // The algorithm to use for key generation can be specified as a top-level option.
 * const did = await DidJwk.create({
 *   options: { algorithm = 'ES256K' }
 * });
 *
 * // Or, alternatively as a property of the verification method.
 * const did = await DidJwk.create({
 *   options: {
 *     verificationMethods: [{ algorithm = 'ES256K' }]
 *   }
 * });
 *
 * // DID Creation with a KMS
 * const keyManager = new LocalKeyManager();
 * const did = await DidJwk.create({ keyManager });
 *
 * // DID Resolution
 * const resolutionResult = await DidJwk.resolve({ did: did.uri });
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
 * const did = await DidJwk.import(portableDid);
 * ```
 */
export interface DidJwkCreateOptions<TKms> extends DidCreateOptions<TKms> {
    /**
     * Optionally specify the algorithm to be used for key generation.
     */
    algorithm?: TKms extends CryptoApi ? InferKeyGeneratorAlgorithm<TKms> : InferKeyGeneratorAlgorithm<LocalKeyManager>;
    /**
     * Alternatively, specify the algorithm to be used for key generation of the single verification
     * method in the DID Document.
     */
    verificationMethods?: DidCreateVerificationMethod<TKms>[];
}
/**
 * The `DidJwk` class provides an implementation of the `did:jwk` DID method.
 *
 * Features:
 * - DID Creation: Create new `did:jwk` DIDs.
 * - DID Key Management: Instantiate a DID object from an existing verification method key set or
 *                       or a key in a Key Management System (KMS). If supported by the KMS, a DID's
 *                       key can be exported to a portable DID format.
 * - DID Resolution: Resolve a `did:jwk` to its corresponding DID Document.
 * - Signature Operations: Sign and verify messages using keys associated with a DID.
 *
 * @remarks
 * The `did:jwk` DID method uses a single JSON Web Key (JWK) to generate a DID and does not rely
 * on any external system such as a blockchain or centralized database. This characteristic makes
 * it suitable for use cases where a assertions about a DID Subject can be self-verifiable by
 * third parties.
 *
 * The DID URI is formed by Base64URL-encoding the JWK and prefixing with `did:jwk:`. The DID
 * Document of a `did:jwk` DID contains a single verification method, which is the JWK used
 * to generate the DID. The verification method is identified by the key ID `#0`.
 *
 * @see {@link https://github.com/quartzjer/did-jwk/blob/main/spec.md | DID JWK Specification}
 *
 * @example
 * ```ts
 * // DID Creation
 * const did = await DidJwk.create();
 *
 * // DID Creation with a KMS
 * const keyManager = new LocalKeyManager();
 * const did = await DidJwk.create({ keyManager });
 *
 * // DID Resolution
 * const resolutionResult = await DidJwk.resolve({ did: did.uri });
 *
 * // Signature Operations
 * const signer = await did.getSigner();
 * const signature = await signer.sign({ data: new TextEncoder().encode('Message') });
 * const isValid = await signer.verify({ data: new TextEncoder().encode('Message'), signature });
 *
 * // Key Management
 *
 * // Instantiate a DID object from an existing key in a KMS
 * const did = await DidJwk.fromKeyManager({
 *  didUri: 'did:jwk:eyJrIjoiT0tQIiwidCI6IkV1c2UyNTYifQ',
 *  keyManager
 * });
 *
 * // Instantiate a DID object from an existing verification method key
 * const did = await DidJwk.fromKeys({
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
 * const portableDid = await DidJwk.toKeys({ did });
 *
 * // Reconstruct a DID object from a portable format
 * const did = await DidJwk.fromKeys(portableDid);
 * ```
 */
export declare class DidJwk extends DidMethod {
    /**
     * Name of the DID method, as defined in the DID JWK specification.
     */
    static methodName: string;
    /**
     * Creates a new DID using the `did:jwk` method formed from a newly generated key.
     *
     * @remarks
     * The DID URI is formed by Base64URL-encoding the JWK and prefixing with `did:jwk:`.
     *
     * Notes:
     * - If no `options` are given, by default a new Ed25519 key will be generated.
     * - The `algorithm` and `verificationMethods` options are mutually exclusive. If both are given,
     *   an error will be thrown.
     *
     * @example
     * ```ts
     * // DID Creation
     * const did = await DidJwk.create();
     *
     * // DID Creation with a KMS
     * const keyManager = new LocalKeyManager();
     * const did = await DidJwk.create({ keyManager });
     * ```
     *
     * @param params - The parameters for the create operation.
     * @param params.keyManager - Optionally specify a Key Management System (KMS) used to generate
     *                            keys and sign data.
     * @param params.options - Optional parameters that can be specified when creating a new DID.
     * @returns A Promise resolving to a {@link BearerDid} object representing the new DID.
     */
    static create<TKms extends CryptoApi | undefined = undefined>({ keyManager, options }?: {
        keyManager?: TKms;
        options?: DidJwkCreateOptions<TKms>;
    }): Promise<BearerDid>;
    /**
     * Given the W3C DID Document of a `did:jwk` DID, return the verification method that will be used
     * for signing messages and credentials. If given, the `methodId` parameter is used to select the
     * verification method. If not given, the first verification method in the DID Document is used.
     *
     * Note that for DID JWK, only one verification method can exist so specifying `methodId` could be
     * considered redundant or unnecessary. The option is provided for consistency with other DID
     * method implementations.
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
     * Instantiates a {@link BearerDid} object for the DID JWK method from a given {@link PortableDid}.
     *
     * This method allows for the creation of a `BearerDid` object using a previously created DID's
     * key material, DID document, and metadata.
     *
     * @remarks
     * The `verificationMethod` array of the DID document must contain exactly one key since the
     * `did:jwk` method only supports a single verification method.
     *
     * @example
     * ```ts
     * // Export an existing BearerDid to PortableDid format.
     * const portableDid = await did.export();
     * // Reconstruct a BearerDid object from the PortableDid.
     * const did = await DidJwk.import({ portableDid });
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
     * Resolves a `did:jwk` identifier to a DID Document.
     *
     * @param didUri - The DID to be resolved.
     * @param _options - Optional parameters for resolving the DID. Unused by this DID method.
     * @returns A Promise resolving to a {@link DidResolutionResult} object representing the result of the resolution.
     */
    static resolve(didUri: string, _options?: DidResolutionOptions): Promise<DidResolutionResult>;
}
//# sourceMappingURL=did-jwk.d.ts.map