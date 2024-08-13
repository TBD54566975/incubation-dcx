import DcxHandshakeManifest from './manifests/dcx-handshake.json' assert { type: 'json' };
import EmailAddressManifest from './manifests/dcx-handshake.json' assert { type: 'json' };
import PhoneNumberManifest from './manifests/dcx-handshake.json' assert { type: 'json' };
import { DcxOptions } from './types/options';

export type DcxConfig = typeof dcxConfig;

export const dcxConfig = {
  endpoints : {
    dwns     : ['https://dwn.tbddev.org/beta'],
    gateways : ['https://diddht.tbddev.org/'],
  },
  issuers : [
    { 'name': 'mx',       'id': 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo' },
    { 'name': 'formfree', 'id': 'did:dht:hcf5e55bbm44s4oixp5z89wtxenxyk35su7f5pd4r5np93ikyowy' }
  ],
  manifests      : [DcxHandshakeManifest, EmailAddressManifest, PhoneNumberManifest],
  dwnEndpoints   : process.env.DWN_ENDPOINTS?.split(',') ?? ['https://dwn.tbddev.org/beta'],
  gatewayUris    : process.env.ISSUER_GATEWAY_URIS?.split(',')  ?? ['https://diddht.tbddev.org/'],
  issuerProtocol    : {
    cursorFile         : process.env.ISSUER_CURSOR               ?? 'issuer-cursor.json',
    lastRecordIdFile   : process.env.ISSUER_LAST_RECORD_ID       ?? 'lastRecordId.issuer',
    agentDataPath      : process.env.ISSUER_WEB5_AGENT_DATA_PATH ?? `DATA/DCX/ISSUER/AGENT`,
    web5Password       : process.env.ISSUER_WEB5_PASSWORD        ?? '',
    web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE ?? '',
  },
  applicantProtocol : {
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