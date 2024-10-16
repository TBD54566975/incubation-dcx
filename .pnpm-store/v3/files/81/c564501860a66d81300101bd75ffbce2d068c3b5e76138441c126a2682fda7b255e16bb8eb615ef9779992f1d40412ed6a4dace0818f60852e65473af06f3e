import type { MessageStore } from '../types/message-store.js';
import type { PermissionGrant } from '../protocols/permission-grant.js';
import type { RecordsDeleteMessage, RecordsQueryMessage, RecordsReadMessage, RecordsSubscribeMessage, RecordsWriteMessage } from '../types/records-types.js';
export declare class RecordsGrantAuthorization {
    /**
     * Authorizes the given RecordsWrite in the scope of the DID given.
     */
    static authorizeWrite(input: {
        recordsWriteMessage: RecordsWriteMessage;
        expectedGrantor: string;
        expectedGrantee: string;
        permissionGrant: PermissionGrant;
        messageStore: MessageStore;
    }): Promise<void>;
    /**
     * Authorizes a RecordsReadMessage using the given permission grant.
     * @param messageStore Used to check if the given grant has been revoked.
     */
    static authorizeRead(input: {
        recordsReadMessage: RecordsReadMessage;
        recordsWriteMessageToBeRead: RecordsWriteMessage;
        expectedGrantor: string;
        expectedGrantee: string;
        permissionGrant: PermissionGrant;
        messageStore: MessageStore;
    }): Promise<void>;
    /**
     * Authorizes the scope of a permission grant for RecordsQuery or RecordsSubscribe.
     * @param messageStore Used to check if the grant has been revoked.
     */
    static authorizeQueryOrSubscribe(input: {
        incomingMessage: RecordsQueryMessage | RecordsSubscribeMessage;
        expectedGrantor: string;
        expectedGrantee: string;
        permissionGrant: PermissionGrant;
        messageStore: MessageStore;
    }): Promise<void>;
    /**
     * Authorizes the scope of a permission grant for RecordsDelete.
     * @param messageStore Used to check if the grant has been revoked.
     */
    static authorizeDelete(input: {
        recordsDeleteMessage: RecordsDeleteMessage;
        recordsWriteToDelete: RecordsWriteMessage;
        expectedGrantor: string;
        expectedGrantee: string;
        permissionGrant: PermissionGrant;
        messageStore: MessageStore;
    }): Promise<void>;
    /**
     * Verifies a record against the scope of the given grant.
     */
    private static verifyScope;
    /**
     * Verifies grant `conditions`.
     * Currently the only condition is `published` which only applies to RecordsWrites
     */
    private static verifyConditions;
}
//# sourceMappingURL=records-grant-authorization.d.ts.map