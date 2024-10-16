import type { DidResolver } from '@web5/dids';
import type { GenericMessageReply } from '../types/message-types.js';
import type { MessageStore } from '../types//message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { RecordsDeleteMessage } from '../types/records-types.js';
import type { ResumableTaskManager } from '../core/resumable-task-manager.js';
export declare class RecordsDeleteHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private resumableTaskManager;
    constructor(didResolver: DidResolver, messageStore: MessageStore, resumableTaskManager: ResumableTaskManager);
    handle({ tenant, message }: {
        tenant: string;
        message: RecordsDeleteMessage;
    }): Promise<GenericMessageReply>;
    /**
     * Authorizes a RecordsDelete message.
     *
     * @param recordsWrite A RecordsWrite of the record to be deleted.
     */
    private static authorizeRecordsDelete;
}
//# sourceMappingURL=records-delete.d.ts.map