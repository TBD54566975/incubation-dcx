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
import { GeneralJwsVerifier } from '../../src/jose/jws/general/verifier.js';
import { Message } from '../../src/core/message.js';
import minimalProtocolDefinition from '../vectors/protocol-definitions/minimal.json' assert { type: 'json' };
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DataStream, Dwn, DwnConstant, DwnErrorCode, DwnInterfaceName, DwnMethodName, Jws, PermissionGrant, PermissionsProtocol, Time } from '../../src/index.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import sinon from 'sinon';
export function testMessagesReadHandler() {
    describe('MessagesReadHandler.handle()', () => {
        let dwn;
        let didResolver;
        let messageStore;
        let dataStore;
        let resumableTaskStore;
        let eventLog;
        let eventStream;
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
            sinon.restore(); // wipe all previous stubs/spies/mocks/fakes
        }));
        after(() => __awaiter(this, void 0, void 0, function* () {
            sinon.restore();
            yield dwn.close();
        }));
        it('returns a 401 if authentication fails', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            sinon.stub(GeneralJwsVerifier, 'verifySignatures').throws(new Error('Invalid signature'));
            // alice creates a record
            const { message } = yield TestDataGenerator.generateMessagesRead({
                author: alice,
                messageCid: yield TestDataGenerator.randomCborSha256Cid()
            });
            // alice is not the author of the message
            const reply = yield dwn.processMessage(alice.did, message);
            expect(reply.status.code).to.equal(401);
            expect(reply.status.detail).to.include('Invalid signature');
        }));
        it('returns a 400 if message is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const { recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author: alice });
            const { message } = yield TestDataGenerator.generateMessagesRead({
                author: alice,
                messageCid: yield Message.getCid(recordsWrite.message)
            });
            message['descriptor']['troll'] = 'hehe';
            const reply = yield dwn.processMessage(alice.did, message);
            expect(reply.status.code).to.equal(400);
        }));
        it('returns a 400 if message contains an invalid message cid', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const { recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author: alice });
            const { message } = yield TestDataGenerator.generateMessagesRead({
                author: alice,
                messageCid: yield Message.getCid(recordsWrite.message)
            });
            message.descriptor.messageCid = 'hehetroll';
            const reply = yield dwn.processMessage(alice.did, message);
            expect(reply.status.code).to.equal(400);
            expect(reply.status.detail).to.include('is not a valid CID');
            expect(reply.entry).to.be.undefined;
        }));
        it('returns a 404 and the entry as undefined in reply entry when a messageCid is not found', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const { recordsWrite } = yield TestDataGenerator.generateRecordsWrite({ author: alice });
            const recordsWriteMessageCid = yield Message.getCid(recordsWrite.message);
            const { message } = yield TestDataGenerator.generateMessagesRead({
                author: alice,
                messageCid: recordsWriteMessageCid
            });
            // returns a 404 because the RecordsWrite created above was never stored
            const reply = yield dwn.processMessage(alice.did, message);
            expect(reply.status.code).to.equal(404);
            expect(reply.entry).to.be.undefined;
        }));
        describe('without a grant', () => {
            describe('records interface messages', () => {
                it('returns a 401 if the tenant is not the author', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // bob creates a record that alice will try and get
                    const { message: recordsWrite, dataStream } = yield TestDataGenerator.generateRecordsWrite({ author: bob });
                    const { status } = yield dwn.processMessage(bob.did, recordsWrite, { dataStream });
                    expect(status.code).to.equal(202);
                    // alice tries to read the message
                    const { message } = yield TestDataGenerator.generateMessagesRead({
                        author: alice,
                        messageCid: yield Message.getCid(recordsWrite)
                    });
                    const reply = yield dwn.processMessage(bob.did, message);
                    expect(reply.status.code).to.equal(401);
                    expect(reply.status.detail).to.include(DwnErrorCode.MessagesReadAuthorizationFailed);
                }));
                describe('gets record data in the reply entry', () => {
                    it('data is less than threshold', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const { message: recordsWrite, dataStream, dataBytes } = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            data: TestDataGenerator.randomBytes(DwnConstant.maxDataSizeAllowedToBeEncoded),
                        });
                        const reply = yield dwn.processMessage(alice.did, recordsWrite, { dataStream });
                        expect(reply.status.code).to.equal(202);
                        const recordsWriteMessageCid = yield Message.getCid(recordsWrite);
                        const { message } = yield TestDataGenerator.generateMessagesRead({
                            author: alice,
                            messageCid: recordsWriteMessageCid
                        });
                        const messagesReadReply = yield dwn.processMessage(alice.did, message);
                        expect(messagesReadReply.status.code).to.equal(200);
                        expect(messagesReadReply.entry).to.exist;
                        const messageReply = messagesReadReply.entry;
                        expect(messageReply.messageCid).to.exist;
                        expect(messageReply.messageCid).to.equal(recordsWriteMessageCid);
                        expect(messageReply.message).to.exist.and.not.be.undefined;
                        expect(messageReply.data).to.exist.and.not.be.undefined;
                        const messageData = yield DataStream.toBytes(messageReply.data);
                        expect(messageData).to.eql(dataBytes);
                    }));
                    it('data is greater than threshold', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const { message: recordsWrite, dataStream, dataBytes } = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            data: TestDataGenerator.randomBytes(DwnConstant.maxDataSizeAllowedToBeEncoded + 10),
                        });
                        const reply = yield dwn.processMessage(alice.did, recordsWrite, { dataStream });
                        expect(reply.status.code).to.equal(202);
                        const recordsWriteMessageCid = yield Message.getCid(recordsWrite);
                        const { message } = yield TestDataGenerator.generateMessagesRead({
                            author: alice,
                            messageCid: recordsWriteMessageCid
                        });
                        const messagesReadReply = yield dwn.processMessage(alice.did, message);
                        expect(messagesReadReply.status.code).to.equal(200);
                        expect(messagesReadReply.entry).to.exist;
                        const messageReply = messagesReadReply.entry;
                        expect(messageReply.messageCid).to.exist;
                        expect(messageReply.messageCid).to.equal(recordsWriteMessageCid);
                        expect(messageReply.message).to.exist.and.not.be.undefined;
                        expect(messageReply.data).to.exist.and.not.be.undefined;
                        const messageData = yield DataStream.toBytes(messageReply.data);
                        expect(messageData).to.eql(dataBytes);
                    }));
                    it('data is not available', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // initial write
                        const { message: recordsWriteMessage, recordsWrite, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            data: TestDataGenerator.randomBytes(DwnConstant.maxDataSizeAllowedToBeEncoded + 10),
                        });
                        const initialMessageCid = yield Message.getCid(recordsWriteMessage);
                        let reply = yield dwn.processMessage(alice.did, recordsWriteMessage, { dataStream });
                        expect(reply.status.code).to.equal(202);
                        const { recordsWrite: updateMessage, dataStream: updateDataStream } = yield TestDataGenerator.generateFromRecordsWrite({
                            author: alice,
                            existingWrite: recordsWrite,
                            data: TestDataGenerator.randomBytes(DwnConstant.maxDataSizeAllowedToBeEncoded + 10),
                        });
                        reply = yield dwn.processMessage(alice.did, updateMessage.toJSON(), { dataStream: updateDataStream });
                        expect(reply.status.code).to.equal(202);
                        const { message } = yield TestDataGenerator.generateMessagesRead({
                            author: alice,
                            messageCid: initialMessageCid
                        });
                        const messagesReadReply = yield dwn.processMessage(alice.did, message);
                        expect(messagesReadReply.status.code).to.equal(200);
                        expect(messagesReadReply.entry).to.exist;
                        const messageReply = messagesReadReply.entry;
                        expect(messageReply.messageCid).to.exist;
                        expect(messageReply.messageCid).to.equal(initialMessageCid);
                        expect(messageReply.message).to.exist.and.not.be.undefined;
                        expect(messageReply.data).to.be.undefined;
                    }));
                });
            });
            describe('Protocol interface messages', () => {
                it('returns a 401 if the tenant is not the author', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario:  Alice configures both a published and non-published protocol and writes it to her DWN.
                    //            Bob is unable to read either of the ProtocolConfigure messages because he is not the author.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // unpublished protocol configuration
                    const unpublishedProtocolDefinition = Object.assign(Object.assign({}, minimalProtocolDefinition), { protocol: 'http://example.com/protocol/unpublished', published: false });
                    const { message: unpublishedProtocolsConfigure } = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition: unpublishedProtocolDefinition
                    });
                    const unpublishedProtocolsConfigureReply = yield dwn.processMessage(alice.did, unpublishedProtocolsConfigure);
                    expect(unpublishedProtocolsConfigureReply.status.code).to.equal(202);
                    // published protocol configuration
                    const publishedProtocolDefinition = Object.assign(Object.assign({}, minimalProtocolDefinition), { protocol: 'http://example.com/protocol/published', published: true });
                    const { message: publishedProtocolsConfigure } = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition: publishedProtocolDefinition
                    });
                    const publishedProtocolsConfigureReply = yield dwn.processMessage(alice.did, publishedProtocolsConfigure);
                    expect(publishedProtocolsConfigureReply.status.code).to.equal(202);
                    // get the message CIDs
                    const unpublishedProtocolMessageCid = yield Message.getCid(unpublishedProtocolsConfigure);
                    const publishedProtocolMessageCid = yield Message.getCid(publishedProtocolsConfigure);
                    // bob attempts to read the unpublished protocol configuration
                    const { message: getUnpublishedProtocolConfigure } = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: unpublishedProtocolMessageCid,
                    });
                    const getUnpublishedProtocolConfigureReply = yield dwn.processMessage(alice.did, getUnpublishedProtocolConfigure);
                    expect(getUnpublishedProtocolConfigureReply.status.code).to.equal(401);
                    expect(getUnpublishedProtocolConfigureReply.status.detail).to.include(DwnErrorCode.MessagesReadAuthorizationFailed);
                    expect(getUnpublishedProtocolConfigureReply.entry).to.be.undefined;
                    // bob attempts to read the published protocol configuration
                    const { message: getPublishedProtocolConfigure } = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: publishedProtocolMessageCid,
                    });
                    const getPublishedProtocolConfigureReply = yield dwn.processMessage(alice.did, getPublishedProtocolConfigure);
                    expect(getPublishedProtocolConfigureReply.status.code).to.equal(401);
                    expect(getPublishedProtocolConfigureReply.status.detail).to.include(DwnErrorCode.MessagesReadAuthorizationFailed);
                    expect(getPublishedProtocolConfigureReply.entry).to.be.undefined;
                    // control: alice is able to read both the published and unpublished protocol configurations
                    const { message: getUnpublishedProtocolConfigureAlice } = yield TestDataGenerator.generateMessagesRead({
                        author: alice,
                        messageCid: unpublishedProtocolMessageCid,
                    });
                    const getUnpublishedProtocolConfigureAliceReply = yield dwn.processMessage(alice.did, getUnpublishedProtocolConfigureAlice);
                    expect(getUnpublishedProtocolConfigureAliceReply.status.code).to.equal(200);
                    expect(getUnpublishedProtocolConfigureAliceReply.entry).to.exist;
                    expect(getUnpublishedProtocolConfigureAliceReply.entry.messageCid).to.equal(unpublishedProtocolMessageCid);
                    expect(getUnpublishedProtocolConfigureAliceReply.entry.message).to.deep.equal(unpublishedProtocolsConfigure);
                    const { message: getPublishedProtocolConfigureAlice } = yield TestDataGenerator.generateMessagesRead({
                        author: alice,
                        messageCid: publishedProtocolMessageCid,
                    });
                    const getPublishedProtocolConfigureAliceReply = yield dwn.processMessage(alice.did, getPublishedProtocolConfigureAlice);
                    expect(getPublishedProtocolConfigureAliceReply.status.code).to.equal(200);
                    expect(getPublishedProtocolConfigureAliceReply.entry).to.exist;
                    expect(getPublishedProtocolConfigureAliceReply.entry.messageCid).to.equal(publishedProtocolMessageCid);
                    expect(getPublishedProtocolConfigureAliceReply.entry.message).to.deep.equal(publishedProtocolsConfigure);
                }));
            });
        });
        describe('with a grant', () => {
            it('returns a 401 if grant has different DWN interface scope', () => __awaiter(this, void 0, void 0, function* () {
                // scenario: Alice grants Bob access to RecordsWrite, then Bob tries to invoke the grant with MessagesRead
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // alice installs a protocol
                const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                    author: alice,
                    protocolDefinition: minimalProtocolDefinition
                });
                const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                expect(protocolsConfigureReply.status.code).to.equal(202);
                // Alice writes a record which Bob will later try to read
                const { recordsWrite, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    protocol: minimalProtocolDefinition.protocol,
                    protocolPath: 'foo',
                });
                const recordsWriteReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream });
                expect(recordsWriteReply.status.code).to.equal(202);
                // Alice gives Bob a permission grant scoped to a RecordsWrite and the protocol
                const permissionGrant = yield PermissionsProtocol.createGrant({
                    signer: Jws.createSigner(alice),
                    grantedTo: bob.did,
                    dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                    scope: {
                        interface: DwnInterfaceName.Records,
                        method: DwnMethodName.Write,
                        protocol: minimalProtocolDefinition.protocol,
                    }
                });
                const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                expect(permissionGrantWriteReply.status.code).to.equal(202);
                // Bob tries to MessagesRead using the RecordsWrite grant
                const messagesRead = yield TestDataGenerator.generateMessagesRead({
                    author: bob,
                    messageCid: yield Message.getCid(recordsWrite.message),
                    permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                });
                const messagesReadReply = yield dwn.processMessage(alice.did, messagesRead.message);
                expect(messagesReadReply.status.code).to.equal(401);
                expect(messagesReadReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationInterfaceMismatch);
            }));
            it('allows external parties to read a message using a grant with unrestricted scope', () => __awaiter(this, void 0, void 0, function* () {
                // scenario: Alice gives Bob a grant allowing him to read any message in her DWN.
                //           Bob invokes that grant to read a message.
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // Alice writes a record to her DWN
                const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                });
                const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(writeReply.status.code).to.equal(202);
                const messageCid = yield Message.getCid(message);
                // Alice issues a permission grant allowing Bob to read any record in her DWN
                const permissionGrant = yield PermissionsProtocol.createGrant({
                    signer: Jws.createSigner(alice),
                    grantedTo: bob.did,
                    dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                    scope: {
                        interface: DwnInterfaceName.Messages,
                        method: DwnMethodName.Read,
                    }
                });
                const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                const grantReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                expect(grantReply.status.code).to.equal(202);
                // Bob invokes that grant to read a record from Alice's DWN
                const messagesRead = yield TestDataGenerator.generateMessagesRead({
                    author: bob,
                    permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    messageCid,
                });
                const readReply = yield dwn.processMessage(alice.did, messagesRead.message);
                expect(readReply.status.code).to.equal(200);
                expect(readReply.entry).to.not.be.undefined;
                expect(readReply.entry.messageCid).to.equal(messageCid);
            }));
            describe('protocol scoped messages', () => {
                it('allows reads of protocol messages with a protocol restricted grant scope', () => __awaiter(this, void 0, void 0, function* () {
                    // This test will verify that a grant scoped to a specific protocol will allow a user to read messages associated with that protocol.
                    // These messages include the ProtocolConfiguration itself, even if not published,
                    // any RecordsWrite or RecordsDelete messages associated with the protocol,
                    // and any PermissionProtocol RecordsWrite messages associated with the protocol.
                    // scenario: Alice configures a protocol that is unpublished and writes it to her DWN.
                    //           Alice then gives Bob a grant to read messages from that protocol.
                    //           Carol requests a grant to RecordsWrite to the protocol, and Alice grants it.
                    //           Alice and Carol write records associated with the protocol.
                    //           Alice also deletes a record associated with the protocol.
                    //           Alice revokes the grant to Carol.
                    //           Bob invokes his grant to read the various messages.
                    //           As a control, Alice writes a record not associated with the protocol and Bob tries to unsuccessfully read it.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const carol = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = Object.assign(Object.assign({}, minimalProtocolDefinition), { published: false });
                    // Alice installs the unpublished protocol
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    const protocolConfigureMessageCid = yield Message.getCid(protocolsConfig.message);
                    // Carol requests a grant to write records to the protocol
                    const permissionRequestCarol = yield PermissionsProtocol.createRequest({
                        signer: Jws.createSigner(alice),
                        delegated: false,
                        scope: {
                            interface: DwnInterfaceName.Records,
                            method: DwnMethodName.Write,
                            protocol: protocolDefinition.protocol,
                        }
                    });
                    const requestDataStreamCarol = DataStream.fromBytes(permissionRequestCarol.permissionRequestBytes);
                    const permissionRequestWriteReplyCarol = yield dwn.processMessage(alice.did, permissionRequestCarol.recordsWrite.message, { dataStream: requestDataStreamCarol });
                    expect(permissionRequestWriteReplyCarol.status.code).to.equal(202);
                    // Alice gives Carol a grant to write records to the protocol
                    const permissionGrantCarol = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: carol.did,
                        dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                        delegated: permissionRequestCarol.permissionRequestData.delegated,
                        scope: permissionRequestCarol.permissionRequestData.scope,
                    });
                    const grantDataStreamCarol = DataStream.fromBytes(permissionGrantCarol.permissionGrantBytes);
                    const permissionGrantWriteReplyCarol = yield dwn.processMessage(alice.did, permissionGrantCarol.recordsWrite.message, { dataStream: grantDataStreamCarol });
                    expect(permissionGrantWriteReplyCarol.status.code).to.equal(202);
                    const carolGrantMessageCiD = yield Message.getCid(permissionGrantCarol.recordsWrite.message);
                    // Alice writes a record associated with the protocol
                    const { recordsWrite, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                    });
                    const recordsWriteReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream });
                    expect(recordsWriteReply.status.code).to.equal(202);
                    const aliceRecordMessageCid = yield Message.getCid(recordsWrite.message);
                    // Alice deletes a record associated with the protocol
                    const recordsDelete = yield TestDataGenerator.generateRecordsDelete({
                        author: alice,
                        recordId: recordsWrite.message.recordId,
                    });
                    const recordsDeleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                    expect(recordsDeleteReply.status.code).to.equal(202);
                    // Carol writes a record associated with the protocol
                    const { recordsWrite: recordsWriteCarol, dataStream: dataStreamCarol } = yield TestDataGenerator.generateRecordsWrite({
                        author: carol,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        permissionGrantId: permissionGrantCarol.recordsWrite.message.recordId,
                    });
                    const recordsWriteReplyCarol = yield dwn.processMessage(alice.did, recordsWriteCarol.message, { dataStream: dataStreamCarol });
                    expect(recordsWriteReplyCarol.status.code).to.equal(202);
                    const carolRecordMessageCid = yield Message.getCid(recordsWriteCarol.message);
                    // Alice revokes Carol's grant
                    const permissionRevocationCarol = yield PermissionsProtocol.createRevocation({
                        signer: Jws.createSigner(alice),
                        grant: yield PermissionGrant.parse(permissionGrantCarol.dataEncodedMessage),
                    });
                    const permissionRevocationCarolDataStream = DataStream.fromBytes(permissionRevocationCarol.permissionRevocationBytes);
                    const permissionRevocationCarolReply = yield dwn.processMessage(alice.did, permissionRevocationCarol.recordsWrite.message, { dataStream: permissionRevocationCarolDataStream });
                    expect(permissionRevocationCarolReply.status.code).to.equal(202);
                    // Alice gives Bob a permission grant with scope MessagesRead
                    const permissionGrant = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: bob.did,
                        dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                        scope: {
                            interface: DwnInterfaceName.Messages,
                            method: DwnMethodName.Read,
                            protocol: protocolDefinition.protocol,
                        }
                    });
                    const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                    const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                    expect(permissionGrantWriteReply.status.code).to.equal(202);
                    // Bob is unable to read the message without using the permission grant
                    const messagesReadWithoutGrant = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: aliceRecordMessageCid,
                    });
                    const messagesReadWithoutGrantReply = yield dwn.processMessage(alice.did, messagesReadWithoutGrant.message);
                    expect(messagesReadWithoutGrantReply.status.code).to.equal(401);
                    expect(messagesReadWithoutGrantReply.status.detail).to.contain(DwnErrorCode.MessagesReadAuthorizationFailed);
                    // Bob is able to read all the associated messages when using the permission grant
                    // Expected Messages:
                    // - Protocol Configuration
                    // - Alice's RecordsWrite
                    // - Alice's RecordsDelete
                    // - Carol's Permission Request
                    // - Alice's Permission Grant to Carol
                    // - Carol's RecordsWrite
                    // - Alice's Revocation of Carol's Grant
                    // Protocol configuration
                    const messagesReadProtocolConfigure = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: protocolConfigureMessageCid,
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadProtocolConfigureReply = yield dwn.processMessage(alice.did, messagesReadProtocolConfigure.message);
                    expect(messagesReadProtocolConfigureReply.status.code).to.equal(200);
                    expect(messagesReadProtocolConfigureReply.entry).to.exist;
                    expect(messagesReadProtocolConfigureReply.entry.message).to.deep.equal(protocolsConfig.message);
                    // alice RecordsWrite
                    const messagesReadWithGrant = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: aliceRecordMessageCid,
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadWithGrantReply = yield dwn.processMessage(alice.did, messagesReadWithGrant.message);
                    expect(messagesReadWithGrantReply.status.code).to.equal(200);
                    expect(messagesReadWithGrantReply.entry).to.exist;
                    expect(messagesReadWithGrantReply.entry.message).to.deep.equal(recordsWrite.message);
                    // alice RecordsDelete
                    const messagesReadDelete = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: yield Message.getCid(recordsDelete.message),
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadDeleteReply = yield dwn.processMessage(alice.did, messagesReadDelete.message);
                    expect(messagesReadDeleteReply.status.code).to.equal(200);
                    expect(messagesReadDeleteReply.entry).to.exist;
                    expect(messagesReadDeleteReply.entry.message).to.deep.equal(recordsDelete.message);
                    // carol's Permission Request
                    const messagesReadCarolRequest = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: yield Message.getCid(permissionRequestCarol.recordsWrite.message),
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadCarolRequestReply = yield dwn.processMessage(alice.did, messagesReadCarolRequest.message);
                    expect(messagesReadCarolRequestReply.status.code).to.equal(200);
                    expect(messagesReadCarolRequestReply.entry).to.exist;
                    expect(messagesReadCarolRequestReply.entry.message).to.deep.equal(permissionRequestCarol.recordsWrite.message);
                    // carol's Permission Grant
                    const messagesReadCarolGrant = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: carolGrantMessageCiD,
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadCarolGrantReply = yield dwn.processMessage(alice.did, messagesReadCarolGrant.message);
                    expect(messagesReadCarolGrantReply.status.code).to.equal(200);
                    expect(messagesReadCarolGrantReply.entry).to.exist;
                    expect(messagesReadCarolGrantReply.entry.message).to.deep.equal(permissionGrantCarol.recordsWrite.message);
                    // carol's RecordsWrite
                    const messagesReadCarolRecord = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: carolRecordMessageCid,
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadCarolRecordReply = yield dwn.processMessage(alice.did, messagesReadCarolRecord.message);
                    expect(messagesReadCarolRecordReply.status.code).to.equal(200);
                    expect(messagesReadCarolRecordReply.entry).to.exist;
                    expect(messagesReadCarolRecordReply.entry.message).to.deep.equal(recordsWriteCarol.message);
                    // carol's Grant Revocation
                    const messagesReadCarolGrantRevocation = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: yield Message.getCid(permissionRevocationCarol.recordsWrite.message),
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadCarolGrantRevocationReply = yield dwn.processMessage(alice.did, messagesReadCarolGrantRevocation.message);
                    expect(messagesReadCarolGrantRevocationReply.status.code).to.equal(200);
                    expect(messagesReadCarolGrantRevocationReply.entry).to.exist;
                    expect(messagesReadCarolGrantRevocationReply.entry.message).to.deep.equal(permissionRevocationCarol.recordsWrite.message);
                    // CONTROL: Alice writes a record not associated with the protocol
                    const { recordsWrite: recordsWriteControl, dataStream: dataStreamControl } = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                    });
                    const recordsWriteControlReply = yield dwn.processMessage(alice.did, recordsWriteControl.message, { dataStream: dataStreamControl });
                    expect(recordsWriteControlReply.status.code).to.equal(202);
                    // Bob is unable to read the control message
                    const messagesReadControl = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: yield Message.getCid(recordsWriteControl.message),
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadControlReply = yield dwn.processMessage(alice.did, messagesReadControl.message);
                    expect(messagesReadControlReply.status.code).to.equal(401);
                }));
                it('rejects message read of protocol messages with mismatching protocol grant scopes', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice writes a protocol record. Alice gives Bob a grant to read messages from a different protocol
                    //           Bob invokes that grant to read the protocol message, but fails.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = minimalProtocolDefinition;
                    // Alice installs the protocol
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Alice writes a record which Bob will later try to read
                    const { recordsWrite, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                    });
                    const recordsWriteReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream });
                    expect(recordsWriteReply.status.code).to.equal(202);
                    // Alice gives Bob a permission grant with scope MessagesRead
                    const permissionGrant = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: bob.did,
                        dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                        scope: {
                            interface: DwnInterfaceName.Messages,
                            method: DwnMethodName.Read,
                            protocol: 'a-different-protocol'
                        }
                    });
                    const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                    const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                    expect(permissionGrantWriteReply.status.code).to.equal(202);
                    // Bob is unable to read the record using the mismatched permission grant
                    const messagesReadWithoutGrant = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: yield Message.getCid(recordsWrite.message),
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadWithoutGrantReply = yield dwn.processMessage(alice.did, messagesReadWithoutGrant.message);
                    expect(messagesReadWithoutGrantReply.status.code).to.equal(401);
                    expect(messagesReadWithoutGrantReply.status.detail).to.contain(DwnErrorCode.MessagesReadVerifyScopeFailed);
                }));
                it('rejects message if the RecordsWrite message is not found for a RecordsDelete being retrieved', () => __awaiter(this, void 0, void 0, function* () {
                    // NOTE: This is a corner case that is unlikely to happen in practice, but is tested for completeness
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = minimalProtocolDefinition;
                    // Alice installs the protocol
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Alice gives bob a grant to read messages in the protocol
                    const permissionGrant = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: bob.did,
                        dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                        scope: {
                            interface: DwnInterfaceName.Messages,
                            method: DwnMethodName.Read,
                            protocol: protocolDefinition.protocol,
                        }
                    });
                    const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                    const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                    expect(permissionGrantWriteReply.status.code).to.equal(202);
                    // Alice creates the records write and records delete messages
                    const { recordsWrite } = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                    });
                    const { recordsDelete } = yield TestDataGenerator.generateRecordsDelete({
                        author: alice,
                        recordId: recordsWrite.message.recordId,
                    });
                    // Alice inserts the RecordsDelete message directly into the message store
                    const recordsDeleteCid = yield Message.getCid(recordsDelete.message);
                    const indexes = recordsDelete.constructIndexes(recordsWrite.message);
                    yield messageStore.put(alice.did, recordsDelete.message, indexes);
                    // Bob tries to read the message
                    const messagesRead = yield TestDataGenerator.generateMessagesRead({
                        author: bob,
                        messageCid: recordsDeleteCid,
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const messagesReadReply = yield dwn.processMessage(alice.did, messagesRead.message);
                    expect(messagesReadReply.status.code).to.equal(401);
                    expect(messagesReadReply.status.detail).to.contain(DwnErrorCode.RecordsWriteGetNewestWriteRecordNotFound);
                }));
            });
        });
    });
}
//# sourceMappingURL=messages-read.spec.js.map