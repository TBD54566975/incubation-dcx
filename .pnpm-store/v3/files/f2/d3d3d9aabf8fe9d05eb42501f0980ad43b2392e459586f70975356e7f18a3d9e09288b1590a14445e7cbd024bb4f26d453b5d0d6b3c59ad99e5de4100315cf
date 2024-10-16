var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { signatureAlgorithms } from '../jose/algorithms/signing/signature-algorithms.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
/**
 * A signer that signs using a private key.
 */
export class PrivateKeySigner {
    constructor(options) {
        var _a, _b;
        if (options.keyId === undefined && options.privateJwk.kid === undefined) {
            throw new DwnError(DwnErrorCode.PrivateKeySignerUnableToDeduceKeyId, `Unable to deduce the key ID`);
        }
        // NOTE: `alg` is optional for a JWK as specified in https://datatracker.ietf.org/doc/html/rfc7517#section-4.4
        if (options.algorithm === undefined && options.privateJwk.alg === undefined) {
            throw new DwnError(DwnErrorCode.PrivateKeySignerUnableToDeduceAlgorithm, `Unable to deduce the signature algorithm`);
        }
        this.keyId = (_a = options.keyId) !== null && _a !== void 0 ? _a : options.privateJwk.kid;
        this.algorithm = (_b = options.algorithm) !== null && _b !== void 0 ? _b : options.privateJwk.alg;
        this.privateJwk = options.privateJwk;
        this.signatureAlgorithm = signatureAlgorithms[options.privateJwk.crv];
        if (!this.signatureAlgorithm) {
            throw new DwnError(DwnErrorCode.PrivateKeySignerUnsupportedCurve, `Unsupported crv ${options.privateJwk.crv}, crv must be one of ${Object.keys(signatureAlgorithms)}`);
        }
    }
    /**
     * Signs the given content and returns the signature as bytes.
     */
    sign(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const signatureBytes = yield this.signatureAlgorithm.sign(content, this.privateJwk);
            return signatureBytes;
        });
    }
}
//# sourceMappingURL=private-key-signer.js.map