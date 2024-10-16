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
import { Hkdf } from '../primitives/hkdf.js';
export class HkdfAlgorithm extends CryptoAlgorithm {
    deriveKeyBytes(_a) {
        var { algorithm } = _a, params = __rest(_a, ["algorithm"]);
        return __awaiter(this, void 0, void 0, function* () {
            // Map algorithm name to hash function.
            const hash = {
                'HKDF-256': 'SHA-256',
                'HKDF-384': 'SHA-384',
                'HKDF-512': 'SHA-512'
            }[algorithm];
            // Derive a cryptographic byte array using HKDF.
            const derivedKeyBytes = yield Hkdf.deriveKeyBytes(Object.assign(Object.assign({}, params), { hash }));
            return derivedKeyBytes;
        });
    }
}
//# sourceMappingURL=hkdf.js.map