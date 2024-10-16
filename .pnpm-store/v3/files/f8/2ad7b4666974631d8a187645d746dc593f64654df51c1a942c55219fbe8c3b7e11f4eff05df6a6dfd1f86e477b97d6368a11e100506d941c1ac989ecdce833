var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect } from 'chai';
import { Message } from '../../src/core/message.js';
import { MessagesRead } from '../../src/index.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { DwnErrorCode, Jws } from '../../src/index.js';
describe('MessagesRead Message', () => {
    describe('create', () => {
        it('creates a MessagesRead message', () => __awaiter(void 0, void 0, void 0, function* () {
            const { author, message } = yield TestDataGenerator.generateRecordsWrite();
            const messageCid = yield Message.getCid(message);
            const messageTimestamp = TestDataGenerator.randomTimestamp();
            const messagesRead = yield MessagesRead.create({
                signer: yield Jws.createSigner(author),
                messageCid: messageCid,
                messageTimestamp,
            });
            expect(messagesRead.message.authorization).to.exist;
            expect(messagesRead.message.descriptor).to.exist;
            expect(messagesRead.message.descriptor.messageCid).to.equal(messageCid);
            expect(messagesRead.message.descriptor.messageTimestamp).to.equal(messageTimestamp);
        }));
        it('throws an error if an invalid CID is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            try {
                yield MessagesRead.create({
                    signer: yield Jws.createSigner(alice),
                    messageCid: 'abcd'
                });
                expect.fail();
            }
            catch (e) {
                expect(e.message).to.include(DwnErrorCode.MessagesReadInvalidCid);
            }
        }));
    });
    describe('parse', () => {
        it('parses a message into a MessagesRead instance', () => __awaiter(void 0, void 0, void 0, function* () {
            const { author, message } = yield TestDataGenerator.generateRecordsWrite();
            let messageCid = yield Message.getCid(message);
            const messagesRead = yield MessagesRead.create({
                signer: yield Jws.createSigner(author),
                messageCid: messageCid
            });
            const parsed = yield MessagesRead.parse(messagesRead.message);
            expect(parsed).to.be.instanceof(MessagesRead);
            const expectedMessageCid = yield Message.getCid(messagesRead.message);
            messageCid = yield Message.getCid(parsed.message);
            expect(messageCid).to.equal(expectedMessageCid);
        }));
        it('throws an exception if messageCids contains an invalid cid', () => __awaiter(void 0, void 0, void 0, function* () {
            const { author, message: recordsWriteMessage } = yield TestDataGenerator.generateRecordsWrite();
            const messageCid = yield Message.getCid(recordsWriteMessage);
            const messagesRead = yield MessagesRead.create({
                signer: yield Jws.createSigner(author),
                messageCid: messageCid
            });
            const message = messagesRead.toJSON();
            message.descriptor.messageCid = 'abcd';
            try {
                yield MessagesRead.parse(message);
                expect.fail();
            }
            catch (e) {
                expect(e.message).to.include('is not a valid CID');
            }
        }));
    });
});
//# sourceMappingURL=messages-get.spec.js.map