/**
 * The `Did` class represents a Decentralized Identifier (DID) Uniform Resource Identifier (URI).
 *
 * This class provides a method for parsing a DID URI string into its component parts, as well as a
 * method for serializing a DID URI object into a string.
 *
 * A DID URI is composed of the following components:
 * - scheme
 * - method
 * - id
 * - path
 * - query
 * - fragment
 * - params
 *
 * @see {@link https://www.w3.org/TR/did-core/#did-syntax | DID Core Specification, § DID Syntax}
 */
export declare class Did {
    /** Regular expression pattern for matching the method component of a DID URI. */
    static readonly METHOD_PATTERN = "([a-z0-9]+)";
    /** Regular expression pattern for matching percent-encoded characters in a method identifier. */
    static readonly PCT_ENCODED_PATTERN = "(?:%[0-9a-fA-F]{2})";
    /** Regular expression pattern for matching the characters allowed in a method identifier. */
    static readonly ID_CHAR_PATTERN: string;
    /** Regular expression pattern for matching the method identifier component of a DID URI. */
    static readonly METHOD_ID_PATTERN: string;
    /** Regular expression pattern for matching the path component of a DID URI. */
    static readonly PATH_PATTERN = "(/[^#?]*)?";
    /** Regular expression pattern for matching the query component of a DID URI. */
    static readonly QUERY_PATTERN = "([?][^#]*)?";
    /** Regular expression pattern for matching the fragment component of a DID URI. */
    static readonly FRAGMENT_PATTERN = "(#.*)?";
    /** Regular expression pattern for matching all of the components of a DID URI. */
    static readonly DID_URI_PATTERN: RegExp;
    /**
     * A string representation of the DID.
     *
     * A DID is a URI composed of three parts: the scheme `did:`, a method identifier, and a unique,
     * method-specific identifier specified by the DID method.
     *
     * @example
     * did:dht:h4d3ixkwt6q5a455tucw7j14jmqyghdtbr6cpiz6on5oxj5bpr3o
     */
    uri: string;
    /**
     * The name of the DID method.
     *
     * Examples of DID method names are `dht`, `jwk`, and `web`, among others.
     */
    method: string;
    /**
     * The DID method identifier.
     *
     * @example
     * h4d3ixkwt6q5a455tucw7j14jmqyghdtbr6cpiz6on5oxj5bpr3o
     */
    id: string;
    /**
        * Optional path component of the DID URI.
        *
        * @example
        * did:web:tbd.website/path
        */
    path?: string;
    /**
        * Optional query component of the DID URI.
        *
        * @example
        * did:web:tbd.website?versionId=1
        */
    query?: string;
    /**
     * Optional fragment component of the DID URI.
     *
     * @example
     * did:web:tbd.website#key-1
     */
    fragment?: string;
    /**
      * Optional query parameters in the DID URI.
      *
      * @example
      * did:web:tbd.website?service=files&relativeRef=/whitepaper.pdf
      */
    params?: Record<string, string>;
    /**
     * Constructs a new `Did` instance from individual components.
     *
     * @param params - An object containing the parameters to be included in the DID URI.
     * @param params.method - The name of the DID method.
     * @param params.id - The DID method identifier.
     * @param params.path - Optional. The path component of the DID URI.
     * @param params.query - Optional. The query component of the DID URI.
     * @param params.fragment - Optional. The fragment component of the DID URI.
     * @param params.params - Optional. The query parameters in the DID URI.
     */
    constructor({ method, id, path, query, fragment, params }: {
        method: string;
        id: string;
        path?: string;
        query?: string;
        fragment?: string;
        params?: Record<string, string>;
    });
    /**
     * Parses a DID URI string into its individual components.
     *
     * @example
     * ```ts
     * const did = Did.parse('did:example:123?service=agent&relativeRef=/credentials#degree');
     *
     * console.log(did.uri)      // Output: 'did:example:123'
     * console.log(did.method)   // Output: 'example'
     * console.log(did.id)       // Output: '123'
     * console.log(did.query)    // Output: 'service=agent&relativeRef=/credentials'
     * console.log(did.fragment) // Output: 'degree'
     * console.log(did.params)   // Output: { service: 'agent', relativeRef: '/credentials' }
     * ```
     *
     * @params didUri - The DID URI string to be parsed.
     * @returns A `Did` object representing the parsed DID URI, or `null` if the input string is not a valid DID URI.
     */
    static parse(didUri: string): Did | null;
}
//# sourceMappingURL=did.d.ts.map