var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GeneralJwsVerifier } from '../jose/jws/general/verifier.js';
import { RecordsWrite } from '../interfaces/records-write.js';
import { DwnError, DwnErrorCode } from './dwn-error.js';
/**
 * Verifies all the signature(s) within the authorization property.
 *
 * @throws {Error} if fails authentication
 */
export function authenticate(authorizationModel, didResolver) {
    return __awaiter(this, void 0, void 0, function* () {
        if (authorizationModel === undefined) {
            throw new DwnError(DwnErrorCode.AuthenticateJwsMissing, 'Missing JWS.');
        }
        yield GeneralJwsVerifier.verifySignatures(authorizationModel.signature, didResolver);
        if (authorizationModel.ownerSignature !== undefined) {
            yield GeneralJwsVerifier.verifySignatures(authorizationModel.ownerSignature, didResolver);
        }
        if (authorizationModel.authorDelegatedGrant !== undefined) {
            // verify the signature of the grantor of the author-delegated grant
            const authorDelegatedGrant = yield RecordsWrite.parse(authorizationModel.authorDelegatedGrant);
            yield GeneralJwsVerifier.verifySignatures(authorDelegatedGrant.message.authorization.signature, didResolver);
        }
        if (authorizationModel.ownerDelegatedGrant !== undefined) {
            // verify the signature of the grantor of the owner-delegated grant
            const ownerDelegatedGrant = yield RecordsWrite.parse(authorizationModel.ownerDelegatedGrant);
            yield GeneralJwsVerifier.verifySignatures(ownerDelegatedGrant.message.authorization.signature, didResolver);
        }
    });
}
/**
 * Authorizes owner authored message.
 * @throws {DwnError} if fails authorization.
 */
export function authorizeOwner(tenant, incomingMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        // if author is the same as the target tenant, we can directly grant access
        if (incomingMessage.author === tenant) {
            return;
        }
        else {
            throw new DwnError(DwnErrorCode.AuthorizationAuthorNotOwner, `Message authored by ${incomingMessage.author}, not authored by expected owner ${tenant}.`);
        }
    });
}
//# sourceMappingURL=auth.js.map