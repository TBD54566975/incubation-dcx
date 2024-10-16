import type { MessageStore } from '../types//message-store.js';
import type { Signer } from '../types/signer.js';
import type { DataEncodedRecordsWriteMessage, RecordsFilter, RecordsReadMessage, RecordsWriteMessage } from '../types/records-types.js';
import { AbstractMessage } from '../core/abstract-message.js';
export type RecordsReadOptions = {
    filter: RecordsFilter;
    messageTimestamp?: string;
    signer?: Signer;
    permissionGrantId?: string;
    /**
     * Used when authorizing protocol records.
     * The protocol path to the role record type whose recipient is the author of this RecordsRead
     */
    protocolRole?: string;
    /**
     * The delegated grant to sign on behalf of the logical author, which is the grantor (`grantedBy`) of the delegated grant.
     */
    delegatedGrant?: DataEncodedRecordsWriteMessage;
};
export declare class RecordsRead extends AbstractMessage<RecordsReadMessage> {
    static parse(message: RecordsReadMessage): Promise<RecordsRead>;
    /**
     * Creates a RecordsRead message.
     * @param options.recordId If `undefined`, will be auto-filled as a originating message as convenience for developer.
     * @param options.date If `undefined`, it will be auto-filled with current time.
     *
     * @throws {DwnError} when a combination of required RecordsReadOptions are missing
     */
    static create(options: RecordsReadOptions): Promise<RecordsRead>;
    /**
     * Authorizes the delegate who signed this message.
     * @param messageStore Used to check if the grant has been revoked.
     */
    authorizeDelegate(matchedRecordsWrite: RecordsWriteMessage, messageStore: MessageStore): Promise<void>;
}
//# sourceMappingURL=records-read.d.ts.map