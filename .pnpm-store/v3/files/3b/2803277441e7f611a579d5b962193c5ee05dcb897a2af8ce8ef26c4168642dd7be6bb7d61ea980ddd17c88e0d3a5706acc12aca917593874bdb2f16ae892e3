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
import { Cid } from '../utils/cid.js';
import { Message } from '../core/message.js';
import { Time } from '../utils/time.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
export class MessagesRead extends AbstractMessage {
    static parse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            Message.validateJsonSchema(message);
            this.validateMessageCid(message.descriptor.messageCid);
            yield Message.validateSignatureStructure(message.authorization.signature, message.descriptor);
            Time.validateTimestamp(message.descriptor.messageTimestamp);
            return new MessagesRead(message);
        });
    }
    static create(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const descriptor = {
                interface: DwnInterfaceName.Messages,
                method: DwnMethodName.Read,
                messageCid: options.messageCid,
                messageTimestamp: (_a = options.messageTimestamp) !== null && _a !== void 0 ? _a : Time.getCurrentTimestamp(),
            };
            const { signer, permissionGrantId } = options;
            const authorization = yield Message.createAuthorization({
                descriptor,
                signer,
                permissionGrantId,
            });
            const message = { descriptor, authorization };
            Message.validateJsonSchema(message);
            MessagesRead.validateMessageCid(options.messageCid);
            return new MessagesRead(message);
        });
    }
    /**
     * validates the provided cid
     * @param messageCid - the cid in question
     * @throws {DwnError} if an invalid cid is found.
     */
    static validateMessageCid(messageCid) {
        try {
            Cid.parseCid(messageCid);
        }
        catch (_) {
            throw new DwnError(DwnErrorCode.MessagesReadInvalidCid, `${messageCid} is not a valid CID`);
        }
    }
}
//# sourceMappingURL=messages-read.js.map