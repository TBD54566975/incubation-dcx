import { DcxAgent } from './agent';
import { DcxSyncEngine } from './sync-engine';

export type SyncApiParams = {
  agent?: DcxAgent;
  syncEngine: DcxSyncEngine;
}

export class DcxAgentSyncApi implements DcxSyncEngine {
  /**
   * Holds the instance of a `Web5PlatformAgent` that represents the current execution context for
   * the `AgentSyncApi`. This agent is used to interact with other Web5 agent components. It's vital
   * to ensure this instance is set to correctly contextualize operations within the broader Web5
   * Agent framework.
   */
  private _agent?: DcxAgent;

  private _syncEngine: DcxSyncEngine;

  constructor({ agent, syncEngine }: SyncApiParams) {
    this._syncEngine = syncEngine;
    this._agent = agent;
  }

  /**
   * Retrieves the `Web5PlatformAgent` execution context.
   *
   * @returns The `Web5PlatformAgent` instance that represents the current execution context.
   * @throws Will throw an error if the `agent` instance property is undefined.
   */
  get agent(): DcxAgent {
    if (this._agent === undefined) {
      throw new Error('AgentSyncApi: Unable to determine agent execution context.');
    }

    return this._agent;
  }

  set agent(agent: DcxAgent) {
    this._agent = agent;
    this._syncEngine.agent = agent;
  }

  public async registerIdentity(params: { did: string; }): Promise<void> {
    await this._syncEngine.registerIdentity(params);
  }

  public startSync(params: { interval: string; }): Promise<void> {
    return this._syncEngine.startSync(params);
  }

  public stopSync(): void {
    this._syncEngine.stopSync();
  }

  public push(): Promise<void> {
    return this._syncEngine.push();
  }

  public pull(): Promise<void> {
    return this._syncEngine.pull();
  }

  public sync(params: {syncDirection: string } = {syncDirection: 'push'}): Promise<void> {
    return this._syncEngine.sync(params);
  }
}