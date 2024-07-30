import { config as dcxConfig } from '@dcx-protocol/common';

export type IssuerConfig = typeof issuerConfig;

export const issuerConfig = {
  // TODO: check validity of these values
  ...dcxConfig,
  ISSUER_PORT                 : process.env.ISSUER_PORT                      ?? 4000,
  ISSUER_SERVICE_NAME         : process.env.ISSUER_SERVICE_NAME              ?? '@dcx-protocol/issuer',
  ISSUER_SERVICE_ID           : process.env.ISSUER_SERVICE_ID                ?? 'dcx-issuer',
  ISSUER_CURSOR               : process.env.ISSUER_CURSOR                    ?? 'issuer-cursor.json',
  ISSUER_LAST_RECORD_ID       : process.env.ISSUER_LAST_RECORD_ID            ?? 'lastRecordId.issuer',
  ISSUER_DWN_ENDPOINTS        : process.env.ISSUER_DWN_ENDPOINTS?.split(',') ?? dcxConfig.DCX_ENDPOINTS.DWN_ENDPOINTS,
  ISSUER_GATEWAY_URIS         : process.env.ISSUER_GATEWAY_URIS?.split(',')  ?? dcxConfig.DCX_ENDPOINTS.GATEWAY_URIS,
  ISSUER_WEB5_PASSWORD        : process.env.ISSUER_WEB5_PASSWORD             ?? '',
  ISSUER_WEB5_RECOVERY_PHRASE : process.env.ISSUER_WEB5_RECOVERY_PHRASE      ?? '',
  ISSUER_WEB5_AGENT_DATA_PATH : process.env.ISSUER_WEB5_AGENT_DATA_PATH      ?? `DATA/DCX/ISSUER/AGENT`,
};
