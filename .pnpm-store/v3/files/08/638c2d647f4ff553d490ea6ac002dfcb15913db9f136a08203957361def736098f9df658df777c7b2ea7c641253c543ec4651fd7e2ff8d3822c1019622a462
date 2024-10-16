import { EventEmitterStream } from '../src/index.js';
/**
 * Class that manages the EventStream implementation for testing.
 * This is intended to be extended as the single point of configuration
 * that allows different EventStream implementations to be swapped in
 * to test compatibility with default/built-in implementation.
 */
export class TestEventStream {
    /**
     * Overrides the event stream with a given implementation.
     * If not given, default implementation will be used.
     */
    static override(overrides) {
        TestEventStream.eventStream = overrides === null || overrides === void 0 ? void 0 : overrides.eventStream;
    }
    /**
     * Initializes and returns the event stream used for running the test suite.
     */
    static get() {
        var _a;
        (_a = TestEventStream.eventStream) !== null && _a !== void 0 ? _a : (TestEventStream.eventStream = new EventEmitterStream());
        return TestEventStream.eventStream;
    }
}
//# sourceMappingURL=test-event-stream.js.map