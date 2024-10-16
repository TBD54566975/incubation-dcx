import type { Signer } from '../types/signer.js';
import type { ProtocolDefinition, ProtocolsConfigureMessage } from '../types/protocols-types.js';
import { AbstractMessage } from '../core/abstract-message.js';
export type ProtocolsConfigureOptions = {
    messageTimestamp?: string;
    definition: ProtocolDefinition;
    signer: Signer;
    permissionGrantId?: string;
};
export declare class ProtocolsConfigure extends AbstractMessage<ProtocolsConfigureMessage> {
    static parse(message: ProtocolsConfigureMessage): Promise<ProtocolsConfigure>;
    static create(options: ProtocolsConfigureOptions): Promise<ProtocolsConfigure>;
    /**
     * Performs validation on the given protocol definition that are not easy to do using a JSON schema.
     */
    private static validateProtocolDefinition;
    private static validateStructure;
    /**
     * Parses the given rule set hierarchy to get all the role protocol paths.
     * @throws DwnError if the hierarchy depth goes beyond 10 levels.
     */
    private static fetchAllRolePathsRecursively;
    /**
     * Validates the given rule set structure then recursively validates its nested child rule sets.
     */
    private static validateRuleSetRecursively;
    private static normalizeDefinition;
}
//# sourceMappingURL=protocols-configure.d.ts.map