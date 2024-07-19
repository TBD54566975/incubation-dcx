import { Jwk } from '@web5/crypto';
import { PortableDid, DidDocument, DidDocumentMetadata, BearerDid } from '@web5/dids';

export class PortableDidBuilder implements PortableDid {
  uri: string;
  document: DidDocument;
  metadata: DidDocumentMetadata;
  privateKeys: Jwk[];

  constructor(
    uri: string,
    document: DidDocument,
    metadata: DidDocumentMetadata,
    privateKeys: Jwk[],
  ) {
    this.uri = uri;
    this.document = document;
    this.metadata = metadata;
    this.privateKeys = privateKeys;
  }
}

export type DidDhtManagerConfig = {
  did: string;
  bearerDid: BearerDid;
  portableDid: PortableDid;
};

export const JWK_PRIVATE_KEY_FORMAT = { crv: 'Ed25519', kty: 'OKP', x: '' };
