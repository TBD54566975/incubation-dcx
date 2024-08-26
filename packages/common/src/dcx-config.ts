import {
  DcxHandshakeManifest,
  DcxOptions,
  EmailAddressManifest,
  PhoneNumberManifest
} from './index.js';

export type DcxIssuerConfig = {
  cursorFile: string;
  lastRecordIdFile: string;
  web5Password: string;
  web5RecoveryPhrase: string;
  agentDataPath: string;
};

export type DcxApplicantConfig = {
  web5Password: string;
  web5RecoveryPhrase: string;
};

export const MX = { name: 'mx', id: 'did:dht:kfcakjzahwimgo9zzjw6yknt9srdtkmfqbeybekcg3xzz1ztg95y' };
export const FF = { name: 'formfree', id: 'did:dht:hcf5e55bbm44s4oixp5z89wtxenxyk35su7f5pd4r5np93ikyowy' };

export const defaultTrustedIssuers = [MX, FF];

export const dcxConfig = {
  DcxHandshakeManifest,
  PhoneNumberManifest,
  EmailAddressManifest,
  issuers      : defaultTrustedIssuers,
  manifests    : [DcxHandshakeManifest, PhoneNumberManifest, EmailAddressManifest],
  dwnEndpoints : ['https://dwn.tbddev.org/beta'],
  gatewayUris  : ['https://diddht.tbddev.org/'],
  issuer       : {
    cursorFile         : 'issuer-cursor.json',
    lastRecordIdFile   : 'lastRecordId.issuer',
    web5Password       : process.env.ISSUER_WEB5_PASSWORD        ?? '',
    web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE ?? '',
    agentDataPath      : process.env.ISSUER_WEB5_AGENT_DATA_PATH ?? `DATA/DCX/ISSUER/AGENT`,
  },
  applicant : {
    web5Password       : process.env.APPLICANT_WEB5_PASSWORD        ?? '',
    web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? '',
  }
};

export const dcxOptions: DcxOptions = {
  handlers  : [],
  providers : [],
  manifests : dcxConfig.manifests,
  issuers   : dcxConfig.issuers,
  gateways  : dcxConfig.gatewayUris,
  dwns      : dcxConfig.dwnEndpoints,
};

export type DcxConfig = typeof dcxConfig & { [key: string]: any };