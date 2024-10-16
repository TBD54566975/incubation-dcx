import type { Filter } from '../types/query-types.js';
import type { MessagesFilter } from '../types/messages-types.js';
/**
 * Class containing Messages related utility methods.
 */
export declare class Messages {
    /**
     * Normalizes/fixes the formatting of the given filters (such as URLs) so that they provide a consistent search experience.
     */
    static normalizeFilters(filters: MessagesFilter[]): MessagesFilter[];
    /**
     *  Converts an incoming array of MessagesFilter into an array of Filter usable by MessageLog.
     *
     * @param filters An array of MessagesFilter
     * @returns {Filter[]} an array of generic Filter able to be used when querying.
     */
    static convertFilters(filters: MessagesFilter[]): Filter[];
    /**
     * Constructs a filter that gets associated permission records if protocol is in the given filter.
     */
    private static constructPermissionRecordsFilter;
    /**
     * Converts an external-facing filter model into an internal-facing filer model used by data store.
     */
    private static convertFilter;
}
//# sourceMappingURL=messages.d.ts.map