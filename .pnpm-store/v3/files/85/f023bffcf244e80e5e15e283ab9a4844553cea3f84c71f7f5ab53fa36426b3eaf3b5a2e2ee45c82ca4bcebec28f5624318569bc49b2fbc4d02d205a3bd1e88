"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusListCredential = exports.StatusPurpose = exports.DEFAULT_STATUS_LIST_VC_CONTEXT = void 0;
var pako_1 = __importDefault(require("pako"));
var utils_js_1 = require("./utils.js");
var verifiable_credential_js_1 = require("./verifiable-credential.js");
var common_1 = require("@web5/common");
/** Status list VC context */
exports.DEFAULT_STATUS_LIST_VC_CONTEXT = 'https://w3id.org/vc/status-list/2021/v1';
var DEFAULT_STATUS_LIST_VC_TYPE = 'StatusList2021Credential';
/**
 * The status purpose dictated by Status List 2021 spec.
 * @see {@link https://www.w3.org/community/reports/credentials/CG-FINAL-vc-status-list-2021-20230102/#statuslist2021entry | Status List 2021 Entry}
 */
var StatusPurpose;
(function (StatusPurpose) {
    /** `revocation` purpose */
    StatusPurpose["revocation"] = "revocation";
    /** `suspension` purpose */
    StatusPurpose["suspension"] = "suspension";
})(StatusPurpose || (exports.StatusPurpose = StatusPurpose = {}));
/**
 * The size of the bitstring in bits.
 * The bitstring is 16KB in size.
 */
var BITSTRING_SIZE = 16 * 1024 * 8; // 16KiB in bits
/**
 * `StatusListCredential` represents a digitally verifiable status list credential according to the
 * [W3C Verifiable Credentials Status List v2021](https://www.w3.org/community/reports/credentials/CG-FINAL-vc-status-list-2021-20230102/).
 *
 * When a status list is published, the result is a verifiable credential that encapsulates the status list.
 *
 */
var StatusListCredential = /** @class */ (function () {
    function StatusListCredential() {
    }
    /**
     * Create a [StatusListCredential] with a specific purpose, e.g., for revocation.
     *
     * @param statusListCredentialId The id used for the resolvable path to the status list credential [String].
     * @param issuer The issuer URI of the status list credential, as a [String].
     * @param statusPurpose The status purpose of the status list cred, eg: revocation, as a [StatusPurpose].
     * @param credentialsToDisable The credentials to be marked as revoked/suspended (status bit set to 1) in the status list.
     * @returns A special [VerifiableCredential] instance that is a StatusListCredential.
     * @throws Error If the status list credential cannot be created.
     *
     * Example:
     * ```
        StatusListCredential.create({
          statusListCredentialId : 'https://statuslistcred.com/123',
          issuer                 : issuerDid.uri,
          statusPurpose          : StatusPurpose.revocation,
          credentialsToDisable      : [credWithCredStatus]
        })
     * ```
     */
    StatusListCredential.create = function (options) {
        var statusListCredentialId = options.statusListCredentialId, issuer = options.issuer, statusPurpose = options.statusPurpose, credentialsToDisable = options.credentialsToDisable;
        var indexesOfCredentialsToRevoke = this.validateStatusListEntryIndexesAreAllUnique(statusPurpose, credentialsToDisable);
        var bitString = this.generateBitString(indexesOfCredentialsToRevoke);
        var credentialSubject = {
            id: statusListCredentialId,
            type: 'StatusList2021',
            statusPurpose: statusPurpose,
            encodedList: bitString,
        };
        var vcDataModel = {
            '@context': [verifiable_credential_js_1.DEFAULT_VC_CONTEXT, exports.DEFAULT_STATUS_LIST_VC_CONTEXT],
            type: [verifiable_credential_js_1.DEFAULT_VC_TYPE, DEFAULT_STATUS_LIST_VC_TYPE],
            id: statusListCredentialId,
            issuer: issuer,
            issuanceDate: (0, utils_js_1.getCurrentXmlSchema112Timestamp)(),
            credentialSubject: credentialSubject,
        };
        return new verifiable_credential_js_1.VerifiableCredential(vcDataModel);
    };
    /**
     * Validates if a given credential is part of the status list represented by a [VerifiableCredential].
     *
     * @param credentialToValidate The [VerifiableCredential] to be validated against the status list.
     * @param statusListCredential The [VerifiableCredential] representing the status list.
     * @returns A [Boolean] indicating whether the `credentialToValidate` is part of the status list.
     *
     * This function checks if the given `credentialToValidate`'s status list index is present in the expanded status list derived from the `statusListCredential`.
     *
     * Example:
     * ```
     * const isRevoked = StatusListCredential.validateCredentialInStatusList(credentialToCheck, statusListCred);
     * ```
     */
    StatusListCredential.validateCredentialInStatusList = function (credentialToValidate, statusListCredential) {
        var statusListEntryValue = credentialToValidate.vcDataModel.credentialStatus;
        var credentialSubject = statusListCredential.vcDataModel.credentialSubject;
        var statusListCredStatusPurpose = credentialSubject['statusPurpose'];
        var encodedListCompressedBitString = credentialSubject['encodedList'];
        if (!statusListEntryValue.statusPurpose) {
            throw new Error('status purpose in the credential to validate is undefined');
        }
        if (!statusListCredStatusPurpose) {
            throw new Error('status purpose in the status list credential is undefined');
        }
        if (statusListEntryValue.statusPurpose !== statusListCredStatusPurpose) {
            throw new Error('status purposes do not match between the credentials');
        }
        if (!encodedListCompressedBitString) {
            throw new Error('compressed bitstring is null or empty');
        }
        return this.getBit(encodedListCompressedBitString, parseInt(statusListEntryValue.statusListIndex));
    };
    /**
     * Validates that the status list entry index in all the given credentials are unique,
     * and returns the unique index values.
     *
     * @param statusPurpose - The status purpose that all given credentials must match to.
     * @param credentials - An array of VerifiableCredential objects each contain a status list entry index.
     * @returns {number[]} An array of unique statusListIndex values.
     * @throws {Error} If any validation fails.
     */
    StatusListCredential.validateStatusListEntryIndexesAreAllUnique = function (statusPurpose, credentials) {
        var uniqueIndexes = new Set();
        for (var _i = 0, credentials_1 = credentials; _i < credentials_1.length; _i++) {
            var vc = credentials_1[_i];
            if (!vc.vcDataModel.credentialStatus) {
                throw new Error('no credential status found in credential');
            }
            var statusList2021Entry = vc.vcDataModel.credentialStatus;
            if (statusList2021Entry.statusPurpose !== statusPurpose) {
                throw new Error('status purpose mismatch');
            }
            if (uniqueIndexes.has(statusList2021Entry.statusListIndex)) {
                throw new Error("duplicate entry found with index: ".concat(statusList2021Entry.statusListIndex));
            }
            if (parseInt(statusList2021Entry.statusListIndex) < 0) {
                throw new Error('status list index cannot be negative');
            }
            if (parseInt(statusList2021Entry.statusListIndex) >= BITSTRING_SIZE) {
                throw new Error('status list index is larger than the bitset size');
            }
            uniqueIndexes.add(statusList2021Entry.statusListIndex);
        }
        return Array.from(uniqueIndexes).map(function (index) { return parseInt(index); });
    };
    /**
     * Generates a Base64URL encoded, GZIP compressed bit string.
     *
     * @param indexOfBitsToTurnOn - The indexes of the bits to turn on (set to 1) in the bit string.
     * @returns {string} The compressed bit string as a base64-encoded string.
     */
    StatusListCredential.generateBitString = function (indexOfBitsToTurnOn) {
        // Initialize a Buffer with 16KB filled with zeros
        var bitArray = new Uint8Array(BITSTRING_SIZE / 8);
        // set specified bits to 1
        indexOfBitsToTurnOn.forEach(function (index) {
            var byteIndex = Math.floor(index / 8);
            var bitIndex = index % 8;
            bitArray[byteIndex] = bitArray[byteIndex] | (1 << (7 - bitIndex)); // Set bit to 1
        });
        // Compress the bit array with GZIP using pako
        var compressed = pako_1.default.gzip(bitArray);
        // Return the base64-encoded string
        var base64EncodedString = common_1.Convert.uint8Array(compressed).toBase64Url();
        return base64EncodedString;
    };
    /**
     * Retrieves the value of a specific bit from a compressed base64 URL-encoded bitstring
     * by decoding and decompressing a bitstring, then extracting a bit's value by its index.
     *
     * @param compressedBitstring A base64 URL-encoded string representing the compressed bitstring.
     * @param bitIndex The zero-based index of the bit to retrieve from the decompressed bitstream.
     * @returns {boolean} True if the bit at the specified index is 1, false if it is 0.
     */
    StatusListCredential.getBit = function (compressedBitstring, bitIndex) {
        // Base64-decode the compressed bitstring
        var compressedData = common_1.Convert.base64Url(compressedBitstring).toUint8Array();
        // Decompress the data using pako
        var decompressedData = pako_1.default.inflate(compressedData);
        // Find the byte index, and bit index within the byte.
        var byteIndex = Math.floor(bitIndex / 8);
        var bitIndexWithinByte = bitIndex % 8;
        var byte = decompressedData[byteIndex];
        // Extracts the targeted bit by adjusting for bit's position from left to right.
        var bitInteger = (byte >> (7 - bitIndexWithinByte)) & 1;
        return (bitInteger === 1);
    };
    return StatusListCredential;
}());
exports.StatusListCredential = StatusListCredential;
//# sourceMappingURL=status-list-credential.js.map