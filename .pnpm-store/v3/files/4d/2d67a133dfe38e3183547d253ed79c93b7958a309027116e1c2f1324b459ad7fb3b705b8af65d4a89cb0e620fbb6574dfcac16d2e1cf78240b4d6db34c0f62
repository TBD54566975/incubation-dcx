var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Encoder } from '../../../utils/encoder.js';
export class GeneralJwsBuilder {
    constructor(jws) {
        this.jws = jws;
    }
    static create(payload, signers = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const jws = {
                payload: Encoder.bytesToBase64Url(payload),
                signatures: []
            };
            const builder = new GeneralJwsBuilder(jws);
            for (const signer of signers) {
                yield builder.addSignature(signer);
            }
            return builder;
        });
    }
    addSignature(signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const protectedHeader = {
                kid: signer.keyId,
                alg: signer.algorithm
            };
            const protectedHeaderString = JSON.stringify(protectedHeader);
            const protectedHeaderBase64UrlString = Encoder.stringToBase64Url(protectedHeaderString);
            const signingInputString = `${protectedHeaderBase64UrlString}.${this.jws.payload}`;
            const signingInputBytes = Encoder.stringToBytes(signingInputString);
            const signatureBytes = yield signer.sign(signingInputBytes);
            const signature = Encoder.bytesToBase64Url(signatureBytes);
            this.jws.signatures.push({ protected: protectedHeaderBase64UrlString, signature });
        });
    }
    getJws() {
        return this.jws;
    }
}
//# sourceMappingURL=builder.js.map