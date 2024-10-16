import type { PrivateJwk, PublicJwk } from '../types/jose-types.js';
export declare enum KeyDerivationScheme {
    /**
     * Key derivation using the `dataFormat` value for Flat-space records.
     */
    DataFormats = "dataFormats",
    ProtocolContext = "protocolContext",
    ProtocolPath = "protocolPath",
    /**
     * Key derivation using the `schema` value for Flat-space records.
     */
    Schemas = "schemas"
}
export type DerivedPrivateJwk = {
    rootKeyId: string;
    derivationScheme: KeyDerivationScheme;
    derivationPath?: string[];
    derivedPrivateKey: PrivateJwk;
};
/**
 * Class containing hierarchical deterministic key related utility methods used by the DWN.
 */
export declare class HdKey {
    /**
     * Derives a descendant private key.
     * NOTE: currently only supports SECP256K1 keys.
     */
    static derivePrivateKey(ancestorKey: DerivedPrivateJwk, subDerivationPath: string[]): Promise<DerivedPrivateJwk>;
    /**
     * Derives a descendant public key from an ancestor private key.
     * NOTE: currently only supports SECP256K1 keys.
     */
    static derivePublicKey(ancestorKey: DerivedPrivateJwk, subDerivationPath: string[]): Promise<PublicJwk>;
    /**
     * Derives a hardened hierarchical deterministic private key.
     */
    static derivePrivateKeyBytes(privateKey: Uint8Array, relativePath: string[]): Promise<Uint8Array>;
    /**
     * Derives a key using  HMAC-based Extract-and-Expand Key Derivation Function (HKDF) as defined in RFC 5869.
     * TODO: Consolidate HKDF implementation and usage with web5-js - https://github.com/TBD54566975/dwn-sdk-js/issues/742
     */
    static deriveKeyUsingHkdf(params: {
        hashAlgorithm: 'SHA-256' | 'SHA-384' | 'SHA-512';
        initialKeyMaterial: Uint8Array;
        info: Uint8Array;
        keyLengthInBytes: number;
    }): Promise<Uint8Array>;
    /**
     * Validates that no empty strings exist within the derivation path segments array.
     * @throws {DwnError} with `DwnErrorCode.HdKeyDerivationPathInvalid` if derivation path fails validation.
     */
    private static validateKeyDerivationPath;
}
//# sourceMappingURL=hd-key.d.ts.map