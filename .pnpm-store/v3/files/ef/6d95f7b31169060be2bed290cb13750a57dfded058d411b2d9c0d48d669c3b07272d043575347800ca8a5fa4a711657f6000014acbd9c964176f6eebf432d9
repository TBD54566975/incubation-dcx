import type { Jwk, KeyIdentifier, KmsExportKeyParams, KmsGetPublicKeyParams, KmsSignParams } from '@web5/crypto';
import { LocalKeyManager } from '@web5/crypto';
import type { Web5PlatformAgent } from './types/agent.js';
/**
 * Internal utility functions used by the Web5 platform agent that are not intended for public use
 * and are not exported in the public API.
 */
/**
 * Separator used to join the tenant DID and the DID URI that is used to prefix all lookups in the
 * Agent data stores, including the DWN-backed store's index and the in-memory store's map.
 */
export declare const TENANT_SEPARATOR = "^";
export declare class DeterministicKeyGenerator extends LocalKeyManager {
    private _predefinedKeys;
    private _keyGenerator;
    constructor();
    addPredefinedKeys({ privateKeys }: {
        privateKeys: Jwk[];
    }): Promise<void>;
    exportKey({ keyUri }: KmsExportKeyParams): Promise<Jwk>;
    generateKey(_params: {
        algorithm: 'Ed25519' | 'secp256k1' | 'secp256r1';
    }): Promise<KeyIdentifier>;
    getPublicKey({ keyUri }: KmsGetPublicKeyParams): Promise<Jwk>;
    sign({ keyUri, data }: KmsSignParams): Promise<Uint8Array>;
}
/**
 * Determines the tenant identifier (DID) for data store operations based on the provided
 * parameters.
 *
 * The function identifies the tenant using a priority order:
 * 1. directly provided tenant DID,
 * 2. the agent's DID,
 * 3. or a specified DID URI.
 *
 * This approach ensures operations are isolated by DID, supporting multi-tenancy.
 *
 * @param params - The parameters for determining the tenant.
 * @param params.agent - The Web5 platform agent instance.
 * @param [params.tenant] - An optional tenant DID. If provided, it takes precedence.
 * @param [params.didUri] - An optional DID URI to use if no tenant DID or agent DID is available.
 * @returns A promise that resolves to the tenant DID.
 * @throws Throws an error if it fails to determine the tenant from the provided inputs.
 */
export declare function getDataStoreTenant({ agent, tenant, didUri }: {
    agent: Web5PlatformAgent;
    tenant?: string;
    didUri?: string;
}): Promise<string>;
//# sourceMappingURL=utils-internal.d.ts.map