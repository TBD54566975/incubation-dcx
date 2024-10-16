import type { EventLog } from '../types/event-log.js';
import type { EventStream } from '../types/subscriptions.js';
import type { ULIDFactory } from 'ulidx';
import type { Filter, KeyValues, PaginationCursor } from '../types/query-types.js';
import { createLevelDatabase } from '../store/level-wrapper.js';
import { IndexLevel } from '../store/index-level.js';
type EventLogLevelConfig = {
    /**
      * must be a directory path (relative or absolute) where
      *  LevelDB will store its files, or in browsers, the name of the
      * {@link https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase IDBDatabase} to be opened.
     */
    location?: string;
    createLevelDatabase?: typeof createLevelDatabase;
    eventStream?: EventStream;
};
export declare class EventLogLevel implements EventLog {
    ulidFactory: ULIDFactory;
    index: IndexLevel;
    constructor(config?: EventLogLevelConfig);
    open(): Promise<void>;
    close(): Promise<void>;
    clear(): Promise<void>;
    append(tenant: string, messageCid: string, indexes: KeyValues): Promise<void>;
    queryEvents(tenant: string, filters: Filter[], cursor?: PaginationCursor): Promise<{
        events: string[];
        cursor?: PaginationCursor;
    }>;
    getEvents(tenant: string, cursor?: PaginationCursor): Promise<{
        events: string[];
        cursor?: PaginationCursor;
    }>;
    deleteEventsByCid(tenant: string, messageCids: Array<string>): Promise<void>;
}
export {};
//# sourceMappingURL=event-log-level.d.ts.map