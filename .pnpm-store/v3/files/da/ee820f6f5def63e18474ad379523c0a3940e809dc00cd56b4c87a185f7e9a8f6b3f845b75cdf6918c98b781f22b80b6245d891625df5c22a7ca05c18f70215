import { PEX } from '@sphereon/pex';
/**
 * The Presentation Exchange (PEX) Library implements the functionality described in the DIF Presentation Exchange specification
 */
export class PresentationExchange {
    /**
     * Selects credentials that satisfy a given presentation definition.
     *
     * @param params - The parameters for the credential selection.
     * @param params.vcJwts  The list of Verifiable Credentials to select from.
     * @param params.presentationDefinition The Presentation Definition to match against.
     * @returns {string[]} selectedVcJwts A list of Verifiable Credentials that satisfy the Presentation Definition.
     */
    static selectCredentials({ vcJwts, presentationDefinition }) {
        var _a, _b;
        this.resetPex();
        const selectResults = this.pex.selectFrom(presentationDefinition, vcJwts);
        // If errors exist in the results object the credentials provided didn't satisfy the requirements in the Presentation Definition
        if (((_a = selectResults.errors) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
            return [];
        }
        return Array.from(new Set((_b = selectResults.verifiableCredential) !== null && _b !== void 0 ? _b : []));
    }
    /**
     * Validates if a list of VC JWTs satisfies the given presentation definition.
     *
     * @param params - The parameters for the satisfaction check.
     * @param params.vcJwts - An array of VC JWTs as strings.
     * @param params.presentationDefinition - The criteria to validate against.
     * @throws Error if the evaluation results in warnings or errors.
     */
    static satisfiesPresentationDefinition({ vcJwts, presentationDefinition }) {
        var _a, _b, _c;
        this.resetPex();
        const evaluationResults = this.pex.evaluateCredentials(presentationDefinition, vcJwts);
        if ((_a = evaluationResults.warnings) === null || _a === void 0 ? void 0 : _a.length) {
            console.warn('Warnings were generated during the evaluation process: ' + JSON.stringify(evaluationResults.warnings));
        }
        if (evaluationResults.areRequiredCredentialsPresent.toString() !== 'info' || ((_b = evaluationResults.errors) === null || _b === void 0 ? void 0 : _b.length)) {
            let errorMessage = 'Failed to create Verifiable Presentation JWT due to: ';
            if (evaluationResults.areRequiredCredentialsPresent) {
                errorMessage += 'Required Credentials Not Present: ' + JSON.stringify(evaluationResults.areRequiredCredentialsPresent);
            }
            if ((_c = evaluationResults.errors) === null || _c === void 0 ? void 0 : _c.length) {
                errorMessage += 'Errors: ' + JSON.stringify(evaluationResults.errors);
            }
            throw new Error(errorMessage);
        }
    }
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
    static createPresentationFromCredentials({ vcJwts, presentationDefinition }) {
        var _a, _b, _c;
        this.resetPex();
        const pdValidated = PEX.validateDefinition(presentationDefinition);
        isValid(pdValidated);
        const evaluationResults = this.pex.evaluateCredentials(presentationDefinition, vcJwts);
        if ((_a = evaluationResults.warnings) === null || _a === void 0 ? void 0 : _a.length) {
            console.warn('Warnings were generated during the evaluation process: ' + JSON.stringify(evaluationResults.warnings));
        }
        if (evaluationResults.areRequiredCredentialsPresent.toString() !== 'info' || ((_b = evaluationResults.errors) === null || _b === void 0 ? void 0 : _b.length)) {
            let errorMessage = 'Failed to create Verifiable Presentation JWT due to: ';
            if (evaluationResults.areRequiredCredentialsPresent) {
                errorMessage += 'Required Credentials Not Present: ' + JSON.stringify(evaluationResults.areRequiredCredentialsPresent);
            }
            if ((_c = evaluationResults.errors) === null || _c === void 0 ? void 0 : _c.length) {
                errorMessage += 'Errors: ' + JSON.stringify(evaluationResults.errors);
            }
            throw new Error(errorMessage);
        }
        const presentationResult = this.pex.presentationFrom(presentationDefinition, vcJwts);
        const submissionValidated = PEX.validateSubmission(presentationResult.presentationSubmission);
        isValid(submissionValidated);
        return presentationResult;
    }
    /**
     * This method validates whether an object is usable as a presentation definition or not.
     *
     * @param {PresentationDefinitionV2} presentationDefinition: presentationDefinition to be validated.
     * @returns {Validated} the validation results to reveal what is acceptable/unacceptable about the passed object to be considered a valid presentation definition
     */
    static validateDefinition({ presentationDefinition }) {
        return PEX.validateDefinition(presentationDefinition);
    }
    /**
     * This method validates whether an object is usable as a presentation submission or not.
     *
     * @param {PresentationSubmission} presentationSubmission the object to be validated.
     * @returns {Validated} the validation results to reveal what is acceptable/unacceptable about the passed object to be considered a valid presentation submission
     */
    static validateSubmission({ presentationSubmission }) {
        return PEX.validateSubmission(presentationSubmission);
    }
    /**
     * Evaluates a presentation against a presentation definition.
     *
     * @returns {EvaluationResults} The result of the evaluation process.
     */
    static evaluatePresentation({ presentationDefinition, presentation }) {
        this.resetPex();
        return this.pex.evaluatePresentation(presentationDefinition, presentation);
    }
    /** Resets the PEX instance. */
    static resetPex() {
        this.pex = new PEX();
    }
}
/** The Presentation Exchange (PEX) instance. */
PresentationExchange.pex = new PEX();
function isValid(validated) {
    let errorMessage = 'Failed to pass validation check due to: ';
    if (Array.isArray(validated)) {
        if (!validated.every(item => item.status === 'info')) {
            errorMessage += 'Validation Errors: ' + JSON.stringify(validated);
            throw new Error(errorMessage);
        }
    }
    else {
        if (validated.status !== 'info') {
            errorMessage += 'Validation Errors: ' + JSON.stringify(validated);
            throw new Error(errorMessage);
        }
    }
}
//# sourceMappingURL=presentation-exchange.js.map