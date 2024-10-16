import type { IPresentation, PresentationSubmission } from '@sphereon/ssi-types';
import type { PresentationDefinitionV2 as PexPresDefV2 } from '@sphereon/pex-models';
import type { EvaluationResults, PresentationResult, Validated as PexValidated } from '@sphereon/pex';
/** The Presentation Definition V2 as defined in the PEX models. */
export interface PresentationDefinitionV2 extends PexPresDefV2 {
}
/** The validated object as defined in the PEX models. */
export type Validated = PexValidated;
/**
 * The Presentation Exchange (PEX) Library implements the functionality described in the DIF Presentation Exchange specification
 */
export declare class PresentationExchange {
    /** The Presentation Exchange (PEX) instance. */
    private static pex;
    /**
     * Selects credentials that satisfy a given presentation definition.
     *
     * @param params - The parameters for the credential selection.
     * @param params.vcJwts  The list of Verifiable Credentials to select from.
     * @param params.presentationDefinition The Presentation Definition to match against.
     * @returns {string[]} selectedVcJwts A list of Verifiable Credentials that satisfy the Presentation Definition.
     */
    static selectCredentials({ vcJwts, presentationDefinition }: {
        vcJwts: string[];
        presentationDefinition: PresentationDefinitionV2;
    }): string[];
    /**
     * Validates if a list of VC JWTs satisfies the given presentation definition.
     *
     * @param params - The parameters for the satisfaction check.
     * @param params.vcJwts - An array of VC JWTs as strings.
     * @param params.presentationDefinition - The criteria to validate against.
     * @throws Error if the evaluation results in warnings or errors.
     */
    static satisfiesPresentationDefinition({ vcJwts, presentationDefinition }: {
        vcJwts: string[];
        presentationDefinition: PresentationDefinitionV2;
    }): void;
    /**
     * Creates a presentation from a list of Verifiable Credentials that satisfy a given presentation definition.
     * This function initializes the Presentation Exchange (PEX) process, validates the presentation definition,
     * evaluates the credentials against the definition, and finally constructs the presentation result if the
     * evaluation is successful.
     *
     * @param params - The parameters for the presentation creation.
     * @param params.vcJwts The list of Verifiable Credentials (VCs) in JWT format to be evaluated.
     * @param params.presentationDefinition The Presentation Definition V2 to match the VCs against.
     * @returns {PresentationResult} The result of the presentation creation process, containing a presentation submission
     *                               that satisfies the presentation definition criteria.
     * @throws {Error} If the evaluation results in warnings or errors, or if the required credentials are not present,
     *                 an error is thrown with a descriptive message.
     */
    static createPresentationFromCredentials({ vcJwts, presentationDefinition }: {
        vcJwts: string[];
        presentationDefinition: PresentationDefinitionV2;
    }): PresentationResult;
    /**
     * This method validates whether an object is usable as a presentation definition or not.
     *
     * @param {PresentationDefinitionV2} presentationDefinition: presentationDefinition to be validated.
     * @returns {Validated} the validation results to reveal what is acceptable/unacceptable about the passed object to be considered a valid presentation definition
     */
    static validateDefinition({ presentationDefinition }: {
        presentationDefinition: PresentationDefinitionV2;
    }): Validated;
    /**
     * This method validates whether an object is usable as a presentation submission or not.
     *
     * @param {PresentationSubmission} presentationSubmission the object to be validated.
     * @returns {Validated} the validation results to reveal what is acceptable/unacceptable about the passed object to be considered a valid presentation submission
     */
    static validateSubmission({ presentationSubmission }: {
        presentationSubmission: PresentationSubmission;
    }): Validated;
    /**
     * Evaluates a presentation against a presentation definition.
     *
     * @returns {EvaluationResults} The result of the evaluation process.
     */
    static evaluatePresentation({ presentationDefinition, presentation }: {
        presentationDefinition: PresentationDefinitionV2;
        presentation: IPresentation;
    }): EvaluationResults;
    /** Resets the PEX instance. */
    private static resetPex;
}
//# sourceMappingURL=presentation-exchange.d.ts.map