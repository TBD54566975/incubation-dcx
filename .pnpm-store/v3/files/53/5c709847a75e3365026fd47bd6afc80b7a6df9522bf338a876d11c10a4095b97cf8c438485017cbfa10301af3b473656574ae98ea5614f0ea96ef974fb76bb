import type { DataStore } from '../types/data-store.js';
import type { EventLog } from '../types/event-log.js';
import type { EventStream } from '../types/subscriptions.js';
import type { GenericMessage } from '../types/message-types.js';
import type { MessageStore } from '../types/message-store.js';
import type { RecordsDeleteMessage } from '../types/records-types.js';
export type ResumableRecordsDeleteData = {
    tenant: string;
    message: RecordsDeleteMessage;
};
/**
 * A class that provides an abstraction for the usage of MessageStore, DataStore, and EventLog.
 */
export declare class StorageController {
    private messageStore;
    private dataStore;
    private eventLog;
    private eventStream?;
    constructor({ messageStore, dataStore, eventLog, eventStream }: {
        messageStore: MessageStore;
        dataStore: DataStore;
        eventLog: EventLog;
        eventStream?: EventStream;
    });
    performRecordsDelete({ tenant, message }: ResumableRecordsDeleteData): Promise<void>;
    /**
     * Deletes the data referenced by the given message if needed.
     * @param message The message to check if the data it references should be deleted.
     */
    private static deleteFromDataStoreIfNeeded;
    /**
     * Purges (permanent hard-delete) all descendant's data of the given `recordId`.
     */
    static purgeRecordDescendants(tenant: string, recordId: string, messageStore: MessageStore, dataStore: DataStore, eventLog: EventLog): Promise<void>;
    /**
     * Purges (permanent hard-delete) all messages of the SAME `recordId` given and their associated data and events.
     * Assumes that the given `recordMessages` are all of the same `recordId`.
     */
    private static purgeRecordMessages;
    /**
     * Deletes all messages in `existingMessages` that are older than the `newestMessage` in the given tenant,
     * but keep the initial write write for future processing by ensuring its `isLatestBaseState` index is "false".
     */
    static deleteAllOlderMessagesButKeepInitialWrite(tenant: string, existingMessages: GenericMessage[], newestMessage: GenericMessage, messageStore: MessageStore, dataStore: DataStore, eventLog: EventLog): Promise<void>;
}
//# sourceMappingURL=storage-controller.d.ts.map