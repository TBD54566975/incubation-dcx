import type { DidResolver } from '@web5/dids';
import type { MessageInterface } from '../types/message-interface.js';
import type { AuthorizationModel, GenericMessage } from '../types/message-types.js';
/**
 * Verifies all the signature(s) within the authorization property.
 *
 * @throws {Error} if fails authentication
 */
export declare function authenticate(authorizationModel: AuthorizationModel | undefined, didResolver: DidResolver): Promise<void>;
/**
 * Authorizes owner authored message.
 * @throws {DwnError} if fails authorization.
 */
export declare function authorizeOwner(tenant: string, incomingMessage: MessageInterface<GenericMessage>): Promise<void>;
//# sourceMappingURL=auth.d.ts.map