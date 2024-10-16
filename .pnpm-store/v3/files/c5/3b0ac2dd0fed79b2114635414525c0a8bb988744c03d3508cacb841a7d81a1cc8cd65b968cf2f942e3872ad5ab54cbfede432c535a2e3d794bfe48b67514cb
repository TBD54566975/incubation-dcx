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
import { FilterUtility } from '../utils/filter.js';
import { Message } from '../core/message.js';
import { messageReplyFromError } from '../core/message-reply.js';
import { Messages } from '../utils/messages.js';
import { MessagesGrantAuthorization } from '../core/messages-grant-authorization.js';
import { MessagesSubscribe } from '../interfaces/messages-subscribe.js';
import { PermissionsProtocol } from '../protocols/permissions.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
export class MessagesSubscribeHandler {
    constructor(didResolver, messageStore, eventStream) {
        this.didResolver = didResolver;
        this.messageStore = messageStore;
        this.eventStream = eventStream;
    }
    handle({ tenant, message, subscriptionHandler }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.eventStream === undefined) {
                return messageReplyFromError(new DwnError(DwnErrorCode.MessagesSubscribeEventStreamUnimplemented, 'Subscriptions are not supported'), 501);
            }
            let messagesSubscribe;
            try {
                messagesSubscribe = yield MessagesSubscribe.parse(message);
            }
            catch (e) {
                return messageReplyFromError(e, 400);
            }
            try {
                yield authenticate(message.authorization, this.didResolver);
                yield MessagesSubscribeHandler.authorizeMessagesSubscribe(tenant, messagesSubscribe, this.messageStore);
            }
            catch (error) {
                return messageReplyFromError(error, 401);
            }
            const { filters } = message.descriptor;
            const messagesFilters = Messages.convertFilters(filters);
            const messageCid = yield Message.getCid(message);
            const listener = (eventTenant, event, eventIndexes) => {
                if (tenant === eventTenant && FilterUtility.matchAnyFilter(eventIndexes, messagesFilters)) {
                    subscriptionHandler(event);
                }
            };
            const subscription = yield this.eventStream.subscribe(tenant, messageCid, listener);
            return {
                status: { code: 200, detail: 'OK' },
                subscription,
            };
        });
    }
    static authorizeMessagesSubscribe(tenant, messagesSubscribe, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            // if `MessagesSubscribe` author is the same as the target tenant, we can directly grant access
            if (messagesSubscribe.author === tenant) {
                return;
            }
            else if (messagesSubscribe.author !== undefined && messagesSubscribe.signaturePayload.permissionGrantId !== undefined) {
                const permissionGrant = yield PermissionsProtocol.fetchGrant(tenant, messageStore, messagesSubscribe.signaturePayload.permissionGrantId);
                yield MessagesGrantAuthorization.authorizeQueryOrSubscribe({
                    incomingMessage: messagesSubscribe.message,
                    expectedGrantor: tenant,
                    expectedGrantee: messagesSubscribe.author,
                    permissionGrant,
                    messageStore
                });
            }
            else {
                throw new DwnError(DwnErrorCode.MessagesSubscribeAuthorizationFailed, 'message failed authorization');
            }
        });
    }
}
//# sourceMappingURL=messages-subscribe.js.map