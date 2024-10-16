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
import { Cid } from '../utils/cid.js';
import { createLevelDatabase, LevelWrapper } from './level-wrapper.js';
/**
 * A simple single-instance implementation of {@link ResumableTaskStore} that works in both browsers and node.js.
 * Leverages LevelDB under the hood.
 */
export class ResumableTaskStoreLevel {
    constructor(config) {
        this.config = Object.assign({ 
            // defaults:
            location: 'RESUMABLE-TASK-STORE', createLevelDatabase }, config);
        this.db = new LevelWrapper({
            location: this.config.location,
            createLevelDatabase: this.config.createLevelDatabase,
            keyEncoding: 'utf8'
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.open();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.close();
        });
    }
    register(task, timeoutInSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskId = yield Cid.computeCid(task);
            const managedResumableTask = {
                id: taskId,
                timeout: Date.now() + (timeoutInSeconds * 1000),
                retryCount: 0,
                task,
            };
            yield this.db.put(taskId, JSON.stringify(managedResumableTask));
            return managedResumableTask;
        });
    }
    grab(count) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = [];
            try {
                // iterate over the tasks to find unhandled (timed-out) tasks to return to the caller,
                // tasks that are not timed-out are considered in-flight/under processing
                // NOTE: there is an opportunity here to introduce an additional index where we can query by timed-out tasks,
                // but it requires an additional index thus more complexity
                for (var _d = true, _e = __asyncValues(this.db.iterator()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const [_, value] = _c;
                    const task = JSON.parse(value);
                    // if the task is timed-out, we can give it to the caller to handle
                    if (Date.now() >= task.timeout) {
                        // update the task metadata first before adding to list of tasks to return
                        task.timeout = Date.now() + (ResumableTaskStoreLevel.taskTimeoutInSeconds * 1000);
                        task.retryCount++;
                        yield this.db.put(task.id, JSON.stringify(task));
                        tasks.push(task);
                    }
                    if (tasks.length >= count) {
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return tasks;
        });
    }
    read(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.db.get(taskId);
            if (value) {
                const task = JSON.parse(value);
                return task;
            }
            else {
                return undefined;
            }
        });
    }
    extend(taskId, timeoutInSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.db.get(taskId);
            if (value) {
                const task = JSON.parse(value);
                task.timeout = Date.now() + (timeoutInSeconds * 1000);
                yield this.db.put(task.id, JSON.stringify(task));
            }
        });
    }
    delete(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.delete(taskId);
        });
    }
    /**
     * Deletes everything in the store. Mainly used in tests.
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.clear();
        });
    }
}
ResumableTaskStoreLevel.taskTimeoutInSeconds = 60;
//# sourceMappingURL=resumable-task-store-level.js.map