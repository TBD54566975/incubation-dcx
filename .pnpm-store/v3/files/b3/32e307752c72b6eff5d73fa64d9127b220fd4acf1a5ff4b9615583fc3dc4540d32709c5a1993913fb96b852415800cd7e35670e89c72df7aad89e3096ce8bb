var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as block from 'multiformats/block';
import * as cbor from '@ipld/dag-cbor';
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';
import { Cid } from '../../src/utils/cid.js';
import { DataStream } from '../../src/index.js';
import { sha256 } from 'multiformats/hashes/sha2';
import { TestDataGenerator } from '../utils/test-data-generator.js';
// extend chai to test promises
chai.use(chaiAsPromised);
describe('CID', () => {
    it('should yield the same CID using either computeDagPbCidFromBytes() & computeDagPbCidFromStream()', () => __awaiter(void 0, void 0, void 0, function* () {
        const randomBytes = TestDataGenerator.randomBytes(500000);
        const randomByteStream = yield DataStream.fromBytes(randomBytes);
        const cid1 = yield Cid.computeDagPbCidFromBytes(randomBytes);
        const cid2 = yield Cid.computeDagPbCidFromStream(randomByteStream);
        expect(cid1).to.equal(cid2);
    }));
    describe('computeCid', () => {
        it('throws an error if codec is not supported', () => __awaiter(void 0, void 0, void 0, function* () {
            const unsupportedCodec = 99999;
            const anyTestData = {
                a: TestDataGenerator.randomString(32),
            };
            const computeCidPromise = Cid.computeCid(anyTestData, 99999);
            yield expect(computeCidPromise).to.be.rejectedWith(`codec [${unsupportedCodec}] not supported`);
        }));
        it('throws an error if multihasher is not supported', () => __awaiter(void 0, void 0, void 0, function* () {
            const unsupportedHashAlgorithm = 99999;
            const anyTestData = {
                a: TestDataGenerator.randomString(32),
            };
            const computeCidPromise = Cid.computeCid(anyTestData, 113, 99999); // 113 = CBOR
            yield expect(computeCidPromise).to.be.rejectedWith(`multihash code [${unsupportedHashAlgorithm}] not supported`);
        }));
        it('should by default generate a CBOR SHA256 CID identical to IPFS block encoding algorithm', () => __awaiter(void 0, void 0, void 0, function* () {
            const anyTestData = {
                a: TestDataGenerator.randomString(32),
                b: TestDataGenerator.randomString(32),
                c: TestDataGenerator.randomString(32)
            };
            const generatedCid = yield Cid.computeCid(anyTestData);
            const encodedBlock = yield block.encode({ value: anyTestData, codec: cbor, hasher: sha256 });
            expect(generatedCid).to.equal(encodedBlock.cid.toString());
        }));
        it('should canonicalize JSON input before hashing', () => __awaiter(void 0, void 0, void 0, function* () {
            const data1 = {
                a: 'a',
                b: 'b',
                c: 'c'
            };
            const data2 = {
                b: 'b',
                c: 'c',
                a: 'a'
            };
            const cid1 = yield Cid.computeCid(data1);
            const cid2 = yield Cid.computeCid(data2);
            expect(cid1).to.equal(cid2);
        }));
    });
    describe('parseCid', () => {
        it('throws an error if codec is not supported', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(() => Cid.parseCid('bafybeihzdcfjv55kxiz7sxwxaxbnjgj7rm2amvrxpi67jpwkgygjzoh72y')).to.throw('codec [112] not supported'); // a DAG-PB CID
        }));
        it('throws an error if multihasher is not supported', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(() => Cid.parseCid('bafy2bzacec2qlo3cohxyaoulipd3hurlq6pspvmpvmnmqsxfg4vbumpq3ufag')).to.throw('multihash code [45600] not supported'); // 45600 = BLAKE2b-256 CID
        }));
    });
});
//# sourceMappingURL=cid.spec.js.map