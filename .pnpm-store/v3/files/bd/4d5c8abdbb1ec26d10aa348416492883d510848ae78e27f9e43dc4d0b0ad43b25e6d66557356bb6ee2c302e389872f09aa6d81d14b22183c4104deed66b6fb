"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pbkdf2 = void 0;
var crypto_1 = require("@noble/hashes/crypto");
/**
 * The `Pbkdf2` class provides a secure way to derive cryptographic keys from a password
 * using the PBKDF2 (Password-Based Key Derivation Function 2) algorithm.
 *
 * The PBKDF2 algorithm is widely used for generating keys from passwords, as it applies
 * a pseudorandom function to the input password along with a salt value and iterates the
 * process multiple times to increase the key's resistance to brute-force attacks.
 *
 * This class offers a single static method `deriveKey` to perform key derivation.
 *
 * @example
 * ```ts
 * // Key Derivation
 * const derivedKey = await Pbkdf2.deriveKey({
 *   hash: 'SHA-256', // The hash function to use ('SHA-256', 'SHA-384', 'SHA-512')
 *   password: new TextEncoder().encode('password'), // The password as a Uint8Array
 *   salt: new Uint8Array([...]), // The salt value
 *   iterations: 1000, // The number of iterations
 *   length: 256 // The length of the derived key in bits
 * });
 * ```
 *
 * @remarks
 * This class relies on the availability of the Web Crypto API.
 */
var Pbkdf2 = /** @class */ (function () {
    function Pbkdf2() {
    }
    /**
     * Derives a cryptographic key from a password using the PBKDF2 algorithm.
     *
     * @remarks
     * This method applies the PBKDF2 algorithm to the provided password along with
     * a salt value and iterates the process a specified number of times. It uses
     * a cryptographic hash function to enhance security and produce a key of the
     * desired length. The method is capable of utilizing either the Web Crypto API
     * or the Node.js Crypto module, depending on the environment's support.
     *
     * @example
     * ```ts
     * const derivedKey = await Pbkdf2.deriveKey({
     *   hash: 'SHA-256',
     *   password: new TextEncoder().encode('password'),
     *   salt: new Uint8Array([...]),
     *   iterations: 1000,
     *   length: 256
     * });
     * ```
     *
     * @param params - The parameters for key derivation.
     * @param params.hash - The hash function to use, such as 'SHA-256', 'SHA-384', or 'SHA-512'.
     * @param params.password - The password from which to derive the key, represented as a Uint8Array.
     * @param params.salt - The salt value to use in the derivation process, as a Uint8Array.
     * @param params.iterations - The number of iterations to apply in the PBKDF2 algorithm.
     * @param params.length - The desired length of the derived key in bits.
     *
     * @returns A Promise that resolves to the derived key as a Uint8Array.
     */
    Pbkdf2.deriveKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var webCryptoKey, derivedKeyBuffer, derivedKey;
            var hash = _b.hash, password = _b.password, salt = _b.salt, iterations = _b.iterations, length = _b.length;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, crypto_1.crypto.subtle.importKey('raw', password, { name: 'PBKDF2' }, false, ['deriveBits'])];
                    case 1:
                        webCryptoKey = _c.sent();
                        return [4 /*yield*/, crypto_1.crypto.subtle.deriveBits({ name: 'PBKDF2', hash: hash, salt: salt, iterations: iterations }, webCryptoKey, length)];
                    case 2:
                        derivedKeyBuffer = _c.sent();
                        derivedKey = new Uint8Array(derivedKeyBuffer);
                        return [2 /*return*/, derivedKey];
                }
            });
        });
    };
    return Pbkdf2;
}());
exports.Pbkdf2 = Pbkdf2;
//# sourceMappingURL=pbkdf2.js.map