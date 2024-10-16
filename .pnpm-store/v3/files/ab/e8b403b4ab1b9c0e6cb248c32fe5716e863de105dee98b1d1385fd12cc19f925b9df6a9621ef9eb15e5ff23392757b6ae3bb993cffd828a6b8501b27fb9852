import type { EqualFilter, Filter, FilterValue, KeyValues, OneOfFilter, RangeCriterion, RangeFilter } from '../types/query-types.js';
/**
 * A Utility class to help match indexes against filters.
 */
export declare class FilterUtility {
    /**
     * Matches the given key values against an array of filters, if any of the filters match, returns true.
     *
     * @returns true if any of the filters match.
     */
    static matchAnyFilter(keyValues: KeyValues, orFilters: Filter[]): boolean;
    /**
     * Evaluates the given filter against the indexed values.
     *
     * @param indexedValues the indexed values for an item.
     * @param filter
     * @returns true if all of the filter properties match.
     */
    static matchFilter(indexedValues: KeyValues, filter: Filter): boolean;
    /**
     * Returns true if any of the index values match the filter.
     *
     * @param filterValue the filter for a particular property.
     * @param indexValues an array of values to match the filter against.
     */
    private static matchAnyIndexValue;
    /**
     * Returns true if the filter matches the given index value.
     *
     * @param filterValue the filter for a particular property.
     * @param indexValue a single value to match the filter against.
     */
    private static matchIndexValue;
    /**
     * Evaluates a OneOfFilter given an indexedValue extracted from the index.
     *
     * @param filter An array of EqualFilters. Treated as an OR.
     * @param indexedValue the indexed value being compared.
     * @returns true if any of the given filters match the indexedValue
     */
    private static matchOneOf;
    /**
     * Evaluates if the given indexedValue is within the range given by the RangeFilter.
     *
     * @returns true if all of the range filter conditions are met.
     */
    private static matchRange;
    static isEqualFilter(filter: FilterValue): filter is EqualFilter;
    static isRangeFilter(filter: FilterValue): filter is RangeFilter;
    static isOneOfFilter(filter: FilterValue): filter is OneOfFilter;
    static convertRangeCriterion(inputFilter: RangeCriterion): RangeFilter | undefined;
    static constructPrefixFilterAsRangeFilter(prefix: string): RangeFilter;
}
export declare class FilterSelector {
    /**
     * Reduce Filter so that it is a filter that can be quickly executed against the DB.
     */
    static reduceFilter(filter: Filter): Filter;
}
//# sourceMappingURL=filter.d.ts.map