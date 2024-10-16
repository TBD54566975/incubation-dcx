var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { DidInterface } from '@web5/agent';
/**
 * The DID API is used to resolve DIDs.
 *
 * @beta
 */
export class DidApi {
    constructor(options) {
        this.agent = options.agent;
        this.connectedDid = options.connectedDid;
    }
    /**
     * Initiates the creation of a Decentralized Identifier (DID) using the specified method, options,
     * and storage preference.
     *
     * This method sends a request to the Web5 Agent to create a new DID based on the provided method,
     * with method-specific options. It also specifies whether the newly created DID should be stored.
     *
     * @param request - The request parameters for creating a DID, including the method, options, and
     *                  storage flag.
     * @returns A promise that resolves to a `DidCreateResponse`, which includes the operation's
     *          status and, if successful, the newly created DID.
     */
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.agent.processDidRequest({
                messageType: DidInterface.Create,
                messageParams: Object.assign({}, request)
            }), { result } = _a, status = __rest(_a, ["result"]);
            return Object.assign({ did: result }, status);
        });
    }
    /**
     * Resolves a DID to a DID Resolution Result.
     *
     * @param didUri - The DID or DID URL to resolve.
     * @returns A promise that resolves to the DID Resolution Result.
     */
    resolve(didUri, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { result: didResolutionResult } = yield this.agent.processDidRequest({
                messageParams: { didUri, options },
                messageType: DidInterface.Resolve
            });
            return didResolutionResult;
        });
    }
}
//# sourceMappingURL=did-api.js.map