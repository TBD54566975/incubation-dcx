import { TrustedIssuer } from '../index.js';
/**
 * CredentialManifest implements DIF spec
 * For more details, see {@link https://identity.foundation/credential-manifest/#credential-manifest}
 */
export type Format = { jwt: { alg: string[] }; };
export type Filter = { type: string; pattern: string; };
export type Field = { path: string[]; filter?: Filter; };
export type Constraint = { fields: Field[]; };
export type OutputDescriptor = { id: string; name: string; schema: string; };
export type InputDescriptor = { id: string; purpose: string; constraints: Constraint; };
export type PresentationDefinition = { id: string; input_descriptors: InputDescriptor[]; };
export interface CredentialManifest {
  id: string,
  name?: string,
  description?: string
  spec_version: string,
  issuer: TrustedIssuer,
  output_descriptors: OutputDescriptor[],
  format: Format
  presentation_definition: PresentationDefinition
}
// export class CredentialManifest {
//   constructor(public credentialManifestModel: CredentialManifestModel) {}
// }
export interface VPCredentialManifest {
  '@context': string[];
  type: string[];
  credential_manifest: CredentialManifest;
  verifiableCredential: string[];
}

/**
 * CredentialApplication implements DIF spec
 * For more details, see {@link https://identity.foundation/credential-manifest/#credential-application}
 */
export type Descriptor = { id: string; format: string; path: string; };
export type PresentationSubmission = {
  id: string;
  definition_id: string;
  descriptor_map: Descriptor[];
};
export interface CredentialApplication {
  id: string;
  spec_version: string;
  applicant: string;
  manifest_id: string;
  format: Format;
  presentation_submission: PresentationSubmission;
}
// export class CredentialApplication {
//   constructor(public credentialApplicationModel: CredentialApplicationModel) {}
// }
export interface VPCredentialApplication {
  '@context': string[];
  type: string[];
  credential_application: CredentialApplication;
  verifiableCredential: string[];
}

/**
 * CredentialResponse implements DIF spec
 * For more details, see {@link https://identity.foundation/credential-manifest/#credential-response}
 */
export type Fulfillment = { descriptor_map: Descriptor[]; };
export interface CredentialResponse {
  id: string;
  spec_version: string;
  manifest_id: string;
  applicant: string;
  application_id?: string;
  fulfillment?: { descriptor_map: Descriptor[]; };
  denial?: { reason: string; input_descriptors: string[] };
}
// export class CredentialResponse {
//   constructor(public credentialResponseModel: CredentialResponseModel) {}
// }
export interface VPCredentialResponse {
  '@context': string[];
  type: string[];
  credential_response: CredentialResponse;
  verifiableCredential: string[];
}
// export class VPCredentialResponse {
//   constructor(public vpCredentialResponseModel: VPCredentialResponseModel) {}
// }