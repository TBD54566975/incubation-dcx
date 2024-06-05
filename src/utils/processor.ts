import { Record, Web5 } from '@web5/api';
import { VerifiableCredential } from '@web5/credentials';
import { DidDht, PortableDid } from '@web5/dids';
import { DcxHandlers } from '../handlers/index.js';
import { credentialIssuerProtocol } from '../protocol/index.js';
import { manifestSchema } from '../protocol/index.js';

async function verifyCredentials(vp: any, requestAuthor?: string | undefined) {
  const credentials = vp.verifiableCredential;
  for (const credentialJWT of credentials) {
    // if the request author is provided, make sure credential subject matches
    if (requestAuthor) {
      const credential = VerifiableCredential.parseJwt({ vcJwt: credentialJWT });
      console.log('Credential', JSON.stringify(credential, null, 2));
      console.log('Issuer', credential.issuer);
      const doc = await DidDht.resolve(credential.issuer);
      console.log('DID  Doc', JSON.stringify(doc, null, 2));
      if (credential.subject !== requestAuthor) {
        throw new Error(
          `Credential subject ${credential.subject} does not match request author ${requestAuthor}`,
        );
      }
    }

    await VerifiableCredential.verify({ vcJwt: credentialJWT });
  }
}

export async function processMessage(web5: Web5, issuerDid: any, record: Record) {
  console.log('Process message', JSON.stringify(record, null, 2));

  // applications are JSON VP
  const vp = await record.data.json();
  console.log('Presentation', JSON.stringify(vp, null, 2));

  const requestAuthor = record.author;
  await verifyCredentials(vp, requestAuthor);
  // const issuerBearerDid = await DidDht.import({ portableDid: issuerDid });

  const response = await DcxHandlers.requestVC(vp, issuerDid, requestAuthor);;

  const { record: postRecord, status: createStatus } = await web5.dwn.records.create({
    store: false,
    data: response,
    message: {
      schema: manifestSchema.$id,
      dataFormat: 'application/json',
      protocol: credentialIssuerProtocol.protocol,
      protocolPath: 'application/response',
    },
  });

  const replyStatus = await postRecord?.send(requestAuthor);
  console.log('Sent reply to remote:', replyStatus, createStatus);
}
