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
import { RecordsRead } from '../../src/index.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { Time } from '../../src/utils/time.js';
describe('Message', () => {
    describe('getSigner()', () => {
        it('should return `undefined` if message is not signed', () => __awaiter(void 0, void 0, void 0, function* () {
            const recordsRead = yield RecordsRead.create({
                filter: {
                    recordId: yield TestDataGenerator.randomCborSha256Cid()
                }
            });
            const author = Message.getSigner(recordsRead.message);
            expect(author).to.be.undefined;
        }));
    });
    describe('toJSON()', () => {
        it('should return the message passed in to the constructor', () => __awaiter(void 0, void 0, void 0, function* () {
            // create a message without `authorization`
            const { message } = yield RecordsRead.create({
                filter: {
                    recordId: yield TestDataGenerator.randomCborSha256Cid()
                }
            });
            // NOTE: parse() calls constructor internally
            const recordsRead = yield RecordsRead.parse(message);
            expect(recordsRead.toJSON()).to.equal(message);
        }));
    });
    describe('compareMessageTimestamp', () => {
        it('should return 0 if age is same', () => __awaiter(void 0, void 0, void 0, function* () {
            const dateModified = Time.getCurrentTimestamp();
            const a = (yield TestDataGenerator.generateRecordsWrite({ messageTimestamp: dateModified })).message;
            const b = JSON.parse(JSON.stringify(a)); // create a deep copy of `a`
            const compareResult = yield Message.compareMessageTimestamp(a, b);
            expect(compareResult).to.equal(0);
        }));
    });
    describe('getNewestMessage', () => {
        it('should return the newest message', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = (yield TestDataGenerator.generateRecordsWrite()).message;
            yield Time.minimalSleep();
            const b = (yield TestDataGenerator.generateRecordsWrite()).message;
            yield Time.minimalSleep();
            const c = (yield TestDataGenerator.generateRecordsWrite()).message; // c is the newest since its created last
            const newestMessage = yield Message.getNewestMessage([b, c, a]);
            expect(newestMessage.recordId).to.equal(c.recordId);
        }));
    });
    describe('getOldestMessage', () => {
        it('should return the newest message', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = (yield TestDataGenerator.generateRecordsWrite()).message;
            yield Time.minimalSleep();
            const b = (yield TestDataGenerator.generateRecordsWrite()).message;
            yield Time.minimalSleep();
            const c = (yield TestDataGenerator.generateRecordsWrite()).message; // c is the newest since its created last
            const newestMessage = yield Message.getOldestMessage([b, c, a]);
            expect(newestMessage.recordId).to.equal(a.recordId);
        }));
    });
    describe('getCid()', () => {
        it('encodedData does not have an effect on getCid()', () => __awaiter(void 0, void 0, void 0, function* () {
            const { message } = yield TestDataGenerator.generateRecordsWrite();
            const cid1 = yield Message.getCid(message);
            const messageWithData = message;
            messageWithData.encodedData = TestDataGenerator.randomString(25);
            const cid2 = yield Message.getCid(messageWithData);
            expect(cid1).to.equal(cid2);
        }));
    });
});
//# sourceMappingURL=message.spec.js.map