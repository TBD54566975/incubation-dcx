var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Time } from '../../src/utils/time.js';
export class Poller {
    /**
     *  Polls the delegate function until it succeeds or the timeout is exceeded.
     *
     * @param delegate a function that returns a promise and may throw.
     * @param retrySleep the interval in milliseconds to wait before retrying the delegate function.
     * @param timeout the maximum time in milliseconds to wait before timing out the delegate function.
     *
     * @throws {Error} `Operation timed out` if the timeout is exceeded.
     */
    static pollUntilSuccessOrTimeout(delegate, retrySleep = Poller.pollRetrySleep, timeout = Poller.pollTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            while (true) {
                try {
                    // Attempt to execute the delegate function
                    return yield delegate();
                }
                catch (error) {
                    // Check if the timeout has been exceeded
                    if (Date.now() - startTime >= timeout) {
                        throw new Error('Operation timed out');
                    }
                    // Sleep for the retry interval before attempting again
                    yield Time.sleep(retrySleep);
                }
            }
        });
    }
}
/**
 * The interval in milliseconds to wait before retrying the delegate function.
 */
Poller.pollRetrySleep = 20;
/**
 * The maximum time in milliseconds to wait before timing out the delegate function.
 */
Poller.pollTimeout = 2000;
//# sourceMappingURL=poller.js.map