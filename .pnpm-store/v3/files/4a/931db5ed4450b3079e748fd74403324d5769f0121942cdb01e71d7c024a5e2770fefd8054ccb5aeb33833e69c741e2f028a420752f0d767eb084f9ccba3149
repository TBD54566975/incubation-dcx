var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Secp256k1 from '@noble/secp256k1';
import Encoder from './Encoder.js';
import InputValidator from './InputValidator.js';
import OperationKeyType from './enums/OperationKeyType.js';
import { base64url } from 'multiformats/bases/base64';
import { sha256 } from 'multiformats/hashes/sha2';
/**
 * An ISigner implementation that uses a given local private key.
 */
export default class LocalSigner {
    /**
     * Creates a new local signer using the given private key.
     */
    static create(privateKey) {
        return new LocalSigner(privateKey);
    }
    constructor(privateKey) {
        this.privateKey = privateKey;
        InputValidator.validateEs256kOperationKey(privateKey, OperationKeyType.Private);
    }
    sign(header, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerString = JSON.stringify(header);
            const headerBytes = Encoder.stringToBytes(headerString);
            const encodedHeader = base64url.baseEncode(headerBytes);
            const payloadString = JSON.stringify(content);
            const payloadBytes = Encoder.stringToBytes(payloadString);
            const encodedPayload = base64url.baseEncode(payloadBytes);
            const signingContentString = `${encodedHeader}.${encodedPayload}`;
            const signingContentBytes = Encoder.stringToBytes(signingContentString);
            const contentHash = yield sha256.encode(signingContentBytes);
            const privateKeyBytes = base64url.baseDecode(this.privateKey.d);
            const signature = yield Secp256k1.signAsync(contentHash, privateKeyBytes);
            const signatureBytes = signature.toCompactRawBytes();
            const encodedSignature = base64url.baseEncode(signatureBytes);
            const compactJws = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
            return compactJws;
        });
    }
}
//# sourceMappingURL=LocalSigner.js.map