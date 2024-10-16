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
exports.Ed25519 = void 0;
var common_1 = require("@web5/common");
var ed25519_1 = require("@noble/curves/ed25519");
var jwk_js_1 = require("../jose/jwk.js");
/**
 * The `Ed25519` class provides a comprehensive suite of utilities for working with the Ed25519
 * elliptic curve, widely used in modern cryptographic applications. This class includes methods for
 * key generation, conversion, signing, verification, and public key derivation.
 *
 * The class supports conversions between raw byte formats and JSON Web Key (JWK) formats. It
 * follows the guidelines and specifications outlined in RFC8032 for EdDSA (Edwards-curve Digital
 * Signature Algorithm) operations.
 *
 * Key Features:
 * - Key Generation: Generate Ed25519 private keys in JWK format.
 * - Key Conversion: Transform keys between raw byte arrays and JWK formats.
 * - Public Key Derivation: Derive public keys from private keys.
 * - Signing and Verification: Sign data and verify signatures with Ed25519 keys.
 * - Key Validation: Validate the mathematical correctness of Ed25519 keys.
 *
 * The methods in this class are asynchronous, returning Promises to accommodate various
 * JavaScript environments, and use `Uint8Array` for binary data handling.
 *
 * @example
 * ```ts
 * // Key Generation
 * const privateKey = await Ed25519.generateKey();
 *
 * // Public Key Derivation
 * const publicKey = await Ed25519.computePublicKey({ key: privateKey });
 * console.log(publicKey === await Ed25519.getPublicKey({ key: privateKey })); // Output: true
 *
 * // EdDSA Signing
 * const signature = await Ed25519.sign({
 *   key: privateKey,
 *   data: new TextEncoder().encode('Message')
 * });
 *
 * // EdDSA Signature Verification
 * const isValid = await Ed25519.verify({
 *   key: publicKey,
 *   signature: signature,
 *   data: new TextEncoder().encode('Message')
 * });
 *
 * // Key Conversion
 * const privateKeyBytes = await Ed25519.privateKeyToBytes({ privateKey });
 * const publicKeyBytes = await Ed25519.publicKeyToBytes({ publicKey });
 *
 * // Key Validation
 * const isPublicKeyValid = await Ed25519.validatePublicKey({ publicKeyBytes });
 * ```
 */
var Ed25519 = /** @class */ (function () {
    function Ed25519() {
    }
    /**
     * Converts a raw private key in bytes to its corresponding JSON Web Key (JWK) format.
     *
     * @remarks
     * This method accepts a private key as a byte array (Uint8Array) for the Curve25519 curve in
     * Twisted Edwards form and transforms it into a JWK object. The process involves first deriving
     * the public key from the private key, then encoding both the private and public keys into
     * base64url format.
     *
     * The resulting JWK object includes the following properties:
     * - `kty`: Key Type, set to 'OKP' for Octet Key Pair.
     * - `crv`: Curve Name, set to 'Ed25519'.
     * - `d`: The private key component, base64url-encoded.
     * - `x`: The computed public key, base64url-encoded.
     *
     * @example
     * ```ts
     * const privateKeyBytes = new Uint8Array([...]); // Replace with actual private key bytes
     * const privateKey = await Ed25519.bytesToPrivateKey({ privateKeyBytes });
     * ```
     *
     * @param params - The parameters for the private key conversion.
     * @param params.privateKeyBytes - The raw private key as a Uint8Array.
     *
     * @returns A Promise that resolves to the private key in JWK format.
     */
    Ed25519.bytesToPrivateKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var publicKeyBytes, privateKey, _c;
            var privateKeyBytes = _b.privateKeyBytes;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        publicKeyBytes = ed25519_1.ed25519.getPublicKey(privateKeyBytes);
                        privateKey = {
                            crv: 'Ed25519',
                            d: common_1.Convert.uint8Array(privateKeyBytes).toBase64Url(),
                            kty: 'OKP',
                            x: common_1.Convert.uint8Array(publicKeyBytes).toBase64Url(),
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
     * Converts a raw private key in bytes to its corresponding JSON Web Key (JWK) format.
     *
     * @remarks
     * This method accepts a public key as a byte array (Uint8Array) for the Curve25519 curve in
     * Twisted Edwards form and transforms it into a JWK object. The process involves encoding the
     * public key bytes into base64url format.
     *
     * The resulting JWK object includes the following properties:
     * - `kty`: Key Type, set to 'OKP' for Octet Key Pair.
     * - `crv`: Curve Name, set to 'X25519'.
     * - `x`: The public key, base64url-encoded.
     *
     * @example
     * ```ts
     * const publicKeyBytes = new Uint8Array([...]); // Replace with actual public key bytes
     * const publicKey = await X25519.bytesToPublicKey({ publicKeyBytes });
     * ```
     *
     * @param params - The parameters for the public key conversion.
     * @param params.publicKeyBytes - The raw public key as a `Uint8Array`.
     *
     * @returns A Promise that resolves to the public key in JWK format.
     */
    Ed25519.bytesToPublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var publicKey, _c;
            var publicKeyBytes = _b.publicKeyBytes;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        publicKey = {
                            kty: 'OKP',
                            crv: 'Ed25519',
                            x: common_1.Convert.uint8Array(publicKeyBytes).toBase64Url(),
                        };
                        // Compute the JWK thumbprint and set as the key ID.
                        _c = publicKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: publicKey })];
                    case 1:
                        // Compute the JWK thumbprint and set as the key ID.
                        _c.kid = _d.sent();
                        return [2 /*return*/, publicKey];
                }
            });
        });
    };
    /**
     * Derives the public key in JWK format from a given Ed25519 private key.
     *
     * @remarks
     * This method takes a private key in JWK format and derives its corresponding public key,
     * also in JWK format.  The derivation process involves converting the private key to a
     * raw byte array and then computing the corresponding public key on the Curve25519 curve in
     * Twisted Edwards form. The public key is then encoded into base64url format to construct
     * a JWK representation.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // A Jwk object representing an Ed25519 private key
     * const publicKey = await Ed25519.computePublicKey({ key: privateKey });
     * ```
     *
     * @param params - The parameters for the public key derivation.
     * @param params.key - The private key in JWK format from which to derive the public key.
     *
     * @returns A Promise that resolves to the computed public key in JWK format.
     */
    Ed25519.computePublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes, publicKeyBytes, publicKey, _c;
            var key = _b.key;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, Ed25519.privateKeyToBytes({ privateKey: key })];
                    case 1:
                        privateKeyBytes = _d.sent();
                        publicKeyBytes = ed25519_1.ed25519.getPublicKey(privateKeyBytes);
                        publicKey = {
                            kty: 'OKP',
                            crv: 'Ed25519',
                            x: common_1.Convert.uint8Array(publicKeyBytes).toBase64Url()
                        };
                        // Compute the JWK thumbprint and set as the key ID.
                        _c = publicKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: publicKey })];
                    case 2:
                        // Compute the JWK thumbprint and set as the key ID.
                        _c.kid = _d.sent();
                        return [2 /*return*/, publicKey];
                }
            });
        });
    };
    /**
     * Converts an Ed25519 private key to its X25519 counterpart.
     *
     * @remarks
     * This method enables the use of the same key pair for both digital signature (Ed25519)
     * and key exchange (X25519) operations. It takes an Ed25519 private key and converts it
     * to the corresponding X25519 format, facilitating interoperability between signing
     * and encryption protocols.
     *
     * @example
     * ```ts
     * const ed25519PrivateKey = { ... }; // An Ed25519 private key in JWK format
     * const x25519PrivateKey = await Ed25519.convertPrivateKeyToX25519({
     *   privateKey: ed25519PrivateKey
     * });
     * ```
     *
     * @param params - The parameters for the private key conversion.
     * @param params.privateKey - The Ed25519 private key to convert, in JWK format.
     *
     * @returns A Promise that resolves to the X25519 private key in JWK format.
     */
    Ed25519.convertPrivateKeyToX25519 = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var ed25519PrivateKeyBytes, x25519PrivateKeyBytes, x25519PublicKeyBytes, x25519PrivateKey, _c;
            var privateKey = _b.privateKey;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, Ed25519.privateKeyToBytes({ privateKey: privateKey })];
                    case 1:
                        ed25519PrivateKeyBytes = _d.sent();
                        x25519PrivateKeyBytes = (0, ed25519_1.edwardsToMontgomeryPriv)(ed25519PrivateKeyBytes);
                        x25519PublicKeyBytes = ed25519_1.x25519.getPublicKey(x25519PrivateKeyBytes);
                        x25519PrivateKey = {
                            kty: 'OKP',
                            crv: 'X25519',
                            d: common_1.Convert.uint8Array(x25519PrivateKeyBytes).toBase64Url(),
                            x: common_1.Convert.uint8Array(x25519PublicKeyBytes).toBase64Url(),
                        };
                        // Compute the JWK thumbprint and set as the key ID.
                        _c = x25519PrivateKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: x25519PrivateKey })];
                    case 2:
                        // Compute the JWK thumbprint and set as the key ID.
                        _c.kid = _d.sent();
                        return [2 /*return*/, x25519PrivateKey];
                }
            });
        });
    };
    /**
     * Converts an Ed25519 public key to its X25519 counterpart.
     *
     * @remarks
     * This method enables the use of the same key pair for both digital signature (Ed25519)
     * and key exchange (X25519) operations. It takes an Ed25519 public key and converts it
     * to the corresponding X25519 format, facilitating interoperability between signing
     * and encryption protocols.
     *
     * @example
     * ```ts
     * const ed25519PublicKey = { ... }; // An Ed25519 public key in JWK format
     * const x25519PublicKey = await Ed25519.convertPublicKeyToX25519({
     *   publicKey: ed25519PublicKey
     * });
     * ```
     *
     * @param params - The parameters for the public key conversion.
     * @param params.publicKey - The Ed25519 public key to convert, in JWK format.
     *
     * @returns A Promise that resolves to the X25519 public key in JWK format.
     */
    Ed25519.convertPublicKeyToX25519 = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var ed25519PublicKeyBytes, isValid, x25519PublicKeyBytes, x25519PublicKey, _c;
            var publicKey = _b.publicKey;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, Ed25519.publicKeyToBytes({ publicKey: publicKey })];
                    case 1:
                        ed25519PublicKeyBytes = _d.sent();
                        return [4 /*yield*/, Ed25519.validatePublicKey({ publicKeyBytes: ed25519PublicKeyBytes })];
                    case 2:
                        isValid = _d.sent();
                        if (!isValid) {
                            throw new Error('Ed25519: Invalid public key.');
                        }
                        x25519PublicKeyBytes = (0, ed25519_1.edwardsToMontgomeryPub)(ed25519PublicKeyBytes);
                        x25519PublicKey = {
                            kty: 'OKP',
                            crv: 'X25519',
                            x: common_1.Convert.uint8Array(x25519PublicKeyBytes).toBase64Url(),
                        };
                        // Compute the JWK thumbprint and set as the key ID.
                        _c = x25519PublicKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: x25519PublicKey })];
                    case 3:
                        // Compute the JWK thumbprint and set as the key ID.
                        _c.kid = _d.sent();
                        return [2 /*return*/, x25519PublicKey];
                }
            });
        });
    };
    /**
     * Generates an Ed25519 private key in JSON Web Key (JWK) format.
     *
     * @remarks
     * This method creates a new private key suitable for use with the Curve25519 elliptic curve in
     * Twisted Edwards form. The key generation process involves using cryptographically secure
     * random number generation to ensure the uniqueness and security of the key. The resulting
     * private key adheres to the JWK format making it compatible with common cryptographic
     * standards and easy to use in various cryptographic processes.
     *
     * The generated private key in JWK format includes the following components:
     * - `kty`: Key Type, set to 'OKP' for Octet Key Pair.
     * - `crv`: Curve Name, set to 'Ed25519'.
     * - `d`: The private key component, base64url-encoded.
     * - `x`: The derived public key, base64url-encoded.
     *
     * @example
     * ```ts
     * const privateKey = await Ed25519.generateKey();
     * ```
     *
     * @returns A Promise that resolves to the generated private key in JWK format.
     */
    Ed25519.generateKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var privateKeyBytes, privateKey, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        privateKeyBytes = ed25519_1.ed25519.utils.randomPrivateKey();
                        return [4 /*yield*/, Ed25519.bytesToPrivateKey({ privateKeyBytes: privateKeyBytes })];
                    case 1:
                        privateKey = _b.sent();
                        // Compute the JWK thumbprint and set as the key ID.
                        _a = privateKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: privateKey })];
                    case 2:
                        // Compute the JWK thumbprint and set as the key ID.
                        _a.kid = _b.sent();
                        return [2 /*return*/, privateKey];
                }
            });
        });
    };
    /**
     * Retrieves the public key properties from a given private key in JWK format.
     *
     * @remarks
     * This method extracts the public key portion from an Ed25519 private key in JWK format. It does
     * so by removing the private key property 'd' and making a shallow copy, effectively yielding the
     * public key. The method sets the 'kid' (key ID) property using the JWK thumbprint if it is not
     * already defined. This approach is used under the assumption that a private key in JWK format
     * always contains the corresponding public key properties.
     *
     * Note: This method offers a significant performance advantage, being about 100 times faster
     * than `computePublicKey()`. However, it does not mathematically validate the private key, nor
     * does it derive the public key from the private key. It simply extracts existing public key
     * properties from the private key object. This makes it suitable for scenarios where speed is
     * critical and the private key's integrity is already assured.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // A Jwk object representing an Ed25519 private key
     * const publicKey = await Ed25519.getPublicKey({ key: privateKey });
     * ```
     *
     * @param params - The parameters for retrieving the public key properties.
     * @param params.key - The private key in JWK format.
     *
     * @returns A Promise that resolves to the public key in JWK format.
     */
    Ed25519.getPublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var d, publicKey, _c, _d;
            var _e;
            var key = _b.key;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        // Verify the provided JWK represents an octet key pair (OKP) Ed25519 private key.
                        if (!((0, jwk_js_1.isOkpPrivateJwk)(key) && key.crv === 'Ed25519')) {
                            throw new Error("Ed25519: The provided key is not an Ed25519 private JWK.");
                        }
                        d = key.d, publicKey = __rest(key, ["d"]);
                        if (!((_e = 
                        // If the key ID is undefined, set it to the JWK thumbprint.
                        publicKey.kid) !== null && _e !== void 0)) return [3 /*break*/, 1];
                        _c = _e;
                        return [3 /*break*/, 3];
                    case 1:
                        // If the key ID is undefined, set it to the JWK thumbprint.
                        _d = publicKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: publicKey })];
                    case 2:
                        _c = (_d.kid = _f.sent());
                        _f.label = 3;
                    case 3:
                        // If the key ID is undefined, set it to the JWK thumbprint.
                        _c;
                        return [2 /*return*/, publicKey];
                }
            });
        });
    };
    /**
     * Converts a private key from JSON Web Key (JWK) format to a raw byte array (Uint8Array).
     *
     * @remarks
     * This method accepts a private key in JWK format and extracts its raw byte representation.
     *
     * This method accepts a public key in JWK format and converts it into its raw binary
     * form. The conversion process involves decoding the 'd' parameter of the JWK
     * from base64url format into a byte array.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // An Ed25519 private key in JWK format
     * const privateKeyBytes = await Ed25519.privateKeyToBytes({ privateKey });
     * ```
     *
     * @param params - The parameters for the private key conversion.
     * @param params.privateKey - The private key in JWK format.
     *
     * @returns A Promise that resolves to the private key as a Uint8Array.
     */
    Ed25519.privateKeyToBytes = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes;
            var privateKey = _b.privateKey;
            return __generator(this, function (_c) {
                // Verify the provided JWK represents a valid OKP private key.
                if (!(0, jwk_js_1.isOkpPrivateJwk)(privateKey)) {
                    throw new Error("Ed25519: The provided key is not a valid OKP private key.");
                }
                privateKeyBytes = common_1.Convert.base64Url(privateKey.d).toUint8Array();
                return [2 /*return*/, privateKeyBytes];
            });
        });
    };
    /**
     * Converts a public key from JSON Web Key (JWK) format to a raw byte array (Uint8Array).
     *
     * @remarks
     * This method accepts a public key in JWK format and converts it into its raw binary form.
     * The conversion process involves decoding the 'x' parameter of the JWK (which represent the
     * x coordinate of the elliptic curve point) from base64url format into a byte array.
     *
     * @example
     * ```ts
     * const publicKey = { ... }; // An Ed25519 public key in JWK format
     * const publicKeyBytes = await Ed25519.publicKeyToBytes({ publicKey });
     * ```
     *
     * @param params - The parameters for the public key conversion.
     * @param params.publicKey - The public key in JWK format.
     *
     * @returns A Promise that resolves to the public key as a Uint8Array.
     */
    Ed25519.publicKeyToBytes = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var publicKeyBytes;
            var publicKey = _b.publicKey;
            return __generator(this, function (_c) {
                // Verify the provided JWK represents a valid OKP public key.
                if (!(0, jwk_js_1.isOkpPublicJwk)(publicKey)) {
                    throw new Error("Ed25519: The provided key is not a valid OKP public key.");
                }
                publicKeyBytes = common_1.Convert.base64Url(publicKey.x).toUint8Array();
                return [2 /*return*/, publicKeyBytes];
            });
        });
    };
    /**
     * Generates an RFC8032-compliant EdDSA signature of given data using an Ed25519 private key.
     *
     * @remarks
     * This method signs the provided data with a specified private key using the EdDSA
     * (Edwards-curve Digital Signature Algorithm) as defined in RFC8032. It
     * involves converting the private key from JWK format to a byte array and then employing
     * the Ed25519 algorithm to sign the data. The output is a digital signature in the form
     * of a Uint8Array, uniquely corresponding to both the data and the private key used for
     * signing.
     *
     * @example
     * ```ts
     * const data = new TextEncoder().encode('Messsage'); // Data to be signed
     * const privateKey = { ... }; // A Jwk object representing an Ed25519 private key
     * const signature = await Ed25519.sign({ key: privateKey, data });
     * ```
     *
     * @param params - The parameters for the signing operation.
     * @param params.key - The private key to use for signing, represented in JWK format.
     * @param params.data - The data to sign, represented as a Uint8Array.
     *
     * @returns A Promise that resolves to the signature as a Uint8Array.
     */
    Ed25519.sign = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes, signature;
            var key = _b.key, data = _b.data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Ed25519.privateKeyToBytes({ privateKey: key })];
                    case 1:
                        privateKeyBytes = _c.sent();
                        signature = ed25519_1.ed25519.sign(data, privateKeyBytes);
                        return [2 /*return*/, signature];
                }
            });
        });
    };
    /**
     * Validates a given public key to confirm its mathematical correctness on the Edwards curve.
     *
     * @remarks
     * This method decodes the Edwards points from the key bytes and asserts their validity on the
     * Curve25519 curve in Twisted Edwards form. If the points are not valid, the method returns
     * false. If the points are valid, the method returns true.
     *
     * Note that this validation strictly pertains to the key's format and numerical validity; it does
     * not assess whether the key corresponds to a known entity or its security status (e.g., whether
     * it has been compromised).
     *
     * @example
     * ```ts
     * const publicKeyBytes = new Uint8Array([...]); // A public key in byte format
     * const isValid = await Ed25519.validatePublicKey({ publicKeyBytes });
     * console.log(isValid); // true if the key is valid on the Edwards curve, false otherwise
     * ```
     *
     * @param params - The parameters for the public key validation.
     * @param params.publicKeyBytes - The public key to validate, represented as a Uint8Array.
     *
     * @returns A Promise that resolves to a boolean indicating whether the key
     *          corresponds to a valid point on the Edwards curve.
     */
    Ed25519.validatePublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var point;
            var publicKeyBytes = _b.publicKeyBytes;
            return __generator(this, function (_c) {
                try {
                    point = ed25519_1.ed25519.ExtendedPoint.fromHex(publicKeyBytes);
                    // Check if points are on the Twisted Edwards curve.
                    point.assertValidity();
                }
                catch (error) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
            });
        });
    };
    /**
     * Verifies an RFC8032-compliant EdDSA signature against given data using an Ed25519 public key.
     *
     * @remarks
     * This method validates a digital signature to ensure its authenticity and integrity.
     * It uses the EdDSA (Edwards-curve Digital Signature Algorithm) as specified in RFC8032.
     * The verification process involves converting the public key from JWK format to a raw
     * byte array and using the Ed25519 algorithm to validate the signature against the provided data.
     *
     * @example
     * ```ts
     * const data = new TextEncoder().encode('Messsage'); // Data that was signed
     * const publicKey = { ... }; // A Jwk object representing an Ed25519 public key
     * const signature = new Uint8Array([...]); // Signature to verify
     * const isValid = await Ed25519.verify({ key: publicKey, signature, data });
     * console.log(isValid); // true if the signature is valid, false otherwise
     * ```
     *
     * @param params - The parameters for the signature verification.
     * @param params.key - The public key in JWK format used for verification.
     * @param params.signature - The signature to verify, represented as a Uint8Array.
     * @param params.data - The data that was signed, represented as a Uint8Array.
     *
     * @returns A Promise that resolves to a boolean indicating whether the signature is valid.
     */
    Ed25519.verify = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var publicKeyBytes, isValid;
            var key = _b.key, signature = _b.signature, data = _b.data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Ed25519.publicKeyToBytes({ publicKey: key })];
                    case 1:
                        publicKeyBytes = _c.sent();
                        isValid = ed25519_1.ed25519.verify(signature, data, publicKeyBytes);
                        return [2 /*return*/, isValid];
                }
            });
        });
    };
    return Ed25519;
}());
exports.Ed25519 = Ed25519;
//# sourceMappingURL=ed25519.js.map