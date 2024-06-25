import { VcDataModel, VerifiableCredential } from '@web5/credentials';
import { Config } from '../config.js';

export type TrustedIssuer = {
  name: string;
  did: string
};

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

export type VcDataRequest = {
  vaidSubmissionVcs: VerifiableCredential[]
} | null;

export type DcxConfigType = InstanceType<typeof Config>;



export type ManifestOutputDescriptor = {
  id: string;
  name: string;
  schema: string;
};

export type ManifestFormat = { jwt_vc: { alg: string[] } };

export type ManifestIssuer = {
  id: string;
  name: string;
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

export type PresentationDefinition = {
  id: string;
  input_descriptors: InputDescriptor[];
};

export interface CredentialManifest {
  id: string;
  name: string;
  description: string;
  spec_version: string;
  issuer: ManifestIssuer;
  output_descriptors: ManifestOutputDescriptor[];
  format: ManifestFormat;
  presentation_definition: PresentationDefinition;
};

export type VcVerification = {
  issuer: string;
  subject: string;
  vc: VcDataModel;
};