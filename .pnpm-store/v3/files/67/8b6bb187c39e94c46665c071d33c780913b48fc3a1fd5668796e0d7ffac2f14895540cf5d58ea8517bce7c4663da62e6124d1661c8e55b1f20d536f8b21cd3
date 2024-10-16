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
import * as cbor from '@ipld/dag-cbor';
import { BlockstoreMock } from '../store/blockstore-mock.js';
import { CID } from 'multiformats/cid';
import { importer } from 'ipfs-unixfs-importer';
import { sha256 } from 'multiformats/hashes/sha2';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
// a map of all supported CID hashing algorithms. This map is used to select the appropriate hasher
// when generating a CID to compare against a provided CID
const hashers = {
    [sha256.code]: sha256,
};
// a map of all support codecs.This map is used to select the appropriate codec
// when generating a CID to compare against a provided CID
const codecs = {
    [cbor.code]: cbor
};
/**
 * Utility class for creating CIDs. Exported for the convenience of developers.
 */
export class Cid {
    /**
     * Computes a V1 CID for the provided payload
     * @param codecCode - the codec to use. Defaults to cbor
     * @param multihashCode - the multihasher to use. Defaults to sha256
     * @returns payload CID
     * @throws {Error} codec is not supported
     * @throws {Error} encoding fails
     * @throws {Error} if hasher is not supported
     */
    static computeCid(payload, codecCode = cbor.code, multihashCode = sha256.code) {
        return __awaiter(this, void 0, void 0, function* () {
            const codec = codecs[codecCode];
            if (!codec) {
                throw new DwnError(DwnErrorCode.ComputeCidCodecNotSupported, `codec [${codecCode}] not supported`);
            }
            const hasher = hashers[multihashCode];
            if (!hasher) {
                throw new DwnError(DwnErrorCode.ComputeCidMultihashNotSupported, `multihash code [${multihashCode}] not supported`);
            }
            const payloadBytes = codec.encode(payload);
            const payloadHash = yield hasher.digest(payloadBytes);
            const cid = yield CID.createV1(codec.code, payloadHash);
            return cid.toString();
        });
    }
    /**
     * Parses the given CID string into a {CID}.
     */
    static parseCid(str) {
        const cid = CID.parse(str).toV1();
        if (!codecs[cid.code]) {
            throw new DwnError(DwnErrorCode.ParseCidCodecNotSupported, `codec [${cid.code}] not supported`);
        }
        if (!hashers[cid.multihash.code]) {
            throw new DwnError(DwnErrorCode.ParseCidMultihashNotSupported, `multihash code [${cid.multihash.code}] not supported`);
        }
        return cid;
    }
    /**
     * @returns V1 CID of the DAG comprised by chunking data into unixfs DAG-PB encoded blocks
     */
    static computeDagPbCidFromBytes(content) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const asyncDataBlocks = importer([{ content }], new BlockstoreMock(), { cidVersion: 1 });
            // NOTE: the last block contains the root CID
            let block;
            try {
                for (var _d = true, asyncDataBlocks_1 = __asyncValues(asyncDataBlocks), asyncDataBlocks_1_1; asyncDataBlocks_1_1 = yield asyncDataBlocks_1.next(), _a = asyncDataBlocks_1_1.done, !_a; _d = true) {
                    _c = asyncDataBlocks_1_1.value;
                    _d = false;
                    block = _c;
                    ;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = asyncDataBlocks_1.return)) yield _b.call(asyncDataBlocks_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return block ? block.cid.toString() : '';
        });
    }
    /**
     * @returns V1 CID of the DAG comprised by chunking data into unixfs DAG-PB encoded blocks
     */
    static computeDagPbCidFromStream(dataStream) {
        var _a, e_2, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const asyncDataBlocks = importer([{ content: dataStream }], new BlockstoreMock(), { cidVersion: 1 });
            // NOTE: the last block contains the root CID
            let block;
            try {
                for (var _d = true, asyncDataBlocks_2 = __asyncValues(asyncDataBlocks), asyncDataBlocks_2_1; asyncDataBlocks_2_1 = yield asyncDataBlocks_2.next(), _a = asyncDataBlocks_2_1.done, !_a; _d = true) {
                    _c = asyncDataBlocks_2_1.value;
                    _d = false;
                    block = _c;
                    ;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = asyncDataBlocks_2.return)) yield _b.call(asyncDataBlocks_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return block ? block.cid.toString() : '';
        });
    }
}
//# sourceMappingURL=cid.js.map