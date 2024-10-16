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
import { TestDataGenerator } from './test-data-generator.js';
import { DataStream, Encoder } from '../../src/index.js';
// extends chai to test promises
chai.use(chaiAsPromised);
describe('DataStream', () => {
    it('should be able to convert an object to a readable stream using `fromObject() and read back the bytes using `toBytes`', () => __awaiter(void 0, void 0, void 0, function* () {
        const originalObject = {
            a: TestDataGenerator.randomString(32)
        };
        const stream = DataStream.fromObject(originalObject);
        const readBytes = yield DataStream.toBytes(stream);
        const readObject = JSON.parse(Encoder.bytesToString(readBytes));
        expect(readObject.a).to.equal(originalObject.a);
    }));
});
//# sourceMappingURL=data-stream.spec.js.map