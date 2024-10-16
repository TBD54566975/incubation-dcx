var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createLevelDatabase } from '../../src/store/level-wrapper.js';
import { expect } from 'chai';
import { MessageStoreLevel } from '../../src/store/message-store-level.js';
let messageStore;
describe('MessageStoreLevel Test Suite', () => {
    // important to follow the `before` and `after` pattern to initialize and clean the stores in tests
    // so that different test suites can reuse the same backend store for testing
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        messageStore = new MessageStoreLevel({
            blockstoreLocation: 'TEST-MESSAGESTORE',
            indexLocation: 'TEST-INDEX'
        });
        yield messageStore.open();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield messageStore.clear(); // clean up before each test rather than after so that a test does not depend on other tests to do the clean up
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield messageStore.close();
    }));
    describe('createLevelDatabase', function () {
        it('should be called if provided', () => __awaiter(this, void 0, void 0, function* () {
            // need to close the message store instance first before creating a new one with the same name below
            yield messageStore.close();
            const locations = new Set;
            messageStore = new MessageStoreLevel({
                blockstoreLocation: 'TEST-MESSAGESTORE',
                indexLocation: 'TEST-INDEX',
                createLevelDatabase(location, options) {
                    locations.add(location);
                    return createLevelDatabase(location, options);
                }
            });
            yield messageStore.open();
            expect(locations).to.eql(new Set(['TEST-MESSAGESTORE', 'TEST-INDEX']));
        }));
    });
});
//# sourceMappingURL=message-store-level.spec.js.map