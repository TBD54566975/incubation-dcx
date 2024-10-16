var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ArrayUtility } from '../../src/utils/array.js';
import { EventLogLevel } from '../../src/event-log/event-log-level.js';
import { Message } from '../../src/core/message.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import chai, { expect } from 'chai';
chai.use(chaiAsPromised);
let eventLog;
describe('EventLogLevel Tests', () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        eventLog = new EventLogLevel({ location: 'TEST-EVENTLOG' });
        yield eventLog.open();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield eventLog.clear();
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield eventLog.close();
    }));
    describe('deleteEventsByCid', () => {
        it('deletes all index related data', () => __awaiter(void 0, void 0, void 0, function* () {
            const { author, message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite();
            const messageCid = yield Message.getCid(message);
            const index = yield recordsWrite.constructIndexes(true);
            yield eventLog.append(author.did, messageCid, index);
            const indexLevelDeleteSpy = sinon.spy(eventLog.index, 'delete');
            yield eventLog.deleteEventsByCid(author.did, [messageCid]);
            expect(indexLevelDeleteSpy.callCount).to.equal(1);
            const keysAfterDelete = yield ArrayUtility.fromAsyncGenerator(eventLog.index.db.keys());
            expect(keysAfterDelete.length).to.equal(0);
        }));
    });
});
//# sourceMappingURL=event-log-level.spec.js.map