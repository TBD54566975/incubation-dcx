var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as crypto from 'crypto';
import * as eciesjs from 'eciesjs';
import { Readable } from 'readable-stream';
// compress publicKey for message encryption
eciesjs.ECIES_CONFIG.isEphemeralKeyCompressed = true;
/**
 * Utility class for performing common, non-DWN specific encryption operations.
 */
export class Encryption {
    /**
     * Encrypts the given plaintext stream using AES-256-CTR algorithm.
     */
    static aes256CtrEncrypt(key, initializationVector, plaintextStream) {
        return __awaiter(this, void 0, void 0, function* () {
            const cipher = crypto.createCipheriv('aes-256-ctr', key, initializationVector);
            const cipherStream = new Readable({
                read() { }
            });
            plaintextStream.on('data', (chunk) => {
                const encryptedChunk = cipher.update(chunk);
                cipherStream.push(encryptedChunk);
            });
            plaintextStream.on('end', () => {
                const finalChunk = cipher.final();
                cipherStream.push(finalChunk);
                cipherStream.push(null);
            });
            plaintextStream.on('error', (err) => {
                cipherStream.emit('error', err);
            });
            return cipherStream;
        });
    }
    /**
     * Decrypts the given cipher stream using AES-256-CTR algorithm.
     */
    static aes256CtrDecrypt(key, initializationVector, cipherStream) {
        return __awaiter(this, void 0, void 0, function* () {
            const decipher = crypto.createDecipheriv('aes-256-ctr', key, initializationVector);
            const plaintextStream = new Readable({
                read() { }
            });
            cipherStream.on('data', (chunk) => {
                const decryptedChunk = decipher.update(chunk);
                plaintextStream.push(decryptedChunk);
            });
            cipherStream.on('end', () => {
                const finalChunk = decipher.final();
                plaintextStream.push(finalChunk);
                plaintextStream.push(null);
            });
            cipherStream.on('error', (err) => {
                plaintextStream.emit('error', err);
            });
            return plaintextStream;
        });
    }
    /**
     * Encrypts the given plaintext using ECIES (Elliptic Curve Integrated Encryption Scheme)
     * with SECP256K1 for the asymmetric calculations, HKDF as the key-derivation function,
     * and AES-GCM for the symmetric encryption and MAC algorithms.
     */
    static eciesSecp256k1Encrypt(publicKeyBytes, plaintext) {
        return __awaiter(this, void 0, void 0, function* () {
            // underlying library requires Buffer as input
            const publicKey = Buffer.from(publicKeyBytes);
            const plaintextBuffer = Buffer.from(plaintext);
            const cryptogram = eciesjs.encrypt(publicKey, plaintextBuffer);
            // split cryptogram returned into constituent parts
            let start = 0;
            let end = Encryption.isEphemeralKeyCompressed ? 33 : 65;
            const ephemeralPublicKey = cryptogram.subarray(start, end);
            start = end;
            end += eciesjs.ECIES_CONFIG.symmetricNonceLength;
            const initializationVector = cryptogram.subarray(start, end);
            start = end;
            end += 16; // eciesjs.consts.AEAD_TAG_LENGTH
            const messageAuthenticationCode = cryptogram.subarray(start, end);
            const ciphertext = cryptogram.subarray(end);
            return {
                ciphertext,
                ephemeralPublicKey,
                initializationVector,
                messageAuthenticationCode
            };
        });
    }
    /**
     * Decrypt the given plaintext using ECIES (Elliptic Curve Integrated Encryption Scheme)
     * with SECP256K1 for the asymmetric calculations, HKDF as the key-derivation function,
     * and AES-GCM for the symmetric encryption and MAC algorithms.
     */
    static eciesSecp256k1Decrypt(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // underlying library requires Buffer as input
            const privateKeyBuffer = Buffer.from(input.privateKey);
            const eciesEncryptionOutput = Buffer.concat([
                input.ephemeralPublicKey,
                input.initializationVector,
                input.messageAuthenticationCode,
                input.ciphertext
            ]);
            const plaintext = eciesjs.decrypt(privateKeyBuffer, eciesEncryptionOutput);
            return plaintext;
        });
    }
    /**
     * Expose eciesjs library configuration
     */
    static get isEphemeralKeyCompressed() {
        return eciesjs.ECIES_CONFIG.isEphemeralKeyCompressed;
    }
}
export var EncryptionAlgorithm;
(function (EncryptionAlgorithm) {
    EncryptionAlgorithm["Aes256Ctr"] = "A256CTR";
    EncryptionAlgorithm["EciesSecp256k1"] = "ECIES-ES256K";
})(EncryptionAlgorithm || (EncryptionAlgorithm = {}));
//# sourceMappingURL=encryption.js.map