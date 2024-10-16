import type { Filter, KeyValues, PaginationCursor, QueryOptions } from '../types/query-types.js';
import { createLevelDatabase, LevelWrapper } from './level-wrapper.js';
type IndexLevelConfig = {
    location: string;
    createLevelDatabase?: typeof createLevelDatabase;
};
export type IndexedItem = {
    messageCid: string;
    indexes: KeyValues;
};
export interface IndexLevelOptions {
    signal?: AbortSignal;
}
/**
 * A LevelDB implementation for indexing the messages and events stored in the DWN.
 */
export declare class IndexLevel {
    db: LevelWrapper<string>;
    config: IndexLevelConfig;
    constructor(config: IndexLevelConfig);
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * deletes everything in the underlying index db.
     */
    clear(): Promise<void>;
    /**
     * Put an item into the index using information that will allow it to be queried for.
     *
     * @param tenant
     * @param messageCid a unique ID that represents the item being indexed, this is also used as the cursor value in a query.
     * @param indexes - (key-value pairs) to be included as part of indexing this item. Must include at least one indexing property.
     * @param options IndexLevelOptions that include an AbortSignal.
     */
    put(tenant: string, messageCid: string, indexes: KeyValues, options?: IndexLevelOptions): Promise<void>;
    /**
     *  Deletes all of the index data associated with the item.
     */
    delete(tenant: string, messageCid: string, options?: IndexLevelOptions): Promise<void>;
    /**
     * Creates an IndexLevel `put` operation for indexing an item, creating a partition by `tenant` and by `indexName`
     */
    private createPutIndexedItemOperation;
    /**
     * Creates an IndexLevel `del` operation for deleting an item, creating a partition by `tenant` and by `indexName`
     */
    private createDeleteIndexedItemOperation;
    /**
     * Wraps the given operation as an operation for the specified index partition.
     */
    private createOperationForIndexPartition;
    /**
     * Wraps the given operation as an operation for the messageCid to indexes lookup partition.
     */
    private createOperationForIndexesLookupPartition;
    private static getIndexPartitionName;
    /**
     * Gets the index partition of the given indexName.
     */
    private getIndexPartition;
    /**
     * Gets the messageCid to indexes lookup partition.
     */
    private getIndexesLookupPartition;
    /**
     * Queries the index for items that match the filters. If no filters are provided, all items are returned.
     *
     * @param filters Array of filters that are treated as an OR query.
     * @param queryOptions query options for sort and pagination, requires at least `sortProperty`. The default sort direction is ascending.
     * @param options IndexLevelOptions that include an AbortSignal.
     * @returns {IndexedItem[]} an array of `IndexedItem` that match the given filters.
     */
    query(tenant: string, filters: Filter[], queryOptions: QueryOptions, options?: IndexLevelOptions): Promise<IndexedItem[]>;
    /**
     * Queries the sort property index for items that match the filters. If no filters are provided, all items are returned.
     * This query is a linear iterator over the sorted index, checking each item for a match.
     * If a cursor is provided it starts the iteration from the cursor point.
     */
    queryWithIteratorPaging(tenant: string, filters: Filter[], queryOptions: QueryOptions, options?: IndexLevelOptions): Promise<IndexedItem[]>;
    /**
     * Creates an AsyncGenerator that returns each sorted index item given a specific sortProperty.
     * If a cursor is passed, the starting value (gt or lt) is derived from that.
     */
    private getIndexIterator;
    /**
     * Creates the starting point for a LevelDB query given an messageCid as a cursor and the indexed property.
     * Used as (gt) for ascending queries, or (lt) for descending queries.
     */
    private createStartingKeyFromCursor;
    /**
     * Returns a PaginationCursor using the last item of a given array of IndexedItems.
     * If the given array is empty, undefined is returned.
     *
     * @throws {DwnError} if the sort property or cursor value is invalid.
     */
    static createCursorFromLastArrayItem(items: IndexedItem[], sortProperty: string): PaginationCursor | undefined;
    /**
     * Creates a PaginationCursor from a given IndexedItem and sortProperty.
     *
     * @throws {DwnError} if the sort property or cursor value is invalid.
     */
    static createCursorFromItem(item: IndexedItem, sortProperty: string): PaginationCursor;
    /**
     * Queries the provided searchFilters asynchronously, returning results that match the matchFilters.
     *
     * @param filters the filters passed to the parent query.
     * @param searchFilters the modified filters used for the LevelDB query to search for a subset of items to match against.
     *
     * @throws {DwnErrorCode.IndexLevelInMemoryInvalidSortProperty} if an invalid sort property is provided.
     */
    queryWithInMemoryPaging(tenant: string, filters: Filter[], queryOptions: QueryOptions, options?: IndexLevelOptions): Promise<IndexedItem[]>;
    /**
     * Execute a filtered query against a single filter and return all results.
     */
    private executeSingleFilterQuery;
    private getAllItems;
    /**
     * Returns items that match the exact property and value.
     */
    private filterExactMatches;
    /**
     * Returns items that match the range filter.
     */
    private filterRangeMatches;
    /**
     * Sorts Items lexicographically in ascending or descending order given a specific indexName, using the messageCid as a tie breaker.
     * We know the indexes include the indexName and they are only of string or number type and not Arrays or booleans.
     * because they have already been checked within executeSingleFilterQuery.
     */
    private sortItems;
    /**
     * Find the starting position for pagination within the IndexedItem array.
     * Returns the index of the first item found which is either greater than or less than the given cursor, depending on sort order.
     */
    private findCursorStartingIndex;
    /**
     * Gets the indexes given an messageCid. This is a reverse lookup to construct starting keys, as well as deleting indexed items.
     */
    private getIndexes;
    /**
     * Given a key from an indexed partitioned property key.
     *  ex:
     *    key: '"2023-05-25T11:22:33.000000Z"\u0000bayfreigu....'
     *    returns "2023-05-25T11:22:33.000000Z"
     */
    private extractIndexValueFromKey;
    /**
     * Joins the given values using the `\x00` (\u0000) character.
     */
    private static delimiter;
    private static keySegmentJoin;
    /**
     *  Encodes a numerical value as a string for lexicographical comparison.
     *  If the number is positive it simply pads it with leading zeros.
     *  ex.: input:  1024 => "0000000000001024"
     *       input: -1024 => "!9007199254739967"
     *
     * @param value the number to encode.
     * @returns a string representation of the number.
     */
    static encodeNumberValue(value: number): string;
    /**
     * Encodes an indexed value to a string
     *
     * NOTE: we currently only use this for strings, numbers and booleans.
     */
    static encodeValue(value: string | number | boolean): string;
    private static shouldQueryWithInMemoryPaging;
    static isFilterConcise(filter: Filter, queryOptions: QueryOptions): boolean;
}
export {};
//# sourceMappingURL=index-level.d.ts.map