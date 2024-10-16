import type { Cache } from '../../../types/cache.js';
import type { GeneralJws } from '../../../types/jws-types.js';
import type { DidResolver } from '@web5/dids';
type VerificationResult = {
    /** DIDs of all signers */
    signers: string[];
};
/**
 * Verifies the signature(s) of a General JWS.
 */
export declare class GeneralJwsVerifier {
    private static _singleton;
    cache: Cache;
    private constructor();
    private static get singleton();
    /**
     * Verifies the signatures of the given General JWS.
     * @returns the list of signers that have valid signatures.
     */
    static verifySignatures(jws: GeneralJws, didResolver: DidResolver): Promise<VerificationResult>;
    /**
     * Verifies the signatures of the given General JWS.
     * @returns the list of signers that have valid signatures.
     */
    verifySignatures(jws: GeneralJws, didResolver: DidResolver): Promise<VerificationResult>;
    /**
     * Gets the public key given a fully qualified key ID (`kid`) by resolving the DID to its DID Document.
     */
    private static getPublicKey;
}
export {};
//# sourceMappingURL=verifier.d.ts.map