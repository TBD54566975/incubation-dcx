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
import { Dwn } from '../src/dwn.js';
import { Message } from '../src/core/message.js';
import { stubInterface } from 'ts-sinon';
import { TestDataGenerator } from './utils/test-data-generator.js';
import { TestEventStream } from './test-event-stream.js';
import { TestStores } from './test-stores.js';
import { DidKey, UniversalResolver } from '@web5/dids';
chai.use(chaiAsPromised);
export function testDwnClass() {
    describe('DWN', () => {
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
            sinon.restore(); // wipe all stubs/spies/mocks/fakes from previous test
            yield messageStore.clear(); // clean up before each test rather than after so that a test does not depend on other tests to do the clean up
        }));
        after(() => __awaiter(this, void 0, void 0, function* () {
            yield dwn.close();
        }));
        describe('processMessage()', () => {
            it('should process RecordsWrite message signed by a `did:key` DID', () => __awaiter(this, void 0, void 0, function* () {
                // generate a `did:key` DID
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { message, dataStream } = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                });
                const reply = yield dwn.processMessage(alice.did, message, { dataStream });
                expect(reply.status.code).to.equal(202);
            }));
            it('should process RecordsQuery message', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { author, message } = yield TestDataGenerator.generateRecordsQuery({ author: alice });
                const tenant = author.did;
                const reply = yield dwn.processMessage(tenant, message);
                expect(reply.status.code).to.equal(200);
                expect(reply.entries).to.be.empty;
            }));
            it('should process an MessagesQuery message', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { message } = yield TestDataGenerator.generateMessagesQuery({ author: alice });
                const reply = yield dwn.processMessage(alice.did, message);
                expect(reply.status.code).to.equal(200);
                expect(reply.entries).to.be.empty;
                expect(reply.data).to.not.exist;
            }));
            it('#191 - regression - should run JSON schema validation', () => __awaiter(this, void 0, void 0, function* () {
                const invalidMessage = {
                    descriptor: {
                        interface: 'Records',
                        method: 'Read',
                        messageTimestamp: '2023-07-25T10:20:30.123456Z'
                    },
                    authorization: {}
                };
                const validateJsonSchemaSpy = sinon.spy(Message, 'validateJsonSchema');
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const reply = yield dwn.processMessage(alice.did, invalidMessage);
                sinon.assert.calledOnce(validateJsonSchemaSpy);
                expect(reply.status.code).to.equal(400);
                expect(reply.status.detail).to.contain(`must have required property 'filter'`);
            }));
            it('should throw 400 if given no interface or method found in message', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const reply1 = yield dwn.processMessage(alice.did, undefined); // missing message entirely, thus missing both `interface` and `method`
                expect(reply1.status.code).to.equal(400);
                expect(reply1.status.detail).to.contain('Both interface and method must be present');
                const reply2 = yield dwn.processMessage(alice.did, { descriptor: { method: 'anyValue' } }); // missing `interface`
                expect(reply2.status.code).to.equal(400);
                expect(reply2.status.detail).to.contain('Both interface and method must be present');
                const reply3 = yield dwn.processMessage(alice.did, { descriptor: { interface: 'anyValue' } }); // missing `method`
                expect(reply3.status.code).to.equal(400);
                expect(reply3.status.detail).to.contain('Both interface and method must be present');
            }));
            it('should throw 401 if message is targeted at a non active tenant', () => __awaiter(this, void 0, void 0, function* () {
                // tenant gate that blocks everyone
                const blockAllTenantGate = {
                    isActiveTenant() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return { isActiveTenant: false };
                        });
                    }
                };
                const messageStoreStub = stubInterface();
                const dataStoreStub = stubInterface();
                const resumableTaskStoreStub = stubInterface();
                const eventLogStub = stubInterface();
                const eventStreamStub = stubInterface();
                const dwnWithConfig = yield Dwn.create({
                    tenantGate: blockAllTenantGate,
                    messageStore: messageStoreStub,
                    dataStore: dataStoreStub,
                    resumableTaskStore: resumableTaskStoreStub,
                    eventLog: eventLogStub,
                    eventStream: eventStreamStub
                });
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { author, message } = yield TestDataGenerator.generateRecordsQuery({ author: alice });
                const tenant = author.did;
                const reply = yield dwnWithConfig.processMessage(tenant, message);
                expect(reply.status.code).to.equal(401);
                expect(reply.status.detail).to.contain('not an active tenant');
            }));
            it('should throw 401 with custom message from tenant gate if provided', () => __awaiter(this, void 0, void 0, function* () {
                // tenant gate that blocks everyone with a custom message
                const customMessage = 'a custom not-an-active-tenant message';
                const blockAllTenantGate = {
                    isActiveTenant() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return { isActiveTenant: false, detail: customMessage };
                        });
                    }
                };
                const messageStoreStub = stubInterface();
                const dataStoreStub = stubInterface();
                const resumableTaskStoreStub = stubInterface();
                const eventLogStub = stubInterface();
                const eventStreamStub = stubInterface();
                const dwnWithConfig = yield Dwn.create({
                    tenantGate: blockAllTenantGate,
                    messageStore: messageStoreStub,
                    dataStore: dataStoreStub,
                    resumableTaskStore: resumableTaskStoreStub,
                    eventLog: eventLogStub,
                    eventStream: eventStreamStub
                });
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const { author, message } = yield TestDataGenerator.generateRecordsQuery({ author: alice });
                const tenant = author.did;
                const reply = yield dwnWithConfig.processMessage(tenant, message);
                expect(reply.status.code).to.equal(401);
                expect(reply.status.detail).to.equal(customMessage);
            }));
        });
    });
}
//# sourceMappingURL=dwn.spec.js.map