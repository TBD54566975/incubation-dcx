var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { authenticate } from '../core/auth.js';
import { FilterUtility } from '../utils/filter.js';
import { Message } from '../core/message.js';
import { messageReplyFromError } from '../core/message-reply.js';
import { ProtocolAuthorization } from '../core/protocol-authorization.js';
import { Records } from '../utils/records.js';
import { RecordsSubscribe } from '../interfaces/records-subscribe.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
export class RecordsSubscribeHandler {
    constructor(didResolver, messageStore, eventStream) {
        this.didResolver = didResolver;
        this.messageStore = messageStore;
        this.eventStream = eventStream;
    }
    handle({ tenant, message, subscriptionHandler }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.eventStream === undefined) {
                return messageReplyFromError(new DwnError(DwnErrorCode.RecordsSubscribeEventStreamUnimplemented, 'Subscriptions are not supported'), 501);
            }
            let recordsSubscribe;
            try {
                recordsSubscribe = yield RecordsSubscribe.parse(message);
            }
            catch (e) {
                return messageReplyFromError(e, 400);
            }
            let filters = [];
            // if this is an anonymous subscribe and the filter supports published records, subscribe to only published records
            if (Records.filterIncludesPublishedRecords(recordsSubscribe.message.descriptor.filter) && recordsSubscribe.author === undefined) {
                // build filters for a stream of published records
                filters = [RecordsSubscribeHandler.buildPublishedRecordsFilter(recordsSubscribe)];
                // delete the undefined authorization property else the code will encounter the following IPLD issue when attempting to generate CID:
                // Error: `undefined` is not supported by the IPLD Data Model and cannot be encoded
                delete message.authorization;
            }
            else {
                // authentication and authorization
                try {
                    yield authenticate(message.authorization, this.didResolver);
                    yield RecordsSubscribeHandler.authorizeRecordsSubscribe(tenant, recordsSubscribe, this.messageStore);
                }
                catch (error) {
                    return messageReplyFromError(error, 401);
                }
                if (recordsSubscribe.author === tenant) {
                    // if the subscribe author is the tenant, filter as owner.
                    filters = yield RecordsSubscribeHandler.filterAsOwner(recordsSubscribe);
                }
                else {
                    // otherwise build filters based on published records, permissions, or protocol rules
                    filters = yield RecordsSubscribeHandler.filterAsNonOwner(recordsSubscribe);
                }
            }
            const listener = (eventTenant, event, eventIndexes) => {
                if (tenant === eventTenant && FilterUtility.matchAnyFilter(eventIndexes, filters)) {
                    // the filters check for interface and method
                    // if matched the message is either a `RecordsWriteMessage` or `RecordsDeleteMessage` so we cast the event to a `RecordEvent`
                    subscriptionHandler(event);
                }
            };
            const messageCid = yield Message.getCid(message);
            const subscription = yield this.eventStream.subscribe(tenant, messageCid, listener);
            return {
                status: { code: 200, detail: 'OK' },
                subscription
            };
        });
    }
    /**
     * Subscribe to records as the owner of the DWN with no additional filtering.
     */
    static filterAsOwner(RecordsSubscribe) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filter } = RecordsSubscribe.message.descriptor;
            const subscribeFilter = Object.assign(Object.assign({}, Records.convertFilter(filter)), { interface: DwnInterfaceName.Records, method: [DwnMethodName.Write, DwnMethodName.Delete] });
            return [subscribeFilter];
        });
    }
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
    static filterAsNonOwner(recordsSubscribe) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = [];
            const { filter } = recordsSubscribe.message.descriptor;
            if (Records.filterIncludesPublishedRecords(filter)) {
                filters.push(RecordsSubscribeHandler.buildPublishedRecordsFilter(recordsSubscribe));
            }
            if (Records.filterIncludesUnpublishedRecords(filter)) {
                if (Records.shouldBuildUnpublishedAuthorFilter(filter, recordsSubscribe.author)) {
                    filters.push(RecordsSubscribeHandler.buildUnpublishedRecordsBySubscribeAuthorFilter(recordsSubscribe));
                }
                if (Records.shouldProtocolAuthorize(recordsSubscribe.signaturePayload)) {
                    filters.push(RecordsSubscribeHandler.buildUnpublishedProtocolAuthorizedRecordsFilter(recordsSubscribe));
                }
                if (Records.shouldBuildUnpublishedRecipientFilter(filter, recordsSubscribe.author)) {
                    filters.push(RecordsSubscribeHandler.buildUnpublishedRecordsForSubscribeAuthorFilter(recordsSubscribe));
                }
            }
            return filters;
        });
    }
    /**
     * Creates a filter for all published records matching the subscribe
     */
    static buildPublishedRecordsFilter(recordsSubscribe) {
        return Object.assign(Object.assign({}, Records.convertFilter(recordsSubscribe.message.descriptor.filter)), { interface: DwnInterfaceName.Records, method: [DwnMethodName.Write, DwnMethodName.Delete], published: true });
    }
    /**
     * Creates a filter for unpublished records that are intended for the subscribe author (where `recipient` is the author).
     */
    static buildUnpublishedRecordsForSubscribeAuthorFilter(recordsSubscribe) {
        // include records where recipient is subscribe author
        return Object.assign(Object.assign({}, Records.convertFilter(recordsSubscribe.message.descriptor.filter)), { interface: DwnInterfaceName.Records, method: [DwnMethodName.Write, DwnMethodName.Delete], recipient: recordsSubscribe.author, published: false });
    }
    /**
     * Creates a filter for unpublished records that are within the specified protocol.
     * Validation that `protocol` and other required protocol-related fields occurs before this method.
     */
    static buildUnpublishedProtocolAuthorizedRecordsFilter(recordsSubscribe) {
        return Object.assign(Object.assign({}, Records.convertFilter(recordsSubscribe.message.descriptor.filter)), { interface: DwnInterfaceName.Records, method: [DwnMethodName.Write, DwnMethodName.Delete], published: false });
    }
    /**
     * Creates a filter for only unpublished records where the author is the same as the subscribe author.
     */
    static buildUnpublishedRecordsBySubscribeAuthorFilter(recordsSubscribe) {
        // include records where author is the same as the subscribe author
        return Object.assign(Object.assign({}, Records.convertFilter(recordsSubscribe.message.descriptor.filter)), { author: recordsSubscribe.author, interface: DwnInterfaceName.Records, method: [DwnMethodName.Write, DwnMethodName.Delete], published: false });
    }
    /**
     * @param messageStore Used to check if the grant has been revoked.
     */
    static authorizeRecordsSubscribe(tenant, recordsSubscribe, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Message.isSignedByAuthorDelegate(recordsSubscribe.message)) {
                yield recordsSubscribe.authorizeDelegate(messageStore);
            }
            // NOTE: not all RecordsSubscribe messages require protocol authorization even if the filter includes protocol-related fields,
            // this is because we dynamically filter out records that the caller is not authorized to see.
            // Currently only run protocol authorization if message deliberately invokes a protocol role.
            if (Records.shouldProtocolAuthorize(recordsSubscribe.signaturePayload)) {
                yield ProtocolAuthorization.authorizeQueryOrSubscribe(tenant, recordsSubscribe, messageStore);
            }
        });
    }
}
//# sourceMappingURL=records-subscribe.js.map