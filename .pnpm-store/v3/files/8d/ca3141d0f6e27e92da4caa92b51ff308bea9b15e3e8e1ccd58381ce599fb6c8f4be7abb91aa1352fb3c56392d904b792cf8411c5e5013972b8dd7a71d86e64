/// <reference types="readable-stream" />
import type { DataStore } from '../types/data-store.js';
import type { DidResolver } from '@web5/dids';
import type { EventLog } from '../types/event-log.js';
import type { EventStream } from '../types/subscriptions.js';
import type { GenericMessageReply } from '../types/message-types.js';
import type { MessageStore } from '../types//message-store.js';
import type { MethodHandler } from '../types/method-handler.js';
import type { RecordsQueryReplyEntry, RecordsWriteMessage } from '../types/records-types.js';
type HandlerArgs = {
    tenant: string;
    message: RecordsWriteMessage;
    dataStream?: _Readable.Readable;
};
export declare class RecordsWriteHandler implements MethodHandler {
    private didResolver;
    private messageStore;
    private dataStore;
    private eventLog;
    private eventStream?;
    constructor(didResolver: DidResolver, messageStore: MessageStore, dataStore: DataStore, eventLog: EventLog, eventStream?: EventStream | undefined);
    handle({ tenant, message, dataStream }: HandlerArgs): Promise<GenericMessageReply>;
    /**
     * Performs additional necessary validation before storing the RecordsWrite if it is a core DWN RecordsWrite that needs additional processing.
     * For instance: a Permission revocation RecordsWrite.
     */
    private preProcessingForCoreRecordsWrite;
    private static validateSchemaForCoreRecordsWrite;
    /**
     * Performs additional necessary tasks if the RecordsWrite handled is a core DWN RecordsWrite that need additional processing.
     * For instance: a Permission revocation RecordsWrite.
     */
    private postProcessingForCoreRecordsWrite;
    /**
     * Returns a `RecordsQueryReplyEntry` with a copy of the incoming message and the incoming data encoded to `Base64URL`.
     */
    cloneAndAddEncodedData(message: RecordsWriteMessage, dataBytes: Uint8Array): Promise<RecordsQueryReplyEntry>;
    private processMessageWithDataStream;
    private processMessageWithoutDataStream;
    /**
     * Validates the expected `dataCid` and `dataSize` in the descriptor vs the received data.
     *
     * @throws {DwnError} with `DwnErrorCode.RecordsWriteDataCidMismatch`
     *                    if the data stream resulted in a data CID that mismatches with `dataCid` in the given message
     * @throws {DwnError} with `DwnErrorCode.RecordsWriteDataSizeMismatch`
     *                    if `dataSize` in `descriptor` given mismatches the actual data size
     */
    private static validateDataIntegrity;
    private static authorizeRecordsWrite;
}
export {};
//# sourceMappingURL=records-write.d.ts.map