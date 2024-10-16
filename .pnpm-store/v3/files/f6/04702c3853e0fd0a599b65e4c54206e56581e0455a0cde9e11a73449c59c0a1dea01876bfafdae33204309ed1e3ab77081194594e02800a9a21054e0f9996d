"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKey = void 0;
var utils_1 = require("@noble/ciphers/utils");
var config_1 = require("../config");
var utils_2 = require("../utils");
var PublicKey_1 = require("./PublicKey");
var PrivateKey = /** @class */ (function () {
    function PrivateKey(secret) {
        var sk = secret === undefined ? (0, utils_2.getValidSecret)() : secret;
        if (!(0, utils_2.isValidPrivateKey)(sk)) {
            throw new Error("Invalid private key");
        }
        this.data = sk;
        this.publicKey = new PublicKey_1.PublicKey((0, utils_2.getPublicKey)(sk));
    }
    PrivateKey.fromHex = function (hex) {
        return new PrivateKey((0, utils_2.decodeHex)(hex));
    };
    Object.defineProperty(PrivateKey.prototype, "secret", {
        get: function () {
            // TODO: Uint8Array
            return Buffer.from(this.data);
        },
        enumerable: false,
        configurable: true
    });
    PrivateKey.prototype.toHex = function () {
        return (0, utils_1.bytesToHex)(this.data);
    };
    PrivateKey.prototype.encapsulate = function (pk) {
        var senderPoint;
        var sharedPoint;
        if ((0, config_1.isHkdfKeyCompressed)()) {
            senderPoint = this.publicKey.compressed;
            sharedPoint = this.multiply(pk, true);
        }
        else {
            senderPoint = this.publicKey.uncompressed;
            sharedPoint = this.multiply(pk, false);
        }
        return (0, utils_2.getSharedKey)(senderPoint, sharedPoint);
    };
    PrivateKey.prototype.multiply = function (pk, compressed) {
        if (compressed === void 0) { compressed = false; }
        return (0, utils_2.getSharedPoint)(this.data, pk.compressed, compressed);
    };
    PrivateKey.prototype.equals = function (other) {
        return (0, utils_1.equalBytes)(this.data, other.data);
    };
    return PrivateKey;
}());
exports.PrivateKey = PrivateKey;
