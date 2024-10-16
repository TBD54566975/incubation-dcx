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
import { Cid } from '../utils/cid.js';
import { Encoder } from '../utils/encoder.js';
import { Encryption } from '../utils/encryption.js';
import { EncryptionAlgorithm } from '../utils/encryption.js';
import { GeneralJwsBuilder } from '../jose/jws/general/builder.js';
import { Jws } from '../utils/jws.js';
import { KeyDerivationScheme } from '../utils/hd-key.js';
import { Message } from '../core/message.js';
import { PermissionGrant } from '../protocols/permission-grant.js';
import { Records } from '../utils/records.js';
import { RecordsGrantAuthorization } from '../core/records-grant-authorization.js';
import { removeUndefinedProperties } from '../utils/object.js';
import { Secp256k1 } from '../utils/secp256k1.js';
import { Time } from '../utils/time.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
import { normalizeProtocolUrl, normalizeSchemaUrl, validateProtocolUrlNormalized, validateSchemaUrlNormalized } from '../utils/url.js';
/**
 * A class representing a RecordsWrite DWN message.
 * NOTE: Unable to extend `AbstractMessage` directly because the incompatible `_message` type, which is not just a generic `<M>` type.
 */
export class RecordsWrite {
    /**
     * Valid JSON message representing this RecordsWrite.
     * @throws `DwnErrorCode.RecordsWriteMissingSigner` if the message is not signed yet.
     */
    get message() {
        if (this._message.authorization === undefined) {
            throw new DwnError(DwnErrorCode.RecordsWriteMissingSigner, 'This RecordsWrite is not yet signed, JSON message cannot be generated from an incomplete state.');
        }
        return this._message;
    }
    get author() {
        return this._author;
    }
    get signaturePayload() {
        return this._signaturePayload;
    }
    /**
     * The owner DID of the message if owner signature is present in the message; `undefined` otherwise.
     * This is the logical owner of the message, not to be confused with the actual signer of the owner signature,
     * this is because the signer of the owner signature may not be the actual DWN owner, but a delegate authorized by the owner.
     */
    get owner() {
        return this._owner;
    }
    /**
     * Decoded owner signature payload.
     */
    get ownerSignaturePayload() {
        return this._ownerSignaturePayload;
    }
    /**
     * If this message is signed by an author-delegate.
     */
    get isSignedByAuthorDelegate() {
        return Message.isSignedByAuthorDelegate(this._message);
    }
    /**
     * If this message is signed by an owner-delegate.
     */
    get isSignedByOwnerDelegate() {
        return Message.isSignedByOwnerDelegate(this._message);
    }
    /**
     * Gets the signer of this message.
     * This is not to be confused with the logical author of the message.
     */
    get signer() {
        return Message.getSigner(this._message);
    }
    /**
     * Gets the signer of owner signature; `undefined` if owner signature is not present in the message.
     * This is not to be confused with the logical owner {@link #owner} of the message,
     * this is because the signer of the owner signature may not be the actual DWN owner, but a delegate authorized by the owner.
     * In the case that the owner signature is signed by the actual DWN owner, this value will be the same as {@link #owner}.
     */
    get ownerSignatureSigner() {
        var _a;
        if (((_a = this._message.authorization) === null || _a === void 0 ? void 0 : _a.ownerSignature) === undefined) {
            return undefined;
        }
        const signer = Jws.getSignerDid(this._message.authorization.ownerSignature.signatures[0]);
        return signer;
    }
    constructor(message, parentContextId) {
        this.parentContextId = parentContextId;
        this._message = message;
        if (message.authorization !== undefined) {
            this._author = Records.getAuthor(message);
            this._signaturePayload = Jws.decodePlainObjectPayload(message.authorization.signature);
            if (message.authorization.ownerSignature !== undefined) {
                // if the message authorization contains owner delegated grant, the owner would be the grantor of the grant
                // else the owner would be the signer of the owner signature
                if (message.authorization.ownerDelegatedGrant !== undefined) {
                    this._owner = Message.getSigner(message.authorization.ownerDelegatedGrant);
                }
                else {
                    this._owner = Jws.getSignerDid(message.authorization.ownerSignature.signatures[0]);
                }
                this._ownerSignaturePayload = Jws.decodePlainObjectPayload(message.authorization.ownerSignature);
            }
        }
        this.attesters = RecordsWrite.getAttesters(message);
        // consider converting isInitialWrite() & getEntryId() into properties for performance and convenience
    }
    /**
     * Parses a RecordsWrite message and returns a {RecordsWrite} instance.
     */
    static parse(recordsWriteMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            // Make a copy so that the stored copy is not subject to external, unexpected modification.
            const message = JSON.parse(JSON.stringify(recordsWriteMessage));
            // asynchronous checks that are required by the constructor to initialize members properly
            yield Message.validateSignatureStructure(message.authorization.signature, message.descriptor, 'RecordsWriteSignaturePayload');
            if (message.authorization.ownerSignature !== undefined) {
                yield Message.validateSignatureStructure(message.authorization.ownerSignature, message.descriptor);
            }
            yield RecordsWrite.validateAttestationIntegrity(message);
            const recordsWrite = new RecordsWrite(message);
            yield recordsWrite.validateIntegrity(); // RecordsWrite specific data integrity check
            return recordsWrite;
        });
    }
    /**
     * Creates a RecordsWrite message.
     * @param options.recordId If `undefined`, will be auto-filled as the initial message as convenience for developer.
     * @param options.data Data used to compute the `dataCid`, must be the encrypted data bytes if `options.encryptionInput` is given.
     *                     Must specify `options.dataCid` if `undefined`.
     * @param options.dataCid CID of the data that is already stored in the DWN. Must specify `options.data` if `undefined`.
     * @param options.dataSize Size of data in number of bytes. Must be defined if `options.dataCid` is defined; must be `undefined` otherwise.
     * @param options.dateCreated If `undefined`, it will be auto-filled with current time.
     * @param options.messageTimestamp If `undefined`, it will be auto-filled with current time.
     * @param options.parentContextId Must be given if this message is for a non-root protocol record.
     *                                If not given, it either means this write is for a root protocol record or a flat-space record.
     */
    static create(options) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if ((options.protocol === undefined && options.protocolPath !== undefined) ||
                (options.protocol !== undefined && options.protocolPath === undefined)) {
                throw new DwnError(DwnErrorCode.RecordsWriteCreateProtocolAndProtocolPathMutuallyInclusive, '`protocol` and `protocolPath` must both be defined or undefined at the same time');
            }
            if ((options.data === undefined && options.dataCid === undefined) ||
                (options.data !== undefined && options.dataCid !== undefined)) {
                throw new DwnError(DwnErrorCode.RecordsWriteCreateDataAndDataCidMutuallyExclusive, 'one and only one parameter between `data` and `dataCid` is required');
            }
            if ((options.dataCid === undefined && options.dataSize !== undefined) ||
                (options.dataCid !== undefined && options.dataSize === undefined)) {
                throw new DwnError(DwnErrorCode.RecordsWriteCreateDataCidAndDataSizeMutuallyInclusive, '`dataCid` and `dataSize` must both be defined or undefined at the same time');
            }
            if (options.signer === undefined && options.delegatedGrant !== undefined) {
                throw new DwnError(DwnErrorCode.RecordsWriteCreateMissingSigner, '`signer` must be given when `delegatedGrant` is given');
            }
            const dataCid = (_a = options.dataCid) !== null && _a !== void 0 ? _a : yield Cid.computeDagPbCidFromBytes(options.data);
            const dataSize = (_b = options.dataSize) !== null && _b !== void 0 ? _b : options.data.length;
            const currentTime = Time.getCurrentTimestamp();
            const descriptor = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol: options.protocol !== undefined ? normalizeProtocolUrl(options.protocol) : undefined,
                protocolPath: options.protocolPath,
                recipient: options.recipient,
                schema: options.schema !== undefined ? normalizeSchemaUrl(options.schema) : undefined,
                tags: options.tags,
                parentId: RecordsWrite.getRecordIdFromContextId(options.parentContextId),
                dataCid,
                dataSize,
                dateCreated: (_c = options.dateCreated) !== null && _c !== void 0 ? _c : currentTime,
                messageTimestamp: (_d = options.messageTimestamp) !== null && _d !== void 0 ? _d : currentTime,
                published: options.published,
                datePublished: options.datePublished,
                dataFormat: options.dataFormat
            };
            // generate `datePublished` if the message is to be published but `datePublished` is not given
            if (options.published === true &&
                options.datePublished === undefined) {
                descriptor.datePublished = currentTime;
            }
            // delete all descriptor properties that are `undefined` else the code will encounter the following IPLD issue when attempting to generate CID:
            // Error: `undefined` is not supported by the IPLD Data Model and cannot be encoded
            removeUndefinedProperties(descriptor);
            // `recordId` computation
            const recordId = options.recordId;
            // `attestation` generation
            const descriptorCid = yield Cid.computeCid(descriptor);
            const attestation = yield RecordsWrite.createAttestation(descriptorCid, options.attestationSigners);
            // `encryption` generation
            const encryption = yield RecordsWrite.createEncryptionProperty(descriptor, options.encryptionInput);
            const message = {
                recordId,
                descriptor
            };
            // assign optional properties only if they exist
            if (attestation !== undefined) {
                message.attestation = attestation;
            }
            if (encryption !== undefined) {
                message.encryption = encryption;
            }
            const recordsWrite = new RecordsWrite(message, options.parentContextId);
            if (options.signer !== undefined) {
                yield recordsWrite.sign({
                    signer: options.signer,
                    delegatedGrant: options.delegatedGrant,
                    permissionGrantId: options.permissionGrantId,
                    protocolRole: options.protocolRole
                });
            }
            return recordsWrite;
        });
    }
    static getRecordIdFromContextId(contextId) {
        return contextId === null || contextId === void 0 ? void 0 : contextId.split('/').filter(segment => segment !== '').pop();
    }
    /**
     * Convenience method that creates a message by:
     * 1. Copying over immutable properties from the given source message
     * 2. Copying over mutable properties that are not overwritten from the given source message
     * 3. Replace the mutable properties that are given new value
     * @param options.recordsWriteMessage Message that the new RecordsWrite will be based from.
     * @param options.messageTimestamp The new date the record is modified. If not given, current time will be used .
     * @param options.data The new data or the record. If not given, data from given message will be used.
     * @param options.published The new published state. If not given, then will be set to `true` if {options.messageTimestamp} is given;
     * else the state from given message will be used.
     * @param options.publishedDate The new date the record is modified. If not given, then:
     * - will not be set if the record will be unpublished as the result of this RecordsWrite; else
     * - will be set to the same published date as the given message if it wss already published; else
     * - will be set to current time (because this is a toggle from unpublished to published)
     */
    static createFrom(options) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const sourceMessage = options.recordsWriteMessage;
            const sourceRecordsWrite = yield RecordsWrite.parse(sourceMessage);
            const currentTime = Time.getCurrentTimestamp();
            // inherit published value from parent if neither published nor datePublished is specified
            const published = (_a = options.published) !== null && _a !== void 0 ? _a : (options.datePublished ? true : sourceMessage.descriptor.published);
            // use current time if published but no explicit time given
            let datePublished = undefined;
            // if given explicitly published dated
            if (options.datePublished) {
                datePublished = options.datePublished;
            }
            else {
                // if this RecordsWrite will publish the record
                if (published) {
                    // the parent was already published, inherit the same published date
                    if (sourceMessage.descriptor.published) {
                        datePublished = sourceMessage.descriptor.datePublished;
                    }
                    else {
                        // this is a toggle from unpublished to published, use current time
                        datePublished = currentTime;
                    }
                }
            }
            const createOptions = {
                // immutable properties below, just copy from the source message
                recipient: sourceMessage.descriptor.recipient,
                recordId: sourceMessage.recordId,
                dateCreated: sourceMessage.descriptor.dateCreated,
                protocol: sourceMessage.descriptor.protocol,
                protocolPath: sourceMessage.descriptor.protocolPath,
                schema: sourceMessage.descriptor.schema,
                parentContextId: Records.getParentContextFromOfContextId(sourceMessage.contextId),
                // mutable properties below
                messageTimestamp: (_b = options.messageTimestamp) !== null && _b !== void 0 ? _b : currentTime,
                published,
                datePublished,
                tags: options.tags,
                data: options.data,
                dataCid: options.data ? undefined : sourceMessage.descriptor.dataCid,
                dataSize: options.data ? undefined : sourceMessage.descriptor.dataSize,
                dataFormat: (_c = options.dataFormat) !== null && _c !== void 0 ? _c : sourceMessage.descriptor.dataFormat,
                protocolRole: (_d = options.protocolRole) !== null && _d !== void 0 ? _d : sourceRecordsWrite.signaturePayload.protocolRole,
                delegatedGrant: options.delegatedGrant,
                // finally still need signers
                signer: options.signer,
                attestationSigners: options.attestationSigners
            };
            const recordsWrite = yield RecordsWrite.create(createOptions);
            return recordsWrite;
        });
    }
    /**
     * Called by `JSON.stringify(...)` automatically.
     */
    toJSON() {
        return this.message;
    }
    /**
     * Encrypts the symmetric encryption key using the public keys given and attach the resulting `encryption` property to the RecordsWrite.
     */
    encryptSymmetricEncryptionKey(encryptionInput) {
        return __awaiter(this, void 0, void 0, function* () {
            this._message.encryption = yield RecordsWrite.createEncryptionProperty(this._message.descriptor, encryptionInput);
            // opportunity here to re-sign instead of remove
            delete this._message.authorization;
            this._signaturePayload = undefined;
            this._author = undefined;
        });
    }
    /**
     * Signs the RecordsWrite, the signer is commonly the author, but can also be a delegate.
     */
    sign(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { signer, delegatedGrant, permissionGrantId, protocolRole } = options;
            // compute delegated grant ID and author if delegated grant is given
            let delegatedGrantId;
            let authorDid;
            if (delegatedGrant !== undefined) {
                delegatedGrantId = yield Message.getCid(delegatedGrant);
                authorDid = Jws.getSignerDid(delegatedGrant.authorization.signature.signatures[0]);
            }
            else {
                authorDid = Jws.extractDid(signer.keyId);
            }
            const descriptor = this._message.descriptor;
            const descriptorCid = yield Cid.computeCid(descriptor);
            // compute `recordId` if not given at construction time
            this._message.recordId = (_a = this._message.recordId) !== null && _a !== void 0 ? _a : yield RecordsWrite.getEntryId(authorDid, descriptor);
            // compute `contextId` if this is a protocol-space record
            if (this._message.descriptor.protocol !== undefined) {
                // if `parentContextId` is not given, this is a root protocol record
                if (this.parentContextId === undefined || this.parentContextId === '') {
                    this._message.contextId = this._message.recordId;
                }
                else {
                    // else this is a non-root protocol record
                    this._message.contextId = this.parentContextId + '/' + this._message.recordId;
                }
            }
            // `signature` generation
            const signature = yield RecordsWrite.createSignerSignature({
                recordId: this._message.recordId,
                contextId: this._message.contextId,
                descriptorCid,
                attestation: this._message.attestation,
                encryption: this._message.encryption,
                signer,
                delegatedGrantId,
                permissionGrantId,
                protocolRole
            });
            this._message.authorization = { signature };
            if (delegatedGrant !== undefined) {
                this._message.authorization.authorDelegatedGrant = delegatedGrant;
            }
            // there is opportunity to optimize here as the payload is constructed within `createAuthorization(...)`
            this._signaturePayload = Jws.decodePlainObjectPayload(signature);
            this._author = authorDid;
        });
    }
    /**
     * Signs the `RecordsWrite` as the DWN owner.
     * This is used when the DWN owner wants to retain a copy of a message that the owner did not author.
     * NOTE: requires the `RecordsWrite` to already have the author's signature.
     */
    signAsOwner(signer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._author === undefined) {
                throw new DwnError(DwnErrorCode.RecordsWriteSignAsOwnerUnknownAuthor, 'Unable to sign as owner without message signature because owner needs to sign over `recordId` which depends on author DID.');
            }
            const descriptor = this._message.descriptor;
            const ownerSignature = yield Message.createSignature(descriptor, signer);
            this._message.authorization.ownerSignature = ownerSignature;
            this._ownerSignaturePayload = Jws.decodePlainObjectPayload(ownerSignature);
            this._owner = Jws.extractDid(signer.keyId);
            ;
        });
    }
    /**
     * Signs the `RecordsWrite` as the DWN owner-delegate.
     * This is used when a DWN owner-delegate wants to retain a copy of a message that the owner did not author.
     * NOTE: requires the `RecordsWrite` to already have the author's signature.
     */
    signAsOwnerDelegate(signer, delegatedGrant) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._author === undefined) {
                throw new DwnError(DwnErrorCode.RecordsWriteSignAsOwnerDelegateUnknownAuthor, 'Unable to sign as owner delegate without message signature because owner delegate needs to sign over `recordId` which depends on author DID.');
            }
            const delegatedGrantId = yield Message.getCid(delegatedGrant);
            const descriptor = this._message.descriptor;
            const ownerSignature = yield Message.createSignature(descriptor, signer, { delegatedGrantId });
            this._message.authorization.ownerSignature = ownerSignature;
            this._message.authorization.ownerDelegatedGrant = delegatedGrant;
            this._ownerSignaturePayload = Jws.decodePlainObjectPayload(ownerSignature);
            this._owner = Jws.getSignerDid(delegatedGrant.authorization.signature.signatures[0]);
        });
    }
    /**
     * Validates the integrity of the RecordsWrite message assuming the message passed basic schema validation.
     * There is opportunity to integrate better with `validateSchema(...)`
     */
    validateIntegrity() {
        return __awaiter(this, void 0, void 0, function* () {
            // if the new message is the initial write
            const isInitialWrite = yield this.isInitialWrite();
            if (isInitialWrite) {
                // `messageTimestamp` and `dateCreated` equality check
                const dateRecordCreated = this.message.descriptor.dateCreated;
                const messageTimestamp = this.message.descriptor.messageTimestamp;
                if (messageTimestamp !== dateRecordCreated) {
                    throw new DwnError(DwnErrorCode.RecordsWriteValidateIntegrityDateCreatedMismatch, `messageTimestamp ${messageTimestamp} must match dateCreated ${dateRecordCreated} for the initial write`);
                }
                // if the message is also a protocol context root, the `contextId` must match the expected deterministic value
                if (this.message.descriptor.protocol !== undefined &&
                    this.message.descriptor.parentId === undefined) {
                    const expectedContextId = yield this.getEntryId();
                    if (this.message.contextId !== expectedContextId) {
                        throw new DwnError(DwnErrorCode.RecordsWriteValidateIntegrityContextIdMismatch, `contextId in message: ${this.message.contextId} does not match deterministic contextId: ${expectedContextId}`);
                    }
                }
            }
            // NOTE: validateSignatureStructure() call earlier enforces the presence of `authorization` and thus `signature` in RecordsWrite
            const signaturePayload = this.signaturePayload;
            // make sure the `recordId` in message is the same as the `recordId` in the payload of the message signature
            if (this.message.recordId !== signaturePayload.recordId) {
                throw new DwnError(DwnErrorCode.RecordsWriteValidateIntegrityRecordIdUnauthorized, `recordId in message ${this.message.recordId} does not match recordId in authorization: ${signaturePayload.recordId}`);
            }
            // if `contextId` is given in message, make sure the same `contextId` is in the payload of the message signature
            if (this.message.contextId !== signaturePayload.contextId) {
                throw new DwnError(DwnErrorCode.RecordsWriteValidateIntegrityContextIdNotInSignerSignaturePayload, `contextId in message ${this.message.contextId} does not match contextId in authorization: ${signaturePayload.contextId}`);
            }
            yield Records.validateDelegatedGrantReferentialIntegrity(this.message, signaturePayload, this.ownerSignaturePayload);
            // if `attestation` is given in message, make sure the correct `attestationCid` is in the payload of the message signature
            if (signaturePayload.attestationCid !== undefined) {
                const expectedAttestationCid = yield Cid.computeCid(this.message.attestation);
                const actualAttestationCid = signaturePayload.attestationCid;
                if (actualAttestationCid !== expectedAttestationCid) {
                    throw new DwnError(DwnErrorCode.RecordsWriteValidateIntegrityAttestationMismatch, `CID ${expectedAttestationCid} of attestation property in message does not match attestationCid in authorization: ${actualAttestationCid}`);
                }
            }
            // if `encryption` is given in message, make sure the correct `encryptionCid` is in the payload of the message signature
            if (signaturePayload.encryptionCid !== undefined) {
                const expectedEncryptionCid = yield Cid.computeCid(this.message.encryption);
                const actualEncryptionCid = signaturePayload.encryptionCid;
                if (actualEncryptionCid !== expectedEncryptionCid) {
                    throw new DwnError(DwnErrorCode.RecordsWriteValidateIntegrityEncryptionCidMismatch, `CID ${expectedEncryptionCid} of encryption property in message does not match encryptionCid in authorization: ${actualEncryptionCid}`);
                }
            }
            if (this.message.descriptor.protocol !== undefined) {
                validateProtocolUrlNormalized(this.message.descriptor.protocol);
            }
            if (this.message.descriptor.schema !== undefined) {
                validateSchemaUrlNormalized(this.message.descriptor.schema);
            }
            Time.validateTimestamp(this.message.descriptor.messageTimestamp);
            Time.validateTimestamp(this.message.descriptor.dateCreated);
            if (this.message.descriptor.datePublished) {
                Time.validateTimestamp(this.message.descriptor.datePublished);
            }
        });
    }
    /**
     * Validates the structural integrity of the `attestation` property.
     * NOTE: signature is not verified.
     */
    static validateAttestationIntegrity(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.attestation === undefined) {
                return;
            }
            // TODO: multi-attesters to be unblocked by #205 - Revisit database interfaces (https://github.com/TBD54566975/dwn-sdk-js/issues/205)
            if (message.attestation.signatures.length !== 1) {
                throw new DwnError(DwnErrorCode.RecordsWriteAttestationIntegrityMoreThanOneSignature, `Currently implementation only supports 1 attester, but got ${message.attestation.signatures.length}`);
            }
            const payloadJson = Jws.decodePlainObjectPayload(message.attestation);
            const { descriptorCid } = payloadJson;
            // `descriptorCid` validation - ensure that the provided descriptorCid matches the CID of the actual message
            const expectedDescriptorCid = yield Cid.computeCid(message.descriptor);
            if (descriptorCid !== expectedDescriptorCid) {
                throw new DwnError(DwnErrorCode.RecordsWriteAttestationIntegrityDescriptorCidMismatch, `descriptorCid ${descriptorCid} does not match expected descriptorCid ${expectedDescriptorCid}`);
            }
            // check to ensure that no other unexpected properties exist in payload.
            const propertyCount = Object.keys(payloadJson).length;
            if (propertyCount > 1) {
                throw new DwnError(DwnErrorCode.RecordsWriteAttestationIntegrityInvalidPayloadProperty, `Only 'descriptorCid' is allowed in attestation payload, but got ${propertyCount} properties.`);
            }
        });
    }
    ;
    /**
     * Computes the deterministic Entry ID of this message.
     */
    getEntryId() {
        return __awaiter(this, void 0, void 0, function* () {
            const entryId = yield RecordsWrite.getEntryId(this.author, this.message.descriptor);
            return entryId;
        });
    }
    ;
    /**
     * Computes the deterministic Entry ID of this message.
     */
    static getEntryId(author, descriptor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (author === undefined) {
                throw new DwnError(DwnErrorCode.RecordsWriteGetEntryIdUndefinedAuthor, 'Property `author` is needed to compute entry ID.');
            }
            const entryIdInput = Object.assign({}, descriptor);
            entryIdInput.author = author;
            const cid = yield Cid.computeCid(entryIdInput);
            return cid;
        });
    }
    ;
    /**
     * Checks if the given message is the initial entry of a record.
     */
    isInitialWrite() {
        return __awaiter(this, void 0, void 0, function* () {
            const entryId = yield this.getEntryId();
            return (entryId === this.message.recordId);
        });
    }
    constructIndexes(isLatestBaseState) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = this.message;
            // we want to process tags separately from the rest of descriptors as it is an object and not a primitive KeyValue type.
            const _a = message.descriptor, { tags } = _a, descriptor = __rest(_a, ["tags"]);
            delete descriptor.published; // handle `published` specifically further down
            let indexes = Object.assign(Object.assign({}, descriptor), { isLatestBaseState, published: !!message.descriptor.published, author: this.author, recordId: message.recordId, entryId: yield RecordsWrite.getEntryId(this.author, this.message.descriptor) });
            // in order to avoid name clashes with first-class index keys
            // we build the indexes with `tag.property_name` for each tag property.
            // we only index tags if the message is the latest base state, as that's the only time filtering for tags is relevant.
            if (tags !== undefined && isLatestBaseState === true) {
                const flattenedTags = Records.buildTagIndexes(Object.assign({}, tags));
                indexes = Object.assign(Object.assign({}, indexes), flattenedTags);
            }
            // add additional indexes to optional values if given
            // TODO: index multi-attesters to be unblocked by #205 - Revisit database interfaces (https://github.com/TBD54566975/dwn-sdk-js/issues/205)
            if (this.attesters.length > 0) {
                indexes.attester = this.attesters[0];
            }
            if (message.contextId !== undefined) {
                indexes.contextId = message.contextId;
            }
            return indexes;
        });
    }
    /**
     * Authorizes the author-delegate who signed this message.
     * @param messageStore Used to check if the grant has been revoked.
     */
    authorizeAuthorDelegate(messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            const delegatedGrant = yield PermissionGrant.parse(this.message.authorization.authorDelegatedGrant);
            yield RecordsGrantAuthorization.authorizeWrite({
                recordsWriteMessage: this.message,
                expectedGrantor: this.author,
                expectedGrantee: this.signer,
                permissionGrant: delegatedGrant,
                messageStore
            });
        });
    }
    /**
     * Authorizes the owner-delegate who signed this message.
     * @param messageStore Used to check if the grant has been revoked.
     */
    authorizeOwnerDelegate(messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            const delegatedGrant = yield PermissionGrant.parse(this.message.authorization.ownerDelegatedGrant);
            yield RecordsGrantAuthorization.authorizeWrite({
                recordsWriteMessage: this.message,
                expectedGrantor: this.owner,
                expectedGrantee: this.ownerSignatureSigner,
                permissionGrant: delegatedGrant,
                messageStore
            });
        });
    }
    /**
     * Checks if the given message is the initial entry of a record.
     */
    static isInitialWrite(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // can't be the initial write if the message is not a Records Write
            if (message.descriptor.interface !== DwnInterfaceName.Records ||
                message.descriptor.method !== DwnMethodName.Write) {
                return false;
            }
            const recordsWriteMessage = message;
            const author = Records.getAuthor(recordsWriteMessage);
            const entryId = yield RecordsWrite.getEntryId(author, recordsWriteMessage.descriptor);
            return (entryId === recordsWriteMessage.recordId);
        });
    }
    /**
     * Creates the `encryption` property if encryption input is given. Else `undefined` is returned.
     * @param descriptor Descriptor of the `RecordsWrite` message which contains the information need by key path derivation schemes.
     */
    static createEncryptionProperty(descriptor, encryptionInput) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (encryptionInput === undefined) {
                return undefined;
            }
            // encrypt the data encryption key once per encryption input
            const keyEncryption = [];
            for (const keyEncryptionInput of encryptionInput.keyEncryptionInputs) {
                if (keyEncryptionInput.derivationScheme === KeyDerivationScheme.ProtocolPath && descriptor.protocol === undefined) {
                    throw new DwnError(DwnErrorCode.RecordsWriteMissingProtocol, '`protocols` encryption scheme cannot be applied to record without the `protocol` property.');
                }
                if (keyEncryptionInput.derivationScheme === KeyDerivationScheme.Schemas && descriptor.schema === undefined) {
                    throw new DwnError(DwnErrorCode.RecordsWriteMissingSchema, '`schemas` encryption scheme cannot be applied to record without the `schema` property.');
                }
                // NOTE: right now only `ECIES-ES256K` algorithm is supported for asymmetric encryption,
                // so we will assume that's the algorithm without additional switch/if statements
                const publicKeyBytes = Secp256k1.publicJwkToBytes(keyEncryptionInput.publicKey);
                const keyEncryptionOutput = yield Encryption.eciesSecp256k1Encrypt(publicKeyBytes, encryptionInput.key);
                const encryptedKey = Encoder.bytesToBase64Url(keyEncryptionOutput.ciphertext);
                const ephemeralPublicKey = yield Secp256k1.publicKeyToJwk(keyEncryptionOutput.ephemeralPublicKey);
                const keyEncryptionInitializationVector = Encoder.bytesToBase64Url(keyEncryptionOutput.initializationVector);
                const messageAuthenticationCode = Encoder.bytesToBase64Url(keyEncryptionOutput.messageAuthenticationCode);
                const encryptedKeyData = {
                    rootKeyId: keyEncryptionInput.publicKeyId,
                    algorithm: (_a = keyEncryptionInput.algorithm) !== null && _a !== void 0 ? _a : EncryptionAlgorithm.EciesSecp256k1,
                    derivationScheme: keyEncryptionInput.derivationScheme,
                    ephemeralPublicKey,
                    initializationVector: keyEncryptionInitializationVector,
                    messageAuthenticationCode,
                    encryptedKey
                };
                // we need to attach the actual public key if derivation scheme is protocol-context,
                // so that the responder to this message is able to encrypt the message/symmetric key using the same protocol-context derived public key,
                // without needing the knowledge of the corresponding private key
                if (keyEncryptionInput.derivationScheme === KeyDerivationScheme.ProtocolContext) {
                    encryptedKeyData.derivedPublicKey = keyEncryptionInput.publicKey;
                }
                keyEncryption.push(encryptedKeyData);
            }
            const encryption = {
                algorithm: (_b = encryptionInput.algorithm) !== null && _b !== void 0 ? _b : EncryptionAlgorithm.Aes256Ctr,
                initializationVector: Encoder.bytesToBase64Url(encryptionInput.initializationVector),
                keyEncryption
            };
            return encryption;
        });
    }
    /**
     * Creates the `attestation` property of a RecordsWrite message if given signature inputs; returns `undefined` otherwise.
     */
    static createAttestation(descriptorCid, signers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (signers === undefined || signers.length === 0) {
                return undefined;
            }
            const attestationPayload = { descriptorCid };
            const attestationPayloadBytes = Encoder.objectToBytes(attestationPayload);
            const builder = yield GeneralJwsBuilder.create(attestationPayloadBytes, signers);
            return builder.getJws();
        });
    }
    /**
     * Creates the `signature` property in the `authorization` of a `RecordsWrite` message.
     */
    static createSignerSignature(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recordId, contextId, descriptorCid, attestation, encryption, signer, delegatedGrantId, permissionGrantId, protocolRole } = input;
            const attestationCid = attestation ? yield Cid.computeCid(attestation) : undefined;
            const encryptionCid = encryption ? yield Cid.computeCid(encryption) : undefined;
            const signaturePayload = {
                recordId,
                descriptorCid,
                contextId,
                attestationCid,
                encryptionCid,
                delegatedGrantId,
                permissionGrantId,
                protocolRole
            };
            removeUndefinedProperties(signaturePayload);
            const signaturePayloadBytes = Encoder.objectToBytes(signaturePayload);
            const builder = yield GeneralJwsBuilder.create(signaturePayloadBytes, [signer]);
            const signature = builder.getJws();
            return signature;
        });
    }
    /**
     * Gets the initial write from the given list of `RecordsWrite`.
     */
    static getInitialWrite(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const message of messages) {
                if (yield RecordsWrite.isInitialWrite(message)) {
                    return message;
                }
            }
            throw new DwnError(DwnErrorCode.RecordsWriteGetInitialWriteNotFound, `Initial write is not found.`);
        });
    }
    /**
     * Verifies that immutable properties of the two given messages are identical.
     * @throws {Error} if immutable properties between two RecordsWrite message
     */
    static verifyEqualityOfImmutableProperties(existingWriteMessage, newMessage) {
        const mutableDescriptorProperties = ['dataCid', 'dataSize', 'dataFormat', 'datePublished', 'published', 'messageTimestamp', 'tags'];
        // get distinct property names that exist in either the existing message given or new message
        let descriptorPropertyNames = [];
        descriptorPropertyNames.push(...Object.keys(existingWriteMessage.descriptor));
        descriptorPropertyNames.push(...Object.keys(newMessage.descriptor));
        descriptorPropertyNames = [...new Set(descriptorPropertyNames)]; // step to remove duplicates
        // ensure all immutable properties are not modified
        for (const descriptorPropertyName of descriptorPropertyNames) {
            // if property is supposed to be immutable
            if (mutableDescriptorProperties.indexOf(descriptorPropertyName) === -1) {
                const valueInExistingWrite = existingWriteMessage.descriptor[descriptorPropertyName];
                const valueInNewMessage = newMessage.descriptor[descriptorPropertyName];
                if (valueInNewMessage !== valueInExistingWrite) {
                    throw new DwnError(DwnErrorCode.RecordsWriteImmutablePropertyChanged, `${descriptorPropertyName} is an immutable property: cannot change '${valueInExistingWrite}' to '${valueInNewMessage}'`);
                }
            }
        }
        return true;
    }
    /**
     * Gets the DID of the attesters of the given message.
     */
    static getAttesters(message) {
        var _a, _b;
        const attestationSignatures = (_b = (_a = message.attestation) === null || _a === void 0 ? void 0 : _a.signatures) !== null && _b !== void 0 ? _b : [];
        const attesters = attestationSignatures.map((signature) => Jws.getSignerDid(signature));
        return attesters;
    }
    static fetchNewestRecordsWrite(messageStore, tenant, recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            // get existing RecordsWrite messages matching the `recordId`
            const query = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                recordId: recordId
            };
            const { messages: existingMessages } = yield messageStore.query(tenant, [query]);
            const newestWrite = yield Message.getNewestMessage(existingMessages);
            if (newestWrite !== undefined) {
                return newestWrite;
            }
            throw new DwnError(DwnErrorCode.RecordsWriteGetNewestWriteRecordNotFound, 'record not found');
        });
    }
    /**
     * Fetches the initial RecordsWrite of a record.
     * @returns The initial RecordsWrite if found; `undefined` if the record is not found.
     */
    static fetchInitialRecordsWrite(messageStore, tenant, recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { entryId: recordId };
            const { messages } = yield messageStore.query(tenant, [query]);
            if (messages.length === 0) {
                return undefined;
            }
            const initialRecordsWrite = yield RecordsWrite.parse(messages[0]);
            return initialRecordsWrite;
        });
    }
}
//# sourceMappingURL=records-write.js.map