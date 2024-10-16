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
import { GeneralJwsBuilder } from '../../src/jose/jws/general/builder.js';
import { Message } from '../../src/core/message.js';
import { PermissionGrant } from '../../src/protocols/permission-grant.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { TestStubGenerator } from '../utils/test-stub-generator.js';
import { Time } from '../../src/utils/time.js';
import { DataStream, Dwn, DwnErrorCode, DwnInterfaceName, DwnMethodName, Encoder, Jws, PermissionsProtocol, ProtocolsQuery, RecordsWrite } from '../../src/index.js';
import { DidKey, UniversalResolver } from '@web5/dids';
chai.use(chaiAsPromised);
export function testProtocolsQueryHandler() {
    describe('ProtocolsQueryHandler.handle()', () => {
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
            it('should return protocols matching the query', () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const alice = yield TestDataGenerator.generatePersona();
                // setting up a stub method resolver
                TestStubGenerator.stubDidResolver(didResolver, [alice]);
                // insert three messages into DB, two with matching protocol
                const protocol1 = yield TestDataGenerator.generateProtocolsConfigure({ author: alice });
                const protocol2 = yield TestDataGenerator.generateProtocolsConfigure({ author: alice });
                const protocol3 = yield TestDataGenerator.generateProtocolsConfigure({ author: alice });
                yield dwn.processMessage(alice.did, protocol1.message);
                yield dwn.processMessage(alice.did, protocol2.message);
                yield dwn.processMessage(alice.did, protocol3.message);
                // testing singular conditional query
                const queryMessageData = yield TestDataGenerator.generateProtocolsQuery({
                    author: alice,
                    filter: { protocol: protocol1.message.descriptor.definition.protocol }
                });
                const reply = yield dwn.processMessage(alice.did, queryMessageData.message);
                expect(reply.status.code).to.equal(200);
                expect((_a = reply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(1); // only 1 entry should match the query on protocol
                // testing fetch-all query without filter
                const queryMessageData2 = yield TestDataGenerator.generateProtocolsQuery({
                    author: alice
                });
                const reply2 = yield dwn.processMessage(alice.did, queryMessageData2.message);
                expect(reply2.status.code).to.equal(200);
                expect((_b = reply2.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(3); // expecting all 3 entries written above match the query
            }));
            it('should return published protocols matching the query if query is unauthenticated or unauthorized', () => __awaiter(this, void 0, void 0, function* () {
                // scenario:
                // 1. Alice has 3 protocols installed: 1 private + 2 published
                // 2. Unauthenticated ProtocolsQuery should return published ProtocolsConfigure
                // 3. Authenticated ProtocolsQuery by Bob but unauthorized to private ProtocolsConfigures should return published ProtocolsConfigure
                var _c, _d, _e, _f;
                const alice = yield TestDataGenerator.generatePersona();
                const bob = yield TestDataGenerator.generatePersona();
                TestStubGenerator.stubDidResolver(didResolver, [alice, bob]);
                // insert three messages into DB, two with matching protocol
                const protocol1 = yield TestDataGenerator.generateProtocolsConfigure({ author: alice, published: false });
                const protocol2 = yield TestDataGenerator.generateProtocolsConfigure({ author: alice, published: true });
                const protocol3 = yield TestDataGenerator.generateProtocolsConfigure({ author: alice, published: true });
                yield dwn.processMessage(alice.did, protocol1.message);
                yield dwn.processMessage(alice.did, protocol2.message);
                yield dwn.processMessage(alice.did, protocol3.message);
                // testing unauthenticated conditional query
                const conditionalQuery = yield ProtocolsQuery.create({
                    filter: { protocol: protocol2.message.descriptor.definition.protocol }
                });
                const conditionalQueryReply = yield dwn.processMessage(alice.did, conditionalQuery.message);
                expect(conditionalQueryReply.status.code).to.equal(200);
                expect((_c = conditionalQueryReply.entries) === null || _c === void 0 ? void 0 : _c.length).to.equal(1); // only 1 entry should match the query on protocol
                const protocolConfigured = conditionalQueryReply.entries[0];
                expect(protocolConfigured).to.deep.equal(protocol2.message);
                // testing authenticated but unauthorized conditional query, it should return only matching published ProtocolsConfigures
                const signedConditionalQuery = yield ProtocolsQuery.create({
                    filter: { protocol: protocol2.message.descriptor.definition.protocol },
                    signer: Jws.createSigner(bob)
                });
                const signedConditionalQueryReply = yield dwn.processMessage(alice.did, signedConditionalQuery.message);
                expect(signedConditionalQueryReply.status.code).to.equal(200);
                expect((_d = signedConditionalQueryReply.entries) === null || _d === void 0 ? void 0 : _d.length).to.equal(1); // only 1 entry should match the query on protocol
                const protocolConfigured2 = conditionalQueryReply.entries[0];
                expect(protocolConfigured2).to.deep.equal(protocol2.message);
                // testing unauthenticated fetch-all query without filter
                const fetchAllQuery = yield ProtocolsQuery.create({});
                const fetchAllQueryReply = yield dwn.processMessage(alice.did, fetchAllQuery.message);
                expect(fetchAllQueryReply.status.code).to.equal(200);
                expect((_e = fetchAllQueryReply.entries) === null || _e === void 0 ? void 0 : _e.length).to.equal(2);
                expect(fetchAllQueryReply.entries).to.deep.include(protocol2.message);
                expect(fetchAllQueryReply.entries).to.deep.include(protocol3.message);
                // testing authenticated but unauthorized fetch-all query without filter, it should return all matching published ProtocolsConfigures
                const signedFetchAllQuery = yield ProtocolsQuery.create({
                    signer: Jws.createSigner(bob)
                });
                const signedFetchAllQueryReply = yield dwn.processMessage(alice.did, signedFetchAllQuery.message);
                expect(signedFetchAllQueryReply.status.code).to.equal(200);
                expect((_f = signedFetchAllQueryReply.entries) === null || _f === void 0 ? void 0 : _f.length).to.equal(2);
                expect(signedFetchAllQueryReply.entries).to.deep.include(protocol2.message);
                expect(signedFetchAllQueryReply.entries).to.deep.include(protocol3.message);
            }));
            it('should return 400 if protocol is not normalized', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // query for non-normalized protocol
                const protocolsQuery = yield TestDataGenerator.generateProtocolsQuery({
                    author: alice,
                    filter: { protocol: 'example.com/' },
                });
                // overwrite protocol because #create auto-normalizes protocol
                protocolsQuery.message.descriptor.filter.protocol = 'example.com/';
                // Re-create auth because we altered the descriptor after signing
                protocolsQuery.message.authorization = yield Message.createAuthorization({
                    descriptor: protocolsQuery.message.descriptor,
                    signer: Jws.createSigner(alice)
                });
                // Send records write message
                const reply = yield dwn.processMessage(alice.did, protocolsQuery.message);
                expect(reply.status.code).to.equal(400);
                expect(reply.status.detail).to.contain(DwnErrorCode.UrlProtocolNotNormalized);
            }));
            it('should fail with 400 if signature payload is referencing a different message (`descriptorCid`)', () => __awaiter(this, void 0, void 0, function* () {
                const { author, message, protocolsQuery } = yield TestDataGenerator.generateProtocolsQuery();
                const tenant = author.did;
                // replace signature with incorrect `descriptorCid`, even though signature is still valid
                const incorrectDescriptorCid = yield TestDataGenerator.randomCborSha256Cid();
                const signaturePayload = Object.assign({}, protocolsQuery.signaturePayload);
                signaturePayload.descriptorCid = incorrectDescriptorCid;
                const signaturePayloadBytes = Encoder.objectToBytes(signaturePayload);
                const signer = Jws.createSigner(author);
                const jwsBuilder = yield GeneralJwsBuilder.create(signaturePayloadBytes, [signer]);
                message.authorization = { signature: jwsBuilder.getJws() };
                const reply = yield dwn.processMessage(tenant, message);
                expect(reply.status.code).to.equal(400);
                expect(reply.status.detail).to.contain(`${incorrectDescriptorCid} does not match expected CID`);
            }));
            it('should return 401 if auth fails', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateProtocolsQuery({ author: alice });
                // use a bad signature to fail authentication
                const badSignature = yield TestDataGenerator.randomSignatureString();
                message.authorization.signature.signatures[0].signature = badSignature;
                const reply = yield dwn.processMessage(alice.did, message);
                expect(reply.status.code).to.equal(401);
                expect(reply.status.detail).to.contain(DwnErrorCode.GeneralJwsVerifierInvalidSignature);
            }));
            describe('Grant authorization', () => {
                it('allows an external party to ProtocolsQuery only if they have a valid grant', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario:
                    // 1. Alice grants Bob the access to ProtocolsQuery on her DWN
                    // 2. Verify Bob can perform a ProtocolsQuery
                    // 3. Verify that Mallory cannot to use Bob's permission grant to gain access to Alice's DWN
                    // 4. Alice revokes Bob's grant
                    // 5. Verify Bob cannot perform ProtocolsQuery with the revoked grant
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const mallory = yield TestDataGenerator.generateDidKeyPersona();
                    // 1. Alice grants Bob the access to ProtocolsQuery on her DWN
                    const permissionGrant = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: bob.did,
                        dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                        scope: { interface: DwnInterfaceName.Protocols, method: DwnMethodName.Query }
                    });
                    const dataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                    const grantRecordsWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream });
                    expect(grantRecordsWriteReply.status.code).to.equal(202);
                    // 2. Verify Bob can perform a ProtocolsQuery
                    const permissionGrantId = permissionGrant.recordsWrite.message.recordId;
                    const protocolsQuery = yield TestDataGenerator.generateProtocolsQuery({
                        author: bob,
                        permissionGrantId,
                    });
                    const protocolsQueryReply = yield dwn.processMessage(alice.did, protocolsQuery.message);
                    expect(protocolsQueryReply.status.code).to.equal(200);
                    // 3. Verify that Mallory cannot to use Bob's permission grant to gain access to Alice's DWN
                    const malloryProtocolsQuery = yield TestDataGenerator.generateProtocolsQuery({
                        author: mallory,
                        permissionGrantId,
                    });
                    const malloryProtocolsQueryReply = yield dwn.processMessage(alice.did, malloryProtocolsQuery.message);
                    expect(malloryProtocolsQueryReply.status.code).to.equal(401);
                    expect(malloryProtocolsQueryReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationNotGrantedToAuthor);
                    // 4. Alice revokes Bob's grant
                    const revokeWrite = yield PermissionsProtocol.createRevocation({
                        signer: Jws.createSigner(alice),
                        grant: yield PermissionGrant.parse(permissionGrant.dataEncodedMessage),
                        dateRevoked: Time.getCurrentTimestamp()
                    });
                    const revokeWriteReply = yield dwn.processMessage(alice.did, revokeWrite.recordsWrite.message, { dataStream: DataStream.fromBytes(revokeWrite.permissionRevocationBytes) });
                    expect(revokeWriteReply.status.code).to.equal(202);
                    // 5. Verify Bob cannot perform ProtocolsQuery with the revoked grant
                    const unauthorizedProtocolsQuery = yield TestDataGenerator.generateProtocolsQuery({
                        author: bob,
                        permissionGrantId,
                    });
                    const unauthorizedProtocolsQueryReply = yield dwn.processMessage(alice.did, unauthorizedProtocolsQuery.message);
                    expect(unauthorizedProtocolsQueryReply.status.code).to.equal(401);
                    expect(unauthorizedProtocolsQueryReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationGrantRevoked);
                }));
                it('rejects with 401 when an external party attempts to ProtocolsQuery if they present an expired grant', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice grants Bob access to ProtocolsQuery, but when Bob invokes the grant it has expired
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // Alice gives Bob a permission grant with scope ProtocolsQuery and an expiry time
                    const permissionGrant = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: bob.did,
                        dateGranted: Time.getCurrentTimestamp(),
                        dateExpires: Time.getCurrentTimestamp(),
                        scope: { interface: DwnInterfaceName.Protocols, method: DwnMethodName.Query }
                    });
                    const dataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                    const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream });
                    expect(permissionGrantWriteReply.status.code).to.equal(202);
                    // Bob does ProtocolsQuery after the grant has expired
                    const protocolsQuery = yield TestDataGenerator.generateProtocolsQuery({
                        author: bob,
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const protocolsQueryReply = yield dwn.processMessage(alice.did, protocolsQuery.message);
                    expect(protocolsQueryReply.status.code).to.equal(401);
                    expect(protocolsQueryReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationGrantExpired);
                }));
                it('rejects with 401 when an external party attempts to ProtocolsQuery if the grant is not yet active', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice grants Bob access to ProtocolsQuery, but Bob's message has a timestamp just before the grant is active
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // Set up timestamps
                    const protocolsQueryTimestamp = Time.getCurrentTimestamp();
                    yield Time.minimalSleep(); // to ensure granted created will be after the query timestamp
                    // Alice gives Bob a permission grant with scope ProtocolsQuery
                    const permissionGrant = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: bob.did,
                        dateGranted: Time.getCurrentTimestamp(),
                        dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                        scope: { interface: DwnInterfaceName.Protocols, method: DwnMethodName.Query }
                    });
                    const dataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                    const permissionGrantWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream });
                    expect(permissionGrantWriteReply.status.code).to.equal(202);
                    // Bob does ProtocolsQuery but his message has timestamp before the grant is active
                    const protocolsQuery = yield TestDataGenerator.generateProtocolsQuery({
                        author: bob,
                        messageTimestamp: protocolsQueryTimestamp,
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const protocolsQueryReply = yield dwn.processMessage(alice.did, protocolsQuery.message);
                    expect(protocolsQueryReply.status.code).to.equal(401);
                    expect(protocolsQueryReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationGrantNotYetActive);
                }));
                it('rejects with 401 when an external party attempts to ProtocolsQuery using a grant that has a different scope', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Alice grants Bob access to RecordsRead, then Bob tries to invoke the grant with ProtocolsQuery
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // Alice gives Bob a permission grant with scope RecordsRead
                    const permissionGrant = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: bob.did,
                        dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                        scope: { interface: DwnInterfaceName.Records, method: DwnMethodName.Read, protocol: 'https://example.com/protocol/test' }
                    });
                    const dataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                    const grantRecordsWriteReply = yield dwn.processMessage(alice.did, permissionGrant.recordsWrite.message, { dataStream });
                    expect(grantRecordsWriteReply.status.code).to.equal(202);
                    // Bob tries to ProtocolsQuery
                    const protocolsQuery = yield TestDataGenerator.generateProtocolsQuery({
                        author: bob,
                        permissionGrantId: permissionGrant.recordsWrite.message.recordId,
                    });
                    const protocolsQueryReply = yield dwn.processMessage(alice.did, protocolsQuery.message);
                    expect(protocolsQueryReply.status.code).to.equal(401);
                    expect(protocolsQueryReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationInterfaceMismatch);
                }));
                it('rejects with 401 if the permission grant cannot be found', () => __awaiter(this, void 0, void 0, function* () {
                    // scenario: Bob uses a permissionGrantId to ProtocolsQuery, but no permission grant can be found.
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    // Bob tries to ProtocolsQuery
                    const protocolsQuery = yield TestDataGenerator.generateProtocolsQuery({
                        author: bob,
                        permissionGrantId: yield TestDataGenerator.randomCborSha256Cid(),
                    });
                    const protocolsQueryReply = yield dwn.processMessage(alice.did, protocolsQuery.message);
                    expect(protocolsQueryReply.status.code).to.equal(401);
                    expect(protocolsQueryReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationGrantMissing);
                }));
                it('rejects with 401 if the permission grant has not been grantedFor the tenant', () => __awaiter(this, void 0, void 0, function* () {
                    // Scenario:
                    // 1. Alice gives Carol a permission grant with scope ProtocolsQuery
                    // 2. Bob (for unknown reason, thus this is a super edge case) stores the grant in his DWN
                    // 3. Verify that Carol cannot use permission grant to gain access to Bob's DWN
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    const bob = yield TestDataGenerator.generateDidKeyPersona();
                    const carol = yield TestDataGenerator.generateDidKeyPersona();
                    // 1. Alice gives Carol a permission grant with scope ProtocolsQuery
                    const permissionGrant = yield PermissionsProtocol.createGrant({
                        signer: Jws.createSigner(alice),
                        grantedTo: carol.did,
                        dateExpires: Time.createOffsetTimestamp({ seconds: 60 * 60 * 24 }),
                        scope: { interface: DwnInterfaceName.Protocols, method: DwnMethodName.Query }
                    });
                    const dataStream = DataStream.fromBytes(permissionGrant.permissionGrantBytes);
                    // 2. Bob (for unknown reason, thus this is a super edge case) stores the grant in his DWN
                    const bobWrappedGrant = yield RecordsWrite.parse(permissionGrant.recordsWrite.message);
                    yield bobWrappedGrant.signAsOwner(Jws.createSigner(bob));
                    const grantRecordsWriteReply = yield dwn.processMessage(bob.did, bobWrappedGrant.message, { dataStream });
                    expect(grantRecordsWriteReply.status.code).to.equal(202);
                    // 3. Verify that Carol cannot use permission grant to gain access to Bob's DWN
                    const permissionGrantId = permissionGrant.recordsWrite.message.recordId;
                    const protocolsQuery = yield TestDataGenerator.generateProtocolsQuery({
                        author: carol,
                        permissionGrantId,
                    });
                    const protocolsQueryReply = yield dwn.processMessage(bob.did, protocolsQuery.message);
                    expect(protocolsQueryReply.status.code).to.equal(401);
                    expect(protocolsQueryReply.status.detail).to.contain(DwnErrorCode.GrantAuthorizationNotGrantedForTenant);
                }));
            });
        });
    });
}
//# sourceMappingURL=protocols-query.spec.js.map