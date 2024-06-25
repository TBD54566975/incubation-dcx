import { Record } from '@web5/api';
import {
  PresentationExchange,
  VerifiableCredential,
  VerifiablePresentation
} from '@web5/credentials';
import { Config } from '../config.js';

import { Web5Manager } from '../core/index.js';
import {
  AdditionalProperties,
  CredentialManifest,
  TrustedIssuer,
  VcDataRequest,
  VcVerification
} from '../types/dcx.js';
import { DcxProtocolHandlerError } from '../utils/error.js';
import { stringifier } from '../utils/index.js';
import Logger from '../utils/logger.js';
import { credentialIssuerProtocol, responseSchema } from './index.js';


export class ProtocolHandlerUtils {

  /**
   *
   * Verify DCX application VCs
   * @param vp Dcx application VCs for review and verification; see {@link VerifiablePresentation}
   * @param recordAuthor Dwn Record author; see {@link Record.author}
   */
  public static async verifyCredentials(vp: VerifiablePresentation, recordAuthor: string): Promise<VcVerification[]> {
    const verifications = [];
    const credentials = vp.verifiableCredential;
    for (const credential of credentials) {
      // Parse VC
      const vc = VerifiableCredential.parseJwt({ vcJwt: credential });
      Logger.debug('Parsed verifiable credential', stringifier(credential));

      // Check if credential subject matches record author; i.e. verify that the credential holder is the one submitting the application 
      if (vc.subject !== recordAuthor) {
        throw new DcxProtocolHandlerError(
          `Credential subject ${vc.subject} does not match record author ${recordAuthor}`,
        );
      }

      if (!Config.VC_TRUSTED_ISSUER_DIDS.includes(vc.issuer)) {
        throw new DcxProtocolHandlerError(`Credential issuer ${vc.issuer} not trusted`,);
      }

      const verify = await VerifiableCredential.verify({ vcJwt: credential });
      verifications.push(verify);
    }
    return verifications;
  }

}
export class ProtocolHandlers extends ProtocolHandlerUtils {

  /**
   * 
   * Processes an application record
   * @param record 
   * @param manifest 
   */
  public static async processApplicationRecord(record: Record, manifest: CredentialManifest) {
    try {
      Logger.debug('Processing application record', stringifier(record));
      // applications are JSON VP
      const vp: VerifiablePresentation = await record.data.json();
      Logger.debug('Application record verifiable presentation', stringifier(vp));

      const recordAuthor = record.author;

      const valid = await ProtocolHandlers.verifyCredentials(vp, recordAuthor);
      if (!valid) {

      }

      const response = await ProtocolHandlers.issueVerifiableCredential(vp, recordAuthor, manifest);

      const { record: postRecord, status: createStatus } = await Web5Manager.web5.dwn.records.create({
        store: false,
        data: response,
        message: {
          schema: responseSchema.$id,
          protocol: credentialIssuerProtocol.protocol,
          dataFormat: 'application/json',
          protocolPath: 'application/response',
        },
      });

      const replyStatus = await postRecord?.send(recordAuthor);

      Logger.debug('Sent reply to remote:', replyStatus, createStatus);
    } catch (error: any) {
      Logger.error(this.name, error);
      throw error;
    }
  }

  /**
   * 
   * Issue a Verifiable Credential
   * @param subjectDid 
   * @param vp 
   * @param credentialManifest 
   * @returns 
   */
  public static async issueVerifiableCredential(vp: VerifiablePresentation, subjectDid: string, credentialManifest: CredentialManifest) {
    const manifest = Web5Manager.manifests?.[0];
    if (!manifest) {
      throw new DcxProtocolHandlerError('No manifest found');
    }

    // filter valid creds
    Logger.debug('Parsing verfiable credentials against verifiable presentation', stringifier(vp));
    const selectedVcs: string[] = PresentationExchange.selectCredentials({
      vcJwts: vp.verifiableCredential,
      presentationDefinition: credentialManifest.presentation_definition,
    });
    Logger.debug(`Found ${selectedVcs.length} Verifiable Credentials`);

    const trustedIssuerDids = Config.VC_TRUSTED_ISSUERS.map(
      (trustedIssuer: TrustedIssuer) => trustedIssuer.did,
    );
    const vaidSubmissionVcs: VerifiableCredential[] = [];
    for (const vcJwt of selectedVcs) {
      Logger.debug('Parsing VC', vcJwt);
      const vc = VerifiableCredential.parseJwt({ vcJwt });
      Logger.debug('Parsed VC', stringifier(vc));
      if (vc.subject !== subjectDid) {
        continue;
      }
      Logger.debug('vcJson', vc.vcDataModel.credentialSubject);
      if (trustedIssuerDids.includes(vc.vcDataModel.issuer)) {
        vaidSubmissionVcs.push(vc);
      }
    }
    Logger.debug(`Found ${vaidSubmissionVcs.length} valid VCs`);

    // request vc data
    const vcData = await ProtocolHandlers.requestVerifiableCredentialData({ vaidSubmissionVcs });
    Logger.debug('Got VC data from Issuer', vcData);

    // generate vc
    const outputVc = await VerifiableCredential.create({
      type: Config.VC_NAME,
      issuer: trustedIssuerDids,
      subject: subjectDid,
      data: vcData,
    });
    // sign vc
    const signedOutputVc = await outputVc.sign({ did: Web5Manager.connectedDid.bearerDid });

    return {
      fulfillment: {
        descriptor_map: [
          {
            id: manifest.output_descriptors[0].id,
            format: 'jwt_vc',
            path: '$.verifiableCredential[0]',
          },
        ],
      },
      verifiableCredential: signedOutputVc,
    };
  }

  /**
   *
   * @param body
   * @param method
   * @param headers
   * @returns
   */
  public static async requestVerifiableCredentialData(
    body: VcDataRequest,
    method: string = 'POST',
    headers: AdditionalProperties = {
      'Content-Type': 'application/json',
    },
  ) {
    Logger.debug(`Requesting VC data from ${Config.VC_DATA_PROVIDER} at ${Config.VC_DATA_PROVIDER_ENDPOINT}`);

    const response = await fetch(Config.VC_DATA_PROVIDER_ENDPOINT, {
      method,
      headers,
      body: stringifier(body),
    });
    Logger.debug('VC request response', stringifier(response));

    const data = await response.json();
    Logger.debug('VC request data', stringifier(data));

    return data;
  }
}

// TODO: create and update invocies as responses to applications
// TODO: include some kind of toggle / flag to allow devs to use a encrypt/decrypt function below