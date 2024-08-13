import {
  CredentialManifest,
  DcxAgent,
  DcxDwnError,
  DcxIdentityVault,
  DwnError,
  DwnUtils,
  Logger,
  manifestSchema,
  DcxOptions,
  stringifier
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
  public static agent: DcxAgent;
  public static agentVault: DcxIdentityVault;
  public static dcxOptions: DcxOptions;

  /**
   * Query DWN for credential-issuer protocol
   * @returns Protocol[]; see {@link Protocol}
   */
  public static async queryProtocols(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-issuer protocol
    const { status: query, protocols = [] } = await IssuerManager.web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: issuer.protocol,
        },
      },
    });

    if (DwnUtils.isFailure(query.code)) {
      const { code, detail } = query;
      Logger.error(`DWN protocols query failed`, query);
      throw new DwnError(code, detail);
    }

    Logger.debug(`DWN has ${protocols.length} protocols available`);
    Logger.debug('protocols', stringifier(protocols));
    return { status: query, protocols };
  }

  /**
   * Configure DWN for credential-issuer protocol
   * @returns DwnResponseStatus; see {@link DwnResponseStatus}
   */
  public static async configureProtocols(): Promise<ProtocolsConfigureResponse> {
    const { status: configure, protocol } = await IssuerManager.web5.dwn.protocols.configure({
      message: { definition: issuer },
    });

    Logger.debug('configureProtocols configure', stringifier(configure));
    Logger.debug('configureProtocols protocol', stringifier(protocol));


    if (DwnUtils.isFailure(configure.code) || !protocol) {
      const { code, detail } = configure;
      Logger.error('DWN protocol configure fail', configure, protocol);
      throw new DwnError(code, detail);
    }

    const { status: send } = await protocol.send(IssuerManager.agent.agentDid.uri);

    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error('DWN protocols send failed', send);
      throw new DwnError(code, detail);
    }

    Logger.debug('Sent protocol to remote DWN', send);
    return { status: send, protocol };
  }

  /**
   * Query DWN for manifest records
   * @returns Record[]; see {@link Record}
   */
  public static async queryManifests(): Promise<
    DwnResponseStatus & { records: Record[]; cursor?: DwnPaginationCursor }
    > {
    const {
      status,
      records: manifestRecords = [],
      cursor,
    } = await IssuerManager.web5.dwn.records.query({
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
  }

  /**
   * Filter manifest records
   * @param manifestRecords Record[]; see {@link Record}
   * @returns CredentialManifest[]; see {@link CredentialManifest}
   */
  public static async readManifests(
    manifestRecords: Record[],
  ): Promise<{ manifests: CredentialManifest[] }> {
    try {
      const manifests = await Promise.all(
        manifestRecords.map(async (manifestRecord) => {
          const { record } = await IssuerManager.web5.dwn.records.read({
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
      Logger.error('Failed to filter dwn manifest records', error);
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
    if (!IssuerManager.dcxOptions.manifests) {
      throw new DcxDwnError('Manifests not provided');
    }
    const localManifestIds = IssuerManager.dcxOptions.manifests.map((manifest) => manifest.id);
    const remoteManifestIds = manifestReads.map((manifest) => manifest.id);
    const missingManifestIds = Array.from(new Set([...localManifestIds, ...remoteManifestIds]));
    return IssuerManager.dcxOptions.manifests.filter((manifest: CredentialManifest) => missingManifestIds.includes(manifest.id));
  }

  /**
   * Create missing manifest record
   * @param unwrittenManifest CredentialManifest; see {@link CredentialManifest}
   * @returns Record | undefined; see {@link Record}
   */
  public static async createMissingManifest(
    unwrittenManifest: CredentialManifest,
  ): Promise<RecordsCreateResponse> {
    unwrittenManifest.issuer.id = IssuerManager.agent.agentDid.uri;
    const { record, status: create } = await IssuerManager.web5.dwn.records.create({
      store   : true,
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

    const { status: send } = await record.send();

    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error('Failed to send dwn manifest record', send);
      throw new DwnError(code, detail);
    }

    Logger.debug(`Sent manifest record to remote dwn`, send);
    return { status: send, record };
  }

  /**
   * Create missing manifests
   * @param missingManifests CredentialManifest[]; see {@link CredentialManifest}
   * @returns Record[]; see {@link Record}
   */
  public static async createManifests(
    missingManifests: CredentialManifest[],
  ): Promise<Record[]> {
    const createdManifestRecords = await Promise.all(
      missingManifests.map(
        async (unwrittenManifest: CredentialManifest) =>
          (await IssuerManager.createMissingManifest(unwrittenManifest))?.record,
      ),
    );
    return createdManifestRecords.filter((record?: Record) => record !== undefined) as Record[];
  }

  /**
   * Setup DWN with credential-issuer protocol and manifest records
   * @returns boolean indicating success or failure
   */
  public static async setup(): Promise<void> {
    Logger.log('IssuerManager.agent.agentDid.uri', IssuerManager.agent.agentDid.uri);
    const port = await IssuerManager.agent.agentDid.export();
    Logger.log('IssuerManager.agent => portableDid', stringifier(port));
    Logger.log('Setting up dwn ...');
    if (!IssuerManager.dcxOptions.manifests) {
      throw new DcxDwnError('Manifests not provided');
    }
    try {
      // Query DWN for credential-issuer protocols
      const { protocols } = await IssuerManager.queryProtocols();
      Logger.log(`Found ${protocols.length} dcx issuer protocol(s) in dwn`, protocols);

      // Configure DWN with credential-issuer protocol if not found
      if (!protocols.length) {
        Logger.log('Configuring dwn with dcx issuer protocol ...');
        const { status, protocol } = await IssuerManager.configureProtocols();
        Logger.debug(
          `Configured credential issuer protocol in dwn: ${status.code} - ${status.detail}`,
          protocol,
        );
      }

      // Query DWN for manifest records
      const { records } = await IssuerManager.queryManifests();
      Logger.log(`Found ${records.length} dwn manifest records`);

      // Read manifest records data
      const { manifests } = await IssuerManager.readManifests(records);
      Logger.debug(`Read ${manifests.length} manifest records`, manifests);

      if (!manifests.length) {
      // Create missing manifest records
        const manifestRecords = await IssuerManager.createManifests(IssuerManager.dcxOptions.manifests);
        Logger.log(`Created ${manifestRecords.length} records`, manifestRecords);
      } else {
        // Filter and create missing manifest records
        const unwrittenManifests = await IssuerManager.filterManifestRecords(manifests);
        Logger.debug(`Found ${unwrittenManifests.length} unwritten manifests`);
        const manifestRecords = await IssuerManager.createManifests(unwrittenManifests);
        Logger.log(`Created ${manifestRecords.length} records`, manifestRecords);
      }

      Logger.log('DWN Setup Complete!');
    } catch (error: any) {
      Logger.error('DWN Setup Failed!', error);
      throw error;
    }
  }
}
