import type { DataStore } from '../types/data-store.js';
import type { DidResolver } from '@web5/dids';
import type { MessageStore } from '../types/message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { MessagesReadMessage, MessagesReadReply } from '../types/messages-types.js';
type HandleArgs = {
    tenant: string;
    message: MessagesReadMessage;
};
export declare class MessagesReadHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private dataStore;
    constructor(didResolver: DidResolver, messageStore: MessageStore, dataStore: DataStore);
    handle({ tenant, message }: HandleArgs): Promise<MessagesReadReply>;
    /**
     * @param messageStore Used to fetch related permission grant, permission revocation, and/or RecordsWrites for permission scope validation.
     */
    private static authorizeMessagesRead;
}
export {};
//# sourceMappingURL=messages-read.d.ts.map