var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import friendRoleProtocolDefinition from '../vectors/protocol-definitions/friend-role.json' assert { type: 'json' };
import threadRoleProtocolDefinition from '../vectors/protocol-definitions/thread-role.json' assert { type: 'json' };
import { Jws } from '../../src/utils/jws.js';
import { Message } from '../../src/core/message.js';
import { Poller } from '../utils/poller.js';
import { RecordsSubscribe } from '../../src/interfaces/records-subscribe.js';
import { RecordsSubscribeHandler } from '../../src/handlers/records-subscribe.js';
import { stubInterface } from 'ts-sinon';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { TestStubGenerator } from '../utils/test-stub-generator.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import { Dwn, DwnErrorCode, DwnMethodName, Time } from '../../src/index.js';
chai.use(chaiAsPromised);
export function testRecordsSubscribeHandler() {
    describe('RecordsSubscribeHandler.handle()', () => {
        describe('EventStream disabled', () => {
            let didResolver;
            let messageStore;
            let resumableTaskStore;
            let dataStore;
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
                const { message } = yield TestDataGenerator.generateRecordsSubscribe({
                    author: alice,
                });
                const subscriptionMessageReply = yield dwn.processMessage(alice.did, message, { subscriptionHandler: (_) => { } });
                expect(subscriptionMessageReply.status.code).to.equal(501, subscriptionMessageReply.status.detail);
                expect(subscriptionMessageReply.status.detail).to.include(DwnErrorCode.RecordsSubscribeEventStreamUnimplemented);
            }));
        });
        describe('functional tests', () => {
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
            it('should return a subscription object', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const recordsSubscribe = yield TestDataGenerator.generateRecordsSubscribe({
                    author: alice,
                    filter: { schema: 'some-schema' },
                });
                // Send records subscribe message
                const reply = yield dwn.processMessage(alice.did, recordsSubscribe.message, { subscriptionHandler: () => { } });
                expect(reply.status.code).to.equal(200);
                expect(reply.subscription).to.exist;
            }));
            it('should return 400 if protocol is not normalized', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // subscribe for non-normalized protocol
                const recordsSubscribe = yield TestDataGenerator.generateRecordsSubscribe({
                    author: alice,
                    filter: { protocol: 'example.com/' },
                });
                // overwrite protocol because #create auto-normalizes protocol
                recordsSubscribe.message.descriptor.filter.protocol = 'example.com/';
                // Re-create auth because we altered the descriptor after signing
                recordsSubscribe.message.authorization = yield Message.createAuthorization({
                    descriptor: recordsSubscribe.message.descriptor,
                    signer: Jws.createSigner(alice)
                });
                // Send records subscribe message
                const reply = yield dwn.processMessage(alice.did, recordsSubscribe.message);
                expect(reply.status.code).to.equal(400);
                expect(reply.status.detail).to.contain(DwnErrorCode.UrlProtocolNotNormalized);
            }));
            it('should return 400 if schema is not normalized', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // subscribe for non-normalized schema
                const recordsSubscribe = yield TestDataGenerator.generateRecordsSubscribe({
                    author: alice,
                    filter: { schema: 'example.com/' },
                });
                // overwrite schema because #create auto-normalizes schema
                recordsSubscribe.message.descriptor.filter.schema = 'example.com/';
                // Re-create auth because we altered the descriptor after signing
                recordsSubscribe.message.authorization = yield Message.createAuthorization({
                    descriptor: recordsSubscribe.message.descriptor,
                    signer: Jws.createSigner(alice)
                });
                // Send records subscribe message
                const reply = yield dwn.processMessage(alice.did, recordsSubscribe.message);
                expect(reply.status.code).to.equal(400);
                expect(reply.status.detail).to.contain(DwnErrorCode.UrlSchemaNotNormalized);
            }));
            it('should return 400 if published is set to false and a datePublished range is provided', () => __awaiter(this, void 0, void 0, function* () {
                const fromDatePublished = Time.getCurrentTimestamp();
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // set to true so create does not fail
                const recordSubscribe = yield TestDataGenerator.generateRecordsSubscribe({
                    author: alice,
                    filter: { datePublished: { from: fromDatePublished }, published: true }
                });
                // set to false
                recordSubscribe.message.descriptor.filter.published = false;
                const subscribeResponse = yield dwn.processMessage(alice.did, recordSubscribe.message);
                expect(subscribeResponse.status.code).to.equal(400);
                expect(subscribeResponse.status.detail).to.contain('descriptor/filter/published: must be equal to one of the allowed values');
            }));
            it('should return 401 for anonymous subscriptions that filter explicitly for unpublished records', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // create an unpublished record
                const draftWrite = yield TestDataGenerator.generateRecordsWrite({ author: alice, schema: 'post' });
                const draftWriteReply = yield dwn.processMessage(alice.did, draftWrite.message, { dataStream: draftWrite.dataStream });
                expect(draftWriteReply.status.code).to.equal(202);
                // validate that alice can subscribe
                const unpublishedPostSubscribe = yield TestDataGenerator.generateRecordsSubscribe({ author: alice, filter: { schema: 'post', published: false } });
                const unpublishedPostReply = yield dwn.processMessage(alice.did, unpublishedPostSubscribe.message, { subscriptionHandler: () => { } });
                expect(unpublishedPostReply.status.code).to.equal(200);
                expect(unpublishedPostReply.subscription).to.exist;
                // anonymous subscribe for unpublished records
                const unpublishedAnonymous = yield RecordsSubscribe.create({ filter: { schema: 'post', published: false } });
                const anonymousPostReply = yield dwn.processMessage(alice.did, unpublishedAnonymous.message);
                expect(anonymousPostReply.status.code).to.equal(401);
                expect(anonymousPostReply.status.detail).contains('Missing JWS');
                expect(anonymousPostReply.subscription).to.not.exist;
            }));
            it('should return 401 if signature check fails', () => __awaiter(this, void 0, void 0, function* () {
                const { author, message } = yield TestDataGenerator.generateRecordsSubscribe();
                const tenant = author.did;
                // setting up a stub did resolver & message store
                // intentionally not supplying the public key so a different public key is generated to simulate invalid signature
                const mismatchingPersona = yield TestDataGenerator.generatePersona({ did: author.did, keyId: author.keyId });
                const didResolver = TestStubGenerator.createDidResolverStub(mismatchingPersona);
                const messageStore = stubInterface();
                const eventStream = stubInterface();
                const recordsSubscribeHandler = new RecordsSubscribeHandler(didResolver, messageStore, eventStream);
                const reply = yield recordsSubscribeHandler.handle({ tenant, message, subscriptionHandler: () => { } });
                expect(reply.status.code).to.equal(401);
            }));
            it('should return 400 if fail parsing the message', () => __awaiter(this, void 0, void 0, function* () {
                const { author, message } = yield TestDataGenerator.generateRecordsSubscribe();
                const tenant = author.did;
                // setting up a stub method resolver & message store
                const didResolver = TestStubGenerator.createDidResolverStub(author);
                const messageStore = stubInterface();
                const eventStream = stubInterface();
                const recordsSubscribeHandler = new RecordsSubscribeHandler(didResolver, messageStore, eventStream);
                // stub the `parse()` function to throw an error
                sinon.stub(RecordsSubscribe, 'parse').throws('anyError');
                const reply = yield recordsSubscribeHandler.handle({ tenant, message, subscriptionHandler: () => { } });
                expect(reply.status.code).to.equal(400);
            }));
            describe('protocol based subscriptions', () => {
                it('does not try protocol authorization if protocolRole is not invoked', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario:
                    //           Bob and Carol subscribe to a chat protocol without invoking a protocolRole,
                    //           they should receive chat messages addressed to them, respectively.
                    //           Alice creates a thread and writes some chat messages to Bob and Carol.
                    //           Bob receives only the chat messages addressed to him, Carol receives only the chat messages addressed to her.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const carol = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = threadRoleProtocolDefinition;
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    const bobMessages = [];
                    const handleForBob = (event) => __awaiter(this, void 0, void 0, function* () {
                        const { message } = event;
                        const messageCid = yield Message.getCid(message);
                        bobMessages.push(messageCid);
                    });
                    const bobSubscription = yield TestDataGenerator.generateRecordsSubscribe({
                        author: bob,
                        filter: {
                            published: false,
                            protocol: protocolDefinition.protocol,
                        }
                    });
                    const subscriptionReply = yield dwn.processMessage(alice.did, bobSubscription.message, { subscriptionHandler: handleForBob });
                    expect(subscriptionReply.status.code).to.equal(200);
                    expect(subscriptionReply.subscription).to.exist;
                    const carolMessages = [];
                    const handleForCarol = (event) => __awaiter(this, void 0, void 0, function* () {
                        const { message } = event;
                        const messageCid = yield Message.getCid(message);
                        carolMessages.push(messageCid);
                    });
                    const carolSubscription = yield TestDataGenerator.generateRecordsSubscribe({
                        author: carol,
                        filter: {
                            published: false,
                            protocol: protocolDefinition.protocol,
                        }
                    });
                    const carolSubscriptionReply = yield dwn.processMessage(alice.did, carolSubscription.message, { subscriptionHandler: handleForCarol });
                    expect(carolSubscriptionReply.status.code).to.equal(200);
                    expect(carolSubscriptionReply.subscription).to.exist;
                    // Alice writes a 'thread' record
                    const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread',
                    });
                    const threadRoleReply = yield dwn.processMessage(alice.did, threadRecord.message, { dataStream: threadRecord.dataStream });
                    expect(threadRoleReply.status.code).to.equal(202);
                    // Alice writes one 'chat' record addressed to Bob
                    const chatRecordForBob = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        recipient: bob.did,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread/chat',
                        published: false,
                        parentContextId: threadRecord.message.contextId,
                        data: new TextEncoder().encode('Bob can read this cuz he is my friend'),
                    });
                    const chatRecordForBobReply = yield dwn.processMessage(alice.did, chatRecordForBob.message, { dataStream: chatRecordForBob.dataStream });
                    expect(chatRecordForBobReply.status.code).to.equal(202);
                    const chatRecordForBobCid = yield Message.getCid(chatRecordForBob.message);
                    // Alice writes two 'chat' records addressed to Carol
                    const chatRecordForCarol1 = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        recipient: carol.did,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread/chat',
                        published: false,
                        parentContextId: threadRecord.message.contextId,
                        data: new TextEncoder().encode('Bob cannot read this'),
                    });
                    const chatRecordForCarol1Reply = yield dwn.processMessage(alice.did, chatRecordForCarol1.message, { dataStream: chatRecordForCarol1.dataStream });
                    expect(chatRecordForCarol1Reply.status.code).to.equal(202);
                    const chatRecordForCarol1Cid = yield Message.getCid(chatRecordForCarol1.message);
                    const chatRecordForCarol2 = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        recipient: carol.did,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread/chat',
                        published: false,
                        parentContextId: threadRecord.message.contextId,
                        data: new TextEncoder().encode('Bob cannot read this either'),
                    });
                    const chatRecordForCarol2Reply = yield dwn.processMessage(alice.did, chatRecordForCarol2.message, { dataStream: chatRecordForCarol2.dataStream });
                    expect(chatRecordForCarol2Reply.status.code).to.equal(202);
                    const chatRecordForCarol2Cid = yield Message.getCid(chatRecordForCarol2.message);
                    yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        expect(bobMessages.length).to.equal(1);
                        expect(bobMessages).to.have.members([chatRecordForBobCid]);
                    }));
                    yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        expect(carolMessages.length).to.equal(2);
                        expect(carolMessages).to.have.members([chatRecordForCarol1Cid, chatRecordForCarol2Cid]);
                    }));
                }));
                it('allows root-level role authorized subscriptions', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice creates a thread and writes some chat messages writes a chat message. Bob invokes his
                    //           thread member role in order to subscribe to the chat messages.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const carol = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = friendRoleProtocolDefinition;
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    const filter = {
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'chat'
                    };
                    const noRoleRecords = new Set();
                    const addNoRole = (event) => __awaiter(this, void 0, void 0, function* () {
                        const { message } = event;
                        if (message.descriptor.method === DwnMethodName.Write) {
                            const recordsWriteMessage = message;
                            noRoleRecords.add(recordsWriteMessage.recordId);
                        }
                        else {
                            noRoleRecords.delete(message.descriptor.recordId);
                        }
                    });
                    // subscribe without role, expect no messages
                    const noRoleSubscription = yield TestDataGenerator.generateRecordsSubscribe({
                        author: bob,
                        filter
                    });
                    const subscriptionReply = yield dwn.processMessage(alice.did, noRoleSubscription.message, { subscriptionHandler: addNoRole });
                    expect(subscriptionReply.status.code).to.equal(200);
                    expect(subscriptionReply.subscription).to.exist;
                    // Alice writes a 'friend' root-level role record with Bob as recipient
                    const friendRoleRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        recipient: bob.did,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'friend',
                        data: new TextEncoder().encode('Bob is my friend'),
                    });
                    const friendRoleReply = yield dwn.processMessage(alice.did, friendRoleRecord.message, { dataStream: friendRoleRecord.dataStream });
                    expect(friendRoleReply.status.code).to.equal(202);
                    const recordIds = new Set();
                    const addRecord = (event) => __awaiter(this, void 0, void 0, function* () {
                        const { message } = event;
                        if (message.descriptor.method === DwnMethodName.Write) {
                            const recordsWriteMessage = message;
                            recordIds.add(recordsWriteMessage.recordId);
                        }
                        else {
                            recordIds.delete(message.descriptor.recordId);
                        }
                    });
                    // subscribe with friend role
                    const bobSubscriptionWithRole = yield TestDataGenerator.generateRecordsSubscribe({
                        filter,
                        author: bob,
                        protocolRole: 'friend',
                    });
                    const subscriptionWithRoleReply = yield dwn.processMessage(alice.did, bobSubscriptionWithRole.message, { subscriptionHandler: addRecord });
                    expect(subscriptionWithRoleReply.status.code).to.equal(200);
                    expect(subscriptionWithRoleReply.subscription).to.exist;
                    // Create one chat message for Bob as a control to show up in the `noRoleRecords` array
                    const chatRecordForBob = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        recipient: bob.did,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'chat',
                        published: false,
                        data: new TextEncoder().encode('Bob can read this cuz he is my friend'),
                    });
                    const chatRecordForBobReply = yield dwn.processMessage(alice.did, chatRecordForBob.message, { dataStream: chatRecordForBob.dataStream });
                    expect(chatRecordForBobReply.status.code).to.equal(202);
                    // Alice writes three more 'chat' records for carol, Bob's friend role should allow him to see these messages.
                    const chatRecordIds = [];
                    for (let i = 0; i < 3; i++) {
                        const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: carol.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'chat',
                            published: false,
                            data: new TextEncoder().encode('Bob can read this cuz he is my friend'),
                        });
                        const chatReply = yield dwn.processMessage(alice.did, chatRecord.message, { dataStream: chatRecord.dataStream });
                        expect(chatReply.status.code).to.equal(202);
                        chatRecordIds.push(chatRecord.message.recordId);
                    }
                    // there should only be the control message for bob in the subscription without a friend role.
                    yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        expect(noRoleRecords.size).to.equal(1);
                        expect([...noRoleRecords]).to.have.members([chatRecordForBob.message.recordId]);
                    }));
                    // All chats should be in the subscription with the friend role.
                    yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        expect(recordIds.size).to.equal(4);
                        expect([...recordIds]).to.have.members([chatRecordForBob.message.recordId, ...chatRecordIds]);
                    }));
                    // TODO: https://github.com/TBD54566975/dwn-sdk-js/issues/759
                    //      When `RecordsSubscribeHandler` builds up the matchFilters there are no matching filters for a delete within a context
                    //      so the delete event is not being captured by the subscription handler. This is likely due to some of the filters including
                    //      `published: false` which is a mutable property and not included with the delete event
                    //
                    //      When the issue is resolved, uncomment the code below
                    // Delete a chat message for Bob
                    // const chatForBobDelete = await TestDataGenerator.generateRecordsDelete({
                    //   author       : alice,
                    //   recordId     : chatRecordForBob.message.recordId,
                    // });
                    // const chatForBobDeleteReply = await dwn.processMessage(alice.did, chatForBobDelete.message);
                    // expect(chatForBobDeleteReply.status.code).to.equal(202);
                    // // Delete one of the other chat messages
                    // const chatForCarolDelete = await TestDataGenerator.generateRecordsDelete({
                    //   author       : alice,
                    //   recordId     : chatRecordIds[0],
                    // });
                    // const chatForCarolDeleteReply = await dwn.processMessage(alice.did, chatForCarolDelete.message);
                    // expect(chatForCarolDeleteReply.status.code).to.equal(202);
                    // await Poller.pollUntilSuccessOrTimeout(async () => {
                    //   expect(noRoleRecords.size).to.equal(0); // chat record was removed from the set
                    //   expect(recordIds.size).to.equal(2); // both chat records were removed from the set
                    //   expect([ ...recordIds ]).to.have.members([ ...chatRecordIds.slice(1) ]); // only the last two chat records remain
                    // });
                }));
                it('can authorize subscriptions using a context role', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice writes some chat messages.
                    //           Bob, having a thread/participant record, can subscribe to the chat.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = threadRoleProtocolDefinition;
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Alice writes a 'thread' record
                    const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread',
                    });
                    const threadRoleReply = yield dwn.processMessage(alice.did, threadRecord.message, { dataStream: threadRecord.dataStream });
                    expect(threadRoleReply.status.code).to.equal(202);
                    const filter = {
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread/chat',
                        contextId: threadRecord.message.contextId,
                    };
                    const noRoleRecords = [];
                    const addNoRole = (event) => __awaiter(this, void 0, void 0, function* () {
                        const { message } = event;
                        if (message.descriptor.method === DwnMethodName.Write) {
                            const recordsWriteMessage = message;
                            noRoleRecords.push(recordsWriteMessage.recordId);
                        }
                    });
                    // subscribe without role, expect no messages
                    const noRoleSubscription = yield TestDataGenerator.generateRecordsSubscribe({
                        author: bob,
                        filter
                    });
                    const subscriptionReply = yield dwn.processMessage(alice.did, noRoleSubscription.message, { subscriptionHandler: addNoRole });
                    expect(subscriptionReply.status.code).to.equal(200);
                    expect(subscriptionReply.subscription).to.exist;
                    // Alice writes a 'participant' role record with Bob as recipient
                    const participantRoleRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        recipient: bob.did,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread/participant',
                        parentContextId: threadRecord.message.contextId,
                        data: new TextEncoder().encode('Bob is my friend'),
                    });
                    const participantRoleReply = yield dwn.processMessage(alice.did, participantRoleRecord.message, { dataStream: participantRoleRecord.dataStream });
                    expect(participantRoleReply.status.code).to.equal(202);
                    const recordIds = [];
                    const addRecord = (event) => __awaiter(this, void 0, void 0, function* () {
                        const { message } = event;
                        if (message.descriptor.method === DwnMethodName.Write) {
                            const recordsWriteMessage = message;
                            recordIds.push(recordsWriteMessage.recordId);
                        }
                    });
                    // subscribe with the participant role
                    const bobSubscriptionWithRole = yield TestDataGenerator.generateRecordsSubscribe({
                        filter,
                        author: bob,
                        protocolRole: 'thread/participant',
                    });
                    const subscriptionWithRoleReply = yield dwn.processMessage(alice.did, bobSubscriptionWithRole.message, { subscriptionHandler: addRecord });
                    expect(subscriptionWithRoleReply.status.code).to.equal(200);
                    expect(subscriptionWithRoleReply.subscription).to.exist;
                    // Alice writes three 'chat' records
                    const chatRecordIds = [];
                    for (let i = 0; i < 3; i++) {
                        const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: alice.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread/chat',
                            published: false,
                            parentContextId: threadRecord.message.contextId,
                            data: new TextEncoder().encode('Bob can read this cuz he is my friend'),
                        });
                        const chatReply = yield dwn.processMessage(alice.did, chatRecord.message, { dataStream: chatRecord.dataStream });
                        expect(chatReply.status.code).to.equal(202);
                        chatRecordIds.push(chatRecord.message.recordId);
                    }
                    yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        // should have all chat messages.
                        expect(recordIds).to.have.members(chatRecordIds);
                        // there should not be any messages in the subscription without a participant role.
                        expect(noRoleRecords.length).to.equal(0);
                    }));
                }));
                it('does not execute protocol subscriptions where protocolPath is missing from the filter', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice assigns Bob a friend role and writes some chat messages. Bob invokes his role to subscribe those messages,
                    //           but his subscription filter does not include protocolPath.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = friendRoleProtocolDefinition;
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Alice writes a 'friend' root-level role record with Bob as recipient
                    const friendRoleRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        recipient: bob.did,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'friend',
                        data: new TextEncoder().encode('Bob is my friend'),
                    });
                    const friendRoleReply = yield dwn.processMessage(alice.did, friendRoleRecord.message, { dataStream: friendRoleRecord.dataStream });
                    expect(friendRoleReply.status.code).to.equal(202);
                    // Bob invokes his friendRole to subscribe but does not have `protocolPath` in the filter
                    const chatSubscribe = yield TestDataGenerator.generateRecordsSubscribe({
                        author: bob,
                        filter: {
                            protocol: protocolDefinition.protocol,
                            // protocolPath deliberately omitted
                        },
                        protocolRole: 'friend',
                    });
                    const chatSubscribeReply = yield dwn.processMessage(alice.did, chatSubscribe.message);
                    expect(chatSubscribeReply.status.code).to.equal(400);
                    expect(chatSubscribeReply.status.detail).to.contain(DwnErrorCode.RecordsSubscribeFilterMissingRequiredProperties);
                    expect(chatSubscribeReply.subscription).to.not.exist;
                }));
                it('does not execute context role authorized subscriptions where contextId is missing from the filter', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice gives Bob a role allowing him to access a particular chat thread.
                    //           But Bob's filter does not contain a contextId so the subscription fails.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = threadRoleProtocolDefinition;
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Alice writes a 'thread' record
                    const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread',
                    });
                    const threadRoleReply = yield dwn.processMessage(alice.did, threadRecord.message, { dataStream: threadRecord.dataStream });
                    expect(threadRoleReply.status.code).to.equal(202);
                    // Alice writes a 'friend' root-level role record with Bob as recipient
                    const participantRoleRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        recipient: bob.did,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread/participant',
                        parentContextId: threadRecord.message.contextId,
                        data: new TextEncoder().encode('Bob is my friend'),
                    });
                    const participantRoleReply = yield dwn.processMessage(alice.did, participantRoleRecord.message, { dataStream: participantRoleRecord.dataStream });
                    expect(participantRoleReply.status.code).to.equal(202);
                    // Bob invokes his thread participant role to subscribe but omits the contextId
                    const chatSubscribe = yield TestDataGenerator.generateRecordsSubscribe({
                        author: bob,
                        filter: {
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread/chat',
                            // contextId deliberately omitted
                        },
                        protocolRole: 'thread/participant',
                    });
                    const chatSubscribeReply = yield dwn.processMessage(alice.did, chatSubscribe.message);
                    expect(chatSubscribeReply.status.code).to.eq(401);
                    expect(chatSubscribeReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationMissingContextId);
                    expect(chatSubscribeReply.subscription).to.not.exist;
                }));
                it('rejects role authorized subscriptions if the request author does not have a matching root-level role', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice installs a chat protocol.
                    // Bob invokes a root-level role within that protocol to subscribe but fails because he does not actually have a role.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = friendRoleProtocolDefinition;
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Bob invokes a friendRole he does not have to subscribe to the records
                    const chatSubscribe = yield TestDataGenerator.generateRecordsSubscribe({
                        author: bob,
                        filter: {
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'chat',
                        },
                        protocolRole: 'friend',
                    });
                    const chatSubscribeReply = yield dwn.processMessage(alice.did, chatSubscribe.message);
                    expect(chatSubscribeReply.status.code).to.eq(401);
                    expect(chatSubscribeReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationMatchingRoleRecordNotFound);
                    expect(chatSubscribeReply.subscription).to.not.exist;
                }));
                it('rejects role authorized subscriptions where the subscription author does not have a matching context role', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = threadRoleProtocolDefinition;
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Alice writes a 'thread' record
                    const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'thread',
                    });
                    const threadRoleReply = yield dwn.processMessage(alice.did, threadRecord.message, { dataStream: threadRecord.dataStream });
                    expect(threadRoleReply.status.code).to.equal(202);
                    // Bob invokes his a `thread/participant` role which he does not have to subscribe to the records
                    const chatSubscribe = yield TestDataGenerator.generateRecordsSubscribe({
                        author: bob,
                        filter: {
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread/chat',
                            contextId: threadRecord.message.contextId,
                        },
                        protocolRole: 'thread/participant',
                    });
                    const chatSubscribeReply = yield dwn.processMessage(alice.did, chatSubscribe.message);
                    expect(chatSubscribeReply.status.code).to.eq(401);
                    expect(chatSubscribeReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationMatchingRoleRecordNotFound);
                    expect(chatSubscribeReply.subscription).to.not.exist;
                }));
            });
        });
    });
}
//# sourceMappingURL=records-subscribe.spec.js.map