var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IonDid, IonRequest } from '@decentralized-identity/ion-sdk';
import { LocalKeyManager, computeJwkThumbprint } from '@web5/crypto';
import { Did } from '../did.js';
import { BearerDid } from '../bearer-did.js';
import { DidMethod } from '../methods/did-method.js';
import { DidError, DidErrorCode } from '../did-error.js';
import { getVerificationRelationshipsById } from '../utils.js';
import { EMPTY_DID_RESOLUTION_RESULT } from '../types/did-resolution.js';
/**
 * Enumerates the types of keys that can be used in a DID ION document.
 *
 * The DID ION method supports various cryptographic key types. These key types are essential for
 * the creation and management of DIDs and their associated cryptographic operations like signing
 * and encryption.
 */
export var DidIonRegisteredKeyType;
(function (DidIonRegisteredKeyType) {
    /**
     * Ed25519: A public-key signature system using the EdDSA (Edwards-curve Digital Signature
     * Algorithm) and Curve25519.
     */
    DidIonRegisteredKeyType["Ed25519"] = "Ed25519";
    /**
     * secp256k1: A cryptographic curve used for digital signatures in a range of decentralized
     * systems.
     */
    DidIonRegisteredKeyType["secp256k1"] = "secp256k1";
    /**
     * secp256r1: Also known as P-256 or prime256v1, this curve is used for cryptographic operations
     * and is widely supported in various cryptographic libraries and standards.
     */
    DidIonRegisteredKeyType["secp256r1"] = "secp256r1";
    /**
     * X25519: A Diffie-Hellman key exchange algorithm using Curve25519.
     */
    DidIonRegisteredKeyType["X25519"] = "X25519";
})(DidIonRegisteredKeyType || (DidIonRegisteredKeyType = {}));
/**
 * Private helper that maps algorithm identifiers to their corresponding DID ION
 * {@link DidIonRegisteredKeyType | registered key type}.
 */
const AlgorithmToKeyTypeMap = {
    Ed25519: DidIonRegisteredKeyType.Ed25519,
    ES256K: DidIonRegisteredKeyType.secp256k1,
    ES256: DidIonRegisteredKeyType.secp256r1,
    'P-256': DidIonRegisteredKeyType.secp256r1,
    secp256k1: DidIonRegisteredKeyType.secp256k1,
    secp256r1: DidIonRegisteredKeyType.secp256r1
};
/**
 * The default node to use as a gateway to the Sidetree newtork when anchoring, updating, and
 * resolving DID documents.
 */
const DEFAULT_GATEWAY_URI = 'https://ion.tbd.engineering';
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
export class DidIon extends DidMethod {
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
    static create() {
        return __awaiter(this, arguments, void 0, function* ({ keyManager = new LocalKeyManager(), options = {} } = {}) {
            // Before processing the create operation, validate DID-method-specific requirements to prevent
            // keys from being generated unnecessarily.
            var _a, _b, _c, _d, _e, _f, _g;
            // Check 1: Validate that the algorithm for any given verification method is supported by the
            // DID ION specification.
            if ((_a = options.verificationMethods) === null || _a === void 0 ? void 0 : _a.some(vm => !(vm.algorithm in AlgorithmToKeyTypeMap))) {
                throw new Error('One or more verification method algorithms are not supported');
            }
            // Check 2: Validate that the ID for any given verification method is unique.
            const methodIds = (_b = options.verificationMethods) === null || _b === void 0 ? void 0 : _b.filter(vm => 'id' in vm).map(vm => vm.id);
            if (methodIds && methodIds.length !== new Set(methodIds).size) {
                throw new Error('One or more verification method IDs are not unique');
            }
            // Check 3: Validate that the required properties for any given services are present.
            if ((_c = options.services) === null || _c === void 0 ? void 0 : _c.some(s => !s.id || !s.type || !s.serviceEndpoint)) {
                throw new Error('One or more services are missing required properties');
            }
            // If no verification methods were specified, generate a default Ed25519 verification method.
            const defaultVerificationMethod = {
                algorithm: 'Ed25519',
                purposes: ['authentication', 'assertionMethod', 'capabilityDelegation', 'capabilityInvocation']
            };
            const verificationMethodsToAdd = [];
            // Generate random key material for additional verification methods, if any.
            for (const vm of (_d = options.verificationMethods) !== null && _d !== void 0 ? _d : [defaultVerificationMethod]) {
                // Generate a random key for the verification method.
                const keyUri = yield keyManager.generateKey({ algorithm: vm.algorithm });
                const publicKey = yield keyManager.getPublicKey({ keyUri });
                // Add the verification method to the DID document.
                verificationMethodsToAdd.push({
                    id: vm.id,
                    publicKeyJwk: publicKey,
                    purposes: (_e = vm.purposes) !== null && _e !== void 0 ? _e : ['authentication', 'assertionMethod', 'capabilityDelegation', 'capabilityInvocation']
                });
            }
            // Generate a random key for the ION Recovery Key. Sidetree requires secp256k1 recovery keys.
            const recoveryKeyUri = yield keyManager.generateKey({ algorithm: DidIonRegisteredKeyType.secp256k1 });
            const recoveryKey = yield keyManager.getPublicKey({ keyUri: recoveryKeyUri });
            // Generate a random key for the ION Update Key. Sidetree requires secp256k1 update keys.
            const updateKeyUri = yield keyManager.generateKey({ algorithm: DidIonRegisteredKeyType.secp256k1 });
            const updateKey = yield keyManager.getPublicKey({ keyUri: updateKeyUri });
            // Compute the Long Form DID URI from the keys and services, if any.
            const longFormDidUri = yield DidIonUtils.computeLongFormDidUri({
                recoveryKey,
                updateKey,
                services: (_f = options.services) !== null && _f !== void 0 ? _f : [],
                verificationMethods: verificationMethodsToAdd
            });
            // Expand the DID URI string to a DID document.
            const { didDocument, didResolutionMetadata } = yield DidIon.resolve(longFormDidUri, { gatewayUri: options.gatewayUri });
            if (didDocument === null) {
                throw new Error(`Unable to resolve DID during creation: ${didResolutionMetadata === null || didResolutionMetadata === void 0 ? void 0 : didResolutionMetadata.error}`);
            }
            // Create the BearerDid object, including the "Short Form" of the DID URI, the ION update and
            // recovery keys, and specifying that the DID has not yet been published.
            const did = new BearerDid({
                uri: longFormDidUri,
                document: didDocument,
                metadata: {
                    published: false,
                    canonicalId: longFormDidUri.split(':', 3).join(':'),
                    recoveryKey,
                    updateKey
                },
                keyManager
            });
            // By default, publish the DID document to a Sidetree node unless explicitly disabled.
            if ((_g = options.publish) !== null && _g !== void 0 ? _g : true) {
                const registrationResult = yield DidIon.publish({ did, gatewayUri: options.gatewayUri });
                did.metadata = registrationResult.didDocumentMetadata;
            }
            return did;
        });
    }
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
    static getSigningMethod(_a) {
        return __awaiter(this, arguments, void 0, function* ({ didDocument, methodId }) {
            var _b;
            // Verify the DID method is supported.
            const parsedDid = Did.parse(didDocument.id);
            if (parsedDid && parsedDid.method !== this.methodName) {
                throw new DidError(DidErrorCode.MethodNotSupported, `Method not supported: ${parsedDid.method}`);
            }
            // Get the verification method with either the specified ID or the first assertion method.
            const verificationMethod = (_b = didDocument.verificationMethod) === null || _b === void 0 ? void 0 : _b.find(vm => { var _a; return vm.id === (methodId !== null && methodId !== void 0 ? methodId : (_a = didDocument.assertionMethod) === null || _a === void 0 ? void 0 : _a[0]); });
            if (!(verificationMethod && verificationMethod.publicKeyJwk)) {
                throw new DidError(DidErrorCode.InternalError, 'A verification method intended for signing could not be determined from the DID Document');
            }
            return verificationMethod;
        });
    }
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
    static import(_a) {
        return __awaiter(this, arguments, void 0, function* ({ portableDid, keyManager = new LocalKeyManager() }) {
            // Verify the DID method is supported.
            const parsedDid = Did.parse(portableDid.uri);
            if ((parsedDid === null || parsedDid === void 0 ? void 0 : parsedDid.method) !== DidIon.methodName) {
                throw new DidError(DidErrorCode.MethodNotSupported, `Method not supported`);
            }
            const did = yield BearerDid.import({ portableDid, keyManager });
            return did;
        });
    }
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
    static publish(_a) {
        return __awaiter(this, arguments, void 0, function* ({ did, gatewayUri = DEFAULT_GATEWAY_URI }) {
            var _b, _c, _d;
            // Construct an ION verification method made up of the id, public key, and purposes from each
            // verification method in the DID document.
            const verificationMethods = (_c = (_b = did.document.verificationMethod) === null || _b === void 0 ? void 0 : _b.map(vm => ({
                id: vm.id,
                publicKeyJwk: vm.publicKeyJwk,
                purposes: getVerificationRelationshipsById({ didDocument: did.document, methodId: vm.id })
            }))) !== null && _c !== void 0 ? _c : [];
            // Create the ION document.
            const ionDocument = yield DidIonUtils.createIonDocument({
                services: (_d = did.document.service) !== null && _d !== void 0 ? _d : [],
                verificationMethods
            });
            // Construct the ION Create Operation request.
            const createOperation = yield DidIonUtils.constructCreateRequest({
                ionDocument,
                recoveryKey: did.metadata.recoveryKey,
                updateKey: did.metadata.updateKey
            });
            try {
                // Construct the URL of the SideTree node's operations endpoint.
                const operationsUrl = DidIonUtils.appendPathToUrl({
                    baseUrl: gatewayUri,
                    path: `/operations`
                });
                // Submit the Create Operation to the operations endpoint.
                const response = yield fetch(operationsUrl, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createOperation)
                });
                // Return the result of processing the Create operation, including the updated DID metadata
                // with the publishing result.
                return {
                    didDocument: did.document,
                    didDocumentMetadata: Object.assign(Object.assign({}, did.metadata), { published: response.ok }),
                    didRegistrationMetadata: {}
                };
            }
            catch (error) {
                return {
                    didDocument: null,
                    didDocumentMetadata: {
                        published: false,
                    },
                    didRegistrationMetadata: {
                        error: DidErrorCode.InternalError,
                        errorMessage: `Failed to publish DID document for: ${did.uri}`
                    }
                };
            }
        });
    }
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
    static resolve(didUri_1) {
        return __awaiter(this, arguments, void 0, function* (didUri, options = {}) {
            var _a, _b;
            // Attempt to parse the DID URI.
            const parsedDid = Did.parse(didUri);
            // If parsing failed, the DID is invalid.
            if (!parsedDid) {
                return Object.assign(Object.assign({}, EMPTY_DID_RESOLUTION_RESULT), { didResolutionMetadata: { error: 'invalidDid' } });
            }
            // If the DID method is not "ion", return an error.
            if (parsedDid.method !== DidIon.methodName) {
                return Object.assign(Object.assign({}, EMPTY_DID_RESOLUTION_RESULT), { didResolutionMetadata: { error: 'methodNotSupported' } });
            }
            // To execute the read method operation, use the given gateway URI or a default Sidetree node.
            const gatewayUri = (_a = options === null || options === void 0 ? void 0 : options.gatewayUri) !== null && _a !== void 0 ? _a : DEFAULT_GATEWAY_URI;
            try {
                // Construct the URL to be used in the resolution request.
                const resolutionUrl = DidIonUtils.appendPathToUrl({
                    baseUrl: gatewayUri,
                    path: `/identifiers/${didUri}`
                });
                // Attempt to retrieve the DID document and metadata from the Sidetree node.
                const response = yield fetch(resolutionUrl);
                // If the DID document was not found, return an error.
                if (!response.ok) {
                    throw new DidError(DidErrorCode.NotFound, `Unable to find DID document for: ${didUri}`);
                }
                // If the DID document was retrieved successfully, return it.
                const { didDocument, didDocumentMetadata } = yield response.json();
                return Object.assign(Object.assign(Object.assign({}, EMPTY_DID_RESOLUTION_RESULT), didDocument && { didDocument }), { didDocumentMetadata: Object.assign({ published: (_b = didDocumentMetadata === null || didDocumentMetadata === void 0 ? void 0 : didDocumentMetadata.method) === null || _b === void 0 ? void 0 : _b.published }, didDocumentMetadata) });
            }
            catch (error) {
                // Rethrow any unexpected errors that are not a `DidError`.
                if (!(error instanceof DidError))
                    throw new Error(error);
                // Return a DID Resolution Result with the appropriate error code.
                return Object.assign(Object.assign({}, EMPTY_DID_RESOLUTION_RESULT), { didResolutionMetadata: Object.assign({ error: error.code }, error.message && { errorMessage: error.message }) });
            }
        });
    }
}
/**
 * Name of the DID method, as defined in the DID ION specification.
 */
DidIon.methodName = 'ion';
/**
 * The `DidIonUtils` class provides utility functions to support operations in the DID ION method.
 */
export class DidIonUtils {
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
    static appendPathToUrl({ baseUrl, path }) {
        const url = new URL(baseUrl);
        url.pathname = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
        url.pathname += path.startsWith('/') ? path.substring(1) : path;
        return url.toString();
    }
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
    static computeLongFormDidUri(_a) {
        return __awaiter(this, arguments, void 0, function* ({ recoveryKey, updateKey, services, verificationMethods }) {
            // Create the ION document.
            const ionDocument = yield DidIonUtils.createIonDocument({ services, verificationMethods });
            // Normalize JWK to onnly include specific members and in lexicographic order.
            const normalizedRecoveryKey = DidIonUtils.normalizeJwk(recoveryKey);
            const normalizedUpdateKey = DidIonUtils.normalizeJwk(updateKey);
            // Compute the Long Form DID URI.
            const longFormDidUri = yield IonDid.createLongFormDid({
                document: ionDocument,
                recoveryKey: normalizedRecoveryKey,
                updateKey: normalizedUpdateKey
            });
            return longFormDidUri;
        });
    }
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
    static constructCreateRequest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ ionDocument, recoveryKey, updateKey }) {
            // Create an ION DID create request operation.
            const createRequest = yield IonRequest.createCreateRequest({
                document: ionDocument,
                recoveryKey: DidIonUtils.normalizeJwk(recoveryKey),
                updateKey: DidIonUtils.normalizeJwk(updateKey)
            });
            return createRequest;
        });
    }
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
    static createIonDocument(_a) {
        return __awaiter(this, arguments, void 0, function* ({ services, verificationMethods }) {
            var _b, _c;
            /**
             * STEP 1: Convert verification methods to ION SDK format.
             */
            const ionPublicKeys = [];
            for (const vm of verificationMethods) {
                // Use the given ID, the key's ID, or the key's thumbprint as the verification method ID.
                let methodId = (_c = (_b = vm.id) !== null && _b !== void 0 ? _b : vm.publicKeyJwk.kid) !== null && _c !== void 0 ? _c : yield computeJwkThumbprint({ jwk: vm.publicKeyJwk });
                methodId = `${methodId.split('#').pop()}`; // Remove fragment prefix, if any.
                // Convert public key JWK to ION format.
                const publicKey = {
                    id: methodId,
                    publicKeyJwk: DidIonUtils.normalizeJwk(vm.publicKeyJwk),
                    purposes: vm.purposes,
                    type: 'JsonWebKey2020'
                };
                ionPublicKeys.push(publicKey);
            }
            /**
             * STEP 2: Convert service entries, if any, to ION SDK format.
             */
            const ionServices = services.map(service => (Object.assign(Object.assign({}, service), { id: `${service.id.split('#').pop()}` // Remove fragment prefix, if any.
             })));
            /**
             * STEP 3: Format as ION document.
             */
            const ionDocumentModel = {
                publicKeys: ionPublicKeys,
                services: ionServices
            };
            return ionDocumentModel;
        });
    }
    /**
     * Normalize the given JWK to include only specific members and in lexicographic order.
     *
     * @param jwk - The JWK to normalize.
     * @returns The normalized JWK.
     */
    static normalizeJwk(jwk) {
        const keyType = jwk.kty;
        let normalizedJwk;
        if (keyType === 'EC') {
            normalizedJwk = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y };
        }
        else if (keyType === 'oct') {
            normalizedJwk = { k: jwk.k, kty: jwk.kty };
        }
        else if (keyType === 'OKP') {
            normalizedJwk = { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
        }
        else if (keyType === 'RSA') {
            normalizedJwk = { e: jwk.e, kty: jwk.kty, n: jwk.n };
        }
        else {
            throw new Error(`Unsupported key type: ${keyType}`);
        }
        return normalizedJwk;
    }
}
//# sourceMappingURL=did-ion.js.map