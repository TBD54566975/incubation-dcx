import DcxHandshakeManifest from './dcx-handshake.json' assert { type: 'json' };

export type DcxServerConfig = typeof config;

export const config =  {
  endpoints: {
    dwn     : ['https://dwn.tbddev.org/beta'],
    gateway : ['https://diddht.tbddev.org/'],
  },
  issuers: [
    { 'name': 'mx',       'id': 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo' },
    { 'name': 'formfree', 'id': 'did:dht:hcf5e55bbm44s4oixp5z89wtxenxyk35su7f5pd4r5np93ikyowy' }
  ],
  handshakeManifest : [DcxHandshakeManifest],
  issuerProtocol    : {
    cursorFile         : process.env.ISSUER_CURSOR                    ?? 'issuer-cursor.json',
    lastRecordIdFile   : process.env.ISSUER_LAST_RECORD_ID            ?? 'lastRecordId.issuer',
    dwnEndpoints       : process.env.ISSUER_DWN_ENDPOINTS?.split(',') ?? ['https://dwn.tbddev.org/beta'],
    gatewayUris        : process.env.ISSUER_GATEWAY_URIS?.split(',')  ?? ['https://diddht.tbddev.org/'],
    agentDataPath      : process.env.ISSUER_WEB5_AGENT_DATA_PATH      ?? `DATA/DCX/ISSUER/AGENT`,
    web5Password       : process.env.ISSUER_WEB5_PASSWORD             ?? '',
    web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE      ?? '',
  },
  applicantProtocol: {
    dwnEndpoints       : process.env.APPLICANT_DWN_ENDPOINTS?.split(',') ?? ['https://dwn.tbddev.org/beta'],
    gatewayUris        : process.env.APPLICANT_GATEWAY_URIS?.split(',')  ?? ['https://diddht.tbddev.org/'],
    web5Password       : process.env.APPLICANT_WEB5_PASSWORD             ?? '',
    web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE      ?? '',
  }
};