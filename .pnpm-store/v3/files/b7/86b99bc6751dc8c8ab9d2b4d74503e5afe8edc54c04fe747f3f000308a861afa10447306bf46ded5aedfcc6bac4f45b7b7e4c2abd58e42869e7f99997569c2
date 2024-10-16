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
 * Represents a Web5 Identity with its DID and metadata.
 */
export class BearerIdentity {
    constructor({ did, metadata }) {
        this.did = did;
        this.metadata = metadata;
    }
    /**
     * Converts a `BearerIdentity` object to a portable format containing the DID and metadata
     * associated with the Identity.
     *
     * @example
     * ```ts
     * // Assuming `identity` is an instance of BearerIdentity.
     * const portableIdentity = await identity.export();
     * // portableIdentity now contains the and metadata.
     * ```
     *
     * @returns A `PortableIdentity` containing the DID and metadata associated with the
     *          `BearerIdentity`.
     */
    export() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                portableDid: yield this.did.export(),
                metadata: this.metadata
            };
        });
    }
}
//# sourceMappingURL=bearer-identity.js.map