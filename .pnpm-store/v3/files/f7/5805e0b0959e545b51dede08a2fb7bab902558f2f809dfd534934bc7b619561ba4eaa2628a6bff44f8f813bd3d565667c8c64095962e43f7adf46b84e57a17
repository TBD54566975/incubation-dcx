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
exports.isPublicJwk = exports.isPrivateJwk = exports.isOkpPublicJwk = exports.isOkpPrivateJwk = exports.isOctPrivateJwk = exports.isEcPublicJwk = exports.isEcPrivateJwk = exports.computeJwkThumbprint = exports.KEY_URI_PREFIX_JWK = void 0;
var common_1 = require("@web5/common");
var utils_js_1 = require("./utils.js");
var sha256_js_1 = require("../primitives/sha256.js");
/**
 * Constant defining the prefix for JSON Web Keys (JWK) key URIs in this library.
 *
 * The prefix 'urn:jwk:' makes it explicit that a string represents a JWK, referenced by a
 * {@link https://datatracker.ietf.org/doc/html/rfc3986 | URI} (Uniform Resource Identifier),
 * which ensures consistent key referencing across all Web5 Key Management System (KMS)
 * implementations.
 *
 * These key URIs take the form `urn:jwk:<JWK thumbprint>`, where the
 * {@link https://datatracker.ietf.org/doc/html/rfc7638 | JWK thumbprint}, derived from the JWK, is
 * unique to the key's material, unaffected by the order or optional properties in the JWK.
 */
exports.KEY_URI_PREFIX_JWK = 'urn:jwk:';
/**
 * Computes the thumbprint of a JSON Web Key (JWK) using the method
 * specified in RFC 7638. This function accepts RSA, EC, OKP, and oct keys
 * and returns the thumbprint as a base64url encoded SHA-256 hash of the
 * JWK's required members, serialized and sorted lexicographically.
 *
 * Purpose:
 * - Uniquely Identifying Keys: The thumbprint allows the unique
 *   identification of a specific JWK within a set of JWKs. It provides a
 *   deterministic way to generate a value that can be used as a key
 *   identifier (kid) or to match a specific key.
 *
 * - Simplifying Key Management: In systems where multiple keys are used,
 *   managing and identifying individual keys can become complex. The
 *   thumbprint method simplifies this by creating a standardized, unique
 *   identifier for each key.
 *
 * - Enabling Interoperability: By standardizing the method to compute a
 *   thumbprint, different systems can compute the same thumbprint value for
 *   a given JWK. This enables interoperability among systems that use JWKs.
 *
 * - Secure Comparison: The thumbprint provides a way to securely compare
 *   JWKs to determine if they are equivalent.
 *
 * @example
 * ```ts
 * const jwk: PublicKeyJwk = {
 *   'kty': 'EC',
 *   'crv': 'secp256k1',
 *   'x': '61iPYuGefxotzBdQZtDvv6cWHZmXrTTscY-u7Y2pFZc',
 *   'y': '88nPCVLfrAY9i-wg5ORcwVbHWC_tbeAd1JE2e0co0lU'
 * };
 *
 * const thumbprint = jwkThumbprint(jwk);
 * console.log(`JWK thumbprint: ${thumbprint}`);
 * ```
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7638 | RFC7638} for
 * the specification of JWK thumbprint computation.
 *
 * @param jwk - The JSON Web Key for which the thumbprint will be computed.
 *              This must be an RSA, EC, OKP, or oct key.
 * @returns The thumbprint as a base64url encoded string.
 * @throws Throws an `Error` if the provided key type is unsupported.
 */
function computeJwkThumbprint(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var keyType, normalizedJwk, serializedJwk, utf8Bytes, digest, thumbprint;
        var jwk = _b.jwk;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    keyType = jwk.kty;
                    if (keyType === 'EC') {
                        normalizedJwk = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y };
                    }
                    else if (keyType === 'oct') {
                        normalizedJwk = { k: jwk.k, kty: jwk.kty };
                    }
                    else if (keyType === 'OKP') {
                        normalizedJwk = { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
                    }
                    else if (keyType === 'RSA') {
                        normalizedJwk = { e: jwk.e, kty: jwk.kty, n: jwk.n };
                    }
                    else {
                        throw new Error("Unsupported key type: ".concat(keyType));
                    }
                    (0, common_1.removeUndefinedProperties)(normalizedJwk);
                    serializedJwk = (0, utils_js_1.canonicalize)(normalizedJwk);
                    utf8Bytes = common_1.Convert.string(serializedJwk).toUint8Array();
                    return [4 /*yield*/, sha256_js_1.Sha256.digest({ data: utf8Bytes })];
                case 1:
                    digest = _c.sent();
                    thumbprint = common_1.Convert.uint8Array(digest).toBase64Url();
                    return [2 /*return*/, thumbprint];
            }
        });
    });
}
exports.computeJwkThumbprint = computeJwkThumbprint;
/**
 * Checks if the provided object is a valid elliptic curve private key in JWK format.
 *
 * @param obj - The object to check.
 * @returns True if the object is a valid EC private JWK; otherwise, false.
 */
function isEcPrivateJwk(obj) {
    if (!obj || typeof obj !== 'object')
        return false;
    if (!('kty' in obj && 'crv' in obj && 'x' in obj && 'd' in obj))
        return false;
    if (obj.kty !== 'EC')
        return false;
    if (typeof obj.d !== 'string')
        return false;
    if (typeof obj.x !== 'string')
        return false;
    return true;
}
exports.isEcPrivateJwk = isEcPrivateJwk;
/**
 * Checks if the provided object is a valid elliptic curve public key in JWK format.
 *
 * @param obj - The object to check.
 * @returns True if the object is a valid EC public JWK; otherwise, false.
 */
function isEcPublicJwk(obj) {
    if (!obj || typeof obj !== 'object')
        return false;
    if (!('kty' in obj && 'crv' in obj && 'x' in obj))
        return false;
    if ('d' in obj)
        return false;
    if (obj.kty !== 'EC')
        return false;
    if (typeof obj.x !== 'string')
        return false;
    return true;
}
exports.isEcPublicJwk = isEcPublicJwk;
/**
 * Checks if the provided object is a valid octet sequence (symmetric key) in JWK format.
 *
 * @param obj - The object to check.
 * @returns True if the object is a valid oct private JWK; otherwise, false.
 */
function isOctPrivateJwk(obj) {
    if (!obj || typeof obj !== 'object')
        return false;
    if (!('kty' in obj && 'k' in obj))
        return false;
    if (obj.kty !== 'oct')
        return false;
    if (typeof obj.k !== 'string')
        return false;
    return true;
}
exports.isOctPrivateJwk = isOctPrivateJwk;
/**
 * Checks if the provided object is a valid octet key pair private key in JWK format.
 *
 * @param obj - The object to check.
 * @returns True if the object is a valid OKP private JWK; otherwise, false.
 */
function isOkpPrivateJwk(obj) {
    if (!obj || typeof obj !== 'object')
        return false;
    if (!('kty' in obj && 'crv' in obj && 'x' in obj && 'd' in obj))
        return false;
    if (obj.kty !== 'OKP')
        return false;
    if (typeof obj.d !== 'string')
        return false;
    if (typeof obj.x !== 'string')
        return false;
    return true;
}
exports.isOkpPrivateJwk = isOkpPrivateJwk;
/**
 * Checks if the provided object is a valid octet key pair public key in JWK format.
 *
 * @param obj - The object to check.
 * @returns True if the object is a valid OKP public JWK; otherwise, false.
 */
function isOkpPublicJwk(obj) {
    if (!obj || typeof obj !== 'object')
        return false;
    if ('d' in obj)
        return false;
    if (!('kty' in obj && 'crv' in obj && 'x' in obj))
        return false;
    if (obj.kty !== 'OKP')
        return false;
    if (typeof obj.x !== 'string')
        return false;
    return true;
}
exports.isOkpPublicJwk = isOkpPublicJwk;
/**
 * Checks if the provided object is a valid private key in JWK format of any supported type.
 *
 * @param obj - The object to check.
 * @returns True if the object is a valid private JWK; otherwise, false.
 */
function isPrivateJwk(obj) {
    if (!obj || typeof obj !== 'object')
        return false;
    var kty = obj.kty;
    switch (kty) {
        case 'EC':
        case 'OKP':
        case 'RSA':
            return 'd' in obj;
        case 'oct':
            return 'k' in obj;
        default:
            return false;
    }
}
exports.isPrivateJwk = isPrivateJwk;
/**
 * Checks if the provided object is a valid public key in JWK format of any supported type.
 *
 * @param obj - The object to check.
 * @returns True if the object is a valid public JWK; otherwise, false.
 */
function isPublicJwk(obj) {
    if (!obj || typeof obj !== 'object')
        return false;
    var kty = obj.kty;
    switch (kty) {
        case 'EC':
        case 'OKP':
            return 'x' in obj && !('d' in obj);
        case 'RSA':
            return 'n' in obj && 'e' in obj && !('d' in obj);
        default:
            return false;
    }
}
exports.isPublicJwk = isPublicJwk;
//# sourceMappingURL=jwk.js.map