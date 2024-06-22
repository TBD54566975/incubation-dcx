import { Record, Web5 } from '@web5/api';
import {
  PresentationExchange,
  VcDataModel,
  VerifiableCredential,
  VerifiablePresentation,
} from '@web5/credentials';
import { BearerDid, DidDht } from '@web5/dids';
import { DcxEnv } from '../config/env.js';

import {
  AdditionalProperties,
  CredentialManifest,
  TrustedIssuer,
  VcRequestBody,
} from '../types/dcx.js';
import { stringifier } from '../utils/index.js';
import { credentialIssuerProtocol, responseSchema } from './index.js';
import { Web5Manager } from '../core/index.js';

type VerificationResponse = {
  issuer: string;
  subject: string;
  vc: VcDataModel;
};

export class ProtocolHandlers {
  /**
   *
   * Processes a DCX application record
   * @param web5 web5 api object; see {@link Web5}
   * @param bearerDid bearer did object; see {@link BearerDid}
   * @param record Dwn record object; see {@link Record}a
   */
  public static async processDcxApplication(record: Record, manifest: CredentialManifest) {
    console.log('Process record', stringifier(record));

    // applications are JSON VP
    const vp: VerifiablePresentation = await record.data.json();

    console.log('Presentation', stringifier(vp));

    const recordAuthor = record.protocolPath;

    await ProtocolHandlers.verifyCredentials(vp, recordAuthor);

    const response = await ProtocolHandlers.issueVC(recordAuthor, vp, manifest);

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

    console.log('Sent reply to remote:', replyStatus, createStatus);
  }

  /**
   *
   * @param vp Dcx application VCs for review and verification; see {@link VerifiablePresentation}
   * @param recordAuthor Dwn Record author; see {@link Record.author}
   */
  public static async verifyCredentials(vp: VerifiablePresentation, recordAuthor?: string): Promise<VerificationResponse[]> {
    const verifications = [];
    const credentials = vp.verifiableCredential;
    for (const credentialJWT of credentials) {
      // if the request author is provided, make sure credential subject matches
      if (recordAuthor) {
        const credential = VerifiableCredential.parseJwt({ vcJwt: credentialJWT });
        console.log('Credential', stringifier(credential));
        console.log('Issuer', credential.issuer);
        const doc = await DidDht.resolve(credential.issuer);
        console.log('DID  Doc', stringifier(doc));
        if (credential.subject !== recordAuthor) {
          throw new Error(
            `Credential subject ${credential.subject} does not match request author ${recordAuthor}`,
          );
        }
      }
      const verify = await VerifiableCredential.verify({ vcJwt: credentialJWT });
      verifications.push(verify);
    }
    return verifications;
  }

  /**
   *
   * @param vp
   * @param issuerDid
   * @param subjectDid
   * @returns
   */

  public static async issueVC(subjectDid: string, vp: VerifiablePresentation, credentialManifest: CredentialManifest) {
    // filter valid creds
    console.log('Verifiable Presentation', stringifier(vp));
    const selectedVcJwts: string[] = PresentationExchange.selectCredentials({
      vcJwts: vp.verifiableCredential,
      presentationDefinition: credentialManifest.presentation_definition,
    });

    console.log('Valid creds selected', stringifier(selectedVcJwts));

    const trustedIssuerDids = DcxEnv.VC_TRUSTED_ISSUERS.map(
      (trustedIssuer: TrustedIssuer) => trustedIssuer.did,
    );
    const validInputVcs: VerifiableCredential[] = [];
    for (const vcJwt of selectedVcJwts) {
      console.log('Parsing vc', vcJwt);
      const vc = VerifiableCredential.parseJwt({ vcJwt });
      console.log('parsed vc', stringifier(vc));
      // TODO: Verify credential subject id is same as subjectId
      console.log('vcJson', vc.vcDataModel.credentialSubject);
      if (trustedIssuerDids.includes(vc.vcDataModel.issuer)) {
        validInputVcs.push(vc);
      }
    }
    console.log('Found valid VCs ...', validInputVcs.length);

    // request vc data
    const vcData = await ProtocolHandlers.vcDataRequest({ validInputVcs });
    console.log('Got VC data from Issuer', vcData);

    // generate vc
    const outputVc = await VerifiableCredential.create({
      type: DcxEnv.VC_NAME,
      issuer: trustedIssuerDids,
      subject: subjectDid,
      data: vcData,
    });
    // sign vc
    const signedOutputVc = await outputVc.sign({ did: Web5Manager.bearerDid });

    return {
      fulfillment: {
        descriptor_map: [
          {
            id: 'atp-report-summary',
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
  public static async vcDataRequest(
    body: VcRequestBody,
    method: string = 'POST',
    headers: AdditionalProperties = {
      'Content-Type': 'application/json',
    },
  ) {
    console.log('Using config', stringifier(DcxEnv));
    console.log(`Using vc data provider ${DcxEnv.VC_DATA_PROVIDER}`);
    console.log(`Sending request to vc data provider endpoint ${DcxEnv.VC_DATA_PROVIDER_ENDPOINT}`);

    const response = await fetch(DcxEnv.VC_DATA_PROVIDER_ENDPOINT, {
      method,
      headers,
      body: stringifier(body),
    });
    console.log('Got response from vc data service provider', stringifier(response));

    const data = await response.json();
    console.log('Got data from vc data service provider', stringifier(data));

    return data;
  }
}

// TODO: create and update invocies as responses to applications
// TODO: include some kind of toggle / flag to allow devs to use a encrypt/decrypt function below
/*
export async function decryptVC(presentation: any, issuerDid: PortableDid, subjectDid: string) {
    // filter valid creds
    const validInputVcs = PresentationExchange.selectCredentials({ vcJwts: presentation, presentationDefinition: Manifest.presentation_definition })

    const credentialJwt = validInputVcs[0];
    const vc = VerifiableCredential.parseJwt({ vcJwt: credentialJwt });
    const vcDataModel: VcDataModel = vc.vcDataModel;
    const credentialSubject: VerifiableCredentialDCX = vcDataModel.credentialSubject;
    const decrypted = Cipher.aes256CbcDecrypt(config.CIPHER_KEY, config.CIPHER_KEY, credentialSubject?.encrypted);

    // generate VCs
    const decryptedVC = await VerifiableCredential.create({
        type: config.ISSUER_VC_TYPE,
        issuer: issuerDid.uri,
        subject: subjectDid,
        data: JSON.parse(decrypted.toString()),
    });

    const decryptedVCJwt = await decryptedVC.sign({ did: issuerDid });

    return {
        fulfillment: {
            descriptor_map: [
                {
                    "id": "atp-report",
                    "format": "jwt_vc",
                    "path": "$.verifiableCredential[0]"
                },
            ]
        },
        verifiableCredential: [decryptedVCJwt]
    }
}
*/
