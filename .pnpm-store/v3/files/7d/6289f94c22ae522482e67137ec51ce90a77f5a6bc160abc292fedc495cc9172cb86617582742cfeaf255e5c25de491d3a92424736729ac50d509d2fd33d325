import type { JoseHeaderParams } from './jws.js';
/**
 * JSON Web Encryption (JWE) Header Parameters
 *
 * The Header Parameter names for use in JWEs are registered in the IANA "JSON Web Signature and
 * Encryption Header Parameters" registry.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1 | RFC 7516, Section 4.1}
 */
export interface JweHeaderParams extends JoseHeaderParams {
    /**
     * Algorithm Header Parameter
     *
     * Identifies the cryptographic algorithm used to encrypt or determine the value of the Content
     * Encryption Key (CEK). The encrypted content is not usable if the "alg" value does not represent
     * a supported algorithm, or if the recipient does not have a key that can be used with that
     * algorithm.
     *
     * "alg" values should either be registered in the IANA "JSON Web Signature and Encryption
     * Algorithms" registry or be a value that contains a Collision-Resistant Name. The "alg" value is
     * a case-sensitive ASCII string.  This Header Parameter MUST be present and MUST be understood
     * and processed by implementations.
     *
     * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.1 | RFC 7516, Section 4.1.1}
     */
    alg: 'A128KW' | 'A192KW' | 'A256KW' | 'dir' | 'ECDH-ES' | 'ECDH-ES+A128KW' | 'ECDH-ES+A192KW' | 'ECDH-ES+A256KW' | 'A128GCMKW' | 'A192GCMKW' | 'A256GCMKW' | 'PBES2-HS256+A128KW' | 'PBES2-HS384+A192KW' | 'PBES2-HS512+A256KW' | 'PBES2-HS512+XC20PKW' | string;
    /**
     * Agreement PartyUInfo Header Parameter
     *
     * The "apu" (agreement PartyUInfo) value is a base64url-encoded octet sequence containing
     * information about the producer of the JWE.  This information is used by the recipient to
     * determine the key agreement algorithm and key encryption algorithm to use to decrypt the JWE.
     *
     * Note: This parameter is intended only for use when the recipient is a key agreement algorithm
     * that uses public key cryptography.
     */
    apu?: Uint8Array;
    /**
     * Agreement PartyVInfo Header Parameter
     *
     * The "apv" (agreement PartyVInfo) value is a base64url-encoded octet sequence containing
     * information about the recipient of the JWE.  This information is used by the recipient to
     * determine the key agreement algorithm and key encryption algorithm to use to decrypt the JWE.
     *
     * Note: This parameter is intended only for use when the recipient is a key agreement algorithm
     * that uses public key cryptography.
     */
    apv?: Uint8Array;
    /**
     * Critical Header Parameter
     *
     * Indicates that extensions to JOSE RFCs are being used that MUST be understood and processed.
     */
    crit?: string[];
    /**
     * Encryption Algorithm Header Parameter
     *
     * Identifies the content encryption algorithm used to encrypt and integrity-protect (also
     * known as "authenticated encryption") the plaintext and to integrity-protect the Additional
     * Authenticated Data (AAD), if any.  This algorithm MUST be an AEAD algorithm with a specified
     * key length.
     *
     * The encrypted content is not usable if the "enc" value does not represent a supported
     * algorithm.  "enc" values should either be registered in the IANA "JSON Web Signature and
     * Encryption Algorithms" registry or be a value that contains a Collision-Resistant Name. The
     * "enc" value is a case-sensitive ASCII string containing a StringOrURI value. This Header
     * Parameter MUST be present and MUST be understood and processed by implementations.
     *
     * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.2 | RFC 7516, Section 4.1.2}
     */
    enc: 'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512' | 'A128GCM' | 'A192GCM' | 'A256GCM' | 'XC20P' | string;
    /**
     * Ephemeral Public Key Header Parameter
     *
     * The "epk" (ephemeral public key) value created by the originator for the use in key agreement
     * algorithms.  It is the ephemeral public key that corresponds to the key used to encrypt the
     * JWE.  This value is represented as a JSON Web Key (JWK).
     *
     * Note: This parameter is intended only for use when the recipient is a key agreement algorithm
     * that uses public key cryptography.
     */
    epk?: Uint8Array;
    /**
     * Initialization Vector Header Parameter
     *
     * The "iv" (initialization vector) value is a base64url-encoded octet sequence used by the
     * specified "enc" algorithm.  The length of this Initialization Vector value MUST be exactly
     * equal to the value that would be produced by the "enc" algorithm.
     *
     * Note: With symmetric encryption algorithms such as AES GCM, this Header Parameter MUST
     * be present and MUST be understood and processed by implementations.
     */
    iv?: Uint8Array;
    /**
     * PBES2 Count Header Parameter
     *
     * The "p2c" (PBES2 count) value is an integer indicating the number of iterations of the PBKDF2
     * algorithm performed during key derivation.
     *
     * Note: The iteration count adds computational expense, ideally compounded by the possible range
     * of keys introduced by the salt.  A minimum iteration count of 1000 is RECOMMENDED.
     */
    p2c?: number;
    /**
     * PBES2 Salt Input Header Parameter
     *
     * The "p2s" (PBES2 salt) value is a base64url-encoded octet sequence used as the salt value
     * input to the PBKDF2 algorithm during key derivation.
     *
     * The salt value used is (UTF8(Alg) || 0x00 || Salt Input), where Alg is the "alg" (algorithm)
     * Header Parameter value.
     *
     * Note: The salt value is used to ensure that each key derived from the master key is
     * independent of every other key. A suitable source of salt value is a sequence of
     * cryptographically random bytes containing 8 or more octets.
     */
    p2s?: string;
    /**
     * Authentication Tag Header Parameter
     *
     * The "tag" value is a base64url-encoded octet sequence containing the value of the
     * Authentication Tag output by the specified "enc" algorithm.  The length of this
     * Authentication Tag value MUST be exactly equal to the value that would be produced by the
     * "enc" algorithm.
     *
     * Note: With authenticated encryption algorithms such as AES GCM, this Header Parameter MUST
     * be present and MUST be understood and processed by implementations.
     */
    tag?: Uint8Array;
    /**
     * Additional Public or Private Header Parameter names.
     */
    [key: string]: unknown;
}
//# sourceMappingURL=jwe.d.ts.map