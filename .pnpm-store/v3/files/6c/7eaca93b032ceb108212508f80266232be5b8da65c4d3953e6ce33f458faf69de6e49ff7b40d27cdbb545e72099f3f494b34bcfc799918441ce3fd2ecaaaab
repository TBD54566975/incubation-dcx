import type { PrivateJwk, PublicJwk } from '../types/jose-types.js';
/**
 * Class containing SECP256K1 related utility methods.
 */
export declare class Secp256k1 {
    /**
     * Validates the given JWK is a SECP256K1 key.
     * @throws {Error} if fails validation.
     */
    static validateKey(jwk: PrivateJwk | PublicJwk): void;
    /**
     * Converts a public key in bytes into a JWK.
     */
    static publicKeyToJwk(publicKeyBytes: Uint8Array): Promise<PublicJwk>;
    /**
     * Converts a private key in bytes into a JWK.
     */
    static privateKeyToJwk(privateKeyBytes: Uint8Array): Promise<PrivateJwk>;
    /**
     * Creates a compressed key in raw bytes from the given SECP256K1 JWK.
     */
    static publicJwkToBytes(publicJwk: PublicJwk): Uint8Array;
    /**
     * Creates a private key in raw bytes from the given SECP256K1 JWK.
     */
    static privateJwkToBytes(privateJwk: PrivateJwk): Uint8Array;
    /**
     * Signs the provided content using the provided JWK.
     */
    static sign(content: Uint8Array, privateJwk: PrivateJwk): Promise<Uint8Array>;
    /**
     * Verifies a signature against the provided payload hash and public key.
     * @returns a boolean indicating whether the signature is valid.
     */
    static verify(content: Uint8Array, signature: Uint8Array, publicJwk: PublicJwk): Promise<boolean>;
    /**
     * Generates a random key pair in JWK format.
     */
    static generateKeyPair(): Promise<{
        publicJwk: PublicJwk;
        privateJwk: PrivateJwk;
    }>;
    /**
     * Generates key pair in raw bytes, where the `publicKey` is compressed.
     */
    static generateKeyPairRaw(): Promise<{
        publicKey: Uint8Array;
        privateKey: Uint8Array;
    }>;
    /**
     * Gets the compressed public key of the given private key.
     */
    static getPublicKey(privateKey: Uint8Array): Promise<Uint8Array>;
    /**
     * Gets the public JWK of the given private JWK.
     */
    static getPublicJwk(privateKeyJwk: PrivateJwk): Promise<PublicJwk>;
}
//# sourceMappingURL=secp256k1.d.ts.map