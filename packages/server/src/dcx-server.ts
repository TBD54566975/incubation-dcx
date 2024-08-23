import { DcxApplicant } from '@dcx-protocol/applicant';
import { CredentialManifest, DcxPath, DcxServerError, FileSystem, Handler, Logger, Manifest, Objects, Provider, SleepTime, stringifier, Time, TrustedIssuer } from '@dcx-protocol/common';
import { dcxIssuer, DcxIssuer } from '@dcx-protocol/issuer';
import { Record } from '@web5/api';
import { exit } from 'process';
import ms from 'ms';

export interface IServer {
    issuer?: IssuerServer;
    applicant?: ApplicantServer;
    use(path: string, ...args: any[]): void;
    useManifest(manifest: Manifest): void;
    useHandler(handler: Handler): void;
    useProvider(provider: Provider): void;
    useIssuer(issuer: TrustedIssuer): void;
    useDwn(dwn: string): void;
    useGateway(gateway: string): void;
}

export type ServerParams = {
    issuer?: DcxIssuer;
    applicant?: DcxApplicant
    type?: 'issuer' | 'applicant';
}

/**
 * @class Server
 * @classdesc The Server class is used to setup the DCX server
 * @implements IServer
 * @param {ServerParams} params The server parameters
 * @param {DcxIssuer} params.issuer The issuer to use for the Server
 * @param {DcxApplicant} params.applicant The applicant to use for the Server
 * @param {string} params.type The type of server to use; either 'issuer' or 'applicant'
 * @example
 * import { Server } from '@dcx-protocol/server';
 * const server = new Server({ type: 'issuer' });
 * server.use('dwns', 'http://localhost:3000');
 * server.use('providers', providerOne);
 * await server.initilaize();
 * await server.model.setup();
 * await server.model.start();
 */

export class Server implements IServer {
  public type: string;
  public listening: boolean = false;
  public testing: boolean = process.env.NODE_ENV?.includes('test') ?? false;

  public issuer?: IssuerServer;
  public applicant?: ApplicantServer;
  public dcx: DcxIssuer | DcxApplicant;

  /**
   *
   * Setup the server with the provided options and config
   * @param params The server parameters; see {@link ServerParams}
   * @param params.type Required; The type of server to use; either 'issuer' or 'applicant'
   * @param params.applicant Optional; The applicant to use for the Server. Pass a custom DcxApplicant object if desired
   * @param params.issuer Optional; The issuer to use for the Server. Pass a custom DcxIssuer object if desired
   */
  constructor({ applicant, issuer }: ServerParams = {}) {
    if (issuer) {
      this.type = 'issuer';
      this.dcx = issuer ?? new DcxIssuer({});
      this.issuer = new IssuerServer({ issuer: this.dcx });
    } else if(applicant) {
      this.type = 'applicant';
      this.dcx = applicant ?? new DcxApplicant({});
      this.applicant = new ApplicantServer({ applicant: this.dcx });
    } else {
      throw new DcxServerError(
        'ServerParams Invalid: must pass type ("applicant" or "issuer") or DCX object (DcxApplicant or DcxIssuer)'
      );
    }
  }

  /**
   * Sets the server options
   * @param path The type of server option; see {@link DcxPath}
   * @param args The server options to use; see {@link DcxOptions}
   * @throws DcxServerError if the path is invalid
   * @example see docs/usage/README.md for usage information
   */
  public use(path: DcxPath, ...args: any[]): void {
    const validPaths = ['gateways', 'dwns', 'issuers', 'manifests', 'providers', 'handlers'];
    if (!this.type) {
      throw new DcxServerError(
        `Invalid Server.type: ${this.type} must be "issuer" or "applicant"`,
      );
    } else if (!validPaths.includes(path)) {
      throw new DcxServerError(
        `Invalid path: ${path} must be one of ${validPaths.join(', ')}`,
      );
    }
    if (validPaths.includes(path)) {
      this.dcx.options[path].push(...args);
    } else {
      throw new DcxServerError(`Invalid server.use() object: ${args}`);
    }
  }

  /**
   * Sets the manifest to use
   * @param manifest The manifest to use; see {@link Manifest}
   * @example see docs/usage/README.md for usage information
   */
  public useManifest(manifest: Manifest): void {
    this.dcx.options.manifests.push(manifest);
  }

  /**
   * Sets the handler to use
   * @param handler The handler to use; see {@link Handler}
   * @example see docs/usage/README.md for usage information
   */
  public useHandler(handler: Handler): void {
    this.dcx.options.handlers.push(handler);
  }

  /**
   * Sets the provider to use
   * @param provider The provider to use; see {@link Provider}
   * @example see docs/usage/README.md for usage information
   */
  public useProvider(provider: Provider): void {
    this.dcx.options.providers.push(provider);
  }

  /**
   * Sets the issuer to use
   * @param issuer The issuer to use; see {@link TrustedIssuer}
   * @example see docs/usage/README.md for usage information
   */
  public useIssuer(issuer: TrustedIssuer): void {
    this.dcx.options.issuers.push(issuer);
  }

  /**
   * Sets the dwn(s) to use
   * @param dwn The dwn to use
   * @example see docs/usage/README.md for usage information
   */
  public useDwn(dwn: string): void {
    this.dcx.options.dwns.push(dwn);
  }

  /**
   * Sets the gateways to use
   * @param gateway The gateway to use'
   * @example see docs/usage/README.md for usage information
   */
  public useGateway(gateway: string): void {
    this.dcx.options.gateways.push(gateway);
  }
}

/**
 * @class IssuerServer
 * @classdesc The IssuerServer class is used to setup the DCX issuer server
 * @extends Server
 * @param {DcxIssuer} params.issuer The issuer to use for the Server.Issuer
 * @example
 * import { IssuerServer } from '@dcx-protocol/server';
 * const issuerServer = new IssuerServer({ issuer: new DcxIssuer() });
 * await issuerServer.start();
 * await issuerServer.stop();
 */
export type IssuerServerParams = { issuer: DcxIssuer };
export class IssuerServer extends Server {
  public listening: boolean = false;
  public dcxIssuer: DcxIssuer;

  /**
   * Setup the server with the provided options and config
   * @param params.issuer The issuer to use for the Server.Issuer
   */
  constructor({ issuer }: IssuerServerParams = { issuer: new DcxIssuer({}) }) {
    super({ issuer });
    if(!issuer || !(issuer instanceof DcxIssuer)) {
      throw new DcxServerError('IssuerServerParams Invalid: must pass new DcxIssuer() object');
    }
    this.dcxIssuer = issuer ?? this.dcx as DcxIssuer;
    if(!this.dcxIssuer) {
      throw new DcxServerError('IssuerServer Invalid: must pass new DcxIssuer() object');
    }
  }

  /**
   * Listens for incoming records from the DWN
   */
  public async listen(params: SleepTime = { ms: '2m' }): Promise<void> {
    const milliseconds = ms(params.ms);
    this.listening = true;
    Logger.log('IssuerServer listening ...');

    const CURSOR = this.dcx.config.issuer.cursorFile!;
    const LAST_RECORD_ID = this.dcx.config.issuer.lastRecordIdFile!;

    let cursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(cursor) ? {} : { cursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this.listening) {
      const { records = [], cursor: nextCursor } = await this.dcxIssuer.web5.dwn.records.query({
        message : {
          pagination,
          filter : { protocol: dcxIssuer.protocol },
        },
      });

      Logger.log(`Found ${records.length} records`);
      if (nextCursor) {
        Logger.log(`Next cursor update for next query`, stringifier(nextCursor));
        cursor = nextCursor;
        const overwritten = await FileSystem.overwrite(CURSOR, cursor);
        Logger.log(`${CURSOR} overwritten ${overwritten}`, cursor);
      } else {
        Logger.log(`Next cursor not found!`);
      }

      if (cursor && !records.length) {
        cursor = undefined;
      }

      const recordIds = records.map((record: Record) => record.id);

      const recordReads: Record[] = await Promise.all(
        recordIds.map(async (recordId: string) => {
          const { record }: { record: Record } = await this.dcxIssuer.web5.dwn.records.read({
            message : {
              filter : {
                recordId,
              },
            },
          });
          return record;
        }),
      );

      Logger.log(`Read ${recordReads.length} records`);

      if (this.testing) {
        Logger.log('Test Complete! Stopping DCX server ...');
        this.stop();
      }

      if (!recordReads.length) {
        Logger.log('No records found!', recordReads.length);
        await Time.sleep(milliseconds);
      }

      for (const record of recordReads) {
        if (record.id != lastRecordId) {
          if (record.protocolPath === 'application') {
            const manifest = this.dcx.options.manifests!.find(
              (manifest: CredentialManifest) =>
                manifest.presentation_definition.id === record.schema,
            );

            if (manifest) {
              const { status } = await this.dcxIssuer.processRecord(
                {
                  record,
                  manifest,
                  providerId : manifest.output_descriptors[0].id,
                }
              );
              Logger.debug(`Processed application id ${record.id}`, status);
            } else {
              Logger.log(`Skipped message with protocol path ${record.protocolPath}`);
            }

            lastRecordId = record.id;
            const overwritten = await FileSystem.overwrite(LAST_RECORD_ID, lastRecordId);
            Logger.log(`Overwritten last record id: ${overwritten}`, lastRecordId);
          }
        } else {
          await Time.sleep(milliseconds);
        }
      }
    }
  }

  /**
   * Stops the IssuerServer
   */
  public stop(): void {
    Logger.log('Stopping IssuerServer ...');
    this.listening = false;
    exit(0);
  }

  /**
   * Starts the IssuerServer; see {@link IssuerServer}
   */
  public async start(): Promise<void> {
    try {
      if (!this.dcx.status.initialized) {
        await this.dcx.initialize();
        Logger.log('Initialized IssuerServer.DcxIssuer', this.dcx.status.initialized);
        await this.dcx.setup();
        this.dcx.status.setup = true;
        Logger.log('Setup IssuerServer.DcxIssuer', this.dcx.status.setup);
      }
      await this.listen();
    } catch (error: any) {
      Logger.error(error);
      this.stop();
    }
  }
}

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
export type ApplicantServerParams = {  applicant: DcxApplicant };
export class ApplicantServer extends Server {
  public listening: boolean = false;
  public dcxApplicant: DcxApplicant;
  /**
   * Setup the ApplicantServer with a DcxApplicant; see {@link DcxApplicant}
   * @param params.type The type of server to use; must be 'applicant'
   * @param params.applicant The applicant to use for the Server
   * @example
   * import { ApplicantServer } from '@dcx-protocol/server';
   * const applicantServer = new ApplicantServer({ applicant: new DcxApplicant() });
   * await applicantServer.start();
   * await applicantServer.stop();
   */
  constructor({ applicant }: ApplicantServerParams = { applicant: new DcxApplicant({}) }) {
    super({ applicant });
    if(!applicant || !(applicant instanceof DcxApplicant)) {
      throw new DcxServerError('ApplicantServer Invalid: must pass new DcxApplicant() object');
    }
    this.dcxApplicant = applicant ?? this.dcx as DcxApplicant;
    if(!this.dcxApplicant) {
      throw new DcxServerError('ApplicantServer Invalid: must pass new DcxIssuer() object');
    }
  }

  /**
   * Listens for incoming records from the DWN
   * @param params.ms The time to sleep between each poll; Optional, default is 2 minutes; see {@link SleepTime}
   */
  public async listen(params: SleepTime = { ms: '2m' }): Promise<void> {
    this.listening = true;
    const milliseconds = ms(params.ms);
    Logger.log('ApplicantServer listening ...');

    const CURSOR = this.dcx.config.issuer.cursorFile;
    const LAST_RECORD_ID = this.dcx.config.issuer.lastRecordIdFile;

    let currentCursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(currentCursor) ? {} : { cursor: currentCursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this.listening) {
      const { records = [], cursor: nextCursor } = await this.dcx.queryRecords({
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

      if (this.testing) {
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
      const { records: reads } = await this.dcx.readRecords({ records: responses });
      Logger.debug(`Processed ${reads.length} application/responses`);
    }
  }

  /**
   * Stops the ApplicantServer
   */
  public stop(): void {
    Logger.log('Stopping ApplicantServer ...');
    this.listening = false;
    exit(0);
  }

  /**
   *
   * Starts the applicant server
   * @returns void
   */
  public async start(): Promise<void> {
    try {
      if (!this.dcx.status.initialized) {
        await this.dcx.initialize();
        Logger.log('Initialized ApplicantServer.DcxApplicant', this.dcx.status.initialized);
        await this.dcx.setup();
        this.dcx.status.setup = true;
        Logger.log('Setup ApplicantServer.DcxApplicant', this.dcx.status.setup);
      }
      await this.listen();
    } catch (error: any) {
      Logger.error(error);
      this.stop();
    }
  }
}