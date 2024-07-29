import { Config } from '@dcx-protocol/common';

export class ApplicantConfig extends Config {
  public static APPLICANT_PORT = process.env.APPLICANT_PORT;
  public static APPLICANT_SERVICE_NAME = process.env.APPLICANT_SERVICE_NAME;
  public static APPLICANT_SERVICE_ID = process.env.APPLICANT_SERVICE_ID;

  // TODO: check validity of this file name
  public static APPLICANT_CURSOR = !!process.env.APPLICANT_CURSOR
  && process.env.APPLICANT_CURSOR;

  // TODO: check validity of this file name
  public static APPLICANT_LAST_RECORD_ID = !!process.env.APPLICANT_LAST_RECORD_ID
  && process.env.APPLICANT_LAST_RECORD_ID;

  // TODO: check validity of these endpoints
  public static APPLICANT_DWN_ENDPOINTS = !!process.env.APPLICANT_DWN_ENDPOINTS
  && process.env.APPLICANT_DWN_ENDPOINTS?.split(',')
  || Config.DCX_ENDPOINTS.DWN_ENDPOINTS;

  // TODO: check validity of these uris
  public static APPLICANT_GATEWAY_URIS = !!process.env.APPLICANT_GATEWAY_URIS
  && process.env.APPLICANT_GATEWAY_URIS?.split(',')
  || Config.DCX_ENDPOINTS.GATEWAY_URIS;

  // TODO: check validity of this path
  public static APPLICANT_WEB5_AGENT_DATA_PATH = process.env.APPLICANT_WEB5_AGENT_DATA_PATH ?? `DATA/DCX/APPLICANT/AGENT`;

  protected static _APPLICANT_WEB5_PASSWORD = process.env.APPLICANT_WEB5_PASSWORD ?? '';
  protected static _APPLICANT_WEB5_RECOVERY_PHRASE = process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? '';
}

export class ApplicantSecrets extends ApplicantConfig {
  public static get APPLICANT_WEB5_PASSWORD(): string {
    return ApplicantConfig._APPLICANT_WEB5_PASSWORD;
  }
  public static set APPLICANT_WEB5_PASSWORD(password: string) {
    ApplicantConfig._APPLICANT_WEB5_PASSWORD = password;
  }

  public static get APPLICANT_WEB5_RECOVERY_PHRASE(): string {
    return ApplicantConfig._APPLICANT_WEB5_RECOVERY_PHRASE;
  }
  public static set APPLICANT_WEB5_RECOVERY_PHRASE(recoveryPhrase: string) {
    ApplicantConfig._APPLICANT_WEB5_RECOVERY_PHRASE = recoveryPhrase;
  }
}

export const applicantConfig = new ApplicantSecrets();