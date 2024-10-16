import type { DataEncodedRecordsWriteMessage } from '../types/records-types.js';
import type { PermissionConditions, PermissionScope } from '../types/permission-types.js';
/**
 * A class representing a Permission Request for a more convenient abstraction.
 */
export declare class PermissionRequest {
    /**
     * The ID of the permission request, which is the record ID DWN message.
     */
    readonly id: string;
    /**
     * The requester for of the permission.
     */
    readonly requester: string;
    /**
     * Optional string that communicates what the requested grant would be used for.
     */
    readonly description?: string;
    /**
     * Whether the requested grant is delegated or not.
     * If `true`, the `requestor` will be able to act as the grantor of the permission within the scope of the requested grant.
     */
    readonly delegated?: boolean;
    /**
     * The scope of the allowed access.
     */
    readonly scope: PermissionScope;
    /**
     * Optional conditions that must be met when the requested grant is used.
     */
    readonly conditions?: PermissionConditions;
    static parse(message: DataEncodedRecordsWriteMessage): Promise<PermissionRequest>;
    private constructor();
}
//# sourceMappingURL=permission-request.d.ts.map