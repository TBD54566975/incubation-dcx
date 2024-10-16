export declare class Poller {
    /**
     * The interval in milliseconds to wait before retrying the delegate function.
     */
    static pollRetrySleep: number;
    /**
     * The maximum time in milliseconds to wait before timing out the delegate function.
     */
    static pollTimeout: number;
    /**
     *  Polls the delegate function until it succeeds or the timeout is exceeded.
     *
     * @param delegate a function that returns a promise and may throw.
     * @param retrySleep the interval in milliseconds to wait before retrying the delegate function.
     * @param timeout the maximum time in milliseconds to wait before timing out the delegate function.
     *
     * @throws {Error} `Operation timed out` if the timeout is exceeded.
     */
    static pollUntilSuccessOrTimeout<T>(delegate: () => Promise<T>, retrySleep?: number, timeout?: number): Promise<T>;
}
//# sourceMappingURL=poller.d.ts.map