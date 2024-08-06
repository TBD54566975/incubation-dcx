import { config as dcxConfig } from '@dcx-protocol/common';

export type IssuerConfig = typeof issuerConfig;

export const issuerConfig = {
  // TODO: check validity of these values
  ...dcxConfig,
  port               : process.env.ISSUER_PORT                      ?? 4000,
  serviceName        : process.env.ISSUER_SERVICE_NAME              ?? '@dcx-protocol/issuer',
  serviceId          : process.env.ISSUER_SERVICE_ID                ?? 'dcx-issuer',
  cursorFile         : process.env.ISSUER_CURSOR                    ?? 'issuer-cursor.json',
  lastRecordIdFile   : process.env.ISSUER_LAST_RECORD_ID            ?? 'lastRecordId.issuer',
  dwnEndpoints       : process.env.ISSUER_DWN_ENDPOINTS?.split(',') ?? dcxConfig.DCX_ENDPOINTS.DWN_ENDPOINTS,
  gatewayUris        : process.env.ISSUER_GATEWAY_URIS?.split(',')  ?? dcxConfig.DCX_ENDPOINTS.GATEWAY_URIS,
  agentDataPath      : process.env.ISSUER_WEB5_AGENT_DATA_PATH      ?? `DATA/DCX/ISSUER/AGENT`,
  web5Password       : process.env.ISSUER_WEB5_PASSWORD             ?? '',
  web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE      ?? '',
};
