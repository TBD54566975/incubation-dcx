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
import { DwnInterfaceName, DwnMethodName, PermissionRequest, PermissionsProtocol, TestDataGenerator } from '../../src/index.js';
chai.use(chaiAsPromised);
describe('PermissionRequest', () => {
    afterEach(() => {
        // restores all fakes, stubs, spies etc. not restoring causes a memory leak.
        // more info here: https://sinonjs.org/releases/v13/general-setup/
        sinon.restore();
    });
    it('should parse a permission request message into a PermissionRequest', () => __awaiter(void 0, void 0, void 0, function* () {
        const alice = yield TestDataGenerator.generateDidKeyPersona();
        const scope = {
            interface: DwnInterfaceName.Records,
            method: DwnMethodName.Query,
            protocol: 'https://example.com/protocol/test'
        };
        const permissionRequest = yield PermissionsProtocol.createRequest({
            signer: Jws.createSigner(alice),
            delegated: true,
            scope
        });
        const parsedPermissionRequest = yield PermissionRequest.parse(permissionRequest.dataEncodedMessage);
        expect(parsedPermissionRequest.id).to.equal(permissionRequest.dataEncodedMessage.recordId);
        expect(parsedPermissionRequest.delegated).to.equal(true);
        expect(parsedPermissionRequest.scope).to.deep.equal(scope);
    }));
});
//# sourceMappingURL=permission-request.spec.js.map