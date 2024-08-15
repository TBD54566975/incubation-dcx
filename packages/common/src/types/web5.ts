import { Web5PlatformAgent } from '@web5/agent';
import { Web5ConnectResult } from '@web5/api';
import { BearerDid } from '@web5/dids';

export type Web5ConnectResponse = Web5ConnectResult & {
  agent: Web5PlatformAgent;
  bearerDid: BearerDid;
};

export type CheckWeb5Response = { password: string; recoveryPhrase?: string }