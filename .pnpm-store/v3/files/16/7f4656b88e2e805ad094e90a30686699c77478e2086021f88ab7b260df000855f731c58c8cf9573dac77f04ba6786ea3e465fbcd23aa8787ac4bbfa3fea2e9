var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Jws } from '../../../utils/jws.js';
import { MemoryCache } from '../../../utils/memory-cache.js';
import { validateJsonSchema } from '../../../schema-validator.js';
import { DwnError, DwnErrorCode } from '../../../core/dwn-error.js';
/**
 * Verifies the signature(s) of a General JWS.
 */
export class GeneralJwsVerifier {
    constructor(cache) {
        this.cache = cache || new MemoryCache(600);
    }
    static get singleton() {
        if (GeneralJwsVerifier._singleton === undefined) {
            GeneralJwsVerifier._singleton = new GeneralJwsVerifier();
        }
        return GeneralJwsVerifier._singleton;
    }
    /**
     * Verifies the signatures of the given General JWS.
     * @returns the list of signers that have valid signatures.
     */
    static verifySignatures(jws, didResolver) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield GeneralJwsVerifier.singleton.verifySignatures(jws, didResolver);
        });
    }
    /**
     * Verifies the signatures of the given General JWS.
     * @returns the list of signers that have valid signatures.
     */
    verifySignatures(jws, didResolver) {
        return __awaiter(this, void 0, void 0, function* () {
            const signers = [];
            for (const signatureEntry of jws.signatures) {
                let isVerified;
                const kid = Jws.getKid(signatureEntry);
                const cacheKey = `${signatureEntry.protected}.${jws.payload}.${signatureEntry.signature}`;
                const cachedValue = yield this.cache.get(cacheKey);
                // explicit `undefined` check to differentiate `false`
                if (cachedValue === undefined) {
                    const publicJwk = yield GeneralJwsVerifier.getPublicKey(kid, didResolver);
                    isVerified = yield Jws.verifySignature(jws.payload, signatureEntry, publicJwk);
                    yield this.cache.set(cacheKey, isVerified);
                }
                else {
                    isVerified = cachedValue;
                }
                const did = Jws.extractDid(kid);
                if (isVerified) {
                    signers.push(did);
                }
                else {
                    throw new DwnError(DwnErrorCode.GeneralJwsVerifierInvalidSignature, `Signature verification failed for ${did}`);
                }
            }
            return { signers };
        });
    }
    /**
     * Gets the public key given a fully qualified key ID (`kid`) by resolving the DID to its DID Document.
     */
    static getPublicKey(kid, didResolver) {
        return __awaiter(this, void 0, void 0, function* () {
            // `resolve` throws exception if DID is invalid, DID method is not supported,
            // or resolving DID fails
            const did = Jws.extractDid(kid);
            const { didDocument } = yield didResolver.resolve(did);
            const { verificationMethod: verificationMethods = [] } = didDocument || {};
            let verificationMethod;
            for (const method of verificationMethods) {
                // consider optimizing using a set for O(1) lookups if needed
                // key ID in DID Document may or may not be fully qualified. e.g.
                // `did:ion:alice#key1` or `#key1`
                if (kid.endsWith(method.id)) {
                    verificationMethod = method;
                    break;
                }
            }
            if (!verificationMethod) {
                throw new DwnError(DwnErrorCode.GeneralJwsVerifierGetPublicKeyNotFound, 'public key needed to verify signature not found in DID Document');
            }
            validateJsonSchema('JwkVerificationMethod', verificationMethod);
            const { publicKeyJwk: publicJwk } = verificationMethod;
            return publicJwk;
        });
    }
}
//# sourceMappingURL=verifier.js.map