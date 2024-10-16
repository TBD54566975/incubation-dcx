var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import isPlainObject from 'lodash/isPlainObject.js';
import { Encoder } from './encoder.js';
import { PrivateKeySigner } from './private-key-signer.js';
import { signatureAlgorithms } from '../jose/algorithms/signing/signature-algorithms.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
/**
 * Utility class for JWS related operations.
 */
export class Jws {
    /**
     * Gets the `kid` from a general JWS signature entry.
     */
    static getKid(signatureEntry) {
        const { kid } = Encoder.base64UrlToObject(signatureEntry.protected);
        return kid;
    }
    /**
     * Gets the signer DID from a general JWS signature entry.
     */
    static getSignerDid(signatureEntry) {
        const kid = Jws.getKid(signatureEntry);
        const did = Jws.extractDid(kid);
        return did;
    }
    /**
     * Verifies the signature against the given payload.
     * @returns `true` if signature is valid; `false` otherwise
     */
    static verifySignature(base64UrlPayload, signatureEntry, jwkPublic) {
        return __awaiter(this, void 0, void 0, function* () {
            const signatureAlgorithm = signatureAlgorithms[jwkPublic.crv];
            if (!signatureAlgorithm) {
                throw new DwnError(DwnErrorCode.JwsVerifySignatureUnsupportedCrv, `unsupported crv. crv must be one of ${Object.keys(signatureAlgorithms)}`);
            }
            const payload = Encoder.stringToBytes(`${signatureEntry.protected}.${base64UrlPayload}`);
            const signatureBytes = Encoder.base64UrlToBytes(signatureEntry.signature);
            return yield signatureAlgorithm.verify(payload, signatureBytes, jwkPublic);
        });
    }
    /**
     * Decodes the payload of the given JWS object as a plain object.
     */
    static decodePlainObjectPayload(jws) {
        let payloadJson;
        try {
            payloadJson = Encoder.base64UrlToObject(jws.payload);
        }
        catch (_a) {
            throw new DwnError(DwnErrorCode.JwsDecodePlainObjectPayloadInvalid, 'payload is not a JSON object');
        }
        if (!isPlainObject(payloadJson)) {
            throw new DwnError(DwnErrorCode.JwsDecodePlainObjectPayloadInvalid, 'signed payload must be a plain object');
        }
        return payloadJson;
    }
    /**
     * Extracts the DID from the given `kid` string.
     */
    static extractDid(kid) {
        const [did] = kid.split('#');
        return did;
    }
    /**
     * Creates a Signer[] from the given Personas.
     */
    static createSigners(keyMaterials) {
        const signers = keyMaterials.map((keyMaterial) => Jws.createSigner(keyMaterial));
        return signers;
    }
    /**
     * Creates a Signer from the given Persona.
     */
    static createSigner(keyMaterial) {
        const privateJwk = keyMaterial.keyPair.privateJwk;
        const keyId = keyMaterial.keyId;
        const signer = new PrivateKeySigner({ privateJwk, keyId });
        return signer;
    }
}
//# sourceMappingURL=jws.js.map