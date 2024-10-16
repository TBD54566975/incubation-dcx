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
Object.defineProperty(exports, "__esModule", { value: true });
exports.XChaCha20Poly1305 = exports.POLY1305_TAG_LENGTH = void 0;
var common_1 = require("@web5/common");
var chacha_1 = require("@noble/ciphers/chacha");
var webcrypto_1 = require("@noble/ciphers/webcrypto");
var jwk_js_1 = require("../jose/jwk.js");
/**
 * Constant defining the length of the authentication tag in bytes for XChaCha20-Poly1305.
 *
 * @remarks
 * The `POLY1305_TAG_LENGTH` is set to 16 bytes (128 bits), which is the standard size for the
 * Poly1305 authentication tag in XChaCha20-Poly1305 encryption. This tag length ensures
 * a strong level of security for message authentication, verifying the integrity and
 * authenticity of the data during decryption.
 */
exports.POLY1305_TAG_LENGTH = 16;
/**
 * The `XChaCha20Poly1305` class provides a suite of utilities for cryptographic operations
 * using the XChaCha20-Poly1305 algorithm, a combination of the XChaCha20 stream cipher and the
 * Poly1305 message authentication code (MAC). This class encompasses methods for key generation,
 * encryption, decryption, and conversions between raw byte arrays and JSON Web Key (JWK) formats.
 *
 * XChaCha20-Poly1305 is renowned for its high security and efficiency, especially in scenarios
 * involving large data volumes or where data integrity and confidentiality are paramount. The
 * extended nonce size of XChaCha20 reduces the risks of nonce reuse, while Poly1305 provides
 * a strong MAC ensuring data integrity.
 *
 * Key Features:
 * - Key Generation: Generate XChaCha20-Poly1305 symmetric keys in JWK format.
 * - Key Conversion: Transform keys between raw byte arrays and JWK formats.
 * - Encryption: Encrypt data using XChaCha20-Poly1305, returning both ciphertext and MAC tag.
 * - Decryption: Decrypt data and verify integrity using the XChaCha20-Poly1305 algorithm.
 *
 * The methods in this class are asynchronous, returning Promises to accommodate various
 * JavaScript environments.
 *
 * @example
 * ```ts
 * // Key Generation
 * const privateKey = await XChaCha20Poly1305.generateKey();
 *
 * // Encryption
 * const data = new TextEncoder().encode('Messsage');
 * const nonce = utils.randomBytes(24); // 24-byte nonce
 * const additionalData = new TextEncoder().encode('Associated data');
 * const { ciphertext, tag } = await XChaCha20Poly1305.encrypt({
 *   data,
 *   nonce,
 *   additionalData,
 *   key: privateKey
 * });
 *
 * // Decryption
 * const decryptedData = await XChaCha20Poly1305.decrypt({
 *   data: ciphertext,
 *   nonce,
 *   tag,
 *   additionalData,
 *   key: privateKey
 * });
 *
 * // Key Conversion
 * const privateKeyBytes = await XChaCha20Poly1305.privateKeyToBytes({ privateKey });
 * ```
 */
var XChaCha20Poly1305 = /** @class */ (function () {
    function XChaCha20Poly1305() {
    }
    /**
     * Converts a raw private key in bytes to its corresponding JSON Web Key (JWK) format.
     *
     * @remarks
     * This method takes a symmetric key represented as a byte array (Uint8Array) and converts it into
     * a JWK object for use with the XChaCha20-Poly1305 algorithm. The process involves encoding the
     * key into base64url format and setting the appropriate JWK parameters.
     *
     * The resulting JWK object includes the following properties:
     * - `kty`: Key Type, set to 'oct' for Octet Sequence (representing a symmetric key).
     * - `k`: The symmetric key, base64url-encoded.
     * - `kid`: Key ID, generated based on the JWK thumbprint.
     *
     * @example
     * ```ts
     * const privateKeyBytes = new Uint8Array([...]); // Replace with actual symmetric key bytes
     * const privateKey = await XChaCha20Poly1305.bytesToPrivateKey({ privateKeyBytes });
     * ```
     *
     * @param params - The parameters for the symmetric key conversion.
     * @param params.privateKeyBytes - The raw symmetric key as a Uint8Array.
     *
     * @returns A Promise that resolves to the symmetric key in JWK format.
     */
    XChaCha20Poly1305.bytesToPrivateKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKey, _c;
            var privateKeyBytes = _b.privateKeyBytes;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        privateKey = {
                            k: common_1.Convert.uint8Array(privateKeyBytes).toBase64Url(),
                            kty: 'oct'
                        };
                        // Compute the JWK thumbprint and set as the key ID.
                        _c = privateKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: privateKey })];
                    case 1:
                        // Compute the JWK thumbprint and set as the key ID.
                        _c.kid = _d.sent();
                        return [2 /*return*/, privateKey];
                }
            });
        });
    };
    /**
     * Decrypts the provided data using XChaCha20-Poly1305.
     *
     * @remarks
     * This method performs XChaCha20-Poly1305 decryption on the given encrypted data using the
     * specified key, nonce, and authentication tag. It supports optional additional authenticated
     * data (AAD) for enhanced security. The nonce must be 24 bytes long, consistent with XChaCha20's
     * specifications.
     *
     * @example
     * ```ts
     * const encryptedData = new Uint8Array([...]); // Encrypted data
     * const nonce = new Uint8Array(24); // 24-byte nonce
     * const additionalData = new Uint8Array([...]); // Optional AAD
     * const key = { ... }; // A Jwk object representing the XChaCha20-Poly1305 key
     * const decryptedData = await XChaCha20Poly1305.decrypt({
     *   data: encryptedData,
     *   nonce,
     *   additionalData,
     *   key
     * });
     * ```
     *
     * @param params - The parameters for the decryption operation.
     * @param params.data - The encrypted data to decrypt including the authentication tag,
     *                      represented as a Uint8Array.
     * @param params.key - The key to use for decryption, represented in JWK format.
     * @param params.nonce - The nonce used during the encryption process.
     * @param params.additionalData - Optional additional authenticated data.
     *
     * @returns A Promise that resolves to the decrypted data as a Uint8Array.
     */
    XChaCha20Poly1305.decrypt = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes, xc20p, plaintext;
            var data = _b.data, key = _b.key, nonce = _b.nonce, additionalData = _b.additionalData;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, XChaCha20Poly1305.privateKeyToBytes({ privateKey: key })];
                    case 1:
                        privateKeyBytes = _c.sent();
                        xc20p = (0, chacha_1.xchacha20poly1305)(privateKeyBytes, nonce, additionalData);
                        plaintext = xc20p.decrypt(data);
                        return [2 /*return*/, plaintext];
                }
            });
        });
    };
    /**
     * Encrypts the provided data using XChaCha20-Poly1305.
     *
     * @remarks
     * This method performs XChaCha20-Poly1305 encryption on the given data using the specified key
     * and nonce. It supports optional additional authenticated data (AAD) for enhanced security. The
     * nonce must be 24 bytes long, as per XChaCha20's specifications. The method returns the
     * encrypted data along with an authentication tag as a Uint8Array, ensuring both confidentiality
     * and integrity of the data.
     *
     * @example
     * ```ts
     * const data = new TextEncoder().encode('Messsage');
     * const nonce = utils.randomBytes(24); // 24-byte nonce
     * const additionalData = new TextEncoder().encode('Associated data'); // Optional AAD
     * const key = { ... }; // A Jwk object representing an XChaCha20-Poly1305 key
     * const encryptedData = await XChaCha20Poly1305.encrypt({
     *   data,
     *   nonce,
     *   additionalData,
     *   key
     * });
     * ```
     *
     * @param params - The parameters for the encryption operation.
     * @param params.data - The data to encrypt, represented as a Uint8Array.
     * @param params.key - The key to use for encryption, represented in JWK format.
     * @param params.nonce - A 24-byte nonce for the encryption process.
     * @param params.additionalData - Optional additional authenticated data.
     *
     * @returns A Promise that resolves to a byte array containing the encrypted data and the
     *          authentication tag.
     */
    XChaCha20Poly1305.encrypt = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes, xc20p, ciphertext;
            var data = _b.data, key = _b.key, nonce = _b.nonce, additionalData = _b.additionalData;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, XChaCha20Poly1305.privateKeyToBytes({ privateKey: key })];
                    case 1:
                        privateKeyBytes = _c.sent();
                        xc20p = (0, chacha_1.xchacha20poly1305)(privateKeyBytes, nonce, additionalData);
                        ciphertext = xc20p.encrypt(data);
                        return [2 /*return*/, ciphertext];
                }
            });
        });
    };
    /**
     * Generates a symmetric key for XChaCha20-Poly1305 in JSON Web Key (JWK) format.
     *
     * @remarks
     * This method creates a new symmetric key suitable for use with the XChaCha20-Poly1305 algorithm.
     * The key is generated using cryptographically secure random number generation to ensure its
     * uniqueness and security. The XChaCha20-Poly1305 algorithm requires a 256-bit key (32 bytes),
     * and this method adheres to that specification.
     *
     * Key components included in the JWK:
     * - `kty`: Key Type, set to 'oct' for Octet Sequence.
     * - `k`: The symmetric key component, base64url-encoded.
     * - `kid`: Key ID, generated based on the JWK thumbprint.
     *
     * @example
     * ```ts
     * const privateKey = await XChaCha20Poly1305.generateKey();
     * ```
     *
     * @returns A Promise that resolves to the generated symmetric key in JWK format.
     */
    XChaCha20Poly1305.generateKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var webCrypto, webCryptoKey, _a, alg, ext, key_ops, privateKey, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        webCrypto = (0, webcrypto_1.getWebcryptoSubtle)();
                        return [4 /*yield*/, webCrypto.generateKey({ name: 'AES-CTR', length: 256 }, true, ['encrypt'])];
                    case 1:
                        webCryptoKey = _c.sent();
                        return [4 /*yield*/, webCrypto.exportKey('jwk', webCryptoKey)];
                    case 2:
                        _a = _c.sent(), alg = _a.alg, ext = _a.ext, key_ops = _a.key_ops, privateKey = __rest(_a, ["alg", "ext", "key_ops"]);
                        // Compute the JWK thumbprint and set as the key ID.
                        _b = privateKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: privateKey })];
                    case 3:
                        // Compute the JWK thumbprint and set as the key ID.
                        _b.kid = _c.sent();
                        return [2 /*return*/, privateKey];
                }
            });
        });
    };
    /**
     * Converts a private key from JSON Web Key (JWK) format to a raw byte array (Uint8Array).
     *
     * This method takes a symmetric key in JWK format and extracts its raw byte representation.
     * It decodes the 'k' parameter of the JWK value, which represents the symmetric key in base64url
     * encoding, into a byte array.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // A symmetric key in JWK format
     * const privateKeyBytes = await XChaCha20Poly1305.privateKeyToBytes({ privateKey });
     * ```
     *
     * @param params - The parameters for the symmetric key conversion.
     * @param params.privateKey - The symmetric key in JWK format.
     *
     * @returns A Promise that resolves to the symmetric key as a Uint8Array.
     */
    XChaCha20Poly1305.privateKeyToBytes = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes;
            var privateKey = _b.privateKey;
            return __generator(this, function (_c) {
                // Verify the provided JWK represents a valid oct private key.
                if (!(0, jwk_js_1.isOctPrivateJwk)(privateKey)) {
                    throw new Error("XChaCha20Poly1305: The provided key is not a valid oct private key.");
                }
                privateKeyBytes = common_1.Convert.base64Url(privateKey.k).toUint8Array();
                return [2 /*return*/, privateKeyBytes];
            });
        });
    };
    return XChaCha20Poly1305;
}());
exports.XChaCha20Poly1305 = XChaCha20Poly1305;
//# sourceMappingURL=xchacha20-poly1305.js.map