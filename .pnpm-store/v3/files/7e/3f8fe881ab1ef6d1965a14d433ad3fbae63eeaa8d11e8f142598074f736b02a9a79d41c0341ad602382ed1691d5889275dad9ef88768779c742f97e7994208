var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
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
import { executeUnlessAborted } from '../utils/abort.js';
import { Level } from 'level';
export function createLevelDatabase(location, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only import `'level'` when it's actually necessary (i.e. only when the default `createLevelDatabase` is used).
        // Overriding `createLevelDatabase` will prevent this from happening.
        return new Level(location, Object.assign(Object.assign({}, options), { keyEncoding: 'utf8' }));
    });
}
// `Level` works in Node.js 12+ and Electron 5+ on Linux, Mac OS, Windows and FreeBSD, including any
// future Node.js and Electron release thanks to Node-API, including ARM platforms like Raspberry Pi
// and Android, as well as in Chrome, Firefox, Edge, Safari, iOS Safari and Chrome for Android.
export class LevelWrapper {
    /**
     * @param config.location - must be a directory path (relative or absolute) where `Level`` will
     * store its files, or in browsers, the name of the {@link https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase `IDBDatabase`}
     * to be opened.
     */
    constructor(config, db) {
        this.config = Object.assign({ createLevelDatabase }, config);
        this.db = db;
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createLevelDatabase();
            // `db.open()` is automatically called by the database constructor. We may need to call it explicitly
            // in order to explicitly catch an error that would otherwise not surface until another method
            // like `db.get()` is called.  Once `db.open()` has then been called, any read & write
            // operations will again be queued internally until opening has finished.
            switch (this.db.status) {
                // If db is open, we are done.
                case 'open':
                    return;
                // If db is still opening, wait until the 'open' event is emitted
                case 'opening':
                    return new Promise((resolve) => {
                        this.db.once('open', resolve);
                    });
                // If db is closing, wait until it is closed then await `db.open()`
                case 'closing':
                    return new Promise((resolve, reject) => {
                        const onClosed = () => {
                            // Make sure that errors from `db.open()` propogate up
                            this.db.open().then(resolve).catch(reject);
                            ;
                        };
                        this.db.once('closed', onClosed);
                    });
                // If db is closed, `db.open`
                case 'closed':
                    return this.db.open();
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db) {
                return;
            }
            switch (this.db.status) {
                // If db is open, we `db.close`.
                case 'open':
                    return this.db.close();
                // If db is still opening, wait until it is open then await `db.close()`
                case 'opening':
                    return new Promise((resolve, reject) => {
                        const onOpen = () => {
                            // Make sure that errors from `db.open()` propogate up
                            this.db.close().then(resolve).catch(reject);
                            ;
                        };
                        this.db.once('open', onOpen);
                    });
                // If db is closing, wait until the 'closed' event is emitted
                case 'closing':
                    return new Promise((resolve) => {
                        this.db.once('closed', resolve);
                    });
                // If db is closed, we are done
                case 'closed':
                    return;
            }
        });
    }
    partition(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createLevelDatabase();
            return new LevelWrapper(this.config, this.db.sublevel(name, {
                keyEncoding: 'utf8',
                valueEncoding: this.config.valueEncoding
            }));
        });
    }
    get(key, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            yield executeUnlessAborted(this.createLevelDatabase(), options === null || options === void 0 ? void 0 : options.signal);
            try {
                const value = yield executeUnlessAborted(this.db.get(String(key)), options === null || options === void 0 ? void 0 : options.signal);
                return value;
            }
            catch (error) {
                const e = error;
                // `Level`` throws an error if the key is not present.  Return `undefined` in this case.
                if (e.code === 'LEVEL_NOT_FOUND') {
                    return undefined;
                }
                else {
                    throw error;
                }
            }
        });
    }
    has(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.get(key, options));
        });
    }
    keys(options) {
        var _a, _b;
        return __asyncGenerator(this, arguments, function* keys_1() {
            var _c, e_1, _d, _e;
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            yield __await(executeUnlessAborted(this.createLevelDatabase(), options === null || options === void 0 ? void 0 : options.signal));
            try {
                for (var _f = true, _g = __asyncValues(this.db.keys()), _h; _h = yield __await(_g.next()), _c = _h.done, !_c; _f = true) {
                    _e = _h.value;
                    _f = false;
                    const key = _e;
                    (_b = options === null || options === void 0 ? void 0 : options.signal) === null || _b === void 0 ? void 0 : _b.throwIfAborted();
                    yield yield __await(key);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_c && (_d = _g.return)) yield __await(_d.call(_g));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    iterator(iteratorOptions, options) {
        var _a, _b;
        return __asyncGenerator(this, arguments, function* iterator_1() {
            var _c, e_2, _d, _e;
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            yield __await(executeUnlessAborted(this.createLevelDatabase(), options === null || options === void 0 ? void 0 : options.signal));
            try {
                for (var _f = true, _g = __asyncValues(this.db.iterator(iteratorOptions)), _h; _h = yield __await(_g.next()), _c = _h.done, !_c; _f = true) {
                    _e = _h.value;
                    _f = false;
                    const entry = _e;
                    (_b = options === null || options === void 0 ? void 0 : options.signal) === null || _b === void 0 ? void 0 : _b.throwIfAborted();
                    yield yield __await(entry);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_f && !_c && (_d = _g.return)) yield __await(_d.call(_g));
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    }
    put(key, value, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            yield executeUnlessAborted(this.createLevelDatabase(), options === null || options === void 0 ? void 0 : options.signal);
            return executeUnlessAborted(this.db.put(String(key), value), options === null || options === void 0 ? void 0 : options.signal);
        });
    }
    delete(key, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            yield executeUnlessAborted(this.createLevelDatabase(), options === null || options === void 0 ? void 0 : options.signal);
            return executeUnlessAborted(this.db.del(String(key)), options === null || options === void 0 ? void 0 : options.signal);
        });
    }
    isEmpty(options) {
        var _a, e_3, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _d = true, _e = __asyncValues(this.keys(options)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const _key = _c;
                    return false;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return true;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createLevelDatabase();
            yield this.db.clear();
            yield this.compactUnderlyingStorage();
        });
    }
    batch(operations, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            yield executeUnlessAborted(this.createLevelDatabase(), options === null || options === void 0 ? void 0 : options.signal);
            return executeUnlessAborted(this.db.batch(operations), options === null || options === void 0 ? void 0 : options.signal);
        });
    }
    /**
     * Wraps the given LevelWrapperBatchOperation as an operation for the specified partition.
     */
    createPartitionOperation(partitionName, operation) {
        return Object.assign(Object.assign({}, operation), { sublevel: this.db.sublevel(partitionName, {
                keyEncoding: 'utf8',
                valueEncoding: this.config.valueEncoding
            }) });
    }
    compactUnderlyingStorage(options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            yield executeUnlessAborted(this.createLevelDatabase(), options === null || options === void 0 ? void 0 : options.signal);
            const range = this.sublevelRange;
            if (!range) {
                return;
            }
            // additional methods are only available on the root API instance
            const root = this.root;
            if (root.db.supports.additionalMethods.compactRange) {
                return executeUnlessAborted((_c = (_b = root.db).compactRange) === null || _c === void 0 ? void 0 : _c.call(_b, ...range), options === null || options === void 0 ? void 0 : options.signal);
            }
        });
    }
    /**
     * Gets the min and max key value of this partition.
     */
    get sublevelRange() {
        const prefix = this.db.prefix;
        if (!prefix) {
            return undefined;
        }
        // derive an exclusive `maxKey` by changing the last prefix character to the immediate succeeding character in unicode
        // (which matches how `abstract-level` creates a `boundary`)
        const maxKey = prefix.slice(0, -1) + String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1);
        const minKey = prefix;
        return [minKey, maxKey];
    }
    get root() {
        let db = this.db;
        for (const parent = db.db; parent && parent !== db;) {
            db = parent;
        }
        return new LevelWrapper(this.config, db);
    }
    createLevelDatabase() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.db) !== null && _a !== void 0 ? _a : (this.db = yield this.config.createLevelDatabase(this.config.location, {
                keyEncoding: 'utf8',
                valueEncoding: this.config.valueEncoding
            }));
        });
    }
}
//# sourceMappingURL=level-wrapper.js.map