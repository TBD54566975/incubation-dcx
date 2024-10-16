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
import messageProtocolDefinition from '../vectors/protocol-definitions/message.json' assert { type: 'json' };
import nestedProtocolDefinition from '../vectors/protocol-definitions/nested.json' assert { type: 'json' };
import { DwnInterfaceName } from '../../src/enums/dwn-interface-method.js';
import { Message } from '../../src/core/message.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DataStream, Dwn, DwnConstant, DwnErrorCode, Jws, ProtocolsConfigure, RecordsDelete, RecordsQuery, RecordsWrite, SortDirection } from '../../src/index.js';
import { DidKey, UniversalResolver } from '@web5/dids';
chai.use(chaiAsPromised);
export function testRecordsPrune() {
    describe('records pruning', () => {
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
        it('should prune all descendants when given RecordsDelete with `prune` set to `true`', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            // install a protocol with foo <- bar <- baz structure
            const nestedProtocol = nestedProtocolDefinition;
            const protocolsConfig = yield ProtocolsConfigure.create({
                definition: nestedProtocol,
                signer: Jws.createSigner(alice)
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // writes 2 foos, 2 bars under foo1, and 2 bazes under bar1
            // write 2 foos
            const fooData = TestDataGenerator.randomBytes(100);
            const fooOptions = {
                signer: Jws.createSigner(alice),
                protocol: nestedProtocol.protocol,
                protocolPath: 'foo',
                schema: nestedProtocol.types.foo.schema,
                dataFormat: nestedProtocol.types.foo.dataFormats[0],
                data: fooData
            };
            const foo1 = yield RecordsWrite.create(fooOptions);
            const foo1WriteResponse = yield dwn.processMessage(alice.did, foo1.message, { dataStream: DataStream.fromBytes(fooData) });
            expect(foo1WriteResponse.status.code).equals(202);
            const foo2 = yield RecordsWrite.create(fooOptions);
            const foo2WriteResponse = yield dwn.processMessage(alice.did, foo2.message, { dataStream: DataStream.fromBytes(fooData) });
            expect(foo2WriteResponse.status.code).equals(202);
            // write 2 bars under foo1 with data large enough to be required to be stored in the data store so we can test purge in data store
            const barData = TestDataGenerator.randomBytes(DwnConstant.maxDataSizeAllowedToBeEncoded + 1);
            const barOptions = {
                signer: Jws.createSigner(alice),
                protocol: nestedProtocol.protocol,
                protocolPath: 'foo/bar',
                schema: nestedProtocol.types.bar.schema,
                dataFormat: nestedProtocol.types.bar.dataFormats[0],
                parentContextId: foo1.message.contextId,
                data: barData
            };
            const bar1 = yield RecordsWrite.create(Object.assign({}, barOptions));
            const bar1WriteResponse = yield dwn.processMessage(alice.did, bar1.message, { dataStream: DataStream.fromBytes(barData) });
            expect(bar1WriteResponse.status.code).equals(202);
            const bar2 = yield RecordsWrite.create(Object.assign({}, barOptions));
            const bar2WriteResponse = yield dwn.processMessage(alice.did, bar2.message, { dataStream: DataStream.fromBytes(barData) });
            expect(bar2WriteResponse.status.code).equals(202);
            // write 2 bazes under bar1, each has more than 1 message associated with the record so we can test multi-message purge
            const bazData = TestDataGenerator.randomBytes(100);
            const bazOptions = {
                signer: Jws.createSigner(alice),
                protocol: nestedProtocol.protocol,
                protocolPath: 'foo/bar/baz',
                schema: nestedProtocol.types.baz.schema,
                dataFormat: nestedProtocol.types.baz.dataFormats[0],
                parentContextId: bar1.message.contextId,
                data: bazData
            };
            const baz1 = yield RecordsWrite.create(Object.assign({}, bazOptions));
            const baz1WriteResponse = yield dwn.processMessage(alice.did, baz1.message, { dataStream: DataStream.fromBytes(bazData) });
            expect(baz1WriteResponse.status.code).equals(202);
            const baz2 = yield RecordsWrite.create(Object.assign({}, bazOptions));
            const baz2WriteResponse = yield dwn.processMessage(alice.did, baz2.message, { dataStream: DataStream.fromBytes(bazData) });
            expect(baz2WriteResponse.status.code).equals(202);
            // make latest state of baz1 a `RecordsWrite`
            const newBaz1Data = TestDataGenerator.randomBytes(100);
            const baz1Update = yield RecordsWrite.createFrom({
                signer: Jws.createSigner(alice),
                recordsWriteMessage: baz1.message,
                data: newBaz1Data
            });
            const baz1UpdateResponse = yield dwn.processMessage(alice.did, baz1Update.message, { dataStream: DataStream.fromBytes(newBaz1Data) });
            expect(baz1UpdateResponse.status.code).equals(202);
            // make latest state of baz2 a `RecordsDelete`
            const baz2Delete = yield RecordsDelete.create({
                signer: Jws.createSigner(alice),
                recordId: baz2.message.recordId
            });
            const baz2DeleteResponse = yield dwn.processMessage(alice.did, baz2Delete.message);
            expect(baz2DeleteResponse.status.code).equals(202);
            // sanity test messages are inserted in message store
            const queryFilter = [{
                    interface: DwnInterfaceName.Records,
                    protocol: nestedProtocol.protocol
                }];
            const queryResult = yield messageStore.query(alice.did, queryFilter);
            expect(queryResult.messages.length).to.equal(8); // 2 foos, 2 bars, 2 bazes x 2 messages each
            // sanity test events are inserted in event log
            const { events } = yield eventLog.queryEvents(alice.did, queryFilter);
            expect(events.length).to.equal(8);
            // sanity test data is inserted in data store
            const bar1DataGetResult = yield dataStore.get(alice.did, bar1.message.recordId, bar1.message.descriptor.dataCid);
            const bar2DataGetResult = yield dataStore.get(alice.did, bar2.message.recordId, bar2.message.descriptor.dataCid);
            expect(bar1DataGetResult).to.not.be.undefined;
            expect(bar2DataGetResult).to.not.be.undefined;
            // Delete foo1 with prune enabled
            const foo1Delete = yield RecordsDelete.create({
                recordId: foo1.message.recordId,
                prune: true,
                signer: Jws.createSigner(alice)
            });
            const deleteReply = yield dwn.processMessage(alice.did, foo1Delete.message);
            expect(deleteReply.status.code).to.equal(202);
            // verify all bar and baz message are permanently deleted
            const queryResult2 = yield messageStore.query(alice.did, queryFilter, { messageTimestamp: SortDirection.Ascending });
            expect(queryResult2.messages.length).to.equal(3); // foo2 RecordsWrite, foo1 RecordsWrite and RecordsDelete
            expect(queryResult2.messages[0]).to.deep.include(foo1.message);
            expect(queryResult2.messages[1]).to.deep.include(foo2.message);
            expect(queryResult2.messages[2]).to.deep.include(foo1Delete.message);
            // verify all bar and baz events are permanently deleted
            const { events: events2 } = yield eventLog.queryEvents(alice.did, queryFilter);
            expect(events2.length).to.equal(3);
            const foo1RecordsWriteCid = yield Message.getCid(foo1.message);
            const foo2RecordsWriteCid = yield Message.getCid(foo2.message);
            const foo2RecordsDeleteCid = yield Message.getCid(foo1Delete.message);
            expect(events2).to.contain.members([foo1RecordsWriteCid, foo2RecordsWriteCid, foo2RecordsDeleteCid]);
            // verify all bar data are permanently deleted
            const bar1DataGetResult2 = yield dataStore.get(alice.did, bar1.message.recordId, bar1.message.descriptor.dataCid);
            const bar2DataGetResult2 = yield dataStore.get(alice.did, bar2.message.recordId, bar2.message.descriptor.dataCid);
            expect(bar1DataGetResult2).to.be.undefined;
            expect(bar2DataGetResult2).to.be.undefined;
            // sanity test an external query will no longer return the deleted records
            const queryData = yield RecordsQuery.create({
                signer: Jws.createSigner(alice),
                filter: { protocol: nestedProtocol.protocol }
            });
            const reply2 = yield dwn.processMessage(alice.did, queryData.message);
            expect(reply2.status.code).to.equal(200);
            expect((_a = reply2.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(1); // only foo2 is left
            expect(reply2.entries[0]).to.deep.include(foo2.message);
        }));
        it('should allow pruning against a deleted record that is not already pruned', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice has a record `foo` with a descendent chain
            // 2. Alice deletes the record `foo` WITHOUT prune, leaving the descendants intact
            // 3. Verify that Alice is able to perform a prune on `foo` to delete all its descendants
            var _b, _c, _d;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            // install a protocol with foo <- bar <- baz structure
            const nestedProtocol = nestedProtocolDefinition;
            const protocolsConfig = yield ProtocolsConfigure.create({
                definition: nestedProtocol,
                signer: Jws.createSigner(alice)
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 1. Alice has a record `foo` with a descendent chain
            // write foo <- bar <- baz records
            const fooData = TestDataGenerator.randomBytes(100);
            const fooOptions = {
                signer: Jws.createSigner(alice),
                protocol: nestedProtocol.protocol,
                protocolPath: 'foo',
                schema: nestedProtocol.types.foo.schema,
                dataFormat: nestedProtocol.types.foo.dataFormats[0],
                data: fooData
            };
            const foo = yield RecordsWrite.create(fooOptions);
            const fooWriteResponse = yield dwn.processMessage(alice.did, foo.message, { dataStream: DataStream.fromBytes(fooData) });
            expect(fooWriteResponse.status.code).equals(202);
            const barData = TestDataGenerator.randomBytes(100);
            const barOptions = {
                signer: Jws.createSigner(alice),
                protocol: nestedProtocol.protocol,
                protocolPath: 'foo/bar',
                schema: nestedProtocol.types.bar.schema,
                dataFormat: nestedProtocol.types.bar.dataFormats[0],
                parentContextId: foo.message.contextId,
                data: barData
            };
            const bar = yield RecordsWrite.create(Object.assign({}, barOptions));
            const barWriteResponse = yield dwn.processMessage(alice.did, bar.message, { dataStream: DataStream.fromBytes(barData) });
            expect(barWriteResponse.status.code).equals(202);
            const bazData = TestDataGenerator.randomBytes(100);
            const bazOptions = {
                signer: Jws.createSigner(alice),
                protocol: nestedProtocol.protocol,
                protocolPath: 'foo/bar/baz',
                schema: nestedProtocol.types.baz.schema,
                dataFormat: nestedProtocol.types.baz.dataFormats[0],
                parentContextId: bar.message.contextId,
                data: bazData
            };
            const baz = yield RecordsWrite.create(Object.assign({}, bazOptions));
            const bazWriteResponse = yield dwn.processMessage(alice.did, baz.message, { dataStream: DataStream.fromBytes(bazData) });
            expect(bazWriteResponse.status.code).equals(202);
            // sanity records are inserted in message store
            const queryFilter = [{
                    interface: DwnInterfaceName.Records,
                    protocol: nestedProtocol.protocol
                }];
            const messagesBeforeDelete = yield messageStore.query(alice.did, queryFilter);
            expect(messagesBeforeDelete.messages.length).to.equal(3);
            // sanity verify RecordsQuery returns no records
            const recordsQuery = yield RecordsQuery.create({
                signer: Jws.createSigner(alice),
                filter: { protocol: nestedProtocol.protocol }
            });
            const recordsQueryBeforeDeleteReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryBeforeDeleteReply.status.code).to.equal(200);
            expect((_b = recordsQueryBeforeDeleteReply.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(3);
            // 2. Alice deletes the record `foo` WITHOUT prune, leaving the descendants intact
            const fooDelete = yield RecordsDelete.create({
                recordId: foo.message.recordId,
                // prune    : true, // intentionally showing that this is a RecordsDelete WITHOUT pruning
                signer: Jws.createSigner(alice)
            });
            const deleteReply = yield dwn.processMessage(alice.did, fooDelete.message);
            expect(deleteReply.status.code).to.equal(202);
            // verify bar and baz messages still exists
            const messagesAfterDelete = yield messageStore.query(alice.did, queryFilter, { messageTimestamp: SortDirection.Ascending });
            expect(messagesAfterDelete.messages.length).to.equal(4); // RecordsWrite for foo, bar, baz, and RecordsDelete for foo
            // sanity verify RecordsQuery returns the descendants
            const recordsQueryAfterDeleteReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryAfterDeleteReply.status.code).to.equal(200);
            expect((_c = recordsQueryAfterDeleteReply.entries) === null || _c === void 0 ? void 0 : _c.length).to.equal(2);
            // 3. Verify that Alice is able to perform a prune on `foo` to delete all its descendants
            const fooPrune = yield RecordsDelete.create({
                recordId: foo.message.recordId,
                prune: true,
                signer: Jws.createSigner(alice)
            });
            const pruneReply = yield dwn.processMessage(alice.did, fooPrune.message);
            expect(pruneReply.status.code).to.equal(202);
            // verify bar and baz messages are permanently deleted
            const messagesAfterPrune = yield messageStore.query(alice.did, queryFilter, { messageTimestamp: SortDirection.Ascending });
            expect(messagesAfterPrune.messages.length).to.equal(2); // just RecordsWrite and RecordsDelete for foo
            expect(messagesAfterPrune.messages[0]).to.deep.include(foo.message);
            expect(messagesAfterPrune.messages[1]).to.deep.include(fooPrune.message);
            // sanity verify RecordsQuery returns no records
            const recordsQueryAfterPruneReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryAfterPruneReply.status.code).to.equal(200);
            expect((_d = recordsQueryAfterPruneReply.entries) === null || _d === void 0 ? void 0 : _d.length).to.equal(0);
        }));
        it('should return 404 when attempting to prune against a record that is already pruned', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice has a record `foo` with a descendent chain
            // 2. Alice prunes the record `foo`
            // 3. Verify that Alice is unable to perform a prune on `foo` again
            var _e;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            // install a protocol with foo <- bar <- baz structure
            const nestedProtocol = nestedProtocolDefinition;
            const protocolsConfig = yield ProtocolsConfigure.create({
                definition: nestedProtocol,
                signer: Jws.createSigner(alice)
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 1. Alice has a record `foo` with a descendent chain
            // write foo <- bar <- baz records
            const fooData = TestDataGenerator.randomBytes(100);
            const fooOptions = {
                signer: Jws.createSigner(alice),
                protocol: nestedProtocol.protocol,
                protocolPath: 'foo',
                schema: nestedProtocol.types.foo.schema,
                dataFormat: nestedProtocol.types.foo.dataFormats[0],
                data: fooData
            };
            const foo = yield RecordsWrite.create(fooOptions);
            const fooWriteResponse = yield dwn.processMessage(alice.did, foo.message, { dataStream: DataStream.fromBytes(fooData) });
            expect(fooWriteResponse.status.code).equals(202);
            const barData = TestDataGenerator.randomBytes(100);
            const barOptions = {
                signer: Jws.createSigner(alice),
                protocol: nestedProtocol.protocol,
                protocolPath: 'foo/bar',
                schema: nestedProtocol.types.bar.schema,
                dataFormat: nestedProtocol.types.bar.dataFormats[0],
                parentContextId: foo.message.contextId,
                data: barData
            };
            const bar = yield RecordsWrite.create(Object.assign({}, barOptions));
            const barWriteResponse = yield dwn.processMessage(alice.did, bar.message, { dataStream: DataStream.fromBytes(barData) });
            expect(barWriteResponse.status.code).equals(202);
            const bazData = TestDataGenerator.randomBytes(100);
            const bazOptions = {
                signer: Jws.createSigner(alice),
                protocol: nestedProtocol.protocol,
                protocolPath: 'foo/bar/baz',
                schema: nestedProtocol.types.baz.schema,
                dataFormat: nestedProtocol.types.baz.dataFormats[0],
                parentContextId: bar.message.contextId,
                data: bazData
            };
            const baz = yield RecordsWrite.create(Object.assign({}, bazOptions));
            const bazWriteResponse = yield dwn.processMessage(alice.did, baz.message, { dataStream: DataStream.fromBytes(bazData) });
            expect(bazWriteResponse.status.code).equals(202);
            // sanity records are inserted in message store
            const queryFilter = [{
                    interface: DwnInterfaceName.Records,
                    protocol: nestedProtocol.protocol
                }];
            const queryResult = yield messageStore.query(alice.did, queryFilter);
            expect(queryResult.messages.length).to.equal(3);
            // sanity verify RecordsQuery returns no records
            const recordsQuery = yield RecordsQuery.create({
                signer: Jws.createSigner(alice),
                filter: { protocol: nestedProtocol.protocol }
            });
            const recordsQueryBeforeDeleteReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryBeforeDeleteReply.status.code).to.equal(200);
            expect((_e = recordsQueryBeforeDeleteReply.entries) === null || _e === void 0 ? void 0 : _e.length).to.equal(3);
            // 2. Alice prunes the record `foo`
            const fooPrune1 = yield RecordsDelete.create({
                recordId: foo.message.recordId,
                prune: true,
                signer: Jws.createSigner(alice)
            });
            const prune1Reply = yield dwn.processMessage(alice.did, fooPrune1.message);
            expect(prune1Reply.status.code).to.equal(202);
            // 3. Verify that Alice is unable to perform a prune on `foo` again
            const fooPrune2 = yield RecordsDelete.create({
                recordId: foo.message.recordId,
                prune: true,
                signer: Jws.createSigner(alice)
            });
            const prune2Reply = yield dwn.processMessage(alice.did, fooPrune2.message);
            expect(prune2Reply.status.code).to.equal(404);
        }));
        describe('prune and co-prune protocol action', () => {
            it('should only allow a non-owner author to prune if `prune` is allowed and set to `true` in RecordsDelete', () => __awaiter(this, void 0, void 0, function* () {
                // Scenario:
                // 1. Alice installs a protocol allowing others to add and prune records.
                // 2. Bob writes a record + a descendant in Alice's DWN.
                // 3. Verify Bob cannot prune the records if `prune` is not set to `true` in RecordsDelete.
                // 4. Verify Bob can prune the records by setting `prune` to `true` in RecordsDelete.
                var _a;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // 1. Alice installs a protocol allowing others to add and prune records.
                const protocolDefinition = {
                    protocol: 'http://post-protocol.xyz',
                    published: true,
                    types: {
                        post: {},
                        attachment: {}
                    },
                    structure: {
                        post: {
                            $actions: [
                                {
                                    who: 'anyone',
                                    can: [
                                        'create',
                                        'prune',
                                        'read'
                                    ]
                                }
                            ],
                            attachment: {
                                $actions: [
                                    {
                                        who: 'anyone',
                                        can: ['read']
                                    },
                                    {
                                        who: 'author',
                                        of: 'post',
                                        can: ['create']
                                    }
                                ]
                            }
                        }
                    }
                };
                const protocolsConfig = yield ProtocolsConfigure.create({
                    definition: protocolDefinition,
                    signer: Jws.createSigner(alice)
                });
                const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                expect(protocolsConfigureReply.status.code).to.equal(202);
                // 2. Bob writes a record + a descendant in Alice's DWN.
                const postData = TestDataGenerator.randomBytes(100);
                const postOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'post',
                    dataFormat: 'application/json',
                    data: postData
                };
                const post = yield RecordsWrite.create(postOptions);
                const postWriteResponse = yield dwn.processMessage(alice.did, post.message, { dataStream: DataStream.fromBytes(postData) });
                expect(postWriteResponse.status.code).equals(202);
                const attachmentData = TestDataGenerator.randomBytes(100);
                const attachmentOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'post/attachment',
                    parentContextId: post.message.contextId,
                    dataFormat: 'application/octet-stream',
                    data: attachmentData
                };
                const attachment = yield RecordsWrite.create(attachmentOptions);
                const attachmentWriteResponse = yield dwn.processMessage(alice.did, attachment.message, { dataStream: DataStream.fromBytes(attachmentData) });
                expect(attachmentWriteResponse.status.code).equals(202);
                // 3. Verify Bob cannot prune the records if `prune` is not set to `true` in RecordsDelete.
                const unauthorizedPostPrune = yield RecordsDelete.create({
                    recordId: post.message.recordId,
                    // prune    : true, // intentionally not setting `prune` to true
                    signer: Jws.createSigner(bob)
                });
                const unauthorizedPostPruneReply = yield dwn.processMessage(alice.did, unauthorizedPostPrune.message);
                expect(unauthorizedPostPruneReply.status.code).to.equal(401);
                expect(unauthorizedPostPruneReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                // 4. Verify Bob can prune the records by setting `prune` to `true` in RecordsDelete.
                const postPrune = yield RecordsDelete.create({
                    recordId: post.message.recordId,
                    prune: true,
                    signer: Jws.createSigner(bob)
                });
                const pruneReply = yield dwn.processMessage(alice.did, postPrune.message);
                expect(pruneReply.status.code).to.equal(202);
                // sanity test `RecordsQuery` no longer returns the deleted record
                const recordsQuery = yield RecordsQuery.create({
                    signer: Jws.createSigner(bob),
                    filter: { protocol: protocolDefinition.protocol }
                });
                const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
                expect(recordsQueryReply.status.code).to.equal(200);
                expect((_a = recordsQueryReply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(0);
            }));
            it('should not allow a non-owner author to prune if `prune` is not an authorized action', () => __awaiter(this, void 0, void 0, function* () {
                // Scenario:
                // 1. Alice installs a protocol allowing others to add records but not prune.
                // 2. Bob writes a record + a descendant in Alice's DWN.
                // 3. Verify Bob cannot prune the records.
                var _b;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // 1. Alice installs a protocol allowing others to add records but not prune.
                const protocolDefinition = messageProtocolDefinition;
                const protocolsConfig = yield ProtocolsConfigure.create({
                    definition: protocolDefinition,
                    signer: Jws.createSigner(alice)
                });
                const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                expect(protocolsConfigureReply.status.code).to.equal(202);
                // 2. Bob writes a record + a descendant in Alice's DWN.
                const messageData = TestDataGenerator.randomBytes(100);
                const messageOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'message',
                    schema: protocolDefinition.types.message.schema,
                    dataFormat: protocolDefinition.types.message.dataFormats[0],
                    data: messageData
                };
                const message = yield RecordsWrite.create(messageOptions);
                const messageWriteResponse = yield dwn.processMessage(alice.did, message.message, { dataStream: DataStream.fromBytes(messageData) });
                expect(messageWriteResponse.status.code).equals(202);
                const attachmentData = TestDataGenerator.randomBytes(100);
                const attachmentOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'message/attachment',
                    parentContextId: message.message.contextId,
                    dataFormat: 'application/octet-stream',
                    data: attachmentData
                };
                const attachment = yield RecordsWrite.create(attachmentOptions);
                const attachmentWriteResponse = yield dwn.processMessage(alice.did, attachment.message, { dataStream: DataStream.fromBytes(attachmentData) });
                expect(attachmentWriteResponse.status.code).equals(202);
                // 3. Verify Bob cannot prune the records.
                const messagePrune = yield RecordsDelete.create({
                    recordId: message.message.recordId,
                    prune: true,
                    signer: Jws.createSigner(bob)
                });
                const deleteReply = yield dwn.processMessage(alice.did, messagePrune.message);
                expect(deleteReply.status.code).to.equal(401);
                expect(deleteReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                // sanity test `RecordsQuery` still returns the records
                const recordsQuery = yield RecordsQuery.create({
                    signer: Jws.createSigner(alice),
                    filter: { protocol: protocolDefinition.protocol }
                });
                const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
                expect(recordsQueryReply.status.code).to.equal(200);
                expect((_b = recordsQueryReply.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(2);
            }));
            it('should allow a non-author to prune if `co-prune` is allowed and `prune` is set to `true` in RecordsDelete', () => __awaiter(this, void 0, void 0, function* () {
                // Scenario:
                // 1. Alice installs a protocol allowing others to add and prune records.
                // 2. Bob writes a record + a descendant in Alice's DWN.
                // 3. Verify Carol cannot prune the records if `prune` is not set to `true` in RecordsDelete.
                // 4. Verify Carol can prune the records by setting `prune` to `true` in RecordsDelete.
                var _c;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const carol = yield TestDataGenerator.generateDidKeyPersona();
                // 1. Alice installs a protocol allowing others to add and prune records.
                const protocolDefinition = {
                    protocol: 'http://post-protocol.xyz',
                    published: true,
                    types: {
                        post: {},
                        attachment: {}
                    },
                    structure: {
                        post: {
                            $actions: [
                                {
                                    who: 'anyone',
                                    can: [
                                        'create',
                                        'co-prune',
                                        'read'
                                    ]
                                }
                            ],
                            attachment: {
                                $actions: [
                                    {
                                        who: 'anyone',
                                        can: [
                                            'create',
                                            'read'
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                };
                const protocolsConfig = yield ProtocolsConfigure.create({
                    definition: protocolDefinition,
                    signer: Jws.createSigner(alice)
                });
                const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                expect(protocolsConfigureReply.status.code).to.equal(202);
                // 2. Bob writes a record + a descendant in Alice's DWN.
                const postData = TestDataGenerator.randomBytes(100);
                const postOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'post',
                    dataFormat: 'application/json',
                    data: postData
                };
                const post = yield RecordsWrite.create(postOptions);
                const postWriteResponse = yield dwn.processMessage(alice.did, post.message, { dataStream: DataStream.fromBytes(postData) });
                expect(postWriteResponse.status.code).equals(202);
                const attachmentData = TestDataGenerator.randomBytes(100);
                const attachmentOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'post/attachment',
                    parentContextId: post.message.contextId,
                    dataFormat: 'application/octet-stream',
                    data: attachmentData
                };
                const attachment = yield RecordsWrite.create(attachmentOptions);
                const attachmentWriteResponse = yield dwn.processMessage(alice.did, attachment.message, { dataStream: DataStream.fromBytes(attachmentData) });
                expect(attachmentWriteResponse.status.code).equals(202);
                // 3. Verify Carol cannot prune the records if `prune` is not set to `true` in RecordsDelete.
                const unauthorizedPostPrune = yield RecordsDelete.create({
                    recordId: post.message.recordId,
                    // prune    : true, // intentionally not setting `prune` to true
                    signer: Jws.createSigner(carol)
                });
                const unauthorizedPostPruneReply = yield dwn.processMessage(alice.did, unauthorizedPostPrune.message);
                expect(unauthorizedPostPruneReply.status.code).to.equal(401);
                expect(unauthorizedPostPruneReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                // 4. Verify Carol can prune the records by setting `prune` to `true` in RecordsDelete.
                const postPrune = yield RecordsDelete.create({
                    recordId: post.message.recordId,
                    prune: true,
                    signer: Jws.createSigner(carol)
                });
                const deleteReply = yield dwn.processMessage(alice.did, postPrune.message);
                expect(deleteReply.status.code).to.equal(202);
                // sanity test `RecordsQuery` no longer returns the deleted record
                const recordsQuery = yield RecordsQuery.create({
                    signer: Jws.createSigner(bob),
                    filter: { protocol: protocolDefinition.protocol }
                });
                const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
                expect(recordsQueryReply.status.code).to.equal(200);
                expect((_c = recordsQueryReply.entries) === null || _c === void 0 ? void 0 : _c.length).to.equal(0);
            }));
            it('should not allow a non-author to prune if `prune` is allowed but `co-prune` is not allowed', () => __awaiter(this, void 0, void 0, function* () {
                // Scenario:
                // 1. Alice installs a protocol allowing others to add records AND only author to prune.
                // 2. Bob writes a record + a descendant in Alice's DWN.
                // 3. Verify Carol cannot prune the records.
                var _d;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const carol = yield TestDataGenerator.generateDidKeyPersona();
                // 1. Alice installs a protocol allowing others to add records AND only author to prune.
                const protocolDefinition = {
                    protocol: 'http://post-protocol.xyz',
                    published: true,
                    types: {
                        post: {},
                        attachment: {}
                    },
                    structure: {
                        post: {
                            $actions: [
                                {
                                    who: 'anyone',
                                    can: [
                                        'create',
                                        'prune',
                                        'read'
                                    ]
                                }
                            ],
                            attachment: {
                                $actions: [
                                    {
                                        who: 'anyone',
                                        can: ['read']
                                    },
                                    {
                                        who: 'author',
                                        of: 'post',
                                        can: ['create']
                                    }
                                ]
                            }
                        }
                    }
                };
                const protocolsConfig = yield ProtocolsConfigure.create({
                    definition: protocolDefinition,
                    signer: Jws.createSigner(alice)
                });
                const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                expect(protocolsConfigureReply.status.code).to.equal(202);
                // 2. Bob writes a record + a descendant in Alice's DWN.
                const postData = TestDataGenerator.randomBytes(100);
                const postOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'post',
                    dataFormat: 'application/json',
                    data: postData
                };
                const post = yield RecordsWrite.create(postOptions);
                const postWriteResponse = yield dwn.processMessage(alice.did, post.message, { dataStream: DataStream.fromBytes(postData) });
                expect(postWriteResponse.status.code).equals(202);
                const attachmentData = TestDataGenerator.randomBytes(100);
                const attachmentOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'post/attachment',
                    parentContextId: post.message.contextId,
                    dataFormat: 'application/octet-stream',
                    data: attachmentData
                };
                const attachment = yield RecordsWrite.create(attachmentOptions);
                const attachmentWriteResponse = yield dwn.processMessage(alice.did, attachment.message, { dataStream: DataStream.fromBytes(attachmentData) });
                expect(attachmentWriteResponse.status.code).equals(202);
                // 3. Verify Carol cannot prune the records.
                const postPrune = yield RecordsDelete.create({
                    recordId: post.message.recordId,
                    prune: true,
                    signer: Jws.createSigner(carol)
                });
                const deleteReply = yield dwn.processMessage(alice.did, postPrune.message);
                expect(deleteReply.status.code).to.equal(401);
                expect(deleteReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                // sanity test `RecordsQuery` still returns the records
                const recordsQuery = yield RecordsQuery.create({
                    signer: Jws.createSigner(bob),
                    filter: { protocol: protocolDefinition.protocol }
                });
                const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
                expect(recordsQueryReply.status.code).to.equal(200);
                expect((_d = recordsQueryReply.entries) === null || _d === void 0 ? void 0 : _d.length).to.equal(2);
            }));
            it('should throw if only `delete` is allowed but received a RecordsDelete with `prune` set to `true`', () => __awaiter(this, void 0, void 0, function* () {
                // Scenario:
                // 1. Alice installs a protocol allowing others to add and delete (not prune) records.
                // 2. Bob writes a record + a descendant in Alice's DWN.
                // 3. Verify Bob cannot prune the records.
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // 1. Alice installs a protocol allowing others to add and delete (not prune) records.
                const protocolDefinition = {
                    protocol: 'http://post-protocol.xyz',
                    published: true,
                    types: {
                        post: {},
                        attachment: {}
                    },
                    structure: {
                        post: {
                            $actions: [
                                {
                                    who: 'anyone',
                                    can: [
                                        'create',
                                        'delete',
                                        'read'
                                    ]
                                }
                            ],
                            attachment: {
                                $actions: [
                                    {
                                        who: 'anyone',
                                        can: [
                                            'create',
                                            'read'
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                };
                const protocolsConfig = yield ProtocolsConfigure.create({
                    definition: protocolDefinition,
                    signer: Jws.createSigner(alice)
                });
                const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                expect(protocolsConfigureReply.status.code).to.equal(202);
                // 2. Bob writes a record + a descendant in Alice's DWN.
                const postData = TestDataGenerator.randomBytes(100);
                const postOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'post',
                    dataFormat: 'application/json',
                    data: postData
                };
                const post = yield RecordsWrite.create(postOptions);
                const postWriteResponse = yield dwn.processMessage(alice.did, post.message, { dataStream: DataStream.fromBytes(postData) });
                expect(postWriteResponse.status.code).equals(202);
                const attachmentData = TestDataGenerator.randomBytes(100);
                const attachmentOptions = {
                    signer: Jws.createSigner(bob),
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'post/attachment',
                    parentContextId: post.message.contextId,
                    dataFormat: 'application/octet-stream',
                    data: attachmentData
                };
                const attachment = yield RecordsWrite.create(attachmentOptions);
                const attachmentWriteResponse = yield dwn.processMessage(alice.did, attachment.message, { dataStream: DataStream.fromBytes(attachmentData) });
                expect(attachmentWriteResponse.status.code).equals(202);
                // 3. Verify Bob cannot prune the records.
                const unauthorizedPostPrune = yield RecordsDelete.create({
                    recordId: post.message.recordId,
                    prune: true,
                    signer: Jws.createSigner(bob)
                });
                const unauthorizedPostPruneReply = yield dwn.processMessage(alice.did, unauthorizedPostPrune.message);
                expect(unauthorizedPostPruneReply.status.code).to.equal(401);
                expect(unauthorizedPostPruneReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
            }));
        });
    });
}
//# sourceMappingURL=records-prune.spec.js.map