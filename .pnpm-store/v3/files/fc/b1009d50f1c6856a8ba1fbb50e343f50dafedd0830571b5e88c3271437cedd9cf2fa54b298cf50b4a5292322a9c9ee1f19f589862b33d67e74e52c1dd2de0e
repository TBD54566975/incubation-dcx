var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Base abstraction for all Decentralized Identifier (DID) method implementations.
 *
 * This base class serves as a foundational structure upon which specific DID methods
 * can be implemented. Subclasses should furnish particular method and data models adherent
 * to various DID methods, taking care to adhere to the
 * {@link https://www.w3.org/TR/did-core/ | W3C DID Core specification} and the
 * respective DID method specifications.
 */
export class DidMethod {
    /**
     * MUST be implemented by all DID method implementations that extend {@link DidMethod}.
     *
     * Given the W3C DID Document of a DID, return the verification method that will be used for
     * signing messages and credentials. If given, the `methodId` parameter is used to select the
     * verification method. If not given, each DID method implementation will select a default
     * verification method from the DID Document.
     *
     * @param _params - The parameters for the `getSigningMethod` operation.
     * @param _params.didDocument - DID Document to get the verification method from.
     * @param _params.methodId - ID of the verification method to use for signing.
     * @returns Verification method to use for signing.
     */
    static getSigningMethod(_params) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(`Not implemented: Classes extending DidMethod must implement getSigningMethod()`);
        });
    }
    /**
     * MUST be implemented by all DID method implementations that extend {@link DidMethod}.
     *
     * Resolves a DID URI to a DID Document.
     *
     * @param _didUri - The DID to be resolved.
     * @param _options - Optional parameters for resolving the DID.
     * @returns A Promise resolving to a {@link DidResolutionResult} object representing the result of the resolution.
     */
    static resolve(_didUri, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(`Not implemented: Classes extending DidMethod must implement resolve()`);
        });
    }
}
//# sourceMappingURL=did-method.js.map