import { DwnResponseStatus } from '@web5/agent';
import { Record } from '@web5/api';
import {
  PresentationExchange,
  VerifiableCredential,
  VerifiablePresentation,
} from '@web5/credentials';
import { IssuerConfig, Web5Manager, credentialIssuerProtocol } from './index.js';
import {
  DwnUtils,
  CredentialManifest,
  Handler,
  Issuer,
  DcxProtocolHandlerError,
  DwnError,
  responseSchema,
  Objects,
  stringifier,
  Logger,
  Provider
} from '../../common/index.js';
import IssuerServer from './server.js';

export class IssuerProtocolHandlers {
  constructor() {
    IssuerProtocolHandlers.selectCredentials =
      IssuerProtocolHandlers.findHandler('selectCredentials') ?? IssuerProtocolHandlers.selectCredentials;
    IssuerProtocolHandlers.verifyCredentials =
      IssuerProtocolHandlers.findHandler('verifyCredentials') ?? IssuerProtocolHandlers.verifyCredentials;
    IssuerProtocolHandlers.requestCredential =
      IssuerProtocolHandlers.findHandler('requestCredential') ?? IssuerProtocolHandlers.requestCredential;
    IssuerProtocolHandlers.issueCredential =
      IssuerProtocolHandlers.findHandler('issueCredential') ?? IssuerProtocolHandlers.issueCredential;
  }

  public static findHandler(id: string): (...args: any[]) => any | Promise<any> | undefined {
    const handler = IssuerServer.useOptions.handlers.find((handler: Handler) => handler.id === id);
    return handler?.callback;
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
    PresentationExchange.satisfiesPresentationDefinition({
      vcJwts,
      presentationDefinition: manifest.presentation_definition,
    });

    const verifiedCredentials: VerifiableCredential[] = [];

    for (const vcJwt of vcJwts) {
      Logger.debug('Parsing credential ...', vcJwt);

      const vc = VerifiableCredential.parseJwt({ vcJwt });
      Logger.debug('Parsed credential', stringifier(vc));

      if (vc.subject !== subjectDid) {
        Logger.debug(`Credential subject ${vc.subject} doesn't match subjectDid ${subjectDid}`);
        continue;
      }

      const issuers = IssuerServer.issuers.map((issuer: Issuer) => issuer.id);
      const issuerDidSet = new Set<string>([...issuers, ...IssuerConfig.DEFAULT_TRUSTED_ISSUER_DIDS]);

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
      vcJwts                 : vp.verifiableCredential,
      presentationDefinition : manifest.presentation_definition,
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
      subject : subjectDid,
      issuer  : Web5Manager.issuerAgent.agentDid.uri,
      type    : manifestOutputDescriptor.name,
    });
    Logger.debug(`Created ${manifestOutputDescriptor.id} credential`, stringifier(vc));

    const signed = await vc.sign({ did: Web5Manager.issuerAgent.agentDid });
    Logger.debug(`Signed ${manifestOutputDescriptor.id} credential`, stringifier(signed));

    return {
      fulfillment: {
        descriptor_map: [
          {
            id     : manifestOutputDescriptor.id,
            format : 'jwt_vc',
            path   : '$.verifiableCredential[0]',
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
  public static async requestCredential(
    body: { vcs: VerifiableCredential[] } | {},
    id: string,
  ): Promise<any> {
    const providers = IssuerServer.useOptions.providers!;
    const provider = providers.find((provider: Provider) => provider.id === id);

    if (!provider) {
      throw new DcxProtocolHandlerError('No VC data provider configured');
    }
    Logger.debug(`Requesting VC data from ${provider.id} at ${provider.endpoint}`);

    const response = await fetch(provider.endpoint, {
      method  : provider.method ?? 'POST',
      headers : {
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
    providerId: string,
  ): Promise<DwnResponseStatus> {

    Logger.debug('Processing application record', stringifier(applicationRecord));

    // Parse the JSON VP from the application record; this will contain the credentials
    const vp: VerifiablePresentation = await applicationRecord.data.json();
    Logger.debug('Application record verifiable presentation', stringifier(vp));

    // Select valid credentials against the manifest
    const vcJwts = IssuerProtocolHandlers.selectCredentials(vp, manifest);
    Logger.debug(`Selected ${vcJwts.length} credentials`);

    const recordAuthor = applicationRecord.author;
    const verified = await IssuerProtocolHandlers.verifyCredentials(vcJwts, manifest, recordAuthor);
    Logger.debug(`Verified ${verified.length} credentials`);

    // request vc data
    const data = await IssuerProtocolHandlers.requestCredential({ vcs: verified }, providerId);
    Logger.debug('VC data from provider', stringifier(data));

    const vc = await IssuerProtocolHandlers.issueCredential(data, recordAuthor, manifest);

    const { record, status: create } = await Web5Manager.web5.dwn.records.create({
      data    : vc,
      store   : false,
      message : {
        schema       : responseSchema.$id,
        protocol     : credentialIssuerProtocol.protocol,
        dataFormat   : 'application/json',
        protocolPath : 'application/response',
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
  }
}
