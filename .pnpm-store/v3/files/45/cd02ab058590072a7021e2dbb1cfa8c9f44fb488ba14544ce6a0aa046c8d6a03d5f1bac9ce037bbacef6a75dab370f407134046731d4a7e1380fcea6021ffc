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
import freeForAll from '../vectors/protocol-definitions/free-for-all.json' assert { type: 'json' };
import { Message } from '../../src/core/message.js';
import { MessagesQueryHandler } from '../../src/handlers/messages-query.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import { Dwn, DwnErrorCode, DwnInterfaceName, DwnMethodName } from '../../src/index.js';
export function testMessagesQueryHandler() {
    describe('MessagesQueryHandler.handle()', () => {
        let didResolver;
        let messageStore;
        let dataStore;
        let resumableTaskStore;
        let eventLog;
        let eventStream;
        let dwn;
        // important to follow the `before` and `after` pattern to initialize and clean the stores in tests
        // so that different test suites can reuse the same backend store for testing
        before(() => __awaiter(this, void 0, void 0, function* () {
            didResolver = new UniversalResolver({ didResolvers: [DidKey] });
            const stores = TestStores.get();
            messageStore = stores.messageStore;
            dataStore = stores.dataStore;
            resumableTaskStore = stores.resumableTaskStore;
            eventLog = stores.eventLog;
            eventStream = TestEventStream.get();
            dwn = yield Dwn.create({ didResolver, messageStore, dataStore, eventLog, eventStream, resumableTaskStore });
        }));
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            // clean up before each test rather than after so that a test does not depend on other tests to do the clean up
            yield messageStore.clear();
            yield dataStore.clear();
            yield resumableTaskStore.clear();
            yield eventLog.clear();
        }));
        after(() => __awaiter(this, void 0, void 0, function* () {
            yield dwn.close();
        }));
        it('returns a 401 if tenant is not author', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const { message } = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
            });
            const messagesQueryHandler = new MessagesQueryHandler(didResolver, messageStore, eventLog);
            const reply = yield messagesQueryHandler.handle({ tenant: bob.did, message });
            expect(reply.status.code).to.equal(401);
            expect(reply.entries).to.not.exist;
        }));
        it('returns a 400 if message is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const { message } = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
            });
            message['descriptor']['troll'] = 'hehe';
            const messagesQueryHandler = new MessagesQueryHandler(didResolver, messageStore, eventLog);
            const reply = yield messagesQueryHandler.handle({ tenant: alice.did, message });
            expect(reply.status.code).to.equal(400);
            expect(reply.entries).to.not.exist;
        }));
        it('returns 400 if an empty filter without properties is provided', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const { message } = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ protocol: 'http://example.org/protocol/v1' }],
            }); // create with filter to prevent failure on .create()
            message.descriptor.filters = [{}]; // empty out filter properties
            const messagesQueryHandler = new MessagesQueryHandler(didResolver, messageStore, eventLog);
            const reply = yield messagesQueryHandler.handle({ tenant: alice.did, message });
            expect(reply.status.code).to.equal(400);
            expect(reply.entries).to.not.exist;
        }));
        it('returns all messages for a tenant beyond a provided cursor', () => __awaiter(this, void 0, void 0, function* () {
            // scenario: Alice configures a protocol, and writes 5 records.
            // Alice queries for messages without a cursor, and expects to see all 5 records as well as the protocol configuration message.
            // Alice writes an additional record.
            // Alice queries for messages beyond the cursor, and expects to see only the additional record.
            var _a;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const expectedCids = [];
            const protocolDefinition = Object.assign(Object.assign({}, freeForAll), { published: true });
            // write a protocol configuration
            const { message: protocolMessage } = yield TestDataGenerator.generateProtocolsConfigure({
                author: alice,
                protocolDefinition,
            });
            const { status: configureStatus } = yield dwn.processMessage(alice.did, protocolMessage);
            expect(configureStatus.code).to.equal(202);
            expectedCids.push(yield Message.getCid(protocolMessage));
            for (let i = 0; i < 5; i += 1) {
                const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'post',
                    schema: protocolDefinition.types.post.schema,
                    author: alice
                });
                const reply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(reply.status.code).to.equal(202);
                const messageCid = yield Message.getCid(message);
                expectedCids.push(messageCid);
            }
            const { message } = yield TestDataGenerator.generateMessagesQuery({ author: alice });
            const reply = yield dwn.processMessage(alice.did, message);
            expect(reply.status.code).to.equal(200);
            expect(reply.data).to.not.exist;
            expect((_a = reply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(expectedCids.length);
            for (let i = 0; i < reply.entries.length; i += 1) {
                expect(reply.entries[i]).to.equal(expectedCids[i]);
            }
            // write an additional message
            const { message: additionalMessage, dataStream: additionalDataStream } = yield TestDataGenerator.generateRecordsWrite({
                protocol: protocolDefinition.protocol,
                protocolPath: 'post',
                schema: protocolDefinition.types.post.schema,
                author: alice
            });
            const additionalReply = yield dwn.processMessage(alice.did, additionalMessage, { dataStream: additionalDataStream });
            expect(additionalReply.status.code).to.equal(202);
            // query for messages beyond the cursor
            const { message: messagesAfterCursor } = yield TestDataGenerator.generateMessagesQuery({ author: alice, cursor: reply.cursor });
            const afterCursorReply = yield dwn.processMessage(alice.did, messagesAfterCursor);
            expect(afterCursorReply.status.code).to.equal(200);
            expect(afterCursorReply.entries.length).to.equal(1);
            expect(afterCursorReply.entries[0]).to.equal(yield Message.getCid(additionalMessage));
        }));
        describe('grant based queries', () => {
            it('allows query of messages with matching interface and method grant scope', () => __awaiter(this, void 0, void 0, function* () {
                // scenario: Alice gives Bob permission to query for all of her messages
                // Alice writes various messages
                // When Bob queries for messages, he should see all of Alice's messages including his own grant
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // create grant that is scoped to `MessagesQuery` for bob
                const { message: grantMessage, dataStream } = yield TestDataGenerator.generateGrantCreate({
                    author: alice,
                    grantedTo: bob,
                    scope: {
                        interface: DwnInterfaceName.Messages,
                        method: DwnMethodName.Query
                    }
                });
                const grantReply = yield dwn.processMessage(alice.did, grantMessage, { dataStream });
                expect(grantReply.status.code).to.equal(202);
                // configure the freeForAll protocol
                const { message: freeForAllConfigure } = yield TestDataGenerator.generateProtocolsConfigure({
                    author: alice,
                    protocolDefinition: freeForAll,
                });
                const { status: freeForAllReplyStatus } = yield dwn.processMessage(alice.did, freeForAllConfigure);
                expect(freeForAllReplyStatus.code).to.equal(202);
                // configure a random protocol configuration
                const { message: protocolMessage } = yield TestDataGenerator.generateProtocolsConfigure({
                    author: alice,
                });
                const { status: configureStatus } = yield dwn.processMessage(alice.did, protocolMessage);
                expect(configureStatus.code).to.equal(202);
                // write a message to the Records free for all interface
                const { message: recordMessage, dataStream: recordDataStream } = yield TestDataGenerator.generateRecordsWrite({
                    protocol: freeForAll.protocol,
                    protocolPath: 'post',
                    schema: freeForAll.types.post.schema,
                    author: alice
                });
                const recordReply = yield dwn.processMessage(alice.did, recordMessage, { dataStream: recordDataStream });
                expect(recordReply.status.code).to.equal(202);
                // write a random message
                const { message: randomMessage, dataStream: randomDataStream } = yield TestDataGenerator.generateRecordsWrite({
                    author: alice
                });
                const randomReply = yield dwn.processMessage(alice.did, randomMessage, { dataStream: randomDataStream });
                expect(randomReply.status.code).to.equal(202);
                // bob uses the grant to query for all of these messages
                const { message: bobQuery } = yield TestDataGenerator.generateMessagesQuery({
                    author: bob,
                    permissionGrantId: grantMessage.recordId
                });
                const bobReply = yield dwn.processMessage(alice.did, bobQuery);
                expect(bobReply.status.code).to.equal(200);
                expect(bobReply.entries.length).to.equal(5);
                expect(bobReply.entries).to.have.members([
                    yield Message.getCid(grantMessage),
                    yield Message.getCid(freeForAllConfigure),
                    yield Message.getCid(protocolMessage),
                    yield Message.getCid(recordMessage),
                    yield Message.getCid(randomMessage),
                ]);
            }));
            it('rejects query of messages with mismatching interface grant scope', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // create grant that is scoped to `RecordsWrite` for bob scoped to the `freeForAll` protocol
                const { message: grantMessage, dataStream } = yield TestDataGenerator.generateGrantCreate({
                    author: alice,
                    grantedTo: bob,
                    scope: {
                        interface: DwnInterfaceName.Records,
                        method: DwnMethodName.Write,
                        protocol: freeForAll.protocol
                    }
                });
                const grantReply = yield dwn.processMessage(alice.did, grantMessage, { dataStream });
                expect(grantReply.status.code).to.equal(202);
                // bob attempts to use the `RecordsWrite` grant on an `MessagesQuery` message
                const { message: bobQuery } = yield TestDataGenerator.generateMessagesQuery({
                    author: bob,
                    permissionGrantId: grantMessage.recordId
                });
                const bobReply = yield dwn.processMessage(alice.did, bobQuery);
                expect(bobReply.status.code).to.equal(401);
                expect(bobReply.status.detail).to.include(DwnErrorCode.GrantAuthorizationInterfaceMismatch);
            }));
            it('rejects query of messages with mismatching method grant scopes', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // create grant that is scoped to `MessagesSubscribe` for bob scoped to the `freeForAll` protocol
                const { message: grantMessage, dataStream } = yield TestDataGenerator.generateGrantCreate({
                    author: alice,
                    grantedTo: bob,
                    scope: {
                        interface: DwnInterfaceName.Messages,
                        method: DwnMethodName.Subscribe,
                    }
                });
                const grantReply = yield dwn.processMessage(alice.did, grantMessage, { dataStream });
                expect(grantReply.status.code).to.equal(202);
                // bob attempts to use the `MessagesSubscribe` grant on an `MessagesQuery` message
                const { message: bobQuery } = yield TestDataGenerator.generateMessagesQuery({
                    author: bob,
                    permissionGrantId: grantMessage.recordId
                });
                const bobReply = yield dwn.processMessage(alice.did, bobQuery);
                expect(bobReply.status.code).to.equal(401);
                expect(bobReply.status.detail).to.include(DwnErrorCode.GrantAuthorizationMethodMismatch);
            }));
            describe('protocol filtered messages', () => {
                it('allows query of protocol filtered messages with matching protocol grant scopes', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // install protocol 1
                    const protocol1 = Object.assign(Object.assign({}, freeForAll), { published: true, protocol: 'http://protcol1' });
                    const { message: protocol1Configure } = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition: protocol1,
                    });
                    const { status: protocol1ConfigureStatus } = yield dwn.processMessage(alice.did, protocol1Configure);
                    expect(protocol1ConfigureStatus.code).to.equal(202);
                    // install protocol 2
                    const protocol2 = Object.assign(Object.assign({}, freeForAll), { published: true, protocol: 'http://protcol2' });
                    const { message: protocol2Configure } = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition: protocol2,
                    });
                    const { status: protocol2ConfigureStatus } = yield dwn.processMessage(alice.did, protocol2Configure);
                    expect(protocol2ConfigureStatus.code).to.equal(202);
                    // grant bob permission to query for protocol 1
                    const { message: grant1Message, dataStream: grant1DataStream } = yield TestDataGenerator.generateGrantCreate({
                        author: alice,
                        grantedTo: bob,
                        scope: {
                            interface: DwnInterfaceName.Messages,
                            method: DwnMethodName.Query,
                            protocol: protocol1.protocol
                        }
                    });
                    const grant1Reply = yield dwn.processMessage(alice.did, grant1Message, { dataStream: grant1DataStream });
                    expect(grant1Reply.status.code).to.equal(202);
                    // bob uses the grant to query for protocol 1 messages
                    const { message: bobQuery1 } = yield TestDataGenerator.generateMessagesQuery({
                        author: bob,
                        filters: [{ protocol: protocol1.protocol }],
                        permissionGrantId: grant1Message.recordId
                    });
                    const bobReply1 = yield dwn.processMessage(alice.did, bobQuery1);
                    expect(bobReply1.status.code).to.equal(200);
                    expect(bobReply1.entries.length).to.equal(2); // protocol1Configure, and bob's grant
                    expect(bobReply1.entries).to.have.members([
                        yield Message.getCid(protocol1Configure),
                        yield Message.getCid(grant1Message)
                    ]);
                }));
                it('rejects query of protocol filtered messages with mismatching protocol grant scopes', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // install protocol 1
                    const protocol1 = Object.assign(Object.assign({}, freeForAll), { published: true, protocol: 'http://protcol1' });
                    const { message: protocol1Configure } = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition: protocol1,
                    });
                    const { status: protocol1ConfigureStatus } = yield dwn.processMessage(alice.did, protocol1Configure);
                    expect(protocol1ConfigureStatus.code).to.equal(202);
                    // install protocol 2
                    const protocol2 = Object.assign(Object.assign({}, freeForAll), { published: true, protocol: 'http://protcol2' });
                    const { message: protocol2Configure } = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition: protocol2,
                    });
                    const { status: protocol2ConfigureStatus } = yield dwn.processMessage(alice.did, protocol2Configure);
                    expect(protocol2ConfigureStatus.code).to.equal(202);
                    // grant bob permission to query for protocol 1
                    const { message: grant1Message, dataStream: grant1DataStream } = yield TestDataGenerator.generateGrantCreate({
                        author: alice,
                        grantedTo: bob,
                        scope: {
                            interface: DwnInterfaceName.Messages,
                            method: DwnMethodName.Query,
                            protocol: protocol1.protocol
                        }
                    });
                    const grant1Reply = yield dwn.processMessage(alice.did, grant1Message, { dataStream: grant1DataStream });
                    expect(grant1Reply.status.code).to.equal(202);
                    // bob uses the grant for protocol 1 to query for protocol 2 messages
                    const { message: bobQuery1 } = yield TestDataGenerator.generateMessagesQuery({
                        author: bob,
                        filters: [{ protocol: protocol2.protocol }],
                        permissionGrantId: grant1Message.recordId
                    });
                    const bobReply1 = yield dwn.processMessage(alice.did, bobQuery1);
                    expect(bobReply1.status.code).to.equal(401);
                    expect(bobReply1.status.detail).to.include(DwnErrorCode.MessagesGrantAuthorizationMismatchedProtocol);
                    expect(bobReply1.entries).to.not.exist;
                    // bob attempts to use the grant for protocol 1 to query for messages in protocol 1 OR protocol 2 given two filters
                    // this should fail because the grant is scoped to protocol 1 only
                    const { message: bobQuery2 } = yield TestDataGenerator.generateMessagesQuery({
                        author: bob,
                        filters: [{ protocol: protocol1.protocol }, { protocol: protocol2.protocol }],
                        permissionGrantId: grant1Message.recordId
                    });
                    const bobReply2 = yield dwn.processMessage(alice.did, bobQuery2);
                    expect(bobReply2.status.code).to.equal(401);
                    expect(bobReply2.status.detail).to.include(DwnErrorCode.MessagesGrantAuthorizationMismatchedProtocol);
                    expect(bobReply2.entries).to.not.exist;
                }));
            });
        });
    });
}
//# sourceMappingURL=messages-query.spec.js.map