var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Cid } from '../utils/cid.js';
import { Encoder } from '../utils/encoder.js';
import { GeneralJwsBuilder } from '../jose/jws/general/builder.js';
import { Jws } from '../utils/jws.js';
import { lexicographicalCompare } from '../utils/string.js';
import { removeUndefinedProperties } from '../utils/object.js';
import { validateJsonSchema } from '../schema-validator.js';
import { DwnError, DwnErrorCode } from './dwn-error.js';
/**
 * A class containing utility methods for working with DWN messages.
 */
export class Message {
    /**
     * Validates the given message against the corresponding JSON schema.
     * @throws {Error} if fails validation.
     */
    static validateJsonSchema(rawMessage) {
        const dwnInterface = rawMessage.descriptor.interface;
        const dwnMethod = rawMessage.descriptor.method;
        const schemaLookupKey = dwnInterface + dwnMethod;
        // throws an error if message is invalid
        validateJsonSchema(schemaLookupKey, rawMessage);
    }
    ;
    /**
     * Gets the DID of the signer of the given message, returns `undefined` if message is not signed.
     */
    static getSigner(message) {
        if (message.authorization === undefined) {
            return undefined;
        }
        const signer = Jws.getSignerDid(message.authorization.signature.signatures[0]);
        return signer;
    }
    /**
     * Gets the CID of the given message.
     */
    static getCid(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // NOTE: we wrap the `computeCid()` here in case that
            // the message will contain properties that should not be part of the CID computation
            // and we need to strip them out (like `encodedData` that we historically had for a long time),
            // but we can remove this method entirely if the code becomes stable and it is apparent that the wrapper is not needed
            // ^--- seems like we might need to keep this around for now.
            const rawMessage = Object.assign({}, message);
            if (rawMessage.encodedData) {
                delete rawMessage.encodedData;
            }
            const cid = yield Cid.computeCid(rawMessage);
            return cid;
        });
    }
    /**
     * Compares message CID in lexicographical order according to the spec.
     * @returns 1 if `a` is larger than `b`; -1 if `a` is smaller/older than `b`; 0 otherwise (same message)
     */
    static compareCid(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            // the < and > operators compare strings in lexicographical order
            const cidA = yield Message.getCid(a);
            const cidB = yield Message.getCid(b);
            return lexicographicalCompare(cidA, cidB);
        });
    }
    /**
     * Creates the `authorization` property to be included in a DWN message.
     * @param signer Message signer.
     * @returns {AuthorizationModel} used as an `authorization` property.
     */
    static createAuthorization(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descriptor, signer, delegatedGrant, permissionGrantId, protocolRole } = input;
            let delegatedGrantId;
            if (delegatedGrant !== undefined) {
                delegatedGrantId = yield Message.getCid(delegatedGrant);
            }
            const signature = yield Message.createSignature(descriptor, signer, { delegatedGrantId, permissionGrantId, protocolRole });
            const authorization = {
                signature
            };
            if (delegatedGrant !== undefined) {
                authorization.authorDelegatedGrant = delegatedGrant;
            }
            return authorization;
        });
    }
    /**
     * Creates a generic signature from the given DWN message descriptor by including `descriptorCid` as the required property in the signature payload.
     * NOTE: there is an opportunity to consolidate RecordsWrite.createSignerSignature() wth this method
     */
    static createSignature(descriptor, signer, additionalPayloadProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const descriptorCid = yield Cid.computeCid(descriptor);
            const signaturePayload = Object.assign({ descriptorCid }, additionalPayloadProperties);
            removeUndefinedProperties(signaturePayload);
            const signaturePayloadBytes = Encoder.objectToBytes(signaturePayload);
            const builder = yield GeneralJwsBuilder.create(signaturePayloadBytes, [signer]);
            const signature = builder.getJws();
            return signature;
        });
    }
    /**
     * @returns newest message in the array. `undefined` if given array is empty.
     */
    static getNewestMessage(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentNewestMessage = undefined;
            for (const message of messages) {
                if (currentNewestMessage === undefined || (yield Message.isNewer(message, currentNewestMessage))) {
                    currentNewestMessage = message;
                }
            }
            return currentNewestMessage;
        });
    }
    /**
     * @returns oldest message in the array. `undefined` if given array is empty.
     */
    static getOldestMessage(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentOldestMessage = undefined;
            for (const message of messages) {
                if (currentOldestMessage === undefined || (yield Message.isOlder(message, currentOldestMessage))) {
                    currentOldestMessage = message;
                }
            }
            return currentOldestMessage;
        });
    }
    /**
     * Checks if first message is newer than second message.
     * @returns `true` if `a` is newer than `b`; `false` otherwise
     */
    static isNewer(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            const aIsNewer = ((yield Message.compareMessageTimestamp(a, b)) > 0);
            return aIsNewer;
        });
    }
    /**
     * Checks if first message is older than second message.
     * @returns `true` if `a` is older than `b`; `false` otherwise
     */
    static isOlder(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            const aIsOlder = ((yield Message.compareMessageTimestamp(a, b)) < 0);
            return aIsOlder;
        });
    }
    /**
     * See if the given message is signed by an author-delegate.
     */
    static isSignedByAuthorDelegate(message) {
        var _a;
        return ((_a = message.authorization) === null || _a === void 0 ? void 0 : _a.authorDelegatedGrant) !== undefined;
    }
    /**
     * See if the given message is signed by an owner-delegate.
     */
    static isSignedByOwnerDelegate(message) {
        var _a;
        return ((_a = message.authorization) === null || _a === void 0 ? void 0 : _a.ownerDelegatedGrant) !== undefined;
    }
    /**
     * Compares the `messageTimestamp` of the given messages with a fallback to message CID according to the spec.
     * @returns 1 if `a` is larger/newer than `b`; -1 if `a` is smaller/older than `b`; 0 otherwise (same age)
     */
    static compareMessageTimestamp(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            if (a.descriptor.messageTimestamp > b.descriptor.messageTimestamp) {
                return 1;
            }
            else if (a.descriptor.messageTimestamp < b.descriptor.messageTimestamp) {
                return -1;
            }
            // else `messageTimestamp` is the same between a and b
            // compare the `dataCid` instead, the < and > operators compare strings in lexicographical order
            return Message.compareCid(a, b);
        });
    }
    /**
     * Validates the structural integrity of the message signature given:
     * 1. The message signature must contain exactly 1 signature
     * 2. Passes JSON schema validation
     * 3. The `descriptorCid` property matches the CID of the message descriptor
     * NOTE: signature is NOT verified.
     * @param payloadJsonSchemaKey The key to look up the JSON schema referenced in `compile-validators.js` and perform payload schema validation on.
     * @returns the parsed JSON payload object if validation succeeds.
     */
    static validateSignatureStructure(messageSignature, messageDescriptor, payloadJsonSchemaKey = 'GenericSignaturePayload') {
        return __awaiter(this, void 0, void 0, function* () {
            if (messageSignature.signatures.length !== 1) {
                throw new DwnError(DwnErrorCode.AuthenticationMoreThanOneSignatureNotSupported, 'expected no more than 1 signature for authorization purpose');
            }
            // validate payload integrity
            const payloadJson = Jws.decodePlainObjectPayload(messageSignature);
            validateJsonSchema(payloadJsonSchemaKey, payloadJson);
            // `descriptorCid` validation - ensure that the provided descriptorCid matches the CID of the actual message
            const { descriptorCid } = payloadJson;
            const expectedDescriptorCid = yield Cid.computeCid(messageDescriptor);
            if (descriptorCid !== expectedDescriptorCid) {
                throw new DwnError(DwnErrorCode.AuthenticateDescriptorCidMismatch, `provided descriptorCid ${descriptorCid} does not match expected CID ${expectedDescriptorCid}`);
            }
            return payloadJson;
        });
    }
}
//# sourceMappingURL=message.js.map