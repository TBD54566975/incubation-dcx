var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { base64url } from 'multiformats/bases/base64';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { expect } from 'chai';
import { Secp256k1 } from '../../src/utils/secp256k1.js';
import { TestDataGenerator } from './test-data-generator.js';
describe('Secp256k1', () => {
    describe('generateKeyPairRaw()', () => {
        it('should generate compressed publicKey', () => __awaiter(void 0, void 0, void 0, function* () {
            const { publicKey } = yield Secp256k1.generateKeyPairRaw();
            expect(publicKey.length).to.equal(33);
        }));
    });
    describe('validateKey()', () => {
        it('should throw if key is not a valid SECP256K1 key', () => __awaiter(void 0, void 0, void 0, function* () {
            const validKey = (yield Secp256k1.generateKeyPair()).publicJwk;
            expect(() => Secp256k1.validateKey(Object.assign(Object.assign({}, validKey), { kty: 'invalidKty' }))).to.throw(DwnErrorCode.Secp256k1KeyNotValid);
            expect(() => Secp256k1.validateKey(Object.assign(Object.assign({}, validKey), { crv: 'invalidCrv' }))).to.throw(DwnErrorCode.Secp256k1KeyNotValid);
        }));
    });
    describe('publicKeyToJwk()', () => {
        it('should generate the same JWK regardless of compressed or compressed public key bytes given', () => __awaiter(void 0, void 0, void 0, function* () {
            const compressedPublicKeyBase64UrlString = 'A5roVr1J6MufaaBwweb5Q75PrZCbZpzC55kTCO68ylMs';
            const uncompressedPublicKeyBase64UrlString = 'BJroVr1J6MufaaBwweb5Q75PrZCbZpzC55kTCO68ylMsyC3G4QfbKeDzIr2BwyMUQ3Na1mxPvwxJ8GBMO3jkGL0';
            const compressedPublicKey = base64url.baseDecode(compressedPublicKeyBase64UrlString);
            const uncompressedPublicKey = base64url.baseDecode(uncompressedPublicKeyBase64UrlString);
            const publicJwk1 = yield Secp256k1.publicKeyToJwk(compressedPublicKey);
            const publicJwk2 = yield Secp256k1.publicKeyToJwk(uncompressedPublicKey);
            expect(publicJwk1.x).to.equal(publicJwk2.x);
            expect(publicJwk1.y).to.equal(publicJwk2.y);
        }));
    });
    describe('sign()', () => {
        it('should generate the signature in compact format', () => __awaiter(void 0, void 0, void 0, function* () {
            const { privateJwk } = yield Secp256k1.generateKeyPair();
            const contentBytes = TestDataGenerator.randomBytes(16);
            const signatureBytes = yield Secp256k1.sign(contentBytes, privateJwk);
            expect(signatureBytes.length).to.equal(64); // DER format would be 70 bytes
        }));
    });
});
//# sourceMappingURL=secp256k1.spec.js.map