import type { PaginationCursor } from '../types/query-types.js';
import type { Signer } from '../types/signer.js';
import type { MessagesFilter, MessagesQueryMessage } from '../types/messages-types.js';
import { AbstractMessage } from '../core/abstract-message.js';
export type MessagesQueryOptions = {
    signer: Signer;
    filters?: MessagesFilter[];
    cursor?: PaginationCursor;
    messageTimestamp?: string;
    permissionGrantId?: string;
};
export declare class MessagesQuery extends AbstractMessage<MessagesQueryMessage> {
    static parse(message: MessagesQueryMessage): Promise<MessagesQuery>;
    static create(options: MessagesQueryOptions): Promise<MessagesQuery>;
}
//# sourceMappingURL=messages-query.d.ts.map