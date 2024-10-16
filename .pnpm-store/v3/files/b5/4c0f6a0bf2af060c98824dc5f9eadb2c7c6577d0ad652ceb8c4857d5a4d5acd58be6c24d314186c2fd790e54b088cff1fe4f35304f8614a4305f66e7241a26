import type { BearerDid } from '@web5/dids';
import type { IPresentation } from '@sphereon/ssi-types';
/** The default type for a Verifiable Presentation. */
export declare const DEFAULT_VP_TYPE = "VerifiablePresentation";
/**
 * A Verifiable Presentation
 *
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials | VC Data Model}
 */
export type VpDataModel = IPresentation;
/**
 * Options for creating a verifiable presentation.
 * @param holder The holder URI of the presentation, as a string.
 * @param vcJwts The JWTs of the credentials to be included in the presentation.
 * @param type Optional. The type of the presentation, can be a string or an array of strings.
 * @param additionalData Optional additional data to be included in the presentation.
 */
export type VerifiablePresentationCreateOptions = {
    /** The holder URI of the presentation, as a string. */
    holder: string;
    /** The JWTs of the credentials to be included in the presentation. */
    vcJwts: string[];
    /** The type of the presentation, can be a string or an array of strings. */
    type?: string | string[];
    /** Optional additional data to be included in the presentation. */
    additionalData?: Record<string, any>;
};
/**
 * Options for signing a verifiable presentation.
 * @param did - The holder DID of the presentation, represented as a PortableDid.
 */
export type VerifiablePresentationSignOptions = {
    /** The holder DID of the presentation, represented as a PortableDid. */
    did: BearerDid;
};
/**
 * `VerifiablePresentation` is a tamper-evident presentation encoded in such a way that authorship of the data
 * can be trusted after a process of cryptographic verification.
 * [W3C Verifiable Presentation Data Model](https://www.w3.org/TR/vc-data-model/#presentations).
 *
 * It provides functionalities to sign, verify, and create presentations, offering a concise API to
 * work with JWT representations of verifiable presentations and ensuring that the signatures
 * and claims within those JWTs can be validated.
 *
 * @property vpDataModel The [vpDataModel] instance representing the core data model of a verifiable presentation.
 */
export declare class VerifiablePresentation {
    vpDataModel: VpDataModel;
    constructor(vpDataModel: VpDataModel);
    /** The type of the Verifiable Presentation. */
    get type(): string;
    /** The holder of the Verifiable Presentation. */
    get holder(): string;
    /** The verifiable credentials contained in the Verifiable Presentation. */
    get verifiableCredential(): string[];
    /**
     * Signs the verifiable presentation and returns it as a signed JWT.
     *
     * @example
     * ```ts
     * const vpJwt = verifiablePresentation.sign({ did: myDid });
     * ```
     *
     * @param options - The sign options used to sign the presentation.
     * @returns The JWT representing the signed verifiable presentation.
     */
    sign(options: VerifiablePresentationSignOptions): Promise<string>;
    /**
     * Converts the current object to its JSON representation.
     *
     * @returns The JSON representation of the object.
     */
    toString(): string;
    /**
     * Create a [VerifiablePresentation] based on the provided parameters.
     *
     * @example
     * ```ts
     * const vp = await VerifiablePresentation.create({
     *     type: 'PresentationSubmission',
     *     holder: 'did:ex:holder',
     *     vcJwts: vcJwts,
     *     additionalData: { 'arbitrary': 'data' }
     *   })
     * ```
     *
     * @param options - The options to use when creating the Verifiable Presentation.
     * @returns A [VerifiablePresentation] instance.
     */
    static create(options: VerifiablePresentationCreateOptions): Promise<VerifiablePresentation>;
    /**
     * Verifies the integrity and authenticity of a Verifiable Presentation (VP) encoded as a JSON Web Token (JWT).
     *
     * This function performs several crucial validation steps to ensure the trustworthiness of the provided VP:
     * - Parses and validates the structure of the JWT.
     * - Ensures the presence of critical header elements `alg` and `kid` in the JWT header.
     * - Resolves the Decentralized Identifier (DID) and retrieves the associated DID Document.
     * - Validates the DID and establishes a set of valid verification method IDs.
     * - Identifies the correct Verification Method from the DID Document based on the `kid` parameter.
     * - Verifies the JWT's signature using the public key associated with the Verification Method.
     *
     * If any of these steps fail, the function will throw a [Error] with a message indicating the nature of the failure.
     *
     * @example
     * ```ts
     * try {
     *     VerifiablePresentation.verify({ vpJwt: signedVpJwt })
     *     console.log("VC Verification successful!")
     * } catch (e: Error) {
     *     console.log("VC Verification failed: ${e.message}")
     * }
     * ```
     *
     * @param vpJwt The Verifiable Presentation in JWT format as a [string].
     * @throws Error if the verification fails at any step, providing a message with failure details.
     * @throws Error if critical JWT header elements are absent.
     */
    static verify({ vpJwt }: {
        vpJwt: string;
    }): Promise<{
        /** The issuer of the VP */
        issuer: string;
        /** The subject of the VP. */
        subject: string;
        /** The VP data model object. */
        vp: IPresentation;
    }>;
    /**
     * Parses a JWT into a [VerifiablePresentation] instance.
     *
     * @example
     * ```ts
     * const vp = VerifiablePresentation.parseJwt({ vpJwt: signedVpJwt })
     * ```
     *
     * @param vpJwt The verifiable presentation JWT as a [String].
     * @returns A [VerifiablePresentation] instance derived from the JWT.
     */
    static parseJwt({ vpJwt }: {
        vpJwt: string;
    }): VerifiablePresentation;
}
//# sourceMappingURL=verifiable-presentation.d.ts.map