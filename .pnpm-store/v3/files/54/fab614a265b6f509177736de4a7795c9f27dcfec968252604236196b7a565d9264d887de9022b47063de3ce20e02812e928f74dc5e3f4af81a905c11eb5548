var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { AbstractMessage } from '../core/abstract-message.js';
import Ajv from 'ajv/dist/2020.js';
import { Message } from '../core/message.js';
import { Time } from '../utils/time.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
import { normalizeProtocolUrl, normalizeSchemaUrl, validateProtocolUrlNormalized, validateSchemaUrlNormalized } from '../utils/url.js';
import { ProtocolAction, ProtocolActor } from '../types/protocols-types.js';
export class ProtocolsConfigure extends AbstractMessage {
    static parse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            Message.validateJsonSchema(message);
            ProtocolsConfigure.validateProtocolDefinition(message.descriptor.definition);
            yield Message.validateSignatureStructure(message.authorization.signature, message.descriptor);
            Time.validateTimestamp(message.descriptor.messageTimestamp);
            return new ProtocolsConfigure(message);
        });
    }
    static create(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const descriptor = {
                interface: DwnInterfaceName.Protocols,
                method: DwnMethodName.Configure,
                messageTimestamp: (_a = options.messageTimestamp) !== null && _a !== void 0 ? _a : Time.getCurrentTimestamp(),
                definition: ProtocolsConfigure.normalizeDefinition(options.definition)
            };
            const authorization = yield Message.createAuthorization({
                descriptor,
                signer: options.signer,
                permissionGrantId: options.permissionGrantId
            });
            const message = { descriptor, authorization };
            Message.validateJsonSchema(message);
            ProtocolsConfigure.validateProtocolDefinition(message.descriptor.definition);
            const protocolsConfigure = new ProtocolsConfigure(message);
            return protocolsConfigure;
        });
    }
    /**
     * Performs validation on the given protocol definition that are not easy to do using a JSON schema.
     */
    static validateProtocolDefinition(definition) {
        const { protocol, types } = definition;
        // validate protocol url
        validateProtocolUrlNormalized(protocol);
        // validate schema url normalized
        for (const typeName in types) {
            const schema = types[typeName].schema;
            if (schema !== undefined) {
                validateSchemaUrlNormalized(schema);
            }
        }
        // validate `structure
        ProtocolsConfigure.validateStructure(definition);
    }
    static validateStructure(definition) {
        // gather all declared record types
        const recordTypes = Object.keys(definition.types);
        // gather all roles
        const roles = ProtocolsConfigure.fetchAllRolePathsRecursively('', definition.structure, []);
        // validate the entire rule set structure recursively
        ProtocolsConfigure.validateRuleSetRecursively({
            ruleSet: definition.structure,
            ruleSetProtocolPath: '',
            recordTypes,
            roles
        });
    }
    /**
     * Parses the given rule set hierarchy to get all the role protocol paths.
     * @throws DwnError if the hierarchy depth goes beyond 10 levels.
     */
    static fetchAllRolePathsRecursively(ruleSetProtocolPath, ruleSet, roles) {
        // Limit the depth of the record hierarchy to 10 levels
        // There is opportunity to optimize here to avoid repeated string splitting
        if (ruleSetProtocolPath.split('/').length > 10) {
            throw new DwnError(DwnErrorCode.ProtocolsConfigureRecordNestingDepthExceeded, 'Record nesting depth exceeded 10 levels.');
        }
        for (const recordType in ruleSet) {
            // ignore non-nested-record properties
            if (recordType.startsWith('$')) {
                continue;
            }
            const childRuleSet = ruleSet[recordType];
            let childRuleSetProtocolPath;
            if (ruleSetProtocolPath === '') {
                childRuleSetProtocolPath = recordType;
            }
            else {
                childRuleSetProtocolPath = `${ruleSetProtocolPath}/${recordType}`;
            }
            // if this is a role record, add it to the list, else continue to traverse
            if (childRuleSet.$role) {
                roles.push(childRuleSetProtocolPath);
            }
            else {
                ProtocolsConfigure.fetchAllRolePathsRecursively(childRuleSetProtocolPath, childRuleSet, roles);
            }
        }
        return roles;
    }
    /**
     * Validates the given rule set structure then recursively validates its nested child rule sets.
     */
    static validateRuleSetRecursively(input) {
        var _a;
        const { ruleSet, ruleSetProtocolPath, recordTypes, roles } = input;
        // Validate $actions in the rule set
        if (ruleSet.$size !== undefined) {
            const { min = 0, max } = ruleSet.$size;
            if (max !== undefined && max < min) {
                throw new DwnError(DwnErrorCode.ProtocolsConfigureInvalidSize, `Invalid size range found: max limit ${max} less than min limit ${min} at protocol path '${ruleSetProtocolPath}'`);
            }
        }
        if (ruleSet.$tags) {
            const ajv = new Ajv.default();
            const _b = ruleSet.$tags, { $allowUndefinedTags, $requiredTags } = _b, tagProperties = __rest(_b, ["$allowUndefinedTags", "$requiredTags"]);
            // we validate each tag's expected schema to ensure it is a valid JSON schema
            for (const tag in tagProperties) {
                const tagSchemaDefinition = tagProperties[tag];
                if (!ajv.validateSchema(tagSchemaDefinition)) {
                    const schemaError = ajv.errorsText(ajv.errors, { dataVar: `${ruleSetProtocolPath}/$tags/${tag}` });
                    throw new DwnError(DwnErrorCode.ProtocolsConfigureInvalidTagSchema, `tags schema validation error: ${schemaError}`);
                }
            }
        }
        // validate each action rule
        const actionRules = (_a = ruleSet.$actions) !== null && _a !== void 0 ? _a : [];
        for (let i = 0; i < actionRules.length; i++) {
            const actionRule = actionRules[i];
            // Validate the `role` property of an `action` if exists.
            if (actionRule.role !== undefined) {
                // make sure the role contains a valid protocol paths to a role record
                if (!roles.includes(actionRule.role)) {
                    throw new DwnError(DwnErrorCode.ProtocolsConfigureRoleDoesNotExistAtGivenPath, `Role in action ${JSON.stringify(actionRule)} for rule set ${ruleSetProtocolPath} does not exist.`);
                }
            }
            // Validate that if `who` is set to `anyone` then `of` is not set
            if (actionRule.who === 'anyone' && actionRule.of) {
                throw new DwnError(DwnErrorCode.ProtocolsConfigureInvalidActionOfNotAllowed, `'of' is not allowed at rule set protocol path (${ruleSetProtocolPath})`);
            }
            // Validate that if `who === recipient` and `of === undefined`, then `can` can only contain `co-update`, `co-delete`, and `co-prune`.
            // We do not allow `read`, `write`, or `query` in the `can` array because:
            // - `read` - Recipients are always allowed to `read`.
            // - `write` - Entails ability to create and update.
            //             Since `of` is undefined, it implies the recipient of THIS record,
            //             there is no 'recipient' until this record has been created, so it makes no sense to allow recipient to write this record.
            // - `query` - Only authorized using roles, so allowing direct recipients to query is outside the scope.
            if (actionRule.who === ProtocolActor.Recipient && actionRule.of === undefined) {
                // throw if `can` contains a value that is not `co-update`, `co-delete`, or `co-prune`
                const hasDisallowedAction = actionRule.can.some(action => ![ProtocolAction.CoUpdate, ProtocolAction.CoDelete, ProtocolAction.CoPrune].includes(action));
                if (hasDisallowedAction) {
                    throw new DwnError(DwnErrorCode.ProtocolsConfigureInvalidRecipientOfAction, 'Rules for `recipient` without `of` property must have `can` containing only `co-update`, `co-delete`, and `co-prune`.');
                }
            }
            // Validate that if `who` is set to `author` then `of` is set
            if (actionRule.who === ProtocolActor.Author && !actionRule.of) {
                throw new DwnError(DwnErrorCode.ProtocolsConfigureInvalidActionMissingOf, `'of' is required when 'author' is specified as 'who'`);
            }
            // validate that if `can` contains `update` or `delete`, it must also contain `create`
            if (actionRule.can !== undefined) {
                if (actionRule.can.includes(ProtocolAction.Update) && !actionRule.can.includes(ProtocolAction.Create)) {
                    throw new DwnError(DwnErrorCode.ProtocolsConfigureInvalidActionUpdateWithoutCreate, `Action rule ${JSON.stringify(actionRule)} contains 'update' action but missing the required 'create' action.`);
                }
                if (actionRule.can.includes(ProtocolAction.Delete) && !actionRule.can.includes(ProtocolAction.Create)) {
                    throw new DwnError(DwnErrorCode.ProtocolsConfigureInvalidActionDeleteWithoutCreate, `Action rule ${JSON.stringify(actionRule)} contains 'delete' action but missing the required 'create' action.`);
                }
            }
            // Validate that there are no duplicate actors or roles in the remaining action rules:
            // ie. no two action rules can have the same combination of `who` + `of` or `role`.
            // NOTE: we only need to check the remaining action rules that have yet to go through action rule validation loop, as a perf shortcut.
            for (let j = i + 1; j < actionRules.length; j++) {
                const otherActionRule = actionRules[j];
                if (actionRule.who !== undefined) {
                    if (actionRule.who === otherActionRule.who && actionRule.of === otherActionRule.of) {
                        throw new DwnError(DwnErrorCode.ProtocolsConfigureDuplicateActorInRuleSet, `More than one action rule per actor ${actionRule.who} of ${actionRule.of} not allowed within a rule set: ${JSON.stringify(actionRule)}`);
                    }
                }
                else {
                    // else implicitly a role-based action rule
                    if (actionRule.role === otherActionRule.role) {
                        throw new DwnError(DwnErrorCode.ProtocolsConfigureDuplicateRoleInRuleSet, `More than one action rule per role ${actionRule.role} not allowed within a rule set: ${JSON.stringify(actionRule)}`);
                    }
                }
            }
        }
        // Validate nested rule sets
        for (const recordType in ruleSet) {
            if (recordType.startsWith('$')) {
                continue;
            }
            if (!recordTypes.includes(recordType)) {
                throw new DwnError(DwnErrorCode.ProtocolsConfigureInvalidRuleSetRecordType, `Rule set ${recordType} is not declared as an allowed type in the protocol definition.`);
            }
            const childRuleSet = ruleSet[recordType];
            let childRuleSetProtocolPath;
            if (ruleSetProtocolPath === '') {
                childRuleSetProtocolPath = recordType; // case of initial definition structure
            }
            else {
                childRuleSetProtocolPath = `${ruleSetProtocolPath}/${recordType}`;
            }
            ProtocolsConfigure.validateRuleSetRecursively({
                ruleSet: childRuleSet,
                ruleSetProtocolPath: childRuleSetProtocolPath,
                recordTypes,
                roles
            });
        }
    }
    static normalizeDefinition(definition) {
        const typesCopy = Object.assign({}, definition.types);
        // Normalize schema url
        for (const typeName in typesCopy) {
            const schema = typesCopy[typeName].schema;
            if (schema !== undefined) {
                typesCopy[typeName].schema = normalizeSchemaUrl(schema);
            }
        }
        return Object.assign(Object.assign({}, definition), { protocol: normalizeProtocolUrl(definition.protocol), types: typesCopy });
    }
}
//# sourceMappingURL=protocols-configure.js.map