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
import { GrantAuthorization } from '../core/grant-authorization.js';
import { Message } from '../core/message.js';
import { PermissionsProtocol } from '../protocols/permissions.js';
import { removeUndefinedProperties } from '../utils/object.js';
import { Time } from '../utils/time.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
import { normalizeProtocolUrl, validateProtocolUrlNormalized } from '../utils/url.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
export class ProtocolsQuery extends AbstractMessage {
    static parse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.authorization !== undefined) {
                yield Message.validateSignatureStructure(message.authorization.signature, message.descriptor);
            }
            if (message.descriptor.filter !== undefined) {
                validateProtocolUrlNormalized(message.descriptor.filter.protocol);
            }
            Time.validateTimestamp(message.descriptor.messageTimestamp);
            return new ProtocolsQuery(message);
        });
    }
    static create(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const descriptor = {
                interface: DwnInterfaceName.Protocols,
                method: DwnMethodName.Query,
                messageTimestamp: (_a = options.messageTimestamp) !== null && _a !== void 0 ? _a : Time.getCurrentTimestamp(),
                filter: options.filter ? ProtocolsQuery.normalizeFilter(options.filter) : undefined,
            };
            // delete all descriptor properties that are `undefined` else the code will encounter the following IPLD issue when attempting to generate CID:
            // Error: `undefined` is not supported by the IPLD Data Model and cannot be encoded
            removeUndefinedProperties(descriptor);
            // only generate the `authorization` property if signature input is given
            let authorization;
            if (options.signer !== undefined) {
                authorization = yield Message.createAuthorization({
                    descriptor,
                    signer: options.signer,
                    permissionGrantId: options.permissionGrantId
                });
            }
            const message = { descriptor, authorization };
            Message.validateJsonSchema(message);
            const protocolsQuery = new ProtocolsQuery(message);
            return protocolsQuery;
        });
    }
    static normalizeFilter(filter) {
        return Object.assign(Object.assign({}, filter), { protocol: normalizeProtocolUrl(filter.protocol) });
    }
    authorize(tenant, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            // if author is the same as the target tenant, we can directly grant access
            if (this.author === tenant) {
                return;
            }
            else if (this.author !== undefined && this.signaturePayload.permissionGrantId) {
                const permissionGrant = yield PermissionsProtocol.fetchGrant(tenant, messageStore, this.signaturePayload.permissionGrantId);
                yield GrantAuthorization.performBaseValidation({
                    incomingMessage: this.message,
                    expectedGrantor: tenant,
                    expectedGrantee: this.author,
                    permissionGrant,
                    messageStore
                });
            }
            else {
                throw new DwnError(DwnErrorCode.ProtocolsQueryUnauthorized, 'The ProtocolsQuery failed authorization');
            }
        });
    }
}
//# sourceMappingURL=protocols-query.js.map