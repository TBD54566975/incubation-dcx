import {
  DcxHandshakeManifest,
  Handler,
  CredentialManifest,
  Provider,
  TrustedIssuer
} from './index.js';

export type DcxConfig = {
  handlers: Handler[];
  providers: Provider[];
  manifests: CredentialManifest[];
  issuers: TrustedIssuer[];
  gateways: string[];
  dwns: string[];
}

export const MX = { name: 'mx', id: 'did:dht:kfcakjzahwimgo9zzjw6yknt9srdtkmfqbeybekcg3xzz1ztg95y' };

export const dcxConfig: DcxConfig = {
  handlers  : [],
  providers : [],
  manifests : [DcxHandshakeManifest],
  issuers   : [MX],
  gateways  : ['https://diddht.tbddev.org/'],
  dwns      : ['https://dwn.tbddev.org/beta'],
};