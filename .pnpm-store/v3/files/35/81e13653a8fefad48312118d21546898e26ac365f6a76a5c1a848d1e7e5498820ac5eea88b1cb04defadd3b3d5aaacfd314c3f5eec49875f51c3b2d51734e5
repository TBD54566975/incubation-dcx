var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
/**
 * Array utility methods.
 */
export class ArrayUtility {
    /**
     * Returns `true` if content of the two given byte arrays are equal; `false` otherwise.
     */
    static byteArraysEqual(array1, array2) {
        const equal = array1.length === array2.length && array1.every((value, index) => value === array2[index]);
        return equal;
    }
    /**
     * Asynchronously iterates an {AsyncGenerator} to return all the values in an array.
     */
    static fromAsyncGenerator(iterator) {
        var _a, iterator_1, iterator_1_1;
        var _b, e_1, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const array = [];
            try {
                for (_a = true, iterator_1 = __asyncValues(iterator); iterator_1_1 = yield iterator_1.next(), _b = iterator_1_1.done, !_b; _a = true) {
                    _d = iterator_1_1.value;
                    _a = false;
                    const value = _d;
                    array.push(value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = iterator_1.return)) yield _c.call(iterator_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return array;
        });
    }
    /**
     * Generic asynchronous sort method.
     */
    static asyncSort(array, asyncComparer) {
        return __awaiter(this, void 0, void 0, function* () {
            // this is a bubble sort implementation
            for (let i = 0; i < array.length; i++) {
                for (let j = i + 1; j < array.length; j++) {
                    const comparison = yield asyncComparer(array[i], array[j]);
                    if (comparison > 0) {
                        [array[i], array[j]] = [array[j], array[i]]; // Swap
                    }
                }
            }
            return array;
        });
    }
}
//# sourceMappingURL=array.js.map