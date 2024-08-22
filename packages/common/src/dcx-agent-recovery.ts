import { DcxError, FileSystem, Logger, Mnemonic } from './index.js';

export type RecoveryData = {
    password: string;
    recoveryPhrase?: string
  }

export type RecoveryFiles = {
    passwordKeyFile: string;
    recoveryKeyFile: string;
  }
export type RecoveryVars = {
    web5RecoveryPhraseEnv: string;
    web5PasswordEnv: string;
  }
export type RecoveryDataNames = RecoveryFiles & RecoveryVars;
export type RecoveryValidateRequest = RecoveryData & { firstLaunch?: boolean; type: string; };
export type RecoveryValidateSpecificRequest = RecoveryValidateRequest & RecoveryFiles & RecoveryVars;

export class DcxAgentRecovery {
  /**
   *
   * Creates a new password and recovery phrase for the agent vault.
   *
   * @param params.passwordKeyFile The name of the vault password key file.
   * @param params.recoveryKeyFile The name of the vault recovery phrase key file.
   * @returns password and recovery phrase; see {@link RecoveryData}
   */
  static async createRecoveryData({ passwordKeyFile, recoveryKeyFile }: RecoveryFiles): Promise<RecoveryData> {
    const password = Mnemonic.createPassword();
    await FileSystem.overwrite(passwordKeyFile, password);

    const recoveryPhrase = Mnemonic.createRecoveryPhrase();
    await FileSystem.overwrite(recoveryKeyFile, recoveryPhrase);

    return { password, recoveryPhrase };
  }

  /**
   *
   * Validates the password and recovery phrase for the dcx issuer agent vault.
   *
   * @param param.recoveryPhrase The recovery phrase to recover the vault.
   * @param param.password The password to unlock the recovered vault.
   * @param param.firstLaunch A boolean indicating if this is the first launch of the agent.
   * @param param.passwordKeyFile The name of the vault password key file.
   * @param param.recoveryKeyFile The name of the vault recovery phrase key file.
   * @param param.web5PasswordEnv The name of the environment variable for the vault password.
   * @param param.web5RecoveryPhraseEnv The name of the environment variable for the vault recovery phrase.
   * @returns password and recovery phrase; see {@link RecoveryData}
   */
  static async validateIssuer({
    password,
    recoveryPhrase,
    passwordKeyFile,
    recoveryKeyFile,
    web5PasswordEnv,
    web5RecoveryPhraseEnv,
    firstLaunch,
  }: RecoveryValidateSpecificRequest): Promise<RecoveryData> {
    const setBothMessage =
      `Either set both ${web5PasswordEnv} and ${web5RecoveryPhraseEnv} in .env file.` +
      `Or delete the local DATA folder to create a new password and recovery phrase.`;

    if(firstLaunch){

      if (!(password && recoveryPhrase)) {
        Logger.security(
          `${web5PasswordEnv} and ${web5RecoveryPhraseEnv} not found on first launch! ` +
          `New ${web5PasswordEnv} saved to ${passwordKeyFile} file. ` +
          `New ${web5RecoveryPhraseEnv} saved to ${recoveryKeyFile} file.`,
        );

        return await DcxAgentRecovery.createRecoveryData({ passwordKeyFile, recoveryKeyFile });
      } else if (password && !recoveryPhrase) {
        Logger.warn(
          `${web5PasswordEnv} found without ${web5RecoveryPhraseEnv}! ` +
          `Attempting to unlock the vault with ${web5PasswordEnv}.`,
        );
        return { password };
      } else if (!password && recoveryPhrase) {
        throw new DcxError(
          'DcxAgentRecoveryError',
          `${web5RecoveryPhraseEnv} found without ${web5PasswordEnv} on first launch! ` +
          `${web5PasswordEnv} is required to unlock the vault recovered by ${web5RecoveryPhraseEnv}. ` +
          `To recover an existing vault, set ${web5PasswordEnv} and ${web5RecoveryPhraseEnv} in .env file.`
        );
      }

    } else {

      if(!(password && recoveryPhrase)) {
        throw new DcxError(
          'DcxAgentRecoveryError',
          `${web5PasswordEnv} and ${web5RecoveryPhraseEnv} not found on non-first launch! ` + setBothMessage
        );
      } else if (password && !recoveryPhrase) {
        Logger.warn(
          `${web5PasswordEnv} found without ${web5RecoveryPhraseEnv}! ` +
            `Attempting to unlock the vault with ${web5PasswordEnv}.`,
        );
        return { password };
      } else if (!password && recoveryPhrase) {
        throw new DcxError(
          'DcxAgentRecoveryError',
          `${web5RecoveryPhraseEnv} found without ${web5PasswordEnv} on non-first launch! ` + setBothMessage
        );
      }

    }

    return { password, recoveryPhrase };
  }

  /**
   *
   * Validates the password and recovery phrase for the dcx applicant agent vault.
   *
   * @param param.password The password to unlock the recovered vault.
   * @param param.recoveryPhrase The recovery phrase to recover the vault.
   * @param param.passwordKeyFile The name of the vault password key file.
   * @param param.recoveryKeyFile The name of the vault recovery phrase key file.
   * @param param.web5PasswordEnv The name of the environment variable for the vault password.
   * @param param.web5RecoveryPhraseEnv The name of the environment variable for the vault recovery phrase.
   * @returns password and recovery phrase; see {@link RecoveryData}
   *
   */
  static async checkDcxApplicant({
    password,
    recoveryPhrase,
    passwordKeyFile,
    recoveryKeyFile,
    web5PasswordEnv,
    web5RecoveryPhraseEnv,
  }: RecoveryValidateSpecificRequest): Promise<RecoveryData> {

    if (!(password && recoveryPhrase)) {
      Logger.security(
        `${web5PasswordEnv} and ${web5RecoveryPhraseEnv} not found on first launch! ` +
          `New ${web5PasswordEnv} saved to ${passwordKeyFile} file. ` +
          `New ${web5RecoveryPhraseEnv} saved to ${recoveryKeyFile} file.`,
      );

      return await DcxAgentRecovery.createRecoveryData({ passwordKeyFile, recoveryKeyFile });
    } else if (password && !recoveryPhrase) {
      Logger.warn(
        `${web5PasswordEnv} found without ${web5RecoveryPhraseEnv}! ` +
          `Attempting to unlock the vault with ${web5PasswordEnv}.`,
      );
      return { password };
    } else if(!password && recoveryPhrase) {
      throw new DcxError(
        'DcxAgentRecoveryError',
        `${web5RecoveryPhraseEnv} found without ${web5PasswordEnv} on first launch! ` +
          `${web5PasswordEnv} is required to unlock the vault recovered by ${web5RecoveryPhraseEnv}. ` +
          `To recover an existing vault, set ${web5PasswordEnv} and ${web5RecoveryPhraseEnv} in .env file.`
      );
    }
    return { password, recoveryPhrase };
  }

  /**
   *
   * Returns the names of the recovery data files and environment variables
   *
   * @param type The type of agent
   * @returns The names of the recovery data files and environment variables
   *
   */
  static getRecoveryDataNames(type: string): RecoveryDataNames {
    return {
      web5RecoveryPhraseEnv : `${type.toUpperCase()}_WEB5_RECOVERY_PHRASE`,
      web5PasswordEnv        : `${type.toUpperCase()}_WEB5_PASSWORD`,
      passwordKeyFile       : `${type}.password.key`,
      recoveryKeyFile       : `${type}.recovery.key`,
    };
  }

  /**
   *
   * Validates the password and recovery phrase for the dcx agent vault.
   *
   * @param params.firstLaunch A boolean indicating if this is the first launch of the agent
   * @param params.password The password to unlock the vault
   * @param params.recoveryPhrase The recovery phrase to recover the vault
   * @param params.type The type of agent
   * @returns password and recovery phrase; see {@link RecoveryData}
   * @throws DcxError
   */
  static async validate({
    password,
    recoveryPhrase,
    type,
    firstLaunch
  }: RecoveryValidateRequest): Promise<RecoveryData> {
    type = type?.toLowerCase();

    if(!type || !['applicant', 'issuer'].includes(type)) {
      throw new DcxError('DcxAgentRecoveryError', `Invalid type provided: ${type} must either "applicant" or "issuer"`, );
    }

    const { passwordKeyFile, recoveryKeyFile, web5RecoveryPhraseEnv, web5PasswordEnv } = DcxAgentRecovery.getRecoveryDataNames(type);

    if(type === 'issuer') {
      return DcxAgentRecovery.validateIssuer({
        passwordKeyFile,
        recoveryKeyFile,
        web5RecoveryPhraseEnv,
        web5PasswordEnv,
        password,
        recoveryPhrase,
        type,
        firstLaunch
      });
    } else {
      return DcxAgentRecovery.checkDcxApplicant({
        passwordKeyFile,
        recoveryKeyFile,
        web5RecoveryPhraseEnv,
        web5PasswordEnv,
        password,
        recoveryPhrase,
        type,
        firstLaunch
      });
    }

  }
}