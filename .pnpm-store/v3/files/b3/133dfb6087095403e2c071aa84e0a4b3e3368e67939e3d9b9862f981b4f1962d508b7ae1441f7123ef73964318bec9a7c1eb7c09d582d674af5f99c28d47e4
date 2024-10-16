var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';
import { BlockstoreMock } from '../../src/store/blockstore-mock.js';
import { DataStream } from '../../src/index.js';
import { importer } from 'ipfs-unixfs-importer';
import { MemoryBlockstore } from 'blockstore-core';
import { TestDataGenerator } from '../utils/test-data-generator.js';
chai.use(chaiAsPromised);
describe('BlockstoreMock', () => {
    it('should facilitate the same CID computation as other implementations', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        let dataSizeInBytes = 10;
        // iterate through order of magnitude in size until hitting 10MB
        // to ensure that the same CID is computed for the same data with the MockBlockstore as with the MemoryBlockstore
        while (dataSizeInBytes <= 10000000) {
            const dataBytes = TestDataGenerator.randomBytes(dataSizeInBytes);
            const dataStreamForMemoryBlockstore = DataStream.fromBytes(dataBytes);
            const dataStreamForMockBlockstore = DataStream.fromBytes(dataBytes);
            const asyncDataBlocksByMemoryBlockstore = importer([{ content: dataStreamForMemoryBlockstore }], new MemoryBlockstore(), { cidVersion: 1 });
            const asyncDataBlocksByMockBlockstore = importer([{ content: dataStreamForMockBlockstore }], new BlockstoreMock(), { cidVersion: 1 });
            // NOTE: the last block contains the root CID
            let blockByMemoryBlockstore;
            try {
                for (var _g = true, asyncDataBlocksByMemoryBlockstore_1 = (e_1 = void 0, __asyncValues(asyncDataBlocksByMemoryBlockstore)), asyncDataBlocksByMemoryBlockstore_1_1; asyncDataBlocksByMemoryBlockstore_1_1 = yield asyncDataBlocksByMemoryBlockstore_1.next(), _a = asyncDataBlocksByMemoryBlockstore_1_1.done, !_a; _g = true) {
                    _c = asyncDataBlocksByMemoryBlockstore_1_1.value;
                    _g = false;
                    blockByMemoryBlockstore = _c;
                    ;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_g && !_a && (_b = asyncDataBlocksByMemoryBlockstore_1.return)) yield _b.call(asyncDataBlocksByMemoryBlockstore_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const dataCidByMemoryBlockstore = blockByMemoryBlockstore ? blockByMemoryBlockstore.cid.toString() : '';
            let blockByMockBlockstore;
            try {
                for (var _h = true, asyncDataBlocksByMockBlockstore_1 = (e_2 = void 0, __asyncValues(asyncDataBlocksByMockBlockstore)), asyncDataBlocksByMockBlockstore_1_1; asyncDataBlocksByMockBlockstore_1_1 = yield asyncDataBlocksByMockBlockstore_1.next(), _d = asyncDataBlocksByMockBlockstore_1_1.done, !_d; _h = true) {
                    _f = asyncDataBlocksByMockBlockstore_1_1.value;
                    _h = false;
                    blockByMockBlockstore = _f;
                    ;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_h && !_d && (_e = asyncDataBlocksByMockBlockstore_1.return)) yield _e.call(asyncDataBlocksByMockBlockstore_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            const dataCidByMockBlockstore = blockByMockBlockstore ? blockByMockBlockstore.cid.toString() : '';
            expect(dataCidByMockBlockstore).to.exist;
            expect(dataCidByMockBlockstore.length).to.be.greaterThan(0);
            expect(dataCidByMockBlockstore).to.be.equal(dataCidByMemoryBlockstore);
            dataSizeInBytes *= 10;
        }
    }));
});
//# sourceMappingURL=blockstore-mock.spec.js.map