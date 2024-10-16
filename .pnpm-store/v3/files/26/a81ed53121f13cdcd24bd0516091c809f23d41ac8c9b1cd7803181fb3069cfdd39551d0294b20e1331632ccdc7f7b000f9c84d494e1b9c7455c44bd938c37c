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
import { Messages } from '../utils/messages.js';
import { removeUndefinedProperties } from '../utils/object.js';
import { Time } from '../utils/time.js';
import { validateProtocolUrlNormalized } from '../utils/url.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
export class MessagesQuery extends AbstractMessage {
    static parse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            Message.validateJsonSchema(message);
            yield Message.validateSignatureStructure(message.authorization.signature, message.descriptor);
            for (const filter of message.descriptor.filters) {
                if ('protocol' in filter && filter.protocol !== undefined) {
                    validateProtocolUrlNormalized(filter.protocol);
                }
            }
            return new MessagesQuery(message);
        });
    }
    static create(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const descriptor = {
                interface: DwnInterfaceName.Messages,
                method: DwnMethodName.Query,
                filters: options.filters ? Messages.normalizeFilters(options.filters) : [],
                messageTimestamp: (_a = options.messageTimestamp) !== null && _a !== void 0 ? _a : Time.getCurrentTimestamp(),
                cursor: options.cursor,
            };
            removeUndefinedProperties(descriptor);
            const { permissionGrantId, signer } = options;
            const authorization = yield Message.createAuthorization({
                descriptor,
                signer,
                permissionGrantId
            });
            const message = { descriptor, authorization };
            Message.validateJsonSchema(message);
            return new MessagesQuery(message);
        });
    }
}
//# sourceMappingURL=messages-query.js.map