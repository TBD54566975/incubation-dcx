import { config as dcxConfig, DcxOptions } from '@dcx-protocol/common';

export type DcxIssuerConfig = typeof issuerConfig;

export const issuerConfig = {
  // TODO: check validity of these values
  ...dcxConfig,
  port               : process.env.ISSUER_PORT                      ?? 4000,
  serviceName        : process.env.ISSUER_SERVICE_NAME              ?? '@dcx-protocol/issuer',
  serviceId          : process.env.ISSUER_SERVICE_ID                ?? 'dcx-issuer',
  cursorFile         : process.env.ISSUER_CURSOR                    ?? 'issuer-cursor.json',
  lastRecordIdFile   : process.env.ISSUER_LAST_RECORD_ID            ?? 'lastRecordId.issuer',
  dwnEndpoints       : process.env.ISSUER_DWN_ENDPOINTS?.split(',') ?? ['https://dwn.tbddev.org/beta'],
  gatewayUris        : process.env.ISSUER_GATEWAY_URIS?.split(',')  ?? ['https://diddht.tbddev.org/'],
  agentDataPath      : process.env.ISSUER_WEB5_AGENT_DATA_PATH      ?? `DATA/DCX/ISSUER/AGENT`,
  web5Password       : process.env.ISSUER_WEB5_PASSWORD             ?? '',
  web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE      ?? '',
};

export const issuerOptions: DcxOptions = {
  handlers  : [],
  providers : [],
  manifests : [issuerConfig.DCX_HANDSHAKE_MANIFEST],
  issuers   : issuerConfig.DCX_INPUT_ISSUERS,
  gateways  : issuerConfig.gatewayUris,
  dwns      : issuerConfig.dwnEndpoints,
};
