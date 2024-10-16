var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitterStream } from '../../src/event-log/event-emitter-stream.js';
import { TestDataGenerator } from '../../src/index.js';
import { TestStores } from '../test-stores.js';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';
chai.use(chaiAsPromised);
describe('EventEmitterStream', () => {
    let messageStore;
    before(() => {
        ({ messageStore } = TestStores.get());
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        messageStore.clear();
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up after each test by closing and clearing the event stream
        yield messageStore.close();
        sinon.restore();
    }));
    it('should remove listeners when `close` method is used', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventStream = new EventEmitterStream();
        const emitter = eventStream['eventEmitter'];
        // count the `events` listeners, which represents all listeners
        expect(emitter.listenerCount('did:alice_events')).to.equal(0);
        const sub = yield eventStream.subscribe('did:alice', 'id', () => { });
        expect(emitter.listenerCount('did:alice_events')).to.equal(1);
        // close the subscription, which should remove the listener
        yield sub.close();
        expect(emitter.listenerCount('did:alice_events')).to.equal(0);
    }));
    it('logs message when the emitter experiences an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const testHandler = {
            errorHandler: (_) => { },
        };
        const eventErrorSpy = sinon.spy(testHandler, 'errorHandler');
        const eventStream = new EventEmitterStream({ errorHandler: testHandler.errorHandler });
        const emitter = eventStream['eventEmitter'];
        emitter.emit('error', new Error('random error'));
        expect(eventErrorSpy.callCount).to.equal(1);
    }));
    it('does not emit messages if event stream is closed', () => __awaiter(void 0, void 0, void 0, function* () {
        const testHandler = {
            errorHandler: (_) => { },
        };
        const eventErrorSpy = sinon.spy(testHandler, 'errorHandler');
        const eventStream = new EventEmitterStream({ errorHandler: testHandler.errorHandler });
        const handler = (_tenant, _event, _indexes) => __awaiter(void 0, void 0, void 0, function* () { });
        yield eventStream.subscribe('did:alice', 'sub-1', handler);
        // close eventStream
        yield eventStream.close();
        const message1 = yield TestDataGenerator.generateRecordsWrite({});
        eventStream.emit('did:alice', { message: message1.message }, {});
        const message2 = yield TestDataGenerator.generateRecordsWrite({});
        eventStream.emit('did:alice', { message: message2.message }, {});
        expect(eventErrorSpy.callCount).to.equal(2);
        // check that all listeners have been removed
        const eventEmitter = eventStream['eventEmitter'];
        for (const event of eventEmitter.eventNames()) {
            expect(eventEmitter.listenerCount(event)).to.equal(0);
        }
    }));
    it('sets max listeners to 0 which represents infinity', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventStreamOne = new EventEmitterStream();
        const emitterOne = eventStreamOne['eventEmitter'];
        expect(emitterOne.getMaxListeners()).to.equal(0);
    }));
});
//# sourceMappingURL=event-emitter-stream.spec.js.map