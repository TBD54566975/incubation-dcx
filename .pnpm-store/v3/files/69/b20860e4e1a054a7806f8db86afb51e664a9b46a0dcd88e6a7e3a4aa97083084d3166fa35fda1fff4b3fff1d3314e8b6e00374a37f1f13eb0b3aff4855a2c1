var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Encoder from './Encoder.js';
import ErrorCode from './ErrorCode.js';
import IonError from './IonError.js';
import IonSdkConfig from './IonSdkConfig.js';
import JsonCanonicalizer from './JsonCanonicalizer.js';
import { decode } from 'multiformats/hashes/digest';
import { sha256 } from 'multiformats/hashes/sha2';
/**
 * Class that performs hashing operations using the multihash format.
 */
export default class Multihash {
    /**
     * Multihashes the content using the hashing algorithm specified.
     * @param hashAlgorithmInMultihashCode The hashing algorithm to use.
     * @returns A multihash of the content.
     */
    static hash(content, hashAlgorithmInMultihashCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let multihash;
            switch (hashAlgorithmInMultihashCode) {
                case 18: // SHA256
                    let hasher = yield sha256.digest(content);
                    multihash = hasher.bytes;
                    break;
                default:
                    throw new IonError(ErrorCode.MultihashUnsupportedHashAlgorithm, `Hash algorithm defined in multihash code ${hashAlgorithmInMultihashCode} is not supported.`);
            }
            return multihash;
        });
    }
    /**
     * Hashes the content using the hashing algorithm specified as a generic (non-multihash) hash.
     * @param hashAlgorithmInMultihashCode The hashing algorithm to use.
     * @returns A multihash bytes.
     */
    static hashAsNonMultihashBytes(content, hashAlgorithmInMultihashCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let hash;
            switch (hashAlgorithmInMultihashCode) {
                case 18: // SHA256
                    hash = yield sha256.encode(content);
                    break;
                default:
                    throw new IonError(ErrorCode.MultihashUnsupportedHashAlgorithm, `Hash algorithm defined in multihash code ${hashAlgorithmInMultihashCode} is not supported.`);
            }
            return hash;
        });
    }
    /**
     * Canonicalize the given content, then double hashes the result using the latest supported hash algorithm, then encodes the multihash.
     * Mainly used for testing purposes.
     */
    static canonicalizeThenHashThenEncode(content, hashAlgorithmInMultihashCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const canonicalizedStringBytes = JsonCanonicalizer.canonicalizeAsBytes(content);
            const multihashEncodedString = yield Multihash.hashThenEncode(canonicalizedStringBytes, hashAlgorithmInMultihashCode);
            return multihashEncodedString;
        });
    }
    /**
     * Canonicalize the given content, then double hashes the result using the latest supported hash algorithm, then encodes the multihash.
     * Mainly used for testing purposes.
     */
    static canonicalizeThenDoubleHashThenEncode(content, hashAlgorithmInMultihashCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentBytes = JsonCanonicalizer.canonicalizeAsBytes(content);
            // Double hash.
            const intermediateHashBytes = yield Multihash.hashAsNonMultihashBytes(contentBytes, hashAlgorithmInMultihashCode);
            const multihashEncodedString = yield Multihash.hashThenEncode(intermediateHashBytes, hashAlgorithmInMultihashCode);
            return multihashEncodedString;
        });
    }
    /**
     * Hashes the content using the hashing algorithm specified then encodes the multihash bytes as string.
     * @param hashAlgorithmInMultihashCode The hashing algorithm to use.
     */
    static hashThenEncode(content, hashAlgorithmInMultihashCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const multihashBytes = yield Multihash.hash(content, hashAlgorithmInMultihashCode);
            const multihashEncodedString = Encoder.encode(multihashBytes);
            return multihashEncodedString;
        });
    }
    /**
     * Checks if the given encoded hash is a multihash computed using the configured hashing algorithm.
     */
    static validateEncodedHashComputedUsingSupportedHashAlgorithm(encodedMultihash, // didSuffix
    inputContextForErrorLogging) {
        let multihash;
        const multihashBytes = Encoder.decodeAsBytes(encodedMultihash, inputContextForErrorLogging);
        try {
            multihash = decode(multihashBytes);
        }
        catch (_a) {
            throw new IonError(ErrorCode.MultihashStringNotAMultihash, `Given ${inputContextForErrorLogging} string '${encodedMultihash}' is not a multihash after decoding.`);
        }
        const hashAlgorithmInMultihashCode = IonSdkConfig.hashAlgorithmInMultihashCode;
        if (hashAlgorithmInMultihashCode !== multihash.code) {
            throw new IonError(ErrorCode.MultihashUnsupportedHashAlgorithm, `Given ${inputContextForErrorLogging} uses unsupported multihash algorithm with code ${multihash.code}, ` +
                `should use ${hashAlgorithmInMultihashCode} or change IonSdkConfig to desired hashing algorithm.`);
        }
    }
}
//# sourceMappingURL=Multihash.js.map