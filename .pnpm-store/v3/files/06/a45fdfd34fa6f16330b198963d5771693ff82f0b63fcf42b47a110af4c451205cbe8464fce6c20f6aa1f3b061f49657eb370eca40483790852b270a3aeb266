import type { DidResolver } from '@web5/dids';
import type { EventLog } from '../types/event-log.js';
import type { EventStream } from '../types/subscriptions.js';
import type { GenericMessageReply } from '../types/message-types.js';
import type { MessageStore } from '../types//message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { ProtocolsConfigureMessage } from '../types/protocols-types.js';
import { ProtocolsConfigure } from '../interfaces/protocols-configure.js';
export declare class ProtocolsConfigureHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private eventLog;
    private eventStream?;
    constructor(didResolver: DidResolver, messageStore: MessageStore, eventLog: EventLog, eventStream?: EventStream | undefined);
    handle({ tenant, message, }: {
        tenant: string;
        message: ProtocolsConfigureMessage;
    }): Promise<GenericMessageReply>;
    static constructIndexes(protocolsConfigure: ProtocolsConfigure): {
        [key: string]: string | boolean;
    };
}
//# sourceMappingURL=protocols-configure.d.ts.map