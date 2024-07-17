import { DwnResponseStatus, DwnPaginationCursor } from '@web5/agent';
import {
  ProtocolsQueryResponse,
  ProtocolsConfigureResponse,
  RecordsCreateResponse,
  Record,
  Web5,
} from '@web5/api';
import { DcxAgent, DcxIdentityVault, server } from './index.js';
import { credentialIssuerProtocol } from '../protocol/index.js';
import { manifestSchema } from '../schemas/index.js';
import { CredentialManifest } from '../types/dcx.js';
import { DwnUtils } from '../utils/dwn.js';
import { DwnError, DcxDwnError } from '../utils/error.js';
import { Logger } from '../utils/logger.js';
import { Time } from '../utils/time.js';

/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class Web5Manager {
  public static web5: Web5;
  public static dcxAgent: DcxAgent;
  public static dcxAgentVault: DcxIdentityVault;

  /**
   * Sync DWN
   */
  public static sync(): void {
    Logger.debug('Syncing dwn ...');
    Web5Manager.dcxAgent.sync.startSync({ interval: '1ms' });

    Time.sleep(1000);

    Web5Manager.dcxAgent.sync.stopSync();
    Logger.debug('Syncing done!');
  }
  /**
   * Query DWN for credential-issuer protocol
   * @returns Protocol[]; see {@link Protocol}
   */
  public static async queryIssuerProtocols(): Promise<ProtocolsQueryResponse> {

    // Query DWN for credential-issuer protocol
    const { status: query, protocols = [] } = await Web5Manager.web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: credentialIssuerProtocol.protocol,
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

  }

  /**
   * Configure DWN for credential-issuer protocol
   * @returns DwnResponseStatus; see {@link DwnResponseStatus}
   */
  public static async configureIssuerProtocols(): Promise<ProtocolsConfigureResponse> {
    const name = `${this.name}.configureIssuerProtocols():`;
    const { status: configure, protocol } = await Web5Manager.web5.dwn.protocols.configure({
      message: { definition: credentialIssuerProtocol },
    });
    Logger.debug(name, `Configure protocol ${protocol?.toJSON().descriptor}`);
    Logger.debug(name, `Configure protocol status ${configure}`);

    if (DwnUtils.isFailure(configure.code) || !protocol) {
      const { code, detail } = configure;
      Logger.error(name, 'DWN protocol configure failed', configure);
      throw new DwnError(code, detail);
    }

    const { status: send } = await protocol.send(Web5Manager.dcxAgent.agentDid.uri);

    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error(name, 'DWN protocols send failed', send);
      throw new DwnError(code, detail);
    }

    Logger.debug('Sent protocol to remote DWN', send);
    return { status: send, protocol };
  }

  /**
   * Query DWN for manifest records
   * @returns Record[]; see {@link Record}
   */
  public static async queryManifestRecords(): Promise<
    DwnResponseStatus & { records: Record[]; cursor?: DwnPaginationCursor }
    > {
    const {
      status,
      records: manifestRecords = [],
      cursor,
    } = await Web5Manager.web5.dwn.records.query({
      message: {
        filter: {
          schema       : manifestSchema.$id,
          dataFormat   : 'application/json',
          protocol     : credentialIssuerProtocol.protocol,
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
          const { record } = await Web5Manager.web5.dwn.records.read({
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
    const useManifests = server.useOptions.manifests;
    if (!useManifests) {
      throw new DcxDwnError('Manifests not provided');
    }
    try {
      return useManifests.filter((manifest: CredentialManifest) =>
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
    unwrittenManifest.issuer.id = Web5Manager.dcxAgent.agentDid.uri;
    const { record, status: create } = await Web5Manager.web5.dwn.records.create({
      store   : false,
      data    : unwrittenManifest,
      message : {
        schema       : manifestSchema.$id,
        dataFormat   : 'application/json',
        protocol     : credentialIssuerProtocol.protocol,
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

    const { status: send } = await record.send(Web5Manager.dcxAgent.agentDid.uri);

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
    const createdManifestRecords = await Promise.all(
      missingManifests.map(
        async (unwrittenManifest: CredentialManifest) =>
          (await Web5Manager.createMissingManifest(unwrittenManifest))?.record,
      ),
    );
    return createdManifestRecords.filter((record?: Record) => record !== undefined) as Record[];
  }

  /**
   * Setup DWN with credential-issuer protocol and manifest records
   * @returns boolean indicating success or failure
   */
  public static async setup(): Promise<void> {
    Logger.log('Setting up dwn ...');
    const useManifests = server.useOptions.manifests;
    if (!useManifests) {
      throw new DcxDwnError('Manifests not provided');
    }

    // Query DWN for credential-issuer protocols
    const { protocols } = await Web5Manager.queryIssuerProtocols();
    Logger.log(`Found ${protocols.length} dcx issuer protocol(s) in dwn`, protocols);

    // Configure DWN with credential-issuer protocol if not found
    if (!protocols.length) {
      Logger.log('Configuring dwn with dcx issuer protocol ...');
      const { status, protocol } = await Web5Manager.configureIssuerProtocols();
      Logger.debug(
        `Configured credential issuer protocol in dwn: ${status.code} - ${status.detail}`,
        protocol,
      );
    }

    // Query DWN for manifest records
    const { records } = await Web5Manager.queryManifestRecords();
    Logger.log(`Found ${records.length} dwn manifest records`);

    // Read manifest records data
    const { manifests } = await Web5Manager.readManifestRecordsData(records);
    Logger.debug(`Read ${manifests.length} manifest records`, manifests);

    // Create missing manifest records
    if (!manifests.length) {
      const manifestRecords = await Web5Manager.createManifestRecords(useManifests);
      Logger.log(`Created ${manifestRecords.length} records`, manifestRecords);
      // Filter and create missing manifest records
    } else {
      const unwrittenManifests = await Web5Manager.filterManifestRecords(manifests);
      Logger.debug(`Found ${unwrittenManifests.length} unwritten manifests`);
      const manifestRecords = await Web5Manager.createManifestRecords(unwrittenManifests);
      Logger.log(`Created ${manifestRecords.length} records`, manifestRecords);
    }

    Logger.log('DWN setup complete!');

  }
}
