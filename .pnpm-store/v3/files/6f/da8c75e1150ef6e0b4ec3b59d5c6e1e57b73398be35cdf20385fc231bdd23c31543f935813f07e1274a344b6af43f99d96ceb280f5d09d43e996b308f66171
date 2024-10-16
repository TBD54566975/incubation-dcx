"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aes256gcm = void 0;
var utils_1 = require("@noble/ciphers/utils");
var crypto_1 = require("crypto");
var consts_1 = require("../consts");
// make `node:crypto`'s aes compatible with `@noble/ciphers`
function aes256gcm(key, nonce, AAD) {
    var encrypt = function (plainText) {
        var cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", key, nonce);
        if (AAD) {
            cipher.setAAD(AAD);
        }
        var updated = cipher.update(plainText);
        var finalized = cipher.final();
        return (0, utils_1.concatBytes)(updated, finalized, cipher.getAuthTag());
    };
    var decrypt = function (cipherText) {
        var encrypted = cipherText.subarray(0, cipherText.length - consts_1.AEAD_TAG_LENGTH);
        var tag = cipherText.subarray(-consts_1.AEAD_TAG_LENGTH);
        var decipher = (0, crypto_1.createDecipheriv)("aes-256-gcm", key, nonce);
        if (AAD) {
            decipher.setAAD(AAD);
        }
        decipher.setAuthTag(tag);
        var updated = decipher.update(encrypted);
        var finalized = decipher.final();
        return (0, utils_1.concatBytes)(updated, finalized);
    };
    return {
        tagLength: consts_1.AEAD_TAG_LENGTH,
        encrypt: encrypt,
        decrypt: decrypt,
    };
}
exports.aes256gcm = aes256gcm;
