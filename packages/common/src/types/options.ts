import {
  AdditionalProperties,
  CredentialManifest,
  Issuer,
  ManifestFormat,
  ManifestOutputDescriptor,
  PresentationDefinition
} from '../index.js';

export type Handler = (...args: any[]) => any | Promise<any>;

// Handler
export type ServerHandler = {
    id: string;
    handler: Handler
};

// Provider
export interface Provider extends AdditionalProperties {
    id: string;
    endpoint: string;
    method?: string;
    headers?: Record<string, string>;
  }

export class ServerProvider implements Provider {
  [key: string]: any
  constructor(
      public id: string,
      public endpoint: string,
      public method?: string,
      public headers?: Record<string, string>,
  ) {}
}

// Manifest
export class ServerManifest implements CredentialManifest {
  [key: string]: any
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

export type DcxOptions = {
  manifests: CredentialManifest[];
  providers: Provider[];
  issuers: Issuer[];
  gateways: string[];
  dwns: string[];
  handlers: ServerHandler[];
};

export type ServerPath = 'manifests' | 'handlers' | 'providers' | 'issuers' | 'gateways' | 'dwns';
export type ServerOptions = DcxOptions;