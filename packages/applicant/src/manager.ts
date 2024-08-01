import {
  DcxAgent,
  DcxIdentityVault,
  DwnError,
  DwnUtils,
  Logger,
  ServerManifest,
  Time
} from '@dcx-protocol/common';
import {
  ProtocolsConfigureResponse,
  ProtocolsQueryResponse,
  Web5
} from '@web5/api';
import { applicant } from './index.js';

/**
 * DWN manager handles interactions between the DCX server and the DWN
 */
export class ApplicantManager {
  public static web5: Web5;
  public static applicantAgent: DcxAgent;
  public static applicantAgentVault: DcxIdentityVault;
  public static applicantManifests: ServerManifest[];
  /**
   * Sync DWN
   */
  public static sync(): void {
    Logger.log('Syncing dwn ...');
    ApplicantManager.applicantAgent.sync.startSync({ interval: '1ms' });

    Time.sleep(1000);

    ApplicantManager.applicantAgent.sync.stopSync();
    Logger.log('Syncing done!');
  }
  /**
   * Query DWN for credential-applicant protocol
   * @returns Protocol[]; see {@link Protocol}
   */
  public static async protocolsQuery(): Promise<ProtocolsQueryResponse> {
    // Query DWN for credential-applicant protocol
    const { status: query, protocols = [] } = await ApplicantManager.web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: applicant.protocol,
        },
      },
    });

    if (DwnUtils.isFailure(query.code)) {
      const { code, detail } = query;
      Logger.error(`ApplicantManager.protocolsQuery: DWN protocols query failed`, query);
      throw new DwnError(code, detail);
    }

    Logger.log(`DWN has ${protocols.length} protocols available`);
    return { status: query, protocols };
  }

  /**
   * Configure DWN for credential-applicant protocol
   * @returns DwnResponseStatus; see {@link DwnResponseStatus}
   */
  public static async configureProtocols(): Promise<ProtocolsConfigureResponse> {
    const { status: configure, protocol } = await ApplicantManager.web5.dwn.protocols.configure({
      message: { definition: applicant },
    });

    if (DwnUtils.isFailure(configure.code) || !protocol) {
      const { code, detail } = configure;
      Logger.error('DWN protocol configure fail', configure, protocol);
      throw new DwnError(code, detail);
    }

    const { status: send } = await protocol.send(ApplicantManager.applicantAgent.agentDid.uri);

    if (DwnUtils.isFailure(send.code)) {
      const { code, detail } = send;
      Logger.error('DWN protocols send failed', send);
      throw new DwnError(code, detail);
    }

    Logger.log('Sent protocol to remote DWN', send);
    return { status: send, protocol };
  }

  /**
   * Setup DWN with credential-applicant protocol and manifest records
   * @returns boolean indicating success or failure
   */
  public static async setup(): Promise<void> {
    // Logger.log('Setting up dwn ...');
    try {
      // Query DWN for credential-applicant protocols
      const { protocols } = await ApplicantManager.protocolsQuery();
      Logger.log(`Found ${protocols.length} dcx applicant protocol(s) in dwn`, protocols);

      // Configure DWN with credential-applicant protocol if not found
      if (!protocols.length) {
        Logger.log('Configuring dwn with dcx applicant protocol ...');
        const { status, protocol } = await ApplicantManager.configureProtocols();
        Logger.log(
          `Configured credential applicant protocol in dwn: ${status.code} - ${status.detail}`,
          protocol,
        );
      }

      Logger.log('DWN Setup Complete!');
    } catch (error: any) {
      Logger.error(`DWN Setup Failed!`, error);
      throw error;
    }
  }
}
