/**
 * NOTE: Added reference types here to avoid a `pnpm` bug during build.
 * https://github.com/TBD54566975/web5-js/pull/507
 */
import type { Readable } from '@web5/common';
import { Web5Agent, DwnInterface, DwnMessage, DwnResponseStatus, DwnMessageDescriptor, DwnDateSort, DwnPaginationCursor } from '@web5/agent';
/**
 * Represents Immutable Record properties that cannot be changed after the record is created.
 *
 * @beta
 * */
export type ImmutableRecordProperties = Pick<DwnMessageDescriptor[DwnInterface.RecordsWrite], 'dateCreated' | 'parentId' | 'protocol' | 'protocolPath' | 'recipient' | 'schema'>;
/**
 * Represents Optional Record properties that depend on the Record's current state.
 *
 * @beta
*/
export type OptionalRecordProperties = Pick<DwnMessage[DwnInterface.RecordsWrite], 'authorization' | 'attestation' | 'encryption' | 'contextId'> & Pick<DwnMessageDescriptor[DwnInterface.RecordsWrite], 'dataFormat' | 'dataCid' | 'dataSize' | 'datePublished' | 'published' | 'tags'>;
/**
 * Represents the structured data model of a record, encapsulating the essential fields that define
 * the record's metadata and payload within a Decentralized Web Node (DWN).
 *
 * @beta
 */
export type RecordModel = ImmutableRecordProperties & OptionalRecordProperties & {
    /** The logical author of the record. */
    author: string;
    /** The unique identifier of the record. */
    recordId?: string;
    /** The timestamp indicating when the record was last modified. */
    messageTimestamp?: string;
    /** The protocol role under which this record is written. */
    protocolRole?: RecordOptions['protocolRole'];
};
/**
 * Options for configuring a {@link Record} instance, extending the base `RecordsWriteMessage` with
 * additional properties.
 *
 * This type combines the standard fields required for writing DWN records with additional metadata
 * and configuration options used specifically in the {@link Record} class.
 *
 * @beta
 */
export type RecordOptions = DwnMessage[DwnInterface.RecordsWrite] & {
    /** The DID that signed the record. */
    author: string;
    /** The DID of the DWN tenant under which record operations are being performed. */
    connectedDid: string;
    /** The data of the record, either as a Base64 URL encoded string or a Blob. */
    encodedData?: string | Blob;
    /**
     * A stream of data, conforming to the `Readable` or `ReadableStream` interface, providing a
     * mechanism to read the record's data sequentially. This is particularly useful for handling
     * large datasets that should not be loaded entirely in memory, allowing for efficient, chunked
     * processing of the record's data.
     */
    data?: Readable | ReadableStream;
    /** The initial `RecordsWriteMessage` that represents the initial state/version of the record. */
    initialWrite?: DwnMessage[DwnInterface.RecordsWrite];
    /** The protocol role under which this record is written. */
    protocolRole?: string;
    /** The remote tenant DID if the record was queried or read from a remote DWN. */
    remoteOrigin?: string;
};
/**
 * Parameters for updating a DWN record.
 *
 * This type specifies the set of properties that can be updated on an existing record. It is used
 * to convey the new state or changes to be applied to the record.
 *
 * @beta
 */
export type RecordUpdateParams = {
    /**
     * The new data for the record, which can be of any type. This data will replace the existing
     * data of the record. It's essential to ensure that this data is compatible with the record's
     * schema or data format expectations.
     */
    data?: unknown;
    /**
     * The Content Identifier (CID) of the data. Updating this value changes the reference to the data
     * associated with the record.
     */
    dataCid?: DwnMessageDescriptor[DwnInterface.RecordsWrite]['dataCid'];
    /** The size of the data in bytes. */
    dataSize?: DwnMessageDescriptor[DwnInterface.RecordsWrite]['dataSize'];
    /** The timestamp indicating when the record was last modified. */
    dateModified?: DwnMessageDescriptor[DwnInterface.RecordsWrite]['messageTimestamp'];
    /** The timestamp indicating when the record was published. */
    datePublished?: DwnMessageDescriptor[DwnInterface.RecordsWrite]['datePublished'];
    /** The protocol role under which this record is written. */
    protocolRole?: RecordOptions['protocolRole'];
    /** The published status of the record. */
    published?: DwnMessageDescriptor[DwnInterface.RecordsWrite]['published'];
    /** The tags associated with the updated record */
    tags?: DwnMessageDescriptor[DwnInterface.RecordsWrite]['tags'];
};
/**
 * Parameters for deleting a DWN record.
 *
 * This type specifies the set of properties that are used when deleting an existing record. It is used
 * to convey the new state or changes to be applied to the record.
 *
 * @beta
 */
export type RecordDeleteParams = {
    /** Whether or not to store the message. */
    store?: boolean;
    /** Whether or not to sign the delete as an owner in order to import it. */
    signAsOwner?: boolean;
    /** Whether or not to prune any children this record may have. */
    prune?: DwnMessageDescriptor[DwnInterface.RecordsDelete]['prune'];
    /** The timestamp indicating when the record was deleted. */
    dateModified?: DwnMessageDescriptor[DwnInterface.RecordsDelete]['messageTimestamp'];
};
/**
 * The `Record` class encapsulates a single record's data and metadata, providing a more
 * developer-friendly interface for working with Decentralized Web Node (DWN) records.
 *
 * Methods are provided to read, update, and manage the record's lifecycle, including writing to
 * remote DWNs.
 *
 * Note: The `messageTimestamp` of the most recent RecordsWrite message is
 *       logically equivalent to the date/time at which a Record was most
 *       recently modified.  Since this Record class implementation is
 *       intended to simplify the developer experience of working with
 *       logical records (and not individual DWN messages) the
 *       `messageTimestamp` is mapped to `dateModified`.
 *
 * @beta
 */
export declare class Record implements RecordModel {
    /**
     * Cache to minimize the amount of redundant two-phase commits we do in store() and send()
     * Retains awareness of the last 100 records stored/sent for up to 100 target DIDs each.
     */
    private static _sendCache;
    /** The {@link Web5Agent} instance that handles DWNs requests. */
    private _agent;
    /** The DID of the DWN tenant under which operations are being performed. */
    private _connectedDid;
    /** Encoded data of the record, if available. */
    private _encodedData?;
    /** Stream of the record's data. */
    private _readableStream?;
    /** The origin DID if the record was fetched from a remote DWN. */
    private _remoteOrigin?;
    /** The DID of the entity that authored the record. */
    private _author;
    /** Attestation JWS signature. */
    private _attestation?;
    /** Authorization signature(s). */
    private _authorization?;
    /** Context ID associated with the record. */
    private _contextId?;
    /** Descriptor detailing the record's schema, format, and other metadata. */
    private _descriptor;
    /** Encryption details for the record, if the data is encrypted. */
    private _encryption?;
    /** Initial state of the record before any updates. */
    private _initialWrite;
    /** Flag indicating if the initial write has been stored, to prevent duplicates. */
    private _initialWriteStored;
    /** Flag indicating if the initial write has been signed by the owner. */
    private _initialWriteSigned;
    /** Unique identifier of the record. */
    private _recordId;
    /** Role under which the record is written. */
    private _protocolRole?;
    /** The `RecordsWriteMessage` descriptor unless the record is in a deleted state */
    private get _recordsWriteDescriptor();
    /** The `RecordsWrite` descriptor from the current record or the initial write if the record is in a delete state. */
    private get _immutableProperties();
    /** Record's ID */
    get id(): string;
    /** Record's context ID */
    get contextId(): string;
    /** Record's creation date */
    get dateCreated(): string;
    /** Record's parent ID */
    get parentId(): string;
    /** Record's protocol */
    get protocol(): string;
    /** Record's protocol path */
    get protocolPath(): string;
    /** Record's recipient */
    get recipient(): string;
    /** Record's schema */
    get schema(): string;
    /** Record's data format */
    get dataFormat(): string;
    /** Record's CID */
    get dataCid(): string;
    /** Record's data size */
    get dataSize(): number;
    /** Record's published date */
    get datePublished(): string;
    /** Record's published status (true/false) */
    get published(): boolean;
    /** Tags of the record */
    get tags(): import("@tbd54566975/dwn-sdk-js").RecordsWriteTags;
    /** DID that is the logical author of the Record. */
    get author(): string;
    /** Record's modified date */
    get dateModified(): string;
    /** Record's encryption */
    get encryption(): DwnMessage[DwnInterface.RecordsWrite]['encryption'];
    /** Record's signatures attestation */
    get authorization(): DwnMessage[DwnInterface.RecordsWrite | DwnInterface.RecordsDelete]['authorization'];
    /** Record's signatures attestation */
    get attestation(): DwnMessage[DwnInterface.RecordsWrite]['attestation'] | undefined;
    /** Role under which the author is writing the record */
    get protocolRole(): string;
    /** Record's deleted state (true/false) */
    get deleted(): boolean;
    /** Record's initial write if the record has been updated */
    get initialWrite(): RecordOptions['initialWrite'];
    /**
     * Returns a copy of the raw `RecordsWriteMessage` that was used to create the current `Record` instance.
     */
    get rawMessage(): DwnMessage[DwnInterface.RecordsWrite] | DwnMessage[DwnInterface.RecordsDelete];
    constructor(agent: Web5Agent, options: RecordOptions);
    /**
     * Returns the data of the current record.
     * If the record data is not available, it attempts to fetch the data from the DWN.
     * @returns a data stream with convenience methods such as `blob()`, `json()`, `text()`, and `stream()`, similar to the fetch API response
     * @throws `Error` if the record has already been deleted.
     *
     * @beta
     */
    get data(): {
        /**
         * Returns the data of the current record as a `Blob`.
         *
         * @returns A promise that resolves to a Blob containing the record's data.
         * @throws If the record data is not available or cannot be converted to a `Blob`.
         *
         * @beta
         */
        blob(): Promise<Blob>;
        /**
         * Returns the data of the current record as a `Uint8Array`.
         *
         * @returns A Promise that resolves to a `Uint8Array` containing the record's data bytes.
         * @throws If the record data is not available or cannot be converted to a byte array.
         *
         * @beta
         */
        bytes(): Promise<Uint8Array>;
        /**
         * Parses the data of the current record as JSON and returns it as a JavaScript object.
         *
         * @returns A Promise that resolves to a JavaScript object parsed from the record's JSON data.
         * @throws If the record data is not available, not in JSON format, or cannot be parsed.
         *
         * @beta
         */
        json(): Promise<any>;
        /**
         * Returns the data of the current record as a `string`.
         *
         * @returns A promise that resolves to a `string` containing the record's text data.
         * @throws If the record data is not available or cannot be converted to text.
         *
         * @beta
         */
        text(): Promise<string>;
        /**
         * Provides a `Readable` stream containing the record's data.
         *
         * @returns A promise that resolves to a Node.js `Readable` stream of the record's data.
         * @throws If the record data is not available in-memory and cannot be fetched.
         *
         * @beta
         */
        stream(): Promise<Readable>;
        /**
         * Attaches callbacks for the resolution and/or rejection of the `Promise` returned by
         * `stream()`.
         *
         * This method is a proxy to the `then` method of the `Promise` returned by `stream()`,
         * allowing for a seamless integration with promise-based workflows.
         * @param onFulfilled - A function to asynchronously execute when the `stream()` promise
         *                      becomes fulfilled.
         * @param onRejected - A function to asynchronously execute when the `stream()` promise
         *                     becomes rejected.
         * @returns A `Promise` for the completion of which ever callback is executed.
         */
        then(onFulfilled?: (value: Readable) => Readable | PromiseLike<Readable>, onRejected?: (reason: any) => PromiseLike<never>): any;
        /**
         * Attaches a rejection handler callback to the `Promise` returned by the `stream()` method.
         * This method is a shorthand for `.then(undefined, onRejected)`, specifically designed for handling
         * rejection cases in the promise chain initiated by accessing the record's data. It ensures that
         * errors during data retrieval or processing can be caught and handled appropriately.
         *
         * @param onRejected - A function to asynchronously execute when the `stream()` promise
         *                     becomes rejected.
         * @returns A `Promise` that resolves to the value of the callback if it is called, or to its
         *          original fulfillment value if the promise is instead fulfilled.
         */
        catch(onRejected?: (reason: any) => PromiseLike<never>): any;
    };
    /**
     * Stores the current record state as well as any initial write to the owner's DWN.
     *
     * @param importRecord - if true, the record will signed by the owner before storing it to the owner's DWN. Defaults to false.
     * @returns the status of the store request
     *
     * @beta
     */
    store(importRecord?: boolean): Promise<DwnResponseStatus>;
    /**
     * Signs the current record state as well as any initial write and optionally stores it to the owner's DWN.
     * This is useful when importing a record that was signed by someone else into your own DWN.
     *
     * @param store - if true, the record will be stored to the owner's DWN after signing. Defaults to true.
     * @returns the status of the import request
     *
     * @beta
     */
    import(store?: boolean): Promise<DwnResponseStatus>;
    /**
     * Send the current record to a remote DWN by specifying their DID
     * If no DID is specified, the target is assumed to be the owner (connectedDID).
     * If an initial write is present and the Record class send cache has no awareness of it, the initial write is sent first
     * (vs waiting for the regular DWN sync)
     *
     * @param target - the optional DID to send the record to, if none is set it is sent to the connectedDid
     * @returns the status of the send record request
     * @throws `Error` if the record has already been deleted.
     *
     * @beta
     */
    send(target?: string): Promise<DwnResponseStatus>;
    /**
     * Returns a JSON representation of the Record instance.
     * It's called by `JSON.stringify(...)` automatically.
     */
    toJSON(): RecordModel;
    /**
     * Convenience method to return the string representation of the Record instance.
     * Called automatically in string concatenation, String() type conversion, and template literals.
     */
    toString(): string;
    /**
     * Returns a pagination cursor for the current record given a sort order.
     *
     * @param sort the sort order to use for the pagination cursor.
     * @returns A promise that resolves to a pagination cursor for the current record.
     */
    paginationCursor(sort: DwnDateSort): Promise<DwnPaginationCursor | undefined>;
    /**
     * Update the current record on the DWN.
     * @param params - Parameters to update the record.
     * @returns the status of the update request
     * @throws `Error` if the record has already been deleted.
     *
     * @beta
     */
    update({ dateModified, data, ...params }: RecordUpdateParams): Promise<DwnResponseStatus>;
    /**
     * Delete the current record on the DWN.
     * @param params - Parameters to delete the record.
     * @returns the status of the delete request
     */
    delete(deleteParams?: RecordDeleteParams): Promise<DwnResponseStatus>;
    /**
     * Handles the various conditions around there being an initial write, whether to store initial/current state,
     * and whether to add an owner signature to the initial write to enable storage when protocol rules require it.
     */
    private processRecord;
    /**
     * Fetches the record's data from the specified DWN.
     *
     * This private method is called when the record data is not available in-memory
     * and needs to be fetched from either a local or a remote DWN.
     * It makes a read request to the specified DWN and processes the response to provide
     * a Node.js `Readable` stream of the record's data.
     *
     * @param params - Parameters for fetching the record's data.
     * @param params.target - The DID of the DWN to fetch the data from.
     * @param params.isRemote - Indicates whether the target DWN is a remote node.
     * @returns A Promise that resolves to a Node.js `Readable` stream of the record's data.
     * @throws If there is an error while fetching or processing the data from the DWN.
     *
     * @beta
     */
    private readRecordData;
    /**
     * Verifies if the properties to be mutated are mutable.
     *
     * This private method is used to ensure that only mutable properties of the `Record` instance
     * are being changed. It checks whether the properties specified for mutation are among the
     * set of properties that are allowed to be modified. If any of the properties to be mutated
     * are not in the set of mutable properties, the method throws an error.
     *
     * @param propertiesToMutate - An iterable of property names that are intended to be mutated.
     * @param mutableDescriptorProperties - A set of property names that are allowed to be mutated.
     *
     * @throws If any of the properties in `propertiesToMutate` are not in `mutableDescriptorProperties`.
     *
     * @beta
     */
    private static verifyPermittedMutation;
}
//# sourceMappingURL=record.d.ts.map