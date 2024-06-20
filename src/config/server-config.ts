import { Web5PlatformAgent } from "@web5/agent";
import { Web5 } from "@web5/api";
import { PortableDid, BearerDid } from "@web5/dids";
import { CredentialManifest } from "../types/dcx.js";
import { DidManager } from "../utils/did-manager.js";
import { DcxEnvConfig, dcxEnvConfig } from "./env-config.js";

export type DcxServerOptions = {
    needWeb5Init: boolean;
    dcxEnvConfig?: DcxEnvConfig;
    credentialManifests?: CredentialManifest[];
};

export type DcxServerConfigType = typeof dcxEnvConfig;

export class DcxServerConfig extends DcxEnvConfig {
    public isInitialized: boolean;

    public needWeb5Init: boolean;
    public credentialManifests: CredentialManifest[];
    public dcxEnvConfig: DcxEnvConfig;

    public web5: Web5;
    public didManager: DidManager;
    public platformAgent: Web5PlatformAgent;

    constructor(options: DcxServerOptions) {
        super();

        this.isInitialized = false;

        this.dcxEnvConfig = options.dcxEnvConfig ?? dcxEnvConfig;
        this.credentialManifests = options.credentialManifests ?? [];
        this.needWeb5Init = options.needWeb5Init ?? true;

        this.web5 = {} as Web5;
        this.platformAgent = {} as Web5PlatformAgent;
        this.didManager = new DidManager({ did: '', portableDid: {} as PortableDid, bearerDid: {} as BearerDid });
    }
}