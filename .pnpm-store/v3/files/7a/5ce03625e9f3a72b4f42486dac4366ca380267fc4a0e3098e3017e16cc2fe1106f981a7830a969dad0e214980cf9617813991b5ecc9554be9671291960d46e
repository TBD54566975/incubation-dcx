import type { DataStore } from '../types/data-store.js';
import type { DidResolver } from '@web5/dids';
import type { MessageStore } from '../types//message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { RecordsQueryMessage, RecordsQueryReply } from '../types/records-types.js';
export declare class RecordsQueryHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private dataStore;
    constructor(didResolver: DidResolver, messageStore: MessageStore, dataStore: DataStore);
    handle({ tenant, message }: {
        tenant: string;
        message: RecordsQueryMessage;
    }): Promise<RecordsQueryReply>;
    /**
     * Convert an incoming DateSort to a sort type accepted by MessageStore
     * Defaults to 'dateCreated' in Descending order if no sort is supplied.
     *
     * @param dateSort the optional DateSort from the RecordsQuery message descriptor.
     * @returns {MessageSort} for MessageStore sorting.
     */
    private convertDateSort;
    /**
     * Fetches the records as the owner of the DWN with no additional filtering.
     */
    private fetchRecordsAsOwner;
    /**
     * Fetches the records as a non-owner.
     *
     * Filters can support returning both published and unpublished records,
     * as well as explicitly only published or only unpublished records.
     *
     * A) BOTH published and unpublished:
     *    1. published records; and
     *    2. unpublished records intended for the query author (where `recipient` is the query author); and
     *    3. unpublished records authorized by a protocol rule.
     *
     * B) PUBLISHED:
     *    1. only published records;
     *
     * C) UNPUBLISHED:
     *    1. unpublished records intended for the query author (where `recipient` is the query author); and
     *    2. unpublished records authorized by a protocol rule.
     *
     */
    private fetchRecordsAsNonOwner;
    /**
     * Fetches only published records.
     */
    private fetchPublishedRecords;
    private static buildPublishedRecordsFilter;
    /**
     * Creates a filter for unpublished records that are intended for the query author (where `recipient` is the author).
     */
    private static buildUnpublishedRecordsForQueryAuthorFilter;
    /**
     * Creates a filter for unpublished records that are within the specified protocol.
     * Validation that `protocol` and other required protocol-related fields occurs before this method.
     */
    private static buildUnpublishedProtocolAuthorizedRecordsFilter;
    /**
     * Creates a filter for only unpublished records where the author is the same as the query author.
     */
    private static buildUnpublishedRecordsByQueryAuthorFilter;
    /**
     * @param messageStore Used to check if the grant has been revoked.
     */
    private static authorizeRecordsQuery;
}
//# sourceMappingURL=records-query.d.ts.map