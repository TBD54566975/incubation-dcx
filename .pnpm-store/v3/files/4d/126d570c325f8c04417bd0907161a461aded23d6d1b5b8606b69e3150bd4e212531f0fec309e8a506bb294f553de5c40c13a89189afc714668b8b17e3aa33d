import ErrorCode from './ErrorCode.js';
import IonError from './IonError.js';
import { base64url } from 'multiformats/bases/base64';
/**
 * Class that encodes binary blobs into strings.
 * Note that the encode/decode methods may change underlying encoding scheme.
 */
export default class Encoder {
    /**
     * Encodes given bytes into a Base64URL string.
     */
    static encode(content) {
        const encodedContent = base64url.baseEncode(content);
        return encodedContent;
    }
    /**
     * Decodes the given Base64URL string into bytes.
     */
    static decodeAsBytes(encodedContent, inputContextForErrorLogging) {
        if (!Encoder.isBase64UrlString(encodedContent)) {
            throw new IonError(ErrorCode.EncodedStringIncorrectEncoding, `Given ${inputContextForErrorLogging} must be base64url string.`);
        }
        return base64url.baseDecode(encodedContent);
    }
    /**
     * Decodes the given Base64URL string into the original string.
     */
    static decodeAsString(encodedContent, inputContextForErrorLogging) {
        const rawBytes = Encoder.decodeAsBytes(encodedContent, inputContextForErrorLogging);
        return Encoder.bytesToString(rawBytes);
    }
    /**
     * Tests if the given string is a Base64URL string.
     */
    static isBase64UrlString(input) {
        // NOTE:
        // /<expression>/ denotes regex.
        // ^ denotes beginning of string.
        // $ denotes end of string.
        // + denotes one or more characters.
        const isBase64UrlString = /^[A-Za-z0-9_-]+$/.test(input);
        return isBase64UrlString;
    }
    /**
     * Converts input string to bytes.
     */
    static stringToBytes(input) {
        const bytes = new TextEncoder().encode(input);
        return bytes;
    }
    /**
     * Converts bytes to string.
     */
    static bytesToString(input) {
        const output = new TextDecoder().decode(input);
        return output;
    }
}
//# sourceMappingURL=Encoder.js.map