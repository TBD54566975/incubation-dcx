import type { DataStore, EventLog, MessageStore, ResumableTaskStore } from '../src/index.js';
/**
 * Class that manages store implementations for testing.
 * This is intended to be extended as the single point of configuration
 * that allows different store implementations to be swapped in
 * to test compatibility with default/built-in store implementations.
 */
export declare class TestStores {
    private static messageStore?;
    private static dataStore?;
    private static eventLog?;
    private static resumableTaskStore?;
    /**
     * Overrides test stores with given implementation.
     * If not given, default implementation will be used.
     */
    static override(overrides?: {
        messageStore?: MessageStore;
        dataStore?: DataStore;
        eventLog?: EventLog;
        resumableTaskStore?: ResumableTaskStore;
    }): void;
    /**
     * Initializes and return the stores used for running the test suite.
     */
    static get(): {
        messageStore: MessageStore;
        dataStore: DataStore;
        eventLog: EventLog;
        resumableTaskStore: ResumableTaskStore;
    };
}
//# sourceMappingURL=test-stores.d.ts.map