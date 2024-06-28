import { VcDataModel, VerifiableCredential } from '@web5/credentials';
import { Config } from '../core/config.js';

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
  vcs: VerifiableCredential[]
} | null;

export type DcxConfigType = InstanceType<typeof Config>;

export type ManifestOutputDescriptor = {
  id: string;
  name: string;
  schema: string;
};


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

export type ManifestFormat = {
  jwt_vc: { alg: string[] }
};
export type PresentationDefinition = {
  id: string;
  input_descriptors: InputDescriptor[];
};

export interface CredentialManifest extends AdditionalProperties {
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

// Issuer
export interface TrustedIssuer extends AdditionalProperties {
  name: string;
  id: string;
}
export class Issuer implements TrustedIssuer {
  constructor(public name: string, public id: string) { }
}
export type UseIssuers = Map<string | number | symbol, Issuer>;

// { [key: string | number | symbol]: Issuer; };

// Handler
export type HandlerFunction = (...args: any[]) => any | Promise<any>;
export class Handler {
  constructor(public handler: HandlerFunction) { }
  call(...args: any[]): any | Promise<any> {
    return this.handler(...args);
  }
}
export type UseHandlers = Map<string | number | symbol, Handler>
//  { [key: string | number | symbol]: Handler; };

// Provider
export interface VcDataProvider extends AdditionalProperties {
  name: string;
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
};
export class Provider implements VcDataProvider {
  constructor(public name: string, public endpoint: string, public method?: string, public headers?: Record<string, string>) { }
}
export type UseProviders = Map<string | number | symbol, Provider>
// { [key: string | number | symbol]: Provider; };

// Manifest
// export type Manifest = CredentialManifest;
export class Manifest implements CredentialManifest {
  constructor(public id: string, public name: string, public description: string, public spec_version: string, public issuer: ManifestIssuer, public output_descriptors: ManifestOutputDescriptor[], public format: ManifestFormat, public presentation_definition: PresentationDefinition) { }
}
export type UseManifests = Map<string | number | symbol, Manifest>
// { [key: string | number | symbol]: Manifest; }

export type UseOptions = {
  issuers?: UseIssuers;
  handlers?: UseHandlers;
  providers?: UseProviders;
  manifests?: UseManifests;
}

export type ServerOptions = {
  issuers?: UseIssuers;
  handlers?: UseHandlers;
  providers?: UseProviders;
  manifests?: UseManifests;
};

export type UseOption = Issuer | Handler | Manifest | Provider;