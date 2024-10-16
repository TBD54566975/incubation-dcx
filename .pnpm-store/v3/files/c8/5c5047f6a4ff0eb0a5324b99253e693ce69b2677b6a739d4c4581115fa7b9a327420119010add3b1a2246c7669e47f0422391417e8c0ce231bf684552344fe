var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { CryptoAlgorithm } from '@web5/crypto';
import { Pbkdf2 } from '../primitives/pbkdf2.js';
export class Pbkdf2Algorithm extends CryptoAlgorithm {
    deriveKeyBytes(_a) {
        var { algorithm } = _a, params = __rest(_a, ["algorithm"]);
        return __awaiter(this, void 0, void 0, function* () {
            // Extract the hash function component of the `algorithm` parameter.
            const [, hashFunction] = algorithm.split(/[-+]/);
            // Map from JOSE algorithm name to "SHA" hash function identifier.
            const hash = {
                'HS256': 'SHA-256',
                'HS384': 'SHA-384',
                'HS512': 'SHA-512'
            }[hashFunction];
            // Derive a cryptographic byte array using PBKDF2.
            const derivedKeyBytes = yield Pbkdf2.deriveKeyBytes(Object.assign(Object.assign({}, params), { hash }));
            return derivedKeyBytes;
        });
    }
}
//# sourceMappingURL=pbkdf2.js.map