import { config as dcxConfig } from '@dcx-protocol/common';

export type ApplicantConfig = typeof applicantConfig;

export const applicantConfig = {
  // TODO: check validity of these values
  ...dcxConfig,
  port                           : process.env.APPLICANT_PORT                      || 5000,
  serviceName                    : process.env.APPLICANT_SERVICE_NAME              || '@dcx-protocol/applicant',
  serviceId                      : process.env.APPLICANT_SERVICE_ID                || 'dcx-applicant',
  cursorFile                     : process.env.APPLICANT_CURSOR                    || 'applicant-cursor.json',
  lastRecordIdFile               : process.env.APPLICANT_LAST_RECORD_ID            || 'lastRecordId.applicant',
  dwnEndpoints                   : process.env.APPLICANT_DWN_ENDPOINTS?.split(',') || dcxConfig.DCX_ENDPOINTS.DWN_ENDPOINTS,
  gatewayUris                    : process.env.APPLICANT_GATEWAY_URIS?.split(',')  || dcxConfig.DCX_ENDPOINTS.GATEWAY_URIS,
  agentDataPath                  : process.env.APPLICANT_WEB5_AGENT_DATA_PATH      || `DATA/DCX/APPLICANT/AGENT`,
  web5Password                   : process.env.APPLICANT_WEB5_PASSWORD             || '',
  web5RecoveryPhrase             : process.env.APPLICANT_WEB5_RECOVERY_PHRASE      || '',
};