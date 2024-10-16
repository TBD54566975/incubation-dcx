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
describe('GeneralJwk Schema', () => __awaiter(void 0, void 0, void 0, function* () {
    const jwkSecp256k1 = yield secp256k1.generateKeyPair();
    const jwkEd25519 = yield Ed25519.generateKeyPair();
    const jwkRsa = {
        publicJwk: {
            'kty': 'RSA',
            'e': 'AQAB',
            'use': 'sig',
            'alg': 'RS256',
            'n': 'abcd1234'
        },
        privateJwk: {
            'p': 'pProp',
            'kty': 'RSA',
            'q': 'qProp',
            'd': 'dProp',
            'e': 'eProp',
            'use': 'sig',
            'qi': 'qiProp',
            'dp': 'dpProp',
            'alg': 'RS256',
            'dq': 'dqProp',
            'n': 'nProp'
        }
    };
    [
        jwkEd25519,
        jwkSecp256k1,
        jwkRsa
    ].forEach((jwk) => {
        it('should not throw an exception if properly formatted jwk', () => {
            expect(() => validateJsonSchema('GeneralJwk', jwk.publicJwk)).to.not.throw();
            expect(() => validateJsonSchema('GeneralJwk', jwk.privateJwk)).to.not.throw();
        });
    });
}));
//# sourceMappingURL=general-jwk.spec.js.map