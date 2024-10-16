"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aes_256_gcm = exports.aes_128_gcm = exports.aes_256_cbc = exports.aes_128_cbc = exports.aes_256_ctr = exports.aes_128_ctr = void 0;
const utils_js_1 = require("../utils.js");
const utils_js_2 = require("./utils.js");
function getCryptParams(algo, nonce, AAD) {
    const params = { name: algo };
    if (algo === 'AES-CTR') {
        return { ...params, counter: nonce, length: 64 };
    }
    else if (algo === 'AES-GCM') {
        return { ...params, iv: nonce, additionalData: AAD };
    }
    else if (algo === 'AES-CBC') {
        return { ...params, iv: nonce };
    }
    else {
        throw new Error('unknown aes cipher');
    }
}
function generate(algo, length) {
    const keyLength = length / 8;
    const keyParams = { name: algo, length };
    return (key, nonce, AAD) => {
        (0, utils_js_1.ensureBytes)(key, keyLength);
        const cryptParams = getCryptParams(algo, nonce, AAD);
        return {
            keyLength,
            async encrypt(plaintext) {
                (0, utils_js_1.ensureBytes)(plaintext);
                const cr = (0, utils_js_2.getWebcryptoSubtle)();
                const iKey = await cr.importKey('raw', key, keyParams, true, ['encrypt']);
                const cipher = await cr.encrypt(cryptParams, iKey, plaintext);
                return new Uint8Array(cipher);
            },
            async decrypt(ciphertext) {
                (0, utils_js_1.ensureBytes)(ciphertext);
                const cr = (0, utils_js_2.getWebcryptoSubtle)();
                const iKey = await cr.importKey('raw', key, keyParams, true, ['decrypt']);
                const plaintext = await cr.decrypt(cryptParams, iKey, ciphertext);
                return new Uint8Array(plaintext);
            },
        };
    };
}
exports.aes_128_ctr = generate('AES-CTR', 128);
exports.aes_256_ctr = generate('AES-CTR', 256);
exports.aes_128_cbc = generate('AES-CBC', 128);
exports.aes_256_cbc = generate('AES-CBC', 256);
exports.aes_128_gcm = generate('AES-GCM', 128);
exports.aes_256_gcm = generate('AES-GCM', 256);
//# sourceMappingURL=aes.js.map