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
import { Jws } from '../../src/utils/jws.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestStores } from '../test-stores.js';
import { DwnErrorCode, DwnInterfaceName, DwnMethodName, Encoder, PermissionGrant, PermissionRequest, PermissionsProtocol, Time } from '../../src/index.js';
chai.use(chaiAsPromised);
describe('PermissionsProtocol', () => {
    let messageStore;
    // important to follow the `before` and `after` pattern to initialize and clean the stores in tests
    // so that different test suites can reuse the same backend store for testing
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        const stores = TestStores.get();
        messageStore = stores.messageStore;
        yield messageStore.open();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // restores all fakes, stubs, spies etc. not restoring causes a memory leak.
        // more info here: https://sinonjs.org/releases/v13/general-setup/
        sinon.restore();
        yield messageStore.clear();
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield messageStore.close();
    }));
    describe('getScopeFromPermissionRecord', () => {
        it('should get scope from a permission request record', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            // bob creates a request
            const permissionRequest = yield PermissionsProtocol.createRequest({
                signer: Jws.createSigner(bob),
                delegated: true,
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Query,
                    protocol: 'https://example.com/protocol/test'
                }
            });
            const request = yield PermissionRequest.parse(permissionRequest.dataEncodedMessage);
            const scope = yield PermissionsProtocol.getScopeFromPermissionRecord(alice.did, messageStore, permissionRequest.dataEncodedMessage);
            expect(scope).to.deep.equal(request.scope);
        }));
        it('should get scope from a permission grant record', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const { dataEncodedMessage: grantMessage } = yield PermissionsProtocol.createGrant({
                signer: Jws.createSigner(alice),
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Write,
                    protocol: 'https://example.com/protocol/test'
                },
                grantedTo: bob.did,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 })
            });
            const grant = yield PermissionGrant.parse(grantMessage);
            const scope = yield PermissionsProtocol.getScopeFromPermissionRecord(alice.did, messageStore, grantMessage);
            expect(scope).to.deep.equal(grant.scope);
        }));
        it('should get scope from a permission revocation record', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const { dataEncodedMessage: grantMessage, recordsWrite: grantRecordsWrite } = yield PermissionsProtocol.createGrant({
                signer: Jws.createSigner(alice),
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Write,
                    protocol: 'https://example.com/protocol/test'
                },
                grantedTo: bob.did,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 })
            });
            // store grant in the messageStore so that that the original grant can be retrieved within `getScopeFromPermissionRecord`
            const indexes = yield grantRecordsWrite.constructIndexes(true);
            yield messageStore.put(alice.did, grantMessage, indexes);
            const grant = yield PermissionGrant.parse(grantMessage);
            const revocation = yield PermissionsProtocol.createRevocation({
                signer: Jws.createSigner(alice),
                grant: grant
            });
            const scope = yield PermissionsProtocol.getScopeFromPermissionRecord(alice.did, messageStore, revocation.dataEncodedMessage);
            expect(scope).to.deep.equal(grant.scope);
        }));
        it('should throw if there is no grant for the revocation', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const { dataEncodedMessage: grantMessage } = yield PermissionsProtocol.createGrant({
                signer: Jws.createSigner(alice),
                scope: {
                    interface: DwnInterfaceName.Records,
                    method: DwnMethodName.Write,
                    protocol: 'https://example.com/protocol/test'
                },
                grantedTo: bob.did,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 })
            });
            // notice the grant is not stored in the message store
            const grant = yield PermissionGrant.parse(grantMessage);
            const revocation = yield PermissionsProtocol.createRevocation({
                signer: Jws.createSigner(alice),
                grant: grant
            });
            yield expect(PermissionsProtocol.getScopeFromPermissionRecord(alice.did, messageStore, revocation.dataEncodedMessage)).to.eventually.be.rejectedWith(DwnErrorCode.GrantAuthorizationGrantMissing);
        }));
        it('should throw if the message is not a permission protocol record', () => __awaiter(void 0, void 0, void 0, function* () {
            const recordsWriteMessage = yield TestDataGenerator.generateRecordsWrite();
            const dataEncodedMessage = Object.assign(Object.assign({}, recordsWriteMessage.message), { encodedData: Encoder.bytesToBase64Url(recordsWriteMessage.dataBytes) });
            yield expect(PermissionsProtocol.getScopeFromPermissionRecord(recordsWriteMessage.author.did, messageStore, dataEncodedMessage)).to.eventually.be.rejectedWith(DwnErrorCode.PermissionsProtocolGetScopeInvalidProtocol);
        }));
    });
});
//# sourceMappingURL=permissions.spec.js.map