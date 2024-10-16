import type { MessageStore } from '../types/message-store.js';
import type { RecordsDelete } from '../interfaces/records-delete.js';
import type { RecordsQuery } from '../interfaces/records-query.js';
import type { RecordsRead } from '../interfaces/records-read.js';
import type { RecordsSubscribe } from '../interfaces/records-subscribe.js';
import { RecordsWrite } from '../interfaces/records-write.js';
export declare class ProtocolAuthorization {
    /**
     * Performs validation on the structure of RecordsWrite messages that use a protocol.
     * @throws {Error} if validation fails.
     */
    static validateReferentialIntegrity(tenant: string, incomingMessage: RecordsWrite, messageStore: MessageStore): Promise<void>;
    /**
     * Performs protocol-based authorization against the incoming RecordsWrite message.
     * @throws {Error} if authorization fails.
     */
    static authorizeWrite(tenant: string, incomingMessage: RecordsWrite, messageStore: MessageStore): Promise<void>;
    /**
     * Performs protocol-based authorization against the incoming `RecordsRead` message.
     * @param newestRecordsWrite The latest RecordsWrite associated with the recordId being read.
     * @throws {Error} if authorization fails.
     */
    static authorizeRead(tenant: string, incomingMessage: RecordsRead, newestRecordsWrite: RecordsWrite, messageStore: MessageStore): Promise<void>;
    static authorizeQueryOrSubscribe(tenant: string, incomingMessage: RecordsQuery | RecordsSubscribe, messageStore: MessageStore): Promise<void>;
    /**
     * Performs protocol-based authorization against the incoming `RecordsDelete` message.
     * @param recordsWrite A `RecordsWrite` of the record being deleted.
     */
    static authorizeDelete(tenant: string, incomingMessage: RecordsDelete, recordsWrite: RecordsWrite, messageStore: MessageStore): Promise<void>;
    /**
     * Fetches the protocol definition based on the protocol specified in the given message.
     */
    private static fetchProtocolDefinition;
    /**
     * Constructs the chain of EXISTING records in the datastore where the first record is the root initial `RecordsWrite` of the record chain
     * and last record is the initial `RecordsWrite` of the descendant record specified.
     * @param descendantRecordId The ID of the descendent record to start constructing the record chain from by repeatedly looking up the parent.
     * @returns the record chain where each record is represented by its initial `RecordsWrite`;
     *          returns empty array if `descendantRecordId` is `undefined`.
     * @throws {DwnError} if `descendantRecordId` is defined but any initial `RecordsWrite` is not found in the chain of records.
     */
    private static constructRecordChain;
    /**
     * Fetches the initial RecordsWrite message associated with the given (tenant + recordId).
     */
    private static fetchInitialWrite;
    /**
     * Gets the rule set corresponding to the given protocolPath.
     */
    private static getRuleSet;
    /**
     * Verifies the `protocolPath` declared in the given message (if it is a RecordsWrite) matches the path of actual record chain.
     * @throws {DwnError} if fails verification.
     */
    private static verifyProtocolPathAndContextId;
    /**
     * Verifies the `dataFormat` and `schema` declared in the given message (if it is a RecordsWrite) matches dataFormat
     * and schema of the type in the given protocol.
     * @throws {DwnError} if fails verification.
     */
    private static verifyType;
    /**
     * Check if the incoming message is invoking a role. If so, validate the invoked role.
     */
    private static verifyInvokedRole;
    /**
     * Returns all the ProtocolActions that would authorized the incoming message
     * (but we still need to later verify if there is a rule defined that matches one of the actions).
     * NOTE: the reason why there could be multiple actions is because:
     * - In case of an initial RecordsWrite, the RecordsWrite can be authorized by an allow `create` or `write` rule.
     * - In case of a non-initial RecordsWrite by the original record author, the RecordsWrite can be authorized by a `write` or `co-update` rule.
     *
     * It is important to recognize that the `write` access that allowed the original record author to create the record maybe revoked
     * (e.g. by role revocation) by the time a "non-initial" write by the same author is attempted.
     */
    private static getActionsSeekingARuleMatch;
    /**
     * Verifies the given message is authorized by one of the action rules in the given protocol rule set.
     * @throws {Error} if action not allowed.
     */
    private static authorizeAgainstAllowedActions;
    /**
     * Verifies that writes adhere to the $size constraints if provided
     * @throws {Error} if size is exceeded.
     */
    private static verifySizeLimit;
    private static verifyTagsIfNeeded;
    /**
     * If the given RecordsWrite is not a role record, this method does nothing and succeeds immediately.
     *
     * Else it verifies the validity of the given `RecordsWrite` as a role record, including:
     * 1. The same role has not been assigned to the same entity/recipient.
     */
    private static verifyAsRoleRecordIfNeeded;
    private static getRuleSetAtProtocolPath;
    /**
     * Checks if the `who: 'author' | 'recipient'` action rule has a matching record in the record chain.
     * @returns `true` if the action rule is satisfied; `false` otherwise.
     */
    private static checkActor;
    private static getTypeName;
}
//# sourceMappingURL=protocol-authorization.d.ts.map