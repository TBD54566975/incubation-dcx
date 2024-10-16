import type { Signer } from '../types/signer.js';
import type { MessagesReadMessage } from '../types/messages-types.js';
import { AbstractMessage } from '../core/abstract-message.js';
export type MessagesReadOptions = {
    messageCid: string;
    signer: Signer;
    messageTimestamp?: string;
    permissionGrantId?: string;
};
export declare class MessagesRead extends AbstractMessage<MessagesReadMessage> {
    static parse(message: MessagesReadMessage): Promise<MessagesRead>;
    static create(options: MessagesReadOptions): Promise<MessagesRead>;
    /**
     * validates the provided cid
     * @param messageCid - the cid in question
     * @throws {DwnError} if an invalid cid is found.
     */
    private static validateMessageCid;
}
//# sourceMappingURL=messages-read.d.ts.map