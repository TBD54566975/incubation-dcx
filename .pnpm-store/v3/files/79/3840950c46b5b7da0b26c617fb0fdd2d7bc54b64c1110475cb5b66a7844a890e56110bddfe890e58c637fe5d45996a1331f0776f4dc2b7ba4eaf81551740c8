import type { EventStream } from '../src/index.js';
/**
 * Class that manages the EventStream implementation for testing.
 * This is intended to be extended as the single point of configuration
 * that allows different EventStream implementations to be swapped in
 * to test compatibility with default/built-in implementation.
 */
export declare class TestEventStream {
    private static eventStream?;
    /**
     * Overrides the event stream with a given implementation.
     * If not given, default implementation will be used.
     */
    static override(overrides?: {
        eventStream?: EventStream;
    }): void;
    /**
     * Initializes and returns the event stream used for running the test suite.
     */
    static get(): EventStream;
}
//# sourceMappingURL=test-event-stream.d.ts.map