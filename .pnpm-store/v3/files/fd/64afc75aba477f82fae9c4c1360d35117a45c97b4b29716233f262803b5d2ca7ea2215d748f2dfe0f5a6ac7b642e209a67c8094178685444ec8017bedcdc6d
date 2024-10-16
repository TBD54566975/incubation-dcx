var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Message } from '../../src/core/message.js';
import { normalizeSchemaUrl } from '../../src/utils/url.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestStores } from '../test-stores.js';
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';
chai.use(chaiAsPromised);
export function testEventLog() {
    describe('EventLog Tests', () => {
        let eventLog;
        before(() => __awaiter(this, void 0, void 0, function* () {
            const stores = TestStores.get();
            eventLog = stores.eventLog;
            yield eventLog.open();
        }));
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            yield eventLog.clear();
        }));
        after(() => __awaiter(this, void 0, void 0, function* () {
            yield eventLog.close();
        }));
        it('separates events by tenant', () => __awaiter(this, void 0, void 0, function* () {
            const { author, message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite();
            const message1Index = yield recordsWrite.constructIndexes(true);
            const messageCid = yield Message.getCid(message);
            yield eventLog.append(author.did, messageCid, message1Index);
            const { author: author2, message: message2, recordsWrite: recordsWrite2 } = yield TestDataGenerator.generateRecordsWrite();
            const message2Index = yield recordsWrite2.constructIndexes(true);
            const messageCid2 = yield Message.getCid(message2);
            yield eventLog.append(author2.did, messageCid2, message2Index);
            let { events } = yield eventLog.getEvents(author.did);
            expect(events.length).to.equal(1);
            expect(events[0]).to.equal(messageCid);
            ({ events } = yield eventLog.getEvents(author2.did));
            expect(events.length).to.equal(1);
            expect(events[0]).to.equal(messageCid2);
        }));
        it('returns events in the order that they were appended', () => __awaiter(this, void 0, void 0, function* () {
            const expectedMessages = [];
            const { author, message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite();
            const messageCid = yield Message.getCid(message);
            const messageIndex = yield recordsWrite.constructIndexes(true);
            yield eventLog.append(author.did, messageCid, messageIndex);
            expectedMessages.push(messageCid);
            for (let i = 0; i < 9; i += 1) {
                const { message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author });
                const messageCid = yield Message.getCid(message);
                const index = yield recordsWrite.constructIndexes(true);
                yield eventLog.append(author.did, messageCid, index);
                expectedMessages.push(messageCid);
            }
            const { events } = yield eventLog.getEvents(author.did);
            expect(events.length).to.equal(expectedMessages.length);
            for (let i = 0; i < 10; i += 1) {
                expect(events[i]).to.equal(expectedMessages[i]);
            }
        }));
        describe('getEventsAfter', () => {
            it('gets all events for a tenant if a cursor is not provided', () => __awaiter(this, void 0, void 0, function* () {
                const expectedMessages = [];
                const { author, message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite();
                const messageCid = yield Message.getCid(message);
                const messageIndex = yield recordsWrite.constructIndexes(true);
                yield eventLog.append(author.did, messageCid, messageIndex);
                expectedMessages.push(messageCid);
                for (let i = 0; i < 9; i += 1) {
                    const { message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author });
                    const messageCid = yield Message.getCid(message);
                    const index = yield recordsWrite.constructIndexes(true);
                    yield eventLog.append(author.did, messageCid, index);
                    expectedMessages.push(messageCid);
                }
                const { events } = yield eventLog.getEvents(author.did);
                expect(events.length).to.equal(10);
                for (let i = 0; i < events.length; i += 1) {
                    expect(events[i]).to.equal(expectedMessages[i]);
                }
            }));
            it('gets all events that occurred after the cursor provided', () => __awaiter(this, void 0, void 0, function* () {
                const author = yield TestDataGenerator.generateDidKeyPersona();
                // create an initial record to and, issue a getEvents and grab the cursor
                const { message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author });
                const messageCid = yield Message.getCid(message);
                const index = yield recordsWrite.constructIndexes(true);
                yield eventLog.append(author.did, messageCid, index);
                const { events: cursorEvents, cursor } = yield eventLog.getEvents(author.did);
                expect(cursorEvents.length).to.equal(1);
                expect(cursor).to.not.be.undefined;
                expect(cursorEvents[0]).to.equal(messageCid);
                // add more messages
                const expectedMessages = [];
                for (let i = 0; i < 5; i += 1) {
                    const { message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author });
                    const messageCid = yield Message.getCid(message);
                    const index = yield recordsWrite.constructIndexes(true);
                    yield eventLog.append(author.did, messageCid, index);
                    expectedMessages.push(messageCid);
                }
                const { events } = yield eventLog.getEvents(author.did, cursor);
                expect(events.length).to.equal(5);
                for (let i = 0; i < events.length; i += 1) {
                    expect(events[i]).to.equal(expectedMessages[i], `${i}`);
                }
            }));
        });
        describe('deleteEventsByCid', () => {
            it('finds and deletes events that whose values match the cids provided', () => __awaiter(this, void 0, void 0, function* () {
                const { author, message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite();
                const messageCid = yield Message.getCid(message);
                const index = yield recordsWrite.constructIndexes(true);
                yield eventLog.append(author.did, messageCid, index);
                const deleteMessages = [];
                for (let i = 0; i < 9; i += 1) {
                    const { message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author });
                    const messageCid = yield Message.getCid(message);
                    const index = yield recordsWrite.constructIndexes(true);
                    yield eventLog.append(author.did, messageCid, index);
                    if (i % 2 === 0) {
                        deleteMessages.push(messageCid);
                    }
                }
                yield eventLog.deleteEventsByCid(author.did, deleteMessages);
                const { events: remainingEvents } = yield eventLog.getEvents(author.did);
                expect(remainingEvents.length).to.equal(10 - deleteMessages.length);
                expect(remainingEvents).to.not.include.members(deleteMessages);
            }));
            it('skips if cid is invalid', () => __awaiter(this, void 0, void 0, function* () {
                const cids = [];
                const { author, message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite();
                const messageCid = yield Message.getCid(message);
                const index = yield recordsWrite.constructIndexes(true);
                yield eventLog.append(author.did, messageCid, index);
                cids.push(messageCid);
                for (let i = 0; i < 3; i += 1) {
                    const { message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author });
                    const messageCid = yield Message.getCid(message);
                    const index = yield recordsWrite.constructIndexes(true);
                    yield eventLog.append(author.did, messageCid, index);
                    cids.push(messageCid);
                }
                // does not error and deletes all messages
                yield eventLog.deleteEventsByCid(author.did, [...cids, 'someInvalidCid']);
                const { events: remainingEvents } = yield eventLog.getEvents(author.did);
                expect(remainingEvents.length).to.equal(0);
            }));
        });
        describe('query', () => {
            it('returns filtered events in the order that they were appended', () => __awaiter(this, void 0, void 0, function* () {
                const expectedMessages = [];
                const { author, message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ schema: 'schema1' });
                const messageCid = yield Message.getCid(message);
                const indexes = yield recordsWrite.constructIndexes(true);
                yield eventLog.append(author.did, messageCid, indexes);
                expectedMessages.push(messageCid);
                for (let i = 0; i < 5; i += 1) {
                    const { message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author, schema: 'schema1' });
                    const messageCid = yield Message.getCid(message);
                    const indexes = yield recordsWrite.constructIndexes(true);
                    yield eventLog.append(author.did, messageCid, indexes);
                    expectedMessages.push(messageCid);
                }
                // insert a record that will not show up in the filtered query.
                // not inserted into expected events.
                const { message: message2, recordsWrite: recordsWrite2 } = yield TestDataGenerator.generateRecordsWrite({ author });
                const message2Cid = yield Message.getCid(message2);
                const message2Indexes = yield recordsWrite2.constructIndexes(true);
                yield eventLog.append(author.did, message2Cid, message2Indexes);
                for (let i = 0; i < 5; i += 1) {
                    const { message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author, schema: 'schema1' });
                    const messageCid = yield Message.getCid(message);
                    const indexes = yield recordsWrite.constructIndexes(true);
                    yield eventLog.append(author.did, messageCid, indexes);
                    expectedMessages.push(messageCid);
                }
                const { events } = yield eventLog.queryEvents(author.did, [{ schema: normalizeSchemaUrl('schema1') }]);
                expect(events.length).to.equal(expectedMessages.length);
                for (let i = 0; i < expectedMessages.length; i += 1) {
                    expect(events[i]).to.equal(expectedMessages[i]);
                }
            }));
            it('returns filtered events after cursor', () => __awaiter(this, void 0, void 0, function* () {
                const author = yield TestDataGenerator.generateDidKeyPersona();
                // message 1 schema1
                const { message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author, schema: 'schema1' });
                const messageCid = yield Message.getCid(message);
                const indexes = yield recordsWrite.constructIndexes(true);
                yield eventLog.append(author.did, messageCid, indexes);
                // message 2 schema1
                const { message: message2, recordsWrite: recordsWrite2 } = yield TestDataGenerator.generateRecordsWrite({ author, schema: 'schema1' });
                const message2Cid = yield Message.getCid(message2);
                const message2Indexes = yield recordsWrite2.constructIndexes(true);
                yield eventLog.append(author.did, message2Cid, message2Indexes);
                // message 3 schema1
                const { message: message3, recordsWrite: recordsWrite3 } = yield TestDataGenerator.generateRecordsWrite({ author, schema: 'schema1' });
                const message3Cid = yield Message.getCid(message3);
                const message3Indexes = yield recordsWrite3.constructIndexes(true);
                yield eventLog.append(author.did, message3Cid, message3Indexes);
                // insert a record that will not show up in the filtered query.
                // not inserted into expected events because it's not a part of the schema.
                const { message: nonSchemaMessage1, recordsWrite: nonSchemaMessage1Write } = yield TestDataGenerator.generateRecordsWrite({ author });
                const nonSchemaMessage1Cid = yield Message.getCid(nonSchemaMessage1);
                const nonSchemaMessage1Indexes = yield nonSchemaMessage1Write.constructIndexes(true);
                yield eventLog.append(author.did, nonSchemaMessage1Cid, nonSchemaMessage1Indexes);
                // make initial query
                let { events, cursor } = yield eventLog.queryEvents(author.did, [{ schema: normalizeSchemaUrl('schema1') }]);
                expect(events.length).to.equal(3);
                expect(events[0]).to.equal(yield Message.getCid(message));
                expect(events[1]).to.equal(yield Message.getCid(message2));
                expect(events[2]).to.equal(yield Message.getCid(message3));
                // add an additional message to schema 1
                const { message: message4, recordsWrite: recordsWrite4 } = yield TestDataGenerator.generateRecordsWrite({ author, schema: 'schema1' });
                const message4Cid = yield Message.getCid(message4);
                const message4Indexes = yield recordsWrite4.constructIndexes(true);
                yield eventLog.append(author.did, message4Cid, message4Indexes);
                // insert another non schema record
                const { message: nonSchemaMessage2, recordsWrite: nonSchemaMessage2Write } = yield TestDataGenerator.generateRecordsWrite({ author });
                const nonSchemaMessage2Cid = yield Message.getCid(nonSchemaMessage2);
                const nonSchemaMessage2Indexes = yield nonSchemaMessage2Write.constructIndexes(true);
                yield eventLog.append(author.did, nonSchemaMessage2Cid, nonSchemaMessage2Indexes);
                ({ events } = yield eventLog.queryEvents(author.did, [{ schema: normalizeSchemaUrl('schema1') }], cursor));
                expect(events.length).to.equal(1);
                expect(events[0]).to.equal(yield Message.getCid(message4));
            }));
        });
    });
}
//# sourceMappingURL=event-log.spec.js.map