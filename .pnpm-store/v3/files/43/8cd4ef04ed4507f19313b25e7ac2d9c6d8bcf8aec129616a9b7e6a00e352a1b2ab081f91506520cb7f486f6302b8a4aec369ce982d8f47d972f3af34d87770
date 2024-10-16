var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Wraps the given `AbortSignal` in a `Promise` that rejects if it is programmatically triggered,
 * otherwise the promise will remain in await state (will never resolve).
 */
function promisifySignal(signal) {
    return new Promise((resolve, reject) => {
        // immediately reject if the given is signal is already aborted
        if (signal.aborted) {
            reject(signal.reason);
            return;
        }
        signal.addEventListener('abort', () => {
            reject(signal.reason);
        });
    });
}
/**
 * Wraps the given `Promise` such that it will reject if the `AbortSignal` is triggered.
 */
export function executeUnlessAborted(promise, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!signal) {
            return promise;
        }
        return Promise.race([
            promise,
            promisifySignal(signal),
        ]);
    });
}
//# sourceMappingURL=abort.js.map