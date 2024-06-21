import { Web5PlatformAgent } from "@web5/agent";
import { Web5 } from "@web5/api";
import { BearerDid, PortableDid } from "@web5/dids";

export class Web5Manager {
    public static web5: Web5;
    public static agent: Web5PlatformAgent;
    public static did: string;
    public static bearerDid: BearerDid;
    public static portableDid: PortableDid;
} 