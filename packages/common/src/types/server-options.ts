import {
  AdditionalProperties,
  CredentialManifest,
  Issuer,
  ManifestFormat,
  ManifestOutputDescriptor,
  PresentationDefinition
} from './dcx';

// Handler
export type Handler = {
    id: string;
    callback: (...args: any[]) => any | Promise<any>
};

// Provider
export interface DataProvider extends AdditionalProperties {
    id: string;
    endpoint: string;
    method?: string;
    headers?: Record<string, string>;
  }

export class Provider implements DataProvider {
  constructor(
      public id: string,
      public endpoint: string,
      public method?: string,
      public headers?: Record<string, string>,
  ) {}
}

// Manifest
export class Manifest implements CredentialManifest {
  constructor(
      public id: string,
      public name: string,
      public description: string,
      public spec_version: string,
      public issuer: Issuer,
      public output_descriptors: ManifestOutputDescriptor[],
      public format: ManifestFormat,
      public presentation_definition: PresentationDefinition,
  ) {}
}

export type UseIssuers = Issuer[];
export type UseManifests = Manifest[];
export type UseProviders = Provider[];
export type UseHandlers = Handler[];
export type UseGateways = string[];
export type UseDwns = string[];

export type UseOption =
  | UseIssuers
  | UseHandlers
  | UseProviders
  | UseManifests
  | UseGateways
  | UseDwns;

export type UseOptions = {
  manifests?: Manifest[];
  providers?: Provider[];
  issuers?: Issuer[];
  gateways?: string[];
  dwns?: string[];
  handlers?: Handler[];
};
