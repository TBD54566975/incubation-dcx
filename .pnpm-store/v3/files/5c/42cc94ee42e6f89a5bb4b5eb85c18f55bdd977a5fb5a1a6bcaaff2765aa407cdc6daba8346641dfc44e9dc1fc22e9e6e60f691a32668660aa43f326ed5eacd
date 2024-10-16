var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GrantAuthorization } from './grant-authorization.js';
import { PermissionConditionPublication } from '../types/permission-types.js';
import { DwnError, DwnErrorCode } from './dwn-error.js';
export class RecordsGrantAuthorization {
    /**
     * Authorizes the given RecordsWrite in the scope of the DID given.
     */
    static authorizeWrite(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recordsWriteMessage, expectedGrantor, expectedGrantee, permissionGrant, messageStore } = input;
            yield GrantAuthorization.performBaseValidation({
                incomingMessage: recordsWriteMessage,
                expectedGrantor,
                expectedGrantee,
                permissionGrant,
                messageStore
            });
            // NOTE: validated the invoked permission is for Records in GrantAuthorization.performBaseValidation()
            RecordsGrantAuthorization.verifyScope(recordsWriteMessage, permissionGrant.scope);
            RecordsGrantAuthorization.verifyConditions(recordsWriteMessage, permissionGrant.conditions);
        });
    }
    /**
     * Authorizes a RecordsReadMessage using the given permission grant.
     * @param messageStore Used to check if the given grant has been revoked.
     */
    static authorizeRead(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recordsReadMessage, recordsWriteMessageToBeRead, expectedGrantor, expectedGrantee, permissionGrant, messageStore } = input;
            yield GrantAuthorization.performBaseValidation({
                incomingMessage: recordsReadMessage,
                expectedGrantor,
                expectedGrantee,
                permissionGrant,
                messageStore
            });
            // NOTE: validated the invoked permission is for Records in GrantAuthorization.performBaseValidation()
            RecordsGrantAuthorization.verifyScope(recordsWriteMessageToBeRead, permissionGrant.scope);
        });
    }
    /**
     * Authorizes the scope of a permission grant for RecordsQuery or RecordsSubscribe.
     * @param messageStore Used to check if the grant has been revoked.
     */
    static authorizeQueryOrSubscribe(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { incomingMessage, expectedGrantor, expectedGrantee, permissionGrant, messageStore } = input;
            yield GrantAuthorization.performBaseValidation({
                incomingMessage,
                expectedGrantor,
                expectedGrantee,
                permissionGrant,
                messageStore
            });
            // If the grant specifies a protocol, the subscribe or query must specify the same protocol.
            // NOTE: validated the invoked permission is for Records in GrantAuthorization.performBaseValidation()
            const permissionScope = permissionGrant.scope;
            const protocolInGrant = permissionScope.protocol;
            const protocolInMessage = incomingMessage.descriptor.filter.protocol;
            if (protocolInGrant !== undefined && protocolInMessage !== protocolInGrant) {
                throw new DwnError(DwnErrorCode.RecordsGrantAuthorizationQueryOrSubscribeProtocolScopeMismatch, `Grant protocol scope ${protocolInGrant} does not match protocol in message ${protocolInMessage}`);
            }
        });
    }
    /**
     * Authorizes the scope of a permission grant for RecordsDelete.
     * @param messageStore Used to check if the grant has been revoked.
     */
    static authorizeDelete(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recordsDeleteMessage, recordsWriteToDelete, expectedGrantor, expectedGrantee, permissionGrant, messageStore } = input;
            yield GrantAuthorization.performBaseValidation({
                incomingMessage: recordsDeleteMessage,
                expectedGrantor,
                expectedGrantee,
                permissionGrant,
                messageStore
            });
            // If the grant specifies a protocol, the delete must be deleting a record with the same protocol.
            // NOTE: validated the invoked permission is for Records in GrantAuthorization.performBaseValidation()
            const permissionScope = permissionGrant.scope;
            const protocolInGrant = permissionScope.protocol;
            const protocolOfRecordToDelete = recordsWriteToDelete.descriptor.protocol;
            if (protocolInGrant !== undefined && protocolOfRecordToDelete !== protocolInGrant) {
                throw new DwnError(DwnErrorCode.RecordsGrantAuthorizationDeleteProtocolScopeMismatch, `Grant protocol scope ${protocolInGrant} does not match protocol in record to delete ${protocolOfRecordToDelete}`);
            }
        });
    }
    /**
     * Verifies a record against the scope of the given grant.
     */
    static verifyScope(recordsWriteMessage, grantScope) {
        // The record's protocol must match the protocol specified in the record
        if (grantScope.protocol !== recordsWriteMessage.descriptor.protocol) {
            throw new DwnError(DwnErrorCode.RecordsGrantAuthorizationScopeProtocolMismatch, `Grant scope specifies different protocol than what appears in the record`);
        }
        // If grant specifies a contextId, check that record falls under that contextId
        if (grantScope.contextId !== undefined) {
            if (recordsWriteMessage.contextId === undefined || !recordsWriteMessage.contextId.startsWith(grantScope.contextId)) {
                throw new DwnError(DwnErrorCode.RecordsGrantAuthorizationScopeContextIdMismatch, `Grant scope specifies different contextId than what appears in the record`);
            }
        }
        // If grant specifies protocolPath, check that record is at that protocolPath
        if (grantScope.protocolPath !== undefined && grantScope.protocolPath !== recordsWriteMessage.descriptor.protocolPath) {
            throw new DwnError(DwnErrorCode.RecordsGrantAuthorizationScopeProtocolPathMismatch, `Grant scope specifies different protocolPath than what appears in the record`);
        }
    }
    /**
     * Verifies grant `conditions`.
     * Currently the only condition is `published` which only applies to RecordsWrites
     */
    static verifyConditions(recordsWriteMessage, conditions) {
        // If conditions require publication, RecordsWrite must have `published` === true
        if ((conditions === null || conditions === void 0 ? void 0 : conditions.publication) === PermissionConditionPublication.Required && !recordsWriteMessage.descriptor.published) {
            throw new DwnError(DwnErrorCode.RecordsGrantAuthorizationConditionPublicationRequired, 'Permission grant requires message to be published');
        }
        // if conditions prohibit publication, RecordsWrite must have published === false or undefined
        if ((conditions === null || conditions === void 0 ? void 0 : conditions.publication) === PermissionConditionPublication.Prohibited && recordsWriteMessage.descriptor.published) {
            throw new DwnError(DwnErrorCode.RecordsGrantAuthorizationConditionPublicationProhibited, 'Permission grant prohibits message from being published');
        }
    }
}
//# sourceMappingURL=records-grant-authorization.js.map