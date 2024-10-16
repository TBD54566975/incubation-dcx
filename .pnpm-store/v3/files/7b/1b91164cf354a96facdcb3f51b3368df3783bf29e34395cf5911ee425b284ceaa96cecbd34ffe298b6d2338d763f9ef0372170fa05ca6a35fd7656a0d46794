var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import chaiAsPromised from 'chai-as-promised';
import minimalProtocolDefinition from '../vectors/protocol-definitions/minimal.json' assert { type: 'json' };
import sinon from 'sinon';
import chai, { expect } from 'chai';
import { ArrayUtility } from '../../src/utils/array.js';
import { DataStream } from '../../src/utils/data-stream.js';
import { Dwn } from '../../src/dwn.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { Jws } from '../../src/utils/jws.js';
import { RecordsRead } from '../../src/interfaces/records-read.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DidKey, UniversalResolver } from '@web5/dids';
chai.use(chaiAsPromised);
export function testOwnerSignature() {
    describe('owner signature', () => __awaiter(this, void 0, void 0, function* () {
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
        it('should use `ownerSignature` for authorization when it is given - flat-space', () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // scenario: Alice fetch a message authored by Bob from Bob's DWN and retains (writes) it in her DWN
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            // Bob writes a message to his DWN
            const { message, dataStream, dataBytes } = yield TestDataGenerator.generateRecordsWrite({ author: bob, published: true });
            const writeReply = yield dwn.processMessage(bob.did, message, { dataStream });
            expect(writeReply.status.code).to.equal(202);
            // Alice fetches the message from Bob's DWN
            const recordsRead = yield RecordsRead.create({
                filter: { recordId: message.recordId },
                signer: Jws.createSigner(alice)
            });
            const readReply = yield dwn.processMessage(bob.did, recordsRead.message);
            expect(readReply.status.code).to.equal(200);
            expect(readReply.record).to.exist;
            expect((_a = readReply.record) === null || _a === void 0 ? void 0 : _a.descriptor).to.exist;
            // Alice augments Bob's message as an external owner
            const _c = readReply.record, { data } = _c, messageFetched = __rest(_c, ["data"]); // remove data from message
            const ownerSignedMessage = yield RecordsWrite.parse(messageFetched);
            yield ownerSignedMessage.signAsOwner(Jws.createSigner(alice));
            // Test that Alice can successfully retain/write Bob's message to her DWN
            const aliceDataStream = readReply.record.data;
            const aliceWriteReply = yield dwn.processMessage(alice.did, ownerSignedMessage.message, { dataStream: aliceDataStream });
            expect(aliceWriteReply.status.code).to.equal(202);
            // Test that Bob's message can be read from Alice's DWN
            const readReply2 = yield dwn.processMessage(alice.did, recordsRead.message);
            expect(readReply2.status.code).to.equal(200);
            expect(readReply2.record).to.exist;
            expect((_b = readReply2.record) === null || _b === void 0 ? void 0 : _b.descriptor).to.exist;
            const dataFetched = yield DataStream.toBytes(readReply2.record.data);
            expect(ArrayUtility.byteArraysEqual(dataFetched, dataBytes)).to.be.true;
        }));
        it('should use `ownerSignature` for authorization when it is given - protocol-space', () => __awaiter(this, void 0, void 0, function* () {
            var _d;
            // scenario: Alice and Bob both have the same protocol which does NOT allow external entities to write,
            // but Alice can store a message authored by Bob as a owner in her own DWN
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
            // Sanity test that Bob cannot write to a protocol record to Alice's DWN
            const bobRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo'
            });
            const recordsWriteReply = yield dwn.processMessage(alice.did, bobRecordsWrite.message, { dataStream: bobRecordsWrite.dataStream });
            expect(recordsWriteReply.status.code).to.equal(401);
            // Skipping Alice fetching the message from Bob's DWN (as this is tested already in the flat-space test)
            // Alice augments Bob's message as an external owner
            const ownerSignedMessage = yield RecordsWrite.parse(bobRecordsWrite.message);
            yield ownerSignedMessage.signAsOwner(Jws.createSigner(alice));
            // Test that Alice can successfully retain/write Bob's message to her DWN
            const aliceDataStream = DataStream.fromBytes(bobRecordsWrite.dataBytes);
            const aliceWriteReply = yield dwn.processMessage(alice.did, ownerSignedMessage.message, { dataStream: aliceDataStream });
            expect(aliceWriteReply.status.code).to.equal(202);
            // Test that Bob's message can be read from Alice's DWN
            const recordsRead = yield RecordsRead.create({
                filter: { recordId: bobRecordsWrite.message.recordId },
                signer: Jws.createSigner(alice)
            });
            const readReply = yield dwn.processMessage(alice.did, recordsRead.message);
            expect(readReply.status.code).to.equal(200);
            expect(readReply.record).to.exist;
            expect((_d = readReply.record) === null || _d === void 0 ? void 0 : _d.descriptor).to.exist;
            const dataFetched = yield DataStream.toBytes(readReply.record.data);
            expect(ArrayUtility.byteArraysEqual(dataFetched, bobRecordsWrite.dataBytes)).to.be.true;
        }));
        it('should throw if `ownerSignature` in `authorization` is mismatching with the tenant - flat-space', () => __awaiter(this, void 0, void 0, function* () {
            // scenario: Carol attempts to store a message with Alice being the owner, and should fail
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // Bob creates a message, we skip writing to bob's DWN because that's orthogonal to this test
            const { recordsWrite, dataStream } = yield TestDataGenerator.generateRecordsWrite({ author: bob, published: true });
            // Alice augments Bob's message as an external owner, we also skipping writing to Alice's DWN because that's also orthogonal to this test
            yield recordsWrite.signAsOwner(Jws.createSigner(alice));
            // Test that Carol is not able to store the message Alice created
            const carolWriteReply = yield dwn.processMessage(carol.did, recordsWrite.message, { dataStream });
            expect(carolWriteReply.status.code).to.equal(401);
            expect(carolWriteReply.status.detail).to.contain('RecordsWriteOwnerAndTenantMismatch');
        }));
        it('should throw if `ownerSignature` in `authorization` is mismatching with the tenant - protocol-space', () => __awaiter(this, void 0, void 0, function* () {
            // scenario: Alice, Bob, and Carol all have the same protocol which does NOT allow external entities to write,
            // scenario: Carol attempts to store a message with Alice being the owner, and should fail
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            const protocolDefinition = minimalProtocolDefinition;
            // Bob creates a message, we skip writing to Bob's DWN because that's orthogonal to this test
            const { recordsWrite, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo'
            });
            // Alice augments Bob's message as an external owner, we also skipping writing to Alice's DWN because that's also orthogonal to this test
            yield recordsWrite.signAsOwner(Jws.createSigner(alice));
            // Carol installs the protocol
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: carol,
                protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(carol.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // Test that Carol is not able to store the message Alice created
            const carolWriteReply = yield dwn.processMessage(carol.did, recordsWrite.message, { dataStream });
            expect(carolWriteReply.status.code).to.equal(401);
            expect(carolWriteReply.status.detail).to.contain('RecordsWriteOwnerAndTenantMismatch');
        }));
        it('should throw if `ownerSignature` fails verification', () => __awaiter(this, void 0, void 0, function* () {
            // scenario: Malicious Bob attempts to retain an externally authored message in Alice's DWN by providing an invalid `ownerSignature`
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            // Bob creates a message, we skip writing to bob's DWN because that's orthogonal to this test
            const { recordsWrite, dataStream } = yield TestDataGenerator.generateRecordsWrite({ author: bob, published: true });
            // Bob pretends to be Alice by adding an invalid `ownerSignature`
            // We do this by creating a valid signature first then swap out with an invalid one
            yield recordsWrite.signAsOwner(Jws.createSigner(alice));
            const bobSignature = recordsWrite.message.authorization.signature.signatures[0];
            recordsWrite.message.authorization.ownerSignature.signatures[0].signature = bobSignature.signature; // invalid `ownerSignature`
            // Test that Bob is not able to store the message in Alice's DWN using an invalid `ownerSignature`
            const aliceWriteReply = yield dwn.processMessage(alice.did, recordsWrite.message, { dataStream });
            expect(aliceWriteReply.status.detail).to.contain(DwnErrorCode.GeneralJwsVerifierInvalidSignature);
        }));
    }));
}
//# sourceMappingURL=owner-signature.spec.js.map