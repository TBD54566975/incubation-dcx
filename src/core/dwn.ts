import { DwnResponseStatus } from '@web5/agent';
import { ProtocolsQueryResponse, Record, Web5 } from '@web5/api';
import { credentialIssuerProtocol, ExampleManifest, manifestSchema } from '../protocol/index.js';
import { CredentialManifest } from '../types/dcx.js';
import { DcxDwnError } from '../utils/error.js';

/**
 *
 * @param web5
 * @param did
 * @returns
 */
export async function configureDcxIssuerProtocol(
  web5: Web5,
  did: string,
): Promise<DwnResponseStatus> {
  const { status: configure, protocol } = await web5.dwn.protocols.configure({
    message: { definition: credentialIssuerProtocol },
  });
  if (configure.code < 200 || configure.code >= 300) {
    const { code, detail } = configure;
    console.error(
      'configureDcxIssuerProtocol configure.code < 200 || configure.code >= 300',
      configure,
    );
    throw new DcxDwnError(code, detail);
  }
  if (!protocol) {
    const { code, detail } = configure;
    console.error('configureDcxIssuerProtocol !protocol', protocol);
    throw new DcxDwnError(code, detail);
  }
  console.log('Configured credential issuer protocol', protocol);

  const { status: send } = (await protocol.send(did)) ?? {};
  if (send.code < 200 || send.code >= 300) {
    const { code, detail } = send;
    console.error('configureDcxIssuerProtocol send.code < 200 || send.code >= 300', send);
    throw new DcxDwnError(code, detail);
  }
  console.log('Successfully sent protocol to remote DWN');
  return { status: send };
}

/**
 *
 * @param web5
 * @param did
 * @returns
 */
export async function queryDcxIssuerProtocol(
  web5: Web5,
  did: string,
): Promise<ProtocolsQueryResponse> {
  // Query DWN for credential-issuer protocol
  const { status: query, protocols = [] } = await web5.dwn.protocols.query({
    from: did,
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
 * @param web5
 * @param did
 * @returns
 */
export async function queryDcxIssuerManifest(web5: Web5, did: string): Promise<Record[]> {
  const { records: manifestRecords = [] } = await web5.dwn.records.query({
    from: did,
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
 * @param web5
 * @param did
 * @param manifestRecords
 * @returns
 */
export async function findUnwrittenManifests(
  web5: Web5,
  did: string,
  manifestRecords: Record[],
): Promise<CredentialManifest[]> {
  ``;
  const manifestsRead = await Promise.all(
    manifestRecords.map(async (manifestRecord) => {
      const { record } = await web5.dwn.records.read({
        from: did,
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
 * @param web5
 * @param did
 * @param unwrittenManifest
 * @returns
 */
export async function createMissingManifests(
  web5: Web5,
  did: string,
  unwrittenManifest: CredentialManifest,
) {
  unwrittenManifest.issuer.id = did;
  const { record } = await web5.dwn.records.create({
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
  const sendResult = await record?.send(did);
  console.log('Sent manifest to remote DWN', sendResult);
  if (!!record) {
    return record;
  }
}

/**
 *
 * @param web5
 * @param did
 */
export async function setupDcxDwn(web5: Web5, did: string): Promise<void> {
  const { status, protocols } = await queryDcxIssuerProtocol(web5, did);
  console.log(`DWN credential-issuer protocol query status ${status}`);
  if (!protocols.length) {
    console.log('No credential-issuer protocol in DWN. Configuring credential-issuer protocol ...');
    const result = await configureDcxIssuerProtocol(web5, did);
    console.log('Credential-issuer protocol configured in DWN', result);
  }

  const manifestRecords = await queryDcxIssuerManifest(web5, did);
  console.log(`Found ${manifestRecords.length} manifests`);

  const missingManifests = await findUnwrittenManifests(web5, did, manifestRecords);
  console.log(`Found ${missingManifests.length} missing manifests`);
  if (!!missingManifests.length) {
    const manifestWrites: (Record | undefined)[] = await Promise.all(
      missingManifests.map(
        async (unwrittenManifest: CredentialManifest) =>
          await createMissingManifests(web5, did, unwrittenManifest),
      ),
    );
    console.log(`Wrote ${manifestWrites.length} manifests`);
  }
}
