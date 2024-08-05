import {
  CredentialManifest,
  DcxAgent,
  DcxDwnError,
  DcxIdentityVault,
  DwnError,
  DwnUtils,
  Logger,
  manifestSchema,
  ServerOptions,
  Time
} from '@dcx-protocol/common';
import { DwnPaginationCursor, DwnResponseStatus } from '@web5/agent';
import {
  ProtocolsConfigureResponse,
  ProtocolsQueryResponse,
  Record,
  RecordsCreateResponse,
  Web5,
} from '@web5/api';
import { issuer } from './index.js';

/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class IssuerManager {
  public static web5: Web5;
  public static issuerAgent: DcxAgent;
  public static issuerAgentVault: DcxIdentityVault;
  public static serverOptions: ServerOptions;

  /**
   * Sync DWN
   */
  public static sync(): void {
    Logger.debug('Syncing dwn ...');
    this.issuerAgent.sync.startSync({ interval: '1ms' });

    Time.sleep(1000);

    this.issuerAgent.sync.stopSync();
    Logger.debug('Syncing done!');
  }
  /**
   * Query DWN for credential-issuer protocol
   * @returns Protocol[]; see {@link Protocol}
   */
  public static async queryIssuerProtocols(): Promise<ProtocolsQueryResponse> {
    try {
      // Query DWN for credential-issuer protocol
      const { status: query, protocols = [] } = await this.web5.dwn.protocols.query({
        message: {
          filter: {
            protocol: issuer.protocol,
          },
        },
      });

      if (DwnUtils.isFailure(query.code)) {
        const { code, detail } = query;
        Logger.error(`${this.name}: DWN protocols query failed`, query);
        throw new DwnError(code, detail);
      }

      Logger.debug(`DWN has ${protocols.length} protocols available`);
      return { status: query, protocols };
    } catch (error: any) {
      Logger.error(`${this.name}: Failed to query DWN protocols`, error);
      throw error;
    }
  }

  /**
   * Configure DWN for credential-issuer protocol
   * @returns DwnResponseStatus; see {@link DwnResponseStatus}
   */
  public static async configureIssuerProtocols(): Promise<ProtocolsConfigureResponse> {
    try {
      const { status: configure, protocol } = await this.web5.dwn.protocols.configure({
        message: { definition: issuer },
      });

      if (DwnUtils.isFailure(configure.code) || !protocol) {
        const { code, detail } = configure;
        Logger.error('DWN protocol configure fail', configure, protocol);
        throw new DwnError(code, detail);
      }

      const { status: send } = await protocol.send(this.issuerAgent.agentDid.uri);

      if (DwnUtils.isFailure(send.code)) {
        const { code, detail } = send;
        Logger.error('DWN protocols send failed', send);
        throw new DwnError(code, detail);
      }

      Logger.debug('Sent protocol to remote DWN', send);
      return { status: send, protocol };
    } catch (error: any) {
      Logger.error(`${this.name}: Failed to configure DWN protocols:`, error);
      throw error;
    }
  }

  /**
   * Query DWN for manifest records
   * @returns Record[]; see {@link Record}
   */
  public static async queryManifestRecords(): Promise<
    DwnResponseStatus & { records: Record[]; cursor?: DwnPaginationCursor }
    > {
    try {
      const {
        status,
        records: manifestRecords = [],
        cursor,
      } = await this.web5.dwn.records.query({
        message: {
          filter: {
            schema       : manifestSchema.$id,
            dataFormat   : 'application/json',
            protocol     : issuer.protocol,
            protocolPath : 'manifest',
          },
        },
      });

      if (DwnUtils.isFailure(status.code)) {
        const { code, detail } = status;
        Logger.error('DWN manifest records query failed', status);
        throw new DwnError(code, detail);
      }

      return { status, records: manifestRecords, cursor };
    } catch (error: any) {
      Logger.warn(error);
      throw error;
    }
  }

  /**
   * Filter manifest records
   * @param manifestRecords Record[]; see {@link Record}
   * @returns CredentialManifest[]; see {@link CredentialManifest}
   */
  public static async readManifestRecordsData(
    manifestRecords: Record[],
  ): Promise<{ manifests: CredentialManifest[] }> {
    try {
      const manifests = await Promise.all(
        manifestRecords.map(async (manifestRecord) => {
          const { record } = await this.web5.dwn.records.read({
            message: {
              filter: {
                recordId: manifestRecord.id,
              },
            },
          });
          return record.data.json();
        }),
      );
      return { manifests };
    } catch (error: any) {
      Logger.error(`${this.name}: Failed to filter dwn manifest records`, error);
      throw error;
    }
  }

  /**
   * Filter local {@link Manifest} against remote manifest record reads to find missing manifests
   * @param manifestReads list of {@link CredentialManifest} objects read from the remote DWN;
   * @returns list of missing CredentialManifest objects that need writing to remote DWN
   */
  public static async filterManifestRecords(
    manifestReads: CredentialManifest[],
  ): Promise<CredentialManifest[]> {
    if (!this.serverOptions.manifests) {
      throw new DcxDwnError('Manifests not provided');
    }
    try {
      return this.serverOptions.manifests.filter((manifest: CredentialManifest) =>
        manifestReads.find((manifestRead: CredentialManifest) => manifest.id !== manifestRead.id),
      );
    } catch (error: any) {
      Logger.error(`${this.name}: Failed to filter dwn manifest records`, error);
      throw error;
    }
  }

  /**
   * Create missing manifest record
   * @param unwrittenManifest CredentialManifest; see {@link CredentialManifest}
   * @returns Record | undefined; see {@link Record}
   */
  public static async createMissingManifest(
    unwrittenManifest: CredentialManifest,
  ): Promise<RecordsCreateResponse> {
    unwrittenManifest.issuer.id = this.issuerAgent.agentDid.uri;
    const { record, status: create } = await this.web5.dwn.records.create({
      store   : false,
      data    : unwrittenManifest,
      message : {
        schema       : manifestSchema.$id,
        dataFormat   : 'application/json',
        protocol     : issuer.protocol,
        protocolPath : 'manifest',
        published    : true,
      },
    });

    if (DwnUtils.isFailure(create.code)) {
      const { code, detail } = create;
      Logger.error('Failed to create missing manifest record', create);
      throw new DwnError(code, detail);
    }

    if (!record) {
      throw new DcxDwnError(
        `Failed to create missing dwn manifest record: ${unwrittenManifest.id}`,
      );
    }

    const { status: send } = await record.send(this.issuerAgent.agentDid.uri);

    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error(`${this.name}: Failed to send dwn manifest record`, send);
      throw new DwnError(code, detail);
    }

    Logger.debug(`Sent protocol to remote dwn`, send);
    return { status: send, record };
  }

  /**
   * Create missing manifests
   * @param missingManifests CredentialManifest[]; see {@link CredentialManifest}
   * @returns Record[]; see {@link Record}
   */
  public static async createManifestRecords(
    missingManifests: CredentialManifest[],
  ): Promise<Record[]> {
    try {
      const createdManifestRecords = await Promise.all(
        missingManifests.map(
          async (unwrittenManifest: CredentialManifest) =>
            (await this.createMissingManifest(unwrittenManifest))?.record,
        ),
      );
      return createdManifestRecords.filter((record?: Record) => record !== undefined) as Record[];
    } catch (error: any) {
      Logger.error(`${this.name}: Failed to create manifest records`, error);
      throw error;
    }
  }

  /**
   * Setup DWN with credential-issuer protocol and manifest records
   * @returns boolean indicating success or failure
   */
  public static async setup(): Promise<void> {
    Logger.log('Setting up dwn ...');
    if (!this.serverOptions.manifests) {
      throw new DcxDwnError('Manifests not provided');
    }
    try {
      // Query DWN for credential-issuer protocols
      const { protocols } = await this.queryIssuerProtocols();
      Logger.log(`Found ${protocols.length} dcx issuer protocol(s) in dwn`, JSON.stringify(protocols, null, 2));

      // Configure DWN with credential-issuer protocol if not found
      // if (!protocols.length) {
      Logger.log('Configuring dwn with dcx issuer protocol ...');
      const { status, protocol } = await this.configureIssuerProtocols();
      Logger.debug(
        `Configured credential issuer protocol in dwn: ${status.code} - ${status.detail}`,
        protocol,
      );
      // }

      // Query DWN for manifest records
      const { records } = await this.queryManifestRecords();
      Logger.log(`Found ${records.length} dwn manifest records`);

      // Read manifest records data
      const { manifests } = await this.readManifestRecordsData(records);
      Logger.debug(`Read ${manifests.length} manifest records`, manifests);

      if (!manifests.length) {
      // Create missing manifest records
        const manifestRecords = await this.createManifestRecords(this.serverOptions.manifests);
        Logger.log(`Created ${manifestRecords.length} records`, manifestRecords);
      } else {
        // Filter and create missing manifest records
        const unwrittenManifests = await this.filterManifestRecords(manifests);
        Logger.debug(`Found ${unwrittenManifests.length} unwritten manifests`);
        const manifestRecords = await this.createManifestRecords(unwrittenManifests);
        Logger.log(`Created ${manifestRecords.length} records`, manifestRecords);
      }

      Logger.log('DWN setup complete!');
    } catch (error: any) {
      Logger.error(`${this.name} failed!`, error);
      throw error;
    }
  }
}
