import { DcxConfig, dcxConfig, Mnemonic } from '@dcx-protocol/common';

export type IssuerConfig = DcxConfig & {
  cursorFile: string;
  lastRecordIdFile: string;
  web5Password: string;
  web5RecoveryPhrase: string;
  agentDataPath: string;
}

export const issuerConfig: IssuerConfig = {
  ...dcxConfig,
  cursorFile         : 'issuer-cursor.json',
  lastRecordIdFile   : 'lastRecordId.issuer',
  agentDataPath      : process.env.ISSUER_WEB5_AGENT_DATA_PATH ?? `DATA/DCX/ISSUER/AGENT`,
  web5Password       : process.env.ISSUER_WEB5_PASSWORD        ?? Mnemonic.createPassword(),
  web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
};
