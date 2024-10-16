var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { expect } from 'chai';
import { PrivateKeySigner } from '../../src/index.js';
import { Secp256k1 } from '../../src/utils/secp256k1.js';
describe('PrivateKeySigner', () => {
    describe('constructor', () => {
        it('should use key ID found in the private JWK if no key ID is explicitly given', () => __awaiter(void 0, void 0, void 0, function* () {
            const { privateJwk } = yield Secp256k1.generateKeyPair();
            privateJwk.kid = 'awesome-key-id';
            const signer = new PrivateKeySigner({ privateJwk });
            expect(signer.keyId).to.equal(privateJwk.kid);
        }));
        it('should override signature algorithm found in the private JWK if a value is explicitly given', () => __awaiter(void 0, void 0, void 0, function* () {
            const { privateJwk } = yield Secp256k1.generateKeyPair();
            const explicitlySpecifiedAlgorithm = 'awesome-algorithm';
            const signer = new PrivateKeySigner({ privateJwk, keyId: 'anyValue', algorithm: explicitlySpecifiedAlgorithm });
            expect(signer.algorithm).to.equal(explicitlySpecifiedAlgorithm);
        }));
        it('should throw if key ID is not explicitly specified and not given in private JWK', () => __awaiter(void 0, void 0, void 0, function* () {
            const { privateJwk } = yield Secp256k1.generateKeyPair();
            expect(() => new PrivateKeySigner({ privateJwk })).to.throw(DwnErrorCode.PrivateKeySignerUnableToDeduceKeyId);
        }));
        it('should throw if signature algorithm is not explicitly specified and not given in private JWK', () => __awaiter(void 0, void 0, void 0, function* () {
            const { privateJwk } = yield Secp256k1.generateKeyPair();
            delete privateJwk.alg; // remove `alg` for this test
            expect(() => new PrivateKeySigner({ privateJwk, keyId: 'anyValue' })).to.throw(DwnErrorCode.PrivateKeySignerUnableToDeduceAlgorithm);
        }));
        it('should throw if crypto curve of the given private JWK is not supported', () => __awaiter(void 0, void 0, void 0, function* () {
            const { privateJwk } = yield Secp256k1.generateKeyPair();
            privateJwk.crv = 'unknown'; // change `crv` to an unsupported value for this test
            expect(() => new PrivateKeySigner({ privateJwk, keyId: 'anyValue' })).to.throw(DwnErrorCode.PrivateKeySignerUnsupportedCurve);
        }));
    });
});
//# sourceMappingURL=private-key-signer.spec.js.map