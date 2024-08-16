import {
  AdditionalProperties,
  Format,
  ManifestFormat,
  ManifestOutputDescriptor,
  PresentationDefinition,
  PresentationSubmission
} from '../index.js';

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

export interface DcxCredentialApplication {
    id: string;
    spec_version: string;
    applicant: string;
    manifest_id: string;
    format: Format;
    presentation_submission: PresentationSubmission;
  }
export class CredentialApplication implements DcxCredentialApplication {
  constructor(
      public id: string,
      public spec_version: string = 'https://identity.foundation/credential-manifest/#versioning',
      public applicant: string,
      public manifest_id: string,
      public format: Format,
      public presentation_submission: PresentationSubmission,
  ) {}
}