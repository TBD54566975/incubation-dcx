"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.PublicKey = exports.PrivateKey = exports.ECIES_CONFIG = exports.decrypt = exports.encrypt = void 0;
var utils_1 = require("@noble/ciphers/utils");
var config_1 = require("./config");
var keys_1 = require("./keys");
var utils_2 = require("./utils");
function encrypt(receiverRawPK, msg) {
    var ephemeralKey = new keys_1.PrivateKey();
    var receiverPK = receiverRawPK instanceof Uint8Array
        ? new keys_1.PublicKey(receiverRawPK)
        : keys_1.PublicKey.fromHex(receiverRawPK);
    var symKey = ephemeralKey.encapsulate(receiverPK);
    var encrypted = (0, utils_2.aesEncrypt)(symKey, msg);
    var pk;
    if ((0, config_1.isEphemeralKeyCompressed)()) {
        pk = ephemeralKey.publicKey.compressed;
    }
    else {
        pk = ephemeralKey.publicKey.uncompressed;
    }
    return Buffer.from((0, utils_1.concatBytes)(pk, encrypted));
}
exports.encrypt = encrypt;
function decrypt(receiverRawSK, msg) {
    var receiverSK = receiverRawSK instanceof Uint8Array
        ? new keys_1.PrivateKey(receiverRawSK)
        : keys_1.PrivateKey.fromHex(receiverRawSK);
    var keySize = (0, config_1.ephemeralKeySize)();
    var senderPK = new keys_1.PublicKey(msg.subarray(0, keySize));
    var encrypted = msg.subarray(keySize);
    var symKey = senderPK.decapsulate(receiverSK);
    return Buffer.from((0, utils_2.aesDecrypt)(symKey, encrypted));
}
exports.decrypt = decrypt;
var config_2 = require("./config");
Object.defineProperty(exports, "ECIES_CONFIG", { enumerable: true, get: function () { return config_2.ECIES_CONFIG; } });
var keys_2 = require("./keys");
Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function () { return keys_2.PrivateKey; } });
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return keys_2.PublicKey; } });
exports.utils = {
    // TODO: review these before 0.5.0
    aesDecrypt: utils_2.aesDecrypt,
    aesEncrypt: utils_2.aesEncrypt,
    decodeHex: utils_2.decodeHex,
    getValidSecret: utils_2.getValidSecret,
    remove0x: utils_2.remove0x,
};
