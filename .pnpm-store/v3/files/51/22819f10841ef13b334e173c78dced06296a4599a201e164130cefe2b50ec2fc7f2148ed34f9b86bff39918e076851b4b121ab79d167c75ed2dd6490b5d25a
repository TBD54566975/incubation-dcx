import type { DidMethodResolver } from '../methods/did-method.js';
import type { DidResolver, DidResolverCache, DidUrlDereferencer } from '../types/did-resolution.js';
import type { DidDereferencingOptions, DidDereferencingResult, DidResolutionOptions, DidResolutionResult } from '../types/did-core.js';
/**
 * Parameters for configuring the `UniversalResolver` class, which is responsible for resolving
 * decentralized identifiers (DIDs) to their corresponding DID documents.
 *
 * This type specifies the essential components required by the `UniversalResolver` to perform
 * DID resolution and dereferencing. It includes an array of `DidMethodResolver` instances,
 * each capable of resolving DIDs for a specific method, and optionally, a cache for storing
 * resolved DID documents to improve resolution efficiency.
 */
export type UniversalResolverParams = {
    /**
     * An array of `DidMethodResolver` instances.
     *
     * Each resolver in this array is designed to handle a specific DID method, enabling the
     * `DidResolver` to support multiple DID methods simultaneously.
     */
    didResolvers: DidMethodResolver[];
    /**
     * An optional `DidResolverCache` instance used for caching resolved DID documents.
     *
     * Providing a cache implementation can significantly enhance resolution performance by avoiding
     * redundant resolutions for previously resolved DIDs. If omitted, a no-operation cache is used,
     * which effectively disables caching.
     */
    cache?: DidResolverCache;
};
/**
 * The `DidResolver` class provides mechanisms for resolving Decentralized Identifiers (DIDs) to
 * their corresponding DID documents.
 *
 * The class is designed to handle various DID methods by utilizing an array of `DidMethodResolver`
 * instances, each responsible for a specific DID method.
 *
 * Providing a cache implementation can significantly enhance resolution performance by avoiding
 * redundant resolutions for previously resolved DIDs. If omitted, a no-operation cache is used,
 * which effectively disables caching.
 *
 * Usage:
 * - Construct the `DidResolver` with an array of `DidMethodResolver` instances and an optional cache.
 * - Use `resolve` to resolve a DID to its DID Resolution Result.
 * - Use `dereference` to extract specific resources from a DID URL, like service endpoints or verification methods.
 *
 * @example
 * ```ts
 * const resolver = new DidResolver({
 *   didResolvers: [<array of DidMethodResolver instances>],
 *   cache: new DidResolverCacheNoop()
 * });
 *
 * const resolutionResult = await resolver.resolve('did:example:123456');
 * const dereferenceResult = await resolver.dereference({ didUri: 'did:example:123456#key-1' });
 * ```
 */
export declare class UniversalResolver implements DidResolver, DidUrlDereferencer {
    /**
     * A cache for storing resolved DID documents.
     */
    protected cache: DidResolverCache;
    /**
     * A map to store method resolvers against method names.
     */
    private didResolvers;
    /**
     * Constructs a new `DidResolver`.
     *
     * @param params - The parameters for constructing the `DidResolver`.
     */
    constructor({ cache, didResolvers }: UniversalResolverParams);
    /**
     * Resolves a DID to a DID Resolution Result.
     *
     * If the DID Resolution Result is present in the cache, it returns the cached result. Otherwise,
     * it uses the appropriate method resolver to resolve the DID, stores the resolution result in the
     * cache, and returns the resolultion result.
     *
     * @param didUri - The DID or DID URL to resolve.
     * @returns A promise that resolves to the DID Resolution Result.
     */
    resolve(didUri: string, options?: DidResolutionOptions): Promise<DidResolutionResult>;
    /**
     * Dereferences a DID (Decentralized Identifier) URL to a corresponding DID resource.
     *
     * This method interprets the DID URL's components, which include the DID method, method-specific
     * identifier, path, query, and fragment, and retrieves the related resource as per the DID Core
     * specifications.
     *
     * The dereferencing process involves resolving the DID contained in the DID URL to a DID document,
     * and then extracting the specific part of the document identified by the fragment in the DID URL.
     * If no fragment is specified, the entire DID document is returned.
     *
     * This method supports resolution of different components within a DID document such as service
     * endpoints and verification methods, based on their IDs. It accommodates both full and
     * DID URLs as specified in the DID Core specification.
     *
     * More information on DID URL dereferencing can be found in the
     * {@link https://www.w3.org/TR/did-core/#did-url-dereferencing | DID Core specification}.
     *
     * TODO: This is a partial implementation and does not fully implement DID URL dereferencing. (https://github.com/TBD54566975/web5-js/issues/387)
     *
     * @param didUrl - The DID URL string to dereference.
     * @param [_options] - Input options to the dereference function. Optional.
     * @returns a {@link DidDereferencingResult}
     */
    dereference(didUrl: string, _options?: DidDereferencingOptions): Promise<DidDereferencingResult>;
}
//# sourceMappingURL=universal-resolver.d.ts.map