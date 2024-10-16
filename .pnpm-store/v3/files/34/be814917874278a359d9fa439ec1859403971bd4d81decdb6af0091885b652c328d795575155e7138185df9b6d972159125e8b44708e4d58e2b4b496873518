"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcatKdf = void 0;
var sha256_1 = require("@noble/hashes/sha256");
var common_1 = require("@web5/common");
var utils_1 = require("@noble/hashes/utils");
/**
 * An implementation of the Concatenation Key Derivation Function (ConcatKDF)
 * as specified in NIST.800-56A, a single-step key-derivation function (SSKDF).
 * ConcatKDF produces a derived key from a secret key (like a shared secret
 * from ECDH), and other optional public information. This implementation
 * specifically uses SHA-256 as the pseudorandom function (PRF).
 *
 * Note: This implementation allows for only a single round / repetition using the function
 *       `K(1) = H(counter || Z || FixedInfo)`, where:
 *   - `K(1)` is the derived key material after one round
 *   - `H` is the SHA-256 hashing function
 *   - `counter` is a 32-bit, big-endian bit string counter set to 0x00000001
 *   - `Z` is the shared secret value obtained from a key agreement protocol
 *   - `FixedInfo` is a bit string used to ensure that the derived keying material is adequately
 *     "bound" to the key-agreement transaction.
 *
 * @example
 * ```ts
 * // Key Derivation
 * const derivedKeyingMaterial = await ConcatKdf.deriveKey({
 *   sharedSecret: utils.randomBytes(32),
 *   keyDataLen: 128,
 *   fixedInfo: {
 *     algorithmId: "A128GCM",
 *     partyUInfo: "Alice",
 *     partyVInfo: "Bob",
 *     suppPubInfo: 128,
 *   },
 * });
 * ```
 *
 * Additional Information:
 *
 * `Z`, or "shared secret":
 *   The shared secret value obtained from a key agreement protocol, such as
 *   Diffie-Hellman, ECDH (Elliptic Curve Diffie-Hellman). Importantly, this
 *   shared secret is not directly used as the encryption or authentication
 *   key, but as an input to a key derivation function (KDF), such as Concat
 *   KDF, to generate the actual key. This adds an extra layer of security, as
 *   even if the shared secret gets compromised, the actual  encryption or
 *   authentication key stays safe. This shared secret `Z` value is kept
 *   confidential between the two parties in the key agreement protocol.
 *
 * @see {@link https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-56Ar3.pdf | NIST.800-56A}
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-4.6.2 | RFC 7518, Section 4.6.2}
 */
var ConcatKdf = /** @class */ (function () {
    function ConcatKdf() {
    }
    /**
     * Derives a key of a specified length from the input parameters.
     *
     * @example
     * ```ts
     * // Key Derivation
     * const derivedKeyingMaterial = await ConcatKdf.deriveKey({
     *   sharedSecret: utils.randomBytes(32),
     *   keyDataLen: 128,
     *   fixedInfo: {
     *     algorithmId: "A128GCM",
     *     partyUInfo: "Alice",
     *     partyVInfo: "Bob",
     *     suppPubInfo: 128,
     *   },
     * });
     * ```
     *
     * @param params - Input parameters for key derivation.
     * @param params.keyDataLen - The desired length of the derived key in bits.
     * @param params.sharedSecret - The shared secret key to derive from.
     * @param params.fixedInfo - Additional public information to use in key derivation.
     * @returns The derived key as a Uint8Array.
     *
     * @throws {Error} If the `keyDataLen` would require multiple rounds.
     */
    ConcatKdf.deriveKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var hashLen, roundCount, counter, fixedInfoBytes, derivedKeyingMaterial;
            var keyDataLen = _b.keyDataLen, fixedInfo = _b.fixedInfo, sharedSecret = _b.sharedSecret;
            return __generator(this, function (_c) {
                hashLen = 256;
                roundCount = Math.ceil(keyDataLen / hashLen);
                if (roundCount !== 1) {
                    throw new Error("Concat KDF with ".concat(roundCount, " rounds not supported."));
                }
                counter = new Uint8Array(4);
                new DataView(counter.buffer).setUint32(0, roundCount);
                fixedInfoBytes = ConcatKdf.computeFixedInfo(fixedInfo);
                derivedKeyingMaterial = (0, sha256_1.sha256)((0, utils_1.concatBytes)(counter, sharedSecret, fixedInfoBytes));
                // Return the bit string of derived keying material of length keyDataLen bits.
                return [2 /*return*/, derivedKeyingMaterial.slice(0, keyDataLen / 8)];
            });
        });
    };
    /**
     * Computes the `FixedInfo` parameter for Concat KDF, which binds the derived key material to the
     * context of the key agreement transaction.
     *
     * @remarks
     * This implementation follows the recommended format for `FixedInfo` specified in section
     * 5.8.1.2.1 of the NIST.800-56A publication.
     *
     * `FixedInfo` is a bit string equal to the following concatenation:
     * `AlgorithmID || PartyUInfo || PartyVInfo {|| SuppPubInfo }{|| SuppPrivInfo }`.
     *
     * `SuppPubInfo` is the key length in bits, big endian encoded as a 32-bit number. For example,
     * 128 would be [0, 0, 0, 128] and 256 would be [0, 0, 1, 0].
     *
     * @param params - Input data to construct FixedInfo.
     * @returns FixedInfo as a Uint8Array.
     */
    ConcatKdf.computeFixedInfo = function (params) {
        // Required sub-fields.
        var algorithmId = ConcatKdf.toDataLenData({ data: params.algorithmId });
        var partyUInfo = ConcatKdf.toDataLenData({ data: params.partyUInfo });
        var partyVInfo = ConcatKdf.toDataLenData({ data: params.partyVInfo });
        // Optional sub-fields.
        var suppPubInfo = ConcatKdf.toDataLenData({ data: params.suppPubInfo, variableLength: false });
        var suppPrivInfo = ConcatKdf.toDataLenData({ data: params.suppPrivInfo });
        // Concatenate AlgorithmID || PartyUInfo || PartyVInfo || SuppPubInfo || SuppPrivInfo.
        var fixedInfo = (0, utils_1.concatBytes)(algorithmId, partyUInfo, partyVInfo, suppPubInfo, suppPrivInfo);
        return fixedInfo;
    };
    /**
     * Encodes input data as a length-prefixed byte string, or
     * as a fixed-length bit string if specified.
     *
     * If variableLength = true, return the data in the form Datalen || Data,
     * where Data is a variable-length string of zero or more (eight-bit)
     * bytes, and Datalen is a fixed-length, big-endian counter that
     * indicates the length (in bytes) of Data.
     *
     * If variableLength = false, return the data formatted as a
     * fixed-length bit string.
     *
     * @param params - Input data and options for the conversion.
     * @param params.data - The input data to encode. Must be a type convertible to Uint8Array by the Convert class.
     * @param params.variableLength - Whether to output the data as variable length. Default is true.
     *
     * @returns The input data encoded as a Uint8Array.
     *
     * @throws {TypeError} If fixed-length data is not a number.
     */
    ConcatKdf.toDataLenData = function (_a) {
        var data = _a.data, _b = _a.variableLength, variableLength = _b === void 0 ? true : _b;
        var encodedData;
        var dataType = (0, common_1.universalTypeOf)(data);
        // Return an emtpy octet sequence if data is not specified.
        if (dataType === 'Undefined') {
            return new Uint8Array(0);
        }
        if (variableLength) {
            var dataU8A = (dataType === 'Uint8Array')
                ? data
                : new common_1.Convert(data, dataType).toUint8Array();
            var bufferLength = dataU8A.length;
            encodedData = new Uint8Array(4 + bufferLength);
            new DataView(encodedData.buffer).setUint32(0, bufferLength);
            encodedData.set(dataU8A, 4);
        }
        else {
            if (typeof data !== 'number') {
                throw TypeError('Fixed length input must be a number.');
            }
            encodedData = new Uint8Array(4);
            new DataView(encodedData.buffer).setUint32(0, data);
        }
        return encodedData;
    };
    return ConcatKdf;
}());
exports.ConcatKdf = ConcatKdf;
//# sourceMappingURL=concat-kdf.js.map