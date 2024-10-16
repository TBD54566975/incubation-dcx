import type { GeneralJws } from '../types/jws-types.js';
import type { KeyValues } from '../types/query-types.js';
import type { MessageInterface } from '../types/message-interface.js';
import type { MessageStore } from '../types/message-store.js';
import type { PublicJwk } from '../types/jose-types.js';
import type { Signer } from '../types/signer.js';
import type { DataEncodedRecordsWriteMessage, EncryptionProperty, InternalRecordsWriteMessage, RecordsWriteDescriptor, RecordsWriteMessage, RecordsWriteSignaturePayload, RecordsWriteTags } from '../types/records-types.js';
import type { GenericMessage, GenericSignaturePayload } from '../types/message-types.js';
import { EncryptionAlgorithm } from '../utils/encryption.js';
import { KeyDerivationScheme } from '../utils/hd-key.js';
export type RecordsWriteOptions = {
    recipient?: string;
    protocol?: string;
    protocolPath?: string;
    protocolRole?: string;
    schema?: string;
    tags?: RecordsWriteTags;
    recordId?: string;
    /**
     * Must be given if this message is for a non-root protocol record.
     * If not given, it either means this write is for a root protocol record or a flat-space record.
     */
    parentContextId?: string;
    data?: Uint8Array;
    dataCid?: string;
    dataSize?: number;
    dateCreated?: string;
    messageTimestamp?: string;
    published?: boolean;
    datePublished?: string;
    dataFormat: string;
    /**
     * The signer of the message, which is commonly the author, but can also be a delegate.
     */
    signer?: Signer;
    /**
     * The delegated grant invoked to sign on behalf of the logical author, which is the grantor of the delegated grant.
     */
    delegatedGrant?: DataEncodedRecordsWriteMessage;
    attestationSigners?: Signer[];
    encryptionInput?: EncryptionInput;
    permissionGrantId?: string;
};
/**
 * Input that describes how data is encrypted as spec-ed in TP18 (https://github.com/TBD54566975/technical-proposals/pull/6).
 */
export type EncryptionInput = {
    /**
     * Algorithm used for encrypting the Data. Uses {EncryptionAlgorithm.Aes256Ctr} if not given.
     */
    algorithm?: EncryptionAlgorithm;
    /**
     * Initialization vector used for encrypting the data.
     */
    initializationVector: Uint8Array;
    /**
     * Symmetric key used to encrypt the data.
     */
    key: Uint8Array;
    /**
     * Array of input that specifies how the symmetric key is encrypted.
     * Each entry in the array will result in a unique ciphertext of the symmetric key.
     */
    keyEncryptionInputs: KeyEncryptionInput[];
};
/**
 * Input that specifies how a symmetric key is encrypted.
 */
export type KeyEncryptionInput = {
    /**
     * Key derivation scheme used to derive the public key to encrypt the symmetric key.
     */
    derivationScheme: KeyDerivationScheme;
    /**
     * Fully qualified ID of root public key used derive the public key to be used to to encrypt the symmetric key.
     * (e.g. did:example:abc#encryption-key-id)
     */
    publicKeyId: string;
    /**
     * Public key to be used to encrypt the symmetric key.
     */
    publicKey: PublicJwk;
    /**
     * Algorithm used for encrypting the symmetric key. Uses {EncryptionAlgorithm.EciesSecp256k1} if not given.
     */
    algorithm?: EncryptionAlgorithm;
};
export type CreateFromOptions = {
    recordsWriteMessage: RecordsWriteMessage;
    data?: Uint8Array;
    /**
     * The data format of the new data. If not given, the data format from the existing message will be used.
     */
    dataFormat?: string;
    published?: boolean;
    tags?: RecordsWriteTags;
    messageTimestamp?: string;
    datePublished?: string;
    /**
     * The signer of the message, which is commonly the author, but can also be a delegate.
     */
    signer?: Signer;
    /**
     * The delegated grant to sign on behalf of the logical author, which is the grantor (`grantedBy`) of the delegated grant.
     */
    delegatedGrant?: DataEncodedRecordsWriteMessage;
    attestationSigners?: Signer[];
    encryptionInput?: EncryptionInput;
    protocolRole?: string;
};
/**
 * A class representing a RecordsWrite DWN message.
 * NOTE: Unable to extend `AbstractMessage` directly because the incompatible `_message` type, which is not just a generic `<M>` type.
 */
export declare class RecordsWrite implements MessageInterface<RecordsWriteMessage> {
    private parentContextId;
    private _message;
    /**
     * Valid JSON message representing this RecordsWrite.
     * @throws `DwnErrorCode.RecordsWriteMissingSigner` if the message is not signed yet.
     */
    get message(): RecordsWriteMessage;
    private _author;
    get author(): string | undefined;
    private _signaturePayload;
    get signaturePayload(): RecordsWriteSignaturePayload | undefined;
    private _owner;
    /**
     * The owner DID of the message if owner signature is present in the message; `undefined` otherwise.
     * This is the logical owner of the message, not to be confused with the actual signer of the owner signature,
     * this is because the signer of the owner signature may not be the actual DWN owner, but a delegate authorized by the owner.
     */
    get owner(): string | undefined;
    private _ownerSignaturePayload;
    /**
     * Decoded owner signature payload.
     */
    get ownerSignaturePayload(): GenericSignaturePayload | undefined;
    /**
     * If this message is signed by an author-delegate.
     */
    get isSignedByAuthorDelegate(): boolean;
    /**
     * If this message is signed by an owner-delegate.
     */
    get isSignedByOwnerDelegate(): boolean;
    /**
     * Gets the signer of this message.
     * This is not to be confused with the logical author of the message.
     */
    get signer(): string | undefined;
    /**
     * Gets the signer of owner signature; `undefined` if owner signature is not present in the message.
     * This is not to be confused with the logical owner {@link #owner} of the message,
     * this is because the signer of the owner signature may not be the actual DWN owner, but a delegate authorized by the owner.
     * In the case that the owner signature is signed by the actual DWN owner, this value will be the same as {@link #owner}.
     */
    get ownerSignatureSigner(): string | undefined;
    readonly attesters: string[];
    private constructor();
    /**
     * Parses a RecordsWrite message and returns a {RecordsWrite} instance.
     */
    static parse(recordsWriteMessage: RecordsWriteMessage): Promise<RecordsWrite>;
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
    static create(options: RecordsWriteOptions): Promise<RecordsWrite>;
    private static getRecordIdFromContextId;
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
    static createFrom(options: CreateFromOptions): Promise<RecordsWrite>;
    /**
     * Called by `JSON.stringify(...)` automatically.
     */
    toJSON(): RecordsWriteMessage;
    /**
     * Encrypts the symmetric encryption key using the public keys given and attach the resulting `encryption` property to the RecordsWrite.
     */
    encryptSymmetricEncryptionKey(encryptionInput: EncryptionInput): Promise<void>;
    /**
     * Signs the RecordsWrite, the signer is commonly the author, but can also be a delegate.
     */
    sign(options: {
        signer: Signer;
        delegatedGrant?: DataEncodedRecordsWriteMessage;
        permissionGrantId?: string;
        protocolRole?: string;
    }): Promise<void>;
    /**
     * Signs the `RecordsWrite` as the DWN owner.
     * This is used when the DWN owner wants to retain a copy of a message that the owner did not author.
     * NOTE: requires the `RecordsWrite` to already have the author's signature.
     */
    signAsOwner(signer: Signer): Promise<void>;
    /**
     * Signs the `RecordsWrite` as the DWN owner-delegate.
     * This is used when a DWN owner-delegate wants to retain a copy of a message that the owner did not author.
     * NOTE: requires the `RecordsWrite` to already have the author's signature.
     */
    signAsOwnerDelegate(signer: Signer, delegatedGrant: DataEncodedRecordsWriteMessage): Promise<void>;
    /**
     * Validates the integrity of the RecordsWrite message assuming the message passed basic schema validation.
     * There is opportunity to integrate better with `validateSchema(...)`
     */
    private validateIntegrity;
    /**
     * Validates the structural integrity of the `attestation` property.
     * NOTE: signature is not verified.
     */
    private static validateAttestationIntegrity;
    /**
     * Computes the deterministic Entry ID of this message.
     */
    getEntryId(): Promise<string>;
    /**
     * Computes the deterministic Entry ID of this message.
     */
    static getEntryId(author: string | undefined, descriptor: RecordsWriteDescriptor): Promise<string>;
    /**
     * Checks if the given message is the initial entry of a record.
     */
    isInitialWrite(): Promise<boolean>;
    constructIndexes(isLatestBaseState: boolean): Promise<KeyValues>;
    /**
     * Authorizes the author-delegate who signed this message.
     * @param messageStore Used to check if the grant has been revoked.
     */
    authorizeAuthorDelegate(messageStore: MessageStore): Promise<void>;
    /**
     * Authorizes the owner-delegate who signed this message.
     * @param messageStore Used to check if the grant has been revoked.
     */
    authorizeOwnerDelegate(messageStore: MessageStore): Promise<void>;
    /**
     * Checks if the given message is the initial entry of a record.
     */
    static isInitialWrite(message: GenericMessage): Promise<boolean>;
    /**
     * Creates the `encryption` property if encryption input is given. Else `undefined` is returned.
     * @param descriptor Descriptor of the `RecordsWrite` message which contains the information need by key path derivation schemes.
     */
    private static createEncryptionProperty;
    /**
     * Creates the `attestation` property of a RecordsWrite message if given signature inputs; returns `undefined` otherwise.
     */
    static createAttestation(descriptorCid: string, signers?: Signer[]): Promise<GeneralJws | undefined>;
    /**
     * Creates the `signature` property in the `authorization` of a `RecordsWrite` message.
     */
    static createSignerSignature(input: {
        recordId: string;
        contextId: string | undefined;
        descriptorCid: string;
        attestation: GeneralJws | undefined;
        encryption: EncryptionProperty | undefined;
        signer: Signer;
        delegatedGrantId?: string;
        permissionGrantId?: string;
        protocolRole?: string;
    }): Promise<GeneralJws>;
    /**
     * Gets the initial write from the given list of `RecordsWrite`.
     */
    static getInitialWrite(messages: GenericMessage[]): Promise<RecordsWriteMessage>;
    /**
     * Verifies that immutable properties of the two given messages are identical.
     * @throws {Error} if immutable properties between two RecordsWrite message
     */
    static verifyEqualityOfImmutableProperties(existingWriteMessage: RecordsWriteMessage, newMessage: RecordsWriteMessage): boolean;
    /**
     * Gets the DID of the attesters of the given message.
     */
    static getAttesters(message: InternalRecordsWriteMessage): string[];
    static fetchNewestRecordsWrite(messageStore: MessageStore, tenant: string, recordId: string): Promise<RecordsWriteMessage>;
    /**
     * Fetches the initial RecordsWrite of a record.
     * @returns The initial RecordsWrite if found; `undefined` if the record is not found.
     */
    static fetchInitialRecordsWrite(messageStore: MessageStore, tenant: string, recordId: string): Promise<RecordsWrite | undefined>;
}
//# sourceMappingURL=records-write.d.ts.map