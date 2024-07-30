import {
  CredentialManifest,
  DcxAgent,
  DcxIdentityVault,
  DcxServerError,
  FileSystem,
  Issuer,
  Logger,
  Mnemonic,
  Objects,
  Provider,
  ServerHandler,
  ServerOptions,
  stringifier,
  Time
} from '@dcx-protocol/common';
import { Record, Web5 } from '@web5/api';
import { argv, exit } from 'process';
import { applicantConfig, ApplicantConfig } from './config.js';
import { ApplicantHandlers } from './handlers.js';
import { applicant } from './index.js';
import { ApplicantManager } from './manager.js';

type UsePath = 'manifests' | 'handlers' | 'providers' | 'issuers' | 'gateways' | 'dwns';
type ApplicantServerParams = { options?: ServerOptions; config?: ApplicantConfig };

export class ApplicantServer {
  config: ApplicantConfig;
  useOptions: ServerOptions;

  _isSetup       : boolean = false;
  _isPolling     : boolean = false;
  _isInitialized : boolean = false;
  _isTest        : boolean = applicantConfig.DCX_ENV.includes('test') || argv.slice(2).some((arg) => ['--test', '-t'].includes(arg));

  constructor(params: ApplicantServerParams = {}) {
    /**
     *
     * Setup the DcxManager and the DcxServer with the provided options
     *
     * @param params.options The options to use for the DcxServer
     * @param params.options.issuers The issuers to use; array
     * @param params.options.manifests The manifests to use; array
     * @param params.options.providers The providers to use; array
     * @param params.options.handlers The handlers to use; array
     * @param params.options.dwns The dwns to use; array
     * @param params.options.gateways The gateways to use; array
     * @example see README.md for usage information
     *
     */
    this.config = params.config ?? applicantConfig;
    this.useOptions = params.options ?? {
      handlers  : [],
      providers : [],
      manifests : [this.config.DCX_HANDSHAKE_MANIFEST],
      issuers   : this.config.DCX_INPUT_ISSUERS,
      gateways  : this.config.gatewayUris,
      dwns      : this.config.dwnEndpoints,
    };
  }

  public static create(): ApplicantServer {
    const newApplicantServer = new ApplicantServer();
    return newApplicantServer;
  }

  public static async createInit(): Promise<ApplicantServer> {
    const newApplicantServer = ApplicantServer.create();
    await newApplicantServer.initialize();
    return newApplicantServer;
  }

  /**
   *
   * Sets the server options
   *
   * @param path The type of server option; must be one of 'handler', 'providers', 'manifest', or 'issuer'
   * @param id Some unique, accessible identifier to map the obj to
   * @param obj The object to use; see {@link UseOption}
   * @example see README.md for usage information
   *
   */
  public use(path: UsePath, obj: any): void {
    const validPaths = ['gateways', 'dwns', 'issuers', 'manifests', 'providers', 'handlers'];
    if (!validPaths.includes(path)) {
      throw new DcxServerError(
        `Invalid server.use() name: ${path}. Must be one of: ${validPaths.join(', ')}`,
      );
    }

    if (validPaths.includes(path)) {
      this.useOptions[path]!.push(obj);
    } else {
      throw new DcxServerError(`Invalid server.use() object: ${obj}`);
    }
  }

  /**
   *
   * Sets the manifest to use
   *
   * @param id Some unique, accessible identifier for the manifest
   * @param manifest The credential manifest to use
   * @example see README.md for usage information
   *
   */
  public useManifest(manifest: CredentialManifest): void {
    this.useOptions.manifests!.push(manifest);
  }

  /**
   *
   * Sets the handler to use
   *
   * @param id Some unique, accessible identifier for the handler
   * @param handler The handler to use
   * @example see README.md for usage information
   *
   */
  public useHandler(handler: ServerHandler): void {
    this.useOptions.handlers!.push(handler);
  }

  /**
   *
   * Sets the provider to use
   *
   * @param id Some unique, accessible identifier for the provider
   * @param provider The provider to use
   * @example see README.md for usage information
   *
   */
  public useProvider(provider: Provider): void {
    this.useOptions.providers!.push(provider);
  }

  /**
   *
   * Sets the issuer to use
   *
   * @param id Some unique, accessible identifier for the issuer
   * @param issuer The issuer to use
   * @example see README.md for usage information
   *
   */
  public useIssuer(issuer: Issuer): void {
    this.useOptions.issuers!.push(issuer);
  }

  /**
   *
   * Sets the dwns to use
   *
   * @param dwn The dwn to use
   * @example see README.md for usage information
   *
   */
  public useDwn(dwn: string): void {
    this.useOptions.dwns!.push(dwn);
  }

  /**
   *
   * Sets the gateways to use
   *
   * @param gateway The gateway to use'
   * @example see README.md for usage information
   *
   */
  public useGateway(gateway: string): void {
    this.useOptions.gateways!.push(gateway);
  }

  /**
   *
   * Checks the state of the password and recovery phrase
   *
   * @param firstLaunch A boolean indicating if this is the first launch of the agent
   * @returns { password: string, recoveryPhrase?: string }
   * @throws DcxServerError
   *
   */
  public async checkWeb5Config(
    firstLaunch: boolean,
  ): Promise<{ password: string; recoveryPhrase?: string }> {
    const web5Password = this.config.web5Password;
    const web5RecoveryPhrase = this.config.web5RecoveryPhrase;

    // TODO: consider generating a new recovery phrase if one is not provided
    // this.config.APPLICANT_WEB5_RECOVERY_PHRASE = Mnemonic.createRecoveryPhrase();

    if (firstLaunch && !web5Password && !web5RecoveryPhrase) {
      Logger.security(
        'APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE not found on first launch! ' +
        'New APPLICANT_WEB5_PASSWORD saved to password.applicant.key file. ' +
        'New APPLICANT_WEB5_RECOVERY_PHRASE saved to recovery.applicant.key file.',
      );
      const password = Mnemonic.createPassword();
      await FileSystem.overwrite('password.applicant.key', password);
      this.config.web5Password = password;
      return { password };
    }

    if (firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxServerError(
        'APPLICANT_WEB5_RECOVERY_PHRASE found without APPLICANT_WEB5_PASSWORD on first launch! ' +
        'APPLICANT_WEB5_PASSWORD is required to unlock the vault recovered by APPLICANT_WEB5_RECOVERY_PHRASE. ' +
        'Please set APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE in .env file.',
      );
    }

    if (!firstLaunch && !web5Password && !web5RecoveryPhrase) {
      throw new DcxServerError(
        'APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE not found on non-first launch! ' +
        'Either set both APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
        'to create a new password and recovery phrase.',
      );
    }

    if (!firstLaunch && !web5Password && web5RecoveryPhrase) {
      throw new DcxServerError(
        'APPLICANT_WEB5_RECOVERY_PHRASE found without APPLICANT_WEB5_PASSWORD on non-first launch! ' +
        'Either set both APPLICANT_WEB5_PASSWORD and APPLICANT_WEB5_RECOVERY_PHRASE in .env file or delete the local DATA folder ' +
        'to create a new recovery phrase with the given password.',
      );
    }

    if (!firstLaunch && web5Password && !web5RecoveryPhrase) {
      Logger.warn(
        'APPLICANT_WEB5_PASSWORD found without APPLICANT_WEB5_RECOVERY_PHRASE on non-first launch! ' +
        'Attempting to unlock the vault with APPLICANT_WEB5_PASSWORD.',
      );
      return { password: web5Password };
    }

    return {
      password       : web5Password,
      recoveryPhrase : web5RecoveryPhrase,
    };
  }

  /**
   *
   * Configures the DCX server by creating a new password, initializing Web5,
   * connecting to the remote DWN and configuring the DWN with the DCX credential-issuer protocol
   *
   * @returns void
   *
   */
  public async initialize(): Promise<void> {
    Logger.debug('this.config.agentDataPath', this.config.agentDataPath);
    Logger.debug('this.config.web5Password', this.config.web5Password);
    Logger.debug('this.config.web5RecoveryPhrase', this.config.web5RecoveryPhrase);

    // Create a new DcxIdentityVault instance
    const agentVault = new DcxIdentityVault();
    const dataPath = this.config.agentDataPath;

    // Create a new DcxAgent instance
    const agent = await DcxAgent.create({ agentVault, dataPath });

    // Check if this is the first launch of the agent
    const firstLaunch = await agent.firstLaunch();

    // TODO: consider checking if vault is locked
    // const isLocked = agent.vault.isLocked();

    // Check the state of the password and recovery phrase
    const { password, recoveryPhrase } = await this.checkWeb5Config(firstLaunch);

    // Toggle the initialization options based on the presence of a recovery phrase
    const dwnEndpoints = this.useOptions.dwns!;
    const initializeParams = !recoveryPhrase
      ? { password, dwnEndpoints }
      : { password, recoveryPhrase, dwnEndpoints };

    // Initialize the agent with the options
    if (firstLaunch) {
      this.config.web5RecoveryPhrase = await agent.initialize(initializeParams);
      await FileSystem.overwrite('recovery.applicant.key', this.config.web5RecoveryPhrase);
    }

    // Start the agent and create a new Web5 instance
    await agent.start({ password });

    // Register the agent identity with the DWN
    await agent.sync.registerIdentity({ did: agent.agentDid.uri });

    // Initialize the Web5 instance
    const web5 = new Web5({ agent, connectedDid: agent.agentDid.uri });

    // Set the DcxManager properties
    ApplicantManager.web5 = web5;
    ApplicantManager.applicantAgent = agent;
    ApplicantManager.applicantAgentVault = agentVault;

    // Set the server initialized flag
    this._isInitialized = true;
  }

  /**
   *
   * Stops the DCX server
   * @returns void
   */
  public stop(): void {
    // Logger.debug('DCX server stopping...');
    this._isPolling = false;
    exit(0);
  }

  public async setupDwn(): Promise<void> {
    await ApplicantManager.setup();
    this._isSetup = true;
  }


  /**
   *
   * Polls the DWN for incoming records
   *
   */
  public async poll(): Promise<void> {
    Logger.debug('DCX server starting ...');

    const CURSOR = this.config.cursorFile;
    const LAST_RECORD_ID = this.config.lastRecordIdFile;

    let cursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(cursor) ? {} : { cursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this._isPolling) {
      const { records = [], cursor: nextCursor } = await ApplicantManager.web5.dwn.records.query({
        message: {
          filter: {
            protocol: applicant.protocol,
          },
          pagination,
        },
      });

      Logger.debug(`Found ${records.length} records`);
      if (nextCursor) {
        Logger.debug(`Next cursor update for next query`, stringifier(nextCursor));
        cursor = nextCursor;
        const overwritten = await FileSystem.overwrite(CURSOR, cursor);
        Logger.debug(`${CURSOR} overwritten ${overwritten}`, cursor);
      } else {
        Logger.debug(`Next cursor not found!`);
      }

      if (cursor && !records.length) {
        cursor = undefined;
      }

      const recordIds = records.map((record: Record) => record.id);

      const recordReads: Record[] = await Promise.all(
        recordIds.map(async (recordId: string) => {
          const { record }: { record: Record } = await ApplicantManager.web5.dwn.records.read({
            message: {
              filter: {
                recordId,
              },
            },
          });
          return record;
        }),
      );

      Logger.debug(`Read ${recordReads.length} records`);

      if (!recordReads.length) {
        Logger.debug('No records found!', recordReads.length);
        if (this._isTest) {
          Logger.debug('Test Complete! Stopping DCX server ...');
          this.stop();
        }
        await Time.sleep();
      }

      for (const record of recordReads) {
        if (record.id != lastRecordId) {
          if (record.protocolPath === 'application') {
            const manifest = this.useOptions.manifests!.find(
              (manifest: CredentialManifest) =>
                manifest.presentation_definition.id === record.schema,
            );

            if (manifest) {
              await ApplicantHandlers.processResponseRecord(record, manifest);
            } else {
              Logger.debug(`Skipped message with protocol path ${record.protocolPath}`);
            }

            lastRecordId = record.id;
            const overwritten = await FileSystem.overwrite(LAST_RECORD_ID, lastRecordId);
            Logger.debug(`Overwritten last record id ${overwritten}`, lastRecordId);
          }
        } else {
          await Time.sleep();
        }
      }
    }
  }

  /**
   *
   * Starts the DCX server
   * @returns void
   */
  public async start(): Promise<void> {
    try {
      if (!this._isInitialized) {
        await this.initialize();
        Logger.debug('Web5 initialized', this._isInitialized);
        await ApplicantManager.setup();
      }

      this._isPolling = true;
    } catch (error: any) {
      Logger.error(error);
      this.stop();
    }
  }
}