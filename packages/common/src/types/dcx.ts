import { DwnPaginationCursor, DwnResponseStatus } from '@web5/agent';
import { Record as DwnRecord } from '@web5/api';
import { PresentationDefinitionV2, VcDataModel, VerifiableCredential } from '@web5/credentials';
import { DcxConfig } from '../dcx-config';
import { DcxOptions } from './options';
import { CredentialApplication, CredentialManifest } from '../interfaces/dcx';

export type AdditionalProperties = Record<string, any>;

export type VerifiablePresentation = {
  id?: string;
  spec_version?: string;
  applicant?: string;
  manifest_id?: string;
  application_id?: string;
  response?: {
    id: string;
    path: string;
    format: string;
  };
  denial?: {
    reason: string;
  };
} & AdditionalProperties;

export type VcDataRequest = undefined | {
  vcs: VerifiableCredential[]
};

export type ManifestOutputDescriptor = {
  id: string;
  name: string;
  schema: string;
};

export type Filter = {
  type: string;
  pattern: string;
};

export type Field = {
  path: string[];
  filter?: Filter;
};

export type Constraint = {
  fields: Field[];
};

export type InputDescriptor = {
  id: string;
  purpose: string;
  constraints: Constraint;
};

export type ManifestFormat = {
  jwt_vc: { alg: string[] };
};
export type PresentationDefinition = {
  id: string;
  input_descriptors: InputDescriptor[];
};

export type VerifiedCredential = {
  issuer: string;
  subject: string;
  vc: VcDataModel;
};

export type PresentationExchangeParams = {
  vcJwts: string[];
  presentationDefinition: PresentationDefinitionV2
};

export type DcxApplicationRecordsCreateResponse = {
  record: DwnRecord;
  applicant: DwnResponseStatus;
  issuer: DwnResponseStatus;
}
export type Descriptor = {
  id: string;
  format: string;
  path: string;
};

export type PresentationSubmission = {
  id: string;
  definition_id: string;
  descriptor_map: Descriptor[];
};

export type Format = ManifestFormat;

export type VPCredentialApplication = {
  '@context': string[];
  type: string[];
  credential_application: CredentialApplication;
  verifiableCredential: VerifiableCredential[];
  presentation_submission: PresentationSubmission;
};

export type ValidateApplicationParams = {
  presentationDefinition: PresentationDefinitionV2;
  presentation: any
};

export type DcxValidated = {
  tag: string;
  status: string;
  message: string
};

export type ValidateVerifiablePresentationResponse = {
  areRequiredCredentialsPresent: 'info' | 'warn' | 'error';
  verifiableCredential: Array<any>;
};

export type CreateCredentialApplicationParams = { presentationSubmission: PresentationSubmission; manifestId: string; };

export type DcxParams = { options?: DcxOptions; config?: DcxConfig };
export type DcxProtocolPath = 'manifest' | 'application/response' | 'response';
export type IssuerProcessRecordParams = { record: DwnRecord, manifest: CredentialManifest, providerId?: string };
export type ApplicantProcessRecordParams = { pex: PresentationExchangeParams, recipient: string }
export type GetManifestsResponse = { manifests: CredentialManifest[] };
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
export type RecordsReadResponse = { records: any[] };
// TODO: define these types once needed
// Records[] - Update
export type RecordsUpdateParams = {};
export type RecordsUpdateResponse = {};
// Records[] - Delete
export type RecordsDeleteParams = {};
export type RecordsDeleteResponse = {};

// Records[] - Query
export type RecordsQueryParams = { from?: string; protocolPath?: DcxProtocolPath }
export type RecordsQueryResponse = DwnResponseStatus & { records: DwnRecord[]; cursor?: DwnPaginationCursor };

export interface DcxDwnRecord<T> extends DwnRecord {
  record: T;
  status: DwnResponseStatus;
}
// Records[] - Filter
export type RecordsFilterParams = { records: CredentialManifest[]; type: 'manifests'};
export type RecordsFilterResponse = { data: CredentialManifest[] };
