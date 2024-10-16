import { DataStoreLevel, EventLogLevel, MessageStoreLevel, ResumableTaskStoreLevel } from '../src/index.js';
/**
 * Class that manages store implementations for testing.
 * This is intended to be extended as the single point of configuration
 * that allows different store implementations to be swapped in
 * to test compatibility with default/built-in store implementations.
 */
export class TestStores {
    /**
     * Overrides test stores with given implementation.
     * If not given, default implementation will be used.
     */
    static override(overrides) {
        TestStores.messageStore = overrides === null || overrides === void 0 ? void 0 : overrides.messageStore;
        TestStores.dataStore = overrides === null || overrides === void 0 ? void 0 : overrides.dataStore;
        TestStores.eventLog = overrides === null || overrides === void 0 ? void 0 : overrides.eventLog;
        TestStores.resumableTaskStore = overrides === null || overrides === void 0 ? void 0 : overrides.resumableTaskStore;
    }
    /**
     * Initializes and return the stores used for running the test suite.
     */
    static get() {
        var _a, _b, _c, _d;
        (_a = TestStores.messageStore) !== null && _a !== void 0 ? _a : (TestStores.messageStore = new MessageStoreLevel({
            blockstoreLocation: 'TEST-MESSAGESTORE',
            indexLocation: 'TEST-INDEX'
        }));
        (_b = TestStores.dataStore) !== null && _b !== void 0 ? _b : (TestStores.dataStore = new DataStoreLevel({
            blockstoreLocation: 'TEST-DATASTORE'
        }));
        (_c = TestStores.eventLog) !== null && _c !== void 0 ? _c : (TestStores.eventLog = new EventLogLevel({
            location: 'TEST-EVENTLOG'
        }));
        (_d = TestStores.resumableTaskStore) !== null && _d !== void 0 ? _d : (TestStores.resumableTaskStore = new ResumableTaskStoreLevel({
            location: 'TEST-RESUMABLE-TASK-STORE'
        }));
        return {
            messageStore: TestStores.messageStore,
            dataStore: TestStores.dataStore,
            eventLog: TestStores.eventLog,
            resumableTaskStore: TestStores.resumableTaskStore,
        };
    }
}
//# sourceMappingURL=test-stores.js.map