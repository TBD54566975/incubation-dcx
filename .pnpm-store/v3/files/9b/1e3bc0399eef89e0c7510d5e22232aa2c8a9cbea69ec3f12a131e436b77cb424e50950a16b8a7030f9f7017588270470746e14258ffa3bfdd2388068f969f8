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
import minimalProtocolDefinition from '../vectors/protocol-definitions/minimal.json' assert { type: 'json' };
import sinon from 'sinon';
import chai, { expect } from 'chai';
import { DataStream } from '../../src/utils/data-stream.js';
import { Dwn } from '../../src/dwn.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { Jws } from '../../src/utils/jws.js';
import { PermissionGrant } from '../../src/protocols/permission-grant.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { Time } from '../../src/utils/time.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import { DwnInterfaceName, DwnMethodName, Encoder, PermissionsProtocol, ProtocolsConfigure } from '../../src/index.js';
chai.use(chaiAsPromised);
export function testOwnerDelegatedGrant() {
    describe('owner delegated grant', () => __awaiter(this, void 0, void 0, function* () {
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
            it('should throw if a message invokes an owner-delegated grant (ID) but the owner-delegated grant is not given', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generatePersona();
                const bob = yield TestDataGenerator.generatePersona();
                const appX = yield TestDataGenerator.generatePersona();
                // Alice grants App X to write as her for the chat protocol
                const scope = {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Write,
                    protocol: 'chat'
                };
                const grantToAppX = yield PermissionsProtocol.createGrant({
                    delegated: true,
                    dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                    description: 'Allow App X to write as me in chat protocol',
                    grantedTo: appX.did,
                    scope,
                    signer: Jws.createSigner(alice)
                });
                // Bob creates a RecordsWrite message
                const recordsWrite = yield RecordsWrite.create({
                    signer: Jws.createSigner(bob),
                    dataFormat: 'application/octet-stream',
                    data: TestDataGenerator.randomBytes(10),
                });
                // App X signs over Bob's RecordsWrite as DWN owner but does not include the delegated grant (we remove it below)
                yield recordsWrite.signAsOwnerDelegate(Jws.createSigner(appX), grantToAppX.dataEncodedMessage);
                delete recordsWrite.message.authorization.ownerDelegatedGrant; // intentionally remove `ownerDelegatedGrant`
                const parsePromise = RecordsWrite.parse(recordsWrite.message);
                yield expect(parsePromise).to.be.rejectedWith(DwnErrorCode.RecordsOwnerDelegatedGrantAndIdExistenceMismatch);
            }));
            it('should throw if a message includes an owner-delegated grant but does not reference it in owner signature', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generatePersona();
                const bob = yield TestDataGenerator.generatePersona();
                const appX = yield TestDataGenerator.generatePersona();
                // Alice grants App X to write as her for the chat protocol
                const scope = {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Write,
                    protocol: 'chat'
                };
                const grantToAppX = yield PermissionsProtocol.createGrant({
                    delegated: true,
                    dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                    description: 'Allow App X to write as me in chat protocol',
                    grantedTo: appX.did,
                    scope,
                    signer: Jws.createSigner(alice)
                });
                // Bob creates a RecordsWrite message
                const recordsWrite = yield RecordsWrite.create({
                    signer: Jws.createSigner(bob),
                    dataFormat: 'application/octet-stream',
                    data: TestDataGenerator.randomBytes(10),
                });
                // App X attempts to sign over Bob's RecordsWrite as the DWN owner by including an owner-delegated grant
                // but does not reference the grant ID in owner signature (we remove it below)
                yield recordsWrite.signAsOwnerDelegate(Jws.createSigner(appX), grantToAppX.dataEncodedMessage);
                const ownerSignaturePayloadCopy = Object.assign({}, recordsWrite.ownerSignaturePayload);
                delete ownerSignaturePayloadCopy.delegatedGrantId; // intentionally remove `delegatedGrantId` in ownerSignature
                recordsWrite.message.authorization.ownerSignature.payload = Encoder.stringToBase64Url(JSON.stringify(ownerSignaturePayloadCopy));
                const parsePromise = RecordsWrite.parse(recordsWrite.message);
                yield expect(parsePromise).to.be.rejectedWith(DwnErrorCode.RecordsOwnerDelegatedGrantAndIdExistenceMismatch);
            }));
        }));
        it('should only allow correct entity invoking an owner-delegated grant to write', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // scenario:
            // 1. Alice installs a protocol
            // 2. Alice creates a delegated grant for app X to write in the protocol
            // 3. A third party (Bob) authors a RecordsWrite
            // 4. Sanity test that Bob's RecordsWrite cannot be written to Alice's DWN by itself
            // 5. Verify that App Y cannot write Bob's message in Alice's DWN by invoking the delegated grant for App X.
            // 6. Verify that App X can successfully write Bob's message in Alice's DWN by invoking an owner-delegated grant
            // 7. Sanity verify the RecordsWrite written by App X
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const appX = yield TestDataGenerator.generateDidKeyPersona();
            const appY = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol
            const protocolDefinition = minimalProtocolDefinition;
            const protocol = minimalProtocolDefinition.protocol;
            const protocolsConfig = yield ProtocolsConfigure.create({
                signer: Jws.createSigner(alice),
                definition: protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a delegated grant for app X to write in the protocol
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const appXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: appX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // 3. A third party (Bob) authors a RecordsWrite
            const bobRecordsWriteBytes = new TextEncoder().encode('message from Bob');
            const bobRecordsWrite = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol,
                protocolPath: 'foo',
                dataFormat: 'any-format',
                data: bobRecordsWriteBytes
            });
            // 4. Sanity test that Bob's RecordsWrite cannot be written to Alice's DWN by itself
            const unauthorizedRecordsWriteReply = yield dwn.processMessage(alice.did, bobRecordsWrite.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(unauthorizedRecordsWriteReply.status.code).to.equal(401);
            // 5. Verify that App Y cannot write Bob's message in Alice's DWN by invoking the delegated grant for App X.
            const appYAugmentedWrite = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield appYAugmentedWrite.signAsOwnerDelegate(Jws.createSigner(appY), appXGrant.dataEncodedMessage);
            const appYWriteReply = yield dwn.processMessage(alice.did, appYAugmentedWrite.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(appYWriteReply.status.code).to.equal(400);
            expect(appYWriteReply.status.detail).to.contain(DwnErrorCode.RecordsOwnerDelegatedGrantGrantedToAndOwnerSignatureMismatch);
            // 6. Verify that App X can successfully write Bob's message in Alice's DWN by invoking an owner-delegated grant
            const appXAugmentedWrite = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield appXAugmentedWrite.signAsOwnerDelegate(Jws.createSigner(appX), appXGrant.dataEncodedMessage);
            const appXWriteReply = yield dwn.processMessage(alice.did, appXAugmentedWrite.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(appXWriteReply.status.code).to.equal(202);
            // 7. Sanity verify the RecordsWrite written by App X
            const recordsQuery = yield TestDataGenerator.generateRecordsQuery({
                author: alice,
                filter: { protocol }
            });
            const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryReply.status.code).to.equal(200);
            expect((_a = recordsQueryReply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(1);
            const fetchedEntry = recordsQueryReply.entries[0];
            expect(fetchedEntry.encodedData).to.equal(Encoder.bytesToBase64Url(bobRecordsWriteBytes));
            const fetchedRecordsWrite = yield RecordsWrite.parse(fetchedEntry);
            expect(fetchedRecordsWrite.author).to.equal(bob.did);
        }));
        it('should not allow entity using a non-delegated grant as an owner-delegated grant to invoke write', () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            // scenario:
            // 1. Alice installs a protocol
            // 2. Alice creates a non-delegated grant for app X to write in the protocol
            // 3. A third party (Bob) authors a RecordsWrite
            // 4. Verify that App X cannot write Bob's message in Alice's DWN by invoking an non-delegated grant
            // 5. Sanity verify the RecordsWrite is not written by App X
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const appX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol
            const protocolDefinition = minimalProtocolDefinition;
            const protocol = minimalProtocolDefinition.protocol;
            const protocolsConfig = yield ProtocolsConfigure.create({
                signer: Jws.createSigner(alice),
                definition: protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a non-delegated grant for app X to write in the protocol
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const appXGrant = yield PermissionsProtocol.createGrant({
                // delegated   : true, // intentionally commented out to show that this is not a delegated grant
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: appX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // 3. A third party (Bob) authors a RecordsWrite
            const bobRecordsWriteBytes = new TextEncoder().encode('message from Bob');
            const bobRecordsWrite = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol,
                protocolPath: 'foo',
                dataFormat: 'any-format',
                data: bobRecordsWriteBytes
            });
            // 4. Verify that App X cannot write Bob's message in Alice's DWN by invoking an non-delegated grant
            const appXAugmentedWrite = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield appXAugmentedWrite.signAsOwnerDelegate(Jws.createSigner(appX), appXGrant.dataEncodedMessage);
            const appXWriteReply = yield dwn.processMessage(alice.did, appXAugmentedWrite.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(appXWriteReply.status.code).to.equal(400);
            expect(appXWriteReply.status.detail).to.contain(DwnErrorCode.RecordsOwnerDelegatedGrantNotADelegatedGrant);
            // 5. Sanity verify the RecordsWrite is not written by App X
            const recordsQuery = yield TestDataGenerator.generateRecordsQuery({
                author: alice,
                filter: { protocol }
            });
            const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryReply.status.code).to.equal(200);
            expect((_b = recordsQueryReply.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(0);
        }));
        it('should fail if owner-delegated grant invoked for write has a mismatching interface method or protocol scope', () => __awaiter(this, void 0, void 0, function* () {
            var _c;
            // scenario:
            // 1. Alice installs a protocol
            // 2. Alice creates a delegated grant for app X to read in the protocol
            // 3. Alice creates a delegated grant for app X to write in another random protocol
            // 4. A third party (Bob) authors a RecordsWrite
            // 5. Verify that App X cannot write Bob's message in Alice's DWN by invoking a delegated grant for RecordsRead
            // 6. Verify that App X cannot write Bob's message in Alice's DWN by invoking a delegated grant for writing in another random protocol
            // 7. Sanity verify the RecordsWrite is not written by App X
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const appX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol
            const protocolDefinition = minimalProtocolDefinition;
            const protocol = minimalProtocolDefinition.protocol;
            const protocolsConfig = yield ProtocolsConfigure.create({
                signer: Jws.createSigner(alice),
                definition: protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a delegated grant for app X to read in the protocol
            const readScope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Read,
                protocol
            };
            const appXGrantToRead = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: appX.did,
                scope: readScope,
                signer: Jws.createSigner(alice)
            });
            // 3. Alice creates a delegated grant for app X to write in another random protocol
            const randomProtocolWriteScope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol: `random-protocol`
            };
            const appXGrantToWriteInRandomProtocol = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: appX.did,
                scope: randomProtocolWriteScope,
                signer: Jws.createSigner(alice)
            });
            // 4. A third party (Bob) authors a RecordsWrite
            const bobRecordsWriteBytes = new TextEncoder().encode('message from Bob');
            const bobRecordsWrite = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol,
                protocolPath: 'foo',
                dataFormat: 'any-format',
                data: bobRecordsWriteBytes
            });
            // 5. Verify that App X cannot write Bob's message in Alice's DWN by invoking a delegated grant for RecordsRead
            const appXAugmentedWrite = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield appXAugmentedWrite.signAsOwnerDelegate(Jws.createSigner(appX), appXGrantToRead.dataEncodedMessage);
            const appXWriteReply = yield dwn.processMessage(alice.did, appXAugmentedWrite.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(appXWriteReply.status.code).to.equal(401);
            expect(appXWriteReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationMethodMismatch);
            // 6. Verify that App X cannot write Bob's message in Alice's DWN by invoking a delegated grant for writing in another random protocol
            const appXAugmentedWrite2 = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield appXAugmentedWrite2.signAsOwnerDelegate(Jws.createSigner(appX), appXGrantToWriteInRandomProtocol.dataEncodedMessage);
            const appXWriteReply2 = yield dwn.processMessage(alice.did, appXAugmentedWrite2.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(appXWriteReply2.status.code).to.equal(401);
            expect(appXWriteReply2.status.detail).to.contain(DwnErrorCode.RecordsGrantAuthorizationScopeProtocolMismatch);
            // 7. Sanity verify the RecordsWrite is not written by App X
            const recordsQuery = yield TestDataGenerator.generateRecordsQuery({
                author: alice,
                filter: { protocol }
            });
            const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryReply.status.code).to.equal(200);
            expect((_c = recordsQueryReply.entries) === null || _c === void 0 ? void 0 : _c.length).to.equal(0);
        }));
        it('should fail RecordsWrite if presented with an owner-delegated grant with invalid grantor signature', () => __awaiter(this, void 0, void 0, function* () {
            var _d;
            // scenario:
            // 1. Alice installs a protocol
            // 2. Alice creates a delegated grant for App X to write as Alice, but with invalid signature
            // 3. A third party (Bob) authors a RecordsWrite
            // 4. Verify that App X cannot write Bob's message in Alice's DWN by invoking an owner-delegated grant with invalid signature
            // 5. Sanity verify the RecordsWrite is not written by App X
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const appX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol
            const protocolDefinition = minimalProtocolDefinition;
            const protocol = minimalProtocolDefinition.protocol;
            const protocolsConfig = yield ProtocolsConfigure.create({
                signer: Jws.createSigner(alice),
                definition: protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a delegated grant for App X to write as Alice, but with invalid signature
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const appXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: appX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            const appXGrantMessage = appXGrant.dataEncodedMessage;
            appXGrantMessage.authorization.signature.signatures[0].signature = yield TestDataGenerator.randomSignatureString();
            // 3. A third party (Bob) authors a RecordsWrite
            const bobRecordsWriteBytes = new TextEncoder().encode('message from Bob');
            const bobRecordsWrite = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol,
                protocolPath: 'foo',
                dataFormat: 'any-format',
                data: bobRecordsWriteBytes
            });
            // 4. Verify that App X cannot write Bob's message in Alice's DWN by invoking an owner-delegated grant with invalid signature
            const appXAugmentedWrite = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield appXAugmentedWrite.signAsOwnerDelegate(Jws.createSigner(appX), appXGrantMessage);
            const appXWriteReply = yield dwn.processMessage(alice.did, appXAugmentedWrite.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(appXWriteReply.status.code).to.equal(401);
            expect(appXWriteReply.status.detail).to.contain(DwnErrorCode.GeneralJwsVerifierInvalidSignature);
            // 5. Sanity verify the RecordsWrite is not written by App X
            const recordsQuery = yield TestDataGenerator.generateRecordsQuery({
                author: alice,
                filter: { protocol }
            });
            const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryReply.status.code).to.equal(200);
            expect((_d = recordsQueryReply.entries) === null || _d === void 0 ? void 0 : _d.length).to.equal(0);
        }));
        it('should fail RecordsWrite if grant ID in owner signature payload and CID of owner-delegated grant are mismatching', () => __awaiter(this, void 0, void 0, function* () {
            var _e;
            // scenario:
            // 1. Alice installs a protocol
            // 2. Creates two delegated grant for App X to write as Alice
            // 3. A third party (Bob) authors a RecordsWrite
            // 4. Verify that App X cannot write Bob's message in Alice's DWN by invoking an owner-delegated grant with the wrong ID
            // 5. Sanity verify the RecordsWrite is not written by App X
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const appX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol
            const protocolDefinition = minimalProtocolDefinition;
            const protocol = minimalProtocolDefinition.protocol;
            const protocolsConfig = yield ProtocolsConfigure.create({
                signer: Jws.createSigner(alice),
                definition: protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Creates two delegated grant for App X to write as Alice
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const appXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: appX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            yield Time.minimalSleep();
            const appXGrant2 = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: appX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // 3. A third party (Bob) authors a RecordsWrite
            const bobRecordsWriteBytes = new TextEncoder().encode('message from Bob');
            const bobRecordsWrite = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol,
                protocolPath: 'foo',
                dataFormat: 'any-format',
                data: bobRecordsWriteBytes
            });
            // 4. Verify that App X cannot write Bob's message in Alice's DWN by invoking an owner-delegated grant with the wrong ID
            const appXAugmentedWrite = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield appXAugmentedWrite.signAsOwnerDelegate(Jws.createSigner(appX), appXGrant.dataEncodedMessage);
            appXAugmentedWrite.message.authorization.ownerDelegatedGrant = appXGrant2.dataEncodedMessage; // intentionally have a mismatching grant
            const appXWriteReply = yield dwn.processMessage(alice.did, appXAugmentedWrite.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(appXWriteReply.status.code).to.equal(400);
            expect(appXWriteReply.status.detail).to.contain(DwnErrorCode.RecordsOwnerDelegatedGrantCidMismatch);
            // 5. Sanity verify the RecordsWrite is not written by App X
            const recordsQuery = yield TestDataGenerator.generateRecordsQuery({
                author: alice,
                filter: { protocol }
            });
            const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryReply.status.code).to.equal(200);
            expect((_e = recordsQueryReply.entries) === null || _e === void 0 ? void 0 : _e.length).to.equal(0);
        }));
        it('should fail RecordsWrite if owner-delegated grant is revoked', () => __awaiter(this, void 0, void 0, function* () {
            var _f;
            // scenario:
            // 1. Alice installs a protocol
            // 2. Alice creates a delegated grant for App X to write as Alice
            // 3. Alice revokes the grant
            // 4. A third party (Bob) authors a RecordsWrite
            // 5. Verify that App X cannot write Bob's message in Alice's DWN by invoking a revoked owner-delegated grant
            // 6. Sanity verify the RecordsWrite is not written by App X
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const appX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol
            const protocolDefinition = minimalProtocolDefinition;
            const protocol = minimalProtocolDefinition.protocol;
            const protocolsConfig = yield ProtocolsConfigure.create({
                signer: Jws.createSigner(alice),
                definition: protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a delegated grant for App X to write as Alice
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const appXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: appX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            const grantDataStream = DataStream.fromBytes(appXGrant.permissionGrantBytes);
            const permissionGrantWriteReply = yield dwn.processMessage(alice.did, appXGrant.recordsWrite.message, { dataStream: grantDataStream });
            expect(permissionGrantWriteReply.status.code).to.equal(202);
            // 3. Alice revokes the grant
            const permissionRevoke = yield PermissionsProtocol.createRevocation({
                signer: Jws.createSigner(alice),
                grant: yield PermissionGrant.parse(appXGrant.dataEncodedMessage),
            });
            const revocationDataStream = DataStream.fromBytes(permissionRevoke.permissionRevocationBytes);
            const permissionRevokeReply = yield dwn.processMessage(alice.did, permissionRevoke.recordsWrite.message, { dataStream: revocationDataStream });
            expect(permissionRevokeReply.status.code).to.equal(202);
            // 4. A third party (Bob) authors a RecordsWrite
            const bobRecordsWriteBytes = new TextEncoder().encode('message from Bob');
            const bobRecordsWrite = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol,
                protocolPath: 'foo',
                dataFormat: 'any-format',
                data: bobRecordsWriteBytes
            });
            // 5. Verify that App X cannot write Bob's message in Alice's DWN by invoking a revoked owner-delegated grant
            const appXAugmentedWrite = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield appXAugmentedWrite.signAsOwnerDelegate(Jws.createSigner(appX), appXGrant.dataEncodedMessage);
            const appXWriteReply = yield dwn.processMessage(alice.did, appXAugmentedWrite.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(appXWriteReply.status.code).to.equal(401);
            expect(appXWriteReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationGrantRevoked);
            // 6. Sanity verify the RecordsWrite is not written by App X
            const recordsQuery = yield TestDataGenerator.generateRecordsQuery({
                author: alice,
                filter: { protocol }
            });
            const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryReply.status.code).to.equal(200);
            expect((_f = recordsQueryReply.entries) === null || _f === void 0 ? void 0 : _f.length).to.equal(0);
        }));
        it('should fail RecordsWrite if owner-delegated grant is expired', () => __awaiter(this, void 0, void 0, function* () {
            var _g;
            // scenario:
            // 1. Alice installs a protocol
            // 2. Alice creates a delegated grant for App X to write as Alice, but make it expired
            // 3. A third party (Bob) authors a RecordsWrite
            // 4. Verify that App X cannot write Bob's message in Alice's DWN by invoking an expired owner-delegated grant
            // 5. Sanity verify the RecordsWrite is not written by App X
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const appX = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol
            const protocolDefinition = minimalProtocolDefinition;
            const protocol = minimalProtocolDefinition.protocol;
            const protocolsConfig = yield ProtocolsConfigure.create({
                signer: Jws.createSigner(alice),
                definition: protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a delegated grant for App X to write as Alice, but make it expired
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol
            };
            const appXGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.getCurrentTimestamp(),
                grantedTo: appX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // 3. A third party (Bob) authors a RecordsWrite
            const bobRecordsWriteBytes = new TextEncoder().encode('message from Bob');
            const bobRecordsWrite = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol,
                protocolPath: 'foo',
                dataFormat: 'any-format',
                data: bobRecordsWriteBytes
            });
            // 4. Verify that App X cannot write Bob's message in Alice's DWN by invoking an expired owner-delegated grant
            const appXAugmentedWrite = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield appXAugmentedWrite.signAsOwnerDelegate(Jws.createSigner(appX), appXGrant.dataEncodedMessage);
            const appXWriteReply = yield dwn.processMessage(alice.did, appXAugmentedWrite.message, { dataStream: DataStream.fromBytes(bobRecordsWriteBytes) });
            expect(appXWriteReply.status.code).to.equal(401);
            expect(appXWriteReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationGrantExpired);
            // 5. Sanity verify the RecordsWrite is not written by App X
            const recordsQuery = yield TestDataGenerator.generateRecordsQuery({
                author: alice,
                filter: { protocol }
            });
            const recordsQueryReply = yield dwn.processMessage(alice.did, recordsQuery.message);
            expect(recordsQueryReply.status.code).to.equal(200);
            expect((_g = recordsQueryReply.entries) === null || _g === void 0 ? void 0 : _g.length).to.equal(0);
        }));
    }));
}
//# sourceMappingURL=owner-delegated-grant.spec.js.map