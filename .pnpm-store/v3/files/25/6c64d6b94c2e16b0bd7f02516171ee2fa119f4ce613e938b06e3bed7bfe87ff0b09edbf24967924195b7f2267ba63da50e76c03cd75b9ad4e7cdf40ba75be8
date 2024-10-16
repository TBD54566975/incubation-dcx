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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import { isEmptyObject } from '../utils/object.js';
import { lexicographicalCompare } from '../utils/string.js';
import { SortDirection } from '../types/query-types.js';
import { createLevelDatabase, LevelWrapper } from './level-wrapper.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
import { FilterSelector, FilterUtility } from '../utils/filter.js';
const INDEX_SUBLEVEL_NAME = 'index';
/**
 * A LevelDB implementation for indexing the messages and events stored in the DWN.
 */
export class IndexLevel {
    constructor(config) {
        this.config = Object.assign({ createLevelDatabase }, config);
        this.db = new LevelWrapper({
            location: this.config.location,
            createLevelDatabase: this.config.createLevelDatabase,
            keyEncoding: 'utf8'
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.open();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.close();
        });
    }
    /**
     * deletes everything in the underlying index db.
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.clear();
        });
    }
    /**
     * Put an item into the index using information that will allow it to be queried for.
     *
     * @param tenant
     * @param messageCid a unique ID that represents the item being indexed, this is also used as the cursor value in a query.
     * @param indexes - (key-value pairs) to be included as part of indexing this item. Must include at least one indexing property.
     * @param options IndexLevelOptions that include an AbortSignal.
     */
    put(tenant, messageCid, indexes, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // ensure we have something valid to index
            if (isEmptyObject(indexes)) {
                throw new DwnError(DwnErrorCode.IndexMissingIndexableProperty, 'Index must include at least one valid indexable property');
            }
            const item = { messageCid, indexes };
            const opCreationPromises = [];
            // create an index entry for each property index
            // these indexes are all sortable lexicographically.
            for (const indexName in indexes) {
                const indexValue = indexes[indexName];
                if (Array.isArray(indexValue)) {
                    for (const indexValueItem of indexValue) {
                        const partitionOperationPromise = this.createPutIndexedItemOperation(tenant, item, indexName, indexValueItem);
                        opCreationPromises.push(partitionOperationPromise);
                    }
                }
                else {
                    const partitionOperationPromise = this.createPutIndexedItemOperation(tenant, item, indexName, indexValue);
                    opCreationPromises.push(partitionOperationPromise);
                }
            }
            // create a reverse lookup for the sortedIndex values. This is used during deletion and cursor starting point lookup.
            const partitionOperationPromise = this.createOperationForIndexesLookupPartition(tenant, { type: 'put', key: messageCid, value: JSON.stringify(indexes) });
            opCreationPromises.push(partitionOperationPromise);
            const indexOps = yield Promise.all(opCreationPromises);
            const tenantPartition = yield this.db.partition(tenant);
            yield tenantPartition.batch(indexOps, options);
        });
    }
    /**
     *  Deletes all of the index data associated with the item.
     */
    delete(tenant, messageCid, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const opCreationPromises = [];
            const indexes = yield this.getIndexes(tenant, messageCid);
            if (indexes === undefined) {
                // invalid messageCid
                return;
            }
            // delete the reverse lookup
            const partitionOperationPromise = this.createOperationForIndexesLookupPartition(tenant, { type: 'del', key: messageCid });
            opCreationPromises.push(partitionOperationPromise);
            // delete the keys for each index
            for (const indexName in indexes) {
                const indexValue = indexes[indexName];
                if (Array.isArray(indexValue)) {
                    for (const indexValueItem of indexValue) {
                        const partitionOperationPromise = this.createDeleteIndexedItemOperation(tenant, messageCid, indexName, indexValueItem);
                        opCreationPromises.push(partitionOperationPromise);
                    }
                }
                else {
                    const partitionOperationPromise = this.createDeleteIndexedItemOperation(tenant, messageCid, indexName, indexValue);
                    opCreationPromises.push(partitionOperationPromise);
                }
            }
            const indexOps = yield Promise.all(opCreationPromises);
            const tenantPartition = yield this.db.partition(tenant);
            yield tenantPartition.batch(indexOps, options);
        });
    }
    /**
     * Creates an IndexLevel `put` operation for indexing an item, creating a partition by `tenant` and by `indexName`
     */
    createPutIndexedItemOperation(tenant, item, indexName, indexValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageCid } = item;
            // The key is the indexValue followed by the messageCid as a tie-breaker.
            // for example if the property is messageTimestamp the key would look like:
            // '"2023-05-25T18:23:29.425008Z"\u0000bafyreigs3em7lrclhntzhgvkrf75j2muk6e7ypq3lrw3ffgcpyazyw6pry'
            const key = IndexLevel.keySegmentJoin(IndexLevel.encodeValue(indexValue), messageCid);
            return this.createOperationForIndexPartition(tenant, indexName, { type: 'put', key, value: JSON.stringify(item) });
        });
    }
    /**
     * Creates an IndexLevel `del` operation for deleting an item, creating a partition by `tenant` and by `indexName`
     */
    createDeleteIndexedItemOperation(tenant, messageCid, indexName, indexValue) {
        return __awaiter(this, void 0, void 0, function* () {
            // The key is the indexValue followed by the messageCid as a tie-breaker.
            // for example if the property is messageTimestamp the key would look like:
            // '"2023-05-25T18:23:29.425008Z"\u0000bafyreigs3em7lrclhntzhgvkrf75j2muk6e7ypq3lrw3ffgcpyazyw6pry'
            const key = IndexLevel.keySegmentJoin(IndexLevel.encodeValue(indexValue), messageCid);
            return this.createOperationForIndexPartition(tenant, indexName, { type: 'del', key });
        });
    }
    /**
     * Wraps the given operation as an operation for the specified index partition.
     */
    createOperationForIndexPartition(tenant, indexName, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            // we write the index entry into a sublevel-partition of tenantPartition.
            // putting each index entry within a sublevel allows the levelDB system to calculate a gt minKey and lt maxKey for each of the properties
            // this prevents them from clashing, especially when iterating in reverse without iterating through other properties.
            const tenantPartition = yield this.db.partition(tenant);
            const indexPartitionName = IndexLevel.getIndexPartitionName(indexName);
            const partitionOperation = tenantPartition.createPartitionOperation(indexPartitionName, operation);
            return partitionOperation;
        });
    }
    /**
     * Wraps the given operation as an operation for the messageCid to indexes lookup partition.
     */
    createOperationForIndexesLookupPartition(tenant, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantPartition = yield this.db.partition(tenant);
            const partitionOperation = tenantPartition.createPartitionOperation(INDEX_SUBLEVEL_NAME, operation);
            return partitionOperation;
        });
    }
    static getIndexPartitionName(indexName) {
        // we create index partition names in __${indexName}__ wrapping so they do not clash with other sublevels that are created for other purposes.
        return `__${indexName}__`;
    }
    /**
     * Gets the index partition of the given indexName.
     */
    getIndexPartition(tenant, indexName) {
        return __awaiter(this, void 0, void 0, function* () {
            const indexPartitionName = IndexLevel.getIndexPartitionName(indexName);
            return (yield this.db.partition(tenant)).partition(indexPartitionName);
        });
    }
    /**
     * Gets the messageCid to indexes lookup partition.
     */
    getIndexesLookupPartition(tenant) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.db.partition(tenant)).partition(INDEX_SUBLEVEL_NAME);
        });
    }
    /**
     * Queries the index for items that match the filters. If no filters are provided, all items are returned.
     *
     * @param filters Array of filters that are treated as an OR query.
     * @param queryOptions query options for sort and pagination, requires at least `sortProperty`. The default sort direction is ascending.
     * @param options IndexLevelOptions that include an AbortSignal.
     * @returns {IndexedItem[]} an array of `IndexedItem` that match the given filters.
     */
    query(tenant, filters, queryOptions, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if we should query using in-memory paging or iterator paging
            if (IndexLevel.shouldQueryWithInMemoryPaging(filters, queryOptions)) {
                return this.queryWithInMemoryPaging(tenant, filters, queryOptions, options);
            }
            return this.queryWithIteratorPaging(tenant, filters, queryOptions, options);
        });
    }
    /**
     * Queries the sort property index for items that match the filters. If no filters are provided, all items are returned.
     * This query is a linear iterator over the sorted index, checking each item for a match.
     * If a cursor is provided it starts the iteration from the cursor point.
     */
    queryWithIteratorPaging(tenant, filters, queryOptions, options) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { cursor: queryCursor, limit } = queryOptions;
            // if there is a cursor we fetch the starting key given the sort property, otherwise we start from the beginning of the index.
            const startKey = queryCursor ? this.createStartingKeyFromCursor(queryCursor) : '';
            const matches = [];
            try {
                for (var _d = true, _e = __asyncValues(this.getIndexIterator(tenant, startKey, queryOptions, options)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const item = _c;
                    if (limit !== undefined && limit === matches.length) {
                        break;
                    }
                    const { indexes } = item;
                    if (FilterUtility.matchAnyFilter(indexes, filters)) {
                        matches.push(item);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return matches;
        });
    }
    /**
     * Creates an AsyncGenerator that returns each sorted index item given a specific sortProperty.
     * If a cursor is passed, the starting value (gt or lt) is derived from that.
     */
    getIndexIterator(tenant, startKey, queryOptions, options) {
        return __asyncGenerator(this, arguments, function* getIndexIterator_1() {
            var _a, e_2, _b, _c;
            const { sortProperty, sortDirection = SortDirection.Ascending, cursor } = queryOptions;
            const iteratorOptions = {
                gt: startKey
            };
            // if we are sorting in descending order we can iterate in reverse.
            if (sortDirection === SortDirection.Descending) {
                iteratorOptions.reverse = true;
                // if a cursor is provided and we are sorting in descending order, the startKey should be the upper bound.
                if (cursor !== undefined) {
                    iteratorOptions.lt = startKey;
                    delete iteratorOptions.gt;
                }
            }
            const sortPartition = yield __await(this.getIndexPartition(tenant, sortProperty));
            try {
                for (var _d = true, _e = __asyncValues(sortPartition.iterator(iteratorOptions, options)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const [_, val] = _c;
                    const { indexes, messageCid } = JSON.parse(val);
                    yield yield __await({ indexes, messageCid });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    }
    /**
     * Creates the starting point for a LevelDB query given an messageCid as a cursor and the indexed property.
     * Used as (gt) for ascending queries, or (lt) for descending queries.
     */
    createStartingKeyFromCursor(cursor) {
        const { messageCid, value } = cursor;
        return IndexLevel.keySegmentJoin(IndexLevel.encodeValue(value), messageCid);
    }
    /**
     * Returns a PaginationCursor using the last item of a given array of IndexedItems.
     * If the given array is empty, undefined is returned.
     *
     * @throws {DwnError} if the sort property or cursor value is invalid.
     */
    static createCursorFromLastArrayItem(items, sortProperty) {
        if (items.length > 0) {
            return this.createCursorFromItem(items.at(-1), sortProperty);
        }
    }
    /**
     * Creates a PaginationCursor from a given IndexedItem and sortProperty.
     *
     * @throws {DwnError} if the sort property or cursor value is invalid.
     */
    static createCursorFromItem(item, sortProperty) {
        const { messageCid, indexes } = item;
        const value = indexes[sortProperty];
        if (value === undefined) {
            throw new DwnError(DwnErrorCode.IndexInvalidCursorSortProperty, `the sort property '${sortProperty}' is not defined within the given item.`);
        }
        // we only support cursors for string or number types
        if (typeof value === 'boolean' || Array.isArray(value)) {
            throw new DwnError(DwnErrorCode.IndexInvalidCursorValueType, `only string or number values are supported for cursors, a(n) ${typeof value} was given.`);
        }
        return { messageCid, value };
    }
    /**
     * Queries the provided searchFilters asynchronously, returning results that match the matchFilters.
     *
     * @param filters the filters passed to the parent query.
     * @param searchFilters the modified filters used for the LevelDB query to search for a subset of items to match against.
     *
     * @throws {DwnErrorCode.IndexLevelInMemoryInvalidSortProperty} if an invalid sort property is provided.
     */
    queryWithInMemoryPaging(tenant, filters, queryOptions, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortProperty, sortDirection = SortDirection.Ascending, cursor: queryCursor, limit } = queryOptions;
            // we get the cursor start key here so that we match the failing behavior of `queryWithIteratorPaging`
            const cursorStartingKey = queryCursor ? this.createStartingKeyFromCursor(queryCursor) : undefined;
            // we create a matches map so that we can short-circuit matched items within the async single query below.
            const matches = new Map();
            // If the filter is empty, we just give it an empty filter so that we can iterate over all the items later in executeSingleFilterQuery().
            // We could do the iteration here, but it would be duplicating the same logic, so decided to just setup the data structure here.
            if (filters.length === 0) {
                filters = [{}];
            }
            try {
                yield Promise.all(filters.map(filter => {
                    return this.executeSingleFilterQuery(tenant, filter, sortProperty, matches, options);
                }));
            }
            catch (error) {
                if (error.code === DwnErrorCode.IndexInvalidSortPropertyInMemory) {
                    // return empty results if the sort property is invalid.
                    return [];
                }
            }
            const sortedValues = [...matches.values()].sort((a, b) => this.sortItems(a, b, sortProperty, sortDirection));
            const start = cursorStartingKey !== undefined ? this.findCursorStartingIndex(sortedValues, sortDirection, sortProperty, cursorStartingKey) : 0;
            if (start < 0) {
                // if the provided cursor does not come before any of the results, we return no results
                return [];
            }
            const end = limit !== undefined ? start + limit : undefined;
            return sortedValues.slice(start, end);
        });
    }
    /**
     * Execute a filtered query against a single filter and return all results.
     */
    executeSingleFilterQuery(tenant, filter, sortProperty, matches, levelOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note: We have an array of Promises in order to support OR (anyOf) matches when given a list of accepted values for a property
            const filterPromises = [];
            // If the filter is empty, then we just iterate over one of the indexes that contains all the records and return all items.
            if (isEmptyObject(filter)) {
                const getAllItemsPromise = this.getAllItems(tenant, sortProperty);
                filterPromises.push(getAllItemsPromise);
            }
            // else the filter is not empty
            const searchFilter = FilterSelector.reduceFilter(filter);
            for (const propertyName in searchFilter) {
                const propertyFilter = searchFilter[propertyName];
                // We will find the union of these many individual queries later.
                if (FilterUtility.isEqualFilter(propertyFilter)) {
                    // propertyFilter is an EqualFilter, meaning it is a non-object primitive type
                    const exactMatchesPromise = this.filterExactMatches(tenant, propertyName, propertyFilter, levelOptions);
                    filterPromises.push(exactMatchesPromise);
                }
                else if (FilterUtility.isOneOfFilter(propertyFilter)) {
                    // `propertyFilter` is a OneOfFilter
                    // Support OR matches by querying for each values separately, then adding them to the promises array.
                    for (const propertyValue of new Set(propertyFilter)) {
                        const exactMatchesPromise = this.filterExactMatches(tenant, propertyName, propertyValue, levelOptions);
                        filterPromises.push(exactMatchesPromise);
                    }
                }
                else if (FilterUtility.isRangeFilter(propertyFilter)) {
                    // `propertyFilter` is a `RangeFilter`
                    const rangeMatchesPromise = this.filterRangeMatches(tenant, propertyName, propertyFilter, levelOptions);
                    filterPromises.push(rangeMatchesPromise);
                }
            }
            // acting as an OR match for the property, any of the promises returning a match will be treated as a property match
            for (const promise of filterPromises) {
                const indexItems = yield promise;
                // reminder: the promise returns a list of IndexedItem satisfying a particular property match
                for (const indexedItem of indexItems) {
                    // short circuit: if a data is already included to the final matched key set (by a different `Filter`),
                    // no need to evaluate if the data satisfies this current filter being evaluated
                    // otherwise check that the item is a match.
                    if (matches.has(indexedItem.messageCid) || !FilterUtility.matchFilter(indexedItem.indexes, filter)) {
                        continue;
                    }
                    // ensure that each matched item has the sortProperty, otherwise fail the entire query.
                    if (indexedItem.indexes[sortProperty] === undefined) {
                        throw new DwnError(DwnErrorCode.IndexInvalidSortPropertyInMemory, `invalid sort property ${sortProperty}`);
                    }
                    matches.set(indexedItem.messageCid, indexedItem);
                }
            }
        });
    }
    getAllItems(tenant, sortProperty) {
        var _a, e_3, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const filterPartition = yield this.getIndexPartition(tenant, sortProperty);
            const items = [];
            try {
                for (var _d = true, _e = __asyncValues(filterPartition.iterator()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const [_key, value] = _c;
                    items.push(JSON.parse(value));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return items;
        });
    }
    /**
     * Returns items that match the exact property and value.
     */
    filterExactMatches(tenant, propertyName, propertyValue, options) {
        var _a, e_4, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const matchPrefix = IndexLevel.keySegmentJoin(IndexLevel.encodeValue(propertyValue));
            const iteratorOptions = {
                gt: matchPrefix
            };
            const filterPartition = yield this.getIndexPartition(tenant, propertyName);
            const matches = [];
            try {
                for (var _d = true, _e = __asyncValues(filterPartition.iterator(iteratorOptions, options)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const [key, value] = _c;
                    // immediately stop if we arrive at an index that contains a different property value
                    if (!key.startsWith(matchPrefix)) {
                        break;
                    }
                    matches.push(JSON.parse(value));
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return matches;
        });
    }
    /**
     * Returns items that match the range filter.
     */
    filterRangeMatches(tenant, propertyName, rangeFilter, options) {
        var _a, e_5, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const iteratorOptions = {};
            for (const comparator in rangeFilter) {
                const comparatorName = comparator;
                iteratorOptions[comparatorName] = IndexLevel.encodeValue(rangeFilter[comparatorName]);
            }
            // if there is no lower bound specified (`gt` or `gte`), we need to iterate from the upper bound,
            // so that we will iterate over all the matches before hitting mismatches.
            if (iteratorOptions.gt === undefined && iteratorOptions.gte === undefined) {
                iteratorOptions.reverse = true;
            }
            const matches = [];
            const filterPartition = yield this.getIndexPartition(tenant, propertyName);
            try {
                for (var _d = true, _e = __asyncValues(filterPartition.iterator(iteratorOptions, options)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const [key, value] = _c;
                    // if "greater-than" is specified, skip all keys that contains the exact value given in the "greater-than" condition
                    if ('gt' in rangeFilter && this.extractIndexValueFromKey(key) === IndexLevel.encodeValue(rangeFilter.gt)) {
                        continue;
                    }
                    matches.push(JSON.parse(value));
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_5) throw e_5.error; }
            }
            if ('lte' in rangeFilter) {
                // When `lte` is used, we must also query the exact match explicitly because the exact match will not be included in the iterator above.
                // This is due to the extra data appended to the (property + value) key prefix, e.g.
                // the key '"2023-05-25T11:22:33.000000Z"\u0000bayfreigu....'
                // would be considered greater than `lte` value in { lte: '"2023-05-25T11:22:33.000000Z"' } iterator options,
                // thus would not be included in the iterator even though we'd like it to be.
                for (const item of yield this.filterExactMatches(tenant, propertyName, rangeFilter.lte, options)) {
                    matches.push(item);
                }
            }
            return matches;
        });
    }
    /**
     * Sorts Items lexicographically in ascending or descending order given a specific indexName, using the messageCid as a tie breaker.
     * We know the indexes include the indexName and they are only of string or number type and not Arrays or booleans.
     * because they have already been checked within executeSingleFilterQuery.
     */
    sortItems(itemA, itemB, indexName, direction) {
        const itemAValue = itemA.indexes[indexName];
        const itemBValue = itemB.indexes[indexName];
        const aCompareValue = IndexLevel.encodeValue(itemAValue) + itemA.messageCid;
        const bCompareValue = IndexLevel.encodeValue(itemBValue) + itemB.messageCid;
        return direction === SortDirection.Ascending ?
            lexicographicalCompare(aCompareValue, bCompareValue) :
            lexicographicalCompare(bCompareValue, aCompareValue);
    }
    /**
     * Find the starting position for pagination within the IndexedItem array.
     * Returns the index of the first item found which is either greater than or less than the given cursor, depending on sort order.
     */
    findCursorStartingIndex(items, sortDirection, sortProperty, cursorStartingKey) {
        const firstItemAfterCursor = (item) => {
            const { messageCid, indexes } = item;
            const sortValue = indexes[sortProperty];
            const itemCompareValue = IndexLevel.keySegmentJoin(IndexLevel.encodeValue(sortValue), messageCid);
            return sortDirection === SortDirection.Ascending ?
                itemCompareValue > cursorStartingKey :
                itemCompareValue < cursorStartingKey;
        };
        return items.findIndex(firstItemAfterCursor);
    }
    /**
     * Gets the indexes given an messageCid. This is a reverse lookup to construct starting keys, as well as deleting indexed items.
     */
    getIndexes(tenant, messageCid) {
        return __awaiter(this, void 0, void 0, function* () {
            const indexesLookupPartition = yield this.getIndexesLookupPartition(tenant);
            const serializedIndexes = yield indexesLookupPartition.get(messageCid);
            if (serializedIndexes === undefined) {
                // invalid messageCid
                return;
            }
            return JSON.parse(serializedIndexes);
        });
    }
    /**
     * Given a key from an indexed partitioned property key.
     *  ex:
     *    key: '"2023-05-25T11:22:33.000000Z"\u0000bayfreigu....'
     *    returns "2023-05-25T11:22:33.000000Z"
     */
    extractIndexValueFromKey(key) {
        const [value] = key.split(IndexLevel.delimiter);
        return value;
    }
    static keySegmentJoin(...values) {
        return values.join(IndexLevel.delimiter);
    }
    /**
     *  Encodes a numerical value as a string for lexicographical comparison.
     *  If the number is positive it simply pads it with leading zeros.
     *  ex.: input:  1024 => "0000000000001024"
     *       input: -1024 => "!9007199254739967"
     *
     * @param value the number to encode.
     * @returns a string representation of the number.
     */
    static encodeNumberValue(value) {
        const NEGATIVE_OFFSET = Number.MAX_SAFE_INTEGER;
        const NEGATIVE_PREFIX = '!'; // this will be sorted below positive numbers lexicographically
        const PADDING_LENGTH = String(Number.MAX_SAFE_INTEGER).length;
        const prefix = value < 0 ? NEGATIVE_PREFIX : '';
        const offset = value < 0 ? NEGATIVE_OFFSET : 0;
        return prefix + String(value + offset).padStart(PADDING_LENGTH, '0');
    }
    /**
     * Encodes an indexed value to a string
     *
     * NOTE: we currently only use this for strings, numbers and booleans.
     */
    static encodeValue(value) {
        switch (typeof value) {
            case 'number':
                return this.encodeNumberValue(value);
            default:
                return JSON.stringify(value);
        }
    }
    static shouldQueryWithInMemoryPaging(filters, queryOptions) {
        for (const filter of filters) {
            if (!IndexLevel.isFilterConcise(filter, queryOptions)) {
                return false;
            }
        }
        // only use in-memory paging if all filters are concise
        return true;
    }
    static isFilterConcise(filter, queryOptions) {
        // if there is a specific recordId in the filter, return true immediately.
        if (filter.recordId !== undefined) {
            return true;
        }
        // unless a recordId is present, if there is a cursor we never use in memory paging
        if (queryOptions.cursor !== undefined) {
            return false;
        }
        // NOTE: remaining conditions will not have cursor
        if (filter.protocolPath !== undefined ||
            filter.contextId !== undefined ||
            filter.parentId !== undefined ||
            filter.schema !== undefined) {
            return true;
        }
        // all else
        return false;
    }
}
/**
 * Joins the given values using the `\x00` (\u0000) character.
 */
IndexLevel.delimiter = `\x00`;
//# sourceMappingURL=index-level.js.map