import type { DataEncodedRecordsWriteMessage } from '../types/records-types.js';
import type { GeneralJws } from '../types/jws-types.js';
import type { Signer } from '../types/signer.js';
import type { AuthorizationModel, Descriptor, GenericMessage, GenericSignaturePayload } from '../types/message-types.js';
/**
 * A class containing utility methods for working with DWN messages.
 */
export declare class Message {
    /**
     * Validates the given message against the corresponding JSON schema.
     * @throws {Error} if fails validation.
     */
    static validateJsonSchema(rawMessage: any): void;
    /**
     * Gets the DID of the signer of the given message, returns `undefined` if message is not signed.
     */
    static getSigner(message: GenericMessage): string | undefined;
    /**
     * Gets the CID of the given message.
     */
    static getCid(message: GenericMessage): Promise<string>;
    /**
     * Compares message CID in lexicographical order according to the spec.
     * @returns 1 if `a` is larger than `b`; -1 if `a` is smaller/older than `b`; 0 otherwise (same message)
     */
    static compareCid(a: GenericMessage, b: GenericMessage): Promise<number>;
    /**
     * Creates the `authorization` property to be included in a DWN message.
     * @param signer Message signer.
     * @returns {AuthorizationModel} used as an `authorization` property.
     */
    static createAuthorization(input: {
        descriptor: Descriptor;
        signer: Signer;
        delegatedGrant?: DataEncodedRecordsWriteMessage;
        permissionGrantId?: string;
        protocolRole?: string;
    }): Promise<AuthorizationModel>;
    /**
     * Creates a generic signature from the given DWN message descriptor by including `descriptorCid` as the required property in the signature payload.
     * NOTE: there is an opportunity to consolidate RecordsWrite.createSignerSignature() wth this method
     */
    static createSignature(descriptor: Descriptor, signer: Signer, additionalPayloadProperties?: {
        delegatedGrantId?: string;
        permissionGrantId?: string;
        protocolRole?: string;
    }): Promise<GeneralJws>;
    /**
     * @returns newest message in the array. `undefined` if given array is empty.
     */
    static getNewestMessage(messages: GenericMessage[]): Promise<GenericMessage | undefined>;
    /**
     * @returns oldest message in the array. `undefined` if given array is empty.
     */
    static getOldestMessage(messages: GenericMessage[]): Promise<GenericMessage | undefined>;
    /**
     * Checks if first message is newer than second message.
     * @returns `true` if `a` is newer than `b`; `false` otherwise
     */
    static isNewer(a: GenericMessage, b: GenericMessage): Promise<boolean>;
    /**
     * Checks if first message is older than second message.
     * @returns `true` if `a` is older than `b`; `false` otherwise
     */
    static isOlder(a: GenericMessage, b: GenericMessage): Promise<boolean>;
    /**
     * See if the given message is signed by an author-delegate.
     */
    static isSignedByAuthorDelegate(message: GenericMessage): boolean;
    /**
     * See if the given message is signed by an owner-delegate.
     */
    static isSignedByOwnerDelegate(message: GenericMessage): boolean;
    /**
     * Compares the `messageTimestamp` of the given messages with a fallback to message CID according to the spec.
     * @returns 1 if `a` is larger/newer than `b`; -1 if `a` is smaller/older than `b`; 0 otherwise (same age)
     */
    static compareMessageTimestamp(a: GenericMessage, b: GenericMessage): Promise<number>;
    /**
     * Validates the structural integrity of the message signature given:
     * 1. The message signature must contain exactly 1 signature
     * 2. Passes JSON schema validation
     * 3. The `descriptorCid` property matches the CID of the message descriptor
     * NOTE: signature is NOT verified.
     * @param payloadJsonSchemaKey The key to look up the JSON schema referenced in `compile-validators.js` and perform payload schema validation on.
     * @returns the parsed JSON payload object if validation succeeds.
     */
    static validateSignatureStructure(messageSignature: GeneralJws, messageDescriptor: Descriptor, payloadJsonSchemaKey?: string): Promise<GenericSignaturePayload>;
}
//# sourceMappingURL=message.d.ts.map