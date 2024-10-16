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
import { DataStream } from '../../src/utils/data-stream.js';
import { Dwn } from '../../src/dwn.js';
import { Jws } from '../../src/utils/jws.js';
import { ProtocolAction } from '../../src/types/protocols-types.js';
import { ProtocolAuthorization } from '../../src/core/protocol-authorization.js';
import { RecordsRead } from '../../src/interfaces/records-read.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import { DwnErrorCode, DwnInterfaceName, DwnMethodName, Message, ProtocolsConfigure, RecordsDelete, Time } from '../../src/index.js';
chai.use(chaiAsPromised);
export function testProtocolDeleteAction() {
    describe('Protocol `delete` action', () => {
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
        it('should only allow author of a role-authorized create to delete', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice installs a protocol with a "author of a role-authorized create can delete" rule.
            // 2. Alice gives Bob and Carol the "user" role to be able to write `foo` records.
            // 3. Bob creates a `foo` by invoking the user role.
            // 4. Verify that Bob can delete his `foo`
            //   4a. Sanity verify that the delete took effect by reading the record back
            // 5. Carol creates a `foo` by invoking the user role.
            // 6. Verify that Bob cannot delete Carol's `foo`
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol with a "author of a role-authorized create can delete" rule.
            const protocolDefinition = {
                protocol: 'foo',
                published: true,
                types: {
                    user: {},
                    foo: {}
                },
                structure: {
                    user: {
                        $role: true
                    },
                    foo: {
                        $actions: [
                            {
                                role: 'user',
                                can: [ProtocolAction.Create, ProtocolAction.Delete]
                            }
                        ]
                    }
                }
            };
            const protocolsConfig = yield ProtocolsConfigure.create({
                definition: protocolDefinition,
                signer: Jws.createSigner(alice)
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Alice gives Bob and Carol the "user" role to be able to write `foo` records.
            const userBobRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                author: alice,
                recipient: bob.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'user'
            });
            const userBobRecordsWriteReply = yield dwn.processMessage(alice.did, userBobRecordsWrite.message, { dataStream: userBobRecordsWrite.dataStream });
            expect(userBobRecordsWriteReply.status.code).to.equal(202);
            const userCarolRecordsWrite = yield TestDataGenerator.generateRecordsWrite({
                author: alice,
                recipient: carol.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'user'
            });
            const userCarolRecordsWriteReply = yield dwn.processMessage(alice.did, userCarolRecordsWrite.message, { dataStream: userCarolRecordsWrite.dataStream });
            expect(userCarolRecordsWriteReply.status.code).to.equal(202);
            // 3. Bob creates a `foo` by invoking the user role.
            const bobFooBytes = TestDataGenerator.randomBytes(100);
            const bobRoleAuthorizedFoo = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocolRole: 'user',
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo',
                schema: 'any-schema',
                dataFormat: 'any-format',
                data: bobFooBytes
            });
            const bobRoleAuthorizedCreateReply = yield dwn.processMessage(alice.did, bobRoleAuthorizedFoo.message, { dataStream: DataStream.fromBytes(bobFooBytes) });
            expect(bobRoleAuthorizedCreateReply.status.code).to.equal(202);
            // 4. Verify that Bob can delete his `foo`
            const bobAuthorizedFooDelete = yield RecordsDelete.create({
                protocolRole: 'user',
                recordId: bobRoleAuthorizedFoo.message.recordId,
                signer: Jws.createSigner(bob)
            });
            const bobAuthorizedFooDeleteReply = yield dwn.processMessage(alice.did, bobAuthorizedFooDelete.message);
            expect(bobAuthorizedFooDeleteReply.status.code).to.equal(202);
            //   4a. Sanity verify that the delete took effect by reading the record back
            const recordsRead = yield RecordsRead.create({
                filter: {
                    recordId: bobRoleAuthorizedFoo.message.recordId
                },
                signer: Jws.createSigner(alice)
            });
            const recordsReadReply = yield dwn.processMessage(alice.did, recordsRead.message);
            expect(recordsReadReply.status.code).to.equal(404);
            // 5. Carol creates a `foo` by invoking the user role.
            const carolFooBytes = TestDataGenerator.randomBytes(100);
            const carolRoleAuthorizedFoo = yield RecordsWrite.create({
                signer: Jws.createSigner(carol),
                protocolRole: 'user',
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo',
                schema: 'any-schema',
                dataFormat: 'any-format',
                data: carolFooBytes
            });
            const carolRoleAuthorizedCreateReply = yield dwn.processMessage(alice.did, carolRoleAuthorizedFoo.message, { dataStream: DataStream.fromBytes(carolFooBytes) });
            expect(carolRoleAuthorizedCreateReply.status.code).to.equal(202);
            // 6. Verify that Bob cannot delete Carol's `foo`
            const bobUnauthorizedFooDelete = yield RecordsDelete.create({
                protocolRole: 'user',
                recordId: carolRoleAuthorizedFoo.message.recordId,
                signer: Jws.createSigner(bob)
            });
            const bobUnauthorizedFooDeleteReply = yield dwn.processMessage(alice.did, bobUnauthorizedFooDelete.message);
            expect(bobUnauthorizedFooDeleteReply.status.code).to.equal(401);
            expect(bobUnauthorizedFooDeleteReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
        }));
        it('should only allow author of an author/recipient-authorized create to delete', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice installs a protocol with "author of an author/recipient-authorized create can delete" rules.
            // 2. Alice creates a `foo` with Bob being the recipient, so that Bob can create `bar`.
            // 3. Alice creates a `foo` with Carol being the recipient, so that Carol can create `bar`.
            // 4. Bob creates a recipient-authorized `bar`.
            // 5. Bob creates a author-authorized `baz` after his `bar`.
            // 6. Carol creates a recipient-authorized `bar`.
            // 7. Carol creates a author-authorized `baz` after her `bar`.
            // 8. Verify that Bob can delete his `baz`
            //   8a. Sanity verify that the delete took effect by reading the record back.
            // 9. Verify that Bob can delete his `bar`.
            // 10. Verify that Bob cannot delete Carol's `bar`.
            // 11. Verify that Bob cannot delete Carol's `baz`
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol with "author of an author/recipient-authorized create can delete" rules.
            const protocolDefinition = {
                protocol: 'foo-bar-baz',
                published: true,
                types: {
                    foo: {},
                    bar: {},
                    baz: {}
                },
                structure: {
                    foo: {
                        bar: {
                            $actions: [
                                {
                                    who: 'recipient',
                                    of: 'foo',
                                    can: [ProtocolAction.Create, ProtocolAction.Delete]
                                }
                            ],
                            baz: {
                                $actions: [
                                    {
                                        who: 'author',
                                        of: 'foo/bar',
                                        can: [ProtocolAction.Create, ProtocolAction.Delete]
                                    }
                                ]
                            }
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
            // 2. Alice creates a `foo` with Bob being the recipient, so that Bob can create `bar`.
            const fooForBob = yield TestDataGenerator.generateRecordsWrite({
                author: alice,
                recipient: bob.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo'
            });
            const fooForBobReply = yield dwn.processMessage(alice.did, fooForBob.message, { dataStream: fooForBob.dataStream });
            expect(fooForBobReply.status.code).to.equal(202);
            // 3. Alice creates a `foo` with Carol being the recipient, so that Carol can create `bar`.
            const fooForCarol = yield TestDataGenerator.generateRecordsWrite({
                author: alice,
                recipient: carol.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo'
            });
            const fooForCarolReply = yield dwn.processMessage(alice.did, fooForCarol.message, { dataStream: fooForCarol.dataStream });
            expect(fooForCarolReply.status.code).to.equal(202);
            // 4. Bob creates a recipient-authorized `bar`.
            const bobBarBytes = TestDataGenerator.randomBytes(100);
            const bobRecipientAuthorizedBar = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo/bar',
                parentContextId: fooForBob.message.contextId,
                schema: 'any-schema',
                dataFormat: 'any-format',
                data: bobBarBytes
            });
            const bobRecipientAuthorizedBarReply = yield dwn.processMessage(alice.did, bobRecipientAuthorizedBar.message, { dataStream: DataStream.fromBytes(bobBarBytes) });
            expect(bobRecipientAuthorizedBarReply.status.code).to.equal(202);
            // 5. Bob creates a author-authorized `baz` after his `bar`.
            const bobBazBytes = TestDataGenerator.randomBytes(100);
            const bobAuthorAuthorizedBaz = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo/bar/baz',
                parentContextId: bobRecipientAuthorizedBar.message.contextId,
                schema: 'any-schema',
                dataFormat: 'any-format',
                data: bobBazBytes
            });
            const bobAuthorAuthorizedBazReply = yield dwn.processMessage(alice.did, bobAuthorAuthorizedBaz.message, { dataStream: DataStream.fromBytes(bobBazBytes) });
            expect(bobAuthorAuthorizedBazReply.status.code).to.equal(202);
            // 6. Carol creates a recipient-authorized `bar`.
            const carolBarBytes = TestDataGenerator.randomBytes(100);
            const carolRecipientAuthorizedBar = yield RecordsWrite.create({
                signer: Jws.createSigner(carol),
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo/bar',
                parentContextId: fooForCarol.message.contextId,
                schema: 'any-schema',
                dataFormat: 'any-format',
                data: carolBarBytes
            });
            const carolRecipientAuthorizedBarReply = yield dwn.processMessage(alice.did, carolRecipientAuthorizedBar.message, { dataStream: DataStream.fromBytes(carolBarBytes) });
            expect(carolRecipientAuthorizedBarReply.status.code).to.equal(202);
            // 7. Carol creates a author-authorized `baz` after her `bar`.
            const carolBazBytes = TestDataGenerator.randomBytes(100);
            const carolAuthorAuthorizedBaz = yield RecordsWrite.create({
                signer: Jws.createSigner(carol),
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo/bar/baz',
                parentContextId: carolRecipientAuthorizedBar.message.contextId,
                schema: 'any-schema',
                dataFormat: 'any-format',
                data: carolBazBytes
            });
            const carolAuthorAuthorizedBazReply = yield dwn.processMessage(alice.did, carolAuthorAuthorizedBaz.message, { dataStream: DataStream.fromBytes(carolBazBytes) });
            expect(carolAuthorAuthorizedBazReply.status.code).to.equal(202);
            // 8. Verify that Bob can delete his `baz`
            const bobAuthorizedBazDelete = yield RecordsDelete.create({
                recordId: bobAuthorAuthorizedBaz.message.recordId,
                signer: Jws.createSigner(bob)
            });
            const bobAuthorizedBazDeleteReply = yield dwn.processMessage(alice.did, bobAuthorizedBazDelete.message);
            expect(bobAuthorizedBazDeleteReply.status.code).to.equal(202);
            //   8a. Sanity verify that the delete took effect by reading the record back.
            const bobBarRead = yield RecordsRead.create({
                filter: {
                    recordId: bobAuthorAuthorizedBaz.message.recordId
                },
                signer: Jws.createSigner(alice)
            });
            const bobBarReadReply = yield dwn.processMessage(alice.did, bobBarRead.message);
            expect(bobBarReadReply.status.code).to.equal(404);
            // 9. Verify that Bob can delete his `bar`.
            const bobAuthorizedBarDelete = yield RecordsDelete.create({
                recordId: bobRecipientAuthorizedBar.message.recordId,
                signer: Jws.createSigner(bob)
            });
            const bobAuthorizedBarDeleteReply = yield dwn.processMessage(alice.did, bobAuthorizedBarDelete.message);
            expect(bobAuthorizedBarDeleteReply.status.code).to.equal(202);
            // 10. Verify that Bob cannot delete Carol's `bar`.
            const bobUnauthorizedBarDelete = yield RecordsDelete.create({
                recordId: carolRecipientAuthorizedBar.message.recordId,
                signer: Jws.createSigner(bob)
            });
            const bobUnauthorizedBarDeleteReply = yield dwn.processMessage(alice.did, bobUnauthorizedBarDelete.message);
            expect(bobUnauthorizedBarDeleteReply.status.code).to.equal(401);
            expect(bobUnauthorizedBarDeleteReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
            // 11. Verify that Bob cannot delete Carol's `baz`
            const bobUnauthorizedBazDelete = yield RecordsDelete.create({
                recordId: carolRecipientAuthorizedBar.message.recordId,
                signer: Jws.createSigner(bob)
            });
            const bobUnauthorizedBazDeleteReply = yield dwn.processMessage(alice.did, bobUnauthorizedBazDelete.message);
            expect(bobUnauthorizedBazDeleteReply.status.code).to.equal(401);
            expect(bobUnauthorizedBazDeleteReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
        }));
        it('should only allow author of an anyone-authorized create to delete', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice installs a protocol with "author of an anyone-authorized create can delete" rules.
            // 2. Bob creates an anyone-authorized `foo`.
            // 3. Carol creates a anyone-authorized `foo`.
            // 4. Verify that Bob can delete his `foo`.
            //   4a. Sanity verify that the delete took effect by reading the record back.
            // 5. Verify that Bob cannot delete Carol's `foo`.
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol with "author of an anyone-authorized create can delete" rule.
            const protocolDefinition = {
                protocol: 'foo',
                published: true,
                types: {
                    foo: {},
                },
                structure: {
                    foo: {
                        $actions: [
                            {
                                who: 'anyone',
                                can: [ProtocolAction.Create, ProtocolAction.Delete]
                            }
                        ]
                    }
                }
            };
            const protocolsConfig = yield ProtocolsConfigure.create({
                definition: protocolDefinition,
                signer: Jws.createSigner(alice)
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Bob creates an anyone-authorized `foo`.
            const bobFooBytes = TestDataGenerator.randomBytes(100);
            const bobAnyoneAuthorizedFoo = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo',
                schema: 'any-schema',
                dataFormat: 'any-format',
                data: bobFooBytes
            });
            const bobAnyoneAuthorizedFooReply = yield dwn.processMessage(alice.did, bobAnyoneAuthorizedFoo.message, { dataStream: DataStream.fromBytes(bobFooBytes) });
            expect(bobAnyoneAuthorizedFooReply.status.code).to.equal(202);
            // 3. Carol creates a anyone-authorized `foo`.
            const carolFooBytes = TestDataGenerator.randomBytes(100);
            const carolAnyoneAuthorizedFoo = yield RecordsWrite.create({
                signer: Jws.createSigner(carol),
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo',
                schema: 'any-schema',
                dataFormat: 'any-format',
                data: carolFooBytes
            });
            const carolAnyoneAuthorizedFooReply = yield dwn.processMessage(alice.did, carolAnyoneAuthorizedFoo.message, { dataStream: DataStream.fromBytes(carolFooBytes) });
            expect(carolAnyoneAuthorizedFooReply.status.code).to.equal(202);
            // 4. Verify that Bob can delete his `foo`.
            const bobAuthorizedFooDelete = yield RecordsDelete.create({
                recordId: bobAnyoneAuthorizedFoo.message.recordId,
                signer: Jws.createSigner(bob)
            });
            const bobAuthorizedFooDeleteReply = yield dwn.processMessage(alice.did, bobAuthorizedFooDelete.message);
            expect(bobAuthorizedFooDeleteReply.status.code).to.equal(202);
            //   4a. Sanity verify that the delete took effect by reading the record back.
            const bobBarRead = yield RecordsRead.create({
                filter: {
                    recordId: bobAnyoneAuthorizedFoo.message.recordId
                },
                signer: Jws.createSigner(alice)
            });
            const bobFooReadReply = yield dwn.processMessage(alice.did, bobBarRead.message);
            expect(bobFooReadReply.status.code).to.equal(404);
            // 5. Verify that Bob cannot delete Carol's `foo`.
            const bobUnauthorizedBarDelete = yield RecordsDelete.create({
                recordId: carolAnyoneAuthorizedFoo.message.recordId,
                signer: Jws.createSigner(bob)
            });
            const bobUnauthorizedFooDeleteReply = yield dwn.processMessage(alice.did, bobUnauthorizedBarDelete.message);
            expect(bobUnauthorizedFooDeleteReply.status.code).to.equal(401);
            expect(bobUnauthorizedFooDeleteReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
        }));
        it('should not allow creation of a protocol definition with action rule containing `delete` without `create`', () => __awaiter(this, void 0, void 0, function* () {
            const protocolDefinition = {
                protocol: 'foo',
                published: true,
                types: {
                    foo: {},
                },
                structure: {
                    foo: {
                        $actions: [
                            {
                                who: 'anyone',
                                can: [ProtocolAction.Delete] // intentionally missing `create` action
                            }
                        ]
                    }
                }
            };
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const protocolsConfigureCreatePromise = ProtocolsConfigure.create({
                definition: protocolDefinition,
                signer: Jws.createSigner(alice)
            });
            yield expect(protocolsConfigureCreatePromise).to.be.rejectedWith(DwnErrorCode.ProtocolsConfigureInvalidActionDeleteWithoutCreate);
        }));
        it('should reject ProtocolsConfigure with action rule containing `delete` action without `create` during processing', () => __awaiter(this, void 0, void 0, function* () {
            const protocolDefinition = {
                protocol: 'http://foo',
                published: true,
                types: {
                    foo: {},
                },
                structure: {
                    foo: {
                        $actions: [
                            {
                                who: 'anyone',
                                can: [ProtocolAction.Delete] // intentionally missing `create` action
                            }
                        ]
                    }
                }
            };
            // manually craft the invalid ProtocolsConfigure message because our library will not let you create an invalid definition
            const descriptor = {
                interface: DwnInterfaceName.Protocols,
                method: DwnMethodName.Configure,
                messageTimestamp: Time.getCurrentTimestamp(),
                definition: protocolDefinition
            };
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const authorization = yield Message.createAuthorization({
                descriptor,
                signer: Jws.createSigner(alice)
            });
            const protocolsConfigureMessage = { descriptor, authorization };
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfigureMessage);
            expect(protocolsConfigureReply.status.code).to.equal(400);
            expect(protocolsConfigureReply.status.detail).to.contain(DwnErrorCode.ProtocolsConfigureInvalidActionDeleteWithoutCreate);
        }));
        describe('ProtocolAuthorization.getActionsSeekingARuleMatch()', () => {
            it('should return empty array when given a RecordsDelete on a non-existent record', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const bobUnauthorizedFooDelete = yield RecordsDelete.create({
                    recordId: 'non-existent-record-id',
                    signer: Jws.createSigner(alice)
                });
                const bobUnauthorizedFooDeleteReply = yield dwn.processMessage(alice.did, bobUnauthorizedFooDelete.message);
                expect(bobUnauthorizedFooDeleteReply.status.code).to.equal(404);
                const actionsSeekingARuleMatch = yield ProtocolAuthorization['getActionsSeekingARuleMatch'](alice.did, bobUnauthorizedFooDelete, messageStore);
                expect(actionsSeekingARuleMatch).to.be.empty;
            }));
        });
    });
}
//# sourceMappingURL=protocol-delete-action.spec.js.map