import type { MessageStore } from '../types/message-store.js';
import type { Signer } from '../types/signer.js';
import type { DataEncodedRecordsWriteMessage, RecordsFilter, RecordsSubscribeMessage } from '../types/records-types.js';
import { AbstractMessage } from '../core/abstract-message.js';
export type RecordsSubscribeOptions = {
    messageTimestamp?: string;
    filter: RecordsFilter;
    signer?: Signer;
    protocolRole?: string;
    /**
     * The delegated grant to sign on behalf of the logical author, which is the grantor (`grantedBy`) of the delegated grant.
     */
    delegatedGrant?: DataEncodedRecordsWriteMessage;
};
/**
 * A class representing a RecordsSubscribe DWN message.
 */
export declare class RecordsSubscribe extends AbstractMessage<RecordsSubscribeMessage> {
    static parse(message: RecordsSubscribeMessage): Promise<RecordsSubscribe>;
    static create(options: RecordsSubscribeOptions): Promise<RecordsSubscribe>;
    /**
   * Authorizes the delegate who signed the message.
   * @param messageStore Used to check if the grant has been revoked.
   */
    authorizeDelegate(messageStore: MessageStore): Promise<void>;
}
//# sourceMappingURL=records-subscribe.d.ts.map