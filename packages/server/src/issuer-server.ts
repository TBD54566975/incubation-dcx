import {
  CredentialManifest,
  DcxPath,
  FileSystem,
  Handler,
  Logger,
  Objects,
  Provider,
  SleepTime,
  Time,
  TrustedIssuer
} from '@dcx-protocol/common';
import { DcxIssuer, issuer } from '@dcx-protocol/issuer';
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

  public async sync(): Promise<void> {
    Logger.log('IssuerServer syncing ...');
    await this.issuer.agent.sync.sync();
  }

  /**
   * Listens for incoming records from the DWN
   */
  public async listen(params: SleepTime = { ms: '2m' }): Promise<void> {
    await this.sync();

    this.server.listening = true;
    Logger.log('IssuerServer listening ...');

    const milliseconds = ms(params.ms);

    const CURSOR = this.issuer.config.cursorFile;
    const LAST_RECORD_ID = this.issuer.config.lastRecordIdFile;

    let cursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(cursor) ? {} : { cursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this.server.listening) {
      const { records = [] } = await this.issuer.web5.dwn.records.query({
        from    : this.issuer.agent.agentDid.uri,
        message : {
          pagination,
          filter : { protocol: issuer.protocol },
        },
      });

      const recordIds = records.map((record: Record) => record.id);

      const recordReads: Record[] = await Promise.all(
        recordIds.map(async (recordId: string) => {
          const { record }: { record: Record } = await this.issuer.web5.dwn.records.read({
            from    : this.issuer.agent.agentDid.uri,
            message : {
              filter : {
                recordId,
              },
            },
          });
          return record;
        }),
      );

      if (this.server.testing) {
        Logger.log('Test Complete! Stopping DCX server ...');
        this.stop();
      }

      if (!recordReads.length) {
        Logger.log('No records found!', recordReads.length);
        await Time.sleep(milliseconds);
      }

      for (const record of recordReads) {
        if (record.protocolPath === 'application') {
          const data = await record.data.json();
          Logger.debug(`Found application with id: ${record.id}`, data);

          const manifest = this.issuer.config.manifests.find(
            (manifest: CredentialManifest) =>
              manifest.id.toLowerCase() === data.vpDataModel.credential_application.manifest_id,
          );

          if (!manifest) {
            Logger.error(`Manifest not found for application with id: ${record.id}`);
            continue;
          }

          const { status } = await this.issuer.processApplicationRecord(
            {
              record,
              manifest,
              providerId : manifest.issuer.id,
            }
          );
          Logger.debug(`Processed application with id: ${record.id}`, status);
        }
      }
      await Time.sleep(20000);
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