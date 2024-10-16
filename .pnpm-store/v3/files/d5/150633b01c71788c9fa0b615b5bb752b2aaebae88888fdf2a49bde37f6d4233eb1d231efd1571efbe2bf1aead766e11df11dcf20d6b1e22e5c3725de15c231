import type { KeyValues } from '../types/query-types.js';
import type { MessageStore } from '../types//message-store.js';
import type { Signer } from '../types/signer.js';
import type { DataEncodedRecordsWriteMessage, RecordsDeleteMessage, RecordsWriteMessage } from '../types/records-types.js';
import { AbstractMessage } from '../core/abstract-message.js';
export type RecordsDeleteOptions = {
    recordId: string;
    messageTimestamp?: string;
    protocolRole?: string;
    signer: Signer;
    /**
     * Denotes if all the descendent records should be purged. Defaults to `false`.
     */
    prune?: boolean;
    /**
     * The delegated grant to sign on behalf of the logical author, which is the grantor (`grantedBy`) of the delegated grant.
     */
    delegatedGrant?: DataEncodedRecordsWriteMessage;
};
export declare class RecordsDelete extends AbstractMessage<RecordsDeleteMessage> {
    static parse(message: RecordsDeleteMessage): Promise<RecordsDelete>;
    /**
     * Creates a RecordsDelete message.
     * @param options.recordId If `undefined`, will be auto-filled as a originating message as convenience for developer.
     * @param options.messageTimestamp If `undefined`, it will be auto-filled with current time.
     */
    static create(options: RecordsDeleteOptions): Promise<RecordsDelete>;
    /**
     * Indexed properties needed for MessageStore indexing.
     */
    constructIndexes(initialWrite: RecordsWriteMessage): KeyValues;
    authorizeDelegate(recordsWriteToDelete: RecordsWriteMessage, messageStore: MessageStore): Promise<void>;
}
//# sourceMappingURL=records-delete.d.ts.map