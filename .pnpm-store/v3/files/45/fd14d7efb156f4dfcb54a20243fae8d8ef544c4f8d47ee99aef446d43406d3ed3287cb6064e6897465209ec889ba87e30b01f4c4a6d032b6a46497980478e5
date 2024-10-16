import type { DataStore } from '../types/data-store.js';
import type { DidResolver } from '@web5/dids';
import type { MessageStore } from '../types//message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { RecordsReadMessage, RecordsReadReply } from '../types/records-types.js';
export declare class RecordsReadHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private dataStore;
    constructor(didResolver: DidResolver, messageStore: MessageStore, dataStore: DataStore);
    handle({ tenant, message }: {
        tenant: string;
        message: RecordsReadMessage;
    }): Promise<RecordsReadReply>;
    /**
     * @param messageStore Used to check if the grant has been revoked.
     */
    private static authorizeRecordsRead;
}
//# sourceMappingURL=records-read.d.ts.map