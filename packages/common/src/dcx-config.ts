import {
  DcxHandshakeManifest,
  EmailAddressManifest,
  Handler,
  CredentialManifest,
  PhoneNumberManifest,
  Provider,
  TrustedIssuer
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

export type DcxOptionsConfig = {
  handlers: Handler[];
  providers: Provider[];
  manifests: CredentialManifest[];
  issuers: TrustedIssuer[];
  gateways: string[];
  dwns: string[];
};

export const MX = { name: 'mx', id: 'did:dht:kfcakjzahwimgo9zzjw6yknt9srdtkmfqbeybekcg3xzz1ztg95y' };
export const FF = { name: 'formfree', id: 'did:dht:hcf5e55bbm44s4oixp5z89wtxenxyk35su7f5pd4r5np93ikyowy' };

export const dcxConfig = {
  issuer : {
    cursorFile         : 'issuer-cursor.json',
    lastRecordIdFile   : 'lastRecordId.issuer',
    web5Password       : process.env.ISSUER_WEB5_PASSWORD        ?? '',
    web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE ?? '',
    agentDataPath      : process.env.ISSUER_WEB5_AGENT_DATA_PATH ?? `DATA/DCX/ISSUER/AGENT`,
  },
  applicant : {
    web5Password       : process.env.APPLICANT_WEB5_PASSWORD        ?? '',
    web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? '',
  },
  options : {
    handlers  : [],
    providers : [],
    manifests : [DcxHandshakeManifest, PhoneNumberManifest, EmailAddressManifest],
    issuers   : [MX, FF],
    gateways  : ['https://dwn.tbddev.org/beta'],
    dwns      : ['https://diddht.tbddev.org/'],
  }
};

export type DcxConfig = {
  options: DcxOptionsConfig;
  issuer: DcxIssuerConfig;
  applicant: DcxApplicantConfig;
  [key: string]: any
};