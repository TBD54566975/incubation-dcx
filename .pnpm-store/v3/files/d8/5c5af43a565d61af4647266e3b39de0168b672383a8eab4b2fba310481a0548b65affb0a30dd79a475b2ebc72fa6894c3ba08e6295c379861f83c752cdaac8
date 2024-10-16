var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect } from 'chai';
import { signatureAlgorithms } from '../../../../src/jose/algorithms/signing/signature-algorithms.js';
import { validateJsonSchema } from '../../../../src/schema-validator.js';
const { Ed25519, secp256k1 } = signatureAlgorithms;
describe('PublicJwk Schema', () => __awaiter(void 0, void 0, void 0, function* () {
    const { publicJwk: publicJwkSecp256k1 } = yield secp256k1.generateKeyPair();
    const { publicJwk: publicJwkEd25519 } = yield Ed25519.generateKeyPair();
    const publicJwkRsa = {
        'kty': 'RSA',
        'e': 'AQAB',
        'use': 'sig',
        'alg': 'RS256',
        'n': 'abcd1234'
    };
    it('should not throw an exception if properly formatted publicJwk', () => {
        expect(() => validateJsonSchema('PublicJwk', publicJwkSecp256k1)).to.not.throw();
        expect(() => validateJsonSchema('PublicJwk', publicJwkEd25519)).to.not.throw();
        expect(() => validateJsonSchema('PublicJwk', publicJwkRsa)).to.not.throw();
    });
    it('should throw an exception if publicJwk has private property', () => {
        expect(() => validateJsonSchema('PublicJwk', Object.assign(Object.assign({}, publicJwkSecp256k1), { d: 'supersecret' }))).to.throw();
        expect(() => validateJsonSchema('PublicJwk', Object.assign(Object.assign({}, publicJwkEd25519), { d: 'supersecret' }))).to.throw();
        expect(() => validateJsonSchema('PublicJwk', Object.assign(Object.assign({}, publicJwkRsa), { oth: {} }))).to.throw();
        expect(() => validateJsonSchema('PublicJwk', Object.assign(Object.assign({}, publicJwkRsa), { d: 'supersecret', oth: {} }))).to.throw();
    });
}));
//# sourceMappingURL=public-jwk.spec.js.map