import { Jws } from '../utils/jws.js';
import { Message } from './message.js';
/**
 * An abstract implementation of the `MessageInterface` interface.
 */
export class AbstractMessage {
    get message() {
        return this._message;
    }
    get signer() {
        return this._signer;
    }
    get author() {
        return this._author;
    }
    get signaturePayload() {
        return this._signaturePayload;
    }
    constructor(message) {
        this._message = message;
        if (message.authorization !== undefined) {
            this._signer = Message.getSigner(message);
            // if the message authorization contains author delegated grant, the author would be the grantor of the grant
            // else the author would be the signer of the message
            if (message.authorization.authorDelegatedGrant !== undefined) {
                this._author = Message.getSigner(message.authorization.authorDelegatedGrant);
            }
            else {
                this._author = this._signer;
            }
            this._signaturePayload = Jws.decodePlainObjectPayload(message.authorization.signature);
        }
    }
    /**
     * Called by `JSON.stringify(...)` automatically.
     */
    toJSON() {
        return this.message;
    }
}
//# sourceMappingURL=abstract-message.js.map