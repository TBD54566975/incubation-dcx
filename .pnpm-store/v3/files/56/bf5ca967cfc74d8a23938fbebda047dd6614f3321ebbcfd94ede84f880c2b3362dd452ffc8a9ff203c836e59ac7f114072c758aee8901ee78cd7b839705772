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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import { CID } from 'multiformats';
import { createLevelDatabase, LevelWrapper } from './level-wrapper.js';
// `level` works in Node.js 12+ and Electron 5+ on Linux, Mac OS, Windows and
// FreeBSD, including any future Node.js and Electron release thanks to Node-API, including ARM
// platforms like Raspberry Pi and Android, as well as in Chrome, Firefox, Edge, Safari, iOS Safari
//  and Chrome for Android.
/**
 * Blockstore implementation using LevelDB for storing the actual messages (in the case of MessageStore)
 * or the data associated with messages (in the case of a DataStore).
 */
export class BlockstoreLevel {
    constructor(config, db) {
        this.config = Object.assign({ createLevelDatabase }, config);
        this.db = db !== null && db !== void 0 ? db : new LevelWrapper(Object.assign(Object.assign({}, this.config), { valueEncoding: 'binary' }));
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.open();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.close();
        });
    }
    partition(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.db.partition(name);
            return new BlockstoreLevel(Object.assign(Object.assign({}, this.config), { location: '' }), db);
        });
    }
    put(key, val, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.put(String(key), val, options);
            return CID.parse(key.toString());
        });
    }
    get(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.get(String(key), options);
            return result;
        });
    }
    has(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.has(String(key), options);
        });
    }
    delete(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.delete(String(key), options);
        });
    }
    isEmpty(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.isEmpty(options);
        });
    }
    putMany(source, options) {
        return __asyncGenerator(this, arguments, function* putMany_1() {
            var _a, e_1, _b, _c;
            try {
                for (var _d = true, source_1 = __asyncValues(source), source_1_1; source_1_1 = yield __await(source_1.next()), _a = source_1_1.done, !_a; _d = true) {
                    _c = source_1_1.value;
                    _d = false;
                    const entry = _c;
                    yield __await(this.put(entry.cid, entry.block, options));
                    yield yield __await(entry.cid);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = source_1.return)) yield __await(_b.call(source_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    getMany(source, options) {
        return __asyncGenerator(this, arguments, function* getMany_1() {
            var _a, e_2, _b, _c;
            try {
                for (var _d = true, source_2 = __asyncValues(source), source_2_1; source_2_1 = yield __await(source_2.next()), _a = source_2_1.done, !_a; _d = true) {
                    _c = source_2_1.value;
                    _d = false;
                    const key = _c;
                    yield yield __await({
                        cid: key,
                        block: yield __await(this.get(key, options))
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = source_2.return)) yield __await(_b.call(source_2));
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    }
    getAll(options) {
        return __asyncGenerator(this, arguments, function* getAll_1() {
            var _a, e_3, _b, _c;
            // @ts-expect-error keyEncoding is 'buffer' but types for db.iterator always return the key type as 'string'
            const li = this.db.iterator({
                keys: true,
                keyEncoding: 'buffer'
            }, options);
            try {
                for (var _d = true, li_1 = __asyncValues(li), li_1_1; li_1_1 = yield __await(li_1.next()), _a = li_1_1.done, !_a; _d = true) {
                    _c = li_1_1.value;
                    _d = false;
                    const [key, value] = _c;
                    yield yield __await({ cid: CID.decode(key), block: value });
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = li_1.return)) yield __await(_b.call(li_1));
                }
                finally { if (e_3) throw e_3.error; }
            }
        });
    }
    deleteMany(source, options) {
        return __asyncGenerator(this, arguments, function* deleteMany_1() {
            var _a, e_4, _b, _c;
            try {
                for (var _d = true, source_3 = __asyncValues(source), source_3_1; source_3_1 = yield __await(source_3.next()), _a = source_3_1.done, !_a; _d = true) {
                    _c = source_3_1.value;
                    _d = false;
                    const key = _c;
                    yield __await(this.delete(key, options));
                    yield yield __await(key);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = source_3.return)) yield __await(_b.call(source_3));
                }
                finally { if (e_4) throw e_4.error; }
            }
        });
    }
    /**
     * deletes all entries
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.clear();
        });
    }
}
//# sourceMappingURL=blockstore-level.js.map