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
import { ArrayUtility } from '../../src/utils/array.js';
import { Cid } from '../../src/utils/cid.js';
import { DataStoreLevel } from '../../src/store/data-store-level.js';
import { DataStream } from '../../src/index.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
chai.use(chaiAsPromised);
let store;
describe('DataStoreLevel Test Suite', () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        store = new DataStoreLevel({ blockstoreLocation: 'TEST-DATASTORE' });
        yield store.open();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield store.clear(); // clean up before each test rather than after so that a test does not depend on other tests to do the clean up
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield store.close();
    }));
    describe('put', function () {
        it('should return the correct size of the data stored', () => __awaiter(this, void 0, void 0, function* () {
            const tenant = yield TestDataGenerator.randomCborSha256Cid();
            const recordId = yield TestDataGenerator.randomCborSha256Cid();
            let dataSizeInBytes = 10;
            // iterate through order of magnitude in size until hitting 10MB
            while (dataSizeInBytes <= 10000000) {
                const dataBytes = TestDataGenerator.randomBytes(dataSizeInBytes);
                const dataStream = DataStream.fromBytes(dataBytes);
                const dataCid = yield Cid.computeDagPbCidFromBytes(dataBytes);
                const { dataSize } = yield store.put(tenant, recordId, dataCid, dataStream);
                expect(dataSize).to.equal(dataSizeInBytes);
                const result = (yield store.get(tenant, recordId, dataCid));
                const storedDataBytes = yield DataStream.toBytes(result.dataStream);
                expect(storedDataBytes).to.eql(dataBytes);
                dataSizeInBytes *= 10;
            }
        }));
        it('should duplicate same data if written to different tenants', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.randomCborSha256Cid();
            const bob = yield TestDataGenerator.randomCborSha256Cid();
            const dataBytes = TestDataGenerator.randomBytes(100);
            const dataCid = yield Cid.computeDagPbCidFromBytes(dataBytes);
            // write data to alice's DWN
            const aliceDataStream = DataStream.fromBytes(dataBytes);
            const aliceRecordId = yield TestDataGenerator.randomCborSha256Cid();
            yield store.put(alice, aliceRecordId, dataCid, aliceDataStream);
            // write same data to bob's DWN
            const bobDataStream = DataStream.fromBytes(dataBytes);
            const bobRecordId = yield TestDataGenerator.randomCborSha256Cid();
            yield store.put(bob, bobRecordId, dataCid, bobDataStream);
            // verify that both alice and bob's blockstore have their own reference to data CID
            const blockstoreOfAliceRecord = yield store['getBlockstoreForStoringData'](alice, aliceRecordId, dataCid);
            const blockstoreOfBobRecord = yield store['getBlockstoreForStoringData'](bob, bobRecordId, dataCid);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfAliceRecord.db.keys())).to.eventually.eql([dataCid]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfBobRecord.db.keys())).to.eventually.eql([dataCid]);
        }));
    });
    describe('get', function () {
        it('should return `undefined if unable to find the data specified`', () => __awaiter(this, void 0, void 0, function* () {
            const tenant = yield TestDataGenerator.randomCborSha256Cid();
            const recordId = yield TestDataGenerator.randomCborSha256Cid();
            const randomCid = yield TestDataGenerator.randomCborSha256Cid();
            const result = yield store.get(tenant, recordId, randomCid);
            expect(result).to.be.undefined;
        }));
        it('should return `undefined` if the dataCid is different than the dataStream`', () => __awaiter(this, void 0, void 0, function* () {
            const tenant = yield TestDataGenerator.randomCborSha256Cid();
            const recordId = yield TestDataGenerator.randomCborSha256Cid();
            const randomCid = yield TestDataGenerator.randomCborSha256Cid();
            const dataBytes = TestDataGenerator.randomBytes(10000000);
            const dataStream = DataStream.fromBytes(dataBytes);
            yield store.put(tenant, recordId, randomCid, dataStream);
            const result = yield store.get(tenant, recordId, randomCid);
            expect(result).to.be.undefined;
        }));
    });
    describe('delete', function () {
        it('should not leave anything behind when deleting the root CID', () => __awaiter(this, void 0, void 0, function* () {
            const tenant = yield TestDataGenerator.randomCborSha256Cid();
            const recordId = yield TestDataGenerator.randomCborSha256Cid();
            const dataBytes = TestDataGenerator.randomBytes(10000000);
            const dataStream = DataStream.fromBytes(dataBytes);
            const dataCid = yield Cid.computeDagPbCidFromBytes(dataBytes);
            yield store.put(tenant, recordId, dataCid, dataStream);
            const keysBeforeDelete = yield ArrayUtility.fromAsyncGenerator(store.blockstore.db.keys());
            expect(keysBeforeDelete.length).to.equal(40);
            yield store.delete(tenant, recordId, dataCid);
            const keysAfterDelete = yield ArrayUtility.fromAsyncGenerator(store.blockstore.db.keys());
            expect(keysAfterDelete.length).to.equal(0);
        }));
        it('should only delete data in the sublevel of the corresponding record', () => __awaiter(this, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.randomCborSha256Cid();
            const bob = yield TestDataGenerator.randomCborSha256Cid();
            const dataBytes = TestDataGenerator.randomBytes(100);
            const dataCid = yield Cid.computeDagPbCidFromBytes(dataBytes);
            // alice writes a records with data
            const dataStream1 = DataStream.fromBytes(dataBytes);
            const recordId1 = yield TestDataGenerator.randomCborSha256Cid();
            yield store.put(alice, recordId1, dataCid, dataStream1);
            // alice writes a different record with same data again
            const dataStream2 = DataStream.fromBytes(dataBytes);
            const recordId2 = yield TestDataGenerator.randomCborSha256Cid();
            yield store.put(alice, recordId2, dataCid, dataStream2);
            // bob writes a records with same data
            const dataStream3 = DataStream.fromBytes(dataBytes);
            const recordId3 = yield TestDataGenerator.randomCborSha256Cid();
            yield store.put(bob, recordId3, dataCid, dataStream3);
            // bob writes a different record with same data again
            const dataStream4 = DataStream.fromBytes(dataBytes);
            const recordId4 = yield TestDataGenerator.randomCborSha256Cid();
            yield store.put(bob, recordId4, dataCid, dataStream4);
            // verify that all 4 records have reference to the same data CID
            const blockstoreOfRecord1 = yield store['getBlockstoreForStoringData'](alice, recordId1, dataCid);
            const blockstoreOfRecord2 = yield store['getBlockstoreForStoringData'](alice, recordId2, dataCid);
            const blockstoreOfRecord3 = yield store['getBlockstoreForStoringData'](bob, recordId3, dataCid);
            const blockstoreOfRecord4 = yield store['getBlockstoreForStoringData'](bob, recordId4, dataCid);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord1.db.keys())).to.eventually.eql([dataCid]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord2.db.keys())).to.eventually.eql([dataCid]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord3.db.keys())).to.eventually.eql([dataCid]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord4.db.keys())).to.eventually.eql([dataCid]);
            // alice deletes one of the two records
            yield store.delete(alice, recordId1, dataCid);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord1.db.keys())).to.eventually.eql([]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord2.db.keys())).to.eventually.eql([dataCid]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord3.db.keys())).to.eventually.eql([dataCid]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord4.db.keys())).to.eventually.eql([dataCid]);
            // alice deletes the other record
            yield store.delete(alice, recordId2, dataCid);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord1.db.keys())).to.eventually.eql([]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord2.db.keys())).to.eventually.eql([]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord3.db.keys())).to.eventually.eql([dataCid]);
            yield expect(ArrayUtility.fromAsyncGenerator(blockstoreOfRecord4.db.keys())).to.eventually.eql([dataCid]);
        }));
    });
});
//# sourceMappingURL=data-store-level.spec.js.map