import { Readable } from 'readable-stream';
/**
 * Utility class for performing common, non-DWN specific encryption operations.
 */
export declare class Encryption {
    /**
     * Encrypts the given plaintext stream using AES-256-CTR algorithm.
     */
    static aes256CtrEncrypt(key: Uint8Array, initializationVector: Uint8Array, plaintextStream: Readable): Promise<Readable>;
    /**
     * Decrypts the given cipher stream using AES-256-CTR algorithm.
     */
    static aes256CtrDecrypt(key: Uint8Array, initializationVector: Uint8Array, cipherStream: Readable): Promise<Readable>;
    /**
     * Encrypts the given plaintext using ECIES (Elliptic Curve Integrated Encryption Scheme)
     * with SECP256K1 for the asymmetric calculations, HKDF as the key-derivation function,
     * and AES-GCM for the symmetric encryption and MAC algorithms.
     */
    static eciesSecp256k1Encrypt(publicKeyBytes: Uint8Array, plaintext: Uint8Array): Promise<EciesEncryptionOutput>;
    /**
     * Decrypt the given plaintext using ECIES (Elliptic Curve Integrated Encryption Scheme)
     * with SECP256K1 for the asymmetric calculations, HKDF as the key-derivation function,
     * and AES-GCM for the symmetric encryption and MAC algorithms.
     */
    static eciesSecp256k1Decrypt(input: EciesEncryptionInput): Promise<Uint8Array>;
    /**
     * Expose eciesjs library configuration
     */
    static get isEphemeralKeyCompressed(): boolean;
}
export type EciesEncryptionOutput = {
    initializationVector: Uint8Array;
    ephemeralPublicKey: Uint8Array;
    ciphertext: Uint8Array;
    messageAuthenticationCode: Uint8Array;
};
export type EciesEncryptionInput = EciesEncryptionOutput & {
    privateKey: Uint8Array;
};
export declare enum EncryptionAlgorithm {
    Aes256Ctr = "A256CTR",
    EciesSecp256k1 = "ECIES-ES256K"
}
//# sourceMappingURL=encryption.d.ts.map