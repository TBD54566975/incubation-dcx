import {
  DcxHandshakeManifest,
  EmailAddressManifest,
  Handler,
  CredentialManifest,
  PhoneNumberManifest,
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
export const FF = { name: 'formfree', id: 'did:dht:hcf5e55bbm44s4oixp5z89wtxenxyk35su7f5pd4r5np93ikyowy' };

export const dcxConfig: DcxConfig = {
  handlers  : [],
  providers : [],
  manifests : [DcxHandshakeManifest, PhoneNumberManifest, EmailAddressManifest],
  issuers   : [MX, FF],
  gateways  : ['https://diddht.tbddev.org/'],
  dwns      : ['https://dwn.tbddev.org/beta'],
};