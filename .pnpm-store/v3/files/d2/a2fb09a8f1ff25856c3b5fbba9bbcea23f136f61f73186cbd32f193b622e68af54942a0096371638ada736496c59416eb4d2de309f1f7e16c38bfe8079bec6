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
import anyoneCollaborateProtocolDefinition from '../vectors/protocol-definitions/anyone-collaborate.json' assert { type: 'json' };
import authorCanProtocolDefinition from '../vectors/protocol-definitions/author-can.json' assert { type: 'json' };
import friendRoleProtocolDefinition from '../vectors/protocol-definitions/friend-role.json' assert { type: 'json' };
import recipientCanProtocolDefinition from '../vectors/protocol-definitions/recipient-can.json' assert { type: 'json' };
import threadRoleProtocolDefinition from '../vectors/protocol-definitions/thread-role.json' assert { type: 'json' };
import { ArrayUtility } from '../../src/utils/array.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { DwnMethodName } from '../../src/enums/dwn-interface-method.js';
import { Message } from '../../src/core/message.js';
import { normalizeSchemaUrl } from '../../src/utils/url.js';
import { RecordsDeleteHandler } from '../../src/handlers/records-delete.js';
import { stubInterface } from 'ts-sinon';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { TestStubGenerator } from '../utils/test-stub-generator.js';
import { Time } from '../../src/utils/time.js';
import { DataStream, Dwn, Encoder, Jws, RecordsDelete, RecordsRead, RecordsWrite } from '../../src/index.js';
import { DidKey, UniversalResolver } from '@web5/dids';
chai.use(chaiAsPromised);
export function testRecordsDeleteHandler() {
    describe('RecordsDeleteHandler.handle()', () => {
        let didResolver;
        let messageStore;
        let dataStore;
        let resumableTaskStore;
        let eventLog;
        let eventStream;
        let dwn;
        describe('functional tests', () => {
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
            it('should handle RecordsDelete successfully and return 404 if deleting a deleted record', () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // insert data
                const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(writeReply.status.code).to.equal(202);
                // ensure data is inserted
                const queryData = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: { recordId: message.recordId }
                });
                const reply = yield dwn.processMessage(alice.did, queryData.message);
                expect(reply.status.code).to.equal(200);
                expect((_a = reply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(1);
                // testing delete
                const recordsDelete = yield RecordsDelete.create({
                    recordId: message.recordId,
                    signer: Jws.createSigner(alice)
                });
                const deleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                expect(deleteReply.status.code).to.equal(202);
                // ensure a query will no longer find the deleted record
                const reply2 = yield dwn.processMessage(alice.did, queryData.message);
                expect(reply2.status.code).to.equal(200);
                expect((_b = reply2.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(0);
                // testing deleting a deleted record
                const recordsDelete2 = yield RecordsDelete.create({
                    recordId: message.recordId,
                    signer: Jws.createSigner(alice)
                });
                const recordsDelete2Reply = yield dwn.processMessage(alice.did, recordsDelete2.message);
                expect(recordsDelete2Reply.status.code).to.equal(404);
            }));
            it('should not affect other records or tenants with the same data', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const data = Encoder.stringToBytes('test');
                // alice writes a records with data
                const aliceWriteData = yield TestDataGenerator.generateRecordsWrite({ author: alice, data });
                const aliceWriteReply = yield dwn.processMessage(alice.did, aliceWriteData.message, { dataStream: aliceWriteData.dataStream });
                expect(aliceWriteReply.status.code).to.equal(202);
                // alice writes another record with the same data
                const aliceWrite2Data = yield TestDataGenerator.generateRecordsWrite({ author: alice, data });
                const aliceWrite2Reply = yield dwn.processMessage(alice.did, aliceWrite2Data.message, { dataStream: aliceWrite2Data.dataStream });
                expect(aliceWrite2Reply.status.code).to.equal(202);
                // bob writes a records with same data
                const bobWriteData = yield TestDataGenerator.generateRecordsWrite({ author: bob, data });
                const bobWriteReply = yield dwn.processMessage(bob.did, bobWriteData.message, { dataStream: bobWriteData.dataStream });
                expect(bobWriteReply.status.code).to.equal(202);
                // bob writes another record with the same data
                const bobWrite2Data = yield TestDataGenerator.generateRecordsWrite({ author: bob, data });
                const bobWrite2Reply = yield dwn.processMessage(bob.did, bobWrite2Data.message, { dataStream: bobWrite2Data.dataStream });
                expect(bobWrite2Reply.status.code).to.equal(202);
                // alice deletes one of the two records
                const aliceDeleteWriteData = yield TestDataGenerator.generateRecordsDelete({
                    author: alice,
                    recordId: aliceWriteData.message.recordId
                });
                const aliceDeleteWriteReply = yield dwn.processMessage(alice.did, aliceDeleteWriteData.message);
                expect(aliceDeleteWriteReply.status.code).to.equal(202);
                // verify the other record with the same data is unaffected
                const aliceRead1 = yield RecordsRead.create({
                    filter: {
                        recordId: aliceWrite2Data.message.recordId,
                    },
                    signer: Jws.createSigner(alice)
                });
                const aliceRead1Reply = yield dwn.processMessage(alice.did, aliceRead1.message);
                expect(aliceRead1Reply.status.code).to.equal(200);
                const aliceDataFetched = yield DataStream.toBytes(aliceRead1Reply.record.data);
                expect(ArrayUtility.byteArraysEqual(aliceDataFetched, data)).to.be.true;
                // alice deletes the other record
                const aliceDeleteWrite2Data = yield TestDataGenerator.generateRecordsDelete({
                    author: alice,
                    recordId: aliceWrite2Data.message.recordId
                });
                const aliceDeleteWrite2Reply = yield dwn.processMessage(alice.did, aliceDeleteWrite2Data.message);
                expect(aliceDeleteWrite2Reply.status.code).to.equal(202);
                // verify that alice can no longer fetch the 2nd record
                const aliceRead2Reply = yield dwn.processMessage(alice.did, aliceRead1.message);
                expect(aliceRead2Reply.status.code).to.equal(404);
                // verify that bob can still fetch record with the same data
                const bobRead1 = yield RecordsRead.create({
                    filter: {
                        recordId: bobWriteData.message.recordId,
                    },
                    signer: Jws.createSigner(bob)
                });
                const bobRead1Reply = yield dwn.processMessage(bob.did, bobRead1.message);
                expect(bobRead1Reply.status.code).to.equal(200);
                const bobDataFetched = yield DataStream.toBytes(bobRead1Reply.record.data);
                expect(ArrayUtility.byteArraysEqual(bobDataFetched, data)).to.be.true;
            }));
            it('should return 404 if deleting a non-existent record', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // testing deleting a non-existent record
                const recordsDelete = yield RecordsDelete.create({
                    recordId: 'nonExistentRecordId',
                    signer: Jws.createSigner(alice)
                });
                const deleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                expect(deleteReply.status.code).to.equal(404);
            }));
            it('should be disallowed if there is a newer RecordsWrite already in the DWN ', () => __awaiter(this, void 0, void 0, function* () {
                var _c;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // initial write
                const initialWriteData = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const initialWriteReply = yield dwn.processMessage(alice.did, initialWriteData.message, { dataStream: initialWriteData.dataStream });
                expect(initialWriteReply.status.code).to.equal(202);
                // generate subsequent write and delete with the delete having an earlier timestamp
                // NOTE: creating RecordsDelete first ensures it has an earlier `messageTimestamp` time
                const recordsDelete = yield RecordsDelete.create({
                    recordId: initialWriteData.message.recordId,
                    signer: Jws.createSigner(alice)
                });
                yield Time.minimalSleep();
                const subsequentWriteData = yield TestDataGenerator.generateFromRecordsWrite({
                    existingWrite: initialWriteData.recordsWrite,
                    author: alice
                });
                // subsequent write
                const subsequentWriteReply = yield dwn.processMessage(alice.did, subsequentWriteData.message, { dataStream: subsequentWriteData.dataStream });
                expect(subsequentWriteReply.status.code).to.equal(202);
                // test that a delete with an earlier `messageTimestamp` results in a 409
                const deleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                expect(deleteReply.status.code).to.equal(409);
                // ensure data still exists
                const queryData = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: { recordId: initialWriteData.message.recordId }
                });
                const expectedEncodedData = Encoder.bytesToBase64Url(subsequentWriteData.dataBytes);
                const reply = yield dwn.processMessage(alice.did, queryData.message);
                expect(reply.status.code).to.equal(200);
                expect((_c = reply.entries) === null || _c === void 0 ? void 0 : _c.length).to.equal(1);
                expect(reply.entries[0].encodedData).to.equal(expectedEncodedData);
            }));
            it('should be able to delete then rewrite the same data', () => __awaiter(this, void 0, void 0, function* () {
                var _d, _e, _f;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const data = Encoder.stringToBytes('test');
                const encodedData = Encoder.bytesToBase64Url(data);
                // alice writes a record
                const aliceWriteData = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    data
                });
                const aliceWriteReply = yield dwn.processMessage(alice.did, aliceWriteData.message, { dataStream: aliceWriteData.dataStream });
                expect(aliceWriteReply.status.code).to.equal(202);
                const aliceQueryWriteAfterAliceWriteData = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: { recordId: aliceWriteData.message.recordId }
                });
                const aliceQueryWriteAfterAliceWriteReply = yield dwn.processMessage(alice.did, aliceQueryWriteAfterAliceWriteData.message);
                expect(aliceQueryWriteAfterAliceWriteReply.status.code).to.equal(200);
                expect((_d = aliceQueryWriteAfterAliceWriteReply.entries) === null || _d === void 0 ? void 0 : _d.length).to.equal(1);
                expect(aliceQueryWriteAfterAliceWriteReply.entries[0].encodedData).to.equal(encodedData);
                // alice deleting the record
                const aliceDeleteWriteData = yield TestDataGenerator.generateRecordsDelete({
                    author: alice,
                    recordId: aliceWriteData.message.recordId
                });
                const aliceDeleteWriteReply = yield dwn.processMessage(alice.did, aliceDeleteWriteData.message);
                expect(aliceDeleteWriteReply.status.code).to.equal(202);
                const aliceQueryWriteAfterAliceDeleteData = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: { recordId: aliceWriteData.message.recordId }
                });
                const aliceQueryWriteAfterAliceDeleteReply = yield dwn.processMessage(alice.did, aliceQueryWriteAfterAliceDeleteData.message);
                expect(aliceQueryWriteAfterAliceDeleteReply.status.code).to.equal(200);
                expect((_e = aliceQueryWriteAfterAliceDeleteReply.entries) === null || _e === void 0 ? void 0 : _e.length).to.equal(0);
                // alice writes a new record with the same data
                const aliceRewriteData = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    data
                });
                const aliceRewriteReply = yield dwn.processMessage(alice.did, aliceRewriteData.message, { dataStream: aliceRewriteData.dataStream });
                expect(aliceRewriteReply.status.code).to.equal(202);
                const aliceQueryWriteAfterAliceRewriteData = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: { recordId: aliceRewriteData.message.recordId }
                });
                const aliceQueryWriteAfterAliceRewriteReply = yield dwn.processMessage(alice.did, aliceQueryWriteAfterAliceRewriteData.message);
                expect(aliceQueryWriteAfterAliceRewriteReply.status.code).to.equal(200);
                expect((_f = aliceQueryWriteAfterAliceRewriteReply.entries) === null || _f === void 0 ? void 0 : _f.length).to.equal(1);
                expect(aliceQueryWriteAfterAliceRewriteReply.entries[0].encodedData).to.equal(encodedData);
            }));
            describe('protocol based deletes', () => {
                it('should allow delete with allow-anyone rule', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice creates a record in her DWN. Bob (anyone) is able to delete the record.
                    const protocolDefinition = anyoneCollaborateProtocolDefinition;
                    const alice = yield TestDataGenerator.generatePersona();
                    const bob = yield TestDataGenerator.generatePersona();
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    // setting up a stub DID resolver
                    TestStubGenerator.stubDidResolver(didResolver, [alice, bob]);
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Alice writes a record
                    const recordsWrite = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'doc',
                    });
                    const recordsWriteReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream: recordsWrite.dataStream });
                    expect(recordsWriteReply.status.code).to.eq(202);
                    // Bob (anyone) is able to delete the record
                    const recordsDelete = yield TestDataGenerator.generateRecordsDelete({
                        author: bob,
                        recordId: recordsWrite.message.recordId,
                    });
                    const recordsDeleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                    expect(recordsDeleteReply.status.code).to.eq(202);
                }));
                describe('recipient rules', () => {
                    it('should allow delete with ancestor recipient rule', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice creates a 'post' with Bob as recipient and a 'post/tag'. Bob is able to delete
                        //           the 'chat/tag' because he was recipient of the 'chat'. Carol is not able to delete.
                        const protocolDefinition = recipientCanProtocolDefinition;
                        const alice = yield TestDataGenerator.generatePersona();
                        const bob = yield TestDataGenerator.generatePersona();
                        const carol = yield TestDataGenerator.generatePersona();
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition
                        });
                        // setting up a stub DID resolver
                        TestStubGenerator.stubDidResolver(didResolver, [alice, bob, carol]);
                        const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolsConfigureReply.status.code).to.equal(202);
                        // Alice writes a chat
                        const chatRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: bob.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'post',
                        });
                        const chatRecordsWriteReply = yield dwn.processMessage(alice.did, chatRecordsWrite.message, { dataStream: chatRecordsWrite.dataStream });
                        expect(chatRecordsWriteReply.status.code).to.eq(202);
                        // Alice writes a 'chat/tag'
                        const tagRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'post/tag',
                            parentContextId: chatRecordsWrite.message.contextId,
                        });
                        const tagRecordsWriteReply = yield dwn.processMessage(alice.did, tagRecordsWrite.message, { dataStream: tagRecordsWrite.dataStream });
                        expect(tagRecordsWriteReply.status.code).to.eq(202);
                        // Carol is unable to delete the 'chat/tag'
                        const recordsDeleteCarol = yield TestDataGenerator.generateRecordsDelete({
                            author: carol,
                            recordId: tagRecordsWrite.message.recordId,
                        });
                        const recordsDeleteCarolReply = yield dwn.processMessage(alice.did, recordsDeleteCarol.message);
                        expect(recordsDeleteCarolReply.status.code).to.eq(401);
                        expect(recordsDeleteCarolReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                        // Bob is able to delete the 'chat/tag'
                        const recordsDelete = yield TestDataGenerator.generateRecordsDelete({
                            author: bob,
                            recordId: tagRecordsWrite.message.recordId,
                        });
                        const recordsDeleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                        expect(recordsDeleteReply.status.code).to.eq(202);
                    }));
                    it('should allow delete with direct recipient rule', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice creates a 'post' with Bob as recipient. Bob is able to delete
                        //           the 'post' because he was recipient of it. Carol is not able to delete.
                        const protocolDefinition = recipientCanProtocolDefinition;
                        const alice = yield TestDataGenerator.generatePersona();
                        const bob = yield TestDataGenerator.generatePersona();
                        const carol = yield TestDataGenerator.generatePersona();
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition
                        });
                        // setting up a stub DID resolver
                        TestStubGenerator.stubDidResolver(didResolver, [alice, bob, carol]);
                        const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolsConfigureReply.status.code).to.equal(202);
                        // Alice creates a 'post' with Bob as recipient
                        const recordsWrite = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: bob.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'post',
                        });
                        const recordsWriteReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream: recordsWrite.dataStream });
                        expect(recordsWriteReply.status.code).to.eq(202);
                        // Carol is unable to delete the 'post'
                        const carolRecordsDelete = yield TestDataGenerator.generateRecordsDelete({
                            author: carol,
                            recordId: recordsWrite.message.recordId,
                        });
                        const carolRecordsDeleteReply = yield dwn.processMessage(alice.did, carolRecordsDelete.message);
                        expect(carolRecordsDeleteReply.status.code).to.eq(401);
                        expect(carolRecordsDeleteReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                        // Bob is able to delete the post
                        const bobRecordsDelete = yield TestDataGenerator.generateRecordsDelete({
                            author: bob,
                            recordId: recordsWrite.message.recordId,
                        });
                        const bobRecordsDeleteReply = yield dwn.processMessage(alice.did, bobRecordsDelete.message);
                        expect(bobRecordsDeleteReply.status.code).to.eq(202);
                    }));
                });
                describe('author action rules', () => {
                    it('allow author to delete with ancestor author rule', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Bob writes a 'post' and Alice writes a 'post/comment' to her DWN. Bob deletes the comment
                        //           because author of post can delete. Carol is unable to delete the comment.
                        const protocolDefinition = authorCanProtocolDefinition;
                        const alice = yield TestDataGenerator.generatePersona();
                        const bob = yield TestDataGenerator.generatePersona();
                        const carol = yield TestDataGenerator.generatePersona();
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition
                        });
                        // setting up a stub DID resolver
                        TestStubGenerator.stubDidResolver(didResolver, [alice, bob, carol]);
                        const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolsConfigureReply.status.code).to.equal(202);
                        // Bob writes a post
                        const postRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                            author: bob,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'post',
                        });
                        const postRecordsWriteReply = yield dwn.processMessage(alice.did, postRecordsWrite.message, { dataStream: postRecordsWrite.dataStream });
                        expect(postRecordsWriteReply.status.code).to.eq(202);
                        // Alice writes a 'post/comment'
                        const commentRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'post/comment',
                            parentContextId: postRecordsWrite.message.contextId,
                        });
                        const commentRecordsWriteReply = yield dwn.processMessage(alice.did, commentRecordsWrite.message, { dataStream: commentRecordsWrite.dataStream });
                        expect(commentRecordsWriteReply.status.code).to.eq(202);
                        // Carol is unable to delete Alice's 'post/comment'
                        const recordsDeleteCarol = yield TestDataGenerator.generateRecordsDelete({
                            author: carol,
                            recordId: commentRecordsWrite.message.recordId,
                        });
                        const recordsDeleteCarolReply = yield dwn.processMessage(alice.did, recordsDeleteCarol.message);
                        expect(recordsDeleteCarolReply.status.code).to.eq(401);
                        expect(recordsDeleteCarolReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                        // Bob is able to delete the Alice's 'post/comment'
                        const recordsDelete = yield TestDataGenerator.generateRecordsDelete({
                            author: bob,
                            recordId: commentRecordsWrite.message.recordId,
                        });
                        const recordsDeleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                        expect(recordsDeleteReply.status.code).to.eq(202);
                    }));
                });
                describe('role based deletes', () => {
                    it('should allow co-delete by invoking a context role', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice adds Bob as a 'thread/admin' role. She writes a 'thread/chat'.
                        //           Bob invokes his admin role to delete the 'thread/chat'. Carol is unable to delete
                        //           the 'thread/chat'.
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
                        // Alice creates a thread
                        const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: bob.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread'
                        });
                        const threadRecordReply = yield dwn.processMessage(alice.did, threadRecord.message, { dataStream: threadRecord.dataStream });
                        expect(threadRecordReply.status.code).to.equal(202);
                        // Alice adds Bob as a 'thread/admin' in that thread
                        const participantRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: bob.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread/admin',
                            parentContextId: threadRecord.message.contextId,
                        });
                        const participantRecordReply = yield dwn.processMessage(alice.did, participantRecord.message, { dataStream: participantRecord.dataStream });
                        expect(participantRecordReply.status.code).to.equal(202);
                        // Alice writes a chat message in that thread
                        const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: alice.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread/chat',
                            parentContextId: threadRecord.message.contextId,
                        });
                        const chatRecordReply = yield dwn.processMessage(alice.did, chatRecord.message, { dataStream: chatRecord.dataStream });
                        expect(chatRecordReply.status.code).to.equal(202);
                        // Verifies that Carol cannot delete without appropriate role
                        const chatDeleteCarol = yield TestDataGenerator.generateRecordsDelete({
                            author: carol,
                            recordId: chatRecord.message.recordId,
                        });
                        const chatDeleteReplyCarol = yield dwn.processMessage(alice.did, chatDeleteCarol.message);
                        expect(chatDeleteReplyCarol.status.code).to.eq(401);
                        expect(chatDeleteReplyCarol.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                        // Bob invokes the role to delete the chat message
                        const chatDelete = yield TestDataGenerator.generateRecordsDelete({
                            author: bob,
                            recordId: chatRecord.message.recordId,
                            protocolRole: 'thread/admin',
                        });
                        const chatDeleteReply = yield dwn.processMessage(alice.did, chatDelete.message);
                        expect(chatDeleteReply.status.code).to.equal(202);
                    }));
                    it('should allow co-delete invoking a root-level role', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice adds Bob as a root-level 'admin' role. She writes a 'chat'.
                        //           Bob invokes his admin role to delete the 'chat'.
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
                        // Alice adds Bob as a 'thread/admin' in that thread
                        const participantRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: bob.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'admin',
                        });
                        const participantRecordReply = yield dwn.processMessage(alice.did, participantRecord.message, { dataStream: participantRecord.dataStream });
                        expect(participantRecordReply.status.code).to.equal(202);
                        // Alice writes a chat message in that thread
                        const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: alice.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'chat',
                        });
                        const chatRecordReply = yield dwn.processMessage(alice.did, chatRecord.message, { dataStream: chatRecord.dataStream });
                        expect(chatRecordReply.status.code).to.equal(202);
                        // Carol is unable to delete the chat message
                        const chatDeleteCarol = yield TestDataGenerator.generateRecordsDelete({
                            author: carol,
                            recordId: chatRecord.message.recordId,
                        });
                        const chatDeleteCarolReply = yield dwn.processMessage(alice.did, chatDeleteCarol.message);
                        expect(chatDeleteCarolReply.status.code).to.equal(401);
                        expect(chatDeleteCarolReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                        // Bob invokes the role to delete the chat message
                        const chatDelete = yield TestDataGenerator.generateRecordsDelete({
                            author: bob,
                            recordId: chatRecord.message.recordId,
                            protocolRole: 'admin',
                        });
                        const chatDeleteReply = yield dwn.processMessage(alice.did, chatDelete.message);
                        expect(chatDeleteReply.status.code).to.equal(202);
                    }));
                });
            });
            it('should return 401 if message is not authorized', () => __awaiter(this, void 0, void 0, function* () {
                // scenario: Alice creates a record and Bob is unable to delete it.
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const recordsWrite = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                });
                const recordsWriteReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream: recordsWrite.dataStream });
                expect(recordsWriteReply.status.code).to.equal(202);
                const recordsDelete = yield TestDataGenerator.generateRecordsDelete({
                    author: bob,
                    recordId: recordsWrite.message.recordId,
                });
                const recordsDeleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                expect(recordsDeleteReply.status.code).to.equal(401);
                expect(recordsDeleteReply.status.detail).to.contain(DwnErrorCode.RecordsDeleteAuthorizationFailed);
            }));
            it('should index additional properties from the RecordsWrite being deleted', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // initial write
                const initialWriteData = yield TestDataGenerator.generateRecordsWrite({ author: alice, schema: 'testSchema' });
                const initialWriteReply = yield dwn.processMessage(alice.did, initialWriteData.message, { dataStream: initialWriteData.dataStream });
                expect(initialWriteReply.status.code).to.equal(202);
                // generate subsequent write and delete with the delete having an earlier timestamp
                // NOTE: creating RecordsDelete first ensures it has an earlier `messageTimestamp` time
                const recordsDelete = yield RecordsDelete.create({
                    recordId: initialWriteData.message.recordId,
                    signer: Jws.createSigner(alice)
                });
                const deleteMessageCid = yield Message.getCid(recordsDelete.message);
                const deleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                expect(deleteReply.status.code).to.equal(202);
                // message store
                const { messages } = yield messageStore.query(alice.did, [{ schema: normalizeSchemaUrl('testSchema'), method: DwnMethodName.Delete }]);
                expect(messages.length).to.equal(1);
                expect(yield Message.getCid(messages[0])).to.equal(deleteMessageCid);
                // event log
                const { events } = yield eventLog.queryEvents(alice.did, [{ schema: normalizeSchemaUrl('testSchema'), method: DwnMethodName.Delete }]);
                expect(events.length).to.equal(1);
                expect(events[0]).to.equal(deleteMessageCid);
            }));
            describe('event log', () => {
                it('should include RecordsDelete event and keep initial RecordsWrite event', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                    const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                    expect(writeReply.status.code).to.equal(202);
                    const recordsDelete = yield RecordsDelete.create({
                        recordId: message.recordId,
                        signer: Jws.createSigner(alice)
                    });
                    const deleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                    expect(deleteReply.status.code).to.equal(202);
                    const { events } = yield eventLog.getEvents(alice.did);
                    expect(events.length).to.equal(2);
                    const writeMessageCid = yield Message.getCid(message);
                    const deleteMessageCid = yield Message.getCid(recordsDelete.message);
                    const expectedMessageCids = new Set([writeMessageCid, deleteMessageCid]);
                    for (const messageCid of events) {
                        expectedMessageCids.delete(messageCid);
                    }
                    expect(expectedMessageCids.size).to.equal(0);
                }));
                it('should only keep first write and delete when subsequent writes happen', () => __awaiter(this, void 0, void 0, function* () {
                    const { message, author, dataStream, recordsWrite } = yield TestDataGenerator.generateRecordsWrite();
                    TestStubGenerator.stubDidResolver(didResolver, [author]);
                    const reply = yield dwn.processMessage(author.did, message, { dataStream });
                    expect(reply.status.code).to.equal(202);
                    const newWrite = yield RecordsWrite.createFrom({
                        recordsWriteMessage: recordsWrite.message,
                        published: true,
                        signer: Jws.createSigner(author)
                    });
                    const newWriteReply = yield dwn.processMessage(author.did, newWrite.message);
                    expect(newWriteReply.status.code).to.equal(202);
                    const recordsDelete = yield RecordsDelete.create({
                        recordId: message.recordId,
                        signer: Jws.createSigner(author)
                    });
                    const deleteReply = yield dwn.processMessage(author.did, recordsDelete.message);
                    expect(deleteReply.status.code).to.equal(202);
                    const { events } = yield eventLog.getEvents(author.did);
                    expect(events.length).to.equal(2);
                    const deletedMessageCid = yield Message.getCid(newWrite.message);
                    for (const messageCid of events) {
                        if (messageCid === deletedMessageCid) {
                            expect.fail(`${messageCid} should not exist`);
                        }
                    }
                }));
            });
        });
        it('should return 401 if signature check fails', () => __awaiter(this, void 0, void 0, function* () {
            const { author, message } = yield TestDataGenerator.generateRecordsDelete();
            const tenant = author.did;
            // setting up a stub did resolver & message store
            // intentionally not supplying the public key so a different public key is generated to simulate invalid signature
            const mismatchingPersona = yield TestDataGenerator.generatePersona({ did: author.did, keyId: author.keyId });
            const didResolver = TestStubGenerator.createDidResolverStub(mismatchingPersona);
            const messageStore = stubInterface();
            const resumableTaskManager = stubInterface();
            const recordsDeleteHandler = new RecordsDeleteHandler(didResolver, messageStore, resumableTaskManager);
            const reply = yield recordsDeleteHandler.handle({ tenant, message });
            expect(reply.status.code).to.equal(401);
        }));
        it('should return 400 if fail parsing the message', () => __awaiter(this, void 0, void 0, function* () {
            const { author, message } = yield TestDataGenerator.generateRecordsDelete();
            const tenant = author.did;
            // setting up a stub method resolver & message store
            const messageStore = stubInterface();
            const resumableTaskManager = stubInterface();
            const recordsDeleteHandler = new RecordsDeleteHandler(didResolver, messageStore, resumableTaskManager);
            // stub the `parse()` function to throw an error
            sinon.stub(RecordsDelete, 'parse').throws('anyError');
            const reply = yield recordsDeleteHandler.handle({ tenant, message });
            expect(reply.status.code).to.equal(400);
        }));
    });
}
//# sourceMappingURL=records-delete.spec.js.map