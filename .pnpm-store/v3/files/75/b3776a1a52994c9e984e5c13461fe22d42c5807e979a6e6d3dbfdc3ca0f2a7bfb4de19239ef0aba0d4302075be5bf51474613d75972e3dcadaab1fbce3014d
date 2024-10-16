var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DwnConstant, PermissionsProtocol, Time } from '../../src/index.js';
import { DwnInterfaceName, DwnMethodName } from '../../src/index.js';
import chaiAsPromised from 'chai-as-promised';
import chatProtocolDefinition from '../vectors/protocol-definitions/chat.json' assert { type: 'json' };
import emailProtocolDefinition from '../vectors/protocol-definitions/email.json' assert { type: 'json' };
import friendRoleProtocolDefinition from '../vectors/protocol-definitions/friend-role.json' assert { type: 'json' };
import minimalProtocolDefinition from '../vectors/protocol-definitions/minimal.json' assert { type: 'json' };
import nestedProtocol from '../vectors/protocol-definitions/nested.json' assert { type: 'json' };
import sinon from 'sinon';
import socialMediaProtocolDefinition from '../vectors/protocol-definitions/social-media.json' assert { type: 'json' };
import threadRoleProtocolDefinition from '../vectors/protocol-definitions/thread-role.json' assert { type: 'json' };
import chai, { expect } from 'chai';
import { ArrayUtility } from '../../src/utils/array.js';
import { authenticate } from '../../src/core/auth.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { Encryption } from '../../src/utils/encryption.js';
import { HdKey } from '../../src/utils/hd-key.js';
import { KeyDerivationScheme } from '../../src/utils/hd-key.js';
import { RecordsReadHandler } from '../../src/handlers/records-read.js';
import { stubInterface } from 'ts-sinon';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { TestStubGenerator } from '../utils/test-stub-generator.js';
import { DataStream, Dwn, Jws, Protocols, ProtocolsConfigure, ProtocolsQuery, Records, RecordsDelete, RecordsRead, RecordsWrite, Secp256k1 } from '../../src/index.js';
import { DidKey, UniversalResolver } from '@web5/dids';
chai.use(chaiAsPromised);
export function testRecordsReadHandler() {
    describe('RecordsReadHandler.handle()', () => {
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
            it('should allow tenant to RecordsRead their own record', () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // insert data
                const { message, dataStream, dataBytes } = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(writeReply.status.code).to.equal(202);
                // testing RecordsRead
                const recordsRead = yield RecordsRead.create({
                    filter: {
                        recordId: message.recordId,
                    },
                    signer: Jws.createSigner(alice)
                });
                const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                expect(readReply.status.code).to.equal(200);
                expect(readReply.record).to.exist;
                expect((_a = readReply.record) === null || _a === void 0 ? void 0 : _a.authorization).to.deep.equal(message.authorization);
                expect((_b = readReply.record) === null || _b === void 0 ? void 0 : _b.descriptor).to.deep.equal(message.descriptor);
                const dataFetched = yield DataStream.toBytes(readReply.record.data);
                expect(ArrayUtility.byteArraysEqual(dataFetched, dataBytes)).to.be.true;
            }));
            it('should not allow non-tenant to RecordsRead their a record data', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // insert data
                const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({ author: alice });
                const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(writeReply.status.code).to.equal(202);
                // testing RecordsRead
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const recordsRead = yield RecordsRead.create({
                    filter: {
                        recordId: message.recordId,
                    },
                    signer: Jws.createSigner(bob)
                });
                const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                expect(readReply.status.code).to.equal(401);
            }));
            it('should allow reading of data that is published without `authorization`', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // insert public data
                const { message, dataStream, dataBytes } = yield TestDataGenerator.generateRecordsWrite({ author: alice, published: true });
                const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(writeReply.status.code).to.equal(202);
                // testing public RecordsRead
                const recordsRead = yield RecordsRead.create({
                    filter: {
                        recordId: message.recordId
                    }
                });
                expect(recordsRead.author).to.be.undefined; // making sure no author/authorization is created
                const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                expect(readReply.status.code).to.equal(200);
                const dataFetched = yield DataStream.toBytes(readReply.record.data);
                expect(ArrayUtility.byteArraysEqual(dataFetched, dataBytes)).to.be.true;
            }));
            it('should allow an authenticated user to RecordRead data that is published', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // insert public data
                const { message, dataStream, dataBytes } = yield TestDataGenerator.generateRecordsWrite({ author: alice, published: true });
                const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(writeReply.status.code).to.equal(202);
                // testing public RecordsRead
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                const recordsRead = yield RecordsRead.create({
                    filter: {
                        recordId: message.recordId,
                    },
                    signer: Jws.createSigner(bob)
                });
                const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                expect(readReply.status.code).to.equal(200);
                const dataFetched = yield DataStream.toBytes(readReply.record.data);
                expect(ArrayUtility.byteArraysEqual(dataFetched, dataBytes)).to.be.true;
            }));
            it('should allow a non-tenant to read RecordsRead data they have received', () => __awaiter(this, void 0, void 0, function* () {
                var _c;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bob = yield TestDataGenerator.generateDidKeyPersona();
                // Alice inserts data with Bob as recipient
                const { message, dataStream, dataBytes } = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    recipient: bob.did,
                });
                const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(writeReply.status.code).to.equal(202);
                // Bob reads the data that Alice sent him
                const recordsRead = yield RecordsRead.create({
                    filter: {
                        recordId: message.recordId,
                    },
                    signer: Jws.createSigner(bob)
                });
                const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                expect(readReply.status.code).to.equal(200);
                expect(readReply.record).to.exist;
                expect((_c = readReply.record) === null || _c === void 0 ? void 0 : _c.descriptor).to.exist;
                const dataFetched = yield DataStream.toBytes(readReply.record.data);
                expect(ArrayUtility.byteArraysEqual(dataFetched, dataBytes)).to.be.true;
            }));
            it('should include `initialWrite` property if RecordsWrite is not initial write', () => __awaiter(this, void 0, void 0, function* () {
                var _d, _e, _f;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const write = yield TestDataGenerator.generateRecordsWrite({ author: alice, published: false });
                const writeReply = yield dwn.processMessage(alice.did, write.message, { dataStream: write.dataStream });
                expect(writeReply.status.code).to.equal(202);
                // write an update to the record
                const write2 = yield RecordsWrite.createFrom({ recordsWriteMessage: write.message, published: true, signer: Jws.createSigner(alice) });
                const write2Reply = yield dwn.processMessage(alice.did, write2.message);
                expect(write2Reply.status.code).to.equal(202);
                // make sure result returned now has `initialWrite` property
                const messageData = yield RecordsRead.create({ filter: { recordId: write.message.recordId }, signer: Jws.createSigner(alice) });
                const reply = yield dwn.processMessage(alice.did, messageData.message);
                expect(reply.status.code).to.equal(200);
                expect((_d = reply.record) === null || _d === void 0 ? void 0 : _d.initialWrite).to.exist;
                expect((_f = (_e = reply.record) === null || _e === void 0 ? void 0 : _e.initialWrite) === null || _f === void 0 ? void 0 : _f.recordId).to.equal(write.message.recordId);
            }));
            describe('protocol based reads', () => {
                it('should allow read with allow-anyone rule', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice writes an image to her DWN, then Bob reads the image because he is "anyone".
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const protocolDefinition = socialMediaProtocolDefinition;
                    // Install social-media protocol on Alice's DWN
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Alice writes image to her DWN
                    const encodedImage = new TextEncoder().encode('cafe-aesthetic.jpg');
                    const imageRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'image',
                        schema: protocolDefinition.types.image.schema,
                        dataFormat: 'image/jpeg',
                        data: encodedImage,
                        recipient: alice.did
                    });
                    const imageReply = yield dwn.processMessage(alice.did, imageRecordsWrite.message, { dataStream: imageRecordsWrite.dataStream });
                    expect(imageReply.status.code).to.equal(202);
                    // Bob (anyone) reads the image that Alice wrote
                    const imageRecordsRead = yield RecordsRead.create({
                        filter: {
                            recordId: imageRecordsWrite.message.recordId,
                        },
                        signer: Jws.createSigner(bob)
                    });
                    const imageReadReply = yield dwn.processMessage(alice.did, imageRecordsRead.message);
                    expect(imageReadReply.status.code).to.equal(200);
                }));
                it('should not allow anonymous reads when there is no allow-anyone rule', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice's writes a record to a protocol. An anonymous read his Alice's DWN and is rejected
                    //           because there is not an allow-anyone rule.
                    const alice = yield TestDataGenerator.generatePersona();
                    const protocolDefinition = emailProtocolDefinition;
                    TestStubGenerator.stubDidResolver(didResolver, [alice]);
                    const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Alice writes a message to the minimal protocol
                    const recordsWrite = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'email',
                        schema: protocolDefinition.types.email.schema,
                        dataFormat: protocolDefinition.types.email.dataFormats[0],
                        data: new TextEncoder().encode('foo')
                    });
                    const recordsWriteReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream: recordsWrite.dataStream });
                    expect(recordsWriteReply.status.code).to.equal(202);
                    // Anonymous tries and fails to read Alice's message
                    const recordsRead = yield RecordsRead.create({
                        filter: {
                            recordId: recordsWrite.message.recordId,
                        }
                    });
                    const recordsReadReply = yield dwn.processMessage(alice.did, recordsRead.message);
                    expect(recordsReadReply.status.code).to.equal(401);
                    expect(recordsReadReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                }));
                describe('recipient rules', () => {
                    it('should allow read with ancestor recipient rule', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice sends an email to Bob, then Bob reads the email.
                        //           ImposterBob tries and fails to read the email.
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const bob = yield TestDataGenerator.generateDidKeyPersona();
                        const imposterBob = yield TestDataGenerator.generateDidKeyPersona();
                        const protocolDefinition = emailProtocolDefinition;
                        // Install email protocol on Alice's DWN
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolsConfigureReply.status.code).to.equal(202);
                        // Alice writes an email with Bob as recipient
                        const encodedEmail = new TextEncoder().encode('Dear Bob, hello!');
                        const emailRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'email',
                            schema: protocolDefinition.types.email.schema,
                            dataFormat: protocolDefinition.types.email.dataFormats[0],
                            data: encodedEmail,
                            recipient: bob.did
                        });
                        const imageReply = yield dwn.processMessage(alice.did, emailRecordsWrite.message, { dataStream: emailRecordsWrite.dataStream });
                        expect(imageReply.status.code).to.equal(202);
                        // Bob reads Alice's email
                        const bobRecordsRead = yield RecordsRead.create({
                            filter: {
                                recordId: emailRecordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob)
                        });
                        const bobReadReply = yield dwn.processMessage(alice.did, bobRecordsRead.message);
                        expect(bobReadReply.status.code).to.equal(200);
                        // ImposterBob is not able to read Alice's email
                        const imposterRecordsRead = yield RecordsRead.create({
                            filter: {
                                recordId: emailRecordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(imposterBob)
                        });
                        const imposterReadReply = yield dwn.processMessage(alice.did, imposterRecordsRead.message);
                        expect(imposterReadReply.status.code).to.equal(401);
                        expect(imposterReadReply.status.detail).to.include(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                    }));
                });
                describe('author action rules', () => {
                    it('should allow read with ancestor author rule', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Bob sends an email to Alice, then Bob reads the email.
                        //           ImposterBob tries and fails to read the email.
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const bob = yield TestDataGenerator.generateDidKeyPersona();
                        const imposterBob = yield TestDataGenerator.generateDidKeyPersona();
                        const protocolDefinition = emailProtocolDefinition;
                        // Install email protocol on Alice's DWN
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition
                        });
                        const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolsConfigureReply.status.code).to.equal(202);
                        // Alice writes an email with Bob as recipient
                        const encodedEmail = new TextEncoder().encode('Dear Alice, hello!');
                        const emailRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                            author: bob,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'email',
                            schema: protocolDefinition.types.email.schema,
                            dataFormat: protocolDefinition.types.email.dataFormats[0],
                            data: encodedEmail,
                            recipient: alice.did
                        });
                        const imageReply = yield dwn.processMessage(alice.did, emailRecordsWrite.message, { dataStream: emailRecordsWrite.dataStream });
                        expect(imageReply.status.code).to.equal(202);
                        // Bob reads the email he just sent
                        const bobRecordsRead = yield RecordsRead.create({
                            filter: {
                                recordId: emailRecordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob)
                        });
                        const bobReadReply = yield dwn.processMessage(alice.did, bobRecordsRead.message);
                        expect(bobReadReply.status.code).to.equal(200);
                        // ImposterBob is not able to read the email
                        const imposterRecordsRead = yield RecordsRead.create({
                            filter: {
                                recordId: emailRecordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(imposterBob)
                        });
                        const imposterReadReply = yield dwn.processMessage(alice.did, imposterRecordsRead.message);
                        expect(imposterReadReply.status.code).to.equal(401);
                        expect(imposterReadReply.status.detail).to.include(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
                    }));
                });
                describe('filter based reads', () => {
                    it('should return a filter based read if there is only a single result', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const protocolDefinition = Object.assign({}, nestedProtocol);
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition
                        });
                        const protocolConfigReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolConfigReply.status.code).to.equal(202);
                        const foo1Write = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            schema: protocolDefinition.types.foo.schema,
                            dataFormat: protocolDefinition.types.foo.dataFormats[0],
                            data: new TextEncoder().encode('foo'),
                            recipient: alice.did
                        });
                        const foo1WriteReply = yield dwn.processMessage(alice.did, foo1Write.message, { dataStream: foo1Write.dataStream });
                        expect(foo1WriteReply.status.code).to.equal(202);
                        const fooPathRead = yield RecordsRead.create({
                            filter: {
                                protocol: protocolDefinition.protocol,
                                protocolPath: 'foo',
                            },
                            signer: Jws.createSigner(alice),
                        });
                        const fooPathReply = yield dwn.processMessage(alice.did, fooPathRead.message);
                        expect(fooPathReply.status.code).to.equal(200);
                        expect(fooPathReply.record.recordId).to.equal(foo1Write.message.recordId);
                    }));
                    it('should throw if requested filter has more than a single result', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const protocolDefinition = Object.assign({}, nestedProtocol);
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition
                        });
                        const protocolConfigReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolConfigReply.status.code).to.equal(202);
                        const foo1Write = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            schema: protocolDefinition.types.foo.schema,
                            dataFormat: protocolDefinition.types.foo.dataFormats[0],
                            data: new TextEncoder().encode('foo'),
                            recipient: alice.did
                        });
                        const foo1WriteReply = yield dwn.processMessage(alice.did, foo1Write.message, { dataStream: foo1Write.dataStream });
                        expect(foo1WriteReply.status.code).to.equal(202);
                        const foo2Write = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            schema: protocolDefinition.types.foo.schema,
                            dataFormat: protocolDefinition.types.foo.dataFormats[0],
                            data: new TextEncoder().encode('foo'),
                            recipient: alice.did
                        });
                        const foo2WriteReply = yield dwn.processMessage(alice.did, foo2Write.message, { dataStream: foo2Write.dataStream });
                        expect(foo2WriteReply.status.code).to.equal(202);
                        // Since there are two 'foo' records, this should fail.
                        const fooPathRead = yield RecordsRead.create({
                            filter: {
                                protocol: protocolDefinition.protocol,
                                protocolPath: 'foo',
                            },
                            signer: Jws.createSigner(alice),
                        });
                        const fooPathReply = yield dwn.processMessage(alice.did, fooPathRead.message);
                        expect(fooPathReply.status.code).to.equal(400);
                        expect(fooPathReply.status.detail).to.contain(DwnErrorCode.RecordsReadReturnedMultiple);
                    }));
                });
                describe('protocolRole based reads', () => {
                    it('uses a root-level role to authorize a read', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice writes a chat message writes a chat message. Bob invokes his
                        //           friend role in order to read the chat message.
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
                        // Alice writes a 'chat' record
                        const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: alice.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'chat',
                            data: new TextEncoder().encode('Bob can read this cuz he is my friend'),
                        });
                        const chatReply = yield dwn.processMessage(alice.did, chatRecord.message, { dataStream: chatRecord.dataStream });
                        expect(chatReply.status.code).to.equal(202);
                        // Bob reads Alice's chat record
                        const readChatRecord = yield RecordsRead.create({
                            signer: Jws.createSigner(bob),
                            filter: {
                                recordId: chatRecord.message.recordId,
                            },
                            protocolRole: 'friend'
                        });
                        const chatReadReply = yield dwn.processMessage(alice.did, readChatRecord.message);
                        expect(chatReadReply.status.code).to.equal(200);
                    }));
                    it('rejects root-level role authorized reads if the protocolRole is not a valid protocol path to an active role record', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice writes a chat message writes a chat message. Bob tries to invoke the 'chat' role,
                        //           but 'chat' is not a role.
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const bob = yield TestDataGenerator.generateDidKeyPersona();
                        const protocolDefinition = friendRoleProtocolDefinition;
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition
                        });
                        const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolsConfigureReply.status.code).to.equal(202);
                        // Alice writes a 'chat' record
                        const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: alice.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'chat',
                            data: new TextEncoder().encode('Blah blah blah'),
                        });
                        const chatReply = yield dwn.processMessage(alice.did, chatRecord.message, { dataStream: chatRecord.dataStream });
                        expect(chatReply.status.code).to.equal(202);
                        // Bob tries to invoke a 'chat' role but 'chat' is not a role
                        const readChatRecord = yield RecordsRead.create({
                            signer: Jws.createSigner(bob),
                            filter: {
                                recordId: chatRecord.message.recordId,
                            },
                            protocolRole: 'chat'
                        });
                        const chatReadReply = yield dwn.processMessage(alice.did, readChatRecord.message);
                        expect(chatReadReply.status.code).to.equal(401);
                        expect(chatReadReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationNotARole);
                    }));
                    it('rejects root-level role authorized reads if there is no active role for the recipient', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice writes a chat message writes a chat message. Bob tries to invoke a role,
                        //           but he has not been given one.
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const bob = yield TestDataGenerator.generateDidKeyPersona();
                        const protocolDefinition = friendRoleProtocolDefinition;
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition
                        });
                        const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolsConfigureReply.status.code).to.equal(202);
                        // Alice writes a 'chat' record
                        const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: alice.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'chat',
                            data: new TextEncoder().encode('Blah blah blah'),
                        });
                        const chatReply = yield dwn.processMessage(alice.did, chatRecord.message, { dataStream: chatRecord.dataStream });
                        expect(chatReply.status.code).to.equal(202);
                        // Bob tries to invoke a 'friend' role but he is not a 'friend'
                        const readChatRecord = yield RecordsRead.create({
                            signer: Jws.createSigner(bob),
                            filter: {
                                recordId: chatRecord.message.recordId,
                            },
                            protocolRole: 'friend',
                        });
                        const chatReadReply = yield dwn.processMessage(alice.did, readChatRecord.message);
                        expect(chatReadReply.status.code).to.equal(401);
                        expect(chatReadReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationMatchingRoleRecordNotFound);
                    }));
                    it('can authorize a read using a context role', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice creates a thread and adds Bob to the 'thread/participant' role. Alice writes a chat message.
                        //           Bob invokes the record to read in the chat message.
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const bob = yield TestDataGenerator.generateDidKeyPersona();
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
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread'
                        });
                        const threadRecordReply = yield dwn.processMessage(alice.did, threadRecord.message, { dataStream: threadRecord.dataStream });
                        expect(threadRecordReply.status.code).to.equal(202);
                        // Alice adds Bob as a 'thread/participant' in that thread
                        const participantRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: bob.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread/participant',
                            parentContextId: threadRecord.message.contextId,
                        });
                        const participantRecordReply = yield dwn.processMessage(alice.did, participantRecord.message, { dataStream: participantRecord.dataStream });
                        expect(participantRecordReply.status.code).to.equal(202);
                        // Alice writes a chat message in the thread
                        const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread/chat',
                            parentContextId: threadRecord.message.contextId,
                        });
                        const chatRecordReply = yield dwn.processMessage(alice.did, chatRecord.message, { dataStream: chatRecord.dataStream });
                        expect(chatRecordReply.status.code).to.equal(202);
                        // Bob is able to read his own 'participant' role
                        // He doesn't need to invoke the role because recipients of a record are always authorized to read it
                        const participantRead = yield RecordsRead.create({
                            signer: Jws.createSigner(bob),
                            filter: {
                                protocolPath: 'thread/participant',
                                recipient: bob.did,
                                contextId: threadRecord.message.contextId
                            },
                        });
                        const participantReadReply = yield dwn.processMessage(alice.did, participantRead.message);
                        expect(participantReadReply.status.code).to.equal(200);
                        // Bob is able to read the thread root record
                        const threadRead = yield RecordsRead.create({
                            signer: Jws.createSigner(bob),
                            filter: {
                                recordId: participantReadReply.record.descriptor.parentId,
                            },
                            protocolRole: 'thread/participant'
                        });
                        const threadReadReply = yield dwn.processMessage(alice.did, threadRead.message);
                        expect(threadReadReply.status.code).to.equal(200);
                        // Bob invokes his 'participant' role to read the chat message
                        const chatRead = yield RecordsRead.create({
                            signer: Jws.createSigner(bob),
                            filter: {
                                recordId: chatRecord.message.recordId,
                            },
                            protocolRole: 'thread/participant'
                        });
                        const chatReadReply = yield dwn.processMessage(alice.did, chatRead.message);
                        expect(chatReadReply.status.code).to.equal(200);
                    }));
                    it('should not allow context role to be invoked against a wrong context', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice creates a thread and adds Bob as a participant. Alice creates another thread. Bob tries and fails to invoke his
                        //           context role to write a chat in the second thread
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        const bob = yield TestDataGenerator.generateDidKeyPersona();
                        const protocolDefinition = threadRoleProtocolDefinition;
                        const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition
                        });
                        const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
                        expect(protocolsConfigureReply.status.code).to.equal(202);
                        // Alice creates a thread
                        const threadRecord1 = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: bob.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread'
                        });
                        const threadRecordReply1 = yield dwn.processMessage(alice.did, threadRecord1.message, { dataStream: threadRecord1.dataStream });
                        expect(threadRecordReply1.status.code).to.equal(202);
                        // Alice adds Bob as a 'thread/participant' in that thread
                        const participantRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: bob.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread/participant',
                            parentContextId: threadRecord1.message.contextId,
                        });
                        const participantRecordReply = yield dwn.processMessage(alice.did, participantRecord.message, { dataStream: participantRecord.dataStream });
                        expect(participantRecordReply.status.code).to.equal(202);
                        // Alice creates a second thread
                        const threadRecord2 = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            recipient: bob.did,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread'
                        });
                        const threadRecordReply2 = yield dwn.processMessage(alice.did, threadRecord2.message, { dataStream: threadRecord2.dataStream });
                        expect(threadRecordReply2.status.code).to.equal(202);
                        // Alice writes a chat message in the thread
                        const chatRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'thread/chat',
                            parentContextId: threadRecord2.message.contextId,
                        });
                        const chatRecordReply = yield dwn.processMessage(alice.did, chatRecord.message, { dataStream: chatRecord.dataStream });
                        expect(chatRecordReply.status.code).to.equal(202);
                        // Bob invokes his 'participant' role to read the chat message
                        const chatRead = yield RecordsRead.create({
                            signer: Jws.createSigner(bob),
                            filter: {
                                recordId: chatRecord.message.recordId,
                            },
                            protocolRole: 'thread/participant'
                        });
                        const chatReadReply = yield dwn.processMessage(alice.did, chatRead.message);
                        expect(chatReadReply.status.code).to.equal(401);
                        expect(chatReadReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationMatchingRoleRecordNotFound);
                    }));
                });
            });
            describe('grant based reads', () => {
                it('rejects with 401 an external party attempts to RecordReads if grant has different DWN method scope', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice grants Bob access to RecordsWrite, then Bob tries to invoke the grant with RecordsRead
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // Alice writes a record which Bob will later try to read
                    const { recordsWrite, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                    });
                    const recordsWriteReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream });
                    expect(recordsWriteReply.status.code).to.equal(202);
                    // Alice gives Bob a permission grant with scope RecordsRead
                    const permissionGrant = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: bob.did,
                        dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                        scope: {
                            interface: DwnInterfaceName.Records,
                            method: DwnMethodName.Write,
                            protocol: 'http://example.com/protocol/test',
                        }
                    });
                    const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                    const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                    expect(permissionGrantWriteReply.status.code).to.equal(202);
                    // Bob tries to RecordsRead
                    const recordsRead = yield RecordsRead.create({
                        filter: {
                            recordId: recordsWrite.message.recordId,
                        },
                        signer: Jws.createSigner(bob),
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const recordsReadReply = yield dwn.processMessage(alice.did, recordsRead.message);
                    expect(recordsReadReply.status.code).to.equal(401);
                    expect(recordsReadReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationMethodMismatch);
                }));
                describe('protocol records', () => {
                    it('allows reads of protocol records with unrestricted grant scopes', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice writes a protocol record. Alice gives Bob a grant to read all records in her DWN
                        //           Bob invokes that grant to read the protocol record.
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
                        // Alice gives Bob a permission grant with scope RecordsRead
                        const permissionGrant = yield PermissionsProtocol.createGrant({
                            signer: Jws.createSigner(alice),
                            grantedTo: bob.did,
                            dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                            scope: {
                                interface: DwnInterfaceName.Records,
                                method: DwnMethodName.Read,
                                protocol: protocolDefinition.protocol,
                            }
                        });
                        const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                        const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                        expect(permissionGrantWriteReply.status.code).to.equal(202);
                        // Bob is unable to read the record without using the permission grant
                        const recordsReadWithoutGrant = yield RecordsRead.create({
                            filter: {
                                recordId: recordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob),
                        });
                        const recordsReadWithoutGrantReply = yield dwn.processMessage(alice.did, recordsReadWithoutGrant.message);
                        expect(recordsReadWithoutGrantReply.status.code).to.equal(401);
                        expect(recordsReadWithoutGrantReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionRulesNotFound);
                        // Bob is able to read the record when he uses the permission grant
                        const recordsReadWithGrant = yield RecordsRead.create({
                            filter: {
                                recordId: recordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob),
                            permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                        });
                        const recordsReadWithGrantReply = yield dwn.processMessage(alice.did, recordsReadWithGrant.message);
                        expect(recordsReadWithGrantReply.status.code).to.equal(200);
                    }));
                    it('allows reads of protocol records with matching protocol grant scopes', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice writes a protocol record. Alice gives Bob a grant to read all records in the protocol
                        //           Bob invokes that grant to read the protocol record.
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
                        // Alice gives Bob a permission grant with scope RecordsRead
                        const permissionGrant = yield PermissionsProtocol.createGrant({
                            signer: Jws.createSigner(alice),
                            grantedTo: bob.did,
                            dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                            scope: {
                                interface: DwnInterfaceName.Records,
                                method: DwnMethodName.Read,
                                protocol: protocolDefinition.protocol,
                            }
                        });
                        const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                        const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                        expect(permissionGrantWriteReply.status.code).to.equal(202);
                        // Bob is unable to read the record without using the permission grant
                        const recordsReadWithoutGrant = yield RecordsRead.create({
                            filter: {
                                recordId: recordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob),
                        });
                        const recordsReadWithoutGrantReply = yield dwn.processMessage(alice.did, recordsReadWithoutGrant.message);
                        expect(recordsReadWithoutGrantReply.status.code).to.equal(401);
                        expect(recordsReadWithoutGrantReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionRulesNotFound);
                        // Bob is able to read the record when he uses the permission grant
                        const recordsReadWithGrant = yield RecordsRead.create({
                            filter: {
                                recordId: recordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob),
                            permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                        });
                        const recordsReadWithGrantReply = yield dwn.processMessage(alice.did, recordsReadWithGrant.message);
                        expect(recordsReadWithGrantReply.status.code).to.equal(200);
                    }));
                    it('rejects reads of protocol records with mismatching protocol grant scopes', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice writes a protocol record. Alice gives Bob a grant to read a different protocol
                        //           Bob invokes that grant to read the protocol record, but fails.
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
                        // Alice gives Bob a permission grant with scope RecordsRead
                        const permissionGrant = yield PermissionsProtocol.createGrant({
                            signer: Jws.createSigner(alice),
                            grantedTo: bob.did,
                            dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                            scope: {
                                interface: DwnInterfaceName.Records,
                                method: DwnMethodName.Read,
                                protocol: 'a-different-protocol'
                            }
                        });
                        const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                        const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                        expect(permissionGrantWriteReply.status.code).to.equal(202);
                        // Bob is unable to read the record using the mismatched permission grant
                        const recordsReadWithoutGrant = yield RecordsRead.create({
                            filter: {
                                recordId: recordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob),
                            permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                        });
                        const recordsReadWithoutGrantReply = yield dwn.processMessage(alice.did, recordsReadWithoutGrant.message);
                        expect(recordsReadWithoutGrantReply.status.code).to.equal(401);
                        expect(recordsReadWithoutGrantReply.status.detail).to.contain(DwnErrorCode.RecordsGrantAuthorizationScopeProtocolMismatch);
                    }));
                    it('allows reads of records in the contextId specified in the grant', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice grants Bob access to RecordsRead records with a specific contextId.
                        //           Bob uses it to read a record in that context.
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
                        // Alice gives Bob a permission grant with scope RecordsRead
                        const permissionGrant = yield PermissionsProtocol.createGrant({
                            signer: Jws.createSigner(alice),
                            grantedTo: bob.did,
                            dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                            scope: {
                                interface: DwnInterfaceName.Records,
                                method: DwnMethodName.Read,
                                protocol: protocolDefinition.protocol,
                                contextId: recordsWrite.message.contextId,
                            }
                        });
                        const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                        const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                        expect(permissionGrantWriteReply.status.code).to.equal(202);
                        // Bob is unable to read the record using the mismatched permission grant
                        const recordsReadWithoutGrant = yield RecordsRead.create({
                            filter: {
                                recordId: recordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob),
                            permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                        });
                        const recordsReadWithoutGrantReply = yield dwn.processMessage(alice.did, recordsReadWithoutGrant.message);
                        expect(recordsReadWithoutGrantReply.status.code).to.equal(200);
                    }));
                    it('rejects reads of records in a different contextId than is specified in the grant', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice grants Bob access to RecordsRead records with a specific contextId.
                        //           Bob tries and fails to invoke the grant in order to read a record outside of the context.
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
                        // Alice gives Bob a permission grant with scope RecordsRead
                        const permissionGrant = yield PermissionsProtocol.createGrant({
                            signer: Jws.createSigner(alice),
                            grantedTo: bob.did,
                            dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                            scope: {
                                interface: DwnInterfaceName.Records,
                                method: DwnMethodName.Read,
                                protocol: protocolDefinition.protocol,
                                contextId: yield TestDataGenerator.randomCborSha256Cid(), // different contextId than what Bob will try to read
                            }
                        });
                        const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                        const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                        expect(permissionGrantWriteReply.status.code).to.equal(202);
                        // Bob is unable to read the record using the mismatched permission grant
                        const recordsReadWithoutGrant = yield RecordsRead.create({
                            filter: {
                                recordId: recordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob),
                            permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                        });
                        const recordsReadWithoutGrantReply = yield dwn.processMessage(alice.did, recordsReadWithoutGrant.message);
                        expect(recordsReadWithoutGrantReply.status.code).to.equal(401);
                        expect(recordsReadWithoutGrantReply.status.detail).to.contain(DwnErrorCode.RecordsGrantAuthorizationScopeContextIdMismatch);
                    }));
                    it('allows reads of records in the protocolPath specified in the grant', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice grants Bob access to RecordsRead records with a specific protocolPath.
                        //           Bob uses it to read a record in that protocolPath.
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
                        // Alice gives Bob a permission grant with scope RecordsRead
                        const permissionGrant = yield PermissionsProtocol.createGrant({
                            signer: Jws.createSigner(alice),
                            grantedTo: bob.did,
                            dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                            scope: {
                                interface: DwnInterfaceName.Records,
                                method: DwnMethodName.Read,
                                protocol: protocolDefinition.protocol,
                                protocolPath: recordsWrite.message.descriptor.protocolPath,
                            }
                        });
                        const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                        const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                        expect(permissionGrantWriteReply.status.code).to.equal(202);
                        // Bob is unable to read the record using the mismatched permission grant
                        const recordsReadWithoutGrant = yield RecordsRead.create({
                            filter: {
                                recordId: recordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob),
                            permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                        });
                        const recordsReadWithoutGrantReply = yield dwn.processMessage(alice.did, recordsReadWithoutGrant.message);
                        expect(recordsReadWithoutGrantReply.status.code).to.equal(200);
                    }));
                    it('rejects reads of records in a different protocolPath than is specified in the grant', () => __awaiter(this, void 0, void 0, function* () {
                        // scenario: Alice grants Bob access to RecordsRead records with a specific protocolPath.
                        //           Bob tries and fails to invoke the grant in order to read a record outside of the protocolPath.
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
                        // Alice gives Bob a permission grant with scope RecordsRead
                        const permissionGrant = yield PermissionsProtocol.createGrant({
                            signer: Jws.createSigner(alice),
                            grantedTo: bob.did,
                            dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                            scope: {
                                interface: DwnInterfaceName.Records,
                                method: DwnMethodName.Read,
                                protocol: protocolDefinition.protocol,
                                protocolPath: 'different-protocol-path', // different protocol path than what Bob will try to read
                            }
                        });
                        const grantDataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                        const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream: grantDataStream });
                        expect(permissionGrantWriteReply.status.code).to.equal(202);
                        // Bob is unable to read the record using the mismatched permission grant
                        const recordsReadWithoutGrant = yield RecordsRead.create({
                            filter: {
                                recordId: recordsWrite.message.recordId,
                            },
                            signer: Jws.createSigner(bob),
                            permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                        });
                        const recordsReadWithoutGrantReply = yield dwn.processMessage(alice.did, recordsReadWithoutGrant.message);
                        expect(recordsReadWithoutGrantReply.status.code).to.equal(401);
                        expect(recordsReadWithoutGrantReply.status.detail).to.contain(DwnErrorCode.RecordsGrantAuthorizationScopeProtocolPathMismatch);
                    }));
                });
            });
            it('should return 404 RecordRead if data does not exist', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const recordsRead = yield RecordsRead.create({
                    filter: {
                        recordId: `non-existent-record-id`,
                    },
                    signer: Jws.createSigner(alice)
                });
                const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                expect(readReply.status.code).to.equal(404);
            }));
            it('should return 404 RecordRead if data has been deleted', () => __awaiter(this, void 0, void 0, function* () {
                var _g;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // insert public data
                const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({ author: alice, published: true });
                const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(writeReply.status.code).to.equal(202);
                // ensure data is inserted
                const queryData = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: { recordId: message.recordId }
                });
                const reply = yield dwn.processMessage(alice.did, queryData.message);
                expect(reply.status.code).to.equal(200);
                expect((_g = reply.entries) === null || _g === void 0 ? void 0 : _g.length).to.equal(1);
                // RecordsDelete
                const recordsDelete = yield RecordsDelete.create({
                    recordId: message.recordId,
                    signer: Jws.createSigner(alice)
                });
                const deleteReply = yield dwn.processMessage(alice.did, recordsDelete.message);
                expect(deleteReply.status.code).to.equal(202);
                // RecordsRead
                const recordsRead = yield RecordsRead.create({
                    filter: {
                        recordId: message.recordId,
                    },
                    signer: Jws.createSigner(alice)
                });
                const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                expect(readReply.status.code).to.equal(404);
            }));
            it('should return 404 underlying data store cannot locate the data when data is above threshold', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                sinon.stub(dataStore, 'get').resolves(undefined);
                // insert data larger than the allowed amount in encodedData
                const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    data: TestDataGenerator.randomBytes(DwnConstant.maxDataSizeAllowedToBeEncoded + 1)
                });
                const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(writeReply.status.code).to.equal(202);
                // testing RecordsRead
                const recordsRead = yield RecordsRead.create({
                    filter: {
                        recordId: message.recordId,
                    },
                    signer: Jws.createSigner(alice)
                });
                const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                expect(readReply.status.code).to.equal(404);
            }));
            describe('data from encodedData', () => {
                it('should not get data from DataStore if encodedData exists', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    //since the data is at the threshold it will be returned from the messageStore in the `encodedData` field.
                    const { message, dataStream, dataBytes } = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        data: TestDataGenerator.randomBytes(DwnConstant.maxDataSizeAllowedToBeEncoded)
                    });
                    const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                    expect(writeReply.status.code).to.equal(202);
                    const recordRead = yield RecordsRead.create({
                        filter: {
                            recordId: message.recordId,
                        },
                        signer: Jws.createSigner(alice)
                    });
                    const dataStoreGet = sinon.spy(dataStore, 'get');
                    const recordsReadResponse = yield dwn.processMessage(alice.did, recordRead.message);
                    expect(recordsReadResponse.status.code).to.equal(200);
                    expect(recordsReadResponse.record).to.exist;
                    expect(recordsReadResponse.record.data).to.exist;
                    sinon.assert.notCalled(dataStoreGet);
                    const readData = yield DataStream.toBytes(recordsReadResponse.record.data);
                    expect(readData).to.eql(dataBytes);
                }));
                it('should get data from DataStore if encodedData does not exist', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    //since the data is over the threshold it will not be returned from the messageStore in the `encodedData` field.
                    const { message, dataStream, dataBytes } = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        data: TestDataGenerator.randomBytes(DwnConstant.maxDataSizeAllowedToBeEncoded + 1)
                    });
                    const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                    expect(writeReply.status.code).to.equal(202);
                    const recordRead = yield RecordsRead.create({
                        filter: {
                            recordId: message.recordId,
                        },
                        signer: Jws.createSigner(alice)
                    });
                    const dataStoreGet = sinon.spy(dataStore, 'get');
                    const recordsReadResponse = yield dwn.processMessage(alice.did, recordRead.message);
                    expect(recordsReadResponse.status.code).to.equal(200);
                    expect(recordsReadResponse.record).to.exist;
                    expect(recordsReadResponse.record.data).to.exist;
                    sinon.assert.calledOnce(dataStoreGet);
                    const readData = yield DataStream.toBytes(recordsReadResponse.record.data);
                    expect(readData).to.eql(dataBytes);
                }));
            });
            describe('encryption scenarios', () => {
                it('should be able to decrypt flat-space schema-contained record with a correct derived key', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice writes into her own DWN an encrypted record and she is able to decrypt it
                    const alice = yield TestDataGenerator.generatePersona();
                    TestStubGenerator.stubDidResolver(didResolver, [alice]);
                    // encrypt Alice's record
                    const originalData = TestDataGenerator.randomBytes(1000);
                    const originalDataStream = DataStream.fromBytes(originalData);
                    const dataEncryptionInitializationVector = TestDataGenerator.randomBytes(16);
                    const dataEncryptionKey = TestDataGenerator.randomBytes(32);
                    const encryptedDataStream = yield Encryption.aes256CtrEncrypt(dataEncryptionKey, dataEncryptionInitializationVector, originalDataStream);
                    const encryptedDataBytes = yield DataStream.toBytes(encryptedDataStream);
                    // TODO: #450 - Should not require a root key to specify the derivation scheme (https://github.com/TBD54566975/dwn-sdk-js/issues/450)
                    const rootPrivateKeyWithSchemasScheme = {
                        rootKeyId: alice.keyId,
                        derivationScheme: KeyDerivationScheme.Schemas,
                        derivedPrivateKey: alice.keyPair.privateJwk
                    };
                    const schema = 'https://some-schema.com';
                    const schemaDerivationPath = Records.constructKeyDerivationPathUsingSchemasScheme(schema);
                    const schemaDerivedPrivateKey = yield HdKey.derivePrivateKey(rootPrivateKeyWithSchemasScheme, schemaDerivationPath);
                    const schemaDerivedPublicKey = yield Secp256k1.getPublicJwk(schemaDerivedPrivateKey.derivedPrivateKey);
                    const rootPrivateKeyWithDataFormatsScheme = {
                        rootKeyId: alice.keyId,
                        derivationScheme: KeyDerivationScheme.DataFormats,
                        derivedPrivateKey: alice.keyPair.privateJwk
                    };
                    const dataFormat = 'some/format';
                    const dataFormatDerivationPath = Records.constructKeyDerivationPathUsingDataFormatsScheme(schema, dataFormat);
                    const dataFormatDerivedPublicKey = yield HdKey.derivePublicKey(rootPrivateKeyWithDataFormatsScheme, dataFormatDerivationPath);
                    const encryptionInput = {
                        initializationVector: dataEncryptionInitializationVector,
                        key: dataEncryptionKey,
                        keyEncryptionInputs: [{
                                publicKeyId: alice.keyId,
                                publicKey: schemaDerivedPublicKey,
                                derivationScheme: KeyDerivationScheme.Schemas
                            },
                            {
                                publicKeyId: alice.keyId,
                                publicKey: dataFormatDerivedPublicKey,
                                derivationScheme: KeyDerivationScheme.DataFormats
                            }]
                    };
                    const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        schema,
                        dataFormat,
                        data: encryptedDataBytes,
                        encryptionInput
                    });
                    const writeReply = yield dwn.processMessage(alice.did, message, { dataStream });
                    expect(writeReply.status.code).to.equal(202);
                    const recordsRead = yield RecordsRead.create({
                        filter: {
                            recordId: message.recordId,
                        },
                        signer: Jws.createSigner(alice)
                    });
                    // test able to derive correct key using `schemas` scheme from root key to decrypt the message
                    const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                    expect(readReply.status.code).to.equal(200);
                    const recordsWriteMessage = readReply.record;
                    const cipherStream = readReply.record.data;
                    const plaintextDataStream = yield Records.decrypt(recordsWriteMessage, schemaDerivedPrivateKey, cipherStream);
                    const plaintextBytes = yield DataStream.toBytes(plaintextDataStream);
                    expect(ArrayUtility.byteArraysEqual(plaintextBytes, originalData)).to.be.true;
                    // test able to derive correct key using `dataFormat` scheme from root key to decrypt the message
                    const readReply2 = yield dwn.processMessage(alice.did, recordsRead.message); // send the same read message to get a new cipher stream
                    expect(readReply2.status.code).to.equal(200);
                    const cipherStream2 = readReply2.record.data;
                    const plaintextDataStream2 = yield Records.decrypt(recordsWriteMessage, rootPrivateKeyWithDataFormatsScheme, cipherStream2);
                    const plaintextBytes2 = yield DataStream.toBytes(plaintextDataStream2);
                    expect(ArrayUtility.byteArraysEqual(plaintextBytes2, originalData)).to.be.true;
                    // test unable to decrypt the message if dataFormat-derived key is derived without taking `schema` as input to derivation path
                    const readReply3 = yield dwn.processMessage(alice.did, recordsRead.message); // process the same read message to get a new cipher stream
                    expect(readReply3.status.code).to.equal(200);
                    const cipherStream3 = readReply3.record.data;
                    const invalidDerivationPath = [KeyDerivationScheme.DataFormats, message.descriptor.dataFormat];
                    const inValidDescendantPrivateKey = yield HdKey.derivePrivateKey(rootPrivateKeyWithDataFormatsScheme, invalidDerivationPath);
                    yield expect(Records.decrypt(recordsWriteMessage, inValidDescendantPrivateKey, cipherStream3)).to.be.rejectedWith(DwnErrorCode.RecordsInvalidAncestorKeyDerivationSegment);
                }));
                it('should be able to decrypt flat-space schema-less record with the correct derived key', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice writes into her own DWN an encrypted record and she is able to decrypt it
                    const alice = yield TestDataGenerator.generatePersona();
                    TestStubGenerator.stubDidResolver(didResolver, [alice]);
                    // encrypt Alice's record
                    const originalData = TestDataGenerator.randomBytes(1000);
                    const originalDataStream = DataStream.fromBytes(originalData);
                    const dataEncryptionInitializationVector = TestDataGenerator.randomBytes(16);
                    const dataEncryptionKey = TestDataGenerator.randomBytes(32);
                    const encryptedDataStream = yield Encryption.aes256CtrEncrypt(dataEncryptionKey, dataEncryptionInitializationVector, originalDataStream);
                    const encryptedDataBytes = yield DataStream.toBytes(encryptedDataStream);
                    // TODO: #450 - Should not require a root key to specify the derivation scheme (https://github.com/TBD54566975/dwn-sdk-js/issues/450)
                    const rootPrivateKeyWithDataFormatsScheme = {
                        rootKeyId: alice.keyId,
                        derivationScheme: KeyDerivationScheme.DataFormats,
                        derivedPrivateKey: alice.keyPair.privateJwk
                    };
                    const dataFormat = `image/jpg`;
                    const dataFormatDerivationPath = Records.constructKeyDerivationPathUsingDataFormatsScheme(undefined, dataFormat);
                    const dataFormatDerivedPublicKey = yield HdKey.derivePublicKey(rootPrivateKeyWithDataFormatsScheme, dataFormatDerivationPath);
                    const encryptionInput = {
                        initializationVector: dataEncryptionInitializationVector,
                        key: dataEncryptionKey,
                        keyEncryptionInputs: [{
                                publicKeyId: alice.keyId,
                                publicKey: dataFormatDerivedPublicKey,
                                derivationScheme: KeyDerivationScheme.DataFormats
                            }]
                    };
                    const recordsWrite = yield RecordsWrite.create({
                        signer: Jws.createSigner(alice),
                        dataFormat,
                        data: encryptedDataBytes,
                        encryptionInput
                    });
                    const dataStream = DataStream.fromBytes(encryptedDataBytes);
                    const writeReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream });
                    expect(writeReply.status.code).to.equal(202);
                    const recordsRead = yield RecordsRead.create({
                        filter: {
                            recordId: recordsWrite.message.recordId,
                        },
                        signer: Jws.createSigner(alice)
                    });
                    // test able to derive correct key using `dataFormat` scheme from root key to decrypt the message
                    const readReply = yield dwn.processMessage(alice.did, recordsRead.message); // send the same read message to get a new cipher stream
                    expect(readReply.status.code).to.equal(200);
                    const cipherStream = readReply.record.data;
                    const recordsWriteMessage = readReply.record;
                    const plaintextDataStream = yield Records.decrypt(recordsWriteMessage, rootPrivateKeyWithDataFormatsScheme, cipherStream);
                    const plaintextBytes = yield DataStream.toBytes(plaintextDataStream);
                    expect(ArrayUtility.byteArraysEqual(plaintextBytes, originalData)).to.be.true;
                }));
                it('should only be able to decrypt record with a correct derived private key  - `protocol-context` derivation scheme', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Bob initiated an encrypted chat thread with Alice,
                    // bob is able to decrypt subsequent messages from Alice using the `protocol-context` derived private key
                    // creating Alice and Bob persona and setting up a stub DID resolver
                    const alice = yield TestDataGenerator.generatePersona();
                    const bob = yield TestDataGenerator.generatePersona();
                    TestStubGenerator.stubDidResolver(didResolver, [alice, bob]);
                    // Alice configures chat protocol with encryption
                    const protocolDefinition = chatProtocolDefinition;
                    const protocolDefinitionForAlice = yield Protocols.deriveAndInjectPublicEncryptionKeys(protocolDefinition, alice.keyId, alice.keyPair.privateJwk);
                    const protocolsConfigureForAlice = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition: protocolDefinitionForAlice
                    });
                    const protocolsConfigureForAliceReply = yield dwn.processMessage(alice.did, protocolsConfigureForAlice.message);
                    expect(protocolsConfigureForAliceReply.status.code).to.equal(202);
                    // Bob configures chat protocol with encryption
                    const protocolDefinitionForBob = yield Protocols.deriveAndInjectPublicEncryptionKeys(protocolDefinition, bob.keyId, bob.keyPair.privateJwk);
                    const protocolsConfigureForBob = yield TestDataGenerator.generateProtocolsConfigure({
                        author: bob,
                        protocolDefinition: protocolDefinitionForBob
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(bob.did, protocolsConfigureForBob.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Bob queries for Alice's chat protocol definition
                    const protocolsQuery = yield ProtocolsQuery.create({
                        filter: { protocol: chatProtocolDefinition.protocol }
                    });
                    const protocolsQueryReply = yield dwn.processMessage(alice.did, protocolsQuery.message);
                    const protocolsConfigureMessageReceived = protocolsQueryReply.entries[0];
                    // Bob verifies that the chat protocol definition is authored by Alice
                    yield authenticate(protocolsConfigureMessageReceived.authorization, didResolver);
                    const protocolsConfigureFetched = yield ProtocolsConfigure.parse(protocolsConfigureMessageReceived);
                    expect(protocolsConfigureFetched.author).to.equal(alice.did);
                    // Bob creates an initiating a chat thread RecordsWrite
                    const plaintextMessageToAlice = TestDataGenerator.randomBytes(100);
                    const { message: threadMessage, dataStream, recordsWrite, encryptedDataBytes, encryptionInput } = yield TestDataGenerator.generateProtocolEncryptedRecordsWrite({
                        plaintextBytes: plaintextMessageToAlice,
                        author: bob,
                        protocolDefinition: protocolsConfigureForAlice.message.descriptor.definition,
                        protocolPath: 'thread',
                        encryptSymmetricKeyWithProtocolPathDerivedKey: true,
                        encryptSymmetricKeyWithProtocolContextDerivedKey: true
                    });
                    // Bob writes the encrypted chat thread to Alice's DWN
                    const bobToAliceWriteReply = yield dwn.processMessage(alice.did, threadMessage, { dataStream });
                    expect(bobToAliceWriteReply.status.code).to.equal(202);
                    // Bob also needs to write the same encrypted chat thread to his own DWN
                    // Opportunity here to create a much nicer utility method for this entire block
                    const bobToBobRecordsWrite = yield RecordsWrite.createFrom({
                        recordsWriteMessage: recordsWrite.message,
                        messageTimestamp: recordsWrite.message.descriptor.messageTimestamp
                    });
                    const bobRootPrivateKey = {
                        rootKeyId: bob.keyId,
                        derivationScheme: KeyDerivationScheme.ProtocolContext,
                        derivedPrivateKey: bob.keyPair.privateJwk
                    };
                    const protocolPathDerivationPath = Records.constructKeyDerivationPathUsingProtocolPathScheme(recordsWrite.message.descriptor);
                    const protocolPathDerivedPublicJwkForBobsDwn = yield HdKey.derivePublicKey(bobRootPrivateKey, protocolPathDerivationPath);
                    const protocolPathDerivedKeyEncryptionInputForBobsDwn = {
                        publicKeyId: bob.keyId,
                        publicKey: protocolPathDerivedPublicJwkForBobsDwn,
                        derivationScheme: KeyDerivationScheme.ProtocolPath
                    };
                    const encryptionInputForBobsDwn = encryptionInput;
                    const indexOfKeyEncryptionInputToReplace = encryptionInputForBobsDwn.keyEncryptionInputs.findIndex(input => input.derivationScheme === KeyDerivationScheme.ProtocolPath);
                    encryptionInputForBobsDwn.keyEncryptionInputs[indexOfKeyEncryptionInputToReplace] = protocolPathDerivedKeyEncryptionInputForBobsDwn;
                    yield bobToBobRecordsWrite.encryptSymmetricEncryptionKey(encryptionInputForBobsDwn);
                    yield bobToBobRecordsWrite.sign({ signer: Jws.createSigner(bob) });
                    const dataStreamForBobsDwn = DataStream.fromBytes(encryptedDataBytes);
                    const bobToBobWriteReply = yield dwn.processMessage(bob.did, bobToBobRecordsWrite.message, { dataStream: dataStreamForBobsDwn });
                    expect(bobToBobWriteReply.status.code).to.equal(202);
                    // NOTE: we know Alice is able to decrypt the message using protocol-path derived key through other tests, so we won't verify it again
                    // test that anyone with the protocol-context derived private key is able to decrypt the message
                    const recordsRead = yield RecordsRead.create({
                        filter: {
                            recordId: threadMessage.recordId,
                        },
                        signer: Jws.createSigner(alice)
                    });
                    const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                    expect(readReply.status.code).to.equal(200);
                    const fetchedRecordsWrite = readReply.record;
                    const cipherStream = readReply.record.data;
                    const derivationPathFromReadContext = Records.constructKeyDerivationPathUsingProtocolContextScheme(fetchedRecordsWrite.contextId);
                    const protocolContextDerivedPrivateJwk = yield HdKey.derivePrivateKey(bobRootPrivateKey, derivationPathFromReadContext);
                    const plaintextDataStream = yield Records.decrypt(fetchedRecordsWrite, protocolContextDerivedPrivateJwk, cipherStream);
                    const plaintextBytes = yield DataStream.toBytes(plaintextDataStream);
                    expect(ArrayUtility.byteArraysEqual(plaintextBytes, plaintextMessageToAlice)).to.be.true;
                    // verify that Alice is able to send an encrypted message using the protocol-context derived public key and Bob is able to decrypt it
                    // NOTE: we will skip verification of Bob's protocol configuration because we have test the such scenario above as well as in other tests
                    const { derivedPublicKey: protocolContextDerivedPublicJwkReturned, rootKeyId: protocolContextDerivingRootKeyIdReturned } = fetchedRecordsWrite.encryption.keyEncryption.find(encryptedKey => encryptedKey.derivationScheme === KeyDerivationScheme.ProtocolContext);
                    const plaintextMessageToBob = TestDataGenerator.randomBytes(100);
                    const recordsWriteToBob = yield TestDataGenerator.generateProtocolEncryptedRecordsWrite({
                        plaintextBytes: plaintextMessageToBob,
                        author: alice,
                        protocolDefinition: protocolsConfigureForBob.message.descriptor.definition,
                        protocolPath: 'thread/message',
                        protocolParentContextId: fetchedRecordsWrite.contextId,
                        protocolContextDerivingRootKeyId: protocolContextDerivingRootKeyIdReturned,
                        protocolContextDerivedPublicJwk: protocolContextDerivedPublicJwkReturned,
                        encryptSymmetricKeyWithProtocolPathDerivedKey: true,
                        encryptSymmetricKeyWithProtocolContextDerivedKey: true
                    });
                    // Alice sends the message to Bob
                    const aliceWriteReply = yield dwn.processMessage(bob.did, recordsWriteToBob.message, { dataStream: recordsWriteToBob.dataStream });
                    expect(aliceWriteReply.status.code).to.equal(202);
                    // test that Bob is able to read and decrypt Alice's message
                    const recordsReadByBob = yield RecordsRead.create({
                        filter: {
                            recordId: recordsWriteToBob.message.recordId,
                        },
                        signer: Jws.createSigner(bob)
                    });
                    const readByBobReply = yield dwn.processMessage(bob.did, recordsReadByBob.message);
                    expect(readByBobReply.status.code).to.equal(200);
                    const fetchedRecordsWrite2 = readByBobReply.record;
                    const cipherStream2 = readByBobReply.record.data;
                    const plaintextDataStream2 = yield Records.decrypt(fetchedRecordsWrite2, protocolContextDerivedPrivateJwk, cipherStream2);
                    const plaintextBytes2 = yield DataStream.toBytes(plaintextDataStream2);
                    expect(ArrayUtility.byteArraysEqual(plaintextBytes2, plaintextMessageToBob)).to.be.true;
                }));
                it('should only be able to decrypt record with a correct derived private key  - `protocols` derivation scheme', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Bob writes into Alice's DWN an encrypted "email", alice is able to decrypt it
                    var _a;
                    // creating Alice and Bob persona and setting up a stub DID resolver
                    const alice = yield TestDataGenerator.generatePersona();
                    const bob = yield TestDataGenerator.generatePersona();
                    TestStubGenerator.stubDidResolver(didResolver, [alice, bob]);
                    // Alice configures email protocol with encryption
                    const protocolDefinition = emailProtocolDefinition;
                    const encryptedProtocolDefinition = yield Protocols.deriveAndInjectPublicEncryptionKeys(protocolDefinition, alice.keyId, alice.keyPair.privateJwk);
                    const protocolsConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition: encryptedProtocolDefinition
                    });
                    const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfigure.message);
                    expect(protocolsConfigureReply.status.code).to.equal(202);
                    // Bob queries for Alice's email protocol definition
                    const protocolsQuery = yield ProtocolsQuery.create({
                        filter: { protocol: emailProtocolDefinition.protocol }
                    });
                    const protocolsQueryReply = yield dwn.processMessage(alice.did, protocolsQuery.message);
                    const protocolsConfigureMessageReceived = protocolsQueryReply.entries[0];
                    // Bob verifies that the email protocol definition is authored by Alice
                    yield authenticate(protocolsConfigureMessageReceived.authorization, didResolver);
                    const protocolsConfigureFetched = yield ProtocolsConfigure.parse(protocolsConfigureMessageReceived);
                    expect(protocolsConfigureFetched.author).to.equal(alice.did);
                    // Bob encrypts his email to Alice with a randomly generated symmetric key
                    const bobMessageBytes = TestDataGenerator.randomBytes(100);
                    const bobMessageStream = DataStream.fromBytes(bobMessageBytes);
                    const dataEncryptionInitializationVector = TestDataGenerator.randomBytes(16);
                    const dataEncryptionKey = TestDataGenerator.randomBytes(32);
                    const bobMessageEncryptedStream = yield Encryption.aes256CtrEncrypt(dataEncryptionKey, dataEncryptionInitializationVector, bobMessageStream);
                    const bobMessageEncryptedBytes = yield DataStream.toBytes(bobMessageEncryptedStream);
                    // Bob generates an encrypted RecordsWrite,
                    // the public encryption key designated by Alice is used to encrypt the symmetric key Bob generated above
                    const publicJwk = (_a = protocolsConfigureFetched.message.descriptor.definition.structure.email.$encryption) === null || _a === void 0 ? void 0 : _a.publicKeyJwk;
                    expect(publicJwk).to.not.be.undefined;
                    const encryptionInput = {
                        initializationVector: dataEncryptionInitializationVector,
                        key: dataEncryptionKey,
                        keyEncryptionInputs: [{
                                publicKeyId: alice.keyId,
                                publicKey: publicJwk,
                                derivationScheme: KeyDerivationScheme.ProtocolPath
                            }]
                    };
                    const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                        author: bob,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'email',
                        schema: protocolDefinition.types.email.schema,
                        dataFormat: protocolDefinition.types.email.dataFormats[0],
                        data: bobMessageEncryptedBytes,
                        encryptionInput
                    });
                    // Bob writes the encrypted email to Alice's DWN
                    const bobWriteReply = yield dwn.processMessage(alice.did, message, { dataStream });
                    expect(bobWriteReply.status.code).to.equal(202);
                    // Alice reads the encrypted email
                    // assume Alice already made query to get the `recordId` of the email
                    const recordsRead = yield RecordsRead.create({
                        filter: {
                            recordId: message.recordId,
                        },
                        signer: Jws.createSigner(alice)
                    });
                    const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
                    expect(readReply.status.code).to.equal(200);
                    // test that Alice is able decrypt the encrypted email from Bob using the root key
                    const rootPrivateKey = {
                        rootKeyId: alice.keyId,
                        derivationScheme: KeyDerivationScheme.ProtocolPath,
                        derivedPrivateKey: alice.keyPair.privateJwk
                    };
                    const fetchedRecordsWrite = readReply.record;
                    const cipherStream = readReply.record.data;
                    const plaintextDataStream = yield Records.decrypt(fetchedRecordsWrite, rootPrivateKey, cipherStream);
                    const plaintextBytes = yield DataStream.toBytes(plaintextDataStream);
                    expect(ArrayUtility.byteArraysEqual(plaintextBytes, bobMessageBytes)).to.be.true;
                    // test that a correct derived key is able decrypt the encrypted email from Bob
                    const readReply2 = yield dwn.processMessage(alice.did, recordsRead.message);
                    expect(readReply2.status.code).to.equal(200);
                    const relativeDescendantDerivationPath = Records.constructKeyDerivationPath(KeyDerivationScheme.ProtocolPath, fetchedRecordsWrite);
                    const derivedPrivateKey = yield HdKey.derivePrivateKey(rootPrivateKey, relativeDescendantDerivationPath);
                    const fetchedRecordsWrite2 = readReply2.record;
                    const cipherStream2 = readReply2.record.data;
                    const plaintextDataStream2 = yield Records.decrypt(fetchedRecordsWrite2, derivedPrivateKey, cipherStream2);
                    const plaintextBytes2 = yield DataStream.toBytes(plaintextDataStream2);
                    expect(ArrayUtility.byteArraysEqual(plaintextBytes2, bobMessageBytes)).to.be.true;
                    // test unable to decrypt the message if derived key has an unexpected path
                    const invalidDerivationPath = [KeyDerivationScheme.ProtocolPath, protocolDefinition.protocol, 'invalidContextId'];
                    const inValidDescendantPrivateKey = yield HdKey.derivePrivateKey(rootPrivateKey, invalidDerivationPath);
                    yield expect(Records.decrypt(fetchedRecordsWrite, inValidDescendantPrivateKey, cipherStream)).to.be.rejectedWith(DwnErrorCode.RecordsInvalidAncestorKeyDerivationSegment);
                    // test unable to decrypt the message if no derivation scheme used by the message matches the scheme used by the given private key
                    const privateKeyWithMismatchingDerivationScheme = {
                        rootKeyId: alice.keyId,
                        derivationScheme: 'scheme-that-is-not-protocol-context',
                        derivedPrivateKey: alice.keyPair.privateJwk
                    };
                    yield expect(Records.decrypt(fetchedRecordsWrite, privateKeyWithMismatchingDerivationScheme, cipherStream)).to.be.rejectedWith(DwnErrorCode.RecordsDecryptNoMatchingKeyEncryptedFound);
                    // test unable to decrypt the message if public key ID does not match the derived private key
                    const privateKeyWithMismatchingKeyId = {
                        rootKeyId: 'mismatchingKeyId',
                        derivationScheme: KeyDerivationScheme.ProtocolPath,
                        derivedPrivateKey: alice.keyPair.privateJwk
                    };
                    yield expect(Records.decrypt(fetchedRecordsWrite, privateKeyWithMismatchingKeyId, cipherStream)).to.be.rejectedWith(DwnErrorCode.RecordsDecryptNoMatchingKeyEncryptedFound);
                }));
            });
        });
        it('should return 401 if signature check fails', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const recordsRead = yield RecordsRead.create({
                filter: {
                    recordId: 'any-id',
                },
                signer: Jws.createSigner(alice)
            });
            // setting up a stub did resolver & message store
            // intentionally not supplying the public key so a different public key is generated to simulate invalid signature
            const mismatchingPersona = yield TestDataGenerator.generatePersona({ did: alice.did, keyId: alice.keyId });
            const didResolver = TestStubGenerator.createDidResolverStub(mismatchingPersona);
            const messageStore = stubInterface();
            const dataStore = stubInterface();
            const recordsReadHandler = new RecordsReadHandler(didResolver, messageStore, dataStore);
            const reply = yield recordsReadHandler.handle({ tenant: alice.did, message: recordsRead.message });
            expect(reply.status.code).to.equal(401);
        }));
        it('should return 400 if fail parsing the message', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const recordsRead = yield RecordsRead.create({
                filter: {
                    recordId: 'any-id',
                },
                signer: Jws.createSigner(alice)
            });
            // setting up a stub method resolver & message store
            const messageStore = stubInterface();
            const dataStore = stubInterface();
            const recordsReadHandler = new RecordsReadHandler(didResolver, messageStore, dataStore);
            // stub the `parse()` function to throw an error
            sinon.stub(RecordsRead, 'parse').throws('anyError');
            const reply = yield recordsReadHandler.handle({ tenant: alice.did, message: recordsRead.message });
            expect(reply.status.code).to.equal(400);
        }));
    });
}
//# sourceMappingURL=records-read.spec.js.map