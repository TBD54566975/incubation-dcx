import type { MessagesFilter } from '../types/messages-types.js';
import type { Signer } from '../types/signer.js';
import type { MessagesSubscribeMessage } from '../types/messages-types.js';
import { AbstractMessage } from '../core/abstract-message.js';
export type MessagesSubscribeOptions = {
    signer: Signer;
    messageTimestamp?: string;
    filters?: MessagesFilter[];
    permissionGrantId?: string;
};
export declare class MessagesSubscribe extends AbstractMessage<MessagesSubscribeMessage> {
    static parse(message: MessagesSubscribeMessage): Promise<MessagesSubscribe>;
    /**
     * Creates a MessagesSubscribe message.
     *
     * @throws {DwnError} if json schema validation fails.
     */
    static create(options: MessagesSubscribeOptions): Promise<MessagesSubscribe>;
}
//# sourceMappingURL=messages-subscribe.d.ts.map