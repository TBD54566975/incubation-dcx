import { Web5 } from "@web5/api";
import { VerifiableCredential } from "@web5/credentials";
import { Web5UserAgent } from "@web5/user-agent";
import { DcxServerConfig } from "../config/index.js";

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