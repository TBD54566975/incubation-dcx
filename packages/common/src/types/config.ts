import { dcxConfig } from '../index.js';

export type DcxConfig = typeof dcxConfig & { [key: string]: any };

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