import type { GeneralJws } from '../types/jws-types.js';
import type { SignatureEntry } from '../types/jws-types.js';
import type { Signer } from '../types/signer.js';
import type { KeyMaterial, PublicJwk } from '../types/jose-types.js';
/**
 * Utility class for JWS related operations.
 */
export declare class Jws {
    /**
     * Gets the `kid` from a general JWS signature entry.
     */
    static getKid(signatureEntry: SignatureEntry): string;
    /**
     * Gets the signer DID from a general JWS signature entry.
     */
    static getSignerDid(signatureEntry: SignatureEntry): string;
    /**
     * Verifies the signature against the given payload.
     * @returns `true` if signature is valid; `false` otherwise
     */
    static verifySignature(base64UrlPayload: string, signatureEntry: SignatureEntry, jwkPublic: PublicJwk): Promise<boolean>;
    /**
     * Decodes the payload of the given JWS object as a plain object.
     */
    static decodePlainObjectPayload(jws: GeneralJws): any;
    /**
     * Extracts the DID from the given `kid` string.
     */
    static extractDid(kid: string): string;
    /**
     * Creates a Signer[] from the given Personas.
     */
    static createSigners(keyMaterials: KeyMaterial[]): Signer[];
    /**
     * Creates a Signer from the given Persona.
     */
    static createSigner(keyMaterial: KeyMaterial): Signer;
}
//# sourceMappingURL=jws.d.ts.map