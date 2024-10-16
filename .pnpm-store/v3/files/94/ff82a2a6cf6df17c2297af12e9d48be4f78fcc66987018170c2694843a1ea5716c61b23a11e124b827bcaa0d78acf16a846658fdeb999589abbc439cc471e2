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
exports.AesCtr = void 0;
var common_1 = require("@web5/common");
var crypto_1 = require("@noble/ciphers/crypto");
var jwk_js_1 = require("../jose/jwk.js");
/**
 * Constant defining the AES block size in bits.
 *
 * @remarks
 * In AES Counter (CTR) mode, the counter length must match the block size of the AES algorithm,
 * which is 128 bits. NIST publication 800-38A, which provides guidelines for block cipher modes of
 * operation, specifies this requirement. Maintaining a counter length of 128 bits is essential for
 * the correct operation and security of AES-CTR.
 *
 * This implementation does not support counter lengths that are different from the value defined by
 * this constant.
 *
 * @see {@link https://doi.org/10.6028/NIST.SP.800-38A | NIST SP 800-38A}
 */
var AES_BLOCK_SIZE = 128;
/**
 * Constant defining the AES key length values in bits.
 *
 * @remarks
 * NIST publication FIPS 197 states:
 * > The AES algorithm is capable of using cryptographic keys of 128, 192, and 256 bits to encrypt
 * > and decrypt data in blocks of 128 bits.
 *
 * This implementation does not support key lengths that are different from the three values
 * defined by this constant.
 *
 * @see {@link https://doi.org/10.6028/NIST.FIPS.197-upd1 | NIST FIPS 197}
 */
var AES_KEY_LENGTHS = [128, 192, 256];
/**
 * Constant defining the maximum length of the counter in bits.
 *
 * @remarks
 * The rightmost bits of the counter block are used as the actual counter value, while the leftmost
 * bits are used as the nonce. The maximum length of the counter is 128 bits, which is the same as
 * the AES block size.
 */
var COUNTER_MAX_LENGTH = AES_BLOCK_SIZE;
/**
 * The `AesCtr` class provides a comprehensive set of utilities for cryptographic operations
 * using the Advanced Encryption Standard (AES) in Counter (CTR) mode. This class includes
 * methods for key generation, encryption, decryption, and conversions between raw byte arrays
 * and JSON Web Key (JWK) formats. It is designed to support AES-CTR, a symmetric key algorithm
 * that is widely used in various cryptographic applications for its efficiency and security.
 *
 * AES-CTR mode operates as a stream cipher using a block cipher (AES) and is well-suited for
 * scenarios where parallel processing is beneficial or where the same key is required to
 * encrypt multiple data blocks. The class adheres to standard cryptographic practices, ensuring
 * compatibility and security in its implementations.
 *
 * Key Features:
 * - Key Generation: Generate AES symmetric keys in JWK format.
 * - Key Conversion: Transform keys between raw byte arrays and JWK formats.
 * - Encryption: Encrypt data using AES-CTR with the provided symmetric key.
 * - Decryption: Decrypt data encrypted with AES-CTR using the corresponding symmetric key.
 *
 * The methods in this class are asynchronous, returning Promises to accommodate various
 * JavaScript environments.
 *
 * @example
 * ```ts
 * // Key Generation
 * const length = 256; // Length of the key in bits (e.g., 128, 192, 256)
 * const privateKey = await AesCtr.generateKey({ length });
 *
 * // Encryption
 * const data = new TextEncoder().encode('Messsage');
 * const counter = new Uint8Array(16); // 16-byte (128-bit) counter block
 * const encryptedData = await AesCtr.encrypt({
 *   data,
 *   counter,
 *   key: privateKey,
 *   length: 64 // Length of the counter in bits
 * });
 *
 * // Decryption
 * const decryptedData = await AesCtr.decrypt({
 *   data: encryptedData,
 *   counter,
 *   key: privateKey,
 *   length: 64 // Length of the counter in bits
 * });
 *
 * // Key Conversion
 * const privateKeyBytes = await AesCtr.privateKeyToBytes({ privateKey });
 * ```
 */
var AesCtr = /** @class */ (function () {
    function AesCtr() {
    }
    /**
     * Converts a raw private key in bytes to its corresponding JSON Web Key (JWK) format.
     *
     * @remarks
     * This method takes a symmetric key represented as a byte array (Uint8Array) and
     * converts it into a JWK object for use with AES (Advanced Encryption Standard)
     * in Counter (CTR) mode. The conversion process involves encoding the key into
     * base64url format and setting the appropriate JWK parameters.
     *
     * The resulting JWK object includes the following properties:
     * - `kty`: Key Type, set to 'oct' for Octet Sequence (representing a symmetric key).
     * - `k`: The symmetric key, base64url-encoded.
     * - `kid`: Key ID, generated based on the JWK thumbprint.
     *
     * @example
     * ```ts
     * const privateKeyBytes = new Uint8Array([...]); // Replace with actual symmetric key bytes
     * const privateKey = await AesCtr.bytesToPrivateKey({ privateKeyBytes });
     * ```
     *
     * @param params - The parameters for the symmetric key conversion.
     * @param params.privateKeyBytes - The raw symmetric key as a Uint8Array.
     *
     * @returns A Promise that resolves to the symmetric key in JWK format.
     */
    AesCtr.bytesToPrivateKey = function (_a) {
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
     * Decrypts the provided data using AES in Counter (CTR) mode.
     *
     * @remarks
     * This method performs AES-CTR decryption on the given encrypted data using the specified key.
     * Similar to the encryption process, it requires an initial counter block and the length
     * of the counter block, along with the encrypted data and the decryption key. The method
     * returns the decrypted data as a Uint8Array.
     *
     * @example
     * ```ts
     * const encryptedData = new Uint8Array([...]); // Encrypted data
     * const counter = new Uint8Array(16); // 16-byte (128-bit) counter block used during encryption
     * const key = { ... }; // A Jwk object representing the same AES key used for encryption
     * const decryptedData = await AesCtr.decrypt({
     *   data: encryptedData,
     *   counter,
     *   key,
     *   length: 64 // Length of the counter in bits
     * });
     * ```
     *
     * @param params - The parameters for the decryption operation.
     * @param params.key - The key to use for decryption, represented in JWK format.
     * @param params.data - The encrypted data to decrypt, as a Uint8Array.
     * @param params.counter - The initial value of the counter block.
     * @param params.length - The number of bits in the counter block that are used for the actual counter.
     *
     * @returns A Promise that resolves to the decrypted data as a Uint8Array.
     */
    AesCtr.decrypt = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var webCrypto, webCryptoKey, plaintextBuffer, plaintext;
            var key = _b.key, data = _b.data, counter = _b.counter, length = _b.length;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Validate the initial counter block length matches the AES block size.
                        if (counter.byteLength !== AES_BLOCK_SIZE / 8) {
                            throw new TypeError("The counter must be ".concat(AES_BLOCK_SIZE, " bits in length"));
                        }
                        // Validate the length of the counter.
                        if (length === 0 || length > COUNTER_MAX_LENGTH) {
                            throw new TypeError("The 'length' property must be in the range 1 to ".concat(COUNTER_MAX_LENGTH));
                        }
                        webCrypto = (0, crypto_1.getWebcryptoSubtle)();
                        return [4 /*yield*/, webCrypto.importKey('jwk', key, { name: 'AES-CTR' }, true, ['decrypt'])];
                    case 1:
                        webCryptoKey = _c.sent();
                        return [4 /*yield*/, webCrypto.decrypt({ name: 'AES-CTR', counter: counter, length: length }, webCryptoKey, data)];
                    case 2:
                        plaintextBuffer = _c.sent();
                        plaintext = new Uint8Array(plaintextBuffer);
                        return [2 /*return*/, plaintext];
                }
            });
        });
    };
    /**
     * Encrypts the provided data using AES in Counter (CTR) mode.
     *
     * @remarks
     * This method performs AES-CTR encryption on the given data using the specified key.
     * It requires the initial counter block and the length of the counter block, alongside
     * the data and key. The method is designed to work asynchronously and returns the
     * encrypted data as a Uint8Array.
     *
     * @example
     * ```ts
     * const data = new TextEncoder().encode('Messsage');
     * const counter = new Uint8Array(16); // 16-byte (128-bit) counter block
     * const key = { ... }; // A Jwk object representing an AES key
     * const encryptedData = await AesCtr.encrypt({
     *   data,
     *   counter,
     *   key,
     *   length: 64 // Length of the counter in bits
     * });
     * ```
     *
     * @param params - The parameters for the encryption operation.
     * @param params.key - The key to use for encryption, represented in JWK format.
     * @param params.data - The data to encrypt, represented as a Uint8Array.
     * @param params.counter - The initial value of the counter block.
     * @param params.length - The number of bits in the counter block that are used for the actual counter.
     *
     * @returns A Promise that resolves to the encrypted data as a Uint8Array.
     */
    AesCtr.encrypt = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var webCrypto, webCryptoKey, ciphertextBuffer, ciphertext;
            var key = _b.key, data = _b.data, counter = _b.counter, length = _b.length;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Validate the initial counter block value length.
                        if (counter.byteLength !== AES_BLOCK_SIZE / 8) {
                            throw new TypeError("The counter must be ".concat(AES_BLOCK_SIZE, " bits in length"));
                        }
                        // Validate the length of the counter.
                        if (length === 0 || length > COUNTER_MAX_LENGTH) {
                            throw new TypeError("The 'length' property must be in the range 1 to ".concat(COUNTER_MAX_LENGTH));
                        }
                        webCrypto = (0, crypto_1.getWebcryptoSubtle)();
                        return [4 /*yield*/, webCrypto.importKey('jwk', key, { name: 'AES-CTR' }, true, ['encrypt', 'decrypt'])];
                    case 1:
                        webCryptoKey = _c.sent();
                        return [4 /*yield*/, webCrypto.encrypt({ name: 'AES-CTR', counter: counter, length: length }, webCryptoKey, data)];
                    case 2:
                        ciphertextBuffer = _c.sent();
                        ciphertext = new Uint8Array(ciphertextBuffer);
                        return [2 /*return*/, ciphertext];
                }
            });
        });
    };
    /**
     * Generates a symmetric key for AES in Counter (CTR) mode in JSON Web Key (JWK) format.
     *
     * @remarks
     * This method creates a new symmetric key of a specified length suitable for use with
     * AES-CTR encryption. It uses cryptographically secure random number generation to
     * ensure the uniqueness and security of the key. The generated key adheres to the JWK
     * format, making it compatible with common cryptographic standards and easy to use in
     * various cryptographic processes.
     *
     * The generated key includes the following components:
     * - `kty`: Key Type, set to 'oct' for Octet Sequence.
     * - `k`: The symmetric key component, base64url-encoded.
     * - `kid`: Key ID, generated based on the JWK thumbprint.
     *
     * @example
     * ```ts
     * const length = 256; // Length of the key in bits (e.g., 128, 192, 256)
     * const privateKey = await AesCtr.generateKey({ length });
     * ```
     *
     * @param params - The parameters for the key generation.
     * @param params.length - The length of the key in bits. Common lengths are 128, 192, and 256 bits.
     *
     * @returns A Promise that resolves to the generated symmetric key in JWK format.
     */
    AesCtr.generateKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var webCrypto, webCryptoKey, _c, ext, key_ops, privateKey, _d;
            var length = _b.length;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // Validate the key length.
                        if (!AES_KEY_LENGTHS.includes(length)) {
                            throw new RangeError("The key length is invalid: Must be ".concat(AES_KEY_LENGTHS.join(', '), " bits"));
                        }
                        webCrypto = (0, crypto_1.getWebcryptoSubtle)();
                        return [4 /*yield*/, webCrypto.generateKey({ name: 'AES-CTR', length: length }, true, ['encrypt'])];
                    case 1:
                        webCryptoKey = _e.sent();
                        return [4 /*yield*/, webCrypto.exportKey('jwk', webCryptoKey)];
                    case 2:
                        _c = _e.sent(), ext = _c.ext, key_ops = _c.key_ops, privateKey = __rest(_c, ["ext", "key_ops"]);
                        // Compute the JWK thumbprint and set as the key ID.
                        _d = privateKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: privateKey })];
                    case 3:
                        // Compute the JWK thumbprint and set as the key ID.
                        _d.kid = _e.sent();
                        return [2 /*return*/, privateKey];
                }
            });
        });
    };
    /**
     * Converts a private key from JSON Web Key (JWK) format to a raw byte array (Uint8Array).
     *
     * @remarks
     * This method takes a symmetric key in JWK format and extracts its raw byte representation.
     * It decodes the 'k' parameter of the JWK value, which represents the symmetric key in base64url
     * encoding, into a byte array.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // A symmetric key in JWK format
     * const privateKeyBytes = await AesCtr.privateKeyToBytes({ privateKey });
     * ```
     *
     * @param params - The parameters for the symmetric key conversion.
     * @param params.privateKey - The symmetric key in JWK format.
     *
     * @returns A Promise that resolves to the symmetric key as a Uint8Array.
     */
    AesCtr.privateKeyToBytes = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes;
            var privateKey = _b.privateKey;
            return __generator(this, function (_c) {
                // Verify the provided JWK represents a valid oct private key.
                if (!(0, jwk_js_1.isOctPrivateJwk)(privateKey)) {
                    throw new Error("AesCtr: The provided key is not a valid oct private key.");
                }
                privateKeyBytes = common_1.Convert.base64Url(privateKey.k).toUint8Array();
                return [2 /*return*/, privateKeyBytes];
            });
        });
    };
    return AesCtr;
}());
exports.AesCtr = AesCtr;
//# sourceMappingURL=aes-ctr.js.map