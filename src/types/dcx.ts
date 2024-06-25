import { VcDataModel, VerifiableCredential } from '@web5/credentials';
import { Config } from '../config.js';

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

export type TrustedIssuer = {
  name: string;
  did: string
};

export type Provider = {
  name: string;
  endpoint: string;
  vc: {
    id: string;
    name: string;
  }
};

export type Handler =
  | ((...args: any[]) => any)
  | ((...args: any[]) => Promise<any>);

export type ServerOptionHandlers = {
  [key: string | number | symbol]: Handler
};

export type ServerOptionProviders = {
  [key: string | number | symbol]: Provider
};

export type ServerOptionManifests = {
  [key: string | number | symbol]: CredentialManifest | any;
  get?(name: string): CredentialManifest | undefined;
};

export type ServerOptionIssuers = {
  [key: string | number | symbol]: TrustedIssuer
};

export type ServerOptions = {
  handlers?: ServerOptionHandlers;
  providers?: ServerOptionProviders;
  manifests?: ServerOptionManifests;
  issuers?: ServerOptionIssuers;
};
