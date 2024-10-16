import type { Packet, TxtData } from '@dnsquery/dns-packet';
import type { Jwk, Signer, CryptoApi, KeyIdentifier, KmsExportKeyParams, KmsImportKeyParams, KeyImporterExporter, AsymmetricKeyConverter } from '@web5/crypto';
import type { DidMetadata, PortableDid } from '../types/portable-did.js';
import type { DidCreateOptions, DidCreateVerificationMethod, DidRegistrationResult } from './did-method.js';
import type { DidService, DidDocument, DidResolutionResult, DidResolutionOptions, DidVerificationMethod } from '../types/did-core.js';
import { DidMethod } from './did-method.js';
import { BearerDid } from '../bearer-did.js';
/**
 * Represents a BEP44 message, which is used for storing and retrieving data in the Mainline DHT
 * network.
 *
 * A BEP44 message is used primarily in the context of the DID DHT method for publishing and
 * resolving DID documents in the DHT network. This type encapsulates the data structure required
 * for such operations in accordance with BEP44.
 *
 * @see {@link https://www.bittorrent.org/beps/bep_0044.html | BEP44}
 */
export interface Bep44Message {
    /**
     * The public key bytes of the Identity Key, which serves as the identifier in the DHT network for
     * the corresponding BEP44 message.
     */
    k: Uint8Array;
    /**
     * The sequence number of the message, used to ensure the latest version of the data is retrieved
     * and updated. It's a monotonically increasing number.
     */
    seq: number;
    /**
     * The signature of the message, ensuring the authenticity and integrity of the data. It's
     * computed over the bencoded sequence number and value.
     */
    sig: Uint8Array;
    /**
     * The actual data being stored or retrieved from the DHT network, typically encoded in a format
     * suitable for DNS packet representation of a DID Document.
     */
    v: Uint8Array;
}
/**
 * Options for creating a Decentralized Identifier (DID) using the DID DHT method.
 */
export interface DidDhtCreateOptions<TKms> extends DidCreateOptions<TKms> {
    /**
     * Optionally specify that the DID Subject is also identified by one or more other DIDs or URIs.
     *
     * A DID subject can have multiple identifiers for different purposes, or at different times.
     * The assertion that two or more DIDs (or other types of URI) refer to the same DID subject can
     * be made using the `alsoKnownAs` property.
     *
     * @see {@link https://www.w3.org/TR/did-core/#also-known-as | DID Core Specification, § Also Known As}
     *
     * @example
     * ```ts
     * const did = await DidDht.create({
     *  options: {
     *   alsoKnownAs: 'did:example:123'
     * };
     * ```
     */
    alsoKnownAs?: string[];
    /**
     * Optionally specify which DID (or DIDs) is authorized to make changes to the DID document.
     *
     * A DID controller is an entity that is authorized to make changes to a DID document. Typically,
     * only the DID Subject (i.e., the value of `id` property in the DID document) is authoritative.
     * However, another DID (or DIDs) can be specified as the DID controller, and when doing so, any
     * verification methods contained in the DID document for the other DID should be accepted as
     * authoritative. In other words, proofs created by the controller DID should be considered
     * equivalent to proofs created by the DID Subject.
     *
     * @see {@link https://www.w3.org/TR/did-core/#did-controller | DID Core Specification, § DID Controller}
     *
     * @example
     * ```ts
     * const did = await DidDht.create({
     *  options: {
     *   controller: 'did:example:123'
     * };
     * ```
     */
    controllers?: string | string[];
    /**
     * Optional. The URI of a server involved in executing DID method operations. In the context of
     * DID creation, the endpoint is expected to be a DID DHT Gateway or Pkarr relay. If not
     * specified, a default gateway node is used.
     */
    gatewayUri?: string;
    /**
     * Optional. Determines whether the created DID should be published to the DHT network.
     *
     * If set to `true` or omitted, the DID is publicly discoverable. If `false`, the DID is not
     * published and cannot be resolved by others. By default, newly created DIDs are published.
     *
     * @see {@link https://did-dht.com | DID DHT Method Specification}
     *
     * @example
     * ```ts
     * const did = await DidDht.create({
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
     * const did = await DidDht.create({
     *  options: {
     *   services: [
     *     {
     *       id: 'did:dht:i9xkp8ddcbcg8jwq54ox699wuzxyifsqx4jru45zodqu453ksz6y#dwn',
     *       type: 'DecentralizedWebNode',
     *       serviceEndpoint: ['https://example.com/dwn1', 'https://example/dwn2']
     *     }
     *   ]
     * };
     * ```
     */
    services?: DidService[];
    /**
     * Optionally specify one or more registered DID DHT types to make the DID discovereable.
     *
     * Type indexing is an OPTIONAL feature that enables DIDs to become discoverable. DIDs that wish
     * to be discoverable and resolveable by type can include one or more types when publishing their
     * DID document to a DID DHT Gateway.
     *
     * The registered DID types are published in the {@link https://did-dht.com/registry/index.html#indexed-types | DID DHT Registry}.
     */
    types?: (DidDhtRegisteredDidType | keyof typeof DidDhtRegisteredDidType)[];
    /**
     * Optional. An array of verification methods to be included in the DID document.
     *
     * By default, a newly created DID DHT document will contain a single Ed25519 verification method,
     * also known as the {@link https://did-dht.com/#term:identity-key | Identity Key}. Additional
     * verification methods can be added to the DID document using the `verificationMethods` property.
     *
     * @see {@link https://www.w3.org/TR/did-core/#verification-methods | DID Core Specification, § Verification Methods}
     *
     * @example
     * ```ts
     * const did = await DidDht.create({
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
 * Proof to used to construct the `_prv._did.` DNS record as described in https://did-dht.com/#rotation to link a DID to a previous DID.
 */
export type PreviousDidProof = {
    /** The previous DID. */
    previousDid: string;
    /** The signature signed using the private Identity Key of the previous DID in Base64URL format. */
    signature: string;
};
/**
 * Represents an optional extension to a DID Document’s DNS packet representation exposed as a
 * type index.
 *
 * Type indexing is an OPTIONAL feature that enables DIDs to become discoverable. DIDs that wish to
 * be discoverable and resolveable by type can include one or more types when publishing their DID
 * document to a DID DHT Gateway.
 *
 * The registered DID types are published in the {@link https://did-dht.com/registry/index.html#indexed-types | DID DHT Registry}.
 */
export declare enum DidDhtRegisteredDidType {
    /**
     * Type 0 is reserved for DIDs that do not wish to associate themselves with a specific type but
     * wish to make themselves discoverable.
     */
    Discoverable = 0,
    /**
     * Organization
     * @see {@link https://schema.org/Organization | schema definition}
     */
    Organization = 1,
    /**
     * Government Organization
     * @see {@link https://schema.org/GovernmentOrganization | schema definition}
     */
    Government = 2,
    /**
     * Corporation
     * @see {@link https://schema.org/Corporation | schema definition}
     */
    Corporation = 3,
    /**
     * Corporation
     * @see {@link https://schema.org/Corporation | schema definition}
     */
    LocalBusiness = 4,
    /**
     * Software Package
     * @see {@link https://schema.org/SoftwareSourceCode | schema definition}
     */
    SoftwarePackage = 5,
    /**
     * Web App
     * @see {@link https://schema.org/WebApplication | schema definition}
     */
    WebApp = 6,
    /**
     * Financial Institution
     * @see {@link https://schema.org/FinancialService | schema definition}
     */
    FinancialInstitution = 7
}
/**
 * Enumerates the types of keys that can be used in a DID DHT document.
 *
 * The DID DHT method supports various cryptographic key types. These key types are essential for
 * the creation and management of DIDs and their associated cryptographic operations like signing
 * and encryption. The registered key types are published in the DID DHT Registry and each is
 * assigned a unique numerical value for use by client and gateway implementations.
 *
 * The registered key types are published in the {@link https://did-dht.com/registry/index.html#key-type-index | DID DHT Registry}.
 */
export declare enum DidDhtRegisteredKeyType {
    /**
     * Ed25519: A public-key signature system using the EdDSA (Edwards-curve Digital Signature
     * Algorithm) and Curve25519.
     */
    Ed25519 = 0,
    /**
     * secp256k1: A cryptographic curve used for digital signatures in a range of decentralized
     * systems.
     */
    secp256k1 = 1,
    /**
     * secp256r1: Also known as P-256 or prime256v1, this curve is used for cryptographic operations
     * and is widely supported in various cryptographic libraries and standards.
     */
    secp256r1 = 2,
    /**
     * X25519: A public key used for Diffie-Hellman key exchange using Curve25519.
     */
    X25519 = 3
}
/**
 * Maps {@link https://www.w3.org/TR/did-core/#verification-relationships | DID Core Verification Relationship}
 * values to the corresponding record name in the DNS packet representation of a DHT DID document.
 */
export declare enum DidDhtVerificationRelationship {
    /**
     * Specifies how the DID subject is expected to be authenticated.
     */
    authentication = "auth",
    /**
     * Specifies how the DID subject is expected to express claims, such as for issuing Verifiable
     * Credentials.
     */
    assertionMethod = "asm",
    /**
     * Specifies a mechanism used by the DID subject to delegate a cryptographic capability to another
     * party
     */
    capabilityDelegation = "del",
    /**
     * Specifies a verification method used by the DID subject to invoke a cryptographic capability.
     */
    capabilityInvocation = "inv",
    /**
     * Specifies how an entity can generate encryption material to communicate confidentially with the
     * DID subject.
     */
    keyAgreement = "agm"
}
/**
 * The `DidDht` class provides an implementation of the `did:dht` DID method.
 *
 * Features:
 * - DID Creation: Create new `did:dht` DIDs.
 * - DID Key Management: Instantiate a DID object from an existing verification method keys or
 *                       or a key in a Key Management System (KMS). If supported by the KMS, a DID's
 *                       key can be exported to a portable DID format.
 * - DID Resolution: Resolve a `did:dht` to its corresponding DID Document stored in the DHT network.
 * - Signature Operations: Sign and verify messages using keys associated with a DID.
 *
 * @remarks
 * The `did:dht` method leverages the distributed nature of the Mainline DHT network for
 * decentralized identity management. This method allows DIDs to be resolved without relying on
 * centralized registries or ledgers, enhancing privacy and control for users. The DID Document is
 * stored and retrieved from the DHT network, and the method includes optional mechanisms for
 * discovering DIDs by type.
 *
 * The DID URI in the `did:dht` method includes a method-specific identifier called the Identity Key
 * which corresponds to the DID's entry in the DHT network. The Identity Key required to make
 * changes to the DID Document since Mainline DHT nodes validate the signature of each message
 * before storing the value in the DHT.
 *
 * @see {@link https://did-dht.com | DID DHT Method Specification}
 *
 * @example
 * ```ts
 * // DID Creation
 * const did = await DidDht.create();
 *
 * // DID Creation with a KMS
 * const keyManager = new LocalKeyManager();
 * const did = await DidDht.create({ keyManager });
 *
 * // DID Resolution
 * const resolutionResult = await DidDht.resolve({ did: did.uri });
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
 * const did = await DidDht.import(portableDid);
 * ```
 */
export declare class DidDht extends DidMethod {
    /**
     * Name of the DID method, as defined in the DID DHT specification.
     */
    static methodName: string;
    /**
     * Creates a new DID using the `did:dht` method formed from a newly generated key.
     *
     * @remarks
     * The DID URI is formed by z-base-32 encoding the Identity Key public key and prefixing with
     * `did:dht:`.
     *
     * Notes:
     * - If no `options` are given, by default a new Ed25519 key will be generated which serves as the
     *   Identity Key.
     *
     * @example
     * ```ts
     * // DID Creation
     * const did = await DidDht.create();
     *
     * // DID Creation with a KMS
     * const keyManager = new LocalKeyManager();
     * const did = await DidDht.create({ keyManager });
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
        options?: DidDhtCreateOptions<TKms>;
    }): Promise<BearerDid>;
    /**
     * Instantiates a {@link BearerDid} object for the DID DHT method from a given {@link PortableDid}.
     *
     * This method allows for the creation of a `BearerDid` object using a previously created DID's
     * key material, DID document, and metadata.
     *
     * @example
     * ```ts
     * // Export an existing BearerDid to PortableDid format.
     * const portableDid = await did.export();
     * // Reconstruct a BearerDid object from the PortableDid.
     * const did = await DidDht.import({ portableDid });
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
     * @throws An error if the PortableDid document does not contain any verification methods, lacks
     *         an Identity Key, or the keys for any verification method are missing in the key
     *         manager.
     */
    static import({ portableDid, keyManager }: {
        keyManager?: CryptoApi & KeyImporterExporter<KmsImportKeyParams, KeyIdentifier, KmsExportKeyParams>;
        portableDid: PortableDid;
    }): Promise<BearerDid>;
    /**
     * Given the W3C DID Document of a `did:dht` DID, return the verification method that will be used
     * for signing messages and credentials. If given, the `methodId` parameter is used to select the
     * verification method. If not given, the Identity Key's verification method with an ID fragment
     * of '#0' is used.
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
     * Publishes a DID to the DHT, making it publicly discoverable and resolvable.
     *
     * This method handles the publication of a DID Document associated with a `did:dht` DID to the
     * Mainline DHT network. The publication process involves storing the DID Document in Mainline DHT
     * via a Pkarr relay server.
     *
     * @remarks
     * - This method is typically invoked automatically during the creation of a new DID unless the
     *   `publish` option is set to `false`.
     * - For existing, unpublished DIDs, it can be used to publish the DID Document to Mainline DHT.
     * - The method relies on the specified Pkarr relay server to interface with the DHT network.
     *
     * @example
     * ```ts
     * // Generate a new DID and keys but explicitly disable publishing.
     * const did = await DidDht.create({ options: { publish: false } });
     * // Publish the DID to the DHT.
     * const registrationResult = await DidDht.publish({ did });
     * // `registrationResult.didDocumentMetadata.published` is true if the DID was successfully published.
     * ```
     *
     * @param params - The parameters for the `publish` operation.
     * @param params.did - The `BearerDid` object representing the DID to be published.
     * @param params.gatewayUri - Optional. The URI of a server involved in executing DID method
     *                            operations. In the context of publishing, the endpoint is expected
     *                            to be a DID DHT Gateway or Pkarr Relay. If not specified, a default
     *                            gateway node is used.
     * @returns A promise that resolves to a {@link DidRegistrationResult} object that contains
     *          the result of registering the DID with a DID DHT Gateway or Pkarr relay.
     */
    static publish({ did, gatewayUri }: {
        did: BearerDid;
        gatewayUri?: string;
    }): Promise<DidRegistrationResult>;
    /**
     * Resolves a `did:dht` identifier to its corresponding DID document.
     *
     * This method performs the resolution of a `did:dht` DID, retrieving its DID Document from the
     * Mainline DHT network. The process involves querying the DHT network via a Pkarr relay server to
     * retrieve the DID Document that corresponds to the given DID identifier.
     *
     * @remarks
     * - If a `gatewayUri` option is not specified, a default Pkarr relay is used to access the DHT
     *   network.
     * - It decodes the DID identifier and retrieves the associated DID Document and metadata.
     * - In case of resolution failure, appropriate error information is returned.
     *
     * @example
     * ```ts
     * const resolutionResult = await DidDht.resolve('did:dht:example');
     * ```
     *
     * @param didUri - The DID to be resolved.
     * @param options - Optional parameters for resolving the DID. Unused by this DID method.
     * @returns A Promise resolving to a {@link DidResolutionResult} object representing the result of
     *          the resolution.
     */
    static resolve(didUri: string, options?: DidResolutionOptions): Promise<DidResolutionResult>;
}
/**
 * The `DidDhtDocument` class provides functionality for interacting with the DID document stored in
 * Mainline DHT in support of DID DHT method create, resolve, update, and deactivate operations.
 *
 * This class includes methods for retrieving and publishing DID documents to and from the DHT,
 * using DNS packet encoding and DID DHT Gateway or Pkarr Relay servers.
 */
export declare class DidDhtDocument {
    /**
     * Retrieves a DID document and its metadata from the DHT network.
     *
     * @param params - The parameters for the get operation.
     * @param params.didUri - The DID URI containing the Identity Key.
     * @param params.gatewayUri - The DID DHT Gateway or Pkarr Relay URI.
     * @returns A Promise resolving to a {@link DidResolutionResult} object containing the DID
     *          document and its metadata.
     */
    static get({ didUri, gatewayUri }: {
        didUri: string;
        gatewayUri: string;
    }): Promise<DidResolutionResult>;
    /**
     * Publishes a DID document to the DHT network.
     *
     * @param params - The parameters to use when publishing the DID document to the DHT network.
     * @param params.did - The DID object whose DID document will be published.
     * @param params.gatewayUri - The DID DHT Gateway or Pkarr Relay URI.
     * @returns A promise that resolves to a {@link DidRegistrationResult} object that contains
     *          the result of registering the DID with a DID DHT Gateway or Pkarr relay.
     */
    static put({ did, gatewayUri }: {
        did: BearerDid;
        gatewayUri: string;
    }): Promise<DidRegistrationResult>;
    /**
     * Retrieves a signed BEP44 message from a DID DHT Gateway or Pkarr Relay server.
     *
     * @see {@link https://github.com/Nuhvi/pkarr/blob/main/design/relays.md | Pkarr Relay design}
     *
     * @param params
     * @param params.gatewayUri - The DID DHT Gateway or Pkarr Relay URI.
     * @param params.publicKeyBytes - The public key bytes of the Identity Key, z-base-32 encoded.
     * @returns A promise resolving to a BEP44 message containing the signed DNS packet.
    */
    private static pkarrGet;
    /**
     * Publishes a signed BEP44 message to a DID DHT Gateway or Pkarr Relay server.
     *
     * @see {@link https://github.com/Nuhvi/pkarr/blob/main/design/relays.md | Pkarr Relay design}
     *
     * @param params - The parameters to use when publishing a signed BEP44 message to a Pkarr relay server.
     * @param params.gatewayUri - The DID DHT Gateway or Pkarr Relay URI.
     * @param params.bep44Message - The BEP44 message to be published, containing the signed DNS packet.
     * @returns A promise resolving to `true` if the message was successfully published, otherwise `false`.
     */
    private static pkarrPut;
    /**
     * Converts a DNS packet to a DID document according to the DID DHT specification.
     *
     * @see {@link https://did-dht.com/#dids-as-dns-records | DID DHT Specification, § DIDs as DNS Records}
     *
     * @param params - The parameters to use when converting a DNS packet to a DID document.
     * @param params.didUri - The DID URI of the DID document.
     * @param params.dnsPacket - The DNS packet to convert to a DID document.
     * @returns A Promise resolving to a {@link DidResolutionResult} object containing the DID
     *          document and its metadata.
     */
    static fromDnsPacket({ didUri, dnsPacket }: {
        didUri: string;
        dnsPacket: Packet;
    }): Promise<DidResolutionResult>;
    /**
     * Converts a DID document to a DNS packet according to the DID DHT specification.
     *
     * @see {@link https://did-dht.com/#dids-as-dns-records | DID DHT Specification, § DIDs as DNS Records}
     *
     * @param params - The parameters to use when converting a DID document to a DNS packet.
     * @param params.didDocument - The DID document to convert to a DNS packet.
     * @param params.didMetadata - The DID metadata to include in the DNS packet.
     * @param params.authoritativeGatewayUris - The URIs of the Authoritative Gateways to generate NS records from.
     * @param params.previousDidProof - The signature proof that this DID is linked to the given previous DID.
     * @returns A promise that resolves to a DNS packet.
     */
    static toDnsPacket({ didDocument, didMetadata, authoritativeGatewayUris, previousDidProof }: {
        didDocument: DidDocument;
        didMetadata: DidMetadata;
        authoritativeGatewayUris?: string[];
        previousDidProof?: PreviousDidProof;
    }): Promise<Packet>;
    /**
     * Gets the unique portion of the DID identifier after the last `:` character.
     * e.g. `did:dht:example` -> `example`
     *
     * @param did - The DID to extract the unique suffix from.
     */
    private static getUniqueDidSuffix;
}
/**
 * The `DidDhtUtils` class provides utility functions to support operations in the DID DHT method.
 * This includes functions for creating and parsing BEP44 messages, handling identity keys, and
 * converting between different formats and representations.
 */
export declare class DidDhtUtils {
    /**
     * Creates a BEP44 put message, which is used to publish a DID document to the DHT network.
     *
     * @param params - The parameters to use when creating the BEP44 put message
     * @param params.dnsPacket - The DNS packet to encode in the BEP44 message.
     * @param params.publicKeyBytes - The public key bytes of the Identity Key.
     * @param params.signer - Signer that can sign and verify data using the Identity Key.
     * @returns A promise that resolves to a BEP44 put message.
     */
    static createBep44PutMessage({ dnsPacket, publicKeyBytes, signer }: {
        dnsPacket: Packet;
        publicKeyBytes: Uint8Array;
        signer: Signer;
    }): Promise<Bep44Message>;
    /**
     * Converts a DID URI to a JSON Web Key (JWK) representing the Identity Key.
     *
     * @param params - The parameters to use for the conversion.
     * @param params.didUri - The DID URI containing the Identity Key.
     * @returns A promise that resolves to a JWK representing the Identity Key.
     */
    static identifierToIdentityKey({ didUri }: {
        didUri: string;
    }): Promise<Jwk>;
    /**
     * Converts a DID URI to the byte array representation of the Identity Key.
     *
     * @param params - The parameters to use for the conversion.
     * @param params.didUri - The DID URI containing the Identity Key.
     * @returns A byte array representation of the Identity Key.
     */
    static identifierToIdentityKeyBytes({ didUri }: {
        didUri: string;
    }): Uint8Array;
    /**
     * Encodes a DID DHT Identity Key into a DID identifier.
     *
     * This method first z-base-32 encodes the Identity Key. The resulting string is prefixed with
     * `did:dht:` to form the DID identifier.
     *
     * @param params - The parameters to use for the conversion.
     * @param params.identityKey The Identity Key from which the DID identifier is computed.
     * @returns A promise that resolves to a string containing the DID identifier.
     */
    static identityKeyToIdentifier({ identityKey }: {
        identityKey: Jwk;
    }): Promise<string>;
    /**
     * Returns the appropriate key converter for the specified cryptographic curve.
     *
     * @param curve - The cryptographic curve to use for the key conversion.
     * @returns An `AsymmetricKeyConverter` for the specified curve.
     */
    static keyConverter(curve: string): AsymmetricKeyConverter;
    /**
     * Parses and verifies a BEP44 Get message, converting it to a DNS packet.
     *
     * @param params - The parameters to use when verifying and parsing the BEP44 Get response message.
     * @param params.bep44Message - The BEP44 message to verify and parse.
     * @returns A promise that resolves to a DNS packet.
     */
    static parseBep44GetMessage({ bep44Message }: {
        bep44Message: Bep44Message;
    }): Promise<Packet>;
    /**
     * Decodes and parses the data value of a DNS TXT record into a key-value object.
     *
     * @param txtData - The data value of a DNS TXT record.
     * @returns An object containing the key/value pairs of the TXT record data.
     */
    static parseTxtDataToObject(txtData: TxtData): Record<string, string>;
    /**
     * Decodes and parses the data value of a DNS TXT record into a string.
     *
     * @param txtData - The data value of a DNS TXT record.
     * @returns A string representation of the TXT record data.
     */
    static parseTxtDataToString(txtData: TxtData): string;
    /**
     * Validates the proof of previous DID given.
     *
     * @param params - The parameters to validate the previous DID proof.
     * @param params.newDid - The new DID that the previous DID is linking to.
     * @param params.previousDidProof - The proof of the previous DID, containing the previous DID and signature signed by the previous DID.
     */
    static validatePreviousDidProof({ newDid, previousDidProof }: {
        newDid: string;
        previousDidProof: PreviousDidProof;
    }): Promise<void>;
    /**
     * Splits a string into chunks of length 255 if the string exceeds length 255.
     * @param data - The string to split into chunks.
     * @returns The original string if its length is less than or equal to 255, otherwise an array of chunked strings.
     */
    static chunkDataIfNeeded(data: string): string | string[];
}
//# sourceMappingURL=did-dht.d.ts.map