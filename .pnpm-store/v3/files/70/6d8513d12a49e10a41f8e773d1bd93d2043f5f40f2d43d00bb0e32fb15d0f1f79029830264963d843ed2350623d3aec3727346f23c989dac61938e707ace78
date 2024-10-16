import type { GenericMessage } from '../types/message-types.js';
import type { MessageStore } from '../types/message-store.js';
import type { PermissionGrant } from '../protocols/permission-grant.js';
export declare class GrantAuthorization {
    /**
     * Performs base permissions-grant-based authorization against the given message:
     * 1. Validates the `expectedGrantor` and `expectedGrantee` values against the actual values in given permission grant.
     * 2. Verifies that the incoming message is within the allowed time frame of the grant, and the grant has not been revoked.
     * 3. Verifies that the `interface` and `method` grant scopes match the incoming message.
     *
     * NOTE: Does not validate grant `conditions` or `scope` beyond `interface` and `method`
     *
     * @param messageStore Used to check if the grant has been revoked.
     * @throws {DwnError} if validation fails
     */
    static performBaseValidation(input: {
        incomingMessage: GenericMessage;
        expectedGrantor: string;
        expectedGrantee: string;
        permissionGrant: PermissionGrant;
        messageStore: MessageStore;
    }): Promise<void>;
    /**
     * Verifies the given `expectedGrantor` and `expectedGrantee` values against
     * the actual signer and recipient in given permission grant.
     * @throws {DwnError} if `expectedGrantor` or `expectedGrantee` do not match the actual values in the grant.
     */
    private static verifyExpectedGrantorAndGrantee;
    /**
     * Verify that the incoming message is within the allowed time frame of the grant,
     * and the grant has not been revoked.
     * @param messageStore Used to check if the grant has been revoked.
     * @throws {DwnError} if incomingMessage has timestamp for a time in which the grant is not active.
     */
    private static verifyGrantActive;
    /**
     * Verify that the `interface` and `method` grant scopes match the incoming message
     * @param permissionGrantId Purely being passed for logging purposes.
     * @throws {DwnError} if the `interface` and `method` of the incoming message do not match the scope of the permission grant.
     */
    private static verifyGrantScopeInterfaceAndMethod;
}
//# sourceMappingURL=grant-authorization.d.ts.map