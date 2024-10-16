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
import { BlockstoreLevel } from './blockstore-level.js';
import { createLevelDatabase } from './level-wrapper.js';
import { exporter } from 'ipfs-unixfs-exporter';
import { importer } from 'ipfs-unixfs-importer';
import { Readable } from 'readable-stream';
/**
 * A simple implementation of {@link DataStore} that works in both the browser and server-side.
 * Leverages LevelDB under the hood.
 *
 * It has the following structure (`+` represents an additional sublevel/partition):
 *   'data' + <tenant> + <recordId> + <dataCid> -> <data>
 */
export class DataStoreLevel {
    constructor(config = {}) {
        this.config = Object.assign({ blockstoreLocation: 'DATASTORE', createLevelDatabase }, config);
        this.blockstore = new BlockstoreLevel({
            location: this.config.blockstoreLocation,
            createLevelDatabase: this.config.createLevelDatabase,
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockstore.open();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockstore.close();
        });
    }
    put(tenant, recordId, dataCid, dataStream) {
        var _a, e_1, _b, _c;
        var _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const blockstoreForData = yield this.getBlockstoreForStoringData(tenant, recordId, dataCid);
            const asyncDataBlocks = importer([{ content: dataStream }], blockstoreForData, { cidVersion: 1 });
            // NOTE: the last block contains the root CID as well as info to derive the data size
            let dataDagRoot;
            try {
                for (var _f = true, asyncDataBlocks_1 = __asyncValues(asyncDataBlocks), asyncDataBlocks_1_1; asyncDataBlocks_1_1 = yield asyncDataBlocks_1.next(), _a = asyncDataBlocks_1_1.done, !_a; _f = true) {
                    _c = asyncDataBlocks_1_1.value;
                    _f = false;
                    dataDagRoot = _c;
                    ;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = asyncDataBlocks_1.return)) yield _b.call(asyncDataBlocks_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return {
                dataSize: Number((_e = (_d = dataDagRoot.unixfs) === null || _d === void 0 ? void 0 : _d.fileSize()) !== null && _e !== void 0 ? _e : dataDagRoot.size)
            };
        });
    }
    get(tenant, recordId, dataCid) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockstoreForData = yield this.getBlockstoreForStoringData(tenant, recordId, dataCid);
            const exists = yield blockstoreForData.has(dataCid);
            if (!exists) {
                return undefined;
            }
            // data is chunked into dag-pb unixfs blocks. re-inflate the chunks.
            const dataDagRoot = yield exporter(dataCid, blockstoreForData);
            const contentIterator = dataDagRoot.content();
            const dataStream = new Readable({
                read() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const result = yield contentIterator.next();
                        if (result.done) {
                            this.push(null); // end the stream
                        }
                        else {
                            this.push(result.value);
                        }
                    });
                }
            });
            let dataSize = dataDagRoot.size;
            if (dataDagRoot.type === 'file' || dataDagRoot.type === 'directory') {
                dataSize = dataDagRoot.unixfs.fileSize();
            }
            return {
                dataSize: Number(dataSize),
                dataStream,
            };
        });
    }
    delete(tenant, recordId, dataCid) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockstoreForData = yield this.getBlockstoreForStoringData(tenant, recordId, dataCid);
            yield blockstoreForData.clear();
        });
    }
    /**
     * Deletes everything in the store. Mainly used in tests.
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockstore.clear();
        });
    }
    /**
     * Gets the blockstore used for storing data for the given `tenant -> `recordId` -> `dataCid`.
     */
    getBlockstoreForStoringData(tenant, recordId, dataCid) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataPartitionName = 'data';
            const blockstoreForData = yield this.blockstore.partition(dataPartitionName);
            const blockstoreOfGivenTenant = yield blockstoreForData.partition(tenant);
            const blockstoreOfGivenRecordId = yield blockstoreOfGivenTenant.partition(recordId);
            const blockstoreOfGivenDataCidOfRecordId = yield blockstoreOfGivenRecordId.partition(dataCid);
            return blockstoreOfGivenDataCidOfRecordId;
        });
    }
}
//# sourceMappingURL=data-store-level.js.map