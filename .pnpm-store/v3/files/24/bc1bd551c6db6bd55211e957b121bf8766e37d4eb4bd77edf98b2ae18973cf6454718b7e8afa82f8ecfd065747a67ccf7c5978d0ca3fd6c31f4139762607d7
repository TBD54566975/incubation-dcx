import type { PrivateJwk, PublicJwk } from '../types/jose-types.js';
/**
 * Class containing SECP256R1 related utility methods.
 */
export declare class Secp256r1 {
    /**
     * Validates the given JWK is a SECP256R1 key.
     * @throws {Error} if fails validation.
     */
    static validateKey(jwk: PrivateJwk | PublicJwk): void;
    /**
     * Converts a public key in bytes into a JWK.
     */
    static publicKeyToJwk(publicKeyBytes: Uint8Array): Promise<PublicJwk>;
    /**
     * Creates a private key in raw bytes from the given SECP256R1 JWK.
     */
    static privateJwkToBytes(privateJwk: PrivateJwk): Uint8Array;
    /**
     * Signs the provided content using the provided JWK.
     * Signature that is outputted is JWS format, not DER.
     */
    static sign(content: Uint8Array, privateJwk: PrivateJwk): Promise<Uint8Array>;
    /**
     * Verifies a signature against the provided payload hash and public key.
     * @param signature - the signature to verify. Can be in either DER or compact format. If using Oracle Cloud KMS, keys will be DER formatted.
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
    static bytesToBigInt(b: Uint8Array): bigint;
}
//# sourceMappingURL=secp256r1.d.ts.map