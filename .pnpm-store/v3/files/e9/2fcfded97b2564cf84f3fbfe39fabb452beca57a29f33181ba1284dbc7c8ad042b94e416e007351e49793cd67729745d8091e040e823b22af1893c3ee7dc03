"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKey = void 0;
var utils_1 = require("@noble/ciphers/utils");
var config_1 = require("../config");
var utils_2 = require("../utils");
var PublicKey = /** @class */ (function () {
    function PublicKey(data) {
        this.data = (0, utils_2.convertPublicKeyFormat)(data, true);
    }
    PublicKey.fromHex = function (hex) {
        return new PublicKey((0, utils_2.hexToPublicKey)(hex));
    };
    Object.defineProperty(PublicKey.prototype, "uncompressed", {
        get: function () {
            // TODO: Uint8Array
            return Buffer.from((0, utils_2.convertPublicKeyFormat)(this.data, false));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PublicKey.prototype, "compressed", {
        get: function () {
            // TODO: Uint8Array
            return Buffer.from(this.data);
        },
        enumerable: false,
        configurable: true
    });
    PublicKey.prototype.toHex = function (compressed) {
        if (compressed === void 0) { compressed = true; }
        if (compressed) {
            return (0, utils_1.bytesToHex)(this.data);
        }
        else {
            return (0, utils_1.bytesToHex)(this.uncompressed);
        }
    };
    PublicKey.prototype.decapsulate = function (sk) {
        var senderPoint;
        var sharedPoint;
        if ((0, config_1.isHkdfKeyCompressed)()) {
            senderPoint = this.data;
            sharedPoint = sk.multiply(this, true);
        }
        else {
            senderPoint = this.uncompressed;
            sharedPoint = sk.multiply(this, false);
        }
        return (0, utils_2.getSharedKey)(senderPoint, sharedPoint);
    };
    PublicKey.prototype.equals = function (other) {
        return (0, utils_1.equalBytes)(this.data, other.data);
    };
    return PublicKey;
}());
exports.PublicKey = PublicKey;
