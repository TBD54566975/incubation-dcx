import type { MessageInterface } from '../types/message-interface.js';
import type { GenericMessage, GenericSignaturePayload } from '../types/message-types.js';
/**
 * An abstract implementation of the `MessageInterface` interface.
 */
export declare abstract class AbstractMessage<M extends GenericMessage> implements MessageInterface<M> {
    private _message;
    get message(): M;
    private _signer;
    get signer(): string | undefined;
    private _author;
    get author(): string | undefined;
    private _signaturePayload;
    get signaturePayload(): GenericSignaturePayload | undefined;
    protected constructor(message: M);
    /**
     * Called by `JSON.stringify(...)` automatically.
     */
    toJSON(): GenericMessage;
}
//# sourceMappingURL=abstract-message.d.ts.map