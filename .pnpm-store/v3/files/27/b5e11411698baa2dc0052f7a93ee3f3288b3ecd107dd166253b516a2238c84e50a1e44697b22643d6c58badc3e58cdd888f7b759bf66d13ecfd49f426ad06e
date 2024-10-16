"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToPublicKey = exports.convertPublicKeyFormat = exports.getSharedPoint = exports.getSharedKey = exports.getPublicKey = exports.isValidPrivateKey = exports.getValidSecret = void 0;
var utils_1 = require("@noble/ciphers/utils");
var utils_2 = require("@noble/ciphers/webcrypto/utils");
var ed25519_1 = require("@noble/curves/ed25519");
var secp256k1_1 = require("@noble/curves/secp256k1");
var config_1 = require("../config");
var consts_1 = require("../consts");
var hex_1 = require("./hex");
var symmetric_1 = require("./symmetric");
function getValidSecret() {
    var key;
    do {
        key = (0, utils_2.randomBytes)(consts_1.SECRET_KEY_LENGTH);
    } while (!isValidPrivateKey(key));
    return key;
}
exports.getValidSecret = getValidSecret;
function isValidPrivateKey(secret) {
    // on secp256k1: only key ∈ (0, group order) is valid
    // on curve25519: any 32-byte key is valid
    return _exec(function (curve) { return curve.utils.isValidPrivateKey(secret); }, function () { return true; }, function () { return true; });
}
exports.isValidPrivateKey = isValidPrivateKey;
function getPublicKey(secret) {
    return _exec(function (curve) { return curve.getPublicKey(secret); }, function (curve) { return curve.getPublicKey(secret); }, function (curve) { return curve.getPublicKey(secret); });
}
exports.getPublicKey = getPublicKey;
function getSharedKey(ephemeralPoint, sharedPoint) {
    return (0, symmetric_1.deriveKey)((0, utils_1.concatBytes)(ephemeralPoint, sharedPoint));
}
exports.getSharedKey = getSharedKey;
function getSharedPoint(sk, pk, compressed) {
    return _exec(function (curve) { return curve.getSharedSecret(sk, pk, compressed); }, function (curve) { return curve.getSharedSecret(sk, pk); }, function (curve) {
        // Note: scalar is hashed from sk
        var scalar = curve.utils.getExtendedPublicKey(sk).scalar;
        var point = curve.ExtendedPoint.fromHex(pk).multiply(scalar);
        return point.toRawBytes();
    });
}
exports.getSharedPoint = getSharedPoint;
function convertPublicKeyFormat(pk, compressed) {
    // only for secp256k1
    return _exec(function (curve) { return curve.getSharedSecret(BigInt(1), pk, compressed); }, function () { return pk; }, function () { return pk; });
}
exports.convertPublicKeyFormat = convertPublicKeyFormat;
function hexToPublicKey(hex) {
    var decoded = (0, hex_1.decodeHex)(hex);
    return _exec(function () {
        if (decoded.length === consts_1.ETH_PUBLIC_KEY_SIZE) {
            var fixed = new Uint8Array(1 + decoded.length);
            fixed.set([0x04]);
            fixed.set(decoded, 1);
            return fixed;
        }
        return decoded;
    }, function () { return decoded; }, function () { return decoded; });
}
exports.hexToPublicKey = hexToPublicKey;
function _exec(secp256k1Callback, x25519Callback, ed25519Callback) {
    if ((0, config_1.ellipticCurve)() === "secp256k1") {
        return secp256k1Callback(secp256k1_1.secp256k1);
    }
    else if ((0, config_1.ellipticCurve)() === "x25519") {
        return x25519Callback(ed25519_1.x25519);
    }
    else if ((0, config_1.ellipticCurve)() === "ed25519") {
        return ed25519Callback(ed25519_1.ed25519);
    }
    else {
        throw new Error("Not implemented");
    }
}
