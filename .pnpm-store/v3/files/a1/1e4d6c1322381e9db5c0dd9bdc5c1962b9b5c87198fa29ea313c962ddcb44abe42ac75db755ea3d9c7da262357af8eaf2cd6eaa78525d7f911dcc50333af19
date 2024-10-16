/**
 * AAD is only effective on AES-256-GCM or AES-128-GCM. Otherwise it'll be ignored
 */
export type Cipher = (key: Uint8Array, nonce: Uint8Array, AAD?: Uint8Array) => {
    keyLength: number;
    encrypt(plaintext: Uint8Array): Promise<Uint8Array>;
    decrypt(ciphertext: Uint8Array): Promise<Uint8Array>;
};
export declare const aes_128_ctr: Cipher;
export declare const aes_256_ctr: Cipher;
export declare const aes_128_cbc: Cipher;
export declare const aes_256_cbc: Cipher;
export declare const aes_128_gcm: Cipher;
export declare const aes_256_gcm: Cipher;
//# sourceMappingURL=aes.d.ts.map