var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Temporal } from '@js-temporal/polyfill';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
/**
 * Time related utilities.
 */
export class Time {
    /**
     * sleeps for the desired duration
     * @param durationInMillisecond the desired amount of sleep time
     * @returns when the provided duration has passed
     */
    static sleep(durationInMillisecond) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, durationInMillisecond));
        });
    }
    /**
     * We must sleep for at least 2ms to avoid timestamp collisions during testing.
     * https://github.com/TBD54566975/dwn-sdk-js/issues/481
     */
    static minimalSleep() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Time.sleep(2);
        });
    }
    /**
     * Returns an UTC ISO-8601 timestamp with microsecond precision accepted by DWN.
     * using @js-temporal/polyfill
     */
    static getCurrentTimestamp() {
        return Temporal.Now.instant().toString({ smallestUnit: 'microseconds' });
    }
    /**
     * Creates a UTC ISO-8601 timestamp in microsecond precision accepted by DWN.
     * @param options - Options for creating the timestamp.
     * @returns string
     */
    static createTimestamp(options) {
        const { year, month, day, hour, minute, second, millisecond, microsecond } = options;
        return Temporal.ZonedDateTime.from({
            timeZone: 'UTC',
            year,
            month,
            day,
            hour,
            minute,
            second,
            millisecond,
            microsecond
        }).toInstant().toString({ smallestUnit: 'microseconds' });
    }
    /**
     * Creates a UTC ISO-8601 timestamp offset from now or given timestamp accepted by DWN.
     * @param offset Negative number means offset into the past.
     */
    static createOffsetTimestamp(offset, timestamp) {
        const timestampInstant = timestamp ? Temporal.Instant.from(timestamp) : Temporal.Now.instant();
        const offsetDuration = Temporal.Duration.from(offset);
        const offsetInstant = timestampInstant.add(offsetDuration);
        return offsetInstant.toString({ smallestUnit: 'microseconds' });
    }
    /**
     * Validates that the provided timestamp is a valid number
     * @param timestamp the timestamp to validate
     * @throws DwnError if timestamp is not a valid number
     */
    static validateTimestamp(timestamp) {
        try {
            Temporal.Instant.from(timestamp);
        }
        catch (_a) {
            throw new DwnError(DwnErrorCode.TimestampInvalid, `Invalid timestamp: ${timestamp}`);
        }
    }
}
//# sourceMappingURL=time.js.map