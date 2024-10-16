var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createLevelDatabase } from '../store/level-wrapper.js';
import { IndexLevel } from '../store/index-level.js';
import { monotonicFactory } from 'ulidx';
export class EventLogLevel {
    constructor(config) {
        this.index = new IndexLevel(Object.assign({ location: 'EVENTLOG', createLevelDatabase }, config));
        this.ulidFactory = monotonicFactory();
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.index.open();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.index.close();
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.index.clear();
        });
    }
    append(tenant, messageCid, indexes) {
        return __awaiter(this, void 0, void 0, function* () {
            const watermark = this.ulidFactory();
            yield this.index.put(tenant, messageCid, Object.assign(Object.assign({}, indexes), { watermark }));
        });
    }
    queryEvents(tenant, filters, cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.index.query(tenant, filters, { sortProperty: 'watermark', cursor });
            return {
                events: results.map(({ messageCid }) => messageCid),
                cursor: IndexLevel.createCursorFromLastArrayItem(results, 'watermark'),
            };
        });
    }
    getEvents(tenant, cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queryEvents(tenant, [], cursor);
        });
    }
    deleteEventsByCid(tenant, messageCids) {
        return __awaiter(this, void 0, void 0, function* () {
            const indexDeletePromises = [];
            for (const messageCid of messageCids) {
                indexDeletePromises.push(this.index.delete(tenant, messageCid));
            }
            yield Promise.all(indexDeletePromises);
        });
    }
}
//# sourceMappingURL=event-log-level.js.map