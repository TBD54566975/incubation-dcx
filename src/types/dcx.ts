import { VerifiableCredential } from "@web5/credentials";

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
