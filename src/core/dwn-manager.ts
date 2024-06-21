import { DwnResponseStatus, Web5PlatformAgent } from '@web5/agent';
import { ProtocolsQueryResponse, Record, Web5 } from '@web5/api';
import { credentialIssuerProtocol, ExampleManifest, manifestSchema } from '../protocol/index.js';
import { CredentialManifest } from '../types/dcx.js';
import { DcxDwnError } from '../utils/error.js';

/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class DwnManager {
  public static web5: Web5;
  public static agent: Web5PlatformAgent;
  public static credentialManifests: CredentialManifest[] = [];
  /**
  *
  * Configure credential issuer protocol in DWN
  * @returns DwnResponseStatus; see {@link DwnResponseStatus}
  */
  public static async configureDcxIssuerProtocol(): Promise<DwnResponseStatus> {

    const { status: configure, protocol } = await this.web5.dwn.protocols.configure({
      message: { definition: credentialIssuerProtocol },
    });

    if ((configure.code < 200 || configure.code >= 300) || !protocol) {
      const { code, detail } = configure;
      console.error('DWN protocol configure fail', configure, protocol);
      throw new DcxDwnError(code, detail);
    }

    console.log('Configured credential issuer protocol', protocol);

    const { status: send = { code: 500, detail: "DWN Server Error" } } = await protocol.send(this.web5.agent.agentDid.uri);

    if (send.code < 200 || send.code >= 300) {
      const { code, detail } = send;
      console.error('DWN protocol send fail', send);
      throw new DcxDwnError(code, detail);
    }

    console.log('Successfully sent protocol to remote DWN');

    return { status: send };
  }

  /**
   *
   * Query credential issuer protocol in DWN
   * @returns ProtocolsQueryResponse; see {@link ProtocolsQueryResponse}
   */
  public static async queryDcxIssuerProtocol(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-issuer protocol
    const { status: query, protocols = [] } = await this.web5.dwn.protocols.query({
      from: this.web5.agent.agentDid.uri,
      message: {
        filter: {
          protocol: credentialIssuerProtocol.protocol,
        },
      },
    });
    if (query.code < 200 || query.code >= 300) {
      const { code, detail } = query;
      console.error('queryDcxIssuerProtocol query.code < 200 || query.code >= 300', query);
      throw new DcxDwnError(code, detail);
    }
    console.log(`DWN has ${protocols.length} protocols available`);
    return { status: query, protocols };
  }

  /**
   *
   * Query credential issuer manifest in DWN
   * @returns Record[]; see {@link Record}
   */
  public static async queryDcxIssuerManifest(): Promise<Record[]> {
    const { records: manifestRecords = [] } = await this.web5.dwn.records.query({
      from: this.web5.agent.agentDid.uri,
      message: {
        filter: {
          schema: manifestSchema.$id,
          dataFormat: 'application/json',
          protocol: credentialIssuerProtocol.protocol,
          protocolPath: 'manifest',
        },
      },
    });
    return manifestRecords;
  }

  /**
   *
   * Find unwritten manifests in DWN
   * @param manifestRecords Record[]; see {@link Record}
   * @returns CredentialManifest[]; see {@link CredentialManifest}
   */
  public static async readMissingManifests(manifestRecords: Record[]): Promise<CredentialManifest[]> {
    const manifestsRead = await Promise.all(
      manifestRecords.map(async (manifestRecord) => {
        const { record } = await this.web5.dwn.records.read({
          from: this.web5.agent.agentDid.uri,
          message: {
            filter: {
              recordId: manifestRecord.id,
            },
          },
        });
        return record.data.json();
      }),
    );
    console.log(`Read ${manifestsRead.length} manifest records`, manifestsRead);
    const missingManifests = [ExampleManifest].filter(
      (manifest) => !manifestsRead.find((manifestRead) => manifestRead?.id === manifest.id),
    );
    console.log(`Found ${missingManifests.length} unwritten manifests`);
    if (!missingManifests.length) {
      console.log('All manifests have been written to DWN');
      return [];
    }
    return missingManifests;
  }

  /**
   *
   * Create missing manifests in DWN
   * @param unwrittenManifest CredentialManifest; see {@link CredentialManifest}
   * @returns Record; see {@link Record}
   */
  public static async createMissingManifest(unwrittenManifest: CredentialManifest): Promise<Record> {
    unwrittenManifest.issuer.id = this.web5.agent.agentDid.uri;
    const { record } = await this.web5.dwn.records.create({
      store: false,
      data: unwrittenManifest,
      message: {
        schema: manifestSchema.$id,
        dataFormat: 'application/json',
        protocol: credentialIssuerProtocol.protocol,
        protocolPath: 'manifest',
        published: true,
      },
    });
    const sendResult = await record?.send(this.web5.agent.agentDid.uri);
    console.log('Sent manifest to remote DWN', sendResult);
    return !record ? ({} as Record) : record;
  }

  public static async createMissingManifests(missingManifests: CredentialManifest[]): Promise<Record[]> {
    return await Promise.all(
      missingManifests.map(
        async (unwrittenManifest: CredentialManifest) =>
          await this.createMissingManifest(unwrittenManifest),
      ),
    );
  }

  /**
   *
   * Setup DWN for credential-issuer protocol
   * @returns Promise<void>
   */
<<<<<<< Updated upstream
  @handleDwnErrors
  async setupDcxDwn(): Promise<void> {
=======
  // @handleDwnErrors
  public static async setupDcxDwn(): Promise<void> {
    console.log('Setting up DWN ...')
>>>>>>> Stashed changes
    const { status, protocols } = await this.queryDcxIssuerProtocol();
    console.log('Query status', status);
    console.log(`Found ${protocols.length} credential-issuer protocols in DWN`);

    if (!protocols.length) {
      console.log('No dcx protocol manifests found. Configuring ...');
      const result = await this.configureDcxIssuerProtocol();
      console.log('Credential-issuer protocol configured in DWN', result);
    }

    const records = await this.queryDcxIssuerManifest();
    console.log(`Found ${records.length} manifests`);

    const unwrittenManifests = await this.readMissingManifests(records);
    console.log(`Found ${unwrittenManifests.length} unwritten manifests`);

    const createdManifests = await this.createMissingManifests(unwrittenManifests);
    console.log(`Created ${createdManifests.length} manifests`);
  }
}
