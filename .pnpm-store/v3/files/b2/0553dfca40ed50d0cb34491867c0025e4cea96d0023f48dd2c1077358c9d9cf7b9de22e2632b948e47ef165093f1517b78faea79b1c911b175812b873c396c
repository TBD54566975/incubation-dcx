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
import { DwnErrorCode } from '../core/dwn-error.js';
import { messageReplyFromError } from '../core/message-reply.js';
import { ProtocolsQuery } from '../interfaces/protocols-query.js';
import { removeUndefinedProperties } from '../utils/object.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
export class ProtocolsQueryHandler {
    constructor(didResolver, messageStore, dataStore) {
        this.didResolver = didResolver;
        this.messageStore = messageStore;
        this.dataStore = dataStore;
    }
    handle({ tenant, message }) {
        return __awaiter(this, void 0, void 0, function* () {
            let protocolsQuery;
            try {
                protocolsQuery = yield ProtocolsQuery.parse(message);
            }
            catch (e) {
                return messageReplyFromError(e, 400);
            }
            // authentication & authorization
            try {
                yield authenticate(message.authorization, this.didResolver);
                yield protocolsQuery.authorize(tenant, this.messageStore);
            }
            catch (error) {
                // return public ProtocolsConfigures if query fails with a certain authentication or authorization code
                if (error.code === DwnErrorCode.AuthenticateJwsMissing || // unauthenticated
                    error.code === DwnErrorCode.ProtocolsQueryUnauthorized) {
                    const entries = yield this.fetchPublishedProtocolsConfigure(tenant, protocolsQuery);
                    return {
                        status: { code: 200, detail: 'OK' },
                        entries
                    };
                }
                else {
                    return messageReplyFromError(error, 401);
                }
            }
            const query = Object.assign(Object.assign({}, message.descriptor.filter), { interface: DwnInterfaceName.Protocols, method: DwnMethodName.Configure });
            removeUndefinedProperties(query);
            const { messages } = yield this.messageStore.query(tenant, [query]);
            return {
                status: { code: 200, detail: 'OK' },
                entries: messages
            };
        });
    }
    ;
    /**
     * Fetches only published `ProtocolsConfigure`.
     */
    fetchPublishedProtocolsConfigure(tenant, protocolsQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            // fetch all published `ProtocolConfigure` matching the query
            const filter = Object.assign(Object.assign({}, protocolsQuery.message.descriptor.filter), { interface: DwnInterfaceName.Protocols, method: DwnMethodName.Configure, published: true });
            const { messages: publishedProtocolsConfigure } = yield this.messageStore.query(tenant, [filter]);
            return publishedProtocolsConfigure;
        });
    }
}
//# sourceMappingURL=protocols-query.js.map