import {
  AgentCryptoApi,
  AgentDidApi,
  AgentDwnApi,
  AgentIdentityApi,
  AgentKeyManager,
  AgentPermissionsApi,
  AgentSyncApi,
  DidInterface,
  DidRequest,
  DidResponse,
  DwnDidStore,
  DwnIdentityStore,
  DwnInterface,
  DwnKeyStore,
  DwnResponse,
  LocalKeyManager,
  ProcessDwnRequest,
  ProcessVcRequest,
  SendDwnRequest,
  SendVcRequest,
  SyncEngineLevel,
  VcResponse,
  Web5PlatformAgent,
  Web5Rpc,
  Web5RpcClient,
} from '@web5/agent';
import { LevelStore } from '@web5/common';
import { BearerDid, DidDht, DidJwk, DidResolverCacheLevel } from '@web5/dids';
import { AgentInitializeParams } from '@web5/user-agent';
import { DcxIdentityVault } from './index.js';

export type DcxAgentInitializeParams = {
  /**
   * The password used to secure the Agent vault.
   *
   * The password selected should be strong and securely managed to prevent unauthorized access.
   */
  password: string;

  /**
   * An optional recovery phrase used to deterministically generate the cryptographic keys for the
   * Agent vault.
   *
   * Supplying this phrase enables the vault's contents to be restored or replicated across devices.
   * If omitted, a new phrase is generated, which should be securely recorded for future recovery needs.
   */
  recoveryPhrase?: string;

  dwnEndpoints: string[];
};

export type DcxAgentStartParams = {
  /**
   * The password used to unlock the previously initialized Agent vault.
   */
  password: string;
 }

export type DcxAgentParams<TKeyManager extends AgentKeyManager = LocalKeyManager> = {
  /** Optional. The Decentralized Identifier (DID) representing this Web5 User Agent. */
  agentDid?: BearerDid;
  /** Encrypted vault used for managing the Agent's DID and associated keys. */
  agentVault: DcxIdentityVault;
  /** Provides cryptographic capabilties like signing, encryption, hashing and key derivation. */
  cryptoApi: AgentCryptoApi;
  /** Specifies the local path to be used by the Agent's persistent data stores. */
  dataPath?: string;
  /** Facilitates DID operations including create, update, and resolve. */
  didApi: AgentDidApi<TKeyManager>;
  /** Facilitates DWN operations including processing and sending requests. */
  dwnApi: AgentDwnApi;
  /** Facilitates decentralized Identity operations including create, import, and export. */
  identityApi: AgentIdentityApi<TKeyManager>;
  /** Responsible for securely managing the cryptographic keys of the agent. */
  keyManager: TKeyManager;
  /** Facilitates fetching, requesting, creating, revoking and validating revocation status of permissions */
  permissionsApi: AgentPermissionsApi;
  /** Remote procedure call (RPC) client used to communicate with other Web5 services. */
  rpcClient: Web5Rpc;
  /** Facilitates data synchronization of DWN records between nodes. */
  syncApi: AgentSyncApi;
};

export class DcxAgent<TKeyManager extends AgentKeyManager = LocalKeyManager> implements Web5PlatformAgent<TKeyManager> {
  public crypto: AgentCryptoApi;
  public did: AgentDidApi<TKeyManager>;
  public dwn: AgentDwnApi;
  public identity: AgentIdentityApi<TKeyManager>;
  public keyManager: TKeyManager;
  public permissions: AgentPermissionsApi;
  public rpc: Web5Rpc;
  public sync: AgentSyncApi;
  public vault: DcxIdentityVault;

  private _agentDid?: BearerDid;

  constructor(params: DcxAgentParams<TKeyManager>) {
    this._agentDid = params.agentDid;
    this.crypto = params.cryptoApi;
    this.did = params.didApi;
    this.dwn = params.dwnApi;
    this.identity = params.identityApi;
    this.keyManager = params.keyManager;
    this.permissions = params.permissionsApi;
    this.rpc = params.rpcClient;
    this.sync = params.syncApi;
    this.vault = params.agentVault;

    // Set this agent to be the default agent.
    this.did.agent = this;
    this.dwn.agent = this;
    this.identity.agent = this;
    this.keyManager.agent = this;
    this.permissions.agent = this;
    this.sync.agent = this;
  }

  get agentDid(): BearerDid {
    if (this._agentDid === undefined) {
      throw new Error(
        'DcxAgent: The "agentDid" property is not set. Ensure the agent is properly ' +
          'initialized and a DID is assigned.',
      );
    }
    return this._agentDid;
  }

  set agentDid(did: BearerDid) {
    this._agentDid = did;
  }

  /**
   * If any of the required agent components are not provided, instantiate default implementations.
   */
  public static async create({
    dataPath = 'DATA/DCX/AGENT',
    agentDid, agentVault, cryptoApi, didApi, dwnApi, identityApi, keyManager, permissionsApi, rpcClient, syncApi
  }: Partial<DcxAgentParams> = {}
  ): Promise<DcxAgent> {

    agentVault ??= new DcxIdentityVault({
      keyDerivationWorkFactor : 210_000,
      store                   : new LevelStore<string, string>({ location: `${dataPath}/VAULT_STORE` }),
    });

    cryptoApi ??= new AgentCryptoApi();

    didApi ??= new AgentDidApi({
      didMethods    : [DidDht, DidJwk],
      resolverCache : new DidResolverCacheLevel({ location: `${dataPath}/DID_RESOLVERCACHE` }),
      store         : new DwnDidStore(),
    });

    dwnApi ??= new AgentDwnApi({
      dwn : await AgentDwnApi.createDwn({ dataPath, didResolver: didApi }),
    });

    identityApi ??= new AgentIdentityApi({ store: new DwnIdentityStore() });

    keyManager ??= new LocalKeyManager({ keyStore: new DwnKeyStore() });

    rpcClient ??= new Web5RpcClient();

    permissionsApi ??= new AgentPermissionsApi();

    syncApi ??= new AgentSyncApi({ syncEngine: new SyncEngineLevel({ dataPath }) });

    // Instantiate the Agent using the provided or default components.
    return new DcxAgent({
      agentDid,
      agentVault,
      cryptoApi,
      didApi,
      dwnApi,
      keyManager,
      permissionsApi,
      identityApi,
      rpcClient,
      syncApi,
    });
  }

  public async firstLaunch(): Promise<boolean> {
    // Check whether data vault is already initialize
    return (await this.vault.isInitialized()) === false;
  }

  /**
   * Initializes the User Agent with a password, and optionally a recovery phrase.
   *
   * This method is typically called once, the first time the Agent is launched, and is responsible
   * for setting up the agent's operational environment, cryptographic key material, and readiness
   * for processing Web5 requests.
   *
   * The password is used to secure the Agent vault, and the recovery phrase is used to derive the
   * cryptographic keys for the vault. If a recovery phrase is not provided, a new recovery phrase
   * will be generated and returned. The password should be chosen and entered by the end-user.
   */
  public async initialize({
    password,
    recoveryPhrase,
    dwnEndpoints,
  }: DcxAgentInitializeParams): Promise<string> {
    // Initialize the Agent vault.
    recoveryPhrase = await this.vault.initialize({ password, recoveryPhrase, dwnEndpoints });

    return recoveryPhrase;
  }

  async processDidRequest<T extends DidInterface>(request: DidRequest<T>): Promise<DidResponse<T>> {
    return this.did.processRequest(request);
  }

  public async processDwnRequest<T extends DwnInterface>(
    request: ProcessDwnRequest<T>,
  ): Promise<DwnResponse<T>> {
    return this.dwn.processRequest(request);
  }

  public async processVcRequest(_request: ProcessVcRequest): Promise<VcResponse> {
    throw new Error('Not implemented');
  }

  public async sendDidRequest<T extends DidInterface>(
    _request: DidRequest<T>,
  ): Promise<DidResponse<T>> {
    throw new Error('Not implemented');
  }

  public async sendDwnRequest<T extends DwnInterface>(
    request: SendDwnRequest<T>,
  ): Promise<DwnResponse<T>> {
    return this.dwn.sendRequest(request);
  }

  public async sendVcRequest(_request: SendVcRequest): Promise<VcResponse> {
    throw new Error('Not implemented');
  }

  public async start({ password }: AgentInitializeParams): Promise<void> {
    // If the Agent vault is locked, unlock it.
    if (this.vault.isLocked()) {
      await this.vault.unlock({ password });
    }

    // Set the Agent's DID.
    this.agentDid = await this.vault.getDid();
  }
}