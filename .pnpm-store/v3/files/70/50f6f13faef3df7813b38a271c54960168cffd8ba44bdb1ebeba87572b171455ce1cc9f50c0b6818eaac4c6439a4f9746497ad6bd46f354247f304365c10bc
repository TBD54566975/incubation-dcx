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
import { messageReplyFromError } from '../core/message-reply.js';
import { Messages } from '../utils/messages.js';
import { MessagesGrantAuthorization } from '../core/messages-grant-authorization.js';
import { MessagesQuery } from '../interfaces/messages-query.js';
import { PermissionsProtocol } from '../protocols/permissions.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
export class MessagesQueryHandler {
    constructor(didResolver, messageStore, eventLog) {
        this.didResolver = didResolver;
        this.messageStore = messageStore;
        this.eventLog = eventLog;
    }
    handle({ tenant, message }) {
        return __awaiter(this, void 0, void 0, function* () {
            let messagesQuery;
            try {
                messagesQuery = yield MessagesQuery.parse(message);
            }
            catch (e) {
                return messageReplyFromError(e, 400);
            }
            try {
                yield authenticate(message.authorization, this.didResolver);
                yield MessagesQueryHandler.authorizeMessagesQuery(tenant, messagesQuery, this.messageStore);
            }
            catch (e) {
                return messageReplyFromError(e, 401);
            }
            // an empty array of filters means no filtering and all events are returned
            const eventFilters = Messages.convertFilters(message.descriptor.filters);
            const { events, cursor } = yield this.eventLog.queryEvents(tenant, eventFilters, message.descriptor.cursor);
            return {
                status: { code: 200, detail: 'OK' },
                entries: events,
                cursor
            };
        });
    }
    static authorizeMessagesQuery(tenant, messagesQuery, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            // if `MessagesQuery` author is the same as the target tenant, we can directly grant access
            if (messagesQuery.author === tenant) {
                return;
            }
            else if (messagesQuery.author !== undefined && messagesQuery.signaturePayload.permissionGrantId !== undefined) {
                const permissionGrant = yield PermissionsProtocol.fetchGrant(tenant, messageStore, messagesQuery.signaturePayload.permissionGrantId);
                yield MessagesGrantAuthorization.authorizeQueryOrSubscribe({
                    incomingMessage: messagesQuery.message,
                    expectedGrantor: tenant,
                    expectedGrantee: messagesQuery.author,
                    permissionGrant,
                    messageStore
                });
            }
            else {
                throw new DwnError(DwnErrorCode.MessagesQueryAuthorizationFailed, 'message failed authorization');
            }
        });
    }
}
//# sourceMappingURL=messages-query.js.map