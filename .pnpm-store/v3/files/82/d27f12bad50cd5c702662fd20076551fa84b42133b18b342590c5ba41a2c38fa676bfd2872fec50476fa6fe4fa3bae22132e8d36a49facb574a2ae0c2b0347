"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AesGcm = exports.AES_GCM_TAG_LENGTHS = void 0;
var common_1 = require("@web5/common");
var webcrypto_1 = require("@noble/ciphers/webcrypto");
var jwk_js_1 = require("../jose/jwk.js");
/**
 * Const defining the AES-GCM initialization vector (IV) length in bits.
 *
 * @remarks
 * NIST Special Publication 800-38D, Section 5.2.1.1 states that the IV length:
 * > For IVs, it is recommended that implementations restrict support to the length of 96 bits, to
 * > promote interoperability, efficiency, and simplicity of design.
 *
 * This implementation does not support IV lengths that are different from the value defined by
 * this constant.
 *
 * @see {@link https://doi.org/10.6028/NIST.SP.800-38D | NIST SP 800-38D}
 */
var AES_GCM_IV_LENGTH = 96;
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
 * Constant defining the AES-GCM tag length values in bits.
 *
 * @remarks
 * NIST Special Publication 800-38D, Section 5.2.1.2 states that the tag length:
 * > may be any one of the following five values: 128, 120, 112, 104, or 96
 *
 * Although the NIST specification allows for tag lengths of 32 or 64 bits in certain applications,
 * the use of shorter tag lengths can be problematic for GCM due to targeted forgery attacks. As a
 * precaution, this implementation does not support tag lengths that are different from the five
 * values defined by this constant. See Appendix C of the NIST SP 800-38D specification for
 * additional guidance and details.
 *
 * @see {@link https://doi.org/10.6028/NIST.SP.800-38D | NIST SP 800-38D}
 */
exports.AES_GCM_TAG_LENGTHS = [96, 104, 112, 120, 128];
/**
 * The `AesGcm` class provides a comprehensive set of utilities for cryptographic operations
 * using the Advanced Encryption Standard (AES) in Galois/Counter Mode (GCM). This class includes
 * methods for key generation, encryption, decryption, and conversions between raw byte arrays
 * and JSON Web Key (JWK) formats. It is designed to support AES-GCM, a symmetric key algorithm
 * that is widely used for its efficiency, security, and provision of authenticated encryption.
 *
 * AES-GCM is particularly favored for scenarios that require both confidentiality and integrity
 * of data. It integrates the counter mode of encryption with the Galois mode of authentication,
 * offering high performance and parallel processing capabilities.
 *
 * Key Features:
 * - Key Generation: Generate AES symmetric keys in JWK format.
 * - Key Conversion: Transform keys between raw byte arrays and JWK formats.
 * - Encryption: Encrypt data using AES-GCM with the provided symmetric key.
 * - Decryption: Decrypt data encrypted with AES-GCM using the corresponding symmetric key.
 *
 * The methods in this class are asynchronous, returning Promises to accommodate various
 * JavaScript environments.
 *
 * @example
 * ```ts
 * // Key Generation
 * const length = 256; // Length of the key in bits (e.g., 128, 192, 256)
 * const privateKey = await AesGcm.generateKey({ length });
 *
 * // Encryption
 * const data = new TextEncoder().encode('Messsage');
 * const iv = new Uint8Array(12); // 12-byte initialization vector
 * const encryptedData = await AesGcm.encrypt({
 *   data,
 *   iv,
 *   key: privateKey
 * });
 *
 * // Decryption
 * const decryptedData = await AesGcm.decrypt({
 *   data: encryptedData,
 *   iv,
 *   key: privateKey
 * });
 *
 * // Key Conversion
 * const privateKeyBytes = await AesGcm.privateKeyToBytes({ privateKey });
 * ```
 */
var AesGcm = /** @class */ (function () {
    function AesGcm() {
    }
    /**
   * Converts a raw private key in bytes to its corresponding JSON Web Key (JWK) format.
   *
   * @remarks
   * This method accepts a symmetric key represented as a byte array (Uint8Array) and
   * converts it into a JWK object for use with AES-GCM (Advanced Encryption Standard -
   * Galois/Counter Mode). The conversion process involves encoding the key into
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
   * const privateKey = await AesGcm.bytesToPrivateKey({ privateKeyBytes });
   * ```
   *
   * @param params - The parameters for the symmetric key conversion.
   * @param params.privateKeyBytes - The raw symmetric key as a Uint8Array.
   *
   * @returns A Promise that resolves to the symmetric key in JWK format.
   */
    AesGcm.bytesToPrivateKey = function (_a) {
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
     * Decrypts the provided data using AES-GCM.
     *
     * @remarks
     * This method performs AES-GCM decryption on the given encrypted data using the specified key.
     * It requires an initialization vector (IV), the encrypted data along with the decryption key,
     * and optionally, additional authenticated data (AAD). The method returns the decrypted data as a
     * Uint8Array. The optional `tagLength` parameter specifies the size in bits of the authentication
     * tag used when encrypting the data. If not specified, the default tag length of 128 bits is
     * used.
     *
     * @example
     * ```ts
     * const encryptedData = new Uint8Array([...]); // Encrypted data
     * const iv = new Uint8Array([...]); // Initialization vector used during encryption
     * const additionalData = new Uint8Array([...]); // Optional additional authenticated data
     * const key = { ... }; // A Jwk object representing the AES key
     * const decryptedData = await AesGcm.decrypt({
     *   data: encryptedData,
     *   iv,
     *   additionalData,
     *   key,
     *   tagLength: 128 // Optional tag length in bits
     * });
     * ```
     *
     * @param params - The parameters for the decryption operation.
     * @param params.key - The key to use for decryption, represented in JWK format.
     * @param params.data - The encrypted data to decrypt, represented as a Uint8Array.
     * @param params.iv - The initialization vector, represented as a Uint8Array.
     * @param params.additionalData - Optional additional authenticated data. Optional.
     * @param params.tagLength - The length of the authentication tag in bits. Optional.
     *
     * @returns A Promise that resolves to the decrypted data as a Uint8Array.
     */
    AesGcm.decrypt = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var webCrypto, webCryptoKey, algorithm, plaintextBuffer, plaintext;
            var key = _b.key, data = _b.data, iv = _b.iv, additionalData = _b.additionalData, tagLength = _b.tagLength;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Validate the initialization vector length.
                        if (iv.byteLength !== AES_GCM_IV_LENGTH / 8) {
                            throw new TypeError("The initialization vector must be ".concat(AES_GCM_IV_LENGTH, " bits in length"));
                        }
                        // Validate the tag length.
                        if (tagLength && !exports.AES_GCM_TAG_LENGTHS.includes(tagLength)) {
                            throw new RangeError("The tag length is invalid: Must be ".concat(exports.AES_GCM_TAG_LENGTHS.join(', '), " bits"));
                        }
                        webCrypto = (0, webcrypto_1.getWebcryptoSubtle)();
                        return [4 /*yield*/, webCrypto.importKey('jwk', key, { name: 'AES-GCM' }, true, ['decrypt'])];
                    case 1:
                        webCryptoKey = _c.sent();
                        algorithm = __assign(__assign({ name: 'AES-GCM', iv: iv }, (tagLength && { tagLength: tagLength })), (additionalData && { additionalData: additionalData }));
                        return [4 /*yield*/, webCrypto.decrypt(algorithm, webCryptoKey, data)];
                    case 2:
                        plaintextBuffer = _c.sent();
                        plaintext = new Uint8Array(plaintextBuffer);
                        return [2 /*return*/, plaintext];
                }
            });
        });
    };
    /**
     * Encrypts the provided data using AES-GCM.
     *
     * @remarks
     * This method performs AES-GCM encryption on the given data using the specified key.
     * It requires an initialization vector (IV), the encrypted data along with the decryption key,
     * and optionally, additional authenticated data (AAD). The method returns the encrypted data as a
     * Uint8Array. The optional `tagLength` parameter specifies the size in bits of the authentication
     * tag generated in the encryption operation and used for authentication in the corresponding
     * decryption. If not specified, the default tag length of 128 bits is used.
     *
     * @example
     * ```ts
     * const data = new TextEncoder().encode('Messsage');
     * const iv = new Uint8Array([...]); // Initialization vector
     * const additionalData = new Uint8Array([...]); // Optional additional authenticated data
     * const key = { ... }; // A Jwk object representing an AES key
     * const encryptedData = await AesGcm.encrypt({
     *   data,
     *   iv,
     *   additionalData,
     *   key,
     *   tagLength: 128 // Optional tag length in bits
     * });
     * ```
     *
     * @param params - The parameters for the encryption operation.
     * @param params.key - The key to use for encryption, represented in JWK format.
     * @param params.data - The data to encrypt, represented as a Uint8Array.
     * @param params.iv - The initialization vector, represented as a Uint8Array.
     * @param params.additionalData - Optional additional authenticated data. Optional.
     * @param params.tagLength - The length of the authentication tag in bits. Optional.
     *
     * @returns A Promise that resolves to the encrypted data as a Uint8Array.
     */
    AesGcm.encrypt = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var webCrypto, webCryptoKey, algorithm, ciphertextBuffer, ciphertext;
            var data = _b.data, iv = _b.iv, key = _b.key, additionalData = _b.additionalData, tagLength = _b.tagLength;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Validate the initialization vector length.
                        if (iv.byteLength !== AES_GCM_IV_LENGTH / 8) {
                            throw new TypeError("The initialization vector must be ".concat(AES_GCM_IV_LENGTH, " bits in length"));
                        }
                        // Validate the tag length.
                        if (tagLength && !exports.AES_GCM_TAG_LENGTHS.includes(tagLength)) {
                            throw new RangeError("The tag length is invalid: Must be ".concat(exports.AES_GCM_TAG_LENGTHS.join(', '), " bits"));
                        }
                        webCrypto = (0, webcrypto_1.getWebcryptoSubtle)();
                        return [4 /*yield*/, webCrypto.importKey('jwk', key, { name: 'AES-GCM' }, true, ['encrypt'])];
                    case 1:
                        webCryptoKey = _c.sent();
                        algorithm = __assign(__assign({ name: 'AES-GCM', iv: iv }, (tagLength && { tagLength: tagLength })), (additionalData && { additionalData: additionalData }));
                        return [4 /*yield*/, webCrypto.encrypt(algorithm, webCryptoKey, data)];
                    case 2:
                        ciphertextBuffer = _c.sent();
                        ciphertext = new Uint8Array(ciphertextBuffer);
                        return [2 /*return*/, ciphertext];
                }
            });
        });
    };
    /**
     * Generates a symmetric key for AES in Galois/Counter Mode (GCM) in JSON Web Key (JWK) format.
     *
     * @remarks
     * This method creates a new symmetric key of a specified length suitable for use with
     * AES-GCM encryption. It leverages cryptographically secure random number generation
     * to ensure the uniqueness and security of the key. The generated key adheres to the JWK
     * format, facilitating compatibility with common cryptographic standards and ease of use
     * in various cryptographic applications.
     *
     * The generated key includes these components:
     * - `kty`: Key Type, set to 'oct' for Octet Sequence, indicating a symmetric key.
     * - `k`: The symmetric key component, base64url-encoded.
     * - `kid`: Key ID, generated based on the JWK thumbprint, providing a unique identifier.
     *
     * @example
     * ```ts
     * const length = 256; // Length of the key in bits (e.g., 128, 192, 256)
     * const privateKey = await AesGcm.generateKey({ length });
     * ```
     *
     * @param params - The parameters for the key generation.
     * @param params.length - The length of the key in bits. Common lengths are 128, 192, and 256 bits.
     *
     * @returns A Promise that resolves to the generated symmetric key in JWK format.
     */
    AesGcm.generateKey = function (_a) {
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
                        webCrypto = (0, webcrypto_1.getWebcryptoSubtle)();
                        return [4 /*yield*/, webCrypto.generateKey({ name: 'AES-GCM', length: length }, true, ['encrypt'])];
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
     * It focuses on the 'k' parameter of the JWK, which represents the symmetric key component
     * in base64url encoding. The method decodes this value into a byte array, providing
     * the symmetric key in its raw binary form.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // A symmetric key in JWK format
     * const privateKeyBytes = await AesGcm.privateKeyToBytes({ privateKey });
     * ```
     *
     * @param params - The parameters for the symmetric key conversion.
     * @param params.privateKey - The symmetric key in JWK format.
     *
     * @returns A Promise that resolves to the symmetric key as a Uint8Array.
     */
    AesGcm.privateKeyToBytes = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes;
            var privateKey = _b.privateKey;
            return __generator(this, function (_c) {
                // Verify the provided JWK represents a valid oct private key.
                if (!(0, jwk_js_1.isOctPrivateJwk)(privateKey)) {
                    throw new Error("AesGcm: The provided key is not a valid oct private key.");
                }
                privateKeyBytes = common_1.Convert.base64Url(privateKey.k).toUint8Array();
                return [2 /*return*/, privateKeyBytes];
            });
        });
    };
    return AesGcm;
}());
exports.AesGcm = AesGcm;
//# sourceMappingURL=aes-gcm.js.map