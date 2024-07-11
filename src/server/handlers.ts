import { DwnResponseStatus } from '@web5/agent';
import { Record } from '@web5/api';
import {
  PresentationExchange,
  VerifiableCredential,
  VerifiablePresentation,
} from '@web5/credentials';
import { Config } from './config.js';
import { server, Web5Manager } from './index.js';
import { CredentialManifest, Issuer } from '../types/dcx.js';
import { DwnUtils } from '../utils/dwn.js';
import { DcxProtocolHandlerError, DwnError } from '../utils/error.js';
import { Objects, stringifier } from '../utils/index.js';
import { Logger } from '../utils/logger.js';
import { credentialIssuerProtocol } from '../protocol/index.js';
import { responseSchema } from '../schemas/index.js';


export class ProtocolHandlers {
  [key: string | number | symbol]: (() => Promise<any>) | ((...args: any[]) => any);

  constructor() {
    this.selectCredentials =
      server.handlers.get('selectCredentials') ?? ProtocolHandlers.selectCredentials;
    this.verifyCredentials =
      server.handlers.get('verifyCredentials') ?? ProtocolHandlers.verifyCredentials;
    this.requestCredential =
      server.handlers.get('requestCredential') ?? ProtocolHandlers.requestCredential;
    this.issueCredential =
      server.handlers.get('issueCredential') ?? ProtocolHandlers.issueCredential;
  }

  /**
   *
   * Verify the credentials in a Verifiable Presentation
   * @param vcs The selected credentials to verify
   * @param subjectDid The DID of the subject of the credentials
   * @returns An array of verified credentials
   */
  public static async verifyCredentials(
    vcJwts: string[],
    manifest: CredentialManifest,
    subjectDid: string,
  ): Promise<VerifiableCredential[]> {
    try {
      PresentationExchange.satisfiesPresentationDefinition({
        vcJwts,
        presentationDefinition: manifest.presentation_definition,
      });

      const verifiedCredentials = [];

      for (const vcJwt of vcJwts) {
        Logger.debug('Parsing credential ...', vcJwt);

        const vc = VerifiableCredential.parseJwt({ vcJwt });
        Logger.debug('Parsed credential', stringifier(vc));

        if (vc.subject !== subjectDid) {
          Logger.debug(`Credential subject ${vc.subject} doesn't match subjectDid ${subjectDid}`);
          continue;
        }

        const useIssuers = Object.values(server.issuers).map((issuer: Issuer) => issuer.id);
        const issuerDidSet = new Set<string>([...useIssuers, ...Config.VC_TRUSTED_ISSUER_DIDS]);

        if (!issuerDidSet.has(vc.vcDataModel.issuer as string)) {
          continue;
        }

        const verified = await VerifiableCredential.verify({ vcJwt });
        if (!verified || Objects.isEmptyObject(verified)) {
          Logger.debug('Credential verification failed');
          continue;
        }
        verifiedCredentials.push(vc);
      }
      return verifiedCredentials;
    } catch (error) {
      Logger.error(ProtocolHandlers.name, error);
      throw error;
    }
  }

  /**
   *
   * Select credentials from a Verifiable Presentation
   * @param vp The verifiable presentation
   * @param manifest The credential manifest
   * @returns An array of selected credentials
   */
  public static selectCredentials(
    vp: VerifiablePresentation,
    manifest: CredentialManifest,
  ): string[] {
    Logger.debug('Using verifiable presentation for credential selection', stringifier(vp));
    return PresentationExchange.selectCredentials({
      vcJwts: vp.verifiableCredential,
      presentationDefinition: manifest.presentation_definition,
    });
  }

  /**
   *
   * Issue a credential
   * @param data The data to include in the credential
   * @param subjectDid The DID of the subject of the credential
   * @param manifest The credential manifest
   * @returns The issued credential
   */
  public static async issueCredential(
    data: any,
    subjectDid: string,
    manifest: CredentialManifest,
  ): Promise<any> {
    const manifestOutputDescriptor = manifest.output_descriptors[0];
    Logger.debug(`Issuing ${manifestOutputDescriptor.id} credential`);

    const vc = await VerifiableCredential.create({
      data,
      subject: subjectDid,
      issuer: Web5Manager.connected.did,
      type: manifestOutputDescriptor.name,
    });
    Logger.debug(`Created ${manifestOutputDescriptor.id} credential`, stringifier(vc));

    const signed = await vc.sign({ did: Web5Manager.connected.bearerDid });
    Logger.debug(`Signed ${manifestOutputDescriptor.id} credential`, stringifier(signed));

    return {
      fulfillment: {
        descriptor_map: [
          {
            id: manifestOutputDescriptor.id,
            format: 'jwt_vc',
            path: '$.verifiableCredential[0]',
          },
        ],
      },
      verifiableCredential: [signed],
    };
  }

  /**
   *
   * Request credential data from a VC data provider
   * @param body The body of the request
   * @param method The HTTP method to use
   * @param headers The headers to include in the request
   * @returns The response from the VC data provider
   */
  public static async requestCredential(body: { vcs: VerifiableCredential[] } | {}): Promise<any> {
    const providers = server.providers;
    const provider =
      providers.get(Config.NODE_ENV) ?? providers.get(0) ?? Array.from(providers.values()).shift();

    if (!provider) {
      throw new DcxProtocolHandlerError('No VC data provider configured');
    }
    Logger.debug(`Requesting VC data from ${provider.name} at ${provider.endpoint}`);

    const response = await fetch(provider.endpoint, {
      method: provider.method ?? 'POST',
      headers: {
        ...provider.headers,
        'Content-Type': 'application/json',
      },
      body: stringifier(body),
    });
    Logger.debug('VC request response', stringifier(response));

    const data = await response.json();
    Logger.debug('VC request data', stringifier(data));

    return data;
  }

  /**
   *
   * Process an application record
   * @param applicationRecord The application record to process
   * @param manifest The credential manifest
   * @returns The status of the application record processing
   */
  public static async processApplicationRecord(
    applicationRecord: Record,
    manifest: CredentialManifest,
  ): Promise<DwnResponseStatus> {
    try {
      Logger.debug('Processing application record', stringifier(applicationRecord));

      // Parse the JSON VP from the application record; this will contain the credentials
      const vp: VerifiablePresentation = await applicationRecord.data.json();
      Logger.debug('Application record verifiable presentation', stringifier(vp));

      // Select valid credentials against the manifest
      const vcJwts = ProtocolHandlers.selectCredentials(vp, manifest);
      Logger.debug(`Selected ${vcJwts.length} credentials`);

      const recordAuthor = applicationRecord.author;
      const verified = await ProtocolHandlers.verifyCredentials(vcJwts, manifest, recordAuthor);
      Logger.debug(`Verified ${verified.length} credentials`);

      // request vc data
      const data = await ProtocolHandlers.requestCredential({ vcs: verified });
      Logger.debug('VC data from provider', stringifier(data));

      const vc = await ProtocolHandlers.issueCredential(data, recordAuthor, manifest);

      const { record, status: create } = await Web5Manager.web5.dwn.records.create({
        data: vc,
        store: false,
        message: {
          schema: responseSchema.$id,
          protocol: credentialIssuerProtocol.protocol,
          dataFormat: 'application/json',
          protocolPath: 'application/response',
        },
      });

      if (DwnUtils.isFailure(create.code)) {
        const { code, detail } = create;
        Logger.error(`${this.name}: DWN records create failed`, create);
        throw new DwnError(code, detail);
      }

      if (!record) {
        throw new DcxProtocolHandlerError('Failed to create application response record.');
      }

      const { status: send } = await record?.send(recordAuthor);
      if (DwnUtils.isFailure(send.code)) {
        const { code, detail } = send;
        Logger.error(`${this.name}: DWN records send failed`, send);
        throw new DwnError(code, detail);
      }

      Logger.debug(`${this.name}: Sent application response to applicant DWN`, send, create);

      return { status: send };
    } catch (error: any) {
      Logger.error(this.name, error);
      throw error;
    }
  }
}
