import { Web5 } from "@web5/api";
import { VerifiableCredential } from "@web5/credentials";
import { Web5UserAgent } from "@web5/user-agent";
import { DcxServerConfig } from "../config/index.js";
import { manifestSchema } from "../protocol/index.js";

export type TrustedIssuer = { name: string, did: string };

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
    }
} & AdditionalProperties;

export type VcRequestBody = { validInputVcs: VerifiableCredential[] } | null;

export type DcxServerUse = {
    manifest?: string,
    config?: string | DcxServerConfig,
    [key: string]: any
}
export type DcxServerOptions = {
    web5: Web5;
    did: string;
    agent: Web5UserAgent;
    manifest: string;
    config: DcxServerConfig;
};

export type ManifestOutputDescriptor = {
    id: string;
    name: string;
    schema: string;
}
export type ManifestFormat = { jwt_vc: { alg: string[]; }; }
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
export type Manifest = {
    id: string;
    name: string;
    description: string;
    spec_version: string;
    issuer: ManifestIssuer;
    output_descriptors: ManifestOutputDescriptor[];
    format: ManifestFormat;
    presentation_definition: PresentationDefinition
}
export type DcxCredentialIssuerManifestSchema = typeof manifestSchema;