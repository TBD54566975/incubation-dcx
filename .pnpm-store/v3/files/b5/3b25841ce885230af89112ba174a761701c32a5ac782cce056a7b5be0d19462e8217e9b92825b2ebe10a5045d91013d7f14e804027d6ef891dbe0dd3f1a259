import { VerifiableCredential } from './verifiable-credential.js';
/** Status list VC context */
export declare const DEFAULT_STATUS_LIST_VC_CONTEXT = "https://w3id.org/vc/status-list/2021/v1";
/**
 * The status purpose dictated by Status List 2021 spec.
 * @see {@link https://www.w3.org/community/reports/credentials/CG-FINAL-vc-status-list-2021-20230102/#statuslist2021entry | Status List 2021 Entry}
 */
export declare enum StatusPurpose {
    /** `revocation` purpose */
    revocation = "revocation",
    /** `suspension` purpose */
    suspension = "suspension"
}
/**
 * StatusListCredentialCreateOptions for creating a status list credential.
 */
export type StatusListCredentialCreateOptions = {
    /** The id used for the resolvable path to the status list credential [String]. */
    statusListCredentialId: string;
    /** The issuer URI of the credential, as a [String]. */
    issuer: string;
    /** The status purpose of the status list cred, eg: revocation, as a [StatusPurpose]. */
    statusPurpose: StatusPurpose;
    /** The credentials to be included in the status list credential, eg: revoked credentials, list of type [VerifiableCredential]. */
    credentialsToDisable: VerifiableCredential[];
};
/**
 * StatusList2021Entry Credential status lookup information included in a Verifiable Credential that supports status lookup.
 * Data model dictated by the Status List 2021 spec.
 *
 * @see {@link https://www.w3.org/community/reports/credentials/CG-FINAL-vc-status-list-2021-20230102/#example-example-statuslist2021credential | Status List 2021 Entry}
 */
export interface StatusList2021Entry {
    /** The id of the status list entry. */
    id: string;
    /** The type of the status list entry. */
    type: string;
    /** The status purpose of the status list entry. */
    statusPurpose: string;
    /** The index of the status entry in the status list. Poorly named by spec, should really be `entryIndex`. */
    statusListIndex: string;
    /** URL to the status list. */
    statusListCredential: string;
}
/**
 * `StatusListCredential` represents a digitally verifiable status list credential according to the
 * [W3C Verifiable Credentials Status List v2021](https://www.w3.org/community/reports/credentials/CG-FINAL-vc-status-list-2021-20230102/).
 *
 * When a status list is published, the result is a verifiable credential that encapsulates the status list.
 *
 */
export declare class StatusListCredential {
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
    static create(options: StatusListCredentialCreateOptions): VerifiableCredential;
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
    static validateCredentialInStatusList(credentialToValidate: VerifiableCredential, statusListCredential: VerifiableCredential): boolean;
    /**
     * Validates that the status list entry index in all the given credentials are unique,
     * and returns the unique index values.
     *
     * @param statusPurpose - The status purpose that all given credentials must match to.
     * @param credentials - An array of VerifiableCredential objects each contain a status list entry index.
     * @returns {number[]} An array of unique statusListIndex values.
     * @throws {Error} If any validation fails.
     */
    private static validateStatusListEntryIndexesAreAllUnique;
    /**
     * Generates a Base64URL encoded, GZIP compressed bit string.
     *
     * @param indexOfBitsToTurnOn - The indexes of the bits to turn on (set to 1) in the bit string.
     * @returns {string} The compressed bit string as a base64-encoded string.
     */
    private static generateBitString;
    /**
     * Retrieves the value of a specific bit from a compressed base64 URL-encoded bitstring
     * by decoding and decompressing a bitstring, then extracting a bit's value by its index.
     *
     * @param compressedBitstring A base64 URL-encoded string representing the compressed bitstring.
     * @param bitIndex The zero-based index of the bit to retrieve from the decompressed bitstream.
     * @returns {boolean} True if the bit at the specified index is 1, false if it is 0.
     */
    private static getBit;
}
//# sourceMappingURL=status-list-credential.d.ts.map