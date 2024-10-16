import type { MessageStore } from '../types//message-store.js';
import type { Pagination } from '../types/message-types.js';
import type { Signer } from '../types/signer.js';
import type { DataEncodedRecordsWriteMessage, RecordsFilter, RecordsQueryMessage } from '../types/records-types.js';
import { AbstractMessage } from '../core/abstract-message.js';
import { DateSort } from '../types/records-types.js';
export type RecordsQueryOptions = {
    messageTimestamp?: string;
    filter: RecordsFilter;
    dateSort?: DateSort;
    pagination?: Pagination;
    signer?: Signer;
    protocolRole?: string;
    /**
     * The delegated grant to sign on behalf of the logical author, which is the grantor (`grantedBy`) of the delegated grant.
     */
    delegatedGrant?: DataEncodedRecordsWriteMessage;
};
/**
 * A class representing a RecordsQuery DWN message.
 */
export declare class RecordsQuery extends AbstractMessage<RecordsQueryMessage> {
    static parse(message: RecordsQueryMessage): Promise<RecordsQuery>;
    static create(options: RecordsQueryOptions): Promise<RecordsQuery>;
    /**
     * Authorizes the delegate who signed this message.
     * @param messageStore Used to check if the grant has been revoked.
     */
    authorizeDelegate(messageStore: MessageStore): Promise<void>;
}
//# sourceMappingURL=records-query.d.ts.map