"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalize = void 0;
/**
 * Canonicalizes a given object according to RFC 8785 (https://tools.ietf.org/html/rfc8785),
 * which describes JSON Canonicalization Scheme (JCS). This function sorts the keys of the
 * object and its nested objects alphabetically and then returns a stringified version of it.
 * This method handles nested objects, array values, and null values appropriately.
 *
 * @param obj - The object to canonicalize.
 * @returns The stringified version of the input object with its keys sorted alphabetically
 * per RFC 8785.
 */
function canonicalize(obj) {
    /**
     * Recursively sorts the keys of an object.
     *
     * @param obj - The object whose keys are to be sorted.
     * @returns A new object with sorted keys.
     */
    var sortObjKeys = function (obj) {
        var e_1, _a;
        if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
            var sortedKeys = Object.keys(obj).sort();
            var sortedObj_1 = {};
            try {
                for (var sortedKeys_1 = __values(sortedKeys), sortedKeys_1_1 = sortedKeys_1.next(); !sortedKeys_1_1.done; sortedKeys_1_1 = sortedKeys_1.next()) {
                    var key = sortedKeys_1_1.value;
                    // Recursively sort keys of nested objects.
                    sortedObj_1[key] = sortObjKeys(obj[key]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (sortedKeys_1_1 && !sortedKeys_1_1.done && (_a = sortedKeys_1.return)) _a.call(sortedKeys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return sortedObj_1;
        }
        return obj;
    };
    // Stringify and return the final sorted object.
    var sortedObj = sortObjKeys(obj);
    return JSON.stringify(sortedObj);
}
exports.canonicalize = canonicalize;
//# sourceMappingURL=utils.js.map