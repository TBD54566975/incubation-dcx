var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/**
 * A Utility class to help match indexes against filters.
 */
export class FilterUtility {
    /**
     * Matches the given key values against an array of filters, if any of the filters match, returns true.
     *
     * @returns true if any of the filters match.
     */
    static matchAnyFilter(keyValues, orFilters) {
        if (orFilters.length === 0) {
            return true;
        }
        for (const filter of orFilters) {
            // if any of the filters match the indexed values, we return true as it's a match
            if (this.matchFilter(keyValues, filter)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Evaluates the given filter against the indexed values.
     *
     * @param indexedValues the indexed values for an item.
     * @param filter
     * @returns true if all of the filter properties match.
     */
    static matchFilter(indexedValues, filter) {
        // we loop through each of the filter properties to check against the indexed values.
        // if any of them do not match we return false.
        for (const filterProperty in filter) {
            const filterValue = filter[filterProperty];
            const indexValue = indexedValues[filterProperty];
            if (indexValue === undefined) {
                return false;
            }
            const matched = Array.isArray(indexValue) ?
                this.matchAnyIndexValue(filterValue, indexValue) :
                this.matchIndexValue(filterValue, indexValue);
            if (!matched) {
                return false;
            }
        }
        return true;
    }
    /**
     * Returns true if any of the index values match the filter.
     *
     * @param filterValue the filter for a particular property.
     * @param indexValues an array of values to match the filter against.
     */
    static matchAnyIndexValue(filterValue, indexValues) {
        for (const indexValue of indexValues) {
            if (this.matchIndexValue(filterValue, indexValue)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns true if the filter matches the given index value.
     *
     * @param filterValue the filter for a particular property.
     * @param indexValue a single value to match the filter against.
     */
    static matchIndexValue(filterValue, indexValue) {
        if (typeof filterValue === 'object') {
            if (Array.isArray(filterValue)) {
                // if `filterValue` is an array, it is a OneOfFilter
                // Support OR matches by querying for each values separately,
                if (this.matchOneOf(filterValue, indexValue)) {
                    return true;
                }
            }
            else {
                // `filterValue` is a `RangeFilter`
                // range filters cannot range over booleans
                if (this.matchRange(filterValue, indexValue)) {
                    return true;
                }
            }
        }
        else {
            // filterValue is an EqualFilter, meaning it is a non-object primitive type
            if (indexValue === filterValue) {
                return true;
            }
        }
        return false;
    }
    /**
     * Evaluates a OneOfFilter given an indexedValue extracted from the index.
     *
     * @param filter An array of EqualFilters. Treated as an OR.
     * @param indexedValue the indexed value being compared.
     * @returns true if any of the given filters match the indexedValue
     */
    static matchOneOf(filter, indexedValue) {
        for (const orFilterValue of filter) {
            if (indexedValue === orFilterValue) {
                return true;
            }
        }
        return false;
    }
    /**
     * Evaluates if the given indexedValue is within the range given by the RangeFilter.
     *
     * @returns true if all of the range filter conditions are met.
     */
    static matchRange(rangeFilter, indexedValue) {
        if (rangeFilter.lt !== undefined && indexedValue >= rangeFilter.lt) {
            return false;
        }
        if (rangeFilter.lte !== undefined && indexedValue > rangeFilter.lte) {
            return false;
        }
        if (rangeFilter.gt !== undefined && indexedValue <= rangeFilter.gt) {
            return false;
        }
        if (rangeFilter.gte !== undefined && indexedValue < rangeFilter.gte) {
            return false;
        }
        return true;
    }
    static isEqualFilter(filter) {
        if (typeof filter !== 'object') {
            return true;
        }
        return false;
    }
    static isRangeFilter(filter) {
        if (typeof filter === 'object' && !Array.isArray(filter)) {
            return 'gt' in filter || 'lt' in filter || 'lte' in filter || 'gte' in filter;
        }
        ;
        return false;
    }
    static isOneOfFilter(filter) {
        if (typeof filter === 'object' && Array.isArray(filter)) {
            return true;
        }
        ;
        return false;
    }
    static convertRangeCriterion(inputFilter) {
        let rangeFilter;
        if (inputFilter.to !== undefined && inputFilter.from !== undefined) {
            rangeFilter = {
                gte: inputFilter.from,
                lt: inputFilter.to,
            };
        }
        else if (inputFilter.to !== undefined) {
            rangeFilter = {
                lt: inputFilter.to,
            };
        }
        else if (inputFilter.from !== undefined) {
            rangeFilter = {
                gte: inputFilter.from,
            };
        }
        return rangeFilter;
    }
    static constructPrefixFilterAsRangeFilter(prefix) {
        return {
            gte: prefix,
            lt: prefix + '\uffff',
        };
    }
}
export class FilterSelector {
    /**
     * Reduce Filter so that it is a filter that can be quickly executed against the DB.
     */
    static reduceFilter(filter) {
        // if there is only one or no property, we have no way to reduce it further
        const filterProperties = Object.keys(filter);
        if (filterProperties.length <= 1) {
            return filter;
        }
        // else there is are least 2 filter properties, since zero property is not allowed
        const { recordId, attester, parentId, recipient, contextId, author, protocolPath, schema, protocol } = filter, remainingProperties = __rest(filter, ["recordId", "attester", "parentId", "recipient", "contextId", "author", "protocolPath", "schema", "protocol"]);
        if (recordId !== undefined) {
            return { recordId };
        }
        if (attester !== undefined) {
            return { attester };
        }
        if (parentId !== undefined) {
            return { parentId };
        }
        if (recipient !== undefined) {
            return { recipient };
        }
        if (contextId !== undefined) {
            return { contextId };
        }
        if (protocolPath !== undefined) {
            return { protocolPath };
        }
        if (schema !== undefined) {
            return { schema };
        }
        if (protocol !== undefined) {
            return { protocol };
        }
        // else just return whatever property, we can optimize further later
        const remainingPropertyNames = Object.keys(remainingProperties);
        const firstRemainingProperty = remainingPropertyNames[0];
        const singlePropertyFilter = {};
        singlePropertyFilter[firstRemainingProperty] = filter[firstRemainingProperty];
        return singlePropertyFilter;
    }
}
//# sourceMappingURL=filter.js.map