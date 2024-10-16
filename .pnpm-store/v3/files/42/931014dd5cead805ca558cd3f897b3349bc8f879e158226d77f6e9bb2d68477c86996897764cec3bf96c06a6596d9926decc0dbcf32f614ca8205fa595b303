import type { DidResolver } from '@web5/dids';
import type { EventLog } from '../types/event-log.js';
import type { MessageStore } from '../types/message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { MessagesQueryMessage, MessagesQueryReply } from '../types/messages-types.js';
export declare class MessagesQueryHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private eventLog;
    constructor(didResolver: DidResolver, messageStore: MessageStore, eventLog: EventLog);
    handle({ tenant, message }: {
        tenant: string;
        message: MessagesQueryMessage;
    }): Promise<MessagesQueryReply>;
    private static authorizeMessagesQuery;
}
//# sourceMappingURL=messages-query.d.ts.map