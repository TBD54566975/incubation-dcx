var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Encoder } from '../utils/encoder.js';
import { PermissionGrant } from './permission-grant.js';
import { PermissionRequest } from './permission-request.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
import { Time } from '../utils/time.js';
import { validateJsonSchema } from '../schema-validator.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
import { normalizeProtocolUrl, validateProtocolUrlNormalized } from '../utils/url.js';
/**
 * This is a first-class DWN protocol for managing permission grants of a given DWN.
 */
export class PermissionsProtocol {
    static parseRequest(base64UrlEncodedRequest) {
        return Encoder.base64UrlToObject(base64UrlEncodedRequest);
    }
    /**
     * Convenience method to create a permission request.
     */
    static createRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRecordPermissionScope(options.scope) && options.scope.protocol === undefined) {
                throw new DwnError(DwnErrorCode.PermissionsProtocolCreateRequestRecordsScopeMissingProtocol, 'Permission request for Records must have a scope with a `protocol` property');
            }
            const scope = PermissionsProtocol.normalizePermissionScope(options.scope);
            const permissionRequestData = {
                description: options.description,
                delegated: options.delegated,
                scope,
                conditions: options.conditions,
            };
            // If the request is scoped to a protocol, the protocol tag must be included with the record.
            // This is done in order to ensure a subset message query filtered to a protocol includes the permission requests associated with it.
            let permissionTags = undefined;
            if (this.hasProtocolScope(scope)) {
                permissionTags = {
                    protocol: scope.protocol
                };
            }
            const permissionRequestBytes = Encoder.objectToBytes(permissionRequestData);
            const recordsWrite = yield RecordsWrite.create({
                signer: options.signer,
                messageTimestamp: options.dateRequested,
                protocol: PermissionsProtocol.uri,
                protocolPath: PermissionsProtocol.requestPath,
                dataFormat: 'application/json',
                data: permissionRequestBytes,
                tags: permissionTags,
            });
            const dataEncodedMessage = Object.assign(Object.assign({}, recordsWrite.message), { encodedData: Encoder.bytesToBase64Url(permissionRequestBytes) });
            return {
                recordsWrite,
                permissionRequestData,
                permissionRequestBytes,
                dataEncodedMessage
            };
        });
    }
    /**
     * Convenience method to create a permission grant.
     */
    static createGrant(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRecordPermissionScope(options.scope) && options.scope.protocol === undefined) {
                throw new DwnError(DwnErrorCode.PermissionsProtocolCreateGrantRecordsScopeMissingProtocol, 'Permission grants for Records must have a scope with a `protocol` property');
            }
            const scope = PermissionsProtocol.normalizePermissionScope(options.scope);
            const permissionGrantData = {
                dateExpires: options.dateExpires,
                requestId: options.requestId,
                description: options.description,
                delegated: options.delegated,
                scope,
                conditions: options.conditions,
            };
            // If the grant is scoped to a protocol, the protocol tag must be included with the record.
            // This is done in order to ensure a subset message query filtered to a protocol includes the permission grants associated with it.
            let permissionTags = undefined;
            if (this.hasProtocolScope(scope)) {
                permissionTags = {
                    protocol: scope.protocol
                };
            }
            const permissionGrantBytes = Encoder.objectToBytes(permissionGrantData);
            const recordsWrite = yield RecordsWrite.create({
                signer: options.signer,
                messageTimestamp: options.dateGranted,
                dateCreated: options.dateGranted,
                recipient: options.grantedTo,
                protocol: PermissionsProtocol.uri,
                protocolPath: PermissionsProtocol.grantPath,
                dataFormat: 'application/json',
                data: permissionGrantBytes,
                tags: permissionTags,
            });
            const dataEncodedMessage = Object.assign(Object.assign({}, recordsWrite.message), { encodedData: Encoder.bytesToBase64Url(permissionGrantBytes) });
            return {
                recordsWrite,
                permissionGrantData,
                permissionGrantBytes,
                dataEncodedMessage
            };
        });
    }
    /**
     * Convenience method to create a permission revocation.
     */
    static createRevocation(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionRevocationData = {
                description: options.description,
            };
            const grantId = options.grant.id;
            // if the grant was scoped to a protocol, the protocol tag must be included in the revocation
            // This is done in order to ensure a subset message query filtered to a protocol includes the permission revocations associated with it.
            //
            // NOTE: the added tag is validated against the original grant when the revocation is processed by the DWN.
            let permissionTags = undefined;
            if (this.hasProtocolScope(options.grant.scope)) {
                const protocol = normalizeProtocolUrl(options.grant.scope.protocol);
                permissionTags = { protocol };
            }
            const permissionRevocationBytes = Encoder.objectToBytes(permissionRevocationData);
            const recordsWrite = yield RecordsWrite.create({
                signer: options.signer,
                parentContextId: grantId,
                protocol: PermissionsProtocol.uri,
                protocolPath: PermissionsProtocol.revocationPath,
                dataFormat: 'application/json',
                data: permissionRevocationBytes,
                tags: permissionTags,
            });
            const dataEncodedMessage = Object.assign(Object.assign({}, recordsWrite.message), { encodedData: Encoder.bytesToBase64Url(permissionRevocationBytes) });
            return {
                recordsWrite,
                permissionRevocationData,
                permissionRevocationBytes,
                dataEncodedMessage
            };
        });
    }
    /**
     * Validates the given Permissions protocol RecordsWrite. It can be a request, grant, or revocation.
     */
    static validateSchema(recordsWriteMessage, dataBytes) {
        const dataString = Encoder.bytesToString(dataBytes);
        const dataObject = JSON.parse(dataString);
        if (recordsWriteMessage.descriptor.protocolPath === PermissionsProtocol.requestPath) {
            const permissionRequestData = dataObject;
            validateJsonSchema('PermissionRequestData', permissionRequestData);
            // more nuanced validation that are annoying/difficult to do using JSON schema
            PermissionsProtocol.validateScopeAndTags(permissionRequestData.scope, recordsWriteMessage);
        }
        else if (recordsWriteMessage.descriptor.protocolPath === PermissionsProtocol.grantPath) {
            validateJsonSchema('PermissionGrantData', dataObject);
            // more nuanced validation that are annoying/difficult to do using JSON schema
            const permissionGrantData = dataObject;
            PermissionsProtocol.validateScopeAndTags(permissionGrantData.scope, recordsWriteMessage);
            Time.validateTimestamp(permissionGrantData.dateExpires);
        }
        else if (recordsWriteMessage.descriptor.protocolPath === PermissionsProtocol.revocationPath) {
            validateJsonSchema('PermissionRevocationData', dataObject);
        }
        else {
            // defensive programming, should not be unreachable externally
            throw new DwnError(DwnErrorCode.PermissionsProtocolValidateSchemaUnexpectedRecord, `Unexpected permission record: ${recordsWriteMessage.descriptor.protocolPath}`);
        }
    }
    /**
     * Fetches PermissionGrant with the specified `recordID`.
     * @returns the PermissionGrant matching the `recordId` specified.
     * @throws {Error} if PermissionGrant does not exist
     */
    static fetchGrant(tenant, messageStore, permissionGrantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const grantQuery = {
                recordId: permissionGrantId,
                isLatestBaseState: true
            };
            const { messages } = yield messageStore.query(tenant, [grantQuery]);
            const possibleGrantMessage = messages[0];
            const dwnInterface = possibleGrantMessage === null || possibleGrantMessage === void 0 ? void 0 : possibleGrantMessage.descriptor.interface;
            const dwnMethod = possibleGrantMessage === null || possibleGrantMessage === void 0 ? void 0 : possibleGrantMessage.descriptor.method;
            if (dwnInterface !== DwnInterfaceName.Records ||
                dwnMethod !== DwnMethodName.Write ||
                possibleGrantMessage.descriptor.protocolPath !== PermissionsProtocol.grantPath) {
                throw new DwnError(DwnErrorCode.GrantAuthorizationGrantMissing, `Could not find permission grant with record ID ${permissionGrantId}.`);
            }
            const permissionGrantMessage = possibleGrantMessage;
            const permissionGrant = yield PermissionGrant.parse(permissionGrantMessage);
            return permissionGrant;
        });
    }
    /**
     * Gets the scope from the given permission record.
     * If the record is a revocation, the scope is fetched from the grant that is being revoked.
     *
     * @param messageStore The message store to fetch the grant for a revocation.
     */
    static getScopeFromPermissionRecord(tenant, messageStore, incomingMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (incomingMessage.descriptor.protocol !== PermissionsProtocol.uri) {
                throw new DwnError(DwnErrorCode.PermissionsProtocolGetScopeInvalidProtocol, `Unexpected protocol for permission record: ${incomingMessage.descriptor.protocol}`);
            }
            if (incomingMessage.descriptor.protocolPath === PermissionsProtocol.revocationPath) {
                const grant = yield PermissionsProtocol.fetchGrant(tenant, messageStore, incomingMessage.descriptor.parentId);
                return grant.scope;
            }
            else if (incomingMessage.descriptor.protocolPath === PermissionsProtocol.grantPath) {
                const grant = yield PermissionGrant.parse(incomingMessage);
                return grant.scope;
            }
            else {
                // if the record is not a grant or revocation, it must be a request
                const request = yield PermissionRequest.parse(incomingMessage);
                return request.scope;
            }
        });
    }
    /**
     * Normalizes the given permission scope if needed.
     * @returns The normalized permission scope.
     */
    static normalizePermissionScope(permissionScope) {
        const scope = Object.assign({}, permissionScope);
        if (PermissionsProtocol.hasProtocolScope(scope)) {
            scope.protocol = normalizeProtocolUrl(scope.protocol);
        }
        return scope;
    }
    /**
     * Type guard to determine if the scope is a record permission scope.
     */
    static isRecordPermissionScope(scope) {
        return scope.interface === 'Records';
    }
    /**
     * Type guard to determine if the permission is a protocol-scoped
     */
    static hasProtocolScope(scope) {
        return 'protocol' in scope && scope.protocol !== undefined;
    }
    /**
     * Validates that tags must include a protocol tag that matches the scoped protocol.
     */
    static validateTags(requestOrGrant, scopedProtocol) {
        // the protocol tag must be included with the record.
        if (requestOrGrant.descriptor.tags === undefined || requestOrGrant.descriptor.tags.protocol === undefined) {
            throw new DwnError(DwnErrorCode.PermissionsProtocolValidateScopeMissingProtocolTag, 'Permission grants must have a `tags` property that contains a protocol tag');
        }
        // The protocol tag must match the protocol in the scope
        const taggedProtocol = requestOrGrant.descriptor.tags.protocol;
        if (taggedProtocol !== scopedProtocol) {
            throw new DwnError(DwnErrorCode.PermissionsProtocolValidateScopeProtocolMismatch, `Permission grants must have a scope with a protocol that matches the tagged protocol: ${taggedProtocol}`);
        }
    }
    /**
     * Validates scope and tags of the given permission request or grant.
     */
    static validateScopeAndTags(scope, requestOrGrant) {
        // scoped protocol validations
        if (this.hasProtocolScope(scope)) {
            validateProtocolUrlNormalized(scope.protocol);
            this.validateTags(requestOrGrant, scope.protocol);
        }
        // if the scope is not a record permission scope, no additional validation is required
        if (!this.isRecordPermissionScope(scope)) {
            return;
        }
        // otherwise this is a record permission scope, more validation needed below
        // `contextId` and `protocolPath` are mutually exclusive
        if (scope.contextId !== undefined && scope.protocolPath !== undefined) {
            throw new DwnError(DwnErrorCode.PermissionsProtocolValidateScopeContextIdProhibitedProperties, 'Permission grants cannot have both `contextId` and `protocolPath` present');
        }
    }
}
/**
 * The URI of the DWN Permissions protocol.
 */
PermissionsProtocol.uri = 'https://tbd.website/dwn/permissions';
/**
 * The protocol path of the `request` record.
 */
PermissionsProtocol.requestPath = 'request';
/**
 * The protocol path of the `grant` record.
 */
PermissionsProtocol.grantPath = 'grant';
/**
 * The protocol path of the `revocation` record.
 */
PermissionsProtocol.revocationPath = 'grant/revocation';
/**
 * The definition of the Permissions protocol.
 */
PermissionsProtocol.definition = {
    published: true,
    protocol: PermissionsProtocol.uri,
    types: {
        request: {
            dataFormats: ['application/json']
        },
        grant: {
            dataFormats: ['application/json']
        },
        revocation: {
            dataFormats: ['application/json']
        }
    },
    structure: {
        request: {
            $size: {
                max: 10000
            },
            $actions: [
                {
                    who: 'anyone',
                    can: ['create']
                }
            ]
        },
        grant: {
            $size: {
                max: 10000
            },
            $actions: [
                {
                    who: 'recipient',
                    of: 'grant',
                    can: ['read', 'query']
                }
            ],
            revocation: {
                $size: {
                    max: 10000
                },
                $actions: [
                    {
                        who: 'anyone',
                        can: ['read']
                    }
                ]
            }
        }
    }
};
;
//# sourceMappingURL=permissions.js.map