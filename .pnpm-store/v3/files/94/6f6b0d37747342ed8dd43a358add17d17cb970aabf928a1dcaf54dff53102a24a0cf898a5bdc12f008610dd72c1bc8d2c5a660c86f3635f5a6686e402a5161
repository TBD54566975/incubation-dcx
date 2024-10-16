var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { authenticate } from '../core/auth.js';
import { DwnInterfaceName } from '../enums/dwn-interface-method.js';
import { Message } from '../core/message.js';
import { messageReplyFromError } from '../core/message-reply.js';
import { ProtocolAuthorization } from '../core/protocol-authorization.js';
import { Records } from '../utils/records.js';
import { RecordsDelete } from '../interfaces/records-delete.js';
import { RecordsWrite } from '../interfaces/records-write.js';
import { ResumableTaskName } from '../core/resumable-task-manager.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
export class RecordsDeleteHandler {
    constructor(didResolver, messageStore, resumableTaskManager) {
        this.didResolver = didResolver;
        this.messageStore = messageStore;
        this.resumableTaskManager = resumableTaskManager;
    }
    handle({ tenant, message }) {
        return __awaiter(this, void 0, void 0, function* () {
            let recordsDelete;
            try {
                recordsDelete = yield RecordsDelete.parse(message);
            }
            catch (e) {
                return messageReplyFromError(e, 400);
            }
            // authentication
            try {
                yield authenticate(message.authorization, this.didResolver);
            }
            catch (e) {
                return messageReplyFromError(e, 401);
            }
            // get existing records matching the `recordId`
            const query = {
                interface: DwnInterfaceName.Records,
                recordId: message.descriptor.recordId
            };
            const { messages: existingMessages } = yield this.messageStore.query(tenant, [query]);
            // find which message is the newest, and if the incoming message is the newest
            const newestExistingMessage = yield Message.getNewestMessage(existingMessages);
            if (!Records.canPerformDeleteAgainstRecord(message, newestExistingMessage)) {
                return {
                    status: { code: 404, detail: 'Not Found' }
                };
            }
            // if the incoming message is not the newest, return Conflict
            const incomingDeleteIsNewest = yield Message.isNewer(message, newestExistingMessage);
            if (!incomingDeleteIsNewest) {
                return {
                    status: { code: 409, detail: 'Conflict' }
                };
            }
            // authorization
            try {
                // NOTE: We need a RecordsWrite (doesn't have to be initial) to access the immutable properties for delete processing,
                // but if the latest record state is a RecordsDelete (ie. when we are pruning a non-prune delete),
                // we'd need to use the initial write because RecordsDelete does not contain the immutable properties needed for processing.
                const initialWrite = yield RecordsWrite.fetchInitialRecordsWrite(this.messageStore, tenant, message.descriptor.recordId);
                yield RecordsDeleteHandler.authorizeRecordsDelete(tenant, recordsDelete, initialWrite, this.messageStore);
            }
            catch (e) {
                return messageReplyFromError(e, 401);
            }
            yield this.resumableTaskManager.run({
                name: ResumableTaskName.RecordsDelete,
                data: { tenant, message }
            });
            const messageReply = {
                status: { code: 202, detail: 'Accepted' }
            };
            return messageReply;
        });
    }
    ;
    /**
     * Authorizes a RecordsDelete message.
     *
     * @param recordsWrite A RecordsWrite of the record to be deleted.
     */
    static authorizeRecordsDelete(tenant, recordsDelete, recordsWrite, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Message.isSignedByAuthorDelegate(recordsDelete.message)) {
                yield recordsDelete.authorizeDelegate(recordsWrite.message, messageStore);
            }
            if (recordsDelete.author === tenant) {
                return;
            }
            else if (recordsWrite.message.descriptor.protocol !== undefined) {
                yield ProtocolAuthorization.authorizeDelete(tenant, recordsDelete, recordsWrite, messageStore);
            }
            else {
                throw new DwnError(DwnErrorCode.RecordsDeleteAuthorizationFailed, 'RecordsDelete message failed authorization');
            }
        });
    }
}
;
//# sourceMappingURL=records-delete.js.map