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
exports.EcdsaAlgorithm = void 0;
var secp256k1_js_1 = require("../primitives/secp256k1.js");
var secp256r1_js_1 = require("../primitives/secp256r1.js");
var crypto_algorithm_js_1 = require("./crypto-algorithm.js");
var jwk_js_1 = require("../jose/jwk.js");
/**
 * The `EcdsaAlgorithm` class provides a concrete implementation for cryptographic operations using
 * the Elliptic Curve Digital Signature Algorithm (ECDSA). This class implements both
 * {@link Signer | `Signer`} and { @link AsymmetricKeyGenerator | `AsymmetricKeyGenerator`}
 * interfaces, providing private key generation, public key derivation, and creation/verification
 * of signatures.
 *
 * This class is typically accessed through implementations that extend the
 * {@link CryptoApi | `CryptoApi`} interface.
 */
var EcdsaAlgorithm = /** @class */ (function (_super) {
    __extends(EcdsaAlgorithm, _super);
    function EcdsaAlgorithm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Derives the public key in JWK format from a given private key.
     *
     * @remarks
     * This method takes a private key in JWK format and derives its corresponding public key,
     * also in JWK format. The process ensures that the derived public key correctly corresponds to
     * the given private key.
     *
     * @example
     * ```ts
     * const ecdsa = new EcdsaAlgorithm();
     * const privateKey = { ... }; // A Jwk object representing a private key
     * const publicKey = await ecdsa.computePublicKey({ key: privateKey });
     * ```
     *
     * @param params - The parameters for the public key derivation.
     * @param params.key - The private key in JWK format from which to derive the public key.
     *
     * @returns A Promise that resolves to the derived public key in JWK format.
     */
    EcdsaAlgorithm.prototype.computePublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var _c, publicKey, publicKey;
            var key = _b.key;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(0, jwk_js_1.isEcPrivateJwk)(key))
                            throw new TypeError('Invalid key provided. Must be an elliptic curve (EC) private key.');
                        _c = key.crv;
                        switch (_c) {
                            case 'secp256k1': return [3 /*break*/, 1];
                            case 'P-256': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, secp256k1_js_1.Secp256k1.computePublicKey({ key: key })];
                    case 2:
                        publicKey = _d.sent();
                        publicKey.alg = 'ES256K';
                        return [2 /*return*/, publicKey];
                    case 3: return [4 /*yield*/, secp256r1_js_1.Secp256r1.computePublicKey({ key: key })];
                    case 4:
                        publicKey = _d.sent();
                        publicKey.alg = 'ES256';
                        return [2 /*return*/, publicKey];
                    case 5:
                        {
                            throw new Error("Unsupported curve: ".concat(key.crv));
                        }
                        _d.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generates a new private key with the specified algorithm in JSON Web Key (JWK) format.
     *
     * @example
     * ```ts
     * const ecdsa = new EcdsaAlgorithm();
     * const privateKey = await ecdsa.generateKey({ algorithm: 'ES256K' });
     * ```
     *
     * @param params - The parameters for key generation.
     * @param params.algorithm - The algorithm to use for key generation.
     *
     * @returns A Promise that resolves to the generated private key in JWK format.
     */
    EcdsaAlgorithm.prototype.generateKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var _c, privateKey, privateKey;
            var algorithm = _b.algorithm;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = algorithm;
                        switch (_c) {
                            case 'ES256K': return [3 /*break*/, 1];
                            case 'secp256k1': return [3 /*break*/, 1];
                            case 'ES256': return [3 /*break*/, 3];
                            case 'secp256r1': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, secp256k1_js_1.Secp256k1.generateKey()];
                    case 2:
                        privateKey = _d.sent();
                        privateKey.alg = 'ES256K';
                        return [2 /*return*/, privateKey];
                    case 3: return [4 /*yield*/, secp256r1_js_1.Secp256r1.generateKey()];
                    case 4:
                        privateKey = _d.sent();
                        privateKey.alg = 'ES256';
                        return [2 /*return*/, privateKey];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the public key properties from a given private key in JWK format.
     *
     * @remarks
     * This method extracts the public key portion from an ECDSA private key in JWK format. It does
     * so by removing the private key property 'd' and making a shallow copy, effectively yielding the
     * public key.
     *
     * Note: This method offers a significant performance advantage, being about 200 times faster
     * than `computePublicKey()`. However, it does not mathematically validate the private key, nor
     * does it derive the public key from the private key. It simply extracts existing public key
     * properties from the private key object. This makes it suitable for scenarios where speed is
     * critical and the private key's integrity is already assured.
     *
     * @example
     * ```ts
     * const ecdsa = new EcdsaAlgorithm();
     * const privateKey = { ... }; // A Jwk object representing a private key
     * const publicKey = await ecdsa.getPublicKey({ key: privateKey });
     * ```
     *
     * @param params - The parameters for retrieving the public key properties.
     * @param params.key - The private key in JWK format.
     *
     * @returns A Promise that resolves to the public key in JWK format.
     */
    EcdsaAlgorithm.prototype.getPublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var _c, publicKey, publicKey;
            var key = _b.key;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(0, jwk_js_1.isEcPrivateJwk)(key))
                            throw new TypeError('Invalid key provided. Must be an elliptic curve (EC) private key.');
                        _c = key.crv;
                        switch (_c) {
                            case 'secp256k1': return [3 /*break*/, 1];
                            case 'P-256': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, secp256k1_js_1.Secp256k1.getPublicKey({ key: key })];
                    case 2:
                        publicKey = _d.sent();
                        publicKey.alg = 'ES256K';
                        return [2 /*return*/, publicKey];
                    case 3: return [4 /*yield*/, secp256r1_js_1.Secp256r1.getPublicKey({ key: key })];
                    case 4:
                        publicKey = _d.sent();
                        publicKey.alg = 'ES256';
                        return [2 /*return*/, publicKey];
                    case 5:
                        {
                            throw new Error("Unsupported curve: ".concat(key.crv));
                        }
                        _d.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generates an ECDSA signature of given data using a private key.
     *
     * @remarks
     * This method uses the signature algorithm determined by the given `algorithm` to sign the
     * provided data.
     *
     * The signature can later be verified by parties with access to the corresponding
     * public key, ensuring that the data has not been tampered with and was indeed signed by the
     * holder of the private key.
     *
     * @example
     * ```ts
     * const ecdsa = new EcdsaAlgorithm();
     * const data = new TextEncoder().encode('Message');
     * const privateKey = { ... }; // A Jwk object representing a private key
     * const signature = await ecdsa.sign({
     *   key: privateKey,
     *   data
     * });
     * ```
     *
     * @param params - The parameters for the signing operation.
     * @param params.key - The private key to use for signing, represented in JWK format.
     * @param params.data - The data to sign.
     *
     * @returns A Promise resolving to the digital signature as a `Uint8Array`.
     */
    EcdsaAlgorithm.prototype.sign = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var _c;
            var key = _b.key, data = _b.data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(0, jwk_js_1.isEcPrivateJwk)(key))
                            throw new TypeError('Invalid key provided. Must be an elliptic curve (EC) private key.');
                        _c = key.crv;
                        switch (_c) {
                            case 'secp256k1': return [3 /*break*/, 1];
                            case 'P-256': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, secp256k1_js_1.Secp256k1.sign({ key: key, data: data })];
                    case 2: return [2 /*return*/, _d.sent()];
                    case 3: return [4 /*yield*/, secp256r1_js_1.Secp256r1.sign({ key: key, data: data })];
                    case 4: return [2 /*return*/, _d.sent()];
                    case 5:
                        {
                            throw new Error("Unsupported curve: ".concat(key.crv));
                        }
                        _d.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifies an ECDSA signature associated with the provided data using the provided key.
     *
     * @remarks
     * This method uses the signature algorithm determined by the `crv` property of the provided key
     * to check the validity of a digital signature against the original data. It confirms whether the
     * signature was created by the holder of the corresponding private key and that the data has not
     * been tampered with.
     *s
     * @example
     * ```ts
     * const ecdsa = new EcdsaAlgorithm();
     * const publicKey = { ... }; // Public key in JWK format corresponding to the private key that signed the data
     * const signature = new Uint8Array([...]); // Signature to verify
     * const data = new TextEncoder().encode('Message');
     * const isValid = await ecdsa.verify({
     *   key: publicKey,
     *   signature,
     *   data
     * });
     * ```
     *
     * @param params - The parameters for the verification operation.
     * @param params.key - The key to use for verification.
     * @param params.signature - The signature to verify.
     * @param params.data - The data to verify.
     *
     * @returns A Promise resolving to a boolean indicating whether the signature is valid.
     */
    EcdsaAlgorithm.prototype.verify = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var _c;
            var key = _b.key, signature = _b.signature, data = _b.data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(0, jwk_js_1.isEcPublicJwk)(key))
                            throw new TypeError('Invalid key provided. Must be an elliptic curve (EC) public key.');
                        _c = key.crv;
                        switch (_c) {
                            case 'secp256k1': return [3 /*break*/, 1];
                            case 'P-256': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, secp256k1_js_1.Secp256k1.verify({ key: key, signature: signature, data: data })];
                    case 2: return [2 /*return*/, _d.sent()];
                    case 3: return [4 /*yield*/, secp256r1_js_1.Secp256r1.verify({ key: key, signature: signature, data: data })];
                    case 4: return [2 /*return*/, _d.sent()];
                    case 5:
                        {
                            throw new Error("Unsupported curve: ".concat(key.crv));
                        }
                        _d.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return EcdsaAlgorithm;
}(crypto_algorithm_js_1.CryptoAlgorithm));
exports.EcdsaAlgorithm = EcdsaAlgorithm;
//# sourceMappingURL=ecdsa.js.map