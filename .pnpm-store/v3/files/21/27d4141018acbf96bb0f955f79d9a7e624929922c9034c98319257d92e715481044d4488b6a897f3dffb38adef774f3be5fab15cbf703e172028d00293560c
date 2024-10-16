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
import threadRoleProtocolDefinition from '../vectors/protocol-definitions/thread-role.json' assert { type: 'json' };
import { authenticate } from '../../src/core/auth.js';
import { Encoder } from '../../src/index.js';
import { HdKey } from '../../src/utils/hd-key.js';
import { KeyDerivationScheme } from '../../src/utils/hd-key.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { TestStubGenerator } from '../utils/test-stub-generator.js';
import chai, { expect } from 'chai';
import { DataStream, Dwn, Jws, Protocols, ProtocolsConfigure, ProtocolsQuery, Records, RecordsRead } from '../../src/index.js';
import { DidKey, UniversalResolver } from '@web5/dids';
chai.use(chaiAsPromised);
export function testEndToEndScenarios() {
    describe('End-to-end Scenarios Spanning Features', () => {
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
        it('should support a multi-participant encrypted chat protocol', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice starts a chat thread
            // 2. Alice adds Bob as a participant with [symmetric key] encrypted using [Bob's participant-level public key]
            // 3. Alice writes a chat message(s) in the thread
            // 4. Alice sends an invite to Bob's DWN with the [context/thread ID]
            // 5. Bob fetches the invite from his DWN and obtains the [context/thread ID]
            // 6. Bob fetches the entire thread using the [context/thread ID]
            // 7. Bob is able to decrypt all thread content
            // creating Alice and Bob persona and setting up a stub DID resolver
            const alice = yield TestDataGenerator.generatePersona();
            const bob = yield TestDataGenerator.generatePersona();
            TestStubGenerator.stubDidResolver(didResolver, [alice, bob]);
            const protocolDefinition = threadRoleProtocolDefinition;
            // Alice configures chat protocol with encryption
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
            // 1. Alice starts a chat thread writing to her own DWN
            const threadBytes = Encoder.objectToBytes({ title: 'Top Secret' });
            const threadRecord = yield TestDataGenerator.generateProtocolEncryptedRecordsWrite({
                plaintextBytes: threadBytes,
                author: alice,
                protocolDefinition: protocolDefinition,
                protocolPath: 'thread',
                encryptSymmetricKeyWithProtocolPathDerivedKey: false,
                encryptSymmetricKeyWithProtocolContextDerivedKey: true
            });
            const threadRecordReply1 = yield dwn.processMessage(alice.did, threadRecord.message, { dataStream: threadRecord.dataStream });
            expect(threadRecordReply1.status.code).to.equal(202);
            // 2. Alice adds Bob as a participant giving him the [context-derived private key] encrypted using [Bob's participant-level public key]
            // the context-derived key to be used for encrypting symmetric keys
            const aliceRootKey = {
                rootKeyId: alice.keyId,
                derivationScheme: KeyDerivationScheme.ProtocolContext,
                derivedPrivateKey: alice.keyPair.privateJwk
            };
            const contextDerivationPath = Records.constructKeyDerivationPathUsingProtocolContextScheme(threadRecord.message.contextId);
            const contextDerivedPrivateKey = yield HdKey.derivePrivateKey(aliceRootKey, contextDerivationPath);
            const contextDerivedPublicKey = threadRecord.encryptionInput.keyEncryptionInputs[0].publicKey;
            // Alice queries Bob's DWN for Bob's chat protocol definition containing public key declarations
            const protocolsQuery = yield ProtocolsQuery.create({
                filter: { protocol: threadRoleProtocolDefinition.protocol }
            });
            const protocolsQueryReply = yield dwn.processMessage(bob.did, protocolsQuery.message);
            const protocolConfigureMessageOfBobFetched = protocolsQueryReply.entries[0];
            // Alice verifies that the chat protocol definition is authored by Bob
            yield authenticate(protocolConfigureMessageOfBobFetched.authorization, didResolver);
            const protocolsConfigureOfBobFetched = yield ProtocolsConfigure.parse(protocolConfigureMessageOfBobFetched);
            expect(protocolsConfigureOfBobFetched.author).to.equal(bob.did);
            // generate the encrypted participant record using Bob's protocol configuration fetched
            const participantBobRecord = yield TestDataGenerator.generateProtocolEncryptedRecordsWrite({
                plaintextBytes: Encoder.objectToBytes(contextDerivedPrivateKey),
                author: alice,
                recipient: bob.did,
                protocolDefinition: protocolsConfigureOfBobFetched.message.descriptor.definition,
                protocolPath: 'thread/participant',
                protocolParentContextId: threadRecord.message.contextId,
                encryptSymmetricKeyWithProtocolPathDerivedKey: true,
                encryptSymmetricKeyWithProtocolContextDerivedKey: false // this could be `true` also, but mostly orthogonal to the scenario
            });
            const participantRecordReply = yield dwn.processMessage(alice.did, participantBobRecord.message, { dataStream: participantBobRecord.dataStream });
            expect(participantRecordReply.status.code).to.equal(202);
            // 3. Alice writes a chat message(s) in the thread
            const messageByAlice = 'Message from Alice';
            const chatMessageByAlice = yield TestDataGenerator.generateProtocolEncryptedRecordsWrite({
                plaintextBytes: Encoder.stringToBytes(messageByAlice),
                author: alice,
                recipient: alice.did,
                protocolDefinition: protocolDefinition,
                protocolPath: 'thread/chat',
                protocolParentContextId: threadRecord.message.contextId,
                protocolContextDerivingRootKeyId: aliceRootKey.rootKeyId,
                protocolContextDerivedPublicJwk: contextDerivedPublicKey,
                encryptSymmetricKeyWithProtocolPathDerivedKey: false,
                encryptSymmetricKeyWithProtocolContextDerivedKey: true
            });
            const chatMessageReply = yield dwn.processMessage(alice.did, chatMessageByAlice.message, { dataStream: chatMessageByAlice.dataStream });
            expect(chatMessageReply.status.code).to.equal(202);
            // Assume the below steps can be done since it is a common DWN usage pattern
            // 4. Alice sends an invite to Bob's DWN with the [context/thread ID]
            // 5. Bob fetches the invite from his DWN and obtains the [context/thread ID]
            // 6. Bob fetches the entire thread using the [context/thread ID]
            // Test that Bob is able to read his 'participant' role to obtain the context-derived private key for message decryption.
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
            // Test that Bob is able to read the thread root record
            const threadRead = yield RecordsRead.create({
                signer: Jws.createSigner(bob),
                filter: {
                    protocolPath: 'thread',
                    contextId: threadRecord.message.contextId
                },
                protocolRole: 'thread/participant'
            });
            const threadReadReply = yield dwn.processMessage(alice.did, threadRead.message);
            expect(threadReadReply.status.code).to.equal(200);
            expect(threadReadReply.record).to.exist;
            // Test Bob can invoke his 'participant' role to read the chat message
            // TODO: #555 - We currently lack role-authorized RecordsQuery for a realistic scenario (https://github.com/TBD54566975/dwn-sdk-js/issues/555)
            const chatRead = yield RecordsRead.create({
                signer: Jws.createSigner(bob),
                filter: {
                    protocolPath: 'thread/chat',
                    contextId: threadRecord.message.contextId
                },
                protocolRole: 'thread/participant'
            });
            const chatReadReply = yield dwn.processMessage(alice.did, chatRead.message);
            expect(chatReadReply.status.code).to.equal(200);
            expect(chatReadReply.record).to.exist;
            // 7. Bob is able to decrypt all thread content
            // Bob decrypts the participant message to obtain the context-derived private key
            const bobRootKey = {
                rootKeyId: bob.keyId,
                derivationScheme: KeyDerivationScheme.ProtocolPath,
                derivedPrivateKey: bob.keyPair.privateJwk
            };
            const participantRecordFetched = participantReadReply.record;
            const encryptedContextDerivedPrivateKeyBytes = yield DataStream.toBytes(participantRecordFetched.data); // to create streams for testing
            const derivationPathFromProtocolPath = Records.constructKeyDerivationPathUsingProtocolPathScheme(participantRecordFetched.descriptor);
            const bobProtocolPathDerivedPrivateKey = yield HdKey.derivePrivateKey(bobRootKey, derivationPathFromProtocolPath);
            const decryptedContextDerivedKeyStream = yield Records.decrypt(participantRecordFetched, bobProtocolPathDerivedPrivateKey, DataStream.fromBytes(encryptedContextDerivedPrivateKeyBytes));
            const decryptedContextDerivedPrivateKey = yield DataStream.toObject(decryptedContextDerivedKeyStream);
            expect(decryptedContextDerivedPrivateKey).to.deep.equal(contextDerivedPrivateKey);
            // Arguably unrelated to the scenario, but let's sanity check that Bob's root key can also decrypt the encrypted context-derived private key
            const decryptedContextDerivedKeyStream2 = yield Records.decrypt(participantRecordFetched, bobRootKey, DataStream.fromBytes(encryptedContextDerivedPrivateKeyBytes));
            const decryptedContextDerivedPrivateKey2 = yield DataStream.toObject(decryptedContextDerivedKeyStream2);
            expect(decryptedContextDerivedPrivateKey2).to.deep.equal(contextDerivedPrivateKey);
            // Verify that Bob can now decrypt Alice's chat thread record using the decrypted context-derived key
            const decryptedChatThread = yield Records.decrypt(threadReadReply.record, decryptedContextDerivedPrivateKey, threadReadReply.record.data);
            expect(yield DataStream.toBytes(decryptedChatThread)).to.deep.equal(threadBytes);
            // Verify that Bob can now decrypt Alice's chat message using the decrypted context-derived key
            const encryptedChatMessageBytes = yield DataStream.toBytes(chatReadReply.record.data); // to create streams for testing
            const decryptedChatMessage = yield Records.decrypt(chatReadReply.record, decryptedContextDerivedPrivateKey, DataStream.fromBytes(encryptedChatMessageBytes));
            expect(yield DataStream.toBytes(decryptedChatMessage)).to.deep.equal(Encoder.stringToBytes(messageByAlice));
            // Arguably unrelated to the scenario, but let's also sanity check that Alice's root key can also decrypt the encrypted chat message
            const decryptedChatMessageStream2 = yield Records.decrypt(chatReadReply.record, aliceRootKey, DataStream.fromBytes(encryptedChatMessageBytes));
            expect(yield DataStream.toBytes(decryptedChatMessageStream2)).to.deep.equal(Encoder.stringToBytes(messageByAlice));
        }));
    });
}
//# sourceMappingURL=end-to-end-tests.spec.js.map