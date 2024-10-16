"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.AesCtrAlgorithm = void 0;
var aes_ctr_js_1 = require("../primitives/aes-ctr.js");
var crypto_algorithm_js_1 = require("./crypto-algorithm.js");
/**
 * The `AesCtrAlgorithm` class provides a concrete implementation for cryptographic operations using
 * the AES algorithm in Counter (CTR) mode. This class implements both {@link Cipher | `Cipher`} and
 * { @link KeyGenerator | `KeyGenerator`} interfaces, providing key generation, encryption, and
 * decryption features.
 *
 * This class is typically accessed through implementations that extend the
 * {@link CryptoApi | `CryptoApi`} interface.
 */
var AesCtrAlgorithm = /** @class */ (function (_super) {
    __extends(AesCtrAlgorithm, _super);
    function AesCtrAlgorithm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Decrypts the provided data using AES-CTR.
     *
     * @remarks
     * This method performs AES-CTR decryption on the given encrypted data using the specified key.
     * Similar to the encryption process, it requires an initial counter block and the length
     * of the counter block, along with the encrypted data and the decryption key. The method
     * returns the decrypted data as a Uint8Array.
     *
     * @example
     * ```ts
     * const aesCtr = new AesCtrAlgorithm();
     * const encryptedData = new Uint8Array([...]); // Encrypted data
     * const counter = new Uint8Array(16); // 16-byte (128-bit) counter block used during encryption
     * const key = { ... }; // A Jwk object representing the same AES key used for encryption
     * const decryptedData = await aesCtr.decrypt({
     *   data: encryptedData,
     *   counter,
     *   key,
     *   length: 128 // Length of the counter in bits
     * });
     * ```
     *
     * @param params - The parameters for the decryption operation.
     *
     * @returns A Promise that resolves to the decrypted data as a Uint8Array.
     */
    AesCtrAlgorithm.prototype.decrypt = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var plaintext;
            return __generator(this, function (_a) {
                plaintext = aes_ctr_js_1.AesCtr.decrypt(params);
                return [2 /*return*/, plaintext];
            });
        });
    };
    /**
     * Encrypts the provided data using AES-CTR.
     *
     * @remarks
     * This method performs AES-CTR encryption on the given data using the specified key.
     * It requires the initial counter block and the length of the counter block, alongside
     * the data and key. The method is designed to work asynchronously and returns the
     * encrypted data as a Uint8Array.
     *
     * @example
     * ```ts
     * const aesCtr = new AesCtrAlgorithm();
     * const data = new TextEncoder().encode('Messsage');
     * const counter = new Uint8Array(16); // 16-byte (128-bit) counter block
     * const key = { ... }; // A Jwk object representing an AES key
     * const encryptedData = await aesCtr.encrypt({
     *   data,
     *   counter,
     *   key,
     *   length: 128 // Length of the counter in bits
     * });
     * ```
     *
     * @param params - The parameters for the encryption operation.
     *
     * @returns A Promise that resolves to the encrypted data as a Uint8Array.
     */
    AesCtrAlgorithm.prototype.encrypt = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var ciphertext;
            return __generator(this, function (_a) {
                ciphertext = aes_ctr_js_1.AesCtr.encrypt(params);
                return [2 /*return*/, ciphertext];
            });
        });
    };
    /**
     * Generates a symmetric key for AES in Counter (CTR) mode in JSON Web Key (JWK) format.
     *
     * @remarks
     * This method generates a symmetric AES key for use in CTR mode, based on the specified
     * `algorithm` parameter which determines the key length. It uses cryptographically secure random
     * number generation to ensure the uniqueness and security of the key. The key is returned in JWK
     * format.
     *
     * The generated key includes the following components:
     * - `kty`: Key Type, set to 'oct' for Octet Sequence.
     * - `k`: The symmetric key component, base64url-encoded.
     * - `kid`: Key ID, generated based on the JWK thumbprint.
     *
     * @example
     * ```ts
     * const aesCtr = new AesCtrAlgorithm();
     * const privateKey = await aesCtr.generateKey({ algorithm: 'A256CTR' });
     * ```
     *
     * @param params - The parameters for the key generation.
     *
     * @returns A Promise that resolves to the generated symmetric key in JWK format.
     */
    AesCtrAlgorithm.prototype.generateKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var length, privateKey;
            var algorithm = _b.algorithm;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        length = { A128CTR: 128, A192CTR: 192, A256CTR: 256 }[algorithm];
                        return [4 /*yield*/, aes_ctr_js_1.AesCtr.generateKey({ length: length })];
                    case 1:
                        privateKey = _c.sent();
                        // Set the `alg` property based on the specified algorithm.
                        privateKey.alg = algorithm;
                        return [2 /*return*/, privateKey];
                }
            });
        });
    };
    return AesCtrAlgorithm;
}(crypto_algorithm_js_1.CryptoAlgorithm));
exports.AesCtrAlgorithm = AesCtrAlgorithm;
//# sourceMappingURL=aes-ctr.js.map