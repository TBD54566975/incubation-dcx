import {
  CredentialManifest,
  FileSystem,
  Logger,
  Objects,
  SleepTime,
  stringifier,
  Time
} from '@dcx-protocol/common';
import { DcxIssuer, dcxIssuer } from '@dcx-protocol/issuer';
import { Record } from '@web5/api';
import { exit } from 'process';
import { DcxServer } from '../dcx-server.js';

export class IssuerServer extends DcxServer {
  issuer: DcxIssuer;

  /**
   *
   * Setup the server with the provided options and config
   *
   * @param params.issuer The issuer to use for the DcxServer
   * @example see README.md for usage information
   *
   */
  constructor(params: { type: 'issuer', issuer: DcxIssuer; }) {
    super(params);
    this.issuer = params.issuer ?? this.dcxActor as DcxIssuer ?? new DcxIssuer({});
  }

  /**
   *
   * Polls the DWN for incoming records
   *
   */
  public async poll(params: SleepTime = { ms: 10 }): Promise<void> {
    this.isPolling = true;
    Logger.log('DCX server starting ...');

    const CURSOR = this.issuer.config.issuer.cursorFile!;
    const LAST_RECORD_ID = this.issuer.config.issuer.lastRecordIdFile!;

    let cursor = await FileSystem.readToJson(CURSOR);
    const pagination = Objects.isEmpty(cursor) ? {} : { cursor };
    let lastRecordId = await FileSystem.readToString(LAST_RECORD_ID);

    while (this.isPolling) {
      const { records = [], cursor: nextCursor } = await DcxIssuer.web5.dwn.records.query({
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
          const { record }: { record: Record } = await DcxIssuer.web5.dwn.records.read({
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

      if (this.isTest) {
        Logger.log('Test Complete! Stopping DCX server ...');
        this.stop();
      }

      if (!recordReads.length) {
        Logger.log('No records found!', recordReads.length);
        await Time.sleep(params.ms);
      }

      for (const record of recordReads) {
        if (record.id != lastRecordId) {
          if (record.protocolPath === 'application') {
            const manifest = this.issuer.options.manifests!.find(
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
          await Time.sleep();
        }
      }
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
     * Starts the DCX server
     * @returns void
     */
  public async start(): Promise<void> {
    try {
      if (!this.issuer.isInitialized) {
        await this.issuer.initializeWeb5();
        Logger.log('Web5 initialized', this.issuer.isInitialized);
        await this.issuer.setupDwn();
        this.issuer.isSetup = true;
      }
      await this.poll();
    } catch (error: any) {
      Logger.error(error);
      this.stop();
    }
  }
}