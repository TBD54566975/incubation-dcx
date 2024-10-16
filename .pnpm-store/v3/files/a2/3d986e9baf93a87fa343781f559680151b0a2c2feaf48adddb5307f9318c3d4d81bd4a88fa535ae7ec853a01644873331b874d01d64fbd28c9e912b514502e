var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Jws } from '../../src/utils/jws.js';
import { Message } from '../../src/core/message.js';
import { MessagesQuery } from '../../src/interfaces/messages-query.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { Time } from '../../src/utils/time.js';
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';
chai.use(chaiAsPromised);
describe('MessagesQuery Message', () => {
    describe('create()', () => {
        it('should use `messageTimestamp` as is if given', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const messagesQuery = yield MessagesQuery.create({
                filters: [{ protocol: 'http://example.org/protocol/v1' }],
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
            });
            expect(messagesQuery.message.descriptor.messageTimestamp).to.equal(currentTime);
        }));
        it('should auto-normalize protocol URL', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const alice = yield TestDataGenerator.generatePersona();
            const options = {
                recipient: alice.did,
                signer: Jws.createSigner(alice),
                filters: [{ protocol: 'example.com/' }],
            };
            const messagesQuery = yield MessagesQuery.create(options);
            const message = messagesQuery.message;
            expect((_a = message.descriptor.filters) === null || _a === void 0 ? void 0 : _a.length).to.equal(1);
            expect(message.descriptor.filters[0].protocol).to.eq('http://example.com');
        }));
        it('allows query with no filters', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const messagesQuery = yield MessagesQuery.create({
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
            });
            expect(messagesQuery.message.descriptor.filters).to.deep.equal([]); // empty array
        }));
        it('removes empty filters', () => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            // single empty filter fails
            const messagesQuery1 = yield MessagesQuery.create({
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
                filters: [{}],
            });
            expect(messagesQuery1.message.descriptor.filters).to.deep.equal([]); // empty array
            // empty filter gets removed, valid filter remains
            const messagesQuery2 = yield MessagesQuery.create({
                filters: [{ protocol: 'http://example.org/protocol/v1' }, {}],
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
            });
            expect((_b = messagesQuery2.message.descriptor.filters) === null || _b === void 0 ? void 0 : _b.length).to.equal(1);
            expect(messagesQuery2.message.descriptor.filters).to.deep.equal([{ protocol: 'http://example.org/protocol/v1' }]);
        }));
    });
    describe('parse', () => {
        it('parses a message into an MessagesQuery instance', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const messagesQuery = yield MessagesQuery.create({
                filters: [{ protocol: 'http://example.org/protocol/v1' }],
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
            });
            const parsed = yield MessagesQuery.parse(messagesQuery.message);
            expect(parsed).to.be.instanceof(MessagesQuery);
            const expectedMessageCid = yield Message.getCid(messagesQuery.message);
            const messageCid = yield Message.getCid(parsed.message);
            expect(messageCid).to.equal(expectedMessageCid);
        }));
        it('throws an exception if message is not a valid MessagesQuery message', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const messagesQuery = yield MessagesQuery.create({
                filters: [{ protocol: 'http://example.org/protocol/v1' }],
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
            });
            const { message } = messagesQuery;
            message.descriptor['bad_property'] = 'property';
            const messagesQueryPromise = MessagesQuery.parse(message);
            yield expect(messagesQueryPromise).to.eventually.be.rejectedWith('must NOT have additional properties');
        }));
        it('allows query without any filters', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const messagesQuery = yield MessagesQuery.create({
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
            });
            const { message } = messagesQuery;
            const parsedQuery = yield MessagesQuery.parse(message);
            expect(parsedQuery.message.descriptor.filters).to.deep.equal([]);
        }));
        it('throws an exception if message has an empty filter', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const messagesQuery = yield MessagesQuery.create({
                filters: [{ protocol: 'http://example.org/protocol/v1' }],
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
            });
            const { message } = messagesQuery;
            message.descriptor.filters.push({}); // add an empty filter
            const messagesQueryPromise = MessagesQuery.parse(message);
            yield expect(messagesQueryPromise).to.eventually.be.rejectedWith('must NOT have fewer than 1 properties');
        }));
    });
});
//# sourceMappingURL=messagess-query.spec.js.map