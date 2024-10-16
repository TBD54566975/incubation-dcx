var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as secp256k1 from '@noble/secp256k1';
import { Encoder } from '../utils/encoder.js';
import { sha256 } from 'multiformats/hashes/sha2';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
/**
 * Class containing SECP256K1 related utility methods.
 */
export class Secp256k1 {
    /**
     * Validates the given JWK is a SECP256K1 key.
     * @throws {Error} if fails validation.
     */
    static validateKey(jwk) {
        if (jwk.kty !== 'EC' || jwk.crv !== 'secp256k1') {
            throw new DwnError(DwnErrorCode.Secp256k1KeyNotValid, 'Invalid SECP256K1 JWK: `kty` MUST be `EC`. `crv` MUST be `secp256k1`');
        }
    }
    /**
     * Converts a public key in bytes into a JWK.
     */
    static publicKeyToJwk(publicKeyBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            // ensure public key is in uncompressed format so we can convert it into both x and y value
            let uncompressedPublicKeyBytes;
            if (publicKeyBytes.byteLength === 33) {
                // this means given key is compressed
                const curvePoints = secp256k1.ProjectivePoint.fromHex(publicKeyBytes);
                uncompressedPublicKeyBytes = curvePoints.toRawBytes(false); // isCompressed = false
            }
            else {
                uncompressedPublicKeyBytes = publicKeyBytes;
            }
            // the first byte is a header that indicates whether the key is uncompressed (0x04 if uncompressed), we can safely ignore
            // bytes 1 - 32 represent X
            // bytes 33 - 64 represent Y
            // skip the first byte because it's used as a header to indicate whether the key is uncompressed
            const x = Encoder.bytesToBase64Url(uncompressedPublicKeyBytes.subarray(1, 33));
            const y = Encoder.bytesToBase64Url(uncompressedPublicKeyBytes.subarray(33, 65));
            const publicJwk = {
                alg: 'ES256K',
                kty: 'EC',
                crv: 'secp256k1',
                x,
                y
            };
            return publicJwk;
        });
    }
    /**
     * Converts a private key in bytes into a JWK.
     */
    static privateKeyToJwk(privateKeyBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicKeyBytes = yield Secp256k1.getPublicKey(privateKeyBytes);
            const jwk = yield Secp256k1.publicKeyToJwk(publicKeyBytes);
            jwk.d = Encoder.bytesToBase64Url(privateKeyBytes);
            return jwk;
        });
    }
    /**
     * Creates a compressed key in raw bytes from the given SECP256K1 JWK.
     */
    static publicJwkToBytes(publicJwk) {
        const x = Encoder.base64UrlToBytes(publicJwk.x);
        const y = Encoder.base64UrlToBytes(publicJwk.y);
        return secp256k1.ProjectivePoint.fromAffine({
            x: secp256k1.etc.bytesToNumberBE(x),
            y: secp256k1.etc.bytesToNumberBE(y)
        }).toRawBytes(true);
    }
    /**
     * Creates a private key in raw bytes from the given SECP256K1 JWK.
     */
    static privateJwkToBytes(privateJwk) {
        const privateKey = Encoder.base64UrlToBytes(privateJwk.d);
        return privateKey;
    }
    /**
     * Signs the provided content using the provided JWK.
     */
    static sign(content, privateJwk) {
        return __awaiter(this, void 0, void 0, function* () {
            Secp256k1.validateKey(privateJwk);
            // the underlying lib expects us to hash the content ourselves:
            // https://github.com/paulmillr/noble-secp256k1/blob/97aa518b9c12563544ea87eba471b32ecf179916/index.ts#L1160
            const hashedContent = yield sha256.encode(content);
            const privateKeyBytes = Secp256k1.privateJwkToBytes(privateJwk);
            return (yield secp256k1.signAsync(hashedContent, privateKeyBytes)).toCompactRawBytes();
        });
    }
    /**
     * Verifies a signature against the provided payload hash and public key.
     * @returns a boolean indicating whether the signature is valid.
     */
    static verify(content, signature, publicJwk) {
        return __awaiter(this, void 0, void 0, function* () {
            Secp256k1.validateKey(publicJwk);
            const publicKeyBytes = Secp256k1.publicJwkToBytes(publicJwk);
            const hashedContent = yield sha256.encode(content);
            return secp256k1.verify(signature, hashedContent, publicKeyBytes);
        });
    }
    /**
     * Generates a random key pair in JWK format.
     */
    static generateKeyPair() {
        return __awaiter(this, void 0, void 0, function* () {
            const privateKeyBytes = secp256k1.utils.randomPrivateKey();
            const publicKeyBytes = secp256k1.getPublicKey(privateKeyBytes, false); // `false` = uncompressed
            const d = Encoder.bytesToBase64Url(privateKeyBytes);
            const publicJwk = yield Secp256k1.publicKeyToJwk(publicKeyBytes);
            const privateJwk = Object.assign(Object.assign({}, publicJwk), { d });
            return { publicJwk, privateJwk };
        });
    }
    /**
     * Generates key pair in raw bytes, where the `publicKey` is compressed.
     */
    static generateKeyPairRaw() {
        return __awaiter(this, void 0, void 0, function* () {
            const privateKey = secp256k1.utils.randomPrivateKey();
            const publicKey = secp256k1.getPublicKey(privateKey, true); // `true` = compressed
            return { publicKey, privateKey };
        });
    }
    /**
     * Gets the compressed public key of the given private key.
     */
    static getPublicKey(privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicKey = secp256k1.getPublicKey(privateKey, true); // `true` = compressed
            return publicKey;
        });
    }
    /**
     * Gets the public JWK of the given private JWK.
     */
    static getPublicJwk(privateKeyJwk) {
        return __awaiter(this, void 0, void 0, function* () {
            // strip away `d`
            const { d: _d } = privateKeyJwk, publicKey = __rest(privateKeyJwk, ["d"]);
            return publicKey;
        });
    }
}
//# sourceMappingURL=secp256k1.js.map