import type { GenericMessage } from '../types/message-types.js';
import type { MessageStore } from '../types/message-store.js';
import type { PermissionGrant } from '../protocols/permission-grant.js';
import type { MessagesQueryMessage, MessagesReadMessage, MessagesSubscribeMessage } from '../types/messages-types.js';
export declare class MessagesGrantAuthorization {
    /**
     * Authorizes a MessagesReadMessage using the given permission grant.
     * @param messageStore Used to check if the given grant has been revoked; and to fetch related RecordsWrites if needed.
     */
    static authorizeMessagesRead(input: {
        messagesReadMessage: MessagesReadMessage;
        messageToRead: GenericMessage;
        expectedGrantor: string;
        expectedGrantee: string;
        permissionGrant: PermissionGrant;
        messageStore: MessageStore;
    }): Promise<void>;
    /**
     * Authorizes the scope of a permission grant for MessagesQuery or MessagesSubscribe.
     * @param messageStore Used to check if the grant has been revoked.
     */
    static authorizeQueryOrSubscribe(input: {
        incomingMessage: MessagesQueryMessage | MessagesSubscribeMessage;
        expectedGrantor: string;
        expectedGrantee: string;
        permissionGrant: PermissionGrant;
        messageStore: MessageStore;
    }): Promise<void>;
    /**
     * Verifies the given record against the scope of the given grant.
     */
    private static verifyScope;
}
//# sourceMappingURL=messages-grant-authorization.d.ts.map