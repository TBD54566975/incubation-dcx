import type { PrivateJwk } from '../types/jose-types.js';
import type { Signer } from '../types/signer.js';
/**
 * Input to `PrivateKeySigner` constructor.
 */
export type PrivateKeySignerOptions = {
    /**
     * Private JWK to create the signer from.
     */
    privateJwk: PrivateJwk;
    /**
     * If not specified, the constructor will attempt to default/fall back to the `kid` value in the given `privateJwk`.
     */
    keyId?: string;
    /**
     * If not specified, the constructor will attempt to default/fall back to the `alg` value in the given `privateJwk`.
     */
    algorithm?: string;
};
/**
 * A signer that signs using a private key.
 */
export declare class PrivateKeySigner implements Signer {
    keyId: string;
    algorithm: string;
    private privateJwk;
    private signatureAlgorithm;
    constructor(options: PrivateKeySignerOptions);
    /**
     * Signs the given content and returns the signature as bytes.
     */
    sign(content: Uint8Array): Promise<Uint8Array>;
}
//# sourceMappingURL=private-key-signer.d.ts.map