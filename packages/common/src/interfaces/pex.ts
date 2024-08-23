import {
  Format,
  TrustedIssuer,
  ManifestFormat,
  ManifestOutputDescriptor,
  PresentationDefinition,
  PresentationSubmission,
  VerifiableCredentialData
} from '../index.js';

/**
 * CredentialManifest implements DIF spec
 * For more details, see {@link https://identity.foundation/credential-manifest/#credential-manifest}
 */
export interface ICredentialManifest {
  id: string,
  name?: string,
  description?: string
  spec_version: string,
  issuer: TrustedIssuer,
  output_descriptors: ManifestOutputDescriptor[],
  format?: ManifestFormat,
  presentation_definition?: PresentationDefinition,
}
export class CredentialManifest implements ICredentialManifest{
  constructor(
    public id: string,
    public spec_version: string,
    public issuer: TrustedIssuer,
    public output_descriptors: ManifestOutputDescriptor[],
    public presentation_definition: PresentationDefinition,
    public name?: string,
    public format?: ManifestFormat,
    public description?: string,
  ) {}
}

export interface ICredentialApplication {
  id: string;
  spec_version: string;
  applicant: string;
  manifest_id: string;
  format: Format;
  presentation_submission: PresentationSubmission;
}
export class CredentialApplication implements ICredentialApplication {
  constructor(
      public id: string,
      public spec_version: string = 'https://identity.foundation/credential-manifest/#versioning',
      public applicant: string,
      public manifest_id: string,
      public format: Format,
      public presentation_submission: PresentationSubmission,
  ) {}
}

export class VerifiableCredential {
  constructor({
    vcJwts,
    id,
    format,
    path
  }: VerifiableCredentialData = {
    format : 'jwt_vc',
    path   : '$.verifiableCredential[0]'
  }) {

    return {
      verifiableCredential : vcJwts,
      fulfillment          : {
        descriptor_map : [
          {
            id,
            format,
            path,
          },
        ],
      },
    };
  }
}