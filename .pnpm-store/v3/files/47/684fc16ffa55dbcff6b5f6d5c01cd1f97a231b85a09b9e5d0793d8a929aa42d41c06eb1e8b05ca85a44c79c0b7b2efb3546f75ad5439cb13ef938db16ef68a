var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Ed25519 from '@noble/ed25519';
import * as Secp256k1 from '@noble/secp256k1';
import InputValidator from './InputValidator.js';
import { base64url } from 'multiformats/bases/base64';
/**
 * Class containing operations related to keys used in ION.
 */
export default class IonKey {
    /**
     * Generates SECP256K1 key pair to be used in an operation.
     * Mainly used for testing.
     * @returns [publicKey, privateKey]
     */
    static generateEs256kDidDocumentKeyPair(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = input.id;
            const purposes = input.purposes;
            InputValidator.validateId(id);
            InputValidator.validatePublicKeyPurposes(purposes);
            const [publicKey, privateKey] = yield IonKey.generateEs256kKeyPair();
            const publicKeyModel = {
                id,
                type: 'EcdsaSecp256k1VerificationKey2019',
                publicKeyJwk: publicKey
            };
            // Only add the `purposes` property If given `purposes` array has at least an entry.
            if (purposes !== undefined && purposes.length > 0) {
                publicKeyModel.purposes = purposes;
            }
            return [publicKeyModel, privateKey];
        });
    }
    /**
     * Generates SECP256K1 key pair for ION operation use.
     * @returns [publicKey, privateKey]
     */
    static generateEs256kOperationKeyPair() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyPair = yield IonKey.generateEs256kKeyPair();
            return keyPair;
        });
    }
    static generateEs256kKeyPair() {
        return __awaiter(this, void 0, void 0, function* () {
            const privateKeyBytes = Secp256k1.utils.randomPrivateKey();
            const compressedPublicKeyBytes = Secp256k1.getPublicKey(privateKeyBytes);
            const compressedPublicKeyHex = Secp256k1.etc.bytesToHex(compressedPublicKeyBytes);
            const curvePoints = Secp256k1.ProjectivePoint.fromHex(compressedPublicKeyHex);
            const uncompressedPublicKeyBytes = curvePoints.toRawBytes(false); // false = uncompressed
            // we need uncompressed public key so that it contains both the x and y values for the JWK format:
            // the first byte is a header that indicates whether the key is uncompressed (0x04 if uncompressed).
            // bytes 1 - 32 represent X
            // bytes 33 - 64 represent Y
            const d = base64url.baseEncode(privateKeyBytes);
            // skip the first byte because it's used as a header to indicate whether the key is uncompressed
            const x = base64url.baseEncode(uncompressedPublicKeyBytes.subarray(1, 33));
            const y = base64url.baseEncode(uncompressedPublicKeyBytes.subarray(33, 65));
            const publicJwk = {
                // alg: 'ES256K',
                kty: 'EC',
                crv: 'secp256k1',
                x,
                y
            };
            const privateJwk = Object.assign(Object.assign({}, publicJwk), { d });
            return [publicJwk, privateJwk];
        });
    }
    /**
     * Generates Ed25519 key pair to be used in an operation.
     * Mainly used for testing.
     * @returns [publicKey, privateKey]
     */
    static generateEd25519DidDocumentKeyPair(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = input.id;
            const purposes = input.purposes;
            InputValidator.validateId(id);
            InputValidator.validatePublicKeyPurposes(purposes);
            const [publicKey, privateKey] = yield IonKey.generateEd25519KeyPair();
            const publicKeyModel = {
                id,
                type: 'JsonWebKey2020',
                publicKeyJwk: publicKey
            };
            // Only add the `purposes` property If given `purposes` array has at least an entry.
            if (purposes !== undefined && purposes.length > 0) {
                publicKeyModel.purposes = purposes;
            }
            return [publicKeyModel, privateKey];
        });
    }
    /**
     * Generates Ed25519 key pair for ION operation use.
     * @returns [publicKey, privateKey]
     */
    static generateEd25519OperationKeyPair() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyPair = yield IonKey.generateEd25519KeyPair();
            return keyPair;
        });
    }
    static generateEd25519KeyPair() {
        return __awaiter(this, void 0, void 0, function* () {
            const privateKeyBytes = Ed25519.utils.randomPrivateKey();
            const privateKeyHex = Ed25519.etc.bytesToHex(privateKeyBytes);
            const publicKeyBytes = yield Ed25519.getPublicKeyAsync(privateKeyHex);
            const d = base64url.baseEncode(privateKeyBytes);
            const x = base64url.baseEncode(publicKeyBytes);
            const publicJwk = {
                // alg: 'EdDSA',
                kty: 'OKP',
                crv: 'Ed25519',
                x
            };
            const privateJwk = Object.assign(Object.assign({}, publicJwk), { d });
            return [publicJwk, privateJwk];
        });
    }
    static isJwkEs256k(key) {
        return key.crv === 'secp256k1' && key.kty === 'EC';
    }
    ;
    static isJwkEd25519(key) {
        return key.crv === 'Ed25519' && key.kty === 'OKP';
    }
    ;
}
//# sourceMappingURL=IonKey.js.map