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
import emailProtocolDefinition from '../vectors/protocol-definitions/email.json' assert { type: 'json' };
import messageProtocolDefinition from '../vectors/protocol-definitions/message.json' assert { type: 'json' };
import sinon from 'sinon';
import threadRoleProtocolDefinition from '../vectors/protocol-definitions/thread-role.json' assert { type: 'json' };
import chai, { expect } from 'chai';
import { base64url } from 'multiformats/bases/base64';
import { DataStream } from '../../src/utils/data-stream.js';
import { Dwn } from '../../src/dwn.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { Jws } from '../../src/utils/jws.js';
import { PermissionGrant } from '../../src/protocols/permission-grant.js';
import { Poller } from '../utils/poller.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { Time } from '../../src/utils/time.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import { DwnInterfaceName, DwnMethodName, Encoder, PermissionsProtocol, RecordsDelete, RecordsQuery, RecordsRead, RecordsSubscribe } from '../../src/index.js';
chai.use(chaiAsPromised);
export function testAuthorDelegatedGrant() {
    describe('author delegated grant', () => __awaiter(this, void 0, void 0, function* () {
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
        describe('RecordsWrite.parse()', () => __awaiter(this, void 0, void 0, function* () {
            it('should throw if a message invokes a author-delegated grant (ID) but the author-delegated grant is not given', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generatePersona();
                const bob = yield TestDataGenerator.generatePersona();
                // Alice grants Bob to write as her for the chat protocol
                const scope = {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Write,
                    protocol: 'chat'
                };
                const grantToBob = yield PermissionsProtocol.createGrant({
                    delegated: true,
                    dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                    description: 'Allow Bob to write as me in chat protocol',
                    grantedTo: bob.did,
                    scope,
                    signer: Jws.createSigner(alice)
                });
                // Bob creates a chat message invoking the delegated grant (ID) but does not include the author-delegated grant (we remove it below)
                const recordsWrite = yield RecordsWrite.create({
                    signer: Jws.createSigner(bob),
                    delegatedGrant: grantToBob.dataEncodedMessage,
                    dataFormat: 'application/octet-stream',
                    data: TestDataGenerator.randomBytes(10),
                });
                delete recordsWrite.message.authorization.authorDelegatedGrant; // intentionally remove `authorDelegatedGrant`
                const parsePromise = RecordsWrite.parse(recordsWrite.message);
                yield expect(parsePromise).to.be.rejectedWith(DwnErrorCode.RecordsAuthorDelegatedGrantAndIdExistenceMismatch);
            }));
            it('should throw if a message includes an author-delegated grant but does not reference it in author signature', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generatePersona();
                const bob = yield TestDataGenerator.generatePersona();
                // Alice grants Bob to write as her for the chat protocol
                const scope = {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Write,
                    protocol: 'chat'
                };
                const grantToBob = yield PermissionsProtocol.createGrant({
                    delegated: true,
                    dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                    description: 'Allow Bob to write as me in chat protocol',
                    grantedTo: bob.did,
                    scope,
                    signer: Jws.createSigner(alice)
                });
                // Bob attempts to sign as Alice by including an author-delegated grant
                // but does not reference the grant ID in author signature (we remove it below)
                const recordsWrite = yield RecordsWrite.create({
                    signer: Jws.createSigner(bob),
                    delegatedGrant: grantToBob.dataEncodedMessage,
                    dataFormat: 'application/octet-stream',
                    data: TestDataGenerator.randomBytes(10),
                });
                const authorSignaturePayloadCopy = Object.assign({}, recordsWrite.signaturePayload);
                delete authorSignaturePayloadCopy.delegatedGrantId; // intentionally remove `delegatedGrantId` in author signature
                recordsWrite.message.authorization.signature.payload = Encoder.stringToBase64Url(JSON.stringify(authorSignaturePayloadCopy));
                const parsePromise = RecordsWrite.parse(recordsWrite.message);
                yield expect(parsePromise).to.be.rejectedWith(DwnErrorCode.RecordsAuthorDelegatedGrantAndIdExistenceMismatch);
            }));
        }));
        it('should only allow correct entity invoking an author-delegated grant to write', () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // scenario:
            // 1. Alice creates a delegated grant for Device X and Device Y,
            // 2. Device X and Y can both use their grants to write a message to Bob's DWN as Alice
            // 3. Messages written by device X and Y should be considered to have been authored by Alice
            // 4. Carol should not be able to write a message as Alice using Device X's delegated grant
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            const deviceY = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // Bob has the message protocol installed
            const protocolDefinition = messageProtocolDefinition;
            const protocol = protocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolConfigureReply.status.code).to.equal(202);
            // Alice creates a delegated grant for device X and device Y
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const deviceXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            const deviceYGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceY.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // generate a `RecordsWrite` message from device X and write to Bob's DWN
            const deviceXData = new TextEncoder().encode('message from device X');
            const deviceXDataStream = DataStream.fromBytes(deviceXData);
            const messageByDeviceX = yield RecordsWrite.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: deviceXGrant.dataEncodedMessage,
                protocol,
                protocolPath: 'message',
                schema: protocolDefinition.types.message.schema,
                dataFormat: protocolDefinition.types.message.dataFormats[0],
                data: deviceXData
            });
            const deviceXWriteReply = yield dwn.processMessage(bob.did, messageByDeviceX.message, { dataStream: deviceXDataStream });
            expect(deviceXWriteReply.status.code).to.equal(202);
            // verify the message by device X got written to Bob's DWN, AND Alice is the logical author
            const recordsQueryByBob = yield TestDataGenerator.generateRecordsQuery({
                author: bob,
                filter: { protocol }
            });
            const bobRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply.status.code).to.equal(200);
            expect((_a = bobRecordsQueryReply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(1);
            const fetchedDeviceXWriteEntry = bobRecordsQueryReply.entries[0];
            expect(fetchedDeviceXWriteEntry.encodedData).to.equal(base64url.baseEncode(deviceXData));
            const fetchedDeviceXWrite = yield RecordsWrite.parse(fetchedDeviceXWriteEntry);
            expect(fetchedDeviceXWrite.author).to.equal(alice.did);
            // generate a new message by device Y updating the existing record device X created, and write to Bob's DWN
            const deviceYData = new TextEncoder().encode('message from device Y');
            const deviceYDataStream = DataStream.fromBytes(deviceYData);
            const messageByDeviceY = yield RecordsWrite.createFrom({
                recordsWriteMessage: fetchedDeviceXWrite.message,
                data: deviceYData,
                signer: Jws.createSigner(deviceY),
                delegatedGrant: deviceYGrant.dataEncodedMessage,
            });
            const deviceYWriteReply = yield dwn.processMessage(bob.did, messageByDeviceY.message, { dataStream: deviceYDataStream });
            expect(deviceYWriteReply.status.code).to.equal(202);
            // verify the message by device Y got written to Bob's DWN, AND Alice is the logical author
            const bobRecordsQueryReply2 = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply2.status.code).to.equal(200);
            expect((_b = bobRecordsQueryReply2.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(1);
            const fetchedDeviceYWriteEntry = bobRecordsQueryReply2.entries[0];
            expect(fetchedDeviceYWriteEntry.encodedData).to.equal(base64url.baseEncode(deviceYData));
            const fetchedDeviceYWrite = yield RecordsWrite.parse(fetchedDeviceYWriteEntry);
            expect(fetchedDeviceYWrite.author).to.equal(alice.did);
            // Verify that Carol cannot write a chat message as Alice by invoking the Device X's grant
            const messageByCarolAsAlice = new TextEncoder().encode('Message from Carol pretending to be Alice');
            const writeByCarolAsAlice = yield RecordsWrite.create({
                signer: Jws.createSigner(carol),
                delegatedGrant: deviceXGrant.dataEncodedMessage,
                protocol,
                protocolPath: 'message',
                schema: protocolDefinition.types.message.schema,
                dataFormat: protocolDefinition.types.message.dataFormats[0],
                data: messageByCarolAsAlice
            });
            const carolWriteReply = yield dwn.processMessage(carol.did, writeByCarolAsAlice.message, { dataStream: DataStream.fromBytes(messageByCarolAsAlice) });
            expect(carolWriteReply.status.code).to.equal(400);
            expect(carolWriteReply.status.detail).to.contain(DwnErrorCode.RecordsAuthorDelegatedGrantGrantedToAndOwnerSignatureMismatch);
        }));
        it('should only allow correct entity invoking an author-delegated grant to read and query ', () => __awaiter(this, void 0, void 0, function* () {
            var _c, _d, _e, _f;
            // scenario:
            // 1. Alice creates read and query delegated grants for device X,
            // 2. Bob starts a chat thread with Alice on his DWN
            // 3. device X should be able to read the chat thread
            // 4. Carol should not be able to read the chat thread using device X's delegated grant
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // Bob has the chat protocol installed
            const protocolDefinition = threadRoleProtocolDefinition;
            const protocol = threadRoleProtocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // Bob starts a chat thread
            const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread',
            });
            const threadRoleReply = yield dwn.processMessage(bob.did, threadRecord.message, { dataStream: threadRecord.dataStream });
            expect(threadRoleReply.status.code).to.equal(202);
            // Bob adds Alice as a participant in the thread
            const participantRoleRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: alice.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/participant',
                parentContextId: threadRecord.message.contextId,
                data: new TextEncoder().encode('Alice is my friend'),
            });
            const participantRoleReply = yield dwn.processMessage(bob.did, participantRoleRecord.message, { dataStream: participantRoleRecord.dataStream });
            expect(participantRoleReply.status.code).to.equal(202);
            // Bob writes a chat message in the thread
            const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/chat',
                parentContextId: threadRecord.message.contextId,
            });
            const chatRecordReply = yield dwn.processMessage(bob.did, chatRecord.message, { dataStream: chatRecord.dataStream });
            expect(chatRecordReply.status.code).to.equal(202);
            // Alice creates a delegated query grant for device X to act as Alice.
            const queryGrantForDeviceX = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Query,
                    protocol
                },
                signer: Jws.createSigner(alice)
            });
            // Alice creates a delegated read grant for device X to act as Alice.
            const readGrantForDeviceX = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Read,
                    protocol
                },
                signer: Jws.createSigner(alice)
            });
            // sanity verify Bob himself is able to query for the chat thread from Bob's DWN
            const recordsQueryByBob = yield TestDataGenerator.generateRecordsQuery({
                author: bob,
                filter: { protocol }
            });
            const bobRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply.status.code).to.equal(200);
            expect((_c = bobRecordsQueryReply.entries) === null || _c === void 0 ? void 0 : _c.length).to.equal(3);
            // sanity verify Alice herself is able to query for the chat message from Bob's DWN
            const recordsQueryByAlice = yield RecordsQuery.create({
                signer: Jws.createSigner(alice),
                protocolRole: 'thread/participant',
                filter: {
                    protocol,
                    contextId: threadRecord.message.contextId,
                    protocolPath: 'thread/chat'
                }
            });
            const aliceRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByAlice.message);
            expect(aliceRecordsQueryReply.status.code).to.equal(200);
            expect((_d = aliceRecordsQueryReply.entries) === null || _d === void 0 ? void 0 : _d.length).to.equal(1);
            // verify device X is able to query for the chat message from Bob's DWN
            const recordsQueryByDeviceX = yield RecordsQuery.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: queryGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                filter: {
                    protocol,
                    contextId: threadRecord.message.contextId,
                    protocolPath: 'thread/chat'
                }
            });
            const deviceXRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByDeviceX.message);
            expect(deviceXRecordsQueryReply.status.code).to.equal(200);
            expect((_e = deviceXRecordsQueryReply.entries) === null || _e === void 0 ? void 0 : _e.length).to.equal(1);
            // verify device X is able to read the chat message from Bob's DWN
            const recordsReadByDeviceX = yield RecordsRead.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: readGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                filter: {
                    recordId: chatRecord.message.recordId
                }
            });
            const deviceXRecordsReadReply = yield dwn.processMessage(bob.did, recordsReadByDeviceX.message);
            expect(deviceXRecordsReadReply.status.code).to.equal(200);
            expect((_f = deviceXRecordsReadReply.record) === null || _f === void 0 ? void 0 : _f.recordId).to.equal(chatRecord.message.recordId);
            // Verify that Carol cannot query as Alice by invoking the delegated grant granted to Device X
            const recordsQueryByCarol = yield RecordsQuery.create({
                signer: Jws.createSigner(carol),
                delegatedGrant: readGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                filter: {
                    protocol,
                    contextId: threadRecord.message.contextId,
                    protocolPath: 'thread/chat'
                }
            });
            const recordsQueryByCarolReply = yield dwn.processMessage(bob.did, recordsQueryByCarol.message);
            expect(recordsQueryByCarolReply.status.code).to.equal(400);
            expect(recordsQueryByCarolReply.status.detail).to.contain(DwnErrorCode.RecordsAuthorDelegatedGrantGrantedToAndOwnerSignatureMismatch);
            // Verify that Carol cannot read as Alice by invoking the delegated grant granted to Device X
            const recordsReadByCarol = yield RecordsRead.create({
                signer: Jws.createSigner(carol),
                delegatedGrant: readGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                filter: {
                    recordId: chatRecord.message.recordId
                }
            });
            const recordsReadByCarolReply = yield dwn.processMessage(bob.did, recordsReadByCarol.message);
            expect(recordsReadByCarolReply.status.code).to.equal(400);
            expect(recordsQueryByCarolReply.status.detail).to.contain(DwnErrorCode.RecordsAuthorDelegatedGrantGrantedToAndOwnerSignatureMismatch);
        }));
        it('should only allow correct entity invoking an author-delegated grant to subscribe', () => __awaiter(this, void 0, void 0, function* () {
            // scenario:
            // 1. Bob installs a chat protocol and creates a thread, adding Alice as a participant.
            // 2. Alice a creates subscribe delegated grant for device X,
            // 3. Carol should not be able to subscribe to the chat using deviceX's delegated grant.
            // 4. deviceX creates a subscription to receive events using the delegated grant.
            // 5. Bob writes two chat messages to the thread.
            // 6. The subscription should have received the chat messages.
            // 7. Bob deletes one of the chat messages.
            // 8. The subscription should have received the delete event.
            var _g;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // Bob has the chat protocol installed
            const protocolDefinition = threadRoleProtocolDefinition;
            const protocol = threadRoleProtocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // Bob starts a chat thread
            const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread',
            });
            const threadRoleReply = yield dwn.processMessage(bob.did, threadRecord.message, { dataStream: threadRecord.dataStream });
            expect(threadRoleReply.status.code).to.equal(202);
            // Bob adds Alice as a participant in the thread
            const participantRoleRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: alice.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/participant',
                parentContextId: threadRecord.message.contextId,
                data: new TextEncoder().encode('Alice is my friend'),
            });
            const participantRoleReply = yield dwn.processMessage(bob.did, participantRoleRecord.message, { dataStream: participantRoleRecord.dataStream });
            expect(participantRoleReply.status.code).to.equal(202);
            // Alice creates a delegated subscribe grant for device X to act as Alice.
            const subscribeGrantForDeviceX = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Subscribe,
                    protocol
                },
                signer: Jws.createSigner(alice)
            });
            // Create a handler to set or delete the chat record ID in the subscription set depending on the interface method
            const subscriptionChatRecords = new Set();
            const captureChatRecords = (event) => __awaiter(this, void 0, void 0, function* () {
                const { message } = event;
                if (message.descriptor.method === DwnMethodName.Delete) {
                    const recordId = message.descriptor.recordId;
                    subscriptionChatRecords.delete(recordId);
                }
                else {
                    const recordId = message.recordId;
                    subscriptionChatRecords.add(recordId);
                }
            });
            // control: verify that device X cannot subscribe to the chat thread without the delegated grant
            const recordsSubscribeByDeviceXWithoutGrant = yield RecordsSubscribe.create({
                signer: Jws.createSigner(deviceX),
                protocolRole: 'thread/participant',
                filter: {
                    contextId: threadRecord.message.contextId,
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'thread/chat'
                }
            });
            const recordsSubscribeByDeviceXWithoutGrantReply = yield dwn.processMessage(bob.did, recordsSubscribeByDeviceXWithoutGrant.message);
            expect(recordsSubscribeByDeviceXWithoutGrantReply.status.code).to.equal(401, 'device X without grant subscribe');
            // control: verify that Carol cannot subscribe as Alice by invoking the delegated grant granted to Device X
            const recordsSubscribeByCarol = yield RecordsSubscribe.create({
                signer: Jws.createSigner(carol),
                delegatedGrant: subscribeGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                filter: {
                    contextId: threadRecord.message.contextId,
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'thread/chat'
                }
            });
            const recordsSubscribeByCarolReply = yield dwn.processMessage(bob.did, recordsSubscribeByCarol.message);
            expect(recordsSubscribeByCarolReply.status.code).to.equal(400, 'carol subscribe');
            expect(recordsSubscribeByCarolReply.status.detail).to.contain(DwnErrorCode.RecordsAuthorDelegatedGrantGrantedToAndOwnerSignatureMismatch);
            // verify device X is able to subscribe the chat message from Bob's DWN using the delegated grant
            const recordsSubscribeByDeviceX = yield RecordsSubscribe.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: subscribeGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                filter: {
                    contextId: threadRecord.message.contextId,
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'thread/chat'
                }
            });
            const recordsSubscribeByDeviceXReply = yield dwn.processMessage(bob.did, recordsSubscribeByDeviceX.message, {
                subscriptionHandler: captureChatRecords
            });
            expect(recordsSubscribeByDeviceXReply.status.code).to.equal(200, 'subscribe');
            // Bob writes chat messages in the thread
            const chatRecord1 = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/chat',
                parentContextId: threadRecord.message.contextId,
            });
            const chatRecord1Reply = yield dwn.processMessage(bob.did, chatRecord1.message, { dataStream: chatRecord1.dataStream });
            expect(chatRecord1Reply.status.code).to.equal(202);
            const chatRecord2 = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/chat',
                parentContextId: threadRecord.message.contextId,
            });
            const chatRecord2Reply = yield dwn.processMessage(bob.did, chatRecord2.message, { dataStream: chatRecord2.dataStream });
            expect(chatRecord2Reply.status.code).to.equal(202);
            yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                expect(subscriptionChatRecords.size).to.equal(2);
                expect([...subscriptionChatRecords]).to.have.members([chatRecord1.message.recordId, chatRecord2.message.recordId]);
            }));
            yield ((_g = recordsSubscribeByDeviceXReply.subscription) === null || _g === void 0 ? void 0 : _g.close());
        }));
        it('should only allow correct entity invoking an author-delegated grant to delete', () => __awaiter(this, void 0, void 0, function* () {
            var _h, _j;
            // scenario:
            // 1. Bob installs the chat protocol on his DWN and makes Alice an admin
            // 2. Bob starts a chat thread with Carol on his DWN
            // 3. Alice creates a delegated grant for Device X to act as her
            // 4. Carol should not be able to delete a chat message as Alice using Device X's delegated grant
            // 5. Device X should be able to delete a chat message as Alice
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // Bob has the chat protocol installed
            const protocolDefinition = threadRoleProtocolDefinition;
            const protocol = threadRoleProtocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // Bob adds Alice as an admin
            const globalAdminRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: alice.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'globalAdmin',
                data: new TextEncoder().encode('I trust Alice to manage my chat thread'),
            });
            const globalAdminRecordReply = yield dwn.processMessage(bob.did, globalAdminRecord.message, { dataStream: globalAdminRecord.dataStream });
            expect(globalAdminRecordReply.status.code).to.equal(202);
            // Bob starts a chat thread
            const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread',
            });
            const threadRoleReply = yield dwn.processMessage(bob.did, threadRecord.message, { dataStream: threadRecord.dataStream });
            expect(threadRoleReply.status.code).to.equal(202);
            // Bob adds Carol as a participant in the thread
            const participantRoleRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: carol.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/participant',
                parentContextId: threadRecord.message.contextId
            });
            const participantRoleReply = yield dwn.processMessage(bob.did, participantRoleRecord.message, { dataStream: participantRoleRecord.dataStream });
            expect(participantRoleReply.status.code).to.equal(202);
            // Carol writes a chat message in the thread
            const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                author: carol,
                protocolRole: 'thread/participant',
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/chat',
                parentContextId: threadRecord.message.contextId,
                data: new TextEncoder().encode('A rude message'),
            });
            const chatRecordReply = yield dwn.processMessage(bob.did, chatRecord.message, { dataStream: chatRecord.dataStream });
            expect(chatRecordReply.status.code).to.equal(202);
            // Alice creates a delegated delete grant for device X to act as Alice.
            const deleteGrantForDeviceX = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Delete,
                    protocol
                },
                signer: Jws.createSigner(alice)
            });
            // verify Carol is not able to delete Carol's chat message from Bob's DWN
            const recordsDeleteByCarol = yield RecordsDelete.create({
                signer: Jws.createSigner(carol),
                delegatedGrant: deleteGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                recordId: chatRecord.message.recordId
            });
            const carolRecordsDeleteReply = yield dwn.processMessage(bob.did, recordsDeleteByCarol.message);
            expect(carolRecordsDeleteReply.status.code).to.equal(400);
            // sanity verify the chat message is still in Bob's DWN
            const recordsQueryByBob = yield TestDataGenerator.generateRecordsQuery({
                author: bob,
                filter: { protocolPath: 'thread/chat' }
            });
            const bobRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply.status.code).to.equal(200);
            expect((_h = bobRecordsQueryReply.entries) === null || _h === void 0 ? void 0 : _h.length).to.equal(1);
            // verify device X is able to delete Carol's chat message from Bob's DWN
            const recordsDeleteByDeviceX = yield RecordsDelete.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: deleteGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'globalAdmin',
                recordId: chatRecord.message.recordId
            });
            const deviceXRecordsDeleteReply = yield dwn.processMessage(bob.did, recordsDeleteByDeviceX.message);
            expect(deviceXRecordsDeleteReply.status.code).to.equal(202);
            // sanity verify the chat message is no longer queryable from Bob's DWN
            const bobRecordsQueryReply2 = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply2.status.code).to.equal(200);
            expect((_j = bobRecordsQueryReply2.entries) === null || _j === void 0 ? void 0 : _j.length).to.equal(0);
        }));
        it('should not allow entity using a non-delegated grant as an author-delegated grant to invoke write', () => __awaiter(this, void 0, void 0, function* () {
            var _k;
            // scenario:
            // 1. Bob has the message protocol installed
            // 2. Alice creates a non-delegated grant for device X
            // 3. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using the non-delegated grant
            // 4. Sanity verify the message by device X did not get written to Bob's DWN
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Bob has the message protocol installed
            const protocolDefinition = messageProtocolDefinition;
            const protocol = protocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a non-delegated grant for device X
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const deviceXGrant = yield PermissionsProtocol.createGrant({
                // delegated   : true, // intentionally commented out to show that this is not a delegated grant
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // 3. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using the non-delegated grant
            const deviceXData = new TextEncoder().encode('message from device X');
            const deviceXDataStream = DataStream.fromBytes(deviceXData);
            const messageByDeviceX = yield RecordsWrite.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: deviceXGrant.dataEncodedMessage,
                protocol,
                protocolPath: 'message',
                schema: protocolDefinition.types.message.schema,
                dataFormat: protocolDefinition.types.message.dataFormats[0],
                data: deviceXData
            });
            const deviceXWriteReply = yield dwn.processMessage(bob.did, messageByDeviceX.message, { dataStream: deviceXDataStream });
            expect(deviceXWriteReply.status.code).to.equal(400);
            expect(deviceXWriteReply.status.detail).to.contain(DwnErrorCode.RecordsAuthorDelegatedGrantNotADelegatedGrant);
            // 4. Sanity verify the message by device X did not get written to Bob's DWN
            const recordsQueryByBob = yield TestDataGenerator.generateRecordsQuery({
                author: bob,
                filter: { protocol }
            });
            const bobRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply.status.code).to.equal(200);
            expect((_k = bobRecordsQueryReply.entries) === null || _k === void 0 ? void 0 : _k.length).to.equal(0);
        }));
        xit('should not allow entity using a non-delegated grant as an author-delegated grant to invoke read', () => __awaiter(this, void 0, void 0, function* () {
        }));
        xit('should not allow entity using a non-delegated grant as an author-delegated grant to invoke query', () => __awaiter(this, void 0, void 0, function* () {
        }));
        xit('should not allow entity using a non-delegated grant as an author-delegated grant to invoke delete', () => __awaiter(this, void 0, void 0, function* () {
        }));
        it('should fail if author-delegated grant has a mismatching protocol scope - write', () => __awaiter(this, void 0, void 0, function* () {
            // scenario:
            // 1. Alice creates a delegated grant for device X to act as her for a protocol that is NOT email protocol
            // 2. Bob has email protocol configured for his DWN that allows anyone to write an email to him
            // 3. Device X attempts to use the delegated grant to write an email to Bob as Alice
            // 4. Bob's DWN should reject Device X's message
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice creates a delegated grant for device X to act as her for a protocol that is NOT email protocol
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol: 'random-protocol'
            };
            const deviceXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // 2. Bob has email protocol configured for his DWN that allows anyone to write an email to him
            const protocolDefinition = emailProtocolDefinition;
            const protocol = protocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolConfigureReply.status.code).to.equal(202);
            // 3. Device X attempts to use the delegated grant to write an email to Bob as Alice
            const deviceXData = new TextEncoder().encode('message from device X');
            const deviceXDataStream = DataStream.fromBytes(deviceXData);
            const messageByDeviceX = yield RecordsWrite.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: deviceXGrant.dataEncodedMessage,
                protocol,
                protocolPath: 'email',
                schema: protocolDefinition.types.email.schema,
                dataFormat: protocolDefinition.types.email.dataFormats[0],
                data: deviceXData
            });
            const deviceXWriteReply = yield dwn.processMessage(bob.did, messageByDeviceX.message, { dataStream: deviceXDataStream });
            expect(deviceXWriteReply.status.code).to.equal(401);
            expect(deviceXWriteReply.status.detail).to.contain(DwnErrorCode.RecordsGrantAuthorizationScopeProtocolMismatch);
        }));
        it('should fail if author-delegated grant has a mismatching protocol scope - query, subscribe & read', () => __awaiter(this, void 0, void 0, function* () {
            // scenario:
            // 1. Bob starts a chat thread with Alice on his DWN
            // 2. Alice creates a delegated grant for device X to act as her for a protocol that is NOT chat protocol
            // 3. Device X attempts to use the delegated grant to read, query and subscribe to the chat thread and gets rejected by Bob's DWN
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Bob starts a chat thread with Alice on his DWN
            // Bob has the chat protocol installed
            const protocolDefinition = threadRoleProtocolDefinition;
            const protocol = threadRoleProtocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // Bob starts a chat thread
            const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread',
            });
            const threadRoleReply = yield dwn.processMessage(bob.did, threadRecord.message, { dataStream: threadRecord.dataStream });
            expect(threadRoleReply.status.code).to.equal(202);
            // Bob adds Alice as a participant in the thread
            const participantRoleRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: alice.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/participant',
                parentContextId: threadRecord.message.contextId,
                data: new TextEncoder().encode('Alice is my friend'),
            });
            const participantRoleReply = yield dwn.processMessage(bob.did, participantRoleRecord.message, { dataStream: participantRoleRecord.dataStream });
            expect(participantRoleReply.status.code).to.equal(202);
            // Bob writes a chat message in the thread
            const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/chat',
                parentContextId: threadRecord.message.contextId,
            });
            const chatRecordReply = yield dwn.processMessage(bob.did, chatRecord.message, { dataStream: chatRecord.dataStream });
            expect(chatRecordReply.status.code).to.equal(202);
            // 2. Alice creates a delegated grant for device X to act as her for a protocol that is NOT chat protocol
            // Alice creates a delegated query grant for device X to act as Alice but not for chat protocol
            const queryGrantForDeviceX = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Query,
                    protocol: 'some-other-protocol'
                },
                signer: Jws.createSigner(alice)
            });
            // Alice creates a delegated read grant for device X to act as Alice but not for chat protocol
            const readGrantForDeviceX = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Read,
                    protocol: 'some-other-protocol'
                },
                signer: Jws.createSigner(alice)
            });
            // Alice creates a delegated subscribe grant for device X to act as Alice but not for chat protocol
            const subscribeGrantForDeviceX = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Subscribe,
                    protocol: 'some-other-protocol'
                },
                signer: Jws.createSigner(alice)
            });
            // 3. Device X attempts to use the delegated grant to read, query and subscribe to the chat thread and gets rejected by Bob's DWN
            // verify device X querying for the chat message from Bob's DWN fails
            const recordsQueryByDeviceX = yield RecordsQuery.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: queryGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                filter: {
                    protocol,
                    contextId: threadRecord.message.contextId,
                    protocolPath: 'thread/chat'
                }
            });
            const deviceXRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByDeviceX.message);
            expect(deviceXRecordsQueryReply.status.code).to.equal(401);
            expect(deviceXRecordsQueryReply.status.detail).to.contain(DwnErrorCode.RecordsGrantAuthorizationQueryOrSubscribeProtocolScopeMismatch);
            // verify device X reading for the chat message from Bob's DWN fails
            const recordsReadByDeviceX = yield RecordsRead.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: readGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                filter: {
                    recordId: chatRecord.message.recordId
                }
            });
            const deviceXReadReply = yield dwn.processMessage(bob.did, recordsReadByDeviceX.message);
            expect(deviceXReadReply.status.code).to.equal(401);
            expect(deviceXReadReply.status.detail).to.contain(DwnErrorCode.RecordsGrantAuthorizationScopeProtocolMismatch);
            // verify device X subscribing to the chat message from Bob's DWN fails
            const recordsSubscribeByDeviceX = yield RecordsSubscribe.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: subscribeGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'thread/participant',
                filter: {
                    protocol,
                    contextId: threadRecord.message.contextId,
                    protocolPath: 'thread/chat'
                }
            });
            const deviceXRecordsSubscribeReply = yield dwn.processMessage(bob.did, recordsSubscribeByDeviceX.message);
            expect(deviceXRecordsSubscribeReply.status.code).to.equal(401);
            expect(deviceXRecordsSubscribeReply.status.detail).to.contain(DwnErrorCode.RecordsGrantAuthorizationQueryOrSubscribeProtocolScopeMismatch);
        }));
        it('should fail if author-delegated grant has a mismatching protocol scope - delete', () => __awaiter(this, void 0, void 0, function* () {
            var _l;
            // scenario:
            // 1. Bob installs the chat protocol on his DWN and makes Alice an admin
            // 2. Bob starts a chat thread with Carol on his DWN
            // 3. Alice creates a delegated delete grant for Device X to act as her for a protocol that is NOT chat protocol
            // 4. Device X should NOT be able to delete a chat message as Alice
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // Bob has the chat protocol installed
            const protocolDefinition = threadRoleProtocolDefinition;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // Bob adds Alice as an admin
            const globalAdminRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: alice.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'globalAdmin',
                data: new TextEncoder().encode('I trust Alice to manage my chat thread'),
            });
            const globalAdminRecordReply = yield dwn.processMessage(bob.did, globalAdminRecord.message, { dataStream: globalAdminRecord.dataStream });
            expect(globalAdminRecordReply.status.code).to.equal(202);
            // Bob starts a chat thread
            const threadRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread',
            });
            const threadRoleReply = yield dwn.processMessage(bob.did, threadRecord.message, { dataStream: threadRecord.dataStream });
            expect(threadRoleReply.status.code).to.equal(202);
            // Bob adds Carol as a participant in the thread
            const participantRoleRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: carol.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/participant',
                parentContextId: threadRecord.message.contextId
            });
            const participantRoleReply = yield dwn.processMessage(bob.did, participantRoleRecord.message, { dataStream: participantRoleRecord.dataStream });
            expect(participantRoleReply.status.code).to.equal(202);
            // Carol writes a chat message in the thread
            const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                author: carol,
                protocolRole: 'thread/participant',
                protocol: protocolDefinition.protocol,
                protocolPath: 'thread/chat',
                parentContextId: threadRecord.message.contextId,
                data: new TextEncoder().encode('A rude message'),
            });
            const chatRecordReply = yield dwn.processMessage(bob.did, chatRecord.message, { dataStream: chatRecord.dataStream });
            expect(chatRecordReply.status.code).to.equal(202);
            // Alice creates a delegated delete grant for Device X to act as her for a protocol that is NOT chat protocol
            const delegatedGrantForDeviceX = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Delete,
                    protocol: 'some-protocol-that-is-not-chat'
                },
                signer: Jws.createSigner(alice)
            });
            // verify device X is NOT able to delete Carol's chat message from Bob's DWN
            const recordsDeleteByDeviceX = yield RecordsDelete.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: delegatedGrantForDeviceX.dataEncodedMessage,
                protocolRole: 'globalAdmin',
                recordId: chatRecord.message.recordId
            });
            const deviceXRecordsDeleteReply = yield dwn.processMessage(bob.did, recordsDeleteByDeviceX.message);
            expect(deviceXRecordsDeleteReply.status.code).to.equal(401);
            expect(deviceXRecordsDeleteReply.status.detail).to.contain(DwnErrorCode.RecordsGrantAuthorizationDeleteProtocolScopeMismatch);
            // sanity verify the chat message is still in Bob's DWN
            const recordsQueryByBob = yield TestDataGenerator.generateRecordsQuery({
                author: bob,
                filter: { protocolPath: 'thread/chat' }
            });
            const bobRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply.status.code).to.equal(200);
            expect((_l = bobRecordsQueryReply.entries) === null || _l === void 0 ? void 0 : _l.length).to.equal(1);
        }));
        it('should fail if presented with an author-delegated grant with invalid grantor signature - write', () => __awaiter(this, void 0, void 0, function* () {
            var _m;
            // scenario:
            // 1. Bob has the message protocol installed
            // 2. Alice creates a delegated grant for device X to write as Alice, but with invalid signature
            // 3. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using the delegated grant with invalid grantor signature
            // 4. Sanity verify the message by device X did not get written to Bob's DWN
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Bob has the message protocol installed
            const protocolDefinition = messageProtocolDefinition;
            const protocol = protocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a delegated grant for device X to write as Alice, but with invalid signature
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const deviceXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            const deviceXGrantMessage = deviceXGrant.dataEncodedMessage;
            deviceXGrantMessage.authorization.signature.signatures[0].signature = yield TestDataGenerator.randomSignatureString();
            // 3. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using the delegated grant with invalid grantor signature
            const deviceXData = new TextEncoder().encode('message from device X');
            const deviceXDataStream = DataStream.fromBytes(deviceXData);
            const messageByDeviceX = yield RecordsWrite.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: deviceXGrantMessage,
                protocol,
                protocolPath: 'message',
                schema: protocolDefinition.types.message.schema,
                dataFormat: protocolDefinition.types.message.dataFormats[0],
                data: deviceXData
            });
            const deviceXWriteReply = yield dwn.processMessage(bob.did, messageByDeviceX.message, { dataStream: deviceXDataStream });
            expect(deviceXWriteReply.status.code).to.equal(401);
            expect(deviceXWriteReply.status.detail).to.contain(DwnErrorCode.GeneralJwsVerifierInvalidSignature);
            // 4. Sanity verify the message by device X did not get written to Bob's DWN
            const recordsQueryByBob = yield TestDataGenerator.generateRecordsQuery({
                author: bob,
                filter: { protocol }
            });
            const bobRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply.status.code).to.equal(200);
            expect((_m = bobRecordsQueryReply.entries) === null || _m === void 0 ? void 0 : _m.length).to.equal(0);
        }));
        it('should fail if the CID of the author-delegated grant and the grant ID in the payload of the message signature is mismatching - write', () => __awaiter(this, void 0, void 0, function* () {
            var _o;
            // scenario:
            // 1. Bob has the message protocol installed
            // 2. Alice creates two delegated grants for device X to write as Alice
            // 3. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using a mismatching delegated grant ID
            // 4. Sanity verify the message by device X did not get written to Bob's DWN
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Bob has the message protocol installed
            const protocolDefinition = messageProtocolDefinition;
            const protocol = protocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolConfigureReply.status.code).to.equal(202);
            // 2. Alice creates two delegated grants for device X to write as Alice
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const deviceXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            yield Time.minimalSleep();
            const deviceXGrant2 = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // 3. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using a mismatching delegated grant ID
            const deviceXData = new TextEncoder().encode('message from device X');
            const deviceXDataStream = DataStream.fromBytes(deviceXData);
            const messageByDeviceX = yield RecordsWrite.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: deviceXGrant.dataEncodedMessage,
                protocol,
                protocolPath: 'message',
                schema: protocolDefinition.types.message.schema,
                dataFormat: protocolDefinition.types.message.dataFormats[0],
                data: deviceXData
            });
            messageByDeviceX.message.authorization.authorDelegatedGrant = deviceXGrant2.dataEncodedMessage; // intentionally have a mismatching grant
            const deviceXWriteReply = yield dwn.processMessage(bob.did, messageByDeviceX.message, { dataStream: deviceXDataStream });
            expect(deviceXWriteReply.status.code).to.equal(400);
            expect(deviceXWriteReply.status.detail).to.contain(DwnErrorCode.RecordsAuthorDelegatedGrantCidMismatch);
            // 4. Sanity verify the message by device X did not get written to Bob's DWN
            const recordsQueryByBob = yield TestDataGenerator.generateRecordsQuery({
                author: bob,
                filter: { protocol }
            });
            const bobRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply.status.code).to.equal(200);
            expect((_o = bobRecordsQueryReply.entries) === null || _o === void 0 ? void 0 : _o.length).to.equal(0);
        }));
        it('should fail if author-delegated grant is revoked - write', () => __awaiter(this, void 0, void 0, function* () {
            var _p;
            // scenario:
            // 1. Bob has the message protocol installed
            // 2. Alice creates a delegated grant for device X to write as Alice
            // 3. Alice revokes the grant
            // 4. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using a revoked delegated grant
            // 5. Sanity verify the message by device X did not get written to Bob's DWN
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Bob has the message protocol installed
            const protocolDefinition = messageProtocolDefinition;
            const protocol = protocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a delegated grant for device X to write as Alice
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const deviceXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            const deviceXGrantDataStream = DataStream.fromBytes(deviceXGrant.permissionGrantBytes);
            const permissionGrantWriteReply = yield dwn.processMessage(alice.did, deviceXGrant.recordsWrite.message, { dataStream: deviceXGrantDataStream });
            expect(permissionGrantWriteReply.status.code).to.equal(202);
            // 3. Alice revokes the grant
            const permissionRevoke = yield PermissionsProtocol.createRevocation({
                signer: Jws.createSigner(alice),
                grant: yield PermissionGrant.parse(deviceXGrant.dataEncodedMessage),
            });
            const revocationDataStream = DataStream.fromBytes(permissionRevoke.permissionRevocationBytes);
            const permissionRevokeReply = yield dwn.processMessage(alice.did, permissionRevoke.recordsWrite.message, { dataStream: revocationDataStream });
            expect(permissionRevokeReply.status.code).to.equal(202);
            // 3. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using a mismatching delegated grant ID
            const deviceXData = new TextEncoder().encode('message from device X');
            const deviceXDataStream = DataStream.fromBytes(deviceXData);
            const messageByDeviceX = yield RecordsWrite.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: deviceXGrant.dataEncodedMessage,
                protocol,
                protocolPath: 'message',
                schema: protocolDefinition.types.message.schema,
                dataFormat: protocolDefinition.types.message.dataFormats[0],
                data: deviceXData
            });
            const deviceXWriteReply = yield dwn.processMessage(bob.did, messageByDeviceX.message, { dataStream: deviceXDataStream });
            expect(deviceXWriteReply.status.code).to.equal(401);
            expect(deviceXWriteReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationGrantRevoked);
            // 4. Sanity verify the message by device X did not get written to Bob's DWN
            const recordsQueryByBob = yield TestDataGenerator.generateRecordsQuery({
                author: bob,
                filter: { protocol }
            });
            const bobRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply.status.code).to.equal(200);
            expect((_p = bobRecordsQueryReply.entries) === null || _p === void 0 ? void 0 : _p.length).to.equal(0);
        }));
        it('should fail if author-delegated grant is expired - write', () => __awaiter(this, void 0, void 0, function* () {
            var _q;
            // scenario:
            // 1. Bob has the message protocol installed
            // 2. Alice creates a delegated grant for device X to write as Alice, but make it expired
            // 3. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using an expired delegated grant
            // 4. Sanity verify the message by device X did not get written to Bob's DWN
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const deviceX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Bob has the message protocol installed
            const protocolDefinition = messageProtocolDefinition;
            const protocol = protocolDefinition.protocol;
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: bob,
                protocolDefinition
            });
            const protocolConfigureReply = yield dwn.processMessage(bob.did, protocolsConfig.message);
            expect(protocolConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a delegated grant for device X to write as Alice, but make it expired
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const deviceXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.getCurrentTimestamp(),
                grantedTo: deviceX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // 3. Verify that device X cannot write a `RecordsWrite` message to Bob's DWN as Alice using an expired delegated grant
            const deviceXData = new TextEncoder().encode('message from device X');
            const deviceXDataStream = DataStream.fromBytes(deviceXData);
            const messageByDeviceX = yield RecordsWrite.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: deviceXGrant.dataEncodedMessage,
                protocol,
                protocolPath: 'message',
                schema: protocolDefinition.types.message.schema,
                dataFormat: protocolDefinition.types.message.dataFormats[0],
                data: deviceXData
            });
            const deviceXWriteReply = yield dwn.processMessage(bob.did, messageByDeviceX.message, { dataStream: deviceXDataStream });
            expect(deviceXWriteReply.status.code).to.equal(401);
            expect(deviceXWriteReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationGrantExpired);
            // 4. Sanity verify the message by device X did not get written to Bob's DWN
            const recordsQueryByBob = yield TestDataGenerator.generateRecordsQuery({
                author: bob,
                filter: { protocol }
            });
            const bobRecordsQueryReply = yield dwn.processMessage(bob.did, recordsQueryByBob.message);
            expect(bobRecordsQueryReply.status.code).to.equal(200);
            expect((_q = bobRecordsQueryReply.entries) === null || _q === void 0 ? void 0 : _q.length).to.equal(0);
        }));
    }));
}
//# sourceMappingURL=author-delegated-grant.spec.js.map