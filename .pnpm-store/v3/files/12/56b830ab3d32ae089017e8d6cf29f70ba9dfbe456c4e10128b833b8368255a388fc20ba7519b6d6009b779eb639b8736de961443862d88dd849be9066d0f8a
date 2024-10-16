import type { Web5Agent, DwnMessageParams, DwnResponseStatus, DwnPaginationCursor } from '@web5/agent';
import { DwnInterface } from '@web5/agent';
import { Record } from './record.js';
import { Protocol } from './protocol.js';
/**
 * Represents the request payload for configuring a protocol on a Decentralized Web Node (DWN).
 *
 * This request type is used to specify the configuration options for the protocol.
 */
export type ProtocolsConfigureRequest = {
    /** Configuration options for the protocol. */
    message: Omit<DwnMessageParams[DwnInterface.ProtocolsConfigure], 'signer'>;
};
/**
 * Encapsulates the response from a protocol configuration request to a Decentralized Web Node (DWN).
 *
 * This response type combines the general operation status with the details of the protocol that
 * was configured, if the operation was successful.
 *
 * @beta
 */
export type ProtocolsConfigureResponse = DwnResponseStatus & {
    /** The configured protocol, if successful. */
    protocol?: Protocol;
};
/**
 * Defines the request structure for querying protocols from a Decentralized Web Node (DWN).
 *
 * This request type is used to specify the target DWN from which protocols should be queried and
 * any additional query filters or options. If the `from` property is not provided, the query will
 * target the local DWN. If the `from` property is provided, the query will target the specified
 * remote DWN.
 */
export type ProtocolsQueryRequest = {
    /** Optional DID specifying the remote target DWN tenant to be queried. */
    from?: string;
    /** Query filters and options that influence the results returned. */
    message: Omit<DwnMessageParams[DwnInterface.ProtocolsQuery], 'signer'>;
};
/**
 * Wraps the response from a protocols query, including the operation status and the list of
 * protocols.
 */
export type ProtocolsQueryResponse = DwnResponseStatus & {
    /** Array of protocols matching the query. */
    protocols: Protocol[];
};
/**
 * Type alias for {@link RecordsWriteRequest}
 */
export type RecordsCreateRequest = RecordsWriteRequest;
/**
 * Type alias for {@link RecordsWriteResponse}
 */
export type RecordsCreateResponse = RecordsWriteResponse;
/**
 * Represents a request to create a new record based on an existing one.
 *
 * This request type allows specifying the new data for the record, along with any additional
 * message parameters required for the write operation.
 */
export type RecordsCreateFromRequest = {
    /** The DID of the entity authoring the record. */
    author: string;
    /** The new data for the record. */
    data: unknown;
    /** ptional additional parameters for the record write operation */
    message?: Omit<DwnMessageParams[DwnInterface.RecordsWrite], 'signer'>;
    /** The existing record instance that is being used as a basis for the new record. */
    record: Record;
};
/**
 * Defines a request to delete a record from the Decentralized Web Node (DWN).
 *
 * This request type optionally specifies the target from which the record should be deleted and the
 * message parameters for the delete operation. If the `from` property is not provided, the record
 * will be deleted from the local DWN.
 */
export type RecordsDeleteRequest = {
    /** Optional DID specifying the remote target DWN tenant the record will be deleted from. */
    from?: string;
    /** The parameters for the delete operation. */
    message: Omit<DwnMessageParams[DwnInterface.RecordsDelete], 'signer'>;
};
/**
 * Encapsulates a request to query records from a Decentralized Web Node (DWN).
 *
 * This request type is used to specify the criteria for querying records, including query
 * parameters, and optionally the target DWN to query from. If the `from` property is not provided,
 * the query will target the local DWN.
 */
export type RecordsQueryRequest = {
    /** Optional DID specifying the remote target DWN tenant to query from and return results. */
    from?: string;
    /** The parameters for the query operation, detailing the criteria for selecting records. */
    message: Omit<DwnMessageParams[DwnInterface.RecordsQuery], 'signer'>;
};
/**
 * Represents the response from a records query operation, including status, records, and an
 * optional pagination cursor.
 */
export type RecordsQueryResponse = DwnResponseStatus & {
    /** Array of records matching the query. */
    records?: Record[];
    /** If there are additional results, the messageCid of the last record will be returned as a pagination cursor. */
    cursor?: DwnPaginationCursor;
};
/**
 * Represents a request to read a specific record from a Decentralized Web Node (DWN).
 *
 * This request type is used to specify the target DWN from which the record should be read and any
 * additional parameters for the read operation. It's useful for fetching the details of a single
 * record by its identifier or other criteria.
 */
export type RecordsReadRequest = {
    /** Optional DID specifying the remote target DWN tenant the record will be read from. */
    from?: string;
    /** The parameters for the read operation, detailing the criteria for selecting the record. */
    message: Omit<DwnMessageParams[DwnInterface.RecordsRead], 'signer'>;
};
/**
 * Encapsulates the response from a record read operation, combining the general operation status
 * with the specific record that was retrieved.
 */
export type RecordsReadResponse = DwnResponseStatus & {
    /** The record retrieved by the read operation. */
    record: Record;
};
/**
 * Defines a request to write (create) a record to a Decentralized Web Node (DWN).
 *
 * This request type allows specifying the data for the new or updated record, along with any
 * additional message parameters required for the write operation, and an optional flag to indicate
 * whether the record should be immediately stored.
 *
 * @param data -
 * @param message - , excluding the signer.
 * @param store -
 */
export type RecordsWriteRequest = {
    /** The data payload for the record, which can be of any type. */
    data: unknown;
    /** Optional additional parameters for the record write operation. */
    message?: Omit<Partial<DwnMessageParams[DwnInterface.RecordsWrite]>, 'signer'>;
    /**
     * Optional flag indicating whether the record should be immediately stored. If true, the record
     * is persisted in the DWN as part of the write operation. If false, the record is created,
     * signed, and returned but not persisted.
     */
    store?: boolean;
};
/**
 * Encapsulates the response from a record write operation to a Decentralized Web Node (DWN).
 *
 * This request type combines the general operation status with the details of the record that was
 * written, if the operation was successful.
 *
 * The response includes a status object that contains the HTTP-like status code and detail message
 * indicating the success or failure of the write operation. If the operation was successful and a
 * record was created or updated, the `record` property will contain an instance of the `Record`
 * class representing the written record. This allows the caller to access the written record's
 * details and perform additional operations using the provided {@link Record} instance methods.
 */
export type RecordsWriteResponse = DwnResponseStatus & {
    /**
     * The `Record` instance representing the record that was successfully written to the
     * DWN as a result of the write operation.
     */
    record?: Record;
};
/**
 * Interface to interact with DWN Records and Protocols
 */
export declare class DwnApi {
    /**
     * Holds the instance of a {@link Web5Agent} that represents the current execution context for
     * the `DwnApi`. This agent is used to process DWN requests.
     */
    private agent;
    /** The DID of the DWN tenant under which operations are being performed. */
    private connectedDid;
    constructor(options: {
        agent: Web5Agent;
        connectedDid: string;
    });
    /**
     * API to interact with DWN protocols (e.g., `dwn.protocols.configure()`).
     */
    get protocols(): {
        /**
         * Configure method, used to setup a new protocol (or update) with the passed definitions
         */
        configure: (request: ProtocolsConfigureRequest) => Promise<ProtocolsConfigureResponse>;
        /**
         * Query the available protocols
         */
        query: (request: ProtocolsQueryRequest) => Promise<ProtocolsQueryResponse>;
    };
    /**
     * API to interact with DWN records (e.g., `dwn.records.create()`).
     */
    get records(): {
        /**
         * Alias for the `write` method
         */
        create: (request: RecordsCreateRequest) => Promise<RecordsCreateResponse>;
        /**
         * Write a record based on an existing one (useful for updating an existing record)
         */
        createFrom: (request: RecordsCreateFromRequest) => Promise<RecordsWriteResponse>;
        /**
         * Delete a record
         */
        delete: (request: RecordsDeleteRequest) => Promise<DwnResponseStatus>;
        /**
         * Query a single or multiple records based on the given filter
         */
        query: (request: RecordsQueryRequest) => Promise<RecordsQueryResponse>;
        /**
         * Read a single record based on the given filter
         */
        read: (request: RecordsReadRequest) => Promise<RecordsReadResponse>;
        /**
         * Writes a record to the DWN
         *
         * As a convenience, the Record instance returned will cache a copy of the data.  This is done
         * to maintain consistency with other DWN methods, like RecordsQuery, that include relatively
         * small data payloads when returning RecordsWrite message properties. Regardless of data
         * size, methods such as `record.data.stream()` will return the data when called even if it
         * requires fetching from the DWN datastore.
         */
        write: (request: RecordsWriteRequest) => Promise<RecordsWriteResponse>;
    };
}
//# sourceMappingURL=dwn-api.d.ts.map