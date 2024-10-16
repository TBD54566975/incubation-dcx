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
import { Message } from '../core/message.js';
import { messageReplyFromError } from '../core/message-reply.js';
import { ProtocolsConfigure } from '../interfaces/protocols-configure.js';
import { authenticate, authorizeOwner } from '../core/auth.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
export class ProtocolsConfigureHandler {
    constructor(didResolver, messageStore, eventLog, eventStream) {
        this.didResolver = didResolver;
        this.messageStore = messageStore;
        this.eventLog = eventLog;
        this.eventStream = eventStream;
    }
    handle({ tenant, message, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let protocolsConfigure;
            try {
                protocolsConfigure = yield ProtocolsConfigure.parse(message);
            }
            catch (e) {
                return messageReplyFromError(e, 400);
            }
            // authentication & authorization
            try {
                yield authenticate(message.authorization, this.didResolver);
                yield authorizeOwner(tenant, protocolsConfigure);
            }
            catch (e) {
                return messageReplyFromError(e, 401);
            }
            // attempt to get existing protocol
            const query = {
                interface: DwnInterfaceName.Protocols,
                method: DwnMethodName.Configure,
                protocol: message.descriptor.definition.protocol
            };
            const { messages: existingMessages } = yield this.messageStore.query(tenant, [query]);
            // find newest message, and if the incoming message is the newest
            let newestMessage = yield Message.getNewestMessage(existingMessages);
            let incomingMessageIsNewest = false;
            if (newestMessage === undefined || (yield Message.isNewer(message, newestMessage))) {
                incomingMessageIsNewest = true;
                newestMessage = message;
            }
            // write the incoming message to DB if incoming message is newest
            let messageReply;
            if (incomingMessageIsNewest) {
                const indexes = ProtocolsConfigureHandler.constructIndexes(protocolsConfigure);
                yield this.messageStore.put(tenant, message, indexes);
                const messageCid = yield Message.getCid(message);
                yield this.eventLog.append(tenant, messageCid, indexes);
                // only emit if the event stream is set
                if (this.eventStream !== undefined) {
                    this.eventStream.emit(tenant, { message }, indexes);
                }
                messageReply = {
                    status: { code: 202, detail: 'Accepted' }
                };
            }
            else {
                messageReply = {
                    status: { code: 409, detail: 'Conflict' }
                };
            }
            // delete all existing records that are smaller
            const deletedMessageCids = [];
            for (const message of existingMessages) {
                if (yield Message.isNewer(newestMessage, message)) {
                    const messageCid = yield Message.getCid(message);
                    deletedMessageCids.push(messageCid);
                    yield this.messageStore.delete(tenant, messageCid);
                }
            }
            yield this.eventLog.deleteEventsByCid(tenant, deletedMessageCids);
            return messageReply;
        });
    }
    ;
    static constructIndexes(protocolsConfigure) {
        // strip out `definition` as it is not indexable
        const _a = protocolsConfigure.message.descriptor, { definition } = _a, propertiesToIndex = __rest(_a, ["definition"]);
        const { author } = protocolsConfigure;
        const indexes = Object.assign(Object.assign({}, propertiesToIndex), { author: author, protocol: definition.protocol, published: definition.published // retain published state from definition
         });
        return indexes;
    }
}
//# sourceMappingURL=protocols-configure.js.map