import type { DataEncodedRecordsWriteMessage } from '../types/records-types.js';
import type { PermissionConditions, PermissionScope } from '../types/permission-types.js';
/**
 * A class representing a Permission Grant for a more convenient abstraction.
 */
export declare class PermissionGrant {
    /**
     * The ID of the permission grant, which is the record ID DWN message.
     */
    readonly id: string;
    /**
     * The grantor of the permission.
     */
    readonly grantor: string;
    /**
     * The grantee of the permission.
     */
    readonly grantee: string;
    /**
     * The date at which the grant was given.
     */
    readonly dateGranted: string;
    /**
     * Optional string that communicates what the grant would be used for
     */
    readonly description?: string;
    /**
     * Optional CID of a permission request. This is optional because grants may be given without being officially requested
     */
    readonly requestId?: string;
    /**
     * Timestamp at which this grant will no longer be active.
     */
    readonly dateExpires: string;
    /**
     * Whether this grant is delegated or not. If `true`, the `grantedTo` will be able to act as the `grantedTo` within the scope of this grant.
     */
    readonly delegated?: boolean;
    /**
     * The scope of the allowed access.
     */
    readonly scope: PermissionScope;
    /**
     * Optional conditions that must be met when the grant is used.
     */
    readonly conditions?: PermissionConditions;
    static parse(message: DataEncodedRecordsWriteMessage): Promise<PermissionGrant>;
    private constructor();
}
//# sourceMappingURL=permission-grant.d.ts.map