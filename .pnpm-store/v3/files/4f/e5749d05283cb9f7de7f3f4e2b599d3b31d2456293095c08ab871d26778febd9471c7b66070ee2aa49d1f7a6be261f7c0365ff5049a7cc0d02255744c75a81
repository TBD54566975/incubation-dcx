var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from 'events';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
const EVENTS_LISTENER_CHANNEL = 'events';
;
export class EventEmitterStream {
    constructor(config = {}) {
        this.isOpen = false;
        /**
         * we subscribe to the `EventEmitter` error handler with a provided handler or set one which logs the errors.
         */
        this.errorHandler = (error) => { console.error('event emitter error', error); };
        // we capture the rejections and currently just log the errors that are produced
        this.eventEmitter = new EventEmitter({ captureRejections: true });
        // number of listeners per particular eventName before a warning is emitted
        // we set to 0 which represents infinity.
        // https://nodejs.org/api/events.html#emittersetmaxlistenersn
        this.eventEmitter.setMaxListeners(0);
        if (config.errorHandler) {
            this.errorHandler = config.errorHandler;
        }
        this.eventEmitter.on('error', this.errorHandler);
    }
    subscribe(tenant, id, listener) {
        return __awaiter(this, void 0, void 0, function* () {
            this.eventEmitter.on(`${tenant}_${EVENTS_LISTENER_CHANNEL}`, listener);
            return {
                id,
                close: () => __awaiter(this, void 0, void 0, function* () { this.eventEmitter.off(`${tenant}_${EVENTS_LISTENER_CHANNEL}`, listener); })
            };
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isOpen = true;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isOpen = false;
            this.eventEmitter.removeAllListeners();
        });
    }
    emit(tenant, event, indexes) {
        if (!this.isOpen) {
            this.errorHandler(new DwnError(DwnErrorCode.EventEmitterStreamNotOpenError, 'a message emitted when EventEmitterStream is closed'));
            return;
        }
        this.eventEmitter.emit(`${tenant}_${EVENTS_LISTENER_CHANNEL}`, tenant, event, indexes);
    }
}
//# sourceMappingURL=event-emitter-stream.js.map