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
exports.X25519 = void 0;
var common_1 = require("@web5/common");
var ed25519_1 = require("@noble/curves/ed25519");
var jwk_js_1 = require("../jose/jwk.js");
/**
 * The `X25519` class provides a comprehensive suite of utilities for working with the X25519
 * elliptic curve, widely used for key agreement protocols and cryptographic applications. It
 * provides methods for key generation, conversion, and Elliptic Curve Diffie-Hellman (ECDH)
 * key agreement,  all aligned with standard cryptographic practices.
 *
 * The class supports conversions between raw byte formats and JSON Web Key (JWK) formats,
 * making it versatile for various cryptographic tasks. It adheres to RFC6090 for ECDH, ensuring
 * secure and effective handling of keys and cryptographic operations.
 *
 * Key Features:
 * - Key Generation: Generate X25519 private keys in JWK format.
 * - Key Conversion: Transform keys between raw byte arrays and JWK formats.
 * - Public Key Derivation: Derive public keys from private keys.
 * - ECDH Shared Secret Computation: Securely derive shared secrets using private and public keys.
 *
 * The methods in this class are asynchronous, returning Promises to accommodate various
 * JavaScript environments.
 *
 * @example
 * ```ts
 * // Key Generation
 * const privateKey = await X25519.generateKey();
 *
 * // Public Key Derivation
 * const publicKey = await X25519.computePublicKey({ key: privateKey });
 * console.log(publicKey === await X25519.getPublicKey({ key: privateKey })); // Output: true
 *
 * // ECDH Shared Secret Computation
 * const sharedSecret = await X25519.sharedSecret({
 *   privateKeyA: privateKey,
 *   publicKeyB: anotherPublicKey
 * });
 *
 * // Key Conversion
 * const publicKeyBytes = await X25519.publicKeyToBytes({ publicKey });
 * const privateKeyBytes = await X25519.privateKeyToBytes({ privateKey });
 * ```
 */
var X25519 = /** @class */ (function () {
    function X25519() {
    }
    /**
     * Converts a raw private key in bytes to its corresponding JSON Web Key (JWK) format.
     *
     * @remarks
     * This method accepts a private key as a byte array (Uint8Array) for the X25519 elliptic curve
     * and transforms it into a JWK object. The process involves first deriving the public key from
     * the private key, then encoding both the private and public keys into base64url format.
     *
     * The resulting JWK object includes the following properties:
     * - `kty`: Key Type, set to 'OKP' for Octet Key Pair.
     * - `crv`: Curve Name, set to 'X25519'.
     * - `d`: The private key component, base64url-encoded.
     * - `x`: The derived public key, base64url-encoded.
     *
     * This method is useful for converting raw public keys into a standardized
     * JSON format, facilitating their use in cryptographic operations and making
     * them easy to share and store.
     *
     * @example
     * ```ts
     * const privateKeyBytes = new Uint8Array([...]); // Replace with actual private key bytes
     * const privateKey = await X25519.bytesToPrivateKey({ privateKeyBytes });
     * ```
     *
     * @param params - The parameters for the private key conversion.
     * @param params.privateKeyBytes - The raw private key as a Uint8Array.
     *
     * @returns A Promise that resolves to the private key in JWK format.
     */
    X25519.bytesToPrivateKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var publicKeyBytes, privateKey, _c;
            var privateKeyBytes = _b.privateKeyBytes;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        publicKeyBytes = ed25519_1.x25519.getPublicKey(privateKeyBytes);
                        privateKey = {
                            kty: 'OKP',
                            crv: 'X25519',
                            d: common_1.Convert.uint8Array(privateKeyBytes).toBase64Url(),
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
     * Converts a raw public key in bytes to its corresponding JSON Web Key (JWK) format.
     *
     * @remarks
     * This method accepts a public key as a byte array (Uint8Array) for the X25519 elliptic curve
     * and transforms it into a JWK object. The conversion process involves encoding the public
     * key bytes into base64url format.
     *
     * The resulting JWK object includes the following properties:
     * - `kty`: Key Type, set to 'OKP' for Octet Key Pair.
     * - `crv`: Curve Name, set to 'X25519'.
     * - `x`: The public key, base64url-encoded.
     *
     * This method is useful for converting raw public keys into a standardized
     * JSON format, facilitating their use in cryptographic operations and making
     * them easy to share and store.
     *
     * @example
     * ```ts
     * const publicKeyBytes = new Uint8Array([...]); // Replace with actual public key bytes
     * const publicKey = await X25519.bytesToPublicKey({ publicKeyBytes });
     * ```
     *
     * @param params - The parameters for the public key conversion.
     * @param params.publicKeyBytes - The raw public key as a Uint8Array.
     *
     * @returns A Promise that resolves to the public key in JWK format.
     */
    X25519.bytesToPublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var publicKey, _c;
            var publicKeyBytes = _b.publicKeyBytes;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        publicKey = {
                            kty: 'OKP',
                            crv: 'X25519',
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
     * Derives the public key in JWK format from a given X25519 private key.
     *
     * @remarks
     * This method takes a private key in JWK format and derives its corresponding public key,
     * also in JWK format.  The derivation process involves converting the private key to a
     * raw byte array and then computing the corresponding public key on the Curve25519 curve.
     * The public key is then encoded into base64url format to construct a JWK representation.
     *
     * The process ensures that the derived public key correctly corresponds to the given private key,
     * adhering to the Curve25519 elliptic curve in Twisted Edwards form standards. This method is
     * useful in cryptographic operations where a public key is needed for operations like signature
     * verification, but only the private key is available.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // A Jwk object representing an X25519 private key
     * const publicKey = await X25519.computePublicKey({ key: privateKey });
     * ```
     *
     * @param params - The parameters for the public key derivation.
     * @param params.key - The private key in JWK format from which to derive the public key.
     *
     * @returns A Promise that resolves to the derived public key in JWK format.
     */
    X25519.computePublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes, publicKeyBytes, publicKey, _c;
            var key = _b.key;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, X25519.privateKeyToBytes({ privateKey: key })];
                    case 1:
                        privateKeyBytes = _d.sent();
                        publicKeyBytes = ed25519_1.x25519.getPublicKey(privateKeyBytes);
                        publicKey = {
                            kty: 'OKP',
                            crv: 'X25519',
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
     * Generates an X25519 private key in JSON Web Key (JWK) format.
     *
     * @remarks
     * This method creates a new private key suitable for use with the X25519 elliptic curve.
     * The key generation process involves using cryptographically secure random number generation
     * to ensure the uniqueness and security of the key. The resulting private key adheres to the
     * JWK format making it compatible with common cryptographic standards and easy to use in various
     * cryptographic processes.
     *
     * The generated private key in JWK format includes the following components:
     * - `kty`: Key Type, set to 'OKP' for Octet Key Pair.
     * - `crv`: Curve Name, set to 'X25519'.
     * - `d`: The private key component, base64url-encoded.
     * - `x`: The derived public key, base64url-encoded.
     *
     * The key is returned in a format suitable for direct use in key agreement operations.
     *
     * @example
     * ```ts
     * const privateKey = await X25519.generateKey();
     * ```
     *
     * @returns A Promise that resolves to the generated private key in JWK format.
     */
    X25519.generateKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var privateKeyBytes, privateKey, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        privateKeyBytes = ed25519_1.x25519.utils.randomPrivateKey();
                        return [4 /*yield*/, X25519.bytesToPrivateKey({ privateKeyBytes: privateKeyBytes })];
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
     * This method extracts the public key portion from an X25519 private key in JWK format. It does
     * so by removing the private key property 'd' and making a shallow copy, effectively yielding the
     * public key. The method sets the 'kid' (key ID) property using the JWK thumbprint if it is not
     * already defined. This approach is used under the assumption that a private key in JWK format
     * always contains the corresponding public key properties.
     *
     * Note: This method offers a significant performance advantage, being about 500 times faster
     * than `computePublicKey()`. However, it does not mathematically validate the private key, nor
     * does it derive the public key from the private key. It simply extracts existing public key
     * properties from the private key object. This makes it suitable for scenarios where speed is
     * critical and the private key's integrity is already assured.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // A Jwk object representing an X25519 private key
     * const publicKey = await X25519.getPublicKey({ key: privateKey });
     * ```
     *
     * @param params - The parameters for retrieving the public key properties.
     * @param params.key - The private key in JWK format.
     *
     * @returns A Promise that resolves to the public key in JWK format.
     */
    X25519.getPublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var d, publicKey, _c, _d;
            var _e;
            var key = _b.key;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        // Verify the provided JWK represents an octet key pair (OKP) X25519 private key.
                        if (!((0, jwk_js_1.isOkpPrivateJwk)(key) && key.crv === 'X25519')) {
                            throw new Error("X25519: The provided key is not an X25519 private JWK.");
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
     * This conversion is essential for operations that require the private key in its raw
     * binary form, such as certain low-level cryptographic operations or when interfacing
     * with systems and libraries that expect keys in a byte array format.
     *
     * @example
     * ```ts
     * const privateKey = { ... }; // An X25519 private key in JWK format
     * const privateKeyBytes = await X25519.privateKeyToBytes({ privateKey });
     * ```
     *
     * @param params - The parameters for the private key conversion.
     * @param params.privateKey - The private key in JWK format.
     *
     * @returns A Promise that resolves to the private key as a Uint8Array.
     */
    X25519.privateKeyToBytes = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyBytes;
            var privateKey = _b.privateKey;
            return __generator(this, function (_c) {
                // Verify the provided JWK represents a valid OKP private key.
                if (!(0, jwk_js_1.isOkpPrivateJwk)(privateKey)) {
                    throw new Error("X25519: The provided key is not a valid OKP private key.");
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
     * This conversion is essential for operations that require the public key in its raw
     * binary form, such as certain low-level cryptographic operations or when interfacing
     * with systems and libraries that expect keys in a byte array format.
     *
     * @example
     * ```ts
     * const publicKey = { ... }; // An X25519 public key in JWK format
     * const publicKeyBytes = await X25519.publicKeyToBytes({ publicKey });
     * ```
     *
     * @param params - The parameters for the public key conversion.
     * @param params.publicKey - The public key in JWK format.
     *
     * @returns A Promise that resolves to the public key as a Uint8Array.
     */
    X25519.publicKeyToBytes = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var publicKeyBytes;
            var publicKey = _b.publicKey;
            return __generator(this, function (_c) {
                // Verify the provided JWK represents a valid OKP public key.
                if (!(0, jwk_js_1.isOkpPublicJwk)(publicKey)) {
                    throw new Error("X25519: The provided key is not a valid OKP public key.");
                }
                publicKeyBytes = common_1.Convert.base64Url(publicKey.x).toUint8Array();
                return [2 /*return*/, publicKeyBytes];
            });
        });
    };
    /**
     * Computes an RFC6090-compliant Elliptic Curve Diffie-Hellman (ECDH) shared secret
     * using secp256k1 private and public keys in JSON Web Key (JWK) format.
     *
     * @remarks
     * This method facilitates the ECDH key agreement protocol, which is a method of securely
     * deriving a shared secret between two parties based on their private and public keys.
     * It takes the private key of one party (privateKeyA) and the public key of another
     * party (publicKeyB) to compute a shared secret. The shared secret is derived from the
     * x-coordinate of the elliptic curve point resulting from the multiplication of the
     * public key with the private key.
     *
     * Note: When performing Elliptic Curve Diffie-Hellman (ECDH) key agreement,
     * the resulting shared secret is a point on the elliptic curve, which
     * consists of an x-coordinate and a y-coordinate. With a 256-bit curve like
     * secp256k1, each of these coordinates is 32 bytes (256 bits) long. However,
     * in the ECDH process, it's standard practice to use only the x-coordinate
     * of the shared secret point as the resulting shared key. This is because
     * the y-coordinate does not add to the entropy of the key, and both parties
     * can independently compute the x-coordinate.  Consquently, this implementation
     * omits the y-coordinate for simplicity and standard compliance.
     *
     * @example
     * ```ts
     * const privateKeyA = { ... }; // A Jwk object for party A
     * const publicKeyB = { ... }; // A PublicKeyJwk object for party B
     * const sharedSecret = await Secp256k1.sharedSecret({
     *   privateKeyA,
     *   publicKeyB
     * });
     * ```
     *
     * @param params - The parameters for the shared secret computation.
     * @param params.privateKeyA - The private key in JWK format of one party.
     * @param params.publicKeyB - The public key in JWK format of the other party.
     *
     * @returns A Promise that resolves to the computed shared secret as a Uint8Array.
     */
    X25519.sharedSecret = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKeyABytes, publicKeyBBytes, sharedSecret;
            var privateKeyA = _b.privateKeyA, publicKeyB = _b.publicKeyB;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Ensure that keys from the same key pair are not specified.
                        if ('x' in privateKeyA && 'x' in publicKeyB && privateKeyA.x === publicKeyB.x) {
                            throw new Error("X25519: ECDH shared secret cannot be computed from a single key pair's public and private keys.");
                        }
                        return [4 /*yield*/, X25519.privateKeyToBytes({ privateKey: privateKeyA })];
                    case 1:
                        privateKeyABytes = _c.sent();
                        return [4 /*yield*/, X25519.publicKeyToBytes({ publicKey: publicKeyB })];
                    case 2:
                        publicKeyBBytes = _c.sent();
                        sharedSecret = ed25519_1.x25519.getSharedSecret(privateKeyABytes, publicKeyBBytes);
                        return [2 /*return*/, sharedSecret];
                }
            });
        });
    };
    return X25519;
}());
exports.X25519 = X25519;
//# sourceMappingURL=x25519.js.map