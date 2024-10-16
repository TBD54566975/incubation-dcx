var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { authorizeOwner } from '../../src/core/auth.js';
import { MessagesSubscribe } from '../../src/interfaces/messages-subscribe.js';
import { DwnInterfaceName, DwnMethodName, Jws, TestDataGenerator, Time } from '../../src/index.js';
import { expect } from 'chai';
describe('MessagesSubscribe', () => {
    describe('create()', () => {
        it('should be able to create and authorize MessagesSubscribe', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const timestamp = Time.getCurrentTimestamp();
            const messagesSubscribe = yield MessagesSubscribe.create({
                signer: Jws.createSigner(alice),
                messageTimestamp: timestamp,
            });
            const message = messagesSubscribe.message;
            expect(message.descriptor.interface).to.eql(DwnInterfaceName.Messages);
            expect(message.descriptor.method).to.eql(DwnMethodName.Subscribe);
            expect(message.authorization).to.exist;
            expect(message.descriptor.messageTimestamp).to.equal(timestamp);
            // MessagesSubscribe authorizes against owner
            yield authorizeOwner(alice.did, messagesSubscribe);
        }));
    });
});
//# sourceMappingURL=messages-subscribe.spec.js.map