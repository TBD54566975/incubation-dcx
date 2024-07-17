import { DcxAgent } from './agent';

export interface DcxSyncEngine {
  agent: DcxAgent;
  registerIdentity(params: { did: string }): Promise<void>;
  startSync(params: { interval: string }): Promise<void>;
  stopSync(): void;
  sync(params: { syncDirection: string }): Promise<void>;
  push(): Promise<void>;
  pull(): Promise<void>;
}