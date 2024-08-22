import { DcxApplicant } from '@dcx-protocol/applicant';
import {
  DcxPath,
  DcxServerError,
  FileSystem,
  Handler,
  Issuer,
  Logger,
  Manifest,
  Objects,
  Provider,
  SleepTime,
  stringifier,
  Time
} from '@dcx-protocol/common';
import { Record } from '@web5/api';
import { exit } from 'process';
import { DcxServer } from '../index.js';

export class ApplicantServer extends DcxServer {
  applicant : DcxApplicant;

  /**
   *
   * Setup the server with the provided options and config
   *
   * @param params.applicant The applicant to use for the DcxServer
   * @example see README.md for usage information
   *
   */
  constructor(params: { type: 'applicant', applicant: DcxApplicant; }) {
    super(params);
    this.applicant = params.applicant ?? this.dcx as DcxApplicant ?? new DcxApplicant({});
  }


  /**
         *
         * Sets the server options
         *
         * @param path The type of server option; see {@link DcxPath}
         * @param id Some unique, accessible identifier to map the obj to
         * @param obj The object to use; see {@link DcxOptions}
         * @example see README.md for usage information
         *
         */
  public use(path: DcxPath, ...args: any[]): void {
    const validPaths = ['gateways', 'dwns', 'issuers', 'manifests', 'providers', 'handlers'];
    if (!validPaths.includes(path)) {
      throw new DcxServerError(
        `Invalid server.use() name: ${path}. Must be one of: ${validPaths.join(', ')}`,
      );
    }
    if (validPaths.includes(path)) {
      this.applicant.options[path].push(...args);
    } else {
      throw new DcxServerError(`Invalid server.use() object: ${args}`);
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
  public useManifest(manifest: Manifest): void {
    this.applicant.options.manifests.push(manifest);
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
  public useHandler(handler: Handler): void {
    this.applicant.options.handlers.push(handler);
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
    this.applicant.options.providers.push(provider);
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
    this.applicant.options.issuers.push(issuer);
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
    this.applicant.options.dwns.push(dwn);
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
    this.applicant.options.gateways.push(gateway);
  }

  /**
   *
   * Polls the DWN for Applicantion/Responses
   *  @param params.ms The time to sleep between each poll
   */
  public async poll(params: SleepTime = { ms: 120000 }): Promise<void> {
    this.isPolling = true;
    Logger.log('Starting applicant server ...');

    const CURSOR = this.applicant.config.issuer.cursorFile;
    const LAST_RECORD_ID = this.applicant.config.issuer.lastRecordIdFile;

    let currentCursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(currentCursor) ? {} : { cursor: currentCursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this.isPolling) {
      const { records = [], cursor: nextCursor } = await this.applicant.queryRecords({
        protocolPath : 'application/response',
        options      : { pagination }
      });

      Logger.log(`Found ${records.length} records`);
      if (nextCursor) {
        Logger.log(`Next cursor update for next query`, stringifier(nextCursor));
        currentCursor = nextCursor;
        const overwritten = await FileSystem.overwrite(CURSOR, currentCursor);
        Logger.log(`${CURSOR} overwritten ${overwritten}`, currentCursor);
      } else {
        Logger.log(`Next cursor not found!`);
      }

      if (currentCursor && !records.length) {
        currentCursor = undefined;
      }

      if (this.isTest) {
        Logger.log('Test Complete! Stopping applicant server ...');
        this.stop();
      }

      if (!records.length) {
        Logger.log(`${records.length} records found!`, records);
        await Time.sleep(params.ms);
      }

      const responses = records.filter(
        (record: Record) => record.id != lastRecordId && record.protocolPath === 'application/response'
      );
      const { records: reads } = await this.applicant.readRecords({ records: responses });
      Logger.debug(`Processed ${reads.length} application/responses`);
    }
  }

  /**
   *
   * Stops the DCX server
   * @returns void
   */
  public stop(): void {
    Logger.log('DCX server stopping...');
    this.isPolling = false;
    exit(0);
  }

  /**
       *
       * Starts the applicant server
       * @returns void
       */
  public async start(): Promise<void> {
    try {
      if (!this.applicant.isInitialized) {
        await this.applicant.initializeWeb5();
        Logger.log('Web5 initialized', this.applicant.isInitialized);
        await this.applicant.setupDwn();
        this.applicant.isSetup = true;
      }
      await this.poll();
    } catch (error: any) {
      Logger.error(error);
      this.stop();
    }
  }
}