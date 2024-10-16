import type { DidResolver } from '@web5/dids';
import type { MessageStore } from '../types//message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { EventStream } from '../types/subscriptions.js';
import type { RecordsSubscribeMessage, RecordsSubscribeReply, RecordSubscriptionHandler } from '../types/records-types.js';
import { RecordsSubscribe } from '../interfaces/records-subscribe.js';
export declare class RecordsSubscribeHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private eventStream?;
    constructor(didResolver: DidResolver, messageStore: MessageStore, eventStream?: EventStream | undefined);
    handle({ tenant, message, subscriptionHandler }: {
        tenant: string;
        message: RecordsSubscribeMessage;
        subscriptionHandler: RecordSubscriptionHandler;
    }): Promise<RecordsSubscribeReply>;
    /**
     * Subscribe to records as the owner of the DWN with no additional filtering.
     */
    private static filterAsOwner;
    /**
     * Creates filters in order to subscribe to records as a non-owner.
     *
     * Filters can support emitting messages for both published and unpublished records,
     * as well as explicitly only published or only unpublished records.
     *
     * A) BOTH published and unpublished:
     *    1. published records; and
     *    2. unpublished records intended for the subscription author (where `recipient` is the subscription author); and
     *    3. unpublished records authorized by a protocol rule.
     *
     * B) PUBLISHED:
     *    1. only published records;
     *
     * C) UNPUBLISHED:
     *    1. unpublished records intended for the subscription author (where `recipient` is the subscription author); and
     *    2. unpublished records authorized by a protocol rule.
     */
    private static filterAsNonOwner;
    /**
     * Creates a filter for all published records matching the subscribe
     */
    private static buildPublishedRecordsFilter;
    /**
     * Creates a filter for unpublished records that are intended for the subscribe author (where `recipient` is the author).
     */
    private static buildUnpublishedRecordsForSubscribeAuthorFilter;
    /**
     * Creates a filter for unpublished records that are within the specified protocol.
     * Validation that `protocol` and other required protocol-related fields occurs before this method.
     */
    private static buildUnpublishedProtocolAuthorizedRecordsFilter;
    /**
     * Creates a filter for only unpublished records where the author is the same as the subscribe author.
     */
    private static buildUnpublishedRecordsBySubscribeAuthorFilter;
    /**
     * @param messageStore Used to check if the grant has been revoked.
     */
    static authorizeRecordsSubscribe(tenant: string, recordsSubscribe: RecordsSubscribe, messageStore: MessageStore): Promise<void>;
}
//# sourceMappingURL=records-subscribe.d.ts.map