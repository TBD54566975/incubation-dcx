import {
  DcxHandshakeManifest,
  DcxOptions,
  EmailAddressManifest,
  PhoneNumberManifest,
  defaultTrustedIssuers
} from './index.js';

export const dcxConfig = {
  ...[DcxHandshakeManifest, PhoneNumberManifest, EmailAddressManifest],
  issuers      : defaultTrustedIssuers,
  manifests    : [DcxHandshakeManifest, PhoneNumberManifest, EmailAddressManifest],
  dwnEndpoints : ['https://dwn.tbddev.org/beta'],
  gatewayUris  : ['https://diddht.tbddev.org/'],
  endpoints    : {
    dwns     : ['https://dwn.tbddev.org/beta'],
    gateways : ['https://diddht.tbddev.org/'],
  },
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