var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AbstractMessage } from '../core/abstract-message.js';
import { DateSort } from '../types/records-types.js';
import { Message } from '../core/message.js';
import { PermissionGrant } from '../protocols/permission-grant.js';
import { Records } from '../utils/records.js';
import { RecordsGrantAuthorization } from '../core/records-grant-authorization.js';
import { removeUndefinedProperties } from '../utils/object.js';
import { Time } from '../utils/time.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
import { validateProtocolUrlNormalized, validateSchemaUrlNormalized } from '../utils/url.js';
/**
 * A class representing a RecordsQuery DWN message.
 */
export class RecordsQuery extends AbstractMessage {
    static parse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.descriptor.filter.published === false) {
                if (message.descriptor.dateSort === DateSort.PublishedAscending || message.descriptor.dateSort === DateSort.PublishedDescending) {
                    throw new DwnError(DwnErrorCode.RecordsQueryParseFilterPublishedSortInvalid, `queries must not filter for \`published:false\` and sort by ${message.descriptor.dateSort}`);
                }
            }
            let signaturePayload;
            if (message.authorization !== undefined) {
                signaturePayload = yield Message.validateSignatureStructure(message.authorization.signature, message.descriptor);
            }
            yield Records.validateDelegatedGrantReferentialIntegrity(message, signaturePayload);
            if ((signaturePayload === null || signaturePayload === void 0 ? void 0 : signaturePayload.protocolRole) !== undefined) {
                if (message.descriptor.filter.protocolPath === undefined) {
                    throw new DwnError(DwnErrorCode.RecordsQueryFilterMissingRequiredProperties, 'Role-authorized queries must include `protocolPath` in the filter');
                }
            }
            if (message.descriptor.filter.protocol !== undefined) {
                validateProtocolUrlNormalized(message.descriptor.filter.protocol);
            }
            if (message.descriptor.filter.schema !== undefined) {
                validateSchemaUrlNormalized(message.descriptor.filter.schema);
            }
            Time.validateTimestamp(message.descriptor.messageTimestamp);
            return new RecordsQuery(message);
        });
    }
    static create(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const descriptor = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Query,
                messageTimestamp: (_a = options.messageTimestamp) !== null && _a !== void 0 ? _a : Time.getCurrentTimestamp(),
                filter: Records.normalizeFilter(options.filter),
                dateSort: options.dateSort,
                pagination: options.pagination,
            };
            if (options.filter.published === false) {
                if (options.dateSort === DateSort.PublishedAscending || options.dateSort === DateSort.PublishedDescending) {
                    throw new DwnError(DwnErrorCode.RecordsQueryCreateFilterPublishedSortInvalid, `queries must not filter for \`published:false\` and sort by ${options.dateSort}`);
                }
            }
            // delete all descriptor properties that are `undefined` else the code will encounter the following IPLD issue when attempting to generate CID:
            // Error: `undefined` is not supported by the IPLD Data Model and cannot be encoded
            removeUndefinedProperties(descriptor);
            // only generate the `authorization` property if signature input is given
            const signer = options.signer;
            let authorization;
            if (signer) {
                authorization = yield Message.createAuthorization({
                    descriptor,
                    signer,
                    protocolRole: options.protocolRole,
                    delegatedGrant: options.delegatedGrant
                });
            }
            const message = { descriptor, authorization };
            Message.validateJsonSchema(message);
            return new RecordsQuery(message);
        });
    }
    /**
     * Authorizes the delegate who signed this message.
     * @param messageStore Used to check if the grant has been revoked.
     */
    authorizeDelegate(messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            const delegatedGrant = yield PermissionGrant.parse(this.message.authorization.authorDelegatedGrant);
            yield RecordsGrantAuthorization.authorizeQueryOrSubscribe({
                incomingMessage: this.message,
                expectedGrantee: this.signer,
                expectedGrantor: this.author,
                permissionGrant: delegatedGrant,
                messageStore
            });
        });
    }
}
//# sourceMappingURL=records-query.js.map