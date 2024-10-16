var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DwnInterfaceName } from '../enums/dwn-interface-method.js';
import { GrantAuthorization } from './grant-authorization.js';
import { PermissionsProtocol } from '../protocols/permissions.js';
import { Records } from '../utils/records.js';
import { RecordsWrite } from '../interfaces/records-write.js';
import { DwnError, DwnErrorCode } from './dwn-error.js';
export class MessagesGrantAuthorization {
    /**
     * Authorizes a MessagesReadMessage using the given permission grant.
     * @param messageStore Used to check if the given grant has been revoked; and to fetch related RecordsWrites if needed.
     */
    static authorizeMessagesRead(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messagesReadMessage, messageToRead, expectedGrantor, expectedGrantee, permissionGrant, messageStore } = input;
            yield GrantAuthorization.performBaseValidation({
                incomingMessage: messagesReadMessage,
                expectedGrantor,
                expectedGrantee,
                permissionGrant,
                messageStore
            });
            const scope = permissionGrant.scope;
            yield MessagesGrantAuthorization.verifyScope(expectedGrantor, messageToRead, scope, messageStore);
        });
    }
    /**
     * Authorizes the scope of a permission grant for MessagesQuery or MessagesSubscribe.
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
            // if the grant is scoped to a specific protocol, ensure that all of the query filters must include that protocol
            if (PermissionsProtocol.hasProtocolScope(permissionGrant.scope)) {
                const scopedProtocol = permissionGrant.scope.protocol;
                for (const filter of incomingMessage.descriptor.filters) {
                    if (filter.protocol !== scopedProtocol) {
                        throw new DwnError(DwnErrorCode.MessagesGrantAuthorizationMismatchedProtocol, `The protocol ${filter.protocol} does not match the scoped protocol ${scopedProtocol}`);
                    }
                }
            }
        });
    }
    /**
     * Verifies the given record against the scope of the given grant.
     */
    static verifyScope(tenant, messageToGet, incomingScope, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            if (incomingScope.protocol === undefined) {
                // if no protocol is specified in the scope, then the grant is for all records
                return;
            }
            if (messageToGet.descriptor.interface === DwnInterfaceName.Records) {
                // if the message is a Records interface message, get the RecordsWrite message associated with the record
                const recordsMessage = messageToGet;
                const recordsWriteMessage = Records.isRecordsWrite(recordsMessage) ? recordsMessage :
                    yield RecordsWrite.fetchNewestRecordsWrite(messageStore, tenant, recordsMessage.descriptor.recordId);
                if (recordsWriteMessage.descriptor.protocol === incomingScope.protocol) {
                    // the record protocol matches the incoming scope protocol
                    return;
                }
                // we check if the protocol is the internal PermissionsProtocol for further validation
                if (recordsWriteMessage.descriptor.protocol === PermissionsProtocol.uri) {
                    // get the permission scope from the permission message
                    const permissionScope = yield PermissionsProtocol.getScopeFromPermissionRecord(tenant, messageStore, recordsWriteMessage);
                    if (PermissionsProtocol.hasProtocolScope(permissionScope) && permissionScope.protocol === incomingScope.protocol) {
                        // the permissions record scoped protocol matches the incoming scope protocol
                        return;
                    }
                }
            }
            else if (messageToGet.descriptor.interface === DwnInterfaceName.Protocols) {
                // if the message is a protocol message, it must be a `ProtocolConfigure` message
                const protocolsConfigureMessage = messageToGet;
                const configureProtocol = protocolsConfigureMessage.descriptor.definition.protocol;
                if (configureProtocol === incomingScope.protocol) {
                    // the configured protocol matches the incoming scope protocol
                    return;
                }
            }
            throw new DwnError(DwnErrorCode.MessagesReadVerifyScopeFailed, 'record message failed scope authorization');
        });
    }
}
//# sourceMappingURL=messages-grant-authorization.js.map