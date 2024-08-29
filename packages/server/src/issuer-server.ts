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
import { DcxIssuer, dcxIssuer } from '@dcx-protocol/issuer';
import { Record } from '@web5/api';
import ms from 'ms';
import { DcxServer, IServer } from './dcx-server.js';

/**
 * @class IssuerServer
 * @classdesc The IssuerServer class is used to setup the DCX issuer server
 * @extends Server
 * @param {DcxIssuer} params.issuer The issuer to use for the Server.Issuer
 * @example
 * import { IssuerServer } from '@dcx-protocol/server';
 * const issuerServer = new IssuerServer();
 * await issuerServer.start();
 * await issuerServer.stop();
 */
export class IssuerServer implements IServer {
  private server: DcxServer;
  private issuer: DcxIssuer;

  constructor({ server, issuer }: { server: DcxServer, issuer: DcxIssuer }) {
    this.server = server;
    this.issuer = issuer;
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
   */
  public async listen(params: SleepTime = { ms: '2m' }): Promise<void> {
    this.server.listening = true;

    const milliseconds = ms(params.ms);
    Logger.log('IssuerServer listening ...');

    const CURSOR = this.issuer.config.cursorFile;
    const LAST_RECORD_ID = this.issuer.config.lastRecordIdFile;

    let cursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(cursor) ? {} : { cursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this.server.listening) {
      const { records = [], cursor: nextCursor } = await this.issuer.web5.dwn.records.query({
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
          const { record }: { record: Record } = await this.issuer.web5.dwn.records.read({
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

      if (this.server.testing) {
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
            const manifest = this.issuer.config.manifests.find(
              (manifest: CredentialManifest) =>
                manifest.presentation_definition.id === record.schema,
            );

            if (manifest) {
              const { status } = await this.issuer.processRecord(
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
    this.server.listening = false;
    process.exit(0);
  }

  /**
   * Starts the IssuerServer; see {@link IssuerServer}
   */
  public async start(): Promise<void> {
    try {
      if (!this.issuer.status.initialized) {
        await this.issuer.initialize();
      }

      if(!this.issuer.status.setup) {
        await this.issuer.setup();
      }

      await this.listen();
    } catch (error: any) {
      Logger.error(error);
      this.stop();
    }
  }
}