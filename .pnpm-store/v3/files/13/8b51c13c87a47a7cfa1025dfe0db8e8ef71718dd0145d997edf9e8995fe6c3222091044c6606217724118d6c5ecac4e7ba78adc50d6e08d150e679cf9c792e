import * as canonicalize from 'canonicalize';
import Encoder from './Encoder.js';
/**
 * Class containing reusable JSON canonicalization operations using JSON Canonicalization Scheme (JCS).
 */
export default class JsonCanonicalizer {
    /**
     * Canonicalizes the given content as bytes.
     */
    static canonicalizeAsBytes(content) {
        // We need to remove all properties with `undefined` as value so that JCS canonicalization will not produce invalid JSON.
        const contentWithoutUndefinedProperties = JsonCanonicalizer.removeAllUndefinedProperties(content);
        // @ts-expect-error because its a cjs package
        const canonicalizedString = canonicalize.default(contentWithoutUndefinedProperties);
        const contentBytes = Encoder.stringToBytes(canonicalizedString);
        return contentBytes;
    }
    /**
     * Removes all properties within the given object with `undefined` as value.
     */
    static removeAllUndefinedProperties(content) {
        for (const key in content) {
            if (typeof content[key] === 'object') {
                JsonCanonicalizer.removeAllUndefinedProperties(content[key]);
            }
            else if (content[key] === undefined) {
                delete content[key];
            }
        }
        return content;
    }
}
//# sourceMappingURL=JsonCanonicalizer.js.map