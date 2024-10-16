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
import { BlockstoreLevel } from './blockstore-level.js';
import { Cid } from '../utils/cid.js';
import { CID } from 'multiformats/cid';
import { createLevelDatabase } from './level-wrapper.js';
import { executeUnlessAborted } from '../utils/abort.js';
import { IndexLevel } from './index-level.js';
import { Message } from '../core/message.js';
import { sha256 } from 'multiformats/hashes/sha2';
import { SortDirection } from '../types/query-types.js';
/**
 * A simple implementation of {@link MessageStore} that works in both the browser and server-side.
 * Leverages LevelDB under the hood.
 */
export class MessageStoreLevel {
    /**
     * @param {MessageStoreLevelConfig} config
     * @param {string} config.blockstoreLocation - must be a directory path (relative or absolute) where
     *  LevelDB will store its files, or in browsers, the name of the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase IDBDatabase} to be opened.
     * @param {string} config.indexLocation - same as config.blockstoreLocation
     */
    constructor(config = {}) {
        this.config = Object.assign({ blockstoreLocation: 'MESSAGESTORE', indexLocation: 'INDEX', createLevelDatabase }, config);
        this.blockstore = new BlockstoreLevel({
            location: this.config.blockstoreLocation,
            createLevelDatabase: this.config.createLevelDatabase,
        });
        this.index = new IndexLevel({
            location: this.config.indexLocation,
            createLevelDatabase: this.config.createLevelDatabase,
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockstore.open();
            yield this.index.open();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockstore.close();
            yield this.index.close();
        });
    }
    get(tenant, cidString, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            const partition = yield executeUnlessAborted(this.blockstore.partition(tenant), options === null || options === void 0 ? void 0 : options.signal);
            const cid = CID.parse(cidString);
            const bytes = yield partition.get(cid, options);
            if (!bytes) {
                return undefined;
            }
            const decodedBlock = yield executeUnlessAborted(block.decode({ bytes, codec: cbor, hasher: sha256 }), options === null || options === void 0 ? void 0 : options.signal);
            const message = decodedBlock.value;
            return message;
        });
    }
    query(tenant, filters, messageSort, pagination, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            // creates the query options including sorting and pagination.
            // this adds 1 to the limit if provided, that way we can check to see if there are additional results and provide a return cursor.
            const queryOptions = MessageStoreLevel.buildQueryOptions(messageSort, pagination);
            const results = yield this.index.query(tenant, filters, queryOptions, options);
            let cursor;
            // checks to see if the returned results are greater than the limit, which would indicate additional results.
            if ((pagination === null || pagination === void 0 ? void 0 : pagination.limit) !== undefined && pagination.limit < results.length) {
                // has additional records, remove last record and set cursor
                results.splice(-1);
                // set cursor to the last item remaining after the spliced result.
                cursor = IndexLevel.createCursorFromLastArrayItem(results, queryOptions.sortProperty);
            }
            const messages = [];
            for (let i = 0; i < results.length; i++) {
                const { messageCid } = results[i];
                const message = yield this.get(tenant, messageCid, options);
                if (message) {
                    messages.push(message);
                }
            }
            return { messages, cursor };
        });
    }
    /**
     * Builds the IndexLevel QueryOptions object given MessageStore sort and pagination parameters.
     */
    static buildQueryOptions(messageSort = {}, pagination = {}) {
        let { limit, cursor } = pagination;
        const { dateCreated, datePublished, messageTimestamp } = messageSort;
        let sortDirection = SortDirection.Ascending; // default
        // `keyof MessageSort` = name of all properties of `MessageSort` defaults to messageTimestamp
        let sortProperty = 'messageTimestamp';
        // set the sort property
        if (dateCreated !== undefined) {
            sortProperty = 'dateCreated';
        }
        else if (datePublished !== undefined) {
            sortProperty = 'datePublished';
        }
        else if (messageTimestamp !== undefined) {
            sortProperty = 'messageTimestamp';
        }
        if (messageSort[sortProperty] !== undefined) {
            sortDirection = messageSort[sortProperty];
        }
        // we add one more to the limit to determine whether there are additional results and to return a cursor.
        if (limit !== undefined && limit > 0) {
            limit = limit + 1;
        }
        return { sortDirection, sortProperty, limit, cursor };
    }
    delete(tenant, cidString, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            const partition = yield executeUnlessAborted(this.blockstore.partition(tenant), options === null || options === void 0 ? void 0 : options.signal);
            const cid = CID.parse(cidString);
            yield partition.delete(cid, options);
            yield this.index.delete(tenant, cidString, options);
        });
    }
    put(tenant, message, indexes, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.throwIfAborted();
            const partition = yield executeUnlessAborted(this.blockstore.partition(tenant), options === null || options === void 0 ? void 0 : options.signal);
            const encodedMessageBlock = yield executeUnlessAborted(block.encode({ value: message, codec: cbor, hasher: sha256 }), options === null || options === void 0 ? void 0 : options.signal);
            // MessageStore data may contain `encodedData` which is not taken into account when calculating the blockCID as it is optional data.
            const messageCid = Cid.parseCid(yield Message.getCid(message));
            yield partition.put(messageCid, encodedMessageBlock.bytes, options);
            const messageCidString = messageCid.toString();
            yield this.index.put(tenant, messageCidString, indexes, options);
        });
    }
    /**
     * deletes everything in the underlying blockstore and indices.
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockstore.clear();
            yield this.index.clear();
        });
    }
}
//# sourceMappingURL=message-store-level.js.map