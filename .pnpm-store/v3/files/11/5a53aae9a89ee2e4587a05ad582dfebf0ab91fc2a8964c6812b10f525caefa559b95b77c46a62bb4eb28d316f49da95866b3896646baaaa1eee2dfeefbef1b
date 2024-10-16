var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';
import { MemoryCache } from '../../src/utils/memory-cache.js';
import sinon from 'sinon';
// extends chai to test promises
chai.use(chaiAsPromised);
describe('MemoryCache', () => {
    it('should return `undefined` when value expires', () => __awaiter(void 0, void 0, void 0, function* () {
        const memoryCache = new MemoryCache(0.01); // 0.01 second = 10 millisecond time-to-live
        yield memoryCache.set('key', 'aValue');
        let valueInCache = yield memoryCache.get('key');
        expect(valueInCache).to.equal('aValue');
        yield new Promise(resolve => setTimeout(resolve, 11)); // wait for 11 millisecond for value to expire
        valueInCache = yield memoryCache.get('key');
        expect(valueInCache).to.be.undefined;
    }));
    it('should continue if set() fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const timeToLiveInSeconds = 1;
        const memoryCache = new MemoryCache(timeToLiveInSeconds);
        const setStub = sinon.stub(memoryCache['cache'], 'set');
        setStub.throws('a simulated error');
        yield memoryCache.set('key', 'aValue');
        expect(setStub.called).to.be.true;
    }));
});
//# sourceMappingURL=memory-cache.spec.js.map