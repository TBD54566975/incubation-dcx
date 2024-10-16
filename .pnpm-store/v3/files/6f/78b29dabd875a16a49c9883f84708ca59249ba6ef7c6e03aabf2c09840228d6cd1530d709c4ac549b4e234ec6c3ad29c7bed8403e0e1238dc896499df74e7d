var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ArrayUtility } from '../../src/utils/array.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { expect } from 'chai';
import { HdKey } from '../../src/utils/hd-key.js';
import { Secp256k1 } from '../../src/utils/secp256k1.js';
describe('HdKey', () => {
    describe('derivePrivateKeyBytes()', () => {
        it('should be able to derive same key using different ancestor along the chain path', () => __awaiter(void 0, void 0, void 0, function* () {
            const { privateKey } = yield Secp256k1.generateKeyPairRaw();
            const fullPathToG = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
            const fullPathToD = ['a', 'b', 'c', 'd'];
            const relativePathFromDToG = ['e', 'f', 'g'];
            // testing private key derivation from different ancestor in the same chain
            const privateKeyG = yield HdKey.derivePrivateKeyBytes(privateKey, fullPathToG);
            const privateKeyD = yield HdKey.derivePrivateKeyBytes(privateKey, fullPathToD);
            const privateKeyGFromD = yield HdKey.derivePrivateKeyBytes(privateKeyD, relativePathFromDToG);
            expect(ArrayUtility.byteArraysEqual(privateKeyG, privateKeyGFromD)).to.be.true;
        }));
        it('should throw if derivation path is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const { privateKey } = yield Secp256k1.generateKeyPairRaw();
            const invalidPath = ['should not have segment with empty string', ''];
            yield expect(HdKey.derivePrivateKeyBytes(privateKey, invalidPath)).to.be.rejectedWith(DwnErrorCode.HdKeyDerivationPathInvalid);
        }));
    });
});
//# sourceMappingURL=hd-key.spec.js.map