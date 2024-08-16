import { DwnPaginationCursor, DwnResponseStatus } from '@web5/agent';
import { Record as DwnRecord } from '@web5/api';
import { DcxConfig } from '../dcx-config';

import { PresentationDefinitionV2, VcDataModel, VerifiableCredential } from '@web5/credentials';
import { DcxOptions } from './options';

import { PresentationSubmission, IPresentation, ICredentialContextType, W3CVerifiableCredential } from '@sphereon/ssi-types';

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

/**
 * Issuer interface defines objects passed into server.useOptions.issuers
 * DCX issuers are entities that issue credentials to applicants prior to an application submission.
 * These issuers are 3rd party data validators that sign VCs and provide them to applicants.
 * The list of trusted issuers within DCX should be list of entities that are trusted to issue the VCs
 * that are defined in the CredentialManifest.presentation_definition.input_descriptors section as inputs to the DCX.
 * See more details at {@link https://identity.foundation/credential-manifest/#input-evaluation}
 */
export interface Issuer extends AdditionalProperties {
  name: string;
  id: string;
}

/**
 * CredentialManifest implements DIF spec
 * See more details at {@link https://identity.foundation/credential-manifest/#credential-manifest}
 */
export interface CredentialManifest extends AdditionalProperties {
  id: string;
  name: string;
  description: string;
  spec_version: string;
  issuer: Issuer;
  output_descriptors: ManifestOutputDescriptor[];
  format: ManifestFormat;
  presentation_definition: PresentationDefinition;
}

export type VerifiedCredential = {
  issuer: string;
  subject: string;
  vc: VcDataModel;
};

export type PresentationExchangeParams = {
  vcJwts: string[];
  presentationDefinition: PresentationDefinitionV2
};

// TODO: Define CredentialApplication type
export type DcxCreateApplicationRecordParams = {
  vcJwts: string[];
  presentationDefinition: PresentationDefinitionV2;
  applicationRecord: CredentialApplication;
  recipient?: string,
  manifestRecord?: CredentialManifest
};
export type DcxApplicationRecordsCreateResponse = {
  record: DwnRecord;
  applicant: DwnResponseStatus;
  issuer: DwnResponseStatus;
}
export type DescriptorMapItem = {
  id: string;
  format: string;
  path: string;
};
export type DcxApplicantPresentationSubmission = {
  id: string;
  definition_id: string;
  descriptor_map: DescriptorMapItem[];
};
export type Format = ManifestFormat;
export interface CredentialApplication {
  id: string;
  spec_version: string;
  applicant: string;
  manifest_id: string;
  format: Format;
  presentation_submission: DcxApplicantPresentationSubmission;
}
export class DcxPresentationSubmission implements PresentationSubmission {
  constructor(
    public id: string,
    public definition_id: string,
    public descriptor_map: DescriptorMapItem[],
  ) {}
}


export class DcxPresentation implements IPresentation {
  id?: string;
  '@context': ICredentialContextType | ICredentialContextType[];
  type?: string | string[];
  verifiableCredential?: W3CVerifiableCredential[];
  presentation_submission?: PresentationSubmission;
  holder?: string;
  verifier?: string;
  [x: string]: any;

  constructor(
    context: ICredentialContextType | ICredentialContextType[],  // Use 'context' as an alias
    id?: string,
    type?: string | string[],
    verifiableCredential?: W3CVerifiableCredential[],
    presentation_submission?: PresentationSubmission,
    holder?: string,
    verifier?: string,
    issuanceDate?: string,
    expirationDate?: string,
    proof?: any
  ) {
    this['@context'] = context;  // Assign 'context' to '@context'
    this.id = id;
    this.type = type;
    this.verifiableCredential = verifiableCredential;
    this.presentation_submission = presentation_submission;
    this.holder = holder;
    this.verifier = verifier;
    this.issuanceDate = issuanceDate;
    this.expirationDate = expirationDate;
    this.proof = proof;
  }
}
export type DcxIssuerProcessRecordParams = { record: DwnRecord, manifest: CredentialManifest, providerId?: string };
export type DcxApplicantProcessRecordParams = { pex: PresentationExchangeParams, recipient: string }
export type DcxRecordsQueryResponse = DwnResponseStatus & { records: DwnRecord[]; cursor?: DwnPaginationCursor };
export type DcxRecordsReadParams = { records: CredentialManifest[] | any[] };
export type DcxRecordsCreateResponse = DcxRecordsReadParams;
export type DcxRecordsFilterResponse = DcxRecordsReadParams;
export type DcxRecordsReadResponse = DcxRecordsReadParams;
export type RecordsParams = { records: DwnRecord[] };
export type ManifestParams = { records: CredentialManifest[] };
export type DcxProtocolPath = 'manifest' | 'application/response' | 'response';
export type DcxQueryRecordsParams = { from?: string } & { protocolPath?: DcxProtocolPath }
export type DcxParams = {
    options?: DcxOptions;
    config?: DcxConfig & { [key: string]: any };
};
