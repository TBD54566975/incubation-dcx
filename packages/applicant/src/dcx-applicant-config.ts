import { DcxConfig, dcxConfig, Mnemonic } from '@dcx-protocol/common';

export type ApplicantConfig = DcxConfig & {
  web5Password: string;
  web5RecoveryPhrase: string;
}

export const applicantConfig: ApplicantConfig = {
  ...dcxConfig,
  web5Password       : process.env.APPLICANT_WEB5_PASSWORD        ?? Mnemonic.createPassword(),
  web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
};