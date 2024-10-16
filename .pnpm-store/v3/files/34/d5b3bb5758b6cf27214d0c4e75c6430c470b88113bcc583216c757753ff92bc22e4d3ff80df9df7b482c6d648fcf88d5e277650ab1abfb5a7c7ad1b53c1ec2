import type { MessageStore } from '../types/message-store.js';
import type { Signer } from '../types/signer.js';
import type { ProtocolsQueryFilter, ProtocolsQueryMessage } from '../types/protocols-types.js';
import { AbstractMessage } from '../core/abstract-message.js';
export type ProtocolsQueryOptions = {
    messageTimestamp?: string;
    filter?: ProtocolsQueryFilter;
    signer?: Signer;
    permissionGrantId?: string;
};
export declare class ProtocolsQuery extends AbstractMessage<ProtocolsQueryMessage> {
    static parse(message: ProtocolsQueryMessage): Promise<ProtocolsQuery>;
    static create(options: ProtocolsQueryOptions): Promise<ProtocolsQuery>;
    static normalizeFilter(filter: ProtocolsQueryFilter): ProtocolsQueryFilter;
    authorize(tenant: string, messageStore: MessageStore): Promise<void>;
}
//# sourceMappingURL=protocols-query.d.ts.map