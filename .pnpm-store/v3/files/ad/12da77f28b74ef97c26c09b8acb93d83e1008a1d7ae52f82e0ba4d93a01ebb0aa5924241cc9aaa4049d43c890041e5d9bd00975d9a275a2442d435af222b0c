import type { DataStore } from './types/data-store.js';
import type { DidResolver } from '@web5/dids';
import type { EventLog } from './types/event-log.js';
import type { EventStream } from './types/subscriptions.js';
import type { MessageStore } from './types/message-store.js';
import type { Readable } from 'readable-stream';
import type { ResumableTaskStore } from './types/resumable-task-store.js';
import type { TenantGate } from './core/tenant-gate.js';
import type { UnionMessageReply } from './core/message-reply.js';
import type { GenericMessageReply } from './types/message-types.js';
import type { MessagesQueryMessage, MessagesQueryReply, MessagesReadMessage, MessagesReadReply, MessagesSubscribeMessage, MessagesSubscribeMessageOptions, MessagesSubscribeReply, MessageSubscriptionHandler } from './types/messages-types.js';
import type { ProtocolsConfigureMessage, ProtocolsQueryMessage, ProtocolsQueryReply } from './types/protocols-types.js';
import type { RecordsDeleteMessage, RecordsQueryMessage, RecordsQueryReply, RecordsReadMessage, RecordsReadReply, RecordsSubscribeMessage, RecordsSubscribeMessageOptions, RecordsSubscribeReply, RecordSubscriptionHandler, RecordsWriteMessage, RecordsWriteMessageOptions } from './types/records-types.js';
export declare class Dwn {
    private methodHandlers;
    private didResolver;
    private messageStore;
    private dataStore;
    private resumableTaskStore;
    private eventLog;
    private tenantGate;
    private eventStream?;
    private storageController;
    private resumableTaskManager;
    private constructor();
    /**
     * Creates an instance of the DWN.
     */
    static create(config: DwnConfig): Promise<Dwn>;
    /**
     * Initializes the DWN instance and opens the connection to it.
     */
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * Processes the given DWN message and returns with a reply.
     * @param tenant The tenant DID to route the given message to.
     */
    processMessage(tenant: string, rawMessage: MessagesQueryMessage): Promise<MessagesQueryReply>;
    processMessage(tenant: string, rawMessage: MessagesSubscribeMessage, options?: MessagesSubscribeMessageOptions): Promise<MessagesSubscribeReply>;
    processMessage(tenant: string, rawMessage: MessagesReadMessage): Promise<MessagesReadReply>;
    processMessage(tenant: string, rawMessage: ProtocolsConfigureMessage): Promise<GenericMessageReply>;
    processMessage(tenant: string, rawMessage: ProtocolsQueryMessage): Promise<ProtocolsQueryReply>;
    processMessage(tenant: string, rawMessage: RecordsDeleteMessage): Promise<GenericMessageReply>;
    processMessage(tenant: string, rawMessage: RecordsQueryMessage): Promise<RecordsQueryReply>;
    processMessage(tenant: string, rawMessage: RecordsSubscribeMessage, options: RecordsSubscribeMessageOptions): Promise<RecordsSubscribeReply>;
    processMessage(tenant: string, rawMessage: RecordsReadMessage): Promise<RecordsReadReply>;
    processMessage(tenant: string, rawMessage: RecordsWriteMessage, options?: RecordsWriteMessageOptions): Promise<GenericMessageReply>;
    processMessage(tenant: string, rawMessage: unknown, options?: MessageOptions): Promise<UnionMessageReply>;
    /**
     * Checks tenant gate to see if tenant is allowed.
     * @param tenant The tenant DID to route the given message to.
     * @returns GenericMessageReply if the message has an integrity error, otherwise undefined.
     */
    validateTenant(tenant: string): Promise<GenericMessageReply | undefined>;
    /**
     * Validates structure of DWN message
     * @param tenant The tenant DID to route the given message to.
     * @param dwnMessageInterface The interface of DWN message.
     * @param dwnMessageMethod The interface of DWN message.
  
     * @returns GenericMessageReply if the message has an integrity error, otherwise undefined.
     */
    validateMessageIntegrity(rawMessage: any): Promise<GenericMessageReply | undefined>;
}
/**
 *  MessageOptions that are used when processing a message.
 */
export interface MessageOptions {
    dataStream?: Readable;
    subscriptionHandler?: MessageSubscriptionHandler | RecordSubscriptionHandler;
}
/**
 * DWN configuration.
 */
export type DwnConfig = {
    didResolver?: DidResolver;
    tenantGate?: TenantGate;
    eventStream?: EventStream;
    messageStore: MessageStore;
    dataStore: DataStore;
    eventLog: EventLog;
    resumableTaskStore: ResumableTaskStore;
};
//# sourceMappingURL=dwn.d.ts.map