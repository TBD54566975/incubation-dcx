/**
 * Time related utilities.
 */
export declare class Time {
    /**
     * sleeps for the desired duration
     * @param durationInMillisecond the desired amount of sleep time
     * @returns when the provided duration has passed
     */
    static sleep(durationInMillisecond: number): Promise<void>;
    /**
     * We must sleep for at least 2ms to avoid timestamp collisions during testing.
     * https://github.com/TBD54566975/dwn-sdk-js/issues/481
     */
    static minimalSleep(): Promise<void>;
    /**
     * Returns an UTC ISO-8601 timestamp with microsecond precision accepted by DWN.
     * using @js-temporal/polyfill
     */
    static getCurrentTimestamp(): string;
    /**
     * Creates a UTC ISO-8601 timestamp in microsecond precision accepted by DWN.
     * @param options - Options for creating the timestamp.
     * @returns string
     */
    static createTimestamp(options: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
        second?: number;
        millisecond?: number;
        microsecond?: number;
    }): string;
    /**
     * Creates a UTC ISO-8601 timestamp offset from now or given timestamp accepted by DWN.
     * @param offset Negative number means offset into the past.
     */
    static createOffsetTimestamp(offset: {
        seconds: number;
    }, timestamp?: string): string;
    /**
     * Validates that the provided timestamp is a valid number
     * @param timestamp the timestamp to validate
     * @throws DwnError if timestamp is not a valid number
     */
    static validateTimestamp(timestamp: string): void;
}
//# sourceMappingURL=time.d.ts.map