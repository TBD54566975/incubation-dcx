import { Record, Web5 } from '@web5/api';
import { PresentationExchange, VerifiableCredential, VerifiablePresentation } from '@web5/credentials';
import { BearerDid, DidDht } from "@web5/dids";

import { config } from "../../config/index.js";
import { AdditionalProperties, TrustedIssuer, VcRequestBody } from '../../types/dcx.js';
import { stringify } from '../../utils/json.js';
import { credentialIssuerProtocol, responseSchema } from '../index.js';

import Manifest from "../manifests/MANIFEST.json";

export class DcxHandlers {

    static async processApplicationRecord(web5: Web5, issuerDid: BearerDid, record: Record) {
        console.log('Process message', stringify(record));

        // applications are JSON VP
        const vp: VerifiablePresentation = await record.data.json();
        console.log('Presentation', stringify(vp));

        const requestAuthor = record.author;
        await this.verifyCredentials(vp, requestAuthor);
        const response = await this.issueVC(vp, issuerDid, requestAuthor);

        const { record: postRecord, status: createStatus } = await web5.dwn.records.create({
            store: false,
            data: response,
            message: {
                schema: responseSchema.$id,
                protocol: credentialIssuerProtocol.protocol,
                dataFormat: 'application/json',
                protocolPath: 'application/response',
            },
        });

        const replyStatus = await postRecord?.send(requestAuthor);
        console.log('Sent reply to remote:', replyStatus, createStatus);
    }

    static async verifyCredentials(vp: VerifiablePresentation, requestAuthor?: string | undefined) {
        const credentials = vp.verifiableCredential;
        for (const credentialJWT of credentials) {
            // if the request author is provided, make sure credential subject matches
            if (requestAuthor) {
                const credential = VerifiableCredential.parseJwt({ vcJwt: credentialJWT });
                console.log('Credential', stringify(credential));
                console.log('Issuer', credential.issuer);
                const doc = await DidDht.resolve(credential.issuer);
                console.log('DID  Doc', stringify(doc));
                if (credential.subject !== requestAuthor) {
                    throw new Error(
                        `Credential subject ${credential.subject} does not match request author ${requestAuthor}`,
                    );
                }
            }
            await VerifiableCredential.verify({ vcJwt: credentialJWT });
        }
    }

    static async issueVC(presentation: any, dcxIssuerDid: BearerDid, subjectDid: string) {
        // filter valid creds
        console.log('Presentation', stringify(presentation));
        const selectedVcJwts: string[] = PresentationExchange.selectCredentials({
            vcJwts: presentation.verifiableCredential,
            presentationDefinition: Manifest.presentation_definition
        })

        console.log('Valid creds selected', stringify(selectedVcJwts));

        const trustedIssuerDids = config.INPUT_VC_TRUSTED_ISSUERS.map((trustedIssuer: TrustedIssuer) => trustedIssuer.did);
        const validInputVcs: VerifiableCredential[] = [];
        for (const vcJwt of selectedVcJwts) {
            console.log('Parsing vc', vcJwt)
            const vc = VerifiableCredential.parseJwt({ vcJwt });
            console.log('parsed vc', stringify(vc))
            // TODO: Verify credential subject id is same as subjectId
            console.log('vcJson', vc.vcDataModel.credentialSubject);
            if (trustedIssuerDids.includes(vc.vcDataModel.issuer)) {
                validInputVcs.push(vc);
            }
        }
        console.log('Found valid VCs ...', validInputVcs.length);

        // request vc data
        const vcData = await this.vcDataRequest({ validInputVcs });
        console.log('Got VC data from Issuer', vcData);

        // generate vc
        const outputVc = await VerifiableCredential.create({
            type: config.OUTPUT_VC_NAME,
            issuer: trustedIssuerDids,
            subject: subjectDid,
            data: vcData,
        });
        // sign vc
        const signedOutputVc = await outputVc.sign({ did: dcxIssuerDid });

        return {
            fulfillment: {
                descriptor_map: [
                    {
                        "id": "atp-report-summary",
                        "format": "jwt_vc",
                        "path": "$.verifiableCredential[0]"
                    },
                ]
            },
            verifiableCredential: signedOutputVc
        }
    }

    static async vcDataRequest(
        body: VcRequestBody,
        method: string = 'POST',
        headers: AdditionalProperties = {
            'Content-Type': 'application/json'
        }
    ) {
        console.log('Using config', stringify(config));
        console.log(`Sending request to vc data provider ${config.OUTPUT_VC_DATA_PROVIDER} at endpoint ${config.OUTPUT_VC_DATA_PROVIDER_ENDPOINT}`);
        const response = await fetch(config.OUTPUT_VC_DATA_PROVIDER_ENDPOINT, {
            method,
            headers,
            body: stringify(body),
        })
        console.log('Got response from vc data service provider', stringify(response));
        const data = await response.json();
        console.log('Got data from vc data service provider', stringify(data));
        return data;
    }

}



// export async function decryptVC(presentation: any, issuerDid: PortableDid, subjectDid: string) {
//     // filter valid creds
//     const validInputVcs = PresentationExchange.selectCredentials({ vcJwts: presentation, presentationDefinition: Manifest.presentation_definition })

//     const credentialJwt = validInputVcs[0];
//     const vc = VerifiableCredential.parseJwt({ vcJwt: credentialJwt });
//     const vcDataModel: VcDataModel = vc.vcDataModel;
//     const credentialSubject: VerifiableCredentialDCX = vcDataModel.credentialSubject;
//     const decrypted = Cipher.aes256CbcDecrypt(config.CIPHER_KEY, config.CIPHER_KEY, credentialSubject?.encrypted);

//     // generate VCs
//     const decryptedVC = await VerifiableCredential.create({
//         type: config.ISSUER_VC_TYPE,
//         issuer: issuerDid.uri,
//         subject: subjectDid,
//         data: JSON.parse(decrypted.toString()),
//     });

//     const decryptedVCJwt = await decryptedVC.sign({ did: issuerDid });

//     return {
//         fulfillment: {
//             descriptor_map: [
//                 {
//                     "id": "atp-report",
//                     "format": "jwt_vc",
//                     "path": "$.verifiableCredential[0]"
//                 },
//             ]
//         },
//         verifiableCredential: [decryptedVCJwt]
//     }
// }