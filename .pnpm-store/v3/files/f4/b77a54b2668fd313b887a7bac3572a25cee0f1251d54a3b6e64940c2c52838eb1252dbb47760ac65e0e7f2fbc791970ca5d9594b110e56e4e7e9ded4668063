var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Dwn } from '../../src/dwn.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import freeForAll from '../vectors/protocol-definitions/free-for-all.json' assert { type: 'json' };
import { Jws } from '../../src/utils/jws.js';
import { Message } from '../../src/core/message.js';
import { MessagesSubscribe } from '../../src/interfaces/messages-subscribe.js';
import { MessagesSubscribeHandler } from '../../src/handlers/messages-subscribe.js';
import { Poller } from '../utils/poller.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import { DwnInterfaceName, DwnMethodName } from '../../src/index.js';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
export function testMessagesSubscribeHandler() {
    describe('MessagesSubscribe.handle()', () => {
        describe('EventStream disabled', () => {
            let didResolver;
            let messageStore;
            let dataStore;
            let resumableTaskStore;
            let eventLog;
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
                dwn = yield Dwn.create({
                    didResolver,
                    messageStore,
                    dataStore,
                    resumableTaskStore,
                    eventLog,
                });
            }));
            beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                sinon.restore(); // wipe all previous stubs/spies/mocks/fakes
                // clean up before each test rather than after so that a test does not depend on other tests to do the clean up
                yield messageStore.clear();
                yield dataStore.clear();
                yield resumableTaskStore.clear();
                yield eventLog.clear();
            }));
            after(() => __awaiter(this, void 0, void 0, function* () {
                yield dwn.close();
            }));
            it('should respond with a 501 if subscriptions are not supported', () => __awaiter(this, void 0, void 0, function* () {
                yield dwn.close(); // close the original dwn instance
                dwn = yield Dwn.create({ didResolver, messageStore, dataStore, eventLog, resumableTaskStore }); // leave out eventStream
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // attempt to subscribe
                const { message } = yield MessagesSubscribe.create({ signer: Jws.createSigner(alice) });
                const subscriptionMessageReply = yield dwn.processMessage(alice.did, message, { subscriptionHandler: (_) => { } });
                expect(subscriptionMessageReply.status.code).to.equal(501, subscriptionMessageReply.status.detail);
                expect(subscriptionMessageReply.status.detail).to.include(DwnErrorCode.MessagesSubscribeEventStreamUnimplemented);
            }));
        });
        describe('EventStream enabled', () => {
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
                dwn = yield Dwn.create({
                    didResolver,
                    messageStore,
                    dataStore,
                    resumableTaskStore,
                    eventLog,
                    eventStream,
                });
            }));
            beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                sinon.restore(); // wipe all previous stubs/spies/mocks/fakes
                // clean up before each test rather than after so that a test does not depend on other tests to do the clean up
                yield messageStore.clear();
                yield dataStore.clear();
                yield resumableTaskStore.clear();
                yield eventLog.clear();
            }));
            after(() => __awaiter(this, void 0, void 0, function* () {
                yield dwn.close();
            }));
            it('returns a 400 if message is invalid', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateMessagesSubscribe({ author: alice });
                // add an invalid property to the descriptor
                message['descriptor']['invalid'] = 'invalid';
                const messagesSubscribeHandler = new MessagesSubscribeHandler(didResolver, messageStore, eventStream);
                const reply = yield messagesSubscribeHandler.handle({ tenant: alice.did, message, subscriptionHandler: (_) => { } });
                expect(reply.status.code).to.equal(400);
            }));
            it('should allow tenant to subscribe their own event stream', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // set up a promise to read later that captures the emitted messageCid
                let handler;
                const messageSubscriptionPromise = new Promise((resolve) => {
                    handler = (event) => __awaiter(this, void 0, void 0, function* () {
                        const { message } = event;
                        const messageCid = yield Message.getCid(message);
                        resolve(messageCid);
                    });
                });
                // testing MessagesSubscribe
                const messagesSubscribe = yield MessagesSubscribe.create({
                    signer: Jws.createSigner(alice),
                });
                const subscriptionReply = yield dwn.processMessage(alice.did, messagesSubscribe.message, { subscriptionHandler: handler });
                expect(subscriptionReply.status.code).to.equal(200, subscriptionReply.status.detail);
                expect(subscriptionReply.subscription).to.not.be.undefined;
                const messageWrite = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const writeReply = yield dwn.processMessage(alice.did, messageWrite.message, { dataStream: messageWrite.dataStream });
                expect(writeReply.status.code).to.equal(202);
                const messageCid = yield Message.getCid(messageWrite.message);
                // control: ensure that the event exists
                const { events } = yield eventLog.getEvents(alice.did);
                expect(events.length).to.equal(1);
                expect(events[0]).to.equal(messageCid);
                // await the event
                yield expect(messageSubscriptionPromise).to.eventually.equal(messageCid);
            }));
            it('should not allow non-tenant to subscribe to an event stream they are not authorized for', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // test anonymous request
                const anonymousSubscription = yield TestDataGenerator.generateMessagesSubscribe();
                delete anonymousSubscription.message.authorization;
                const anonymousReply = yield dwn.processMessage(alice.did, anonymousSubscription.message);
                expect(anonymousReply.status.code).to.equal(400);
                expect(anonymousReply.status.detail).to.include(`MessagesSubscribe: must have required property 'authorization'`);
                expect(anonymousReply.subscription).to.be.undefined;
                // testing MessagesSubscribe
                const messagesSubscribe = yield MessagesSubscribe.create({
                    signer: Jws.createSigner(bob),
                });
                const subscriptionReply = yield dwn.processMessage(alice.did, messagesSubscribe.message);
                expect(subscriptionReply.status.code).to.equal(401);
                expect(subscriptionReply.subscription).to.be.undefined;
            }));
            describe('grant based subscribes', () => {
                it('allows subscribe of messages with matching interface and method grant scope', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice gives Bob permission to subscribe for all of her messages
                    // Alice writes various messages
                    // When Bob subscribes for messages, he should receive updates to all of Alice's messages
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // create grant that is scoped to `MessagesSubscribe` for bob
                    const { message: grantMessage, dataStream } = yield TestDataGenerator.generateGrantCreate({
                        author: alice,
                        grantedTo: bob,
                        scope: {
                            interface: DwnInterfaceName.Messages,
                            method: DwnMethodName.Subscribe
                        }
                    });
                    const grantReply = yield dwn.processMessage(alice.did, grantMessage, { dataStream });
                    expect(grantReply.status.code).to.equal(202);
                    // create a handler to capture the emitted messageCids
                    const messageCids = [];
                    const handler = (event) => __awaiter(this, void 0, void 0, function* () {
                        const { message } = event;
                        const messageCid = yield Message.getCid(message);
                        messageCids.push(messageCid);
                    });
                    // subscribe to messages
                    const { message: subscribeMessage } = yield TestDataGenerator.generateMessagesSubscribe({
                        author: bob,
                        permissionGrantId: grantMessage.recordId,
                    });
                    const subscribeReply = yield dwn.processMessage(alice.did, subscribeMessage, { subscriptionHandler: handler });
                    expect(subscribeReply.status.code).to.equal(200);
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
                    // ensure that all messages have been received
                    yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        expect(messageCids.length).to.equal(4);
                        expect(messageCids).to.have.members([
                            yield Message.getCid(freeForAllConfigure),
                            yield Message.getCid(protocolMessage),
                            yield Message.getCid(recordMessage),
                            yield Message.getCid(randomMessage),
                        ]);
                    }));
                }));
                it('rejects subscribe of messages with mismatching interface grant scope', () => __awaiter(this, void 0, void 0, function* () {
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
                    // bob attempts to use the `RecordsWrite` grant on an `MessagesSubscribe` message
                    const { message: bobSubscribe } = yield TestDataGenerator.generateMessagesSubscribe({
                        author: bob,
                        permissionGrantId: grantMessage.recordId
                    });
                    const bobReply = yield dwn.processMessage(alice.did, bobSubscribe);
                    expect(bobReply.status.code).to.equal(401);
                    expect(bobReply.status.detail).to.include(DwnErrorCode.GrantAuthorizationInterfaceMismatch);
                }));
                xit('rejects subscribe of messages with mismatching method grant scopes', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // create grant that is scoped to `MessagesQuery` for bob scoped to the `freeForAll` protocol
                    const { recordsWrite: grantWrite, dataStream } = yield TestDataGenerator.generateGrantCreate({
                        author: alice,
                        grantedTo: bob,
                        scope: {
                            interface: DwnInterfaceName.Messages,
                            method: DwnMethodName.Query,
                        }
                    });
                    const grantWriteReply = yield dwn.processMessage(alice.did, grantWrite.message, { dataStream });
                    expect(grantWriteReply.status.code).to.equal(204);
                    // bob attempts to use the `MessagesQuery` grant on an `MessagesSubscribe` message
                    const { message: bobSubscribe } = yield TestDataGenerator.generateMessagesSubscribe({
                        author: bob,
                        permissionGrantId: grantWrite.message.recordId
                    });
                    const bobReply = yield dwn.processMessage(alice.did, bobSubscribe);
                    expect(bobReply.status.code).to.equal(401);
                    expect(bobReply.status.detail).to.include(DwnErrorCode.GrantAuthorizationMethodMismatch);
                }));
                describe('protocol filtered messages', () => {
                    it('allows subscribe of protocol filtered messages with matching protocol grant scopes', () => __awaiter(this, void 0, void 0, function* () {
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
                        // grant bob permission to subscribe for protocol 1
                        const { message: grant1Message, dataStream: grant1DataStream } = yield TestDataGenerator.generateGrantCreate({
                            author: alice,
                            grantedTo: bob,
                            scope: {
                                interface: DwnInterfaceName.Messages,
                                method: DwnMethodName.Subscribe,
                                protocol: protocol1.protocol
                            }
                        });
                        const grant1Reply = yield dwn.processMessage(alice.did, grant1Message, { dataStream: grant1DataStream });
                        expect(grant1Reply.status.code).to.equal(202);
                        // bob uses the grant to subscribe to protocol 1 messages
                        const proto1MessageCids = [];
                        const proto1Handler = (event) => __awaiter(this, void 0, void 0, function* () {
                            const { message } = event;
                            const messageCid = yield Message.getCid(message);
                            proto1MessageCids.push(messageCid);
                        });
                        const { message: bobSubscribe1 } = yield TestDataGenerator.generateMessagesSubscribe({
                            author: bob,
                            filters: [{ protocol: protocol1.protocol }],
                            permissionGrantId: grant1Message.recordId
                        });
                        const bobReply1 = yield dwn.processMessage(alice.did, bobSubscribe1, { subscriptionHandler: proto1Handler });
                        expect(bobReply1.status.code).to.equal(200);
                        const allMessages = [];
                        const allHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                            const { message } = event;
                            const messageCid = yield Message.getCid(message);
                            allMessages.push(messageCid);
                        });
                        const { message: allSubscribe } = yield TestDataGenerator.generateMessagesSubscribe({
                            author: alice,
                        });
                        const allReply = yield dwn.processMessage(alice.did, allSubscribe, { subscriptionHandler: allHandler });
                        expect(allReply.status.code).to.equal(200);
                        // alice writes a message to protocol 1
                        const { message: proto1Message, dataStream: proto1DataStream } = yield TestDataGenerator.generateRecordsWrite({
                            protocol: protocol1.protocol,
                            protocolPath: 'post',
                            schema: protocol1.types.post.schema,
                            author: alice
                        });
                        const proto1Reply = yield dwn.processMessage(alice.did, proto1Message, { dataStream: proto1DataStream });
                        expect(proto1Reply.status.code).to.equal(202);
                        // alice writes a message to protocol 2
                        const { message: proto2Message, dataStream: proto2DataStream } = yield TestDataGenerator.generateRecordsWrite({
                            protocol: protocol2.protocol,
                            protocolPath: 'post',
                            schema: protocol2.types.post.schema,
                            author: alice
                        });
                        const proto2Reply = yield dwn.processMessage(alice.did, proto2Message, { dataStream: proto2DataStream });
                        expect(proto2Reply.status.code).to.equal(202);
                        // ensure that all messages have been received as a control
                        yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            expect(allMessages.length).to.equal(2);
                            expect(allMessages).to.have.members([
                                yield Message.getCid(proto1Message),
                                yield Message.getCid(proto2Message)
                            ]);
                            // proto 1 messages should only have one message
                            expect(proto1MessageCids.length).to.equal(1);
                            expect(proto1MessageCids).to.have.members([yield Message.getCid(proto1Message)]);
                        }));
                    }));
                    it('rejects subscribe of protocol filtered messages with mismatching protocol grant scopes', () => __awaiter(this, void 0, void 0, function* () {
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
                        // grant bob permission to subscribe for protocol 1
                        const { message: grant1Message, dataStream: grant1DataStream } = yield TestDataGenerator.generateGrantCreate({
                            author: alice,
                            grantedTo: bob,
                            scope: {
                                interface: DwnInterfaceName.Messages,
                                method: DwnMethodName.Subscribe,
                                protocol: protocol1.protocol
                            }
                        });
                        const grant1Reply = yield dwn.processMessage(alice.did, grant1Message, { dataStream: grant1DataStream });
                        expect(grant1Reply.status.code).to.equal(202);
                        // bob uses the grant for protocol 1 to subscribe for protocol 2 messages
                        const { message: bobSubscribe1 } = yield TestDataGenerator.generateMessagesSubscribe({
                            author: bob,
                            filters: [{ protocol: protocol2.protocol }],
                            permissionGrantId: grant1Message.recordId
                        });
                        const bobReply1 = yield dwn.processMessage(alice.did, bobSubscribe1);
                        expect(bobReply1.status.code).to.equal(401);
                        expect(bobReply1.status.detail).to.include(DwnErrorCode.MessagesGrantAuthorizationMismatchedProtocol);
                        expect(bobReply1.subscription).to.not.exist;
                        // bob attempts to use the grant for protocol 1 to subscribe to messages in protocol 1 OR protocol 2 given two filters
                        // this should fail because the grant is scoped to protocol 1 only
                        const { message: bobSubscribe2 } = yield TestDataGenerator.generateMessagesSubscribe({
                            author: bob,
                            filters: [{ protocol: protocol1.protocol }, { protocol: protocol2.protocol }],
                            permissionGrantId: grant1Message.recordId
                        });
                        const bobReply2 = yield dwn.processMessage(alice.did, bobSubscribe2);
                        expect(bobReply2.status.code).to.equal(401);
                        expect(bobReply2.status.detail).to.include(DwnErrorCode.MessagesGrantAuthorizationMismatchedProtocol);
                        expect(bobReply2.subscription).to.not.exist;
                    }));
                });
            });
        });
    });
}
//# sourceMappingURL=messages-subscribe.spec.js.map