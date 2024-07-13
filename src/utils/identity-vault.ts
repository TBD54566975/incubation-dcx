import { IdentityVaultStatus, IdentityVaultBackup } from "@web5/agent";
import { PortableDid } from "@web5/dids";

export function isPortableDid(obj: unknown): obj is PortableDid {
    // Validate that the given value is an object that has the necessary properties of PortableDid.
    return !(!obj || typeof obj !== 'object' || obj === null)
        && 'uri' in obj
        && 'document' in obj
        && 'metadata' in obj
        && (!('keyManager' in obj) || obj.keyManager === undefined);
}

export function isIdentityVaultStatus(obj: unknown): obj is IdentityVaultStatus {
    return typeof obj === 'object' && obj !== null
        && 'initialized' in obj && typeof obj.initialized === 'boolean'
        && 'lastBackup' in obj
        && 'lastRestore' in obj;
}

export function isIdentityVaultBackup(obj: unknown): obj is IdentityVaultBackup {
    return typeof obj === 'object' && obj !== null
        && 'dateCreated' in obj && typeof obj.dateCreated === 'string'
        && 'size' in obj && typeof obj.size === 'number'
        && 'data' in obj && typeof obj.data === 'string';
}