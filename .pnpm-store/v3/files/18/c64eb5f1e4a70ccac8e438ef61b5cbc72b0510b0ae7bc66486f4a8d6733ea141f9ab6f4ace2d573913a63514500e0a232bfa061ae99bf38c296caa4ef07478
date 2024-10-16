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
import { RecordsRead } from '../../src/interfaces/records-read.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import { DwnErrorCode, DwnInterfaceName, DwnMethodName, Message, ProtocolsConfigure, Time } from '../../src/index.js';
chai.use(chaiAsPromised);
export function testProtocolUpdateAction() {
    describe('Protocol `update` action', () => {
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
        it('should only allow author of a role-authorized create to update', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice installs a protocol with a "author of a role-authorized create can update" rule.
            // 2. Alice gives Bob and Carol the "user" role to be able to write `foo` records.
            // 3. Bob creates a `foo` by invoking the user role.
            // 4. Verify that Bob can update his `foo`
            //   4a. Sanity verify that the update took effect by reading the record back
            // 5. Carol creates a `foo` by invoking the user role.
            // 6. Verify that Carol can update her `foo`
            // 7. Verify that Bob cannot update Carol's `foo`
            var _a;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol with a "author of a role-authorized create can update" rule.
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
                                can: [ProtocolAction.Create, ProtocolAction.Update]
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
            // 4. Verify that Bob can update his `foo`
            const bobFooNewBytes = TestDataGenerator.randomBytes(100);
            const bobAuthorizedFooUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: bobRoleAuthorizedFoo.message,
                data: bobFooNewBytes,
                signer: Jws.createSigner(bob)
            });
            const bobAuthorizedFooUpdateReply = yield dwn.processMessage(alice.did, bobAuthorizedFooUpdate.message, { dataStream: DataStream.fromBytes(bobFooNewBytes) });
            expect(bobAuthorizedFooUpdateReply.status.code).to.equal(202);
            //   4a. Sanity verify that the update took effect by reading the record back
            const recordsRead = yield RecordsRead.create({
                filter: {
                    recordId: bobRoleAuthorizedFoo.message.recordId
                },
                signer: Jws.createSigner(alice)
            });
            const recordsReadReply = yield dwn.processMessage(alice.did, recordsRead.message);
            expect(recordsReadReply.status.code).to.equal(200);
            expect((_a = recordsReadReply.record) === null || _a === void 0 ? void 0 : _a.data).to.exist;
            const dataFromReply = yield DataStream.toBytes(recordsReadReply.record.data);
            expect(dataFromReply).to.eql(bobFooNewBytes);
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
            // 6. Verify that carol can update her `foo`
            const carolFooNewBytes = TestDataGenerator.randomBytes(100);
            const carolAuthorizedFooUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: carolRoleAuthorizedFoo.message,
                data: carolFooNewBytes,
                signer: Jws.createSigner(carol)
            });
            const carolAuthorizedFooUpdateReply = yield dwn.processMessage(alice.did, carolAuthorizedFooUpdate.message, { dataStream: DataStream.fromBytes(carolFooNewBytes) });
            expect(carolAuthorizedFooUpdateReply.status.code).to.equal(202);
            // 7. Verify that Bob cannot update Carol's `foo`
            const bobUnauthorizedFooUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: carolRoleAuthorizedFoo.message,
                data: bobFooNewBytes,
                signer: Jws.createSigner(bob)
            });
            const bobUnauthorizedFooUpdateReply = yield dwn.processMessage(alice.did, bobUnauthorizedFooUpdate.message, { dataStream: DataStream.fromBytes(bobFooNewBytes) });
            expect(bobUnauthorizedFooUpdateReply.status.code).to.equal(401);
            expect(bobUnauthorizedFooUpdateReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
        }));
        it('should only allow author of an author/recipient-authorized create to update', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice installs a protocol with "author of an author/recipient-authorized create can update" rules.
            // 2. Alice creates a `foo` with Bob being the recipient, so that Bob can create `bar`.
            // 3. Alice creates a `foo` with Carol being the recipient, so that Carol can create `bar`.
            // 4. Bob creates a recipient-authorized `bar`.
            // 5. Carol creates a recipient-authorized `bar`.
            // 6. Verify that Bob can update his `bar`.
            //   6a. Sanity verify that the update took effect by reading the record back.
            // 7. Verify that Bob cannot update Carol's `bar`.
            // 8. Bob creates a author-authorized `baz` after his `bar`.
            // 9. Carol creates a author-authorized `baz` after her `bar`.
            // 10. Verify that Bob can update his `baz`
            //   10a. Sanity verify that the update took effect by reading the record back.
            // 11. Verify that Bob cannot update Carol's `baz`
            var _b, _c;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol with "author of an author/recipient-authorized create can update" rules.
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
                                    can: [ProtocolAction.Create, ProtocolAction.Update]
                                }
                            ],
                            baz: {
                                $actions: [
                                    {
                                        who: 'author',
                                        of: 'foo/bar',
                                        can: [ProtocolAction.Create, ProtocolAction.Update]
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
            // 5. Carol creates a recipient-authorized `bar`.
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
            // 6. Verify that Bob can update his `bar`.
            const bobBarNewBytes = TestDataGenerator.randomBytes(100);
            const bobAuthorizedBarUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: bobRecipientAuthorizedBar.message,
                data: bobBarNewBytes,
                signer: Jws.createSigner(bob)
            });
            const bobAuthorizedBarUpdateReply = yield dwn.processMessage(alice.did, bobAuthorizedBarUpdate.message, { dataStream: DataStream.fromBytes(bobBarNewBytes) });
            expect(bobAuthorizedBarUpdateReply.status.code).to.equal(202);
            //   6a. Sanity verify that the update took effect by reading the record back.
            const bobBarRead = yield RecordsRead.create({
                filter: {
                    recordId: bobRecipientAuthorizedBar.message.recordId
                },
                signer: Jws.createSigner(alice)
            });
            const bobBarReadReply = yield dwn.processMessage(alice.did, bobBarRead.message);
            expect(bobBarReadReply.status.code).to.equal(200);
            expect((_b = bobBarReadReply.record) === null || _b === void 0 ? void 0 : _b.data).to.exist;
            const dataFromBobBarRead = yield DataStream.toBytes(bobBarReadReply.record.data);
            expect(dataFromBobBarRead).to.eql(bobBarNewBytes);
            // 7. Verify that Bob cannot update Carol's `bar`.
            const bobUnauthorizedBarUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: carolRecipientAuthorizedBar.message,
                data: bobBarNewBytes,
                signer: Jws.createSigner(bob)
            });
            const bobUnauthorizedBarUpdateReply = yield dwn.processMessage(alice.did, bobUnauthorizedBarUpdate.message, { dataStream: DataStream.fromBytes(bobBarNewBytes) });
            expect(bobUnauthorizedBarUpdateReply.status.code).to.equal(401);
            expect(bobUnauthorizedBarUpdateReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
            // 8. Bob creates a author-authorized `baz` after his `bar`.
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
            // 9. Carol creates a author-authorized `baz` after her `bar`.
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
            // 10. Verify that Bob can update his `baz`
            const bobBazNewBytes = TestDataGenerator.randomBytes(100);
            const bobAuthorizedBazUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: bobAuthorAuthorizedBaz.message,
                data: bobBazNewBytes,
                signer: Jws.createSigner(bob)
            });
            const bobAuthorizedBazUpdateReply = yield dwn.processMessage(alice.did, bobAuthorizedBazUpdate.message, { dataStream: DataStream.fromBytes(bobBazNewBytes) });
            expect(bobAuthorizedBazUpdateReply.status.code).to.equal(202);
            //   10a. Sanity verify that the update took effect by reading the record back.
            const bobBazRead = yield RecordsRead.create({
                filter: {
                    recordId: bobAuthorAuthorizedBaz.message.recordId
                },
                signer: Jws.createSigner(alice)
            });
            const bobBazReadReply = yield dwn.processMessage(alice.did, bobBazRead.message);
            expect(bobBazReadReply.status.code).to.equal(200);
            expect((_c = bobBazReadReply.record) === null || _c === void 0 ? void 0 : _c.data).to.exist;
            const dataFromBobBazRead = yield DataStream.toBytes(bobBazReadReply.record.data);
            expect(dataFromBobBazRead).to.eql(bobBazNewBytes);
            // 11. Verify that Bob cannot update Carol's `baz`
            const bobUnauthorizedBazUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: carolRecipientAuthorizedBar.message,
                data: bobBazNewBytes,
                signer: Jws.createSigner(bob)
            });
            const bobUnauthorizedBazUpdateReply = yield dwn.processMessage(alice.did, bobUnauthorizedBazUpdate.message, { dataStream: DataStream.fromBytes(bobBazNewBytes) });
            expect(bobUnauthorizedBazUpdateReply.status.code).to.equal(401);
            expect(bobUnauthorizedBazUpdateReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
        }));
        it('should only allow author of an anyone-authorized create to update', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice installs a protocol with "author of an anyone-authorized create can update" rules.
            // 2. Bob creates an anyone-authorized `foo`.
            // 3. Carol creates a anyone-authorized `foo`.
            // 4. Verify that Bob can update his `foo`.
            //   4a. Sanity verify that the update took effect by reading the record back.
            // 5. Verify that Bob cannot update Carol's `foo`.
            var _d;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol with "author of an anyone-authorized create can update" rule.
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
                                can: [ProtocolAction.Create, ProtocolAction.Update]
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
            // 4. Verify that Bob can update his `foo`.
            const bobFooNewBytes = TestDataGenerator.randomBytes(100);
            const bobAuthorizedFooUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: bobAnyoneAuthorizedFoo.message,
                data: bobFooNewBytes,
                signer: Jws.createSigner(bob)
            });
            const bobAuthorizedFooUpdateReply = yield dwn.processMessage(alice.did, bobAuthorizedFooUpdate.message, { dataStream: DataStream.fromBytes(bobFooNewBytes) });
            expect(bobAuthorizedFooUpdateReply.status.code).to.equal(202);
            //   4a. Sanity verify that the update took effect by reading the record back.
            const bobBarRead = yield RecordsRead.create({
                filter: {
                    recordId: bobAnyoneAuthorizedFoo.message.recordId
                },
                signer: Jws.createSigner(alice)
            });
            const bobFooReadReply = yield dwn.processMessage(alice.did, bobBarRead.message);
            expect(bobFooReadReply.status.code).to.equal(200);
            expect((_d = bobFooReadReply.record) === null || _d === void 0 ? void 0 : _d.data).to.exist;
            const dataFromBobFooRead = yield DataStream.toBytes(bobFooReadReply.record.data);
            expect(dataFromBobFooRead).to.eql(bobFooNewBytes);
            // 5. Verify that Bob cannot update Carol's `foo`.
            const bobUnauthorizedBarUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: carolAnyoneAuthorizedFoo.message,
                data: bobFooNewBytes,
                signer: Jws.createSigner(bob)
            });
            const bobUnauthorizedFooUpdateReply = yield dwn.processMessage(alice.did, bobUnauthorizedBarUpdate.message, { dataStream: DataStream.fromBytes(bobFooNewBytes) });
            expect(bobUnauthorizedFooUpdateReply.status.code).to.equal(401);
            expect(bobUnauthorizedFooUpdateReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
        }));
        it('should fail an update to an non-existent record', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario:
            // 1. Alice installs a protocol with "author of an anyone-authorized create can update" rules.
            // 2. Bob constructs an anyone-authorized `foo` but never sent it to the DWN.
            // 3. Verify that Bob cannot update a `foo` that does not exist in the DWN.
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            // 1. Alice installs a protocol with "author of an anyone-authorized create can update" rule.
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
                                can: [ProtocolAction.Create, ProtocolAction.Update]
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
            // 2. Bob constructs an anyone-authorized `foo` but never sent it to the DWN.
            const bobFooBytes = TestDataGenerator.randomBytes(100);
            const bobAnyoneAuthorizedFoo = yield RecordsWrite.create({
                signer: Jws.createSigner(bob),
                protocol: protocolDefinition.protocol,
                protocolPath: 'foo',
                schema: 'any-schema',
                dataFormat: 'any-format',
                data: bobFooBytes
            });
            // 3. Verify that Bob cannot update a `foo` that does not exist in the DWN.
            const bobFooNewBytes = TestDataGenerator.randomBytes(100);
            const bobAuthorizedFooUpdate = yield RecordsWrite.createFrom({
                recordsWriteMessage: bobAnyoneAuthorizedFoo.message,
                data: bobFooNewBytes,
                signer: Jws.createSigner(bob)
            });
            const bobAuthorizedFooUpdateReply = yield dwn.processMessage(alice.did, bobAuthorizedFooUpdate.message, { dataStream: DataStream.fromBytes(bobFooNewBytes) });
            expect(bobAuthorizedFooUpdateReply.status.code).to.equal(401);
            expect(bobAuthorizedFooUpdateReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
        }));
        it('should not allow creation of a protocol definition with action rule containing `update` without `create`', () => __awaiter(this, void 0, void 0, function* () {
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
                                can: [ProtocolAction.Update] // intentionally missing `create` action
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
            yield expect(protocolsConfigureCreatePromise).to.be.rejectedWith(DwnErrorCode.ProtocolsConfigureInvalidActionUpdateWithoutCreate);
        }));
        it('should reject ProtocolsConfigure with action rule containing `update` action without `create` during processing', () => __awaiter(this, void 0, void 0, function* () {
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
                                can: [ProtocolAction.Update] // intentionally missing `create` action
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
            expect(protocolsConfigureReply.status.detail).to.contain(DwnErrorCode.ProtocolsConfigureInvalidActionUpdateWithoutCreate);
        }));
    });
}
//# sourceMappingURL=protocol-update-action.spec.js.map