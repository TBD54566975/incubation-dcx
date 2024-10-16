/**
 * Class that performs hashing operations using the multihash format.
 */
export default class Multihash {
    /**
     * Multihashes the content using the hashing algorithm specified.
     * @param hashAlgorithmInMultihashCode The hashing algorithm to use.
     * @returns A multihash of the content.
     */
    static hash(content: Uint8Array, hashAlgorithmInMultihashCode: number): Promise<Uint8Array>;
    /**
     * Hashes the content using the hashing algorithm specified as a generic (non-multihash) hash.
     * @param hashAlgorithmInMultihashCode The hashing algorithm to use.
     * @returns A multihash bytes.
     */
    static hashAsNonMultihashBytes(content: Uint8Array, hashAlgorithmInMultihashCode: number): Promise<Uint8Array>;
    /**
     * Canonicalize the given content, then double hashes the result using the latest supported hash algorithm, then encodes the multihash.
     * Mainly used for testing purposes.
     */
    static canonicalizeThenHashThenEncode(content: object, hashAlgorithmInMultihashCode: number): Promise<string>;
    /**
     * Canonicalize the given content, then double hashes the result using the latest supported hash algorithm, then encodes the multihash.
     * Mainly used for testing purposes.
     */
    static canonicalizeThenDoubleHashThenEncode(content: object, hashAlgorithmInMultihashCode: number): Promise<string>;
    /**
     * Hashes the content using the hashing algorithm specified then encodes the multihash bytes as string.
     * @param hashAlgorithmInMultihashCode The hashing algorithm to use.
     */
    static hashThenEncode(content: Uint8Array, hashAlgorithmInMultihashCode: number): Promise<string>;
    /**
     * Checks if the given encoded hash is a multihash computed using the configured hashing algorithm.
     */
    static validateEncodedHashComputedUsingSupportedHashAlgorithm(encodedMultihash: string, // didSuffix
    inputContextForErrorLogging: string): void;
}
//# sourceMappingURL=Multihash.d.ts.map