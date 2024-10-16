import type { MessageStore } from '../types/message-store.js';
import type { ProtocolDefinition } from '../types/protocols-types.js';
import type { Signer } from '../types/signer.js';
import type { DataEncodedRecordsWriteMessage, RecordsWriteMessage } from '../types/records-types.js';
import type { PermissionConditions, PermissionGrantData, PermissionRequestData, PermissionRevocationData, PermissionScope } from '../types/permission-types.js';
import { PermissionGrant } from './permission-grant.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
/**
 * Options for creating a permission request.
 */
export type PermissionRequestCreateOptions = {
    /**
     * The signer of the request.
     */
    signer?: Signer;
    dateRequested?: string;
    description?: string;
    delegated: boolean;
    scope: PermissionScope;
    conditions?: PermissionConditions;
};
/**
 * Options for creating a permission grant.
 */
export type PermissionGrantCreateOptions = {
    /**
     * The signer of the grant.
     */
    signer?: Signer;
    grantedTo: string;
    dateGranted?: string;
    /**
     * Expire time in UTC ISO-8601 format with microsecond precision.
     */
    dateExpires: string;
    requestId?: string;
    description?: string;
    delegated?: boolean;
    scope: PermissionScope;
    conditions?: PermissionConditions;
};
/**
 * Options for creating a permission revocation.
 */
export type PermissionRevocationCreateOptions = {
    /**
     * The signer of the grant.
     */
    signer?: Signer;
    /**
     * The PermissionGrant this revocation is for.
     */
    grant: PermissionGrant;
    dateRevoked?: string;
    description?: string;
};
/**
 * This is a first-class DWN protocol for managing permission grants of a given DWN.
 */
export declare class PermissionsProtocol {
    /**
     * The URI of the DWN Permissions protocol.
     */
    static readonly uri = "https://tbd.website/dwn/permissions";
    /**
     * The protocol path of the `request` record.
     */
    static readonly requestPath = "request";
    /**
     * The protocol path of the `grant` record.
     */
    static readonly grantPath = "grant";
    /**
     * The protocol path of the `revocation` record.
     */
    static readonly revocationPath = "grant/revocation";
    /**
     * The definition of the Permissions protocol.
     */
    static readonly definition: ProtocolDefinition;
    static parseRequest(base64UrlEncodedRequest: string): PermissionRequestData;
    /**
     * Convenience method to create a permission request.
     */
    static createRequest(options: PermissionRequestCreateOptions): Promise<{
        recordsWrite: RecordsWrite;
        permissionRequestData: PermissionRequestData;
        permissionRequestBytes: Uint8Array;
        dataEncodedMessage: DataEncodedRecordsWriteMessage;
    }>;
    /**
     * Convenience method to create a permission grant.
     */
    static createGrant(options: PermissionGrantCreateOptions): Promise<{
        recordsWrite: RecordsWrite;
        permissionGrantData: PermissionGrantData;
        permissionGrantBytes: Uint8Array;
        dataEncodedMessage: DataEncodedRecordsWriteMessage;
    }>;
    /**
     * Convenience method to create a permission revocation.
     */
    static createRevocation(options: PermissionRevocationCreateOptions): Promise<{
        recordsWrite: RecordsWrite;
        permissionRevocationData: PermissionRevocationData;
        permissionRevocationBytes: Uint8Array;
        dataEncodedMessage: DataEncodedRecordsWriteMessage;
    }>;
    /**
     * Validates the given Permissions protocol RecordsWrite. It can be a request, grant, or revocation.
     */
    static validateSchema(recordsWriteMessage: RecordsWriteMessage, dataBytes: Uint8Array): void;
    /**
     * Fetches PermissionGrant with the specified `recordID`.
     * @returns the PermissionGrant matching the `recordId` specified.
     * @throws {Error} if PermissionGrant does not exist
     */
    static fetchGrant(tenant: string, messageStore: MessageStore, permissionGrantId: string): Promise<PermissionGrant>;
    /**
     * Gets the scope from the given permission record.
     * If the record is a revocation, the scope is fetched from the grant that is being revoked.
     *
     * @param messageStore The message store to fetch the grant for a revocation.
     */
    static getScopeFromPermissionRecord(tenant: string, messageStore: MessageStore, incomingMessage: DataEncodedRecordsWriteMessage): Promise<PermissionScope>;
    /**
     * Normalizes the given permission scope if needed.
     * @returns The normalized permission scope.
     */
    private static normalizePermissionScope;
    /**
     * Type guard to determine if the scope is a record permission scope.
     */
    private static isRecordPermissionScope;
    /**
     * Type guard to determine if the permission is a protocol-scoped
     */
    static hasProtocolScope(scope: PermissionScope): scope is PermissionScope & {
        protocol: string;
    };
    /**
     * Validates that tags must include a protocol tag that matches the scoped protocol.
     */
    private static validateTags;
    /**
     * Validates scope and tags of the given permission request or grant.
     */
    private static validateScopeAndTags;
}
//# sourceMappingURL=permissions.d.ts.map