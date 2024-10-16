var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Encoder } from './encoder.js';
import { getWebcryptoSubtle } from '@noble/ciphers/webcrypto';
import { Secp256k1 } from './secp256k1.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
export var KeyDerivationScheme;
(function (KeyDerivationScheme) {
    /**
     * Key derivation using the `dataFormat` value for Flat-space records.
     */
    KeyDerivationScheme["DataFormats"] = "dataFormats";
    KeyDerivationScheme["ProtocolContext"] = "protocolContext";
    KeyDerivationScheme["ProtocolPath"] = "protocolPath";
    /**
     * Key derivation using the `schema` value for Flat-space records.
     */
    KeyDerivationScheme["Schemas"] = "schemas";
})(KeyDerivationScheme || (KeyDerivationScheme = {}));
/**
 * Class containing hierarchical deterministic key related utility methods used by the DWN.
 */
export class HdKey {
    /**
     * Derives a descendant private key.
     * NOTE: currently only supports SECP256K1 keys.
     */
    static derivePrivateKey(ancestorKey, subDerivationPath) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const ancestorPrivateKey = Secp256k1.privateJwkToBytes(ancestorKey.derivedPrivateKey);
            const ancestorPrivateKeyDerivationPath = (_a = ancestorKey.derivationPath) !== null && _a !== void 0 ? _a : [];
            const derivedPrivateKeyBytes = yield HdKey.derivePrivateKeyBytes(ancestorPrivateKey, subDerivationPath);
            const derivedPrivateJwk = yield Secp256k1.privateKeyToJwk(derivedPrivateKeyBytes);
            const derivedDescendantPrivateKey = {
                rootKeyId: ancestorKey.rootKeyId,
                derivationScheme: ancestorKey.derivationScheme,
                derivationPath: [...ancestorPrivateKeyDerivationPath, ...subDerivationPath],
                derivedPrivateKey: derivedPrivateJwk
            };
            return derivedDescendantPrivateKey;
        });
    }
    /**
     * Derives a descendant public key from an ancestor private key.
     * NOTE: currently only supports SECP256K1 keys.
     */
    static derivePublicKey(ancestorKey, subDerivationPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const derivedDescendantPrivateKey = yield HdKey.derivePrivateKey(ancestorKey, subDerivationPath);
            const derivedDescendantPublicKey = yield Secp256k1.getPublicJwk(derivedDescendantPrivateKey.derivedPrivateKey);
            return derivedDescendantPublicKey;
        });
    }
    /**
     * Derives a hardened hierarchical deterministic private key.
     */
    static derivePrivateKeyBytes(privateKey, relativePath) {
        return __awaiter(this, void 0, void 0, function* () {
            HdKey.validateKeyDerivationPath(relativePath);
            let currentPrivateKey = privateKey;
            for (const segment of relativePath) {
                const segmentBytes = Encoder.stringToBytes(segment);
                currentPrivateKey = yield HdKey.deriveKeyUsingHkdf({
                    hashAlgorithm: 'SHA-256',
                    initialKeyMaterial: currentPrivateKey,
                    info: segmentBytes,
                    keyLengthInBytes: 32 // 32 bytes = 256 bits
                });
            }
            return currentPrivateKey;
        });
    }
    /**
     * Derives a key using  HMAC-based Extract-and-Expand Key Derivation Function (HKDF) as defined in RFC 5869.
     * TODO: Consolidate HKDF implementation and usage with web5-js - https://github.com/TBD54566975/dwn-sdk-js/issues/742
     */
    static deriveKeyUsingHkdf(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hashAlgorithm, initialKeyMaterial, info, keyLengthInBytes } = params;
            const webCrypto = getWebcryptoSubtle();
            // Import the `initialKeyMaterial` into the Web Crypto API to use for the key derivation operation.
            const webCryptoKey = yield webCrypto.importKey('raw', initialKeyMaterial, { name: 'HKDF' }, false, ['deriveBits']);
            // Derive the bytes using the Web Crypto API.
            const derivedKeyBuffer = yield crypto.subtle.deriveBits({
                name: 'HKDF',
                hash: hashAlgorithm,
                salt: new Uint8Array(0),
                info
            }, webCryptoKey, keyLengthInBytes * 8 // convert from bytes to bits
            );
            // Convert from ArrayBuffer to Uint8Array.
            const derivedKeyBytes = new Uint8Array(derivedKeyBuffer);
            return derivedKeyBytes;
        });
    }
    /**
     * Validates that no empty strings exist within the derivation path segments array.
     * @throws {DwnError} with `DwnErrorCode.HdKeyDerivationPathInvalid` if derivation path fails validation.
     */
    static validateKeyDerivationPath(pathSegments) {
        if (pathSegments.includes('')) {
            throw new DwnError(DwnErrorCode.HdKeyDerivationPathInvalid, `Invalid key derivation path: ${pathSegments}`);
        }
    }
}
//# sourceMappingURL=hd-key.js.map