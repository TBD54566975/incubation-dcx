var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AbstractMessage } from '../core/abstract-message.js';
import { Message } from '../core/message.js';
import { PermissionGrant } from '../protocols/permission-grant.js';
import { Records } from '../utils/records.js';
import { RecordsGrantAuthorization } from '../core/records-grant-authorization.js';
import { removeUndefinedProperties } from '../utils/object.js';
import { Time } from '../utils/time.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
export class RecordsDelete extends AbstractMessage {
    static parse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let signaturePayload;
            if (message.authorization !== undefined) {
                signaturePayload = yield Message.validateSignatureStructure(message.authorization.signature, message.descriptor);
            }
            yield Records.validateDelegatedGrantReferentialIntegrity(message, signaturePayload);
            Time.validateTimestamp(message.descriptor.messageTimestamp);
            const recordsDelete = new RecordsDelete(message);
            return recordsDelete;
        });
    }
    /**
     * Creates a RecordsDelete message.
     * @param options.recordId If `undefined`, will be auto-filled as a originating message as convenience for developer.
     * @param options.messageTimestamp If `undefined`, it will be auto-filled with current time.
     */
    static create(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const recordId = options.recordId;
            const currentTime = Time.getCurrentTimestamp();
            const descriptor = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Delete,
                messageTimestamp: (_a = options.messageTimestamp) !== null && _a !== void 0 ? _a : currentTime,
                recordId,
                prune: (_b = options.prune) !== null && _b !== void 0 ? _b : false
            };
            const authorization = yield Message.createAuthorization({
                descriptor,
                signer: options.signer,
                protocolRole: options.protocolRole,
                delegatedGrant: options.delegatedGrant
            });
            const message = { descriptor, authorization };
            Message.validateJsonSchema(message);
            return new RecordsDelete(message);
        });
    }
    /**
     * Indexed properties needed for MessageStore indexing.
     */
    constructIndexes(initialWrite) {
        const message = this.message;
        const descriptor = Object.assign({}, message.descriptor);
        // we add the immutable properties from the initial RecordsWrite message in order to use them when querying relevant deletes.
        const { protocol, protocolPath, recipient, schema, parentId, dateCreated } = initialWrite.descriptor;
        // NOTE: the "trick" not may not be apparent on how a query is able to omit deleted records:
        // we intentionally not add index for `isLatestBaseState` at all, this means that upon a successful delete,
        // no messages with the record ID will match any query because queries by design filter by `isLatestBaseState = true`,
        // `isLatestBaseState` for the initial delete would have been toggled to `false`
        const indexes = Object.assign({ 
            // isLatestBaseState : "true", // intentionally showing that this index is omitted
            protocol, protocolPath, recipient, schema, parentId, dateCreated, contextId: initialWrite.contextId, author: this.author }, descriptor);
        removeUndefinedProperties(indexes);
        return indexes;
    }
    /*
     * Authorizes the delegate who signed the message.
     * @param messageStore Used to check if the grant has been revoked.
     */
    authorizeDelegate(recordsWriteToDelete, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            const delegatedGrant = yield PermissionGrant.parse(this.message.authorization.authorDelegatedGrant);
            yield RecordsGrantAuthorization.authorizeDelete({
                recordsDeleteMessage: this.message,
                recordsWriteToDelete,
                expectedGrantor: this.author,
                expectedGrantee: this.signer,
                permissionGrant: delegatedGrant,
                messageStore
            });
        });
    }
}
//# sourceMappingURL=records-delete.js.map