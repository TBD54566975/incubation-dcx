import type { DidResolutionOptions, DidResolutionResult } from '../types/did-core.js';
import { DidMethod } from './did-method.js';
/**
 * The `DidWeb` class provides an implementation of the `did:web` DID method.
 *
 * Features:
 * - DID Resolution: Resolve a `did:web` to its corresponding DID Document.
 *
 * @remarks
 * The `did:web` method uses a web domain's existing reputation and aims to integrate decentralized
 * identities with the existing web infrastructure to drive adoption. It leverages familiar web
 * security models and domain ownership to provide accessible, interoperable digital identity
 * management.
 *
 * @see {@link https://w3c-ccg.github.io/did-method-web/ | DID Web Specification}
 *
 * @example
 * ```ts
 * // DID Resolution
 * const resolutionResult = await DidWeb.resolve({ did: did.uri });
 * ```
 */
export declare class DidWeb extends DidMethod {
    /**
     * Name of the DID method, as defined in the DID Web specification.
     */
    static methodName: string;
    /**
     * Resolves a `did:web` identifier to a DID Document.
     *
     * @param didUri - The DID to be resolved.
     * @param _options - Optional parameters for resolving the DID. Unused by this DID method.
     * @returns A Promise resolving to a {@link DidResolutionResult} object representing the result of the resolution.
     */
    static resolve(didUri: string, _options?: DidResolutionOptions): Promise<DidResolutionResult>;
}
//# sourceMappingURL=did-web.d.ts.map