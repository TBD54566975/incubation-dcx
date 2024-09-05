import { DwnPaginationCursor, DwnResponseStatus } from '@web5/agent';
import { Record as DwnRecord } from '@web5/api';
import { CredentialApplication, CredentialManifest, DcxProtocolPath } from '../index.js';

/**
 * Params & Response types for performing CRUD operations on a list of Records and a single Record
 *
 * Generic
 *   For performing CRUD operations (inclusive) on a list of records or a single record
 *
 * Specific
 *   For performing specifc a CRUD operation (exclusive) on a list of records or a single record
 *
 */
// TODO: define CredentialResponse and CredentialInvoice types
export type DwnStatus = { code: number; detail: string; }
export type DcxDwnResponseStatus = { status?: { issuer?: DwnStatus; applicant?: DwnStatus; }}
export type RecordsDataResponse = { data: CredentialManifest[] | CredentialApplication[] | any[] };

// Record - CRUD
export type RecordParams = { record: DwnRecord };
export type RecordResponse = { record: DwnRecord };
// Record - Create
export type RecordCreateParams = { data: any; protocolPath?: DcxProtocolPath; schema: string };
export type RecordCreateResponse = RecordResponse;
// Record - Read
export type RecordReadParams = RecordParams;
export type RecordReadResponse = { records: any[] };
// TODO: define these types once needed
// Record - Update
export type RecordUpdateParams = {};
export type RecordUpdateResponse = {};
// Record - Delete
export type RecordDeleteParams = {};
export type RecordDeleteResponse = {};

// Records[] - CRUD
export type RecordsParams = { records: DwnRecord[] };
export type RecordsResponse = { records: DwnRecord[] };
// Records[] - Create
export type RecordsCreateParams = { data: any[]; protocolPath?: DcxProtocolPath; schema: string };
export type RecordsCreateResponse = RecordsResponse;
// Records[] - Read
export type RecordsReadParams = RecordsParams;
export type RecordsReadResponse = { reads: any[] };
// TODO: define these types once needed
// Records[] - Update
export type RecordsUpdateParams = {};
export type RecordsUpdateResponse = {};
// Records[] - Delete
export type RecordsDeleteParams = {};
export type RecordsDeleteResponse = {};

// Records[] - Query
export type RecordsQueryParams = { from?: string; protocolPath?: DcxProtocolPath; schema?: {}; options?: any };
export type RecordsQueryResponse = DwnResponseStatus & { records: DwnRecord[]; cursor?: DwnPaginationCursor };

// Records[] - Filter
export type RecordsFilterParams = { records: CredentialManifest[]; type: 'manifests'};
export type RecordsFilterResponse = { data: CredentialManifest[] };
