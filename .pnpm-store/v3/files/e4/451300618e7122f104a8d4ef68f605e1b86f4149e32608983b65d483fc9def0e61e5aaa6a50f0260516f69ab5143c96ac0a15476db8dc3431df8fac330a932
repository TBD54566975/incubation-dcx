import { ensureBytes } from '../utils.js';
import { getWebcryptoSubtle } from './utils.js';
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
        ensureBytes(key, keyLength);
        const cryptParams = getCryptParams(algo, nonce, AAD);
        return {
            keyLength,
            async encrypt(plaintext) {
                ensureBytes(plaintext);
                const cr = getWebcryptoSubtle();
                const iKey = await cr.importKey('raw', key, keyParams, true, ['encrypt']);
                const cipher = await cr.encrypt(cryptParams, iKey, plaintext);
                return new Uint8Array(cipher);
            },
            async decrypt(ciphertext) {
                ensureBytes(ciphertext);
                const cr = getWebcryptoSubtle();
                const iKey = await cr.importKey('raw', key, keyParams, true, ['decrypt']);
                const plaintext = await cr.decrypt(cryptParams, iKey, ciphertext);
                return new Uint8Array(plaintext);
            },
        };
    };
}
export const aes_128_ctr = generate('AES-CTR', 128);
export const aes_256_ctr = generate('AES-CTR', 256);
export const aes_128_cbc = generate('AES-CBC', 128);
export const aes_256_cbc = generate('AES-CBC', 256);
export const aes_128_gcm = generate('AES-GCM', 128);
export const aes_256_gcm = generate('AES-GCM', 256);
//# sourceMappingURL=aes.js.map