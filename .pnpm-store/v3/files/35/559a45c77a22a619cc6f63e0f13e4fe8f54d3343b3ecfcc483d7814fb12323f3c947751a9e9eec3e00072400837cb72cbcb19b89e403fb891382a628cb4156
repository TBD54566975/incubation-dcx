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
export class RecordsRead extends AbstractMessage {
    static parse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let signaturePayload;
            if (message.authorization !== undefined) {
                signaturePayload = yield Message.validateSignatureStructure(message.authorization.signature, message.descriptor);
            }
            yield Records.validateDelegatedGrantReferentialIntegrity(message, signaturePayload);
            Time.validateTimestamp(message.descriptor.messageTimestamp);
            const recordsRead = new RecordsRead(message);
            return recordsRead;
        });
    }
    /**
     * Creates a RecordsRead message.
     * @param options.recordId If `undefined`, will be auto-filled as a originating message as convenience for developer.
     * @param options.date If `undefined`, it will be auto-filled with current time.
     *
     * @throws {DwnError} when a combination of required RecordsReadOptions are missing
     */
    static create(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { filter, signer, permissionGrantId, protocolRole } = options;
            const currentTime = Time.getCurrentTimestamp();
            const descriptor = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Read,
                filter: Records.normalizeFilter(filter),
                messageTimestamp: (_a = options.messageTimestamp) !== null && _a !== void 0 ? _a : currentTime,
            };
            removeUndefinedProperties(descriptor);
            // only generate the `authorization` property if signature input is given
            let authorization = undefined;
            if (signer !== undefined) {
                authorization = yield Message.createAuthorization({
                    descriptor,
                    signer,
                    permissionGrantId,
                    protocolRole,
                    delegatedGrant: options.delegatedGrant
                });
            }
            const message = { descriptor, authorization };
            Message.validateJsonSchema(message);
            return new RecordsRead(message);
        });
    }
    /**
     * Authorizes the delegate who signed this message.
     * @param messageStore Used to check if the grant has been revoked.
     */
    authorizeDelegate(matchedRecordsWrite, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            const delegatedGrant = yield PermissionGrant.parse(this.message.authorization.authorDelegatedGrant);
            yield RecordsGrantAuthorization.authorizeRead({
                recordsReadMessage: this.message,
                recordsWriteMessageToBeRead: matchedRecordsWrite,
                expectedGrantor: this.author,
                expectedGrantee: this.signer,
                permissionGrant: delegatedGrant,
                messageStore
            });
        });
    }
}
//# sourceMappingURL=records-read.js.map