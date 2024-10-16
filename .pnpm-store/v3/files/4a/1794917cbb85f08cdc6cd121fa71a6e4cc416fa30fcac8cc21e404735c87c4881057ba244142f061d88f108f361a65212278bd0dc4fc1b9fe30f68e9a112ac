/**
 * A custom error class for Crypto-related errors.
 */
export declare class CryptoError extends Error {
    code: CryptoErrorCode;
    /**
     * Constructs an instance of CryptoError, a custom error class for handling Crypto-related errors.
     *
     * @param code - A {@link CryptoErrorCode} representing the specific type of error encountered.
     * @param message - A human-readable description of the error.
     */
    constructor(code: CryptoErrorCode, message: string);
}
/**
 * An enumeration of possible Crypto error codes.
 */
export declare enum CryptoErrorCode {
    /** The supplied algorithm identifier is not supported by the implementation. */
    AlgorithmNotSupported = "algorithmNotSupported",
    /** The encoding operation (either encoding or decoding) failed. */
    EncodingError = "encodingError",
    /** The JWE supplied does not conform to valid syntax. */
    InvalidJwe = "invalidJwe",
    /** The JWK supplied does not conform to valid syntax. */
    InvalidJwk = "invalidJwk",
    /** The requested operation is not supported by the implementation. */
    OperationNotSupported = "operationNotSupported"
}
//# sourceMappingURL=crypto-error.d.ts.map