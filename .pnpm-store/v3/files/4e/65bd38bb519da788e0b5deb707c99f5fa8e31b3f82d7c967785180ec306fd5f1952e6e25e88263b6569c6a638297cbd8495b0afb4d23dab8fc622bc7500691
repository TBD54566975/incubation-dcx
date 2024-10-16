import type { CryptoApi, Jwk, KeyIdentifier, KeyImporterExporter, KmsExportKeyParams, KmsImportKeyParams } from '@web5/crypto';
import type { IonDocumentModel } from '@decentralized-identity/ion-sdk';
import type { PortableDid } from '../types/portable-did.js';
import type { DidCreateOptions, DidCreateVerificationMethod, DidRegistrationResult } from '../methods/did-method.js';
import type { DidService, DidDocument, DidResolutionResult, DidResolutionOptions, DidVerificationMethod, DidVerificationRelationship } from '../types/did-core.js';
import { BearerDid } from '../bearer-did.js';
import { DidMethod } from '../methods/did-method.js';
/**
 * Options for creating a Decentralized Identifier (DID) using the DID ION method.
 */
export interface DidIonCreateOptions<TKms> extends DidCreateOptions<TKms> {
    /**
     * Optional. The URI of a server involved in executing DID method operations. In the context of
     * DID creation, the endpoint is expected to be a Sidetree node. If not specified, a default
     * gateway node is used.
     */
    gatewayUri?: string;
    /**
     * Optional. Determines whether the created DID should be published to a Sidetree node.
     *
     * If set to `true` or omitted, the DID is publicly discoverable. If `false`, the DID is not
     * published and cannot be resolved by others. By default, newly created DIDs are published.
     *
     * @see {@link https://identity.foundation/sidetree/spec/#create | Sidetree Protocol Specification, § Create}
     *
     * @example
     * ```ts
     * const did = await DidIon.create({
     *  options: {
     *   publish: false
     * };
     * ```
     */
    publish?: boolean;
    /**
     * Optional. An array of service endpoints associated with the DID.
     *
     * Services are used in DID documents to express ways of communicating with the DID subject or
     * associated entities. A service can be any type of service the DID subject wants to advertise,
     * including decentralized identity management services for further discovery, authentication,
     * authorization, or interaction.
     *
     * @see {@link https://www.w3.org/TR/did-core/#services | DID Core Specification, § Services}
     *
     * @example
     * ```ts
     * const did = await DidIon.create({
     *  options: {
     *   services: [
     *     {
     *       id: 'dwn',
     *       type: 'DecentralizedWebNode',
     *       serviceEndpoint: ['https://example.com/dwn1', 'https://example/dwn2']
     *     }
     *   ]
     * };
     * ```
     */
    services?: DidService[];
    /**
     * Optional. An array of verification methods to be included in the DID document.
     *
     * By default, a newly created DID ION document will contain a single Ed25519 verification method.
     * Additional verification methods can be added to the DID document using the
     * `verificationMethods` property.
     *
     * @see {@link https://www.w3.org/TR/did-core/#verification-methods | DID Core Specification, § Verification Methods}
     *
     * @example
     * ```ts
     * const did = await DidIon.create({
     *  options: {
     *   verificationMethods: [
     *     {
     *       algorithm: 'Ed25519',
     *       purposes: ['authentication', 'assertionMethod']
     *     },
     *     {
     *       algorithm: 'Ed25519',
     *       id: 'dwn-sig',
     *       purposes: ['authentication', 'assertionMethod']
     *     }
     *   ]
     * };
     * ```
     */
    verificationMethods?: DidCreateVerificationMethod<TKms>[];
}
/**
 * Represents the request model for managing DID documents within the ION network, according to the
 * Sidetree protocol specification.
 */
export interface DidIonCreateRequest {
    /** The type of operation to perform, which is always 'create' for a Create Operation. */
    type: 'create';
    /** Contains properties related to the initial state of the DID document. */
    suffixData: {
        /** A hash of the `delta` object, representing the initial changes to the DID document. */
        deltaHash: string;
        /** A commitment value used for future recovery operations, hashed for security. */
        recoveryCommitment: string;
    };
    /** Details the changes to be applied to the DID document in this operation. */
    delta: {
        /** A commitment value used for the next update operation, hashed for security. */
        updateCommitment: string;
        /** An array of patch objects specifying the modifications to apply to the DID document. */
        patches: {
            /** The type of modification to perform (e.g., adding or removing public keys or service
             * endpoints). */
            action: string;
            /** The document state or partial state to apply with this patch. */
            document: IonDocumentModel;
        }[];
    };
}
/**
 * Represents a {@link DidVerificationMethod | DID verification method} in the context of DID ION
 * create, update, deactivate, and resolve operations.
 *
 * Unlike the DID Core standard {@link DidVerificationMethod} interface, this type is specific to
 * the ION method operations and only includes the `id`, `publicKeyJwk`, and `purposes` properties:
 * - The `id` property is optional and specifies the identifier fragment of the verification method.
 * - The `publicKeyJwk` property is required and represents the public key in JWK format.
 * - The `purposes` property is required and specifies the purposes for which the verification
 *  method can be used.
 *
 * @example
 * ```ts
 * const verificationMethod: DidIonVerificationMethod = {
 *   id           : 'sig',
 *   publicKeyJwk : {
 *     kty : 'OKP',
 *     crv : 'Ed25519',
 *     x   : 'o40shZrsco-CfEqk6mFsXfcP94ly3Az3gm84PzAUsXo',
 *     kid : 'BDp0xim82GswlxnPV8TPtBdUw80wkGIF8gjFbw1x5iQ',
 *   },
 *   purposes: ['authentication', 'assertionMethod']
 * };
 * ```
 */
export interface DidIonVerificationMethod {
    /**
     * Optionally specify the identifier fragment of the verification method.
     *
     * If not specified, the method's ID will be generated from the key's ID or thumbprint.
     *
     * @example
     * ```ts
     * const verificationMethod: DidIonVerificationMethod = {
     *   id: 'sig',
     *   ...
     * };
     * ```
     */
    id?: string;
    /**
     * A public key in JWK format.
     *
     * A JSON Web Key (JWK) that conforms to {@link https://datatracker.ietf.org/doc/html/rfc7517 | RFC 7517}.
     *
     * @example
     * ```ts
     * const verificationMethod: DidIonVerificationMethod = {
     *   publicKeyJwk: {
     *     kty : "OKP",
     *     crv : "X25519",
     *     x   : "7XdJtNmJ9pV_O_3mxWdn6YjiHJ-HhNkdYQARzVU_mwY",
     *     kid : "xtsuKULPh6VN9fuJMRwj66cDfQyLaxuXHkMlmAe_v6I"
     *   },
     *   ...
     * };
     * ```
     */
    publicKeyJwk: Jwk;
    /**
     * Specify the purposes for which a verification method is intended to be used in a DID document.
     *
     * The `purposes` property defines the specific
     * {@link DidVerificationRelationship | verification relationships} between the DID subject and
     * the verification method. This enables the verification method to be utilized for distinct
     * actions such as authentication, assertion, key agreement, capability delegation, and others. It
     * is important for verifiers to recognize that a verification method must be associated with the
     * relevant purpose in the DID document to be valid for that specific use case.
     *
     * @example
     * ```ts
     * const verificationMethod: DidIonVerificationMethod = {
     *   purposes: ['authentication', 'assertionMethod'],
     *   ...
     * };
     * ```
     */
    purposes: (DidVerificationRelationship | keyof typeof DidVerificationRelationship)[];
}
/**
 * `IonPortableDid` interface extends the {@link PortableDid} interface.
 *
 * It represents a Decentralized Identifier (DID) that is portable and can be used across different
 * domains, including the ION specific recovery and update keys.
 */
export interface IonPortableDid extends PortableDid {
    /** The JSON Web Key (JWK) used for recovery purposes. */
    recoveryKey: Jwk;
    /** The JSON Web Key (JWK) used for updating the DID. */
    updateKey: Jwk;
}
/**
 * Enumerates the types of keys that can be used in a DID ION document.
 *
 * The DID ION method supports various cryptographic key types. These key types are essential for
 * the creation and management of DIDs and their associated cryptographic operations like signing
 * and encryption.
 */
export declare enum DidIonRegisteredKeyType {
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
 * The `DidIon` class provides an implementation of the `did:ion` DID method.
 *
 * Features:
 * - DID Creation: Create new `did:ion` DIDs.
 * - DID Key Management: Instantiate a DID object from an existing key in a Key Management System
 *                       (KMS). If supported by the KMS, a DID's key can be exported to a portable
 *                       DID format.
 * - DID Resolution: Resolve a `did:ion` to its corresponding DID Document stored in the Sidetree
 *                   network.
 * - Signature Operations: Sign and verify messages using keys associated with a DID.
 *
 * @see {@link https://identity.foundation/sidetree/spec/ | Sidetree Protocol Specification}
 * @see {@link https://github.com/decentralized-identity/ion/blob/master/docs/design.md | ION Design Document}
 *
 * @example
 * ```ts
 * // DID Creation
 * const did = await DidIon.create();
 *
 * // DID Creation with a KMS
 * const keyManager = new LocalKeyManager();
 * const did = await DidIon.create({ keyManager });
 *
 * // DID Resolution
 * const resolutionResult = await DidIon.resolve({ did: did.uri });
 *
 * // Signature Operations
 * const signer = await did.getSigner();
 * const signature = await signer.sign({ data: new TextEncoder().encode('Message') });
 * const isValid = await signer.verify({ data: new TextEncoder().encode('Message'), signature });
 *
 * // Key Management
 *
 * // Instantiate a DID object for a published DID with existing keys in a KMS
 * const did = await DidIon.fromKeyManager({
 *  didUri: 'did:ion:EiAzB7K-xDIKc1csXo5HX2eNBoemK9feNhL3cKwfukYOug',
 *  keyManager
 * });
 *
 * // Convert a DID object to a portable format
 * const portableDid = await DidIon.toKeys({ did });
 * ```
 */
export declare class DidIon extends DidMethod {
    /**
     * Name of the DID method, as defined in the DID ION specification.
     */
    static methodName: string;
    /**
     * Creates a new DID using the `did:ion` method formed from a newly generated key.
     *
     * Notes:
     * - If no `options` are given, by default a new Ed25519 key will be generated.
     *
     * @example
     * ```ts
     * // DID Creation
     * const did = await DidIon.create();
     *
     * // DID Creation with a KMS
     * const keyManager = new LocalKeyManager();
     * const did = await DidIon.create({ keyManager });
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
        options?: DidIonCreateOptions<TKms>;
    }): Promise<BearerDid>;
    /**
     * Given the W3C DID Document of a `did:ion` DID, return the verification method that will be used
     * for signing messages and credentials. If given, the `methodId` parameter is used to select the
     * verification method. If not given, the first verification method in the authentication property
     * in the DID Document is used.
     *
     * @param params - The parameters for the `getSigningMethod` operation.
     * @param params.didDocument - DID Document to get the verification method from.
     * @param params.methodId - ID of the verification method to use for signing.
     * @returns Verification method to use for signing.
     */
    static getSigningMethod({ didDocument, methodId }: {
        didDocument: DidDocument;
        methodId?: string;
    }): Promise<DidVerificationMethod>;
    /**
     * Instantiates a {@link BearerDid} object for the DID ION method from a given {@link PortableDid}.
     *
     * This method allows for the creation of a `BearerDid` object using a previously created DID's
     * key material, DID document, and metadata.
     *
     * @example
     * ```ts
     * // Export an existing BearerDid to PortableDid format.
     * const portableDid = await did.export();
     * // Reconstruct a BearerDid object from the PortableDid.
     * const did = await DidIon.import({ portableDid });
     * ```
     *
     * @param params - The parameters for the import operation.
     * @param params.portableDid - The PortableDid object to import.
     * @param params.keyManager - Optionally specify an external Key Management System (KMS) used to
     *                            generate keys and sign data. If not given, a new
     *                            {@link LocalKeyManager} instance will be created and
     *                            used.
     * @returns A Promise resolving to a `BearerDid` object representing the DID formed from the
     *          provided PortableDid.
     * @throws An error if the DID document does not contain any verification methods or the keys for
     *         any verification method are missing in the key manager.
     */
    static import({ portableDid, keyManager }: {
        keyManager?: CryptoApi & KeyImporterExporter<KmsImportKeyParams, KeyIdentifier, KmsExportKeyParams>;
        portableDid: PortableDid;
    }): Promise<BearerDid>;
    /**
     * Publishes a DID to a Sidetree node, making it publicly discoverable and resolvable.
     *
     * This method handles the publication of a DID Document associated with a `did:ion` DID to a
     * Sidetree node.
     *
     * @remarks
     * - This method is typically invoked automatically during the creation of a new DID unless the
     *   `publish` option is set to `false`.
     * - For existing, unpublished DIDs, it can be used to publish the DID Document to a Sidetree node.
     * - The method relies on the specified Sidetree node to interface with the network.
     *
     * @param params - The parameters for the `publish` operation.
     * @param params.did - The `BearerDid` object representing the DID to be published.
     * @param params.gatewayUri - Optional. The URI of a server involved in executing DID
     *                                    method operations. In the context of publishing, the
     *                                    endpoint is expected to be a Sidetree node. If not
     *                                    specified, a default node is used.
     * @returns A Promise resolving to a boolean indicating whether the publication was successful.
     *
     * @example
     * ```ts
     * // Generate a new DID and keys but explicitly disable publishing.
     * const did = await DidIon.create({ options: { publish: false } });
     * // Publish the DID to the Sidetree network.
     * const isPublished = await DidIon.publish({ did });
     * // `isPublished` is true if the DID was successfully published.
     * ```
     */
    static publish({ did, gatewayUri }: {
        did: BearerDid;
        gatewayUri?: string;
    }): Promise<DidRegistrationResult>;
    /**
     * Resolves a `did:ion` identifier to its corresponding DID document.
     *
     * This method performs the resolution of a `did:ion` DID, retrieving its DID Document from the
     * Sidetree-based DID overlay network. The process involves querying a Sidetree node to retrieve
     * the DID Document that corresponds to the given DID identifier.
     *
     * @remarks
     * - If a `gatewayUri` option is not specified, a default node is used to access the Sidetree
     *   network.
     * - It decodes the DID identifier and retrieves the associated DID Document and metadata.
     * - In case of resolution failure, appropriate error information is returned.
     *
     * @example
     * ```ts
     * const resolutionResult = await DidIon.resolve('did:ion:example');
     * ```
     *
     * @param didUri - The DID to be resolved.
     * @param options - Optional parameters for resolving the DID. Unused by this DID method.
     * @returns A Promise resolving to a {@link DidResolutionResult} object representing the result of the resolution.
     */
    static resolve(didUri: string, options?: DidResolutionOptions): Promise<DidResolutionResult>;
}
/**
 * The `DidIonUtils` class provides utility functions to support operations in the DID ION method.
 */
export declare class DidIonUtils {
    /**
     * Appends a specified path to a base URL, ensuring proper formatting of the resulting URL.
     *
     * This method is useful for constructing URLs for accessing various endpoints, such as Sidetree
     * nodes in the ION network. It handles the nuances of URL path concatenation, including the
     * addition or removal of leading/trailing slashes, to create a well-formed URL.
     *
     * @param params - The parameters for URL construction.
     * @param params.baseUrl - The base URL to which the path will be appended.
     * @param params.path - The path to append to the base URL.
     * @returns The fully constructed URL string with the path appended to the base URL.
     */
    static appendPathToUrl({ baseUrl, path }: {
        baseUrl: string;
        path: string;
    }): string;
    /**
     * Computes the Long Form DID URI given an ION DID's recovery key, update key, services, and
     * verification methods.
     *
     * @param params - The parameters for computing the Long Form DID URI.
     * @param params.recoveryKey - The ION Recovery Key.
     * @param params.updateKey - The ION Update Key.
     * @param params.services - An array of services associated with the DID.
     * @param params.verificationMethods - An array of verification methods associated with the DID.
     * @returns A Promise resolving to the Long Form DID URI.
     */
    static computeLongFormDidUri({ recoveryKey, updateKey, services, verificationMethods }: {
        recoveryKey: Jwk;
        updateKey: Jwk;
        services: DidService[];
        verificationMethods: DidIonVerificationMethod[];
    }): Promise<string>;
    /**
     * Constructs a Sidetree Create Operation request for a DID document within the ION network.
     *
     * This method prepares the necessary payload for submitting a Create Operation to a Sidetree
     * node, encapsulating the details of the DID document, recovery key, and update key.
     *
     * @param params - Parameters required to construct the Create Operation request.
     * @param params.ionDocument - The DID document model containing public keys and service endpoints.
     * @param params.recoveryKey - The recovery public key in JWK format.
     * @param params.updateKey - The update public key in JWK format.
     * @returns A promise resolving to the ION Create Operation request model, ready for submission to a Sidetree node.
     */
    static constructCreateRequest({ ionDocument, recoveryKey, updateKey }: {
        ionDocument: IonDocumentModel;
        recoveryKey: Jwk;
        updateKey: Jwk;
    }): Promise<DidIonCreateRequest>;
    /**
     * Assembles an ION document model from provided services and verification methods
     *
     * This model serves as the foundation for a DID document in the ION network, facilitating the
     * creation and management of decentralized identities. It translates service endpoints and
     * public keys into a format compatible with the Sidetree protocol, ensuring the resulting DID
     * document adheres to the required specifications for ION DIDs. This method is essential for
     * constructing the payload needed to register or update DIDs within the ION network.
     *
     * @param params - The parameters containing the services and verification methods to include in the ION document.
     * @param params.services - A list of service endpoints to be included in the DID document, specifying ways to interact with the DID subject.
     * @param params.verificationMethods - A list of verification methods to be included, detailing the cryptographic keys and their intended uses within the DID document.
     * @returns A Promise resolving to an `IonDocumentModel`, ready for use in Sidetree operations like DID creation and updates.
     */
    static createIonDocument({ services, verificationMethods }: {
        services: DidService[];
        verificationMethods: DidIonVerificationMethod[];
    }): Promise<IonDocumentModel>;
    /**
     * Normalize the given JWK to include only specific members and in lexicographic order.
     *
     * @param jwk - The JWK to normalize.
     * @returns The normalized JWK.
     */
    private static normalizeJwk;
}
//# sourceMappingURL=did-ion.d.ts.map