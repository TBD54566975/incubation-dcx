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
export class Did {
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
    constructor({ method, id, path, query, fragment, params }) {
        this.uri = `did:${method}:${id}`;
        this.method = method;
        this.id = id;
        this.path = path;
        this.query = query;
        this.fragment = fragment;
        this.params = params;
    }
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
    static parse(didUri) {
        // Return null if the input string is empty or not provided.
        if (!didUri)
            return null;
        // Execute the regex pattern on the input string to extract URI components.
        const match = Did.DID_URI_PATTERN.exec(didUri);
        // If the pattern does not match, or if the required groups are not found, return null.
        if (!match || !match.groups)
            return null;
        // Extract the method, id, params, path, query, and fragment from the regex match groups.
        const { method, id, path, query, fragment } = match.groups;
        // Initialize a new Did object with the uri, method and id.
        const did = {
            uri: `did:${method}:${id}`,
            method,
            id,
        };
        // If path is present, add it to the Did object.
        if (path)
            did.path = path;
        // If query is present, add it to the Did object, removing the leading '?'.
        if (query)
            did.query = query.slice(1);
        // If fragment is present, add it to the Did object, removing the leading '#'.
        if (fragment)
            did.fragment = fragment.slice(1);
        // If query params are present, parse them into a key-value object and add to the Did object.
        if (query) {
            const parsedParams = {};
            // Split the query string by '&' to get individual parameter strings.
            const paramPairs = query.slice(1).split('&');
            for (const pair of paramPairs) {
                // Split each parameter string by '=' to separate keys and values.
                const [key, value] = pair.split('=');
                parsedParams[key] = value;
            }
            did.params = parsedParams;
        }
        return did;
    }
}
/** Regular expression pattern for matching the method component of a DID URI. */
Did.METHOD_PATTERN = '([a-z0-9]+)';
/** Regular expression pattern for matching percent-encoded characters in a method identifier. */
Did.PCT_ENCODED_PATTERN = '(?:%[0-9a-fA-F]{2})';
/** Regular expression pattern for matching the characters allowed in a method identifier. */
Did.ID_CHAR_PATTERN = `(?:[a-zA-Z0-9._-]|${Did.PCT_ENCODED_PATTERN})`;
/** Regular expression pattern for matching the method identifier component of a DID URI. */
Did.METHOD_ID_PATTERN = `((?:${Did.ID_CHAR_PATTERN}*:)*(${Did.ID_CHAR_PATTERN}+))`;
/** Regular expression pattern for matching the path component of a DID URI. */
Did.PATH_PATTERN = `(/[^#?]*)?`;
/** Regular expression pattern for matching the query component of a DID URI. */
Did.QUERY_PATTERN = `([?][^#]*)?`;
/** Regular expression pattern for matching the fragment component of a DID URI. */
Did.FRAGMENT_PATTERN = `(#.*)?`;
/** Regular expression pattern for matching all of the components of a DID URI. */
Did.DID_URI_PATTERN = new RegExp(`^did:(?<method>${Did.METHOD_PATTERN}):(?<id>${Did.METHOD_ID_PATTERN})(?<path>${Did.PATH_PATTERN})(?<query>${Did.QUERY_PATTERN})(?<fragment>${Did.FRAGMENT_PATTERN})$`);
//# sourceMappingURL=did.js.map