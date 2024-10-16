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
import { expect } from 'chai';
import { PermissionGrant } from '../../src/protocols/permission-grant.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DataStream, Dwn, DwnInterfaceName, DwnMethodName, Jws, Message, PermissionsProtocol, Time } from '../../src/index.js';
import { DidKey, UniversalResolver } from '@web5/dids';
export function testMessagesQueryScenarios() {
    describe('messages query tests', () => {
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
        it('supports multiple filter types', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const record = yield TestDataGenerator.generateRecordsWrite({ author: alice });
            const protocol = yield TestDataGenerator.generateProtocolsConfigure({ author: alice });
            // insert data
            const recordReply = yield dwn.processMessage(alice.did, record.message, { dataStream: record.dataStream });
            const protocolReply = yield dwn.processMessage(alice.did, protocol.message);
            expect(recordReply.status.code).to.equal(202, 'RecordsWrite');
            expect(protocolReply.status.code).to.equal(202, 'ProtocolConfigure');
            const messagesQueryRecords = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [
                    { interface: DwnInterfaceName.Records },
                    { protocol: protocol.message.descriptor.definition.protocol } // returns the ProtocolConfigure
                ],
            });
            const recordMessagesReply = yield dwn.processMessage(alice.did, messagesQueryRecords.message);
            expect(recordMessagesReply.status.code).to.equal(200);
            expect((_a = recordMessagesReply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(2);
            expect(recordMessagesReply.entries).to.have.members([
                yield Message.getCid(record.message),
                yield Message.getCid(protocol.message),
            ]);
        }));
        it('filters by interface type', () => __awaiter(this, void 0, void 0, function* () {
            // scenario:
            // alice creates 2 different types of messages (RecordsWrite, ProtocolsConfigure)
            // alice queries for messages from each interface respectively (Records, Protocols)
            // alice creates 2 additional messages (RecordsDelete, ProtocolsRevoke)
            // alice queries for messages for each interface respectively providing a cursor.
            var _b, _c, _d, _e;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const record = yield TestDataGenerator.generateRecordsWrite({ author: alice });
            const protocol = yield TestDataGenerator.generateProtocolsConfigure({ author: alice });
            // insert data
            const recordReply = yield dwn.processMessage(alice.did, record.message, { dataStream: record.dataStream });
            const protocolReply = yield dwn.processMessage(alice.did, protocol.message);
            expect(recordReply.status.code).to.equal(202, 'RecordsWrite');
            expect(protocolReply.status.code).to.equal(202, 'ProtocolConfigure');
            let messagesQueryRecords = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ interface: DwnInterfaceName.Records }],
            });
            const recordMessagesReply = yield dwn.processMessage(alice.did, messagesQueryRecords.message);
            expect(recordMessagesReply.status.code).to.equal(200);
            expect((_b = recordMessagesReply.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(1);
            expect(recordMessagesReply.entries[0]).to.equal(yield Message.getCid(record.message));
            let messagesQueryProtocols = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ interface: DwnInterfaceName.Protocols }],
            });
            const protocolMessagesReply = yield dwn.processMessage(alice.did, messagesQueryProtocols.message);
            expect(protocolMessagesReply.status.code).to.equal(200);
            expect((_c = protocolMessagesReply.entries) === null || _c === void 0 ? void 0 : _c.length).to.equal(1);
            expect(protocolMessagesReply.entries[0]).to.equal(yield Message.getCid(protocol.message));
            // insert additional data to query beyond a cursor
            const recordDelete = yield TestDataGenerator.generateRecordsDelete({ author: alice, recordId: record.message.recordId });
            const recordDeleteReply = yield dwn.processMessage(alice.did, recordDelete.message);
            expect(recordDeleteReply.status.code).to.equal(202, 'RecordsDelete');
            // query after cursor
            messagesQueryRecords = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ interface: DwnInterfaceName.Records }],
                cursor: recordMessagesReply.cursor, // the cursor from the prior query
            });
            const recordMessagesReplyAfterCursor = yield dwn.processMessage(alice.did, messagesQueryRecords.message);
            expect(recordMessagesReplyAfterCursor.status.code).to.equal(200);
            expect((_d = recordMessagesReplyAfterCursor.entries) === null || _d === void 0 ? void 0 : _d.length).to.equal(1);
            expect(recordMessagesReplyAfterCursor.entries[0]).to.equal(yield Message.getCid(recordDelete.message));
            messagesQueryProtocols = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ interface: DwnInterfaceName.Protocols }],
                cursor: protocolMessagesReply.cursor, // the cursor from the prior query
            });
            const protocolMessagesReplyAfterCursor = yield dwn.processMessage(alice.did, messagesQueryProtocols.message);
            expect(protocolMessagesReplyAfterCursor.status.code).to.equal(200);
            expect((_e = protocolMessagesReplyAfterCursor.entries) === null || _e === void 0 ? void 0 : _e.length).to.equal(0); // no new messages
        }));
        it('filters by method type', () => __awaiter(this, void 0, void 0, function* () {
            // scenario:
            // alice creates a variety of Messages (RecordsWrite, RecordsDelete, ProtocolConfigure)
            // alice queries for only RecordsWrite messages
            // alice creates more messages to query beyond a cursor
            var _f, _g;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            // write 1
            const record1 = yield TestDataGenerator.generateRecordsWrite({ author: alice });
            const record1Reply = yield dwn.processMessage(alice.did, record1.message, { dataStream: record1.dataStream });
            expect(record1Reply.status.code).to.equal(202, 'RecordsWrite');
            // other messages
            const protocol = yield TestDataGenerator.generateProtocolsConfigure({ author: alice });
            const protocolReply = yield dwn.processMessage(alice.did, protocol.message);
            expect(protocolReply.status.code).to.equal(202, 'ProtocolConfigure');
            // write 2
            const record2 = yield TestDataGenerator.generateRecordsWrite({ author: alice });
            const record2Reply = yield dwn.processMessage(alice.did, record2.message, { dataStream: record2.dataStream });
            expect(record2Reply.status.code).to.equal(202, 'RecordsWrite');
            // delete write 1
            const delete1 = yield TestDataGenerator.generateRecordsDelete({ author: alice, recordId: record1.message.recordId });
            const delete1Reply = yield dwn.processMessage(alice.did, delete1.message);
            expect(delete1Reply.status.code).to.equal(202, 'RecordsDelete');
            let recordsWriteEvents = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ interface: DwnInterfaceName.Records, method: DwnMethodName.Write }]
            });
            const recordsWriteEventsReply = yield dwn.processMessage(alice.did, recordsWriteEvents.message);
            expect(recordsWriteEventsReply.status.code).to.equal(200);
            expect((_f = recordsWriteEventsReply.entries) === null || _f === void 0 ? void 0 : _f.length).to.equal(2);
            expect(recordsWriteEventsReply.entries[0]).to.equal(yield Message.getCid(record1.message));
            expect(recordsWriteEventsReply.entries[1]).to.equal(yield Message.getCid(record2.message));
            // additional messages
            const record2Update = yield TestDataGenerator.generateFromRecordsWrite({ author: alice, existingWrite: record2.recordsWrite });
            const record2UpdateReply = yield dwn.processMessage(alice.did, record2Update.message, { dataStream: record2Update.dataStream });
            expect(record2UpdateReply.status.code).to.equal(202, 'RecordsDelete');
            recordsWriteEvents = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ interface: DwnInterfaceName.Records, method: DwnMethodName.Write }],
                cursor: recordsWriteEventsReply.cursor,
            });
            const recordsWriteEventsReplyAfterCursor = yield dwn.processMessage(alice.did, recordsWriteEvents.message);
            expect(recordsWriteEventsReplyAfterCursor.status.code).to.equal(200);
            expect((_g = recordsWriteEventsReplyAfterCursor.entries) === null || _g === void 0 ? void 0 : _g.length).to.equal(1);
            expect(recordsWriteEventsReplyAfterCursor.entries[0]).to.equal(yield Message.getCid(record2Update.message));
        }));
        it('filters by a messageTimestamp range across different message types', () => __awaiter(this, void 0, void 0, function* () {
            var _h, _j;
            // scenario:
            // alice creates (2) messages, (RecordsWrite and ProtocolsConfigure)
            // each message on the first date of the year (2021, 2022 respectively.
            // alice queries for all records beyond the last day of 2021 and should return 1 of the 2 messages (ProtocolConfigure)
            // alice then creates a RecordsDelete message for the original RecordsWrite
            // alice queries once again however supplying a cursor of the last message from the prior query, returning the RecordsDelete message.
            const firstDayOf2021 = Time.createTimestamp({ year: 2021, month: 1, day: 1 });
            const firstDayOf2022 = Time.createTimestamp({ year: 2022, month: 1, day: 1 });
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const write = yield TestDataGenerator.generateRecordsWrite({ author: alice, dateCreated: firstDayOf2021, messageTimestamp: firstDayOf2021 });
            const protocol = yield TestDataGenerator.generateProtocolsConfigure({ author: alice, messageTimestamp: firstDayOf2022 });
            // insert data
            const writeReply = yield dwn.processMessage(alice.did, write.message, { dataStream: write.dataStream });
            const protocolReply = yield dwn.processMessage(alice.did, protocol.message);
            expect(writeReply.status.code).to.equal(202, 'RecordsWrite');
            expect(protocolReply.status.code).to.equal(202, 'ProtocolConfigure');
            // query from last day of 2021
            const lastDayOf2021 = Time.createTimestamp({ year: 2021, month: 12, day: 31 });
            let messagesQuery1 = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ messageTimestamp: { from: lastDayOf2021 } }],
            });
            let reply1 = yield dwn.processMessage(alice.did, messagesQuery1.message);
            expect(reply1.status.code).to.equal(200);
            expect((_h = reply1.entries) === null || _h === void 0 ? void 0 : _h.length).to.equal(1);
            expect(reply1.entries[0]).to.equal(yield Message.getCid(protocol.message));
            // delete the RecordsWrite
            const delete1 = yield TestDataGenerator.generateRecordsDelete({ author: alice, recordId: write.message.recordId });
            const delete1Reply = yield dwn.processMessage(alice.did, delete1.message);
            expect(delete1Reply.status.code).to.equal(202);
            messagesQuery1 = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ messageTimestamp: { from: lastDayOf2021 } }],
                cursor: reply1.cursor
            });
            reply1 = yield dwn.processMessage(alice.did, messagesQuery1.message);
            expect(reply1.status.code).to.equal(200);
            expect((_j = reply1.entries) === null || _j === void 0 ? void 0 : _j.length).to.equal(1);
            expect(reply1.entries[0]).to.equal(yield Message.getCid(delete1.message));
        }));
        it('filters by a protocol across different message types', () => __awaiter(this, void 0, void 0, function* () {
            // NOTE: This test validates the ability to filter by a specific protocol across different message types.
            //       This will return any of the `RecordsWrite`, `RecordsDelete` and `ProtocolConfigure` messages that are associated with the protocol
            //       Additionally this will return permission-protocol `RecordsWrite` messages that are associated with the protocol.
            var _k, _l, _m, _o, _p, _q;
            //       `RecordsDelete` messages associated with requests/grants/revocations are not yet indexed.
            //       TODO: https://github.com/TBD54566975/dwn-sdk-js/issues/768
            // scenario:
            //    alice configures two different protocols (proto1, proto2)
            //    alice creates records for each protocol
            //    bob requests permissions for both protocols
            //    alice grants bob permissions for both protocols
            //    when issuing an MessagesQuery for the specific protocol, only Events related to it should be returned.
            //    alice then deletes the records for each protocol
            //    alice revokes bob's permissions for both protocols
            //    now when issuing an MessagesQuery for the specific protocol givin a cursor, only the latest event should be returned.
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            // create a proto1
            const protoConf1 = yield TestDataGenerator.generateProtocolsConfigure({
                author: alice,
                protocolDefinition: Object.assign(Object.assign({}, freeForAll), { protocol: 'proto1' })
            });
            const proto1 = protoConf1.message.descriptor.definition.protocol;
            const protoConf1Response = yield dwn.processMessage(alice.did, protoConf1.message);
            expect(protoConf1Response.status.code).equals(202);
            // create a proto2
            const protoConf2 = yield TestDataGenerator.generateProtocolsConfigure({
                author: alice,
                protocolDefinition: Object.assign(Object.assign({}, freeForAll), { protocol: 'proto2' })
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
            // bob requests permissions for proto 1
            const requestProto1 = yield PermissionsProtocol.createRequest({
                signer: Jws.createSigner(bob),
                scope: { interface: DwnInterfaceName.Records, method: DwnMethodName.Write, protocol: proto1 },
                delegated: false,
            });
            const requestProto1Response = yield dwn.processMessage(alice.did, requestProto1.recordsWrite.message, { dataStream: DataStream.fromBytes(requestProto1.permissionRequestBytes) });
            expect(requestProto1Response.status.code).equals(202);
            // bob requests permissions for proto 2
            const requestProto2 = yield PermissionsProtocol.createRequest({
                signer: Jws.createSigner(bob),
                scope: { interface: DwnInterfaceName.Records, method: DwnMethodName.Write, protocol: proto2 },
                delegated: false,
            });
            const requestProto2Response = yield dwn.processMessage(alice.did, requestProto2.recordsWrite.message, { dataStream: DataStream.fromBytes(requestProto2.permissionRequestBytes) });
            expect(requestProto2Response.status.code).equals(202);
            // alice grants bob permissions for proto 1
            const grantProto1 = yield PermissionsProtocol.createGrant({
                signer: Jws.createSigner(alice),
                scope: requestProto1.permissionRequestData.scope,
                dateExpires: Time.createOffsetTimestamp({ seconds: 5 }),
                grantedTo: bob.did,
            });
            const grantProto1Response = yield dwn.processMessage(alice.did, grantProto1.recordsWrite.message, { dataStream: DataStream.fromBytes(grantProto1.permissionGrantBytes) });
            expect(grantProto1Response.status.code).equals(202);
            // alice grants bob permissions for proto 2
            const grantProto2 = yield PermissionsProtocol.createGrant({
                signer: Jws.createSigner(alice),
                scope: requestProto2.permissionRequestData.scope,
                dateExpires: Time.createOffsetTimestamp({ seconds: 5 }),
                grantedTo: bob.did,
            });
            const grantProto2Response = yield dwn.processMessage(alice.did, grantProto2.recordsWrite.message, { dataStream: DataStream.fromBytes(grantProto2.permissionGrantBytes) });
            expect(grantProto2Response.status.code).equals(202);
            // filter for proto1 messages
            let proto1MessagesQuery = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ protocol: proto1 }]
            });
            let proto1EventsReply = yield dwn.processMessage(alice.did, proto1MessagesQuery.message);
            expect(proto1EventsReply.status.code).equals(200);
            expect((_k = proto1EventsReply.entries) === null || _k === void 0 ? void 0 : _k.length).equals(4); // configure, write, request, grant
            expect(proto1EventsReply.entries).to.have.members([
                yield Message.getCid(protoConf1.message),
                yield Message.getCid(write1proto1.message),
                yield Message.getCid(requestProto1.recordsWrite.message),
                yield Message.getCid(grantProto1.recordsWrite.message),
            ]);
            // filter for proto2
            let proto2MessagesQuery = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ protocol: proto2 }]
            });
            let proto2EventsReply = yield dwn.processMessage(alice.did, proto2MessagesQuery.message);
            expect(proto2EventsReply.status.code).equals(200);
            expect((_l = proto2EventsReply.entries) === null || _l === void 0 ? void 0 : _l.length).equals(4); // configure, write, request, grant
            expect(proto2EventsReply.entries).to.have.members([
                yield Message.getCid(protoConf2.message),
                yield Message.getCid(write1proto2.message),
                yield Message.getCid(requestProto2.recordsWrite.message),
                yield Message.getCid(grantProto2.recordsWrite.message),
            ]);
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
            //query messages beyond the cursor
            proto1MessagesQuery = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ protocol: proto1 }],
                cursor: proto1EventsReply.cursor,
            });
            proto1EventsReply = yield dwn.processMessage(alice.did, proto1MessagesQuery.message);
            expect(proto1EventsReply.status.code).equals(200);
            expect((_m = proto1EventsReply.entries) === null || _m === void 0 ? void 0 : _m.length).equals(2); // delete, revoke
            expect(proto1EventsReply.entries).to.have.members([
                yield Message.getCid(deleteProto1Message.message),
                yield Message.getCid(revokeProto1.recordsWrite.message),
            ]);
            //query messages beyond the cursor
            proto2MessagesQuery = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ protocol: proto2 }],
                cursor: proto2EventsReply.cursor,
            });
            proto2EventsReply = yield dwn.processMessage(alice.did, proto2MessagesQuery.message);
            expect(proto2EventsReply.status.code).equals(200);
            expect((_o = proto2EventsReply.entries) === null || _o === void 0 ? void 0 : _o.length).equals(2); // delete, revoke
            expect(proto2EventsReply.entries).to.have.members([
                yield Message.getCid(deleteProto2Message.message),
                yield Message.getCid(revokeProto2.recordsWrite.message),
            ]);
            // query for proto1 messages again after the curser, should get nothing
            proto1MessagesQuery = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ protocol: proto1 }],
                cursor: proto1EventsReply.cursor,
            });
            proto1EventsReply = yield dwn.processMessage(alice.did, proto1MessagesQuery.message);
            expect(proto1EventsReply.status.code).equals(200);
            expect((_p = proto1EventsReply.entries) === null || _p === void 0 ? void 0 : _p.length).equals(0);
            // query for proto2 messages again after the curser, should get nothing
            proto2MessagesQuery = yield TestDataGenerator.generateMessagesQuery({
                author: alice,
                filters: [{ protocol: proto2 }],
                cursor: proto2EventsReply.cursor,
            });
            proto2EventsReply = yield dwn.processMessage(alice.did, proto2MessagesQuery.message);
            expect(proto2EventsReply.status.code).equals(200);
            expect((_q = proto2EventsReply.entries) === null || _q === void 0 ? void 0 : _q.length).equals(0);
        }));
    });
}
;
//# sourceMappingURL=messages-query.spec.js.map