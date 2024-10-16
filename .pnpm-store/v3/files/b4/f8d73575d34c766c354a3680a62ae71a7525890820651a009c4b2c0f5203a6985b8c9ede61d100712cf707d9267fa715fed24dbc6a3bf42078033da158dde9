import type { DidResolver } from '@web5/dids';
import type { MessageStore } from '../types/message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { EventStream } from '../types/subscriptions.js';
import type { MessagesSubscribeMessage, MessagesSubscribeReply, MessageSubscriptionHandler } from '../types/messages-types.js';
export declare class MessagesSubscribeHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private eventStream?;
    constructor(didResolver: DidResolver, messageStore: MessageStore, eventStream?: EventStream | undefined);
    handle({ tenant, message, subscriptionHandler }: {
        tenant: string;
        message: MessagesSubscribeMessage;
        subscriptionHandler: MessageSubscriptionHandler;
    }): Promise<MessagesSubscribeReply>;
    private static authorizeMessagesSubscribe;
}
//# sourceMappingURL=messages-subscribe.d.ts.map