var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import freeForAll from '../vectors/protocol-definitions/free-for-all.json' assert { type: 'json' };
import threadProtocol from '../vectors/protocol-definitions/thread-role.json' assert { type: 'json' };
import { Poller } from '../utils/poller.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DataStream, Dwn, DwnInterfaceName, DwnMethodName, Jws, Message, PermissionGrant, PermissionsProtocol, Time } from '../../src/index.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import { expect } from 'chai';
// NOTE: We use `Poller.pollUntilSuccessOrTimeout` to poll for the expected results.
// In some cases, the EventStream is a coordinated pub/sub system and the message events are emitted over the network
// this means that the messages are not processed immediately and we need to wait for the messages to be processed
// before we can assert the results. The `pollUntilSuccessOrTimeout` function is a utility function that will poll until the expected results are met.
// It is also important to note that in some cases where we are testing a negative case (the message not arriving at the subscriber)
// we add an alternate subscription to await results within to give the EventStream ample time to process the message.
// Additionally in some of these cases the order in which messages are sent to be processed or checked may matter, and they are noted as such.
export function testSubscriptionScenarios() {
    describe('subscriptions', () => {
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
        describe('messages subscribe', () => {
            it('all messages', () => __awaiter(this, void 0, void 0, function* () {
                // Scenario: Alice subscribes to all messages and creates 3 messages. Alice then expects to receive all 3 messages.
                var _a, _b;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // create a handler that adds the messageCid of each message to an array.
                const messageCids = [];
                const handler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    const messageCid = yield Message.getCid(message);
                    messageCids.push(messageCid);
                });
                // subscribe to all messages
                const messagesSubscription = yield TestDataGenerator.generateMessagesSubscribe({ author: alice });
                const messagesSubscriptionReply = yield dwn.processMessage(alice.did, messagesSubscription.message, { subscriptionHandler: handler });
                expect(messagesSubscriptionReply.status.code).to.equal(200);
                expect((_a = messagesSubscriptionReply.subscription) === null || _a === void 0 ? void 0 : _a.id).to.equal(yield Message.getCid(messagesSubscription.message));
                // generate various messages
                const write1 = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const write1MessageCid = yield Message.getCid(write1.message);
                const write1Reply = yield dwn.processMessage(alice.did, write1.message, { dataStream: write1.dataStream });
                expect(write1Reply.status.code).to.equal(202);
                const protocol1 = yield TestDataGenerator.generateProtocolsConfigure({ author: alice });
                const protocol1MessageCid = yield Message.getCid(protocol1.message);
                const protocol1Reply = yield dwn.processMessage(alice.did, protocol1.message);
                expect(protocol1Reply.status.code).to.equal(202);
                const deleteWrite1 = yield TestDataGenerator.generateRecordsDelete({ author: alice, recordId: write1.message.recordId });
                const delete1MessageCid = yield Message.getCid(deleteWrite1.message);
                const deleteWrite1Reply = yield dwn.processMessage(alice.did, deleteWrite1.message);
                expect(deleteWrite1Reply.status.code).to.equal(202);
                // poll until the messages are received by the handler
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    expect(messageCids.length).to.equal(3);
                    expect(messageCids).to.eql([write1MessageCid, protocol1MessageCid, delete1MessageCid]);
                }));
                // clean up the subscription handler
                yield ((_b = messagesSubscriptionReply.subscription) === null || _b === void 0 ? void 0 : _b.close());
            }));
            it('filters by interface type', () => __awaiter(this, void 0, void 0, function* () {
                // scenario:
                // alice subscribes to 2 different message interfaces Records and Protocols
                // alice creates (2) messages, RecordsWrite and ProtocolsConfigure
                // alice checks that each handler received the appropriate message
                // alice deletes the record
                // alice checks that the Records handler received the delete message
                var _c, _d;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // subscribe to the Records interface
                const recordsInterfaceSubscription = yield TestDataGenerator.generateMessagesSubscribe({
                    author: alice,
                    filters: [{ interface: DwnInterfaceName.Records }]
                });
                const recordsMessageCids = [];
                const recordsSubscribeHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    const messageCid = yield Message.getCid(message);
                    recordsMessageCids.push(messageCid);
                });
                const recordsInterfaceSubscriptionReply = yield dwn.processMessage(alice.did, recordsInterfaceSubscription.message, { subscriptionHandler: recordsSubscribeHandler });
                expect(recordsInterfaceSubscriptionReply.status.code).to.equal(200);
                expect(recordsInterfaceSubscriptionReply.subscription).to.exist;
                // subscribe to the Protocols interface
                const protocolsInterfaceSubscription = yield TestDataGenerator.generateMessagesSubscribe({
                    author: alice,
                    filters: [{ interface: DwnInterfaceName.Protocols }]
                });
                const protocolsMessageCids = [];
                const protocolsSubscribeHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    const messageCid = yield Message.getCid(message);
                    protocolsMessageCids.push(messageCid);
                });
                const protocolsInterfaceSubscriptionReply = yield dwn.processMessage(alice.did, protocolsInterfaceSubscription.message, { subscriptionHandler: protocolsSubscribeHandler });
                expect(protocolsInterfaceSubscriptionReply.status.code).to.equal(200);
                expect(protocolsInterfaceSubscriptionReply.subscription).to.exist;
                // create one of each message types a RecordsWrite and a ProtocolsConfigure
                const record = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const recordReply = yield dwn.processMessage(alice.did, record.message, { dataStream: record.dataStream });
                expect(recordReply.status.code).to.equal(202, 'RecordsWrite');
                const protocol = yield TestDataGenerator.generateProtocolsConfigure({ author: alice });
                const protocolReply = yield dwn.processMessage(alice.did, protocol.message);
                expect(protocolReply.status.code).to.equal(202, 'ProtocolConfigure');
                // Poll until the messages are received by the handler
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // check record message
                    expect(recordsMessageCids.length).to.equal(1);
                    expect(recordsMessageCids).to.have.members([yield Message.getCid(record.message)]);
                    // check protocols message
                    expect(protocolsMessageCids.length).to.equal(1);
                    expect(protocolsMessageCids).to.have.members([yield Message.getCid(protocol.message)]);
                }));
                // delete the record
                const recordDelete = yield TestDataGenerator.generateRecordsDelete({ author: alice, recordId: record.message.recordId });
                const recordDeleteReply = yield dwn.processMessage(alice.did, recordDelete.message);
                expect(recordDeleteReply.status.code).to.equal(202, 'RecordsDelete');
                // poll until the delete message is received by the handler
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // check record messages to include the delete message
                    expect(recordsMessageCids.length).to.equal(2);
                    expect(recordsMessageCids).to.include.members([yield Message.getCid(recordDelete.message)]);
                    // check that the protocols message array does not include the delete message
                    expect(protocolsMessageCids.length).to.equal(1); // unchanged
                }));
                // clean up the subscriptions
                yield ((_c = recordsInterfaceSubscriptionReply.subscription) === null || _c === void 0 ? void 0 : _c.close());
                yield ((_d = protocolsInterfaceSubscriptionReply.subscription) === null || _d === void 0 ? void 0 : _d.close());
            }));
            it('filters by method type', () => __awaiter(this, void 0, void 0, function* () {
                // scenario:
                // Alice creates a subscription filtered to RecordsWrite messages
                // Alice creates a second subscription filtered to RecordsDelete messages
                // Alice creates a RecordsWrite message, then updates the records with a subsequent RecordsWrite
                // Alice checks that the subscription handler for RecordsWrite received both messages
                // Alice checks that the subscription handler for RecordsDelete did not receive any messages
                // Alice now deletes the record with a RecordsDelete
                // Alice also writes a new record with a RecordsWrite
                // Alice checks that the RecordsWrite handler received the new record, but not the delete message
                // Alice checks the RecordsDelete handler received the delete message
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // subscribe to records write
                const recordsWriteSubscription = yield TestDataGenerator.generateMessagesSubscribe({
                    author: alice,
                    filters: [{ interface: DwnInterfaceName.Records, method: DwnMethodName.Write }]
                });
                const recordsWriteMessageCids = [];
                const recordsSubscribeHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    const messageCid = yield Message.getCid(message);
                    recordsWriteMessageCids.push(messageCid);
                });
                const recordsWriteSubscriptionReply = yield dwn.processMessage(alice.did, recordsWriteSubscription.message, { subscriptionHandler: recordsSubscribeHandler });
                expect(recordsWriteSubscriptionReply.status.code).to.equal(200);
                expect(recordsWriteSubscriptionReply.subscription).to.exist;
                // subscribe to records delete
                const recordsDeleteSubscription = yield TestDataGenerator.generateMessagesSubscribe({
                    author: alice,
                    filters: [{ interface: DwnInterfaceName.Records, method: DwnMethodName.Delete }]
                });
                const recordsDeleteMessageCids = [];
                const recordsDeleteSubscribeHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    const messageCid = yield Message.getCid(message);
                    recordsDeleteMessageCids.push(messageCid);
                });
                const recordsDeleteSubscriptionReply = yield dwn.processMessage(alice.did, recordsDeleteSubscription.message, { subscriptionHandler: recordsDeleteSubscribeHandler });
                expect(recordsDeleteSubscriptionReply.status.code).to.equal(200);
                expect(recordsDeleteSubscriptionReply.subscription).to.exist;
                // create and updates the record, this creates two RecordsWrite messages
                const record = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const recordReply = yield dwn.processMessage(alice.did, record.message, { dataStream: record.dataStream });
                expect(recordReply.status.code).to.equal(202, 'RecordsWrite');
                const record1MessageCid = yield Message.getCid(record.message);
                const recordUpdate = yield TestDataGenerator.generateFromRecordsWrite({ author: alice, existingWrite: record.recordsWrite });
                const recordUpdateReply = yield dwn.processMessage(alice.did, recordUpdate.message, { dataStream: recordUpdate.dataStream });
                expect(recordUpdateReply.status.code).to.equal(202, 'RecordsUpdate');
                const recordUpdateMessageCid = yield Message.getCid(recordUpdate.message);
                // Poll until the messages are received by the handler
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // check the array for both the RecordsWrite messages
                    expect(recordsWriteMessageCids.length).to.equal(2);
                    expect(recordsWriteMessageCids).to.have.members([
                        record1MessageCid,
                        recordUpdateMessageCid,
                    ]);
                }));
                // confirm that the delete array is empty
                expect(recordsDeleteMessageCids.length).to.equal(0);
                // delete the record
                const recordDelete = yield TestDataGenerator.generateRecordsDelete({ author: alice, recordId: record.message.recordId });
                const recordDeleteReply = yield dwn.processMessage(alice.did, recordDelete.message);
                expect(recordDeleteReply.status.code).to.equal(202, 'RecordsDelete');
                const recordDeleteMessageCid = yield Message.getCid(recordDelete.message);
                // write a second record
                const record2 = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const record2Reply = yield dwn.processMessage(alice.did, record2.message, { dataStream: record2.dataStream });
                expect(record2Reply.status.code).to.equal(202, 'RecordsWrite');
                const record2MessageCid = yield Message.getCid(record2.message);
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // ensure the new record is in the recordsWrite array, but not the delete
                    expect(recordsWriteMessageCids.length).to.equal(3);
                    expect(recordsWriteMessageCids).to.include.members([
                        record1MessageCid,
                        recordUpdateMessageCid,
                        record2MessageCid,
                    ]);
                    // ensure the delete message is in the recordsDelete array
                    expect(recordsDeleteMessageCids.length).to.equal(1);
                    expect(recordsDeleteMessageCids).to.include.members([
                        recordDeleteMessageCid,
                    ]);
                }));
            }));
            it('filters by a protocol across different message types', () => __awaiter(this, void 0, void 0, function* () {
                // NOTE: This test validates the ability to filter by a specific protocol across different message types.
                //       This will return any of the `RecordsWrite`, `RecordsDelete` and `ProtocolConfigure` messages that are associated with the protocol
                //       Additionally this will return permission-protocol `RecordsWrite` messages that are associated with the protocol.
                // scenario:
                //    alice creates two different subscriptions, one for each protocol (proto1, proto2)
                //    alice configures the two different protocols (proto1, proto2)
                //    alice creates records for each protocol
                //    bob requests permissions for both protocols
                //    alice grants bob permissions for both protocols
                //    when checking the handler arrays for the specific protocol, only Events related to it should be present.
                //    alice then deletes the records for each protocol
                //    alice revokes bob's permissions for both protocols
                //    now when checking the handler arrays, the delete and revocation messages should be present
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const proto1Messages = [];
                const proto1Handler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    proto1Messages.push(yield Message.getCid(message));
                });
                const proto1Subscription = yield TestDataGenerator.generateMessagesSubscribe({
                    author: alice,
                    filters: [{ protocol: 'http://proto1' }]
                });
                const proto1SubscriptionReply = yield dwn.processMessage(alice.did, proto1Subscription.message, {
                    subscriptionHandler: proto1Handler
                });
                expect(proto1SubscriptionReply.status.code).to.equal(200);
                expect(proto1SubscriptionReply.subscription).to.exist;
                const proto2Messages = [];
                const proto2Handler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    proto2Messages.push(yield Message.getCid(message));
                });
                const proto2Subscription = yield TestDataGenerator.generateMessagesSubscribe({
                    author: alice,
                    filters: [{ protocol: 'http://proto2' }]
                });
                const proto2SubscriptionReply = yield dwn.processMessage(alice.did, proto2Subscription.message, {
                    subscriptionHandler: proto2Handler
                });
                expect(proto2SubscriptionReply.status.code).to.equal(200);
                expect(proto2SubscriptionReply.subscription).to.exist;
                // configure proto1
                const protoConf1 = yield TestDataGenerator.generateProtocolsConfigure({
                    author: alice,
                    protocolDefinition: Object.assign(Object.assign({}, freeForAll), { protocol: 'http://proto1' })
                });
                const proto1 = protoConf1.message.descriptor.definition.protocol;
                const protoConf1Response = yield dwn.processMessage(alice.did, protoConf1.message);
                expect(protoConf1Response.status.code).equals(202);
                // configure proto2
                const protoConf2 = yield TestDataGenerator.generateProtocolsConfigure({
                    author: alice,
                    protocolDefinition: Object.assign(Object.assign({}, freeForAll), { protocol: 'http://proto2' })
                });
                const proto2 = protoConf2.message.descriptor.definition.protocol;
                const protoConf2Response = yield dwn.processMessage(alice.did, protoConf2.message);
                expect(protoConf2Response.status.code).equals(202);
                const postProperties = {
                    protocolPath: 'post',
                    schema: freeForAll.types.post.schema,
                    dataFormat: freeForAll.types.post.dataFormats[0],
                };
                // create a record for proto1
                const write1proto1 = yield TestDataGenerator.generateRecordsWrite(Object.assign({ author: alice, protocol: proto1 }, postProperties));
                const write1Response = yield dwn.processMessage(alice.did, write1proto1.message, { dataStream: write1proto1.dataStream });
                expect(write1Response.status.code).equals(202);
                // create a record for proto2
                const write1proto2 = yield TestDataGenerator.generateRecordsWrite(Object.assign({ author: alice, protocol: proto2 }, postProperties));
                const write1Proto2Response = yield dwn.processMessage(alice.did, write1proto2.message, { dataStream: write1proto2.dataStream });
                expect(write1Proto2Response.status.code).equals(202);
                // bob requests permissions for proto1
                const requestProto1 = yield PermissionsProtocol.createRequest({
                    signer: Jws.createSigner(bob),
                    scope: { interface: DwnInterfaceName.Records, method: DwnMethodName.Write, protocol: proto1 },
                    delegated: false,
                });
                const requestProto1Response = yield dwn.processMessage(alice.did, requestProto1.recordsWrite.message, { dataStream: DataStream.fromBytes(requestProto1.permissionRequestBytes) });
                expect(requestProto1Response.status.code).equals(202);
                // bob requests permissions for proto2
                const requestProto2 = yield PermissionsProtocol.createRequest({
                    signer: Jws.createSigner(bob),
                    scope: { interface: DwnInterfaceName.Records, method: DwnMethodName.Write, protocol: proto2 },
                    delegated: false,
                });
                const requestProto2Response = yield dwn.processMessage(alice.did, requestProto2.recordsWrite.message, { dataStream: DataStream.fromBytes(requestProto2.permissionRequestBytes) });
                expect(requestProto2Response.status.code).equals(202);
                // alice grants permissions for proto1
                const grantProto1 = yield PermissionsProtocol.createGrant({
                    signer: Jws.createSigner(alice),
                    scope: requestProto1.permissionRequestData.scope,
                    dateExpires: Time.createOffsetTimestamp({ seconds: 5 }),
                    grantedTo: bob.did,
                });
                const grantProto1Response = yield dwn.processMessage(alice.did, grantProto1.recordsWrite.message, { dataStream: DataStream.fromBytes(grantProto1.permissionGrantBytes) });
                expect(grantProto1Response.status.code).equals(202);
                // alice grants permissions for proto2
                const grantProto2 = yield PermissionsProtocol.createGrant({
                    signer: Jws.createSigner(alice),
                    scope: requestProto2.permissionRequestData.scope,
                    dateExpires: Time.createOffsetTimestamp({ seconds: 5 }),
                    grantedTo: bob.did,
                });
                const grantProto2Response = yield dwn.processMessage(alice.did, grantProto2.recordsWrite.message, { dataStream: DataStream.fromBytes(grantProto2.permissionGrantBytes) });
                expect(grantProto2Response.status.code).equals(202);
                // poll until the messages are received by the handlers
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // check for proto1 messages
                    expect(proto1Messages.length).to.equal(4);
                    expect(proto1Messages).to.have.members([
                        yield Message.getCid(protoConf1.message),
                        yield Message.getCid(write1proto1.message),
                        yield Message.getCid(requestProto1.recordsWrite.message),
                        yield Message.getCid(grantProto1.recordsWrite.message),
                    ]);
                    // check for proto2 messages
                    expect(proto2Messages.length).to.equal(4);
                    expect(proto2Messages).to.have.members([
                        yield Message.getCid(protoConf2.message),
                        yield Message.getCid(write1proto2.message),
                        yield Message.getCid(requestProto2.recordsWrite.message),
                        yield Message.getCid(grantProto2.recordsWrite.message),
                    ]);
                }));
                // delete proto1 message
                const deleteProto1Message = yield TestDataGenerator.generateRecordsDelete({ author: alice, recordId: write1proto1.message.recordId });
                const deleteProto1MessageReply = yield dwn.processMessage(alice.did, deleteProto1Message.message);
                expect(deleteProto1MessageReply.status.code).to.equal(202);
                // delete proto2 message
                const deleteProto2Message = yield TestDataGenerator.generateRecordsDelete({ author: alice, recordId: write1proto2.message.recordId });
                const deleteProto2MessageReply = yield dwn.processMessage(alice.did, deleteProto2Message.message);
                expect(deleteProto2MessageReply.status.code).to.equal(202);
                // revoke permissions for proto1
                const revokeProto1 = yield PermissionsProtocol.createRevocation({
                    signer: Jws.createSigner(alice),
                    grant: yield PermissionGrant.parse(grantProto1.dataEncodedMessage),
                });
                const revokeProto1Response = yield dwn.processMessage(alice.did, revokeProto1.recordsWrite.message, { dataStream: DataStream.fromBytes(revokeProto1.permissionRevocationBytes) });
                expect(revokeProto1Response.status.code).equals(202);
                // revoke permissions for proto2
                const revokeProto2 = yield PermissionsProtocol.createRevocation({
                    signer: Jws.createSigner(alice),
                    grant: yield PermissionGrant.parse(grantProto2.dataEncodedMessage),
                });
                const revokeProto2Response = yield dwn.processMessage(alice.did, revokeProto2.recordsWrite.message, { dataStream: DataStream.fromBytes(revokeProto2.permissionRevocationBytes) });
                expect(revokeProto2Response.status.code).equals(202);
                // poll until the messages are received by the handlers
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // check for the delete and revocation in proto1 messages
                    expect(proto1Messages.length).to.equal(6); // 2 additional messages
                    expect(proto1Messages).to.include.members([
                        yield Message.getCid(deleteProto1Message.message),
                        yield Message.getCid(revokeProto1.recordsWrite.message),
                    ]);
                    // check for the delete and revocation in proto2 messages
                    expect(proto2Messages.length).to.equal(6); // 2 additional messages
                    expect(proto2Messages).to.include.members([
                        yield Message.getCid(deleteProto2Message.message),
                        yield Message.getCid(revokeProto2.recordsWrite.message),
                    ]);
                }));
            }));
            it('does not emit events after subscription is closed', () => __awaiter(this, void 0, void 0, function* () {
                // scenario: create two subscriptions.
                // write a message, check that both subscriptions receive the message.
                // close one subscription, write two more messages, check that only the open subscription receives the messages.
                // we purposely leave one subscription open to ensure that the messages are being processed by an external pub/sub system
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // messageCids of subscription 1 messages
                const sub1MessageCids = [];
                const handler1 = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    const messageCid = yield Message.getCid(message);
                    sub1MessageCids.push(messageCid);
                });
                // messageCids of subscription 2 messages
                const sub2MessageCids = [];
                const handler2 = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    const messageCid = yield Message.getCid(message);
                    sub2MessageCids.push(messageCid);
                });
                // subscribe to all messages
                const messagesSubscription1 = yield TestDataGenerator.generateMessagesSubscribe({ author: alice });
                const messagesSubscription1Reply = yield dwn.processMessage(alice.did, messagesSubscription1.message, { subscriptionHandler: handler1 });
                expect(messagesSubscription1Reply.status.code).to.equal(200);
                const messagesSubscription2 = yield TestDataGenerator.generateMessagesSubscribe({ author: alice });
                const messagesSubscription2Reply = yield dwn.processMessage(alice.did, messagesSubscription2.message, { subscriptionHandler: handler2 });
                expect(messagesSubscription2Reply.status.code).to.equal(200);
                // no event message exist yet
                expect(sub1MessageCids.length).to.equal(0);
                expect(sub2MessageCids.length).to.equal(0);
                // write a record
                const record1 = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const record1Reply = yield dwn.processMessage(alice.did, record1.message, { dataStream: record1.dataStream });
                expect(record1Reply.status.code).to.equal(202);
                const record1MessageCid = yield Message.getCid(record1.message);
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // both subscriptions should have received the message
                    expect(sub1MessageCids.length).to.equal(1); // message exists
                    expect(sub1MessageCids).to.eql([record1MessageCid]);
                    expect(sub2MessageCids.length).to.equal(1); // message exists
                    expect(sub2MessageCids).to.eql([record1MessageCid]);
                }));
                // unsubscribe from subscription 2
                yield messagesSubscription2Reply.subscription.close();
                // write two more message.
                const record2 = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const record2Reply = yield dwn.processMessage(alice.did, record2.message, { dataStream: record2.dataStream });
                expect(record2Reply.status.code).to.equal(202);
                const record2MessageCid = yield Message.getCid(record2.message);
                const record3 = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const record3Reply = yield dwn.processMessage(alice.did, record3.message, { dataStream: record3.dataStream });
                expect(record3Reply.status.code).to.equal(202);
                const record3MessageCid = yield Message.getCid(record3.message);
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    expect(sub1MessageCids.length).to.equal(3); // all three messages exist
                    expect(sub1MessageCids).to.eql([
                        record1MessageCid,
                        record2MessageCid,
                        record3MessageCid
                    ]);
                    expect(sub2MessageCids.length).to.equal(1); // only the first message exists
                    expect(sub2MessageCids).to.eql([record1MessageCid]);
                }));
            }));
        });
        describe('records subscribe', () => {
            it('allows for anonymous subscriptions to published records', () => __awaiter(this, void 0, void 0, function* () {
                // scenario:
                // a user creates an anonymous subscription filtered to a schema to alice's DWN
                // alice writes two records, one not published and one published
                // alice checks that the anonymous subscription handler only received the published record
                // NOTE we create a control subscription to capture all messages
                // this is to ensure that the messages are not received by the anonymous subscription handler, but have had ample time to be processed
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // create a control handler to capture ALL messages in the protocol with alice as the author
                const allMessages = [];
                const allHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    allMessages.push(yield Message.getCid(message));
                });
                const allSubscription = yield TestDataGenerator.generateMessagesSubscribe({
                    author: alice,
                });
                const allSubscriptionReply = yield dwn.processMessage(alice.did, allSubscription.message, { subscriptionHandler: allHandler });
                expect(allSubscriptionReply.status.code).to.equal(200);
                // we create an anonymous subscription to capture only published messages
                const publishedMessages = [];
                const anonymousSubscriptionHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    publishedMessages.push(yield Message.getCid(message));
                });
                const anonymousSubscription = yield TestDataGenerator.generateRecordsSubscribe({
                    anonymous: true,
                    filter: { schema: 'http://schema1' }
                });
                const anonymousSubscriptionReply = yield dwn.processMessage(alice.did, anonymousSubscription.message, {
                    subscriptionHandler: anonymousSubscriptionHandler
                });
                expect(anonymousSubscriptionReply.status.code).to.equal(200);
                expect(anonymousSubscriptionReply.subscription).to.exist;
                // we create a non published record, this will only show up in the control subscription
                const writeNotPublished = yield TestDataGenerator.generateRecordsWrite({ author: alice, schema: 'http://schema1' });
                const writeNotPublishedReply = yield dwn.processMessage(alice.did, writeNotPublished.message, { dataStream: writeNotPublished.dataStream });
                expect(writeNotPublishedReply.status.code).to.equal(202);
                // we create a published record, this will show up in both the control and anonymous subscription
                const write1 = yield TestDataGenerator.generateRecordsWrite({ author: alice, schema: 'http://schema1', published: true });
                const write1Reply = yield dwn.processMessage(alice.did, write1.message, { dataStream: write1.dataStream });
                expect(write1Reply.status.code).to.equal(202);
                // we create another published record, this will show up in both the control and anonymous subscription
                const write2 = yield TestDataGenerator.generateRecordsWrite({ author: alice, schema: 'http://schema1', published: true });
                const write2Reply = yield dwn.processMessage(alice.did, write2.message, { dataStream: write2.dataStream });
                expect(write2Reply.status.code).to.equal(202);
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // publishedMessages array should only contain the two published messages
                    expect(publishedMessages.length).to.equal(2);
                    expect(publishedMessages).to.have.members([
                        yield Message.getCid(write1.message),
                        yield Message.getCid(write2.message),
                    ]);
                    // allMessages array should contain all three messages
                    expect(allMessages.length).to.equal(3);
                    expect(allMessages).to.have.members([
                        yield Message.getCid(writeNotPublished.message),
                        yield Message.getCid(write1.message),
                        yield Message.getCid(write2.message),
                    ]);
                }));
            }));
            it('allows authorized subscriptions to records intended for a recipient', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // alice installs a freeForAll protocol
                const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                    author: alice,
                    protocolDefinition: Object.assign({}, freeForAll)
                });
                const protocolConfigureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                expect(protocolConfigureReply.status.code).to.equal(202);
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const carol = yield TestDataGenerator.generateDidKeyPersona();
                // bob subscribes to all records he's authorized to see, with alice as the recipient
                const bobSubscribeAlice = [];
                const bobSubscribeHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    bobSubscribeAlice.push(yield Message.getCid(message));
                });
                const bobSubscribeToAlice = yield TestDataGenerator.generateRecordsSubscribe({
                    author: bob,
                    filter: { protocol: freeForAll.protocol, recipient: alice.did }
                });
                const bobSubscribeReply = yield dwn.processMessage(alice.did, bobSubscribeToAlice.message, {
                    subscriptionHandler: bobSubscribeHandler
                });
                expect(bobSubscribeReply.status.code).to.equal(200);
                expect(bobSubscribeReply.subscription).to.exist;
                // carol subscribes to any messages that she or alice are the recipients of
                const carolSubscribeCarolAndAlice = [];
                const carolSubscribeHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    carolSubscribeCarolAndAlice.push(yield Message.getCid(message));
                });
                const carolSubscribeToCarolAndAlice = yield TestDataGenerator.generateRecordsSubscribe({
                    author: carol,
                    filter: { protocol: freeForAll.protocol, recipient: [alice.did, carol.did] }
                });
                const carolSubscribeReply = yield dwn.processMessage(alice.did, carolSubscribeToCarolAndAlice.message, {
                    subscriptionHandler: carolSubscribeHandler
                });
                expect(carolSubscribeReply.status.code).to.equal(200);
                expect(carolSubscribeReply.subscription).to.exist;
                const recordParams = {
                    protocol: freeForAll.protocol,
                    protocolPath: 'post',
                    schema: freeForAll.types.post.schema,
                    dataFormat: freeForAll.types.post.dataFormats[0],
                };
                // write a private and public message for alice from bob
                const publicBobToAlice = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: bob, recipient: alice.did, published: true }));
                const publicBobToAliceReply = yield dwn.processMessage(alice.did, publicBobToAlice.message, { dataStream: publicBobToAlice.dataStream });
                expect(publicBobToAliceReply.status.code).to.equal(202);
                const privateBobToAlice = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: bob, recipient: alice.did, published: false }));
                const privateBobToAliceReply = yield dwn.processMessage(alice.did, privateBobToAlice.message, { dataStream: privateBobToAlice.dataStream });
                expect(privateBobToAliceReply.status.code).to.equal(202);
                // write a private message for alice from carol
                const privateCarolToAlice = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: carol, recipient: alice.did, published: false }));
                const privateCarolToAliceReply = yield dwn.processMessage(alice.did, privateCarolToAlice.message, {
                    dataStream: privateCarolToAlice.dataStream
                });
                expect(privateCarolToAliceReply.status.code).to.equal(202);
                // write a public and private message from bob to carol
                const publicBobToCarol = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: bob, recipient: carol.did, published: true }));
                const publicBobToCarolReply = yield dwn.processMessage(alice.did, publicBobToCarol.message, {
                    dataStream: publicBobToCarol.dataStream
                });
                expect(publicBobToCarolReply.status.code).to.equal(202);
                const privateBobToCarol = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: bob, recipient: carol.did, published: false }));
                const privateBobToCarolReply = yield dwn.processMessage(alice.did, privateBobToCarol.message, {
                    dataStream: privateBobToCarol.dataStream
                });
                expect(privateBobToCarolReply.status.code).to.equal(202);
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // carol should have received the message intended for her
                    expect(carolSubscribeCarolAndAlice.length).to.equal(4);
                    expect(carolSubscribeCarolAndAlice).to.have.members([
                        yield Message.getCid(publicBobToAlice.message),
                        yield Message.getCid(privateCarolToAlice.message),
                        yield Message.getCid(publicBobToCarol.message),
                        yield Message.getCid(privateBobToCarol.message),
                    ]);
                    // bob should have received the two messages intended for him
                    expect(bobSubscribeAlice.length).to.equal(2);
                    expect(bobSubscribeAlice).to.have.members([
                        yield Message.getCid(privateBobToAlice.message),
                        yield Message.getCid(publicBobToAlice.message),
                    ]);
                }));
            }));
            it('allows for authorized subscriptions to records authored by an author(s)', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // alice installs a freeForAll protocol
                const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                    author: alice,
                    protocolDefinition: Object.assign({}, freeForAll)
                });
                const protocolConfigureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                expect(protocolConfigureReply.status.code).to.equal(202);
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const carol = yield TestDataGenerator.generateDidKeyPersona();
                // bob subscribes to all records he's authorized to see, with alice as the author
                const bobSubscribeAlice = [];
                const bobSubscribeHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    bobSubscribeAlice.push(yield Message.getCid(message));
                });
                const bobSubscribeToAlice = yield TestDataGenerator.generateRecordsSubscribe({
                    author: bob,
                    filter: { protocol: freeForAll.protocol, author: alice.did }
                });
                const bobSubscribeReply = yield dwn.processMessage(alice.did, bobSubscribeToAlice.message, {
                    subscriptionHandler: bobSubscribeHandler
                });
                expect(bobSubscribeReply.status.code).to.equal(200);
                expect(bobSubscribeReply.subscription).to.exist;
                // carol subscribes to any messages that she or alice are the authors of
                const carolSubscribeCarolAndAlice = [];
                const carolSubscribeHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message } = event;
                    carolSubscribeCarolAndAlice.push(yield Message.getCid(message));
                });
                const carolSubscribeToCarolAndAlice = yield TestDataGenerator.generateRecordsSubscribe({
                    author: carol,
                    filter: { protocol: freeForAll.protocol, author: [alice.did, carol.did] }
                });
                const carolSubscribeReply = yield dwn.processMessage(alice.did, carolSubscribeToCarolAndAlice.message, {
                    subscriptionHandler: carolSubscribeHandler
                });
                expect(carolSubscribeReply.status.code).to.equal(200);
                expect(carolSubscribeReply.subscription).to.exist;
                const recordParams = {
                    protocol: freeForAll.protocol,
                    protocolPath: 'post',
                    schema: freeForAll.types.post.schema,
                    dataFormat: freeForAll.types.post.dataFormats[0],
                };
                //control: write a public message to bob (will not show up)
                const publicAliceToBob = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: alice, recipient: bob.did, published: true }));
                const publicAliceToBobReply = yield dwn.processMessage(alice.did, publicAliceToBob.message, {
                    dataStream: publicAliceToBob.dataStream
                });
                expect(publicAliceToBobReply.status.code).to.equal(202);
                // write a private and public message from alice to carol
                const publicAliceToCarol = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: alice, recipient: carol.did, published: true }));
                const publicAliceToCarolReply = yield dwn.processMessage(alice.did, publicAliceToCarol.message, {
                    dataStream: publicAliceToCarol.dataStream
                });
                expect(publicAliceToCarolReply.status.code).to.equal(202);
                const privateAliceToCarol = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: alice, recipient: carol.did, published: false }));
                const privateAliceToCarolReply = yield dwn.processMessage(alice.did, privateAliceToCarol.message, {
                    dataStream: privateAliceToCarol.dataStream
                });
                expect(privateAliceToCarolReply.status.code).to.equal(202);
                // write a private message for alice from carol
                const privateCarolToAlice = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: carol, recipient: alice.did, published: false }));
                const privateCarolToAliceReply = yield dwn.processMessage(alice.did, privateCarolToAlice.message, {
                    dataStream: privateCarolToAlice.dataStream
                });
                expect(privateCarolToAliceReply.status.code).to.equal(202);
                // write a public and private message from bob to carol
                const publicBobToCarol = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: bob, recipient: carol.did, published: true }));
                const publicBobToCarolReply = yield dwn.processMessage(alice.did, publicBobToCarol.message, {
                    dataStream: publicBobToCarol.dataStream
                });
                expect(publicBobToCarolReply.status.code).to.equal(202);
                const privateBobToCarol = yield TestDataGenerator.generateRecordsWrite(Object.assign(Object.assign({}, recordParams), { author: bob, recipient: carol.did, published: false }));
                const privateBobToCarolReply = yield dwn.processMessage(alice.did, privateBobToCarol.message, {
                    dataStream: privateBobToCarol.dataStream
                });
                expect(privateBobToCarolReply.status.code).to.equal(202);
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // carol should have received the message intended for her
                    expect(carolSubscribeCarolAndAlice.length).to.equal(4);
                    expect(carolSubscribeCarolAndAlice).to.have.members([
                        yield Message.getCid(publicAliceToCarol.message),
                        yield Message.getCid(privateAliceToCarol.message),
                        yield Message.getCid(publicAliceToBob.message),
                        yield Message.getCid(privateCarolToAlice.message),
                    ]);
                    // bob should have received the two messages intended for him
                    expect(bobSubscribeAlice.length).to.equal(2);
                    expect(bobSubscribeAlice).to.have.members([
                        yield Message.getCid(publicAliceToBob.message),
                        yield Message.getCid(publicAliceToCarol.message)
                    ]);
                }));
            }));
            it('filters by protocol & contextId across multiple protocolPaths', () => __awaiter(this, void 0, void 0, function* () {
                // scenario: subscribe to multiple protocolPaths for a given protocol and contextId
                //    alice installs a protocol and creates a thread
                //    alice subscribes to update to that thread, it's participant as well as thread chats
                //    alice adds bob and carol as participants to the thread
                //    alice, bob, and carol all create messages
                //    alice deletes carol participant message
                //    alice checks that the correct messages were omitted
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const carol = yield TestDataGenerator.generateDidKeyPersona();
                // create protocol
                const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                    author: alice,
                    protocolDefinition: Object.assign({}, threadProtocol)
                });
                const protocolConfigureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                expect(protocolConfigureReply.status.code).to.equal(202);
                const protocol = protocolConfigure.message.descriptor.definition.protocol;
                // alice creates thread
                const thread = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    protocol: protocol,
                    protocolPath: 'thread'
                });
                const threadReply = yield dwn.processMessage(alice.did, thread.message, { dataStream: thread.dataStream });
                expect(threadReply.status.code).to.equal(202);
                // subscribe to this thread's messages
                const messages = [];
                const initialWrites = [];
                const subscriptionHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                    const { message, initialWrite } = event;
                    if (initialWrite !== undefined) {
                        initialWrites.push(yield Message.getCid(initialWrite));
                    }
                    messages.push(yield Message.getCid(message));
                });
                const threadSubscription = yield TestDataGenerator.generateRecordsSubscribe({
                    author: alice,
                    filter: { protocol: protocol, protocolPath: 'thread', contextId: thread.message.contextId }, // thread updates
                });
                const threadSubscriptionReply = yield dwn.processMessage(alice.did, threadSubscription.message, {
                    subscriptionHandler
                });
                expect(threadSubscriptionReply.status.code).to.equal(200);
                expect(threadSubscriptionReply.subscription).to.exist;
                const participantSubscription = yield TestDataGenerator.generateRecordsSubscribe({
                    author: alice,
                    filter: { protocol: protocol, protocolPath: 'thread/participant', contextId: thread.message.contextId }, // participant updates
                });
                const participantSubscriptionReply = yield dwn.processMessage(alice.did, participantSubscription.message, {
                    subscriptionHandler
                });
                expect(participantSubscriptionReply.status.code).to.equal(200);
                expect(participantSubscriptionReply.subscription).to.exist;
                const chatSubscription = yield TestDataGenerator.generateRecordsSubscribe({
                    author: alice,
                    filter: { protocol: protocol, protocolPath: 'thread/chat', contextId: thread.message.contextId } // chat updates
                });
                const chatSubscriptionReply = yield dwn.processMessage(alice.did, chatSubscription.message, {
                    subscriptionHandler
                });
                expect(chatSubscriptionReply.status.code).to.equal(200);
                expect(chatSubscriptionReply.subscription).to.exist;
                // add bob as participant
                const bobParticipant = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    recipient: bob.did,
                    parentContextId: thread.message.contextId,
                    protocol: protocol,
                    protocolPath: 'thread/participant'
                });
                const bobParticipantReply = yield dwn.processMessage(alice.did, bobParticipant.message, { dataStream: bobParticipant.dataStream });
                expect(bobParticipantReply.status.code).to.equal(202);
                // add carol as participant
                const carolParticipant = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    recipient: carol.did,
                    parentContextId: thread.message.contextId,
                    protocol: protocol,
                    protocolPath: 'thread/participant'
                });
                const carolParticipantReply = yield dwn.processMessage(alice.did, carolParticipant.message, { dataStream: carolParticipant.dataStream });
                expect(carolParticipantReply.status.code).to.equal(202);
                // add another thread as a control, will not show up in handled message events
                const additionalThread = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    protocol: protocol,
                    protocolPath: 'thread'
                });
                const additionalThreadReply = yield dwn.processMessage(alice.did, additionalThread.message, { dataStream: additionalThread.dataStream });
                expect(additionalThreadReply.status.code).to.equal(202);
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    expect(messages.length).to.equal(2);
                    expect(messages).to.have.members([
                        yield Message.getCid(bobParticipant.message),
                        yield Message.getCid(carolParticipant.message),
                    ]);
                }));
                // add a message to protocol1
                const message1 = yield TestDataGenerator.generateRecordsWrite({
                    author: bob,
                    recipient: alice.did,
                    parentContextId: thread.message.contextId,
                    protocol: protocol,
                    protocolPath: 'thread/chat',
                    protocolRole: 'thread/participant',
                });
                const message1Reply = yield dwn.processMessage(alice.did, message1.message, { dataStream: message1.dataStream });
                expect(message1Reply.status.code).to.equal(202);
                const message2 = yield TestDataGenerator.generateRecordsWrite({
                    author: bob,
                    recipient: alice.did,
                    parentContextId: thread.message.contextId,
                    protocol: protocol,
                    protocolPath: 'thread/chat',
                    protocolRole: 'thread/participant',
                });
                const message2Reply = yield dwn.processMessage(alice.did, message2.message, { dataStream: message2.dataStream });
                expect(message2Reply.status.code).to.equal(202);
                const message3 = yield TestDataGenerator.generateRecordsWrite({
                    author: carol,
                    recipient: alice.did,
                    parentContextId: thread.message.contextId,
                    protocol: protocol,
                    protocolPath: 'thread/chat',
                    protocolRole: 'thread/participant',
                });
                const message3Reply = yield dwn.processMessage(alice.did, message3.message, { dataStream: message3.dataStream });
                expect(message3Reply.status.code).to.equal(202);
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    expect(messages.length).to.equal(5);
                    expect(messages).to.include.members([
                        yield Message.getCid(message1.message),
                        yield Message.getCid(message2.message),
                        yield Message.getCid(message3.message),
                    ]);
                }));
                // delete carol participant
                const deleteCarol = yield TestDataGenerator.generateRecordsDelete({
                    author: alice,
                    recordId: carolParticipant.message.recordId
                });
                const deleteCarolReply = yield dwn.processMessage(alice.did, deleteCarol.message);
                expect(deleteCarolReply.status.code).to.equal(202);
                yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    expect(messages.length).to.equal(6);
                    expect(messages).to.include.members([
                        yield Message.getCid(deleteCarol.message)
                    ]);
                    // check the initial write was included with the delete
                    expect(initialWrites).to.include.members([
                        yield Message.getCid(carolParticipant.message)
                    ]);
                }));
            }));
        });
    });
}
//# sourceMappingURL=subscriptions.spec.js.map