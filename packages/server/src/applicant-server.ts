import { DcxApplicant } from '@dcx-protocol/applicant';
import {
  CredentialManifest,
  DcxPath,
  FileSystem,
  Handler,
  Logger,
  Objects,
  Provider,
  SleepTime,
  stringifier,
  Time,
  TrustedIssuer
} from '@dcx-protocol/common';
import { Record } from '@web5/api';
import ms from 'ms';
import { DcxServer } from './dcx-server.js';
import { IServer } from './types.js';

/**
 * @class ApplicantServer
 * @classdesc The ApplicantServer class is used to setup the DCX applicant server
 * @extends Server
 * @param {DcxApplicant} params.applicant The applicant to use for the Server.Applicant
 * @example
 * import { ApplicantServer } from '@dcx-protocol/server';
 * const applicantServer = new ApplicantServer({ applicant: new DcxApplicant() });
 * await applicantServer.start();
 * await applicantServer.stop();
 */
export class ApplicantServer implements IServer {
  private server: DcxServer;
  private applicant: DcxApplicant;

  constructor({ server, applicant }: { server: DcxServer, applicant: DcxApplicant }) {
    this.server = server;
    this.applicant = applicant;
  }
  public use(path: DcxPath, ...args: any[]): void {
    this.server.use(path, ...args);
  }

  public useManifest(manifest: CredentialManifest): void {
    this.server.useManifest(manifest);
  }

  public useHandler(handler: Handler): void {
    this.server.useHandler(handler);
  }

  public useProvider(provider: Provider): void {
    this.server.useProvider(provider);
  }

  public useIssuer(issuer: TrustedIssuer): void {
    this.server.useIssuer(issuer);
  }

  public useDwn(dwn: string): void {
    this.server.useDwn(dwn);
  }

  public useGateway(gateway: string): void {
    this.server.useGateway(gateway);
  }

  /**
   * Listens for incoming records from the DWN
   * @param params.ms The time to sleep between each poll
   *    Optional, default is 2 minutes
   *    See {@link SleepTime}
   */
  public async listen(params: SleepTime = { ms: '2m' }): Promise<void> {
    this.server.listening = true;
    const milliseconds = ms(params.ms);
    Logger.log('ApplicantServer listening ...');

    const CURSOR = this.applicant.config.issuer.cursorFile;
    const LAST_RECORD_ID = this.applicant.config.issuer.lastRecordIdFile;

    let currentCursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(currentCursor) ? {} : { cursor: currentCursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this.server.listening) {
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

      if (this.server.testing) {
        Logger.log('Test Complete! Stopping applicant server ...');
        this.stop();
      }

      if (!records.length) {
        Logger.log(`${records.length} records found!`, records);
        await Time.sleep(milliseconds);
      }

      const responses = records.filter(
        (record: Record) => record.id != lastRecordId && record.protocolPath === 'application/response'
      );
      const { records: reads } = await this.applicant.readRecords({ records: responses });
      Logger.debug(`Processed ${reads.length} application/responses`);
    }
  }

  /**
     * Stops the ApplicantServer
     */
  public stop(): void {
    Logger.log('Stopping ApplicantServer ...');
    this.server.listening = false;
    process.exit(0);
  }

  /**
     *
     * Starts the applicant server
     * @returns void
     */
  public async start(): Promise<void> {
    try {
      if (!this.applicant.status.initialized) {
        await this.applicant.initialize();
        Logger.log('Initialized ApplicantServer.DcxApplicant', this.applicant.status.initialized);
        await this.applicant.setup();
        this.applicant.status.setup = true;
        Logger.log('Setup ApplicantServer.DcxApplicant', this.applicant.status.setup);
      }
      await this.listen();
    } catch (error: any) {
      Logger.error(error);
      this.stop();
    }
  }
}