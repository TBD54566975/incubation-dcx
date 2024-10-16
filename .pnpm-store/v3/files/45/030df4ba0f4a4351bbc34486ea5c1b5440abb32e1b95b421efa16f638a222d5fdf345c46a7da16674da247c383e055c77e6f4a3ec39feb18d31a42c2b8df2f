import type { DataStore } from '../types/data-store.js';
import type { DidResolver } from '@web5/dids';
import type { MessageStore } from '../types//message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { ProtocolsQueryMessage, ProtocolsQueryReply } from '../types/protocols-types.js';
export declare class ProtocolsQueryHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private dataStore;
    constructor(didResolver: DidResolver, messageStore: MessageStore, dataStore: DataStore);
    handle({ tenant, message }: {
        tenant: string;
        message: ProtocolsQueryMessage;
    }): Promise<ProtocolsQueryReply>;
    /**
     * Fetches only published `ProtocolsConfigure`.
     */
    private fetchPublishedProtocolsConfigure;
}
//# sourceMappingURL=protocols-query.d.ts.map