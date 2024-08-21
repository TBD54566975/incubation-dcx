import {
  CredentialManifest,
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
import { DcxIssuer, dcxIssuer } from '@dcx-protocol/issuer';
import { Record } from '@web5/api';
import { argv, exit } from 'process';

export class DcxIssuerServer {
  isTest    : boolean = process.env.NODE_ENV?.includes('test') || argv.slice(2).some((arg) => ['--test', '-t'].includes(arg));
  isPolling : boolean = false;
  issuer    : DcxIssuer;

  /**
       *
       * Setup the server with the provided options and config
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
  constructor(params: { issuer: DcxIssuer; }) {
    this.issuer = params.issuer;
    if(!this.issuer) {
      throw new DcxServerError('DcxServer: No issuer provided');
    }
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
      this.issuer.options[path].push(...args);
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
    this.issuer.options.manifests.push(manifest);
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
    this.issuer.options.handlers.push(handler);
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
    this.issuer.options.providers.push(provider);
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
    this.issuer.options.issuers.push(issuer);
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
    this.issuer.options.dwns.push(dwn);
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
    this.issuer.options.gateways.push(gateway);
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