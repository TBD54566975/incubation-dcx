"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveKey = exports.aesDecrypt = exports.aesEncrypt = void 0;
var chacha_1 = require("@noble/ciphers/chacha");
var utils_1 = require("@noble/ciphers/utils");
var utils_2 = require("@noble/ciphers/webcrypto/utils");
var hkdf_1 = require("@noble/hashes/hkdf");
var sha256_1 = require("@noble/hashes/sha256");
var config_1 = require("../config");
var consts_1 = require("../consts");
var compat_1 = require("./compat");
function aesEncrypt(key, plainText) {
    // TODO: Rename to symEncrypt
    return _exec(true, key, plainText);
}
exports.aesEncrypt = aesEncrypt;
function aesDecrypt(key, cipherText) {
    // TODO: Rename to symDecrypt
    return _exec(false, key, cipherText);
}
exports.aesDecrypt = aesDecrypt;
function deriveKey(master) {
    // 32 bytes shared secret for aes and xchacha20
    return (0, hkdf_1.hkdf)(sha256_1.sha256, master, undefined, undefined, 32);
}
exports.deriveKey = deriveKey;
function _exec(is_encryption, key, data) {
    var algorithm = (0, config_1.symmetricAlgorithm)();
    var callback = is_encryption ? _encrypt : _decrypt;
    if (algorithm === "aes-256-gcm") {
        return callback(compat_1.aes256gcm, key, data, (0, config_1.symmetricNonceLength)());
    }
    else if (algorithm === "xchacha20") {
        return callback(chacha_1.xchacha20poly1305, key, data, consts_1.XCHACHA20_NONCE_LENGTH);
    }
    else {
        throw new Error("Not implemented");
    }
}
function _encrypt(func, key, plainText, nonceLength) {
    var nonce = (0, utils_2.randomBytes)(nonceLength);
    var cipher = func(key, nonce);
    var ciphered = cipher.encrypt(plainText); // TAG + encrypted
    var encrypted = ciphered.subarray(0, ciphered.length - consts_1.AEAD_TAG_LENGTH);
    var tag = ciphered.subarray(-consts_1.AEAD_TAG_LENGTH);
    return (0, utils_1.concatBytes)(nonce, tag, encrypted);
}
function _decrypt(func, key, cipherText, nonceLength) {
    var nonceTagLength = nonceLength + consts_1.AEAD_TAG_LENGTH;
    var nonce = cipherText.subarray(0, nonceLength);
    var tag = cipherText.subarray(nonceLength, nonceTagLength);
    var encrypted = cipherText.subarray(nonceTagLength);
    var decipher = func(key, Uint8Array.from(nonce)); // to reset byteOffset
    var ciphered = (0, utils_1.concatBytes)(encrypted, tag);
    return decipher.decrypt(ciphered);
}
