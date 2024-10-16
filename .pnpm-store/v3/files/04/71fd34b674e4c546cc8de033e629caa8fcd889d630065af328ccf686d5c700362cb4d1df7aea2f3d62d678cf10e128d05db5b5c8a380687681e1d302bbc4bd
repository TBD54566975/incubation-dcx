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
import { lexicographicalCompare } from '../../src/utils/string.js';
import { Message } from '../../src/core/message.js';
import { SortDirection } from '../../src/types/query-types.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestStores } from '../test-stores.js';
let messageStore;
export function testMessageStore() {
    describe('Generic MessageStore Test Suite', () => {
        describe('put', function () {
            // important to follow the `before` and `after` pattern to initialize and clean the stores in tests
            // so that different test suites can reuse the same backend store for testing
            before(() => __awaiter(this, void 0, void 0, function* () {
                const stores = TestStores.get();
                messageStore = stores.messageStore;
                yield messageStore.open();
            }));
            beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                yield messageStore.clear(); // clean up before each test rather than after so that a test does not depend on other tests to do the clean up
            }));
            after(() => __awaiter(this, void 0, void 0, function* () {
                yield messageStore.close();
            }));
            it('stores messages as cbor/sha256 encoded blocks with CID as key', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateRecordsWrite();
                const { messageTimestamp } = message.descriptor;
                yield messageStore.put(alice.did, message, { messageTimestamp });
                const expectedCid = yield Message.getCid(message);
                const jsonMessage = (yield messageStore.get(alice.did, expectedCid));
                const resultCid = yield Message.getCid(jsonMessage);
                expect(resultCid).to.equal(expectedCid);
            }));
            // https://github.com/TBD54566975/dwn-sdk-js/issues/170
            it('#170 - should be able to update (delete and insert new) indexes to an existing message', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateRecordsWrite();
                const { messageTimestamp } = message.descriptor;
                // inserting the message indicating it is the 'latest' in the index
                yield messageStore.put(alice.did, message, { latest: 'true', messageTimestamp });
                const { messages: results1 } = yield messageStore.query(alice.did, [{ latest: 'true' }]);
                expect(results1.length).to.equal(1);
                const { messages: results2 } = yield messageStore.query(alice.did, [{ latest: 'false' }]);
                expect(results2.length).to.equal(0);
                // deleting the existing indexes and replacing it indicating it is no longer the 'latest'
                const cid = yield Message.getCid(message);
                yield messageStore.delete(alice.did, cid);
                yield messageStore.put(alice.did, message, { latest: 'false', messageTimestamp });
                const { messages: results3 } = yield messageStore.query(alice.did, [{ latest: 'true' }]);
                expect(results3.length).to.equal(0);
                const { messages: results4 } = yield messageStore.query(alice.did, [{ latest: 'false' }]);
                expect(results4.length).to.equal(1);
            }));
            it('should index properties with characters beyond just letters and digits', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const schema = 'http://my-awesome-schema/awesomeness_schema';
                const { message } = yield TestDataGenerator.generateRecordsWrite({ schema });
                const { messageTimestamp } = message.descriptor;
                yield messageStore.put(alice.did, message, { schema, messageTimestamp });
                const { messages: results } = yield messageStore.query(alice.did, [{ schema }]);
                expect(results[0].descriptor.schema).to.equal(schema);
            }));
            it('should not store anything if aborted beforehand', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateRecordsWrite();
                const { messageTimestamp } = message.descriptor;
                const controller = new AbortController();
                controller.signal.throwIfAborted = () => { }; // simulate aborting happening async
                controller.abort('reason');
                try {
                    yield messageStore.put(alice.did, message, { messageTimestamp }, { signal: controller.signal });
                }
                catch (e) {
                    expect(e).to.equal('reason');
                }
                const expectedCid = yield Message.getCid(message);
                const jsonMessage = yield messageStore.get(alice.did, expectedCid);
                expect(jsonMessage).to.equal(undefined);
            }));
            it('should not index anything if aborted during', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const schema = 'http://my-awesome-schema/awesomeness_schema#awesome-1?id=awesome_1';
                const { message } = yield TestDataGenerator.generateRecordsWrite({ schema });
                const { messageTimestamp } = message.descriptor;
                const controller = new AbortController();
                queueMicrotask(() => {
                    controller.abort('reason');
                });
                try {
                    yield messageStore.put(alice.did, message, { schema, messageTimestamp }, { signal: controller.signal });
                }
                catch (e) {
                    expect(e).to.equal('reason');
                }
                // index should not return the message
                const { messages: results } = yield messageStore.query(alice.did, [{ schema }]);
                expect(results.length).to.equal(0);
                // check that message doesn't exist
                const messageCid = yield Message.getCid(message);
                const fetchedMessage = yield messageStore.get(alice.did, messageCid);
                expect(fetchedMessage).to.be.undefined;
            }));
            it('should not store anything if aborted beforehand', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateRecordsWrite();
                const { messageTimestamp } = message.descriptor;
                const controller = new AbortController();
                controller.signal.throwIfAborted = () => { }; // simulate aborting happening async
                controller.abort('reason');
                try {
                    yield messageStore.put(alice.did, message, { messageTimestamp }, { signal: controller.signal });
                }
                catch (e) {
                    expect(e).to.equal('reason');
                }
                const expectedCid = yield Message.getCid(message);
                const jsonMessage = yield messageStore.get(alice.did, expectedCid);
                expect(jsonMessage).to.equal(undefined);
            }));
            it('should not delete if aborted', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateRecordsWrite();
                const { messageTimestamp } = message.descriptor;
                yield messageStore.put(alice.did, message, { latest: 'true', messageTimestamp });
                const messageCid = yield Message.getCid(message);
                const resultsAlice1 = yield messageStore.get(alice.did, messageCid);
                expect(resultsAlice1.recordId).to.equal(message.recordId);
                const controller = new AbortController();
                controller.signal.throwIfAborted = () => { }; // simulate aborting happening async
                controller.abort('reason');
                // aborted delete
                const deletePromise = messageStore.delete(alice.did, messageCid, { signal: controller.signal });
                yield expect(deletePromise).to.eventually.rejectedWith('reason');
            }));
            it('should not delete the message of another tenant', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateRecordsWrite();
                const { messageTimestamp } = message.descriptor;
                yield messageStore.put(alice.did, message, { latest: 'true', messageTimestamp });
                yield messageStore.put(bob.did, message, { latest: 'true', messageTimestamp });
                const messageCid = yield Message.getCid(message);
                const resultsAlice1 = yield messageStore.get(alice.did, messageCid);
                expect(resultsAlice1.recordId).to.equal(message.recordId);
                const resultsBob1 = yield messageStore.get(bob.did, messageCid);
                expect(resultsBob1.recordId).to.equal(message.recordId);
                // bob deletes message
                yield messageStore.delete(bob.did, messageCid);
                const resultsBob2 = yield messageStore.get(bob.did, messageCid);
                expect(resultsBob2).to.be.undefined;
                //expect alice to retain the message
                const resultsAlice2 = yield messageStore.get(alice.did, messageCid);
                expect(resultsAlice2.recordId).to.equal(message.recordId);
            }));
            it('should not clear the MessageStore index of another tenant', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateRecordsWrite();
                const { messageTimestamp } = message.descriptor;
                yield messageStore.put(alice.did, message, { latest: 'true', messageTimestamp });
                yield messageStore.put(bob.did, message, { latest: 'true', messageTimestamp });
                const messageCid = yield Message.getCid(message);
                const resultsAlice1 = yield messageStore.query(alice.did, [{ latest: 'true' }]);
                expect(resultsAlice1.messages.length).to.equal(1);
                const resultsBob1 = yield messageStore.query(bob.did, [{ latest: 'true' }]);
                expect(resultsBob1.messages.length).to.equal(1);
                // bob deletes message
                yield messageStore.delete(bob.did, messageCid);
                const resultsBob2 = yield messageStore.query(bob.did, [{ latest: 'true' }]);
                expect(resultsBob2.messages.length).to.equal(0);
                //expect alice to retain the message
                const resultsAlice2 = yield messageStore.query(alice.did, [{ latest: 'true' }]);
                expect(resultsAlice2.messages.length).to.equal(1);
            }));
        });
        describe('sort and pagination', () => {
            // important to follow the `before` and `after` pattern to initialize and clean the stores in tests
            // so that different test suites can reuse the same backend store for testing
            before(() => __awaiter(this, void 0, void 0, function* () {
                const stores = TestStores.get();
                messageStore = stores.messageStore;
                yield messageStore.open();
            }));
            beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                yield messageStore.clear(); // clean up before each test rather than after so that a test does not depend on other tests to do the clean up
            }));
            after(() => __awaiter(this, void 0, void 0, function* () {
                yield messageStore.close();
            }));
            describe('sorting', () => __awaiter(this, void 0, void 0, function* () {
                it('should sort on messageTimestamp Ascending if no sort is specified', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        messageTimestamp: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const { messages: messageQuery } = yield messageStore.query(alice.did, [{}]);
                    expect(messageQuery.length).to.equal(messages.length);
                    const sortedRecords = messages.sort((a, b) => lexicographicalCompare(a.message.descriptor.messageTimestamp, b.message.descriptor.messageTimestamp));
                    for (let i = 0; i < sortedRecords.length; i++) {
                        expect(sortedRecords[i].message.descriptor.messageTimestamp).to.equal(messageQuery[i].descriptor.messageTimestamp);
                    }
                }));
                it('should sort on messageTimestamp Ascending', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        messageTimestamp: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const { messages: messageQuery } = yield messageStore.query(alice.did, [{}], { messageTimestamp: SortDirection.Ascending });
                    expect(messageQuery.length).to.equal(messages.length);
                    const sortedRecords = messages.sort((a, b) => lexicographicalCompare(a.message.descriptor.messageTimestamp, b.message.descriptor.messageTimestamp));
                    for (let i = 0; i < messages.length; i++) {
                        expect(sortedRecords[i].message.descriptor.messageTimestamp).to.equal(messageQuery[i].descriptor.messageTimestamp);
                    }
                }));
                it('should sort on dateCreated Ascending', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        dateCreated: TestDataGenerator.randomTimestamp(),
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const { messages: messageQuery } = yield messageStore.query(alice.did, [{}], { dateCreated: SortDirection.Ascending });
                    expect(messageQuery.length).to.equal(messages.length);
                    const sortedRecords = messages.sort((a, b) => lexicographicalCompare(a.message.descriptor.dateCreated, b.message.descriptor.dateCreated));
                    for (let i = 0; i < messages.length; i++) {
                        expect(yield Message.getCid(sortedRecords[i].message)).to.equal(yield Message.getCid(messageQuery[i]));
                    }
                }));
                it('should sort on dateCreated Descending', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        dateCreated: TestDataGenerator.randomTimestamp(),
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const { messages: messageQuery } = yield messageStore.query(alice.did, [{}], { dateCreated: SortDirection.Descending });
                    expect(messageQuery.length).to.equal(messages.length);
                    const sortedRecords = messages.sort((a, b) => lexicographicalCompare(b.message.descriptor.dateCreated, a.message.descriptor.dateCreated));
                    for (let i = 0; i < messages.length; i++) {
                        expect(yield Message.getCid(sortedRecords[i].message)).to.equal(yield Message.getCid(messageQuery[i]));
                    }
                }));
                it('should sort on datePublished Ascending', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        published: true,
                        datePublished: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const { messages: messageQuery } = yield messageStore.query(alice.did, [{}], { datePublished: SortDirection.Ascending });
                    expect(messageQuery.length).to.equal(messages.length);
                    const sortedRecords = messages.sort((a, b) => lexicographicalCompare(a.message.descriptor.datePublished, b.message.descriptor.datePublished));
                    for (let i = 0; i < messages.length; i++) {
                        expect(yield Message.getCid(sortedRecords[i].message)).to.equal(yield Message.getCid(messageQuery[i]));
                    }
                }));
                it('should sort on datePublished Descending', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        published: true,
                        datePublished: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const { messages: messageQuery } = yield messageStore.query(alice.did, [{}], { datePublished: SortDirection.Descending });
                    expect(messageQuery.length).to.equal(messages.length);
                    const sortedRecords = messages.sort((a, b) => lexicographicalCompare(b.message.descriptor.datePublished, a.message.descriptor.datePublished));
                    for (let i = 0; i < messages.length; i++) {
                        expect(yield Message.getCid(sortedRecords[i].message)).to.equal(yield Message.getCid(messageQuery[i]));
                    }
                }));
            }));
            describe('pagination', () => __awaiter(this, void 0, void 0, function* () {
                it('should return all records if no limit is specified', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        messageTimestamp: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const { messages: limitQuery } = yield messageStore.query(alice.did, [{}]);
                    expect(limitQuery.length).to.equal(messages.length);
                }));
                it('should limit records', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        messageTimestamp: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const sortedRecords = messages.sort((a, b) => lexicographicalCompare(a.message.descriptor.messageTimestamp, b.message.descriptor.messageTimestamp));
                    const limit = 5;
                    const { messages: limitQuery } = yield messageStore.query(alice.did, [{}], {}, { limit });
                    expect(limitQuery.length).to.equal(limit);
                    for (let i = 0; i < limitQuery.length; i++) {
                        expect(yield Message.getCid(sortedRecords[i].message)).to.equal(yield Message.getCid(limitQuery[i]));
                    }
                }));
                it('should only return a cursor if there are additional results', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        messageTimestamp: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    // get all of the records
                    const allRecords = yield messageStore.query(alice.did, [{}], {}, { limit: 10 });
                    expect(allRecords.cursor).to.not.exist;
                    // get only partial records
                    const partialRecords = yield messageStore.query(alice.did, [{}], {}, { limit: 5 });
                    expect(partialRecords.cursor).to.exist.and.to.not.be.undefined;
                }));
                it('should return all records from the cursor onwards when no limit is provided', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(13).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        messageTimestamp: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const sortedRecords = messages.sort((a, b) => lexicographicalCompare(a.message.descriptor.messageTimestamp, b.message.descriptor.messageTimestamp));
                    // we make an initial request to get one record and a cursor.
                    const { cursor } = yield messageStore.query(alice.did, [{}], {}, { limit: 1 });
                    const { messages: limitQuery } = yield messageStore.query(alice.did, [{}], {}, { cursor });
                    expect(limitQuery.length).to.equal(sortedRecords.slice(1).length);
                    for (let i = 0; i < limitQuery.length; i++) {
                        const offsetIndex = i + 1; // offset for the initial request item
                        expect(yield Message.getCid(sortedRecords[offsetIndex].message)).to.equal(yield Message.getCid(limitQuery[i]));
                    }
                }));
                it('should limit records when a cursor and limit are provided', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(10).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        messageTimestamp: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const sortedRecords = messages.sort((a, b) => lexicographicalCompare(a.message.descriptor.messageTimestamp, b.message.descriptor.messageTimestamp));
                    // we make an initial request to get one record and a cursor.
                    const { cursor } = yield messageStore.query(alice.did, [{}], {}, { limit: 1 });
                    const limit = 3;
                    const { messages: limitQuery } = yield messageStore.query(alice.did, [{}], {}, { cursor, limit });
                    expect(limitQuery.length).to.equal(limit);
                    for (let i = 0; i < limitQuery.length; i++) {
                        const offsetIndex = i + 1; // offset for the initial request item
                        expect(yield Message.getCid(sortedRecords[offsetIndex].message)).to.equal(yield Message.getCid(limitQuery[i]));
                    }
                }));
                it('should paginate through all of the records', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const messages = yield Promise.all(Array(23).fill({}).map((_) => TestDataGenerator.generateRecordsWrite({
                        messageTimestamp: TestDataGenerator.randomTimestamp()
                    })));
                    for (const message of messages) {
                        yield messageStore.put(alice.did, message.message, yield message.recordsWrite.constructIndexes(true));
                    }
                    const limit = 6;
                    const results = [];
                    let cursor;
                    while (true) {
                        const { messages: limitQuery, cursor: queryCursor } = yield messageStore.query(alice.did, [{}], {}, { cursor, limit });
                        expect(limitQuery.length).to.be.lessThanOrEqual(limit);
                        results.push(...limitQuery);
                        cursor = queryCursor;
                        if (cursor === undefined) {
                            break;
                        }
                    }
                    expect(results.length).to.equal(messages.length);
                    const messageMessageIds = yield Promise.all(messages.map(m => Message.getCid(m.message)));
                    const resultMessageIds = yield Promise.all(results.map(m => Message.getCid(m)));
                    for (const recordId of messageMessageIds) {
                        expect(resultMessageIds.includes(recordId)).to.be.true;
                    }
                }));
            }));
        });
    });
}
//# sourceMappingURL=message-store.spec.js.map