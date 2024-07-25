import { Config } from '@dcx-protocol/common';

export class ApplicantConfig extends Config {
  public static APPLICANT_PORT = process.env.PORT ?? 5000;
  public static APPLICANT_NODE_ENV = process.env.APPLICANT_NODE_ENV ?? 'development';
  public static APPLICANT_SERVICE_NAME = process.env.APPLICANT_SERVICE_NAME ?? 'DCX Issuer';
  public static APPLICANT_SERVICE_ID = process.env.APPLICANT_SERVICE_ID ?? 'dcx-issuer';

  public static APPLICANT_CURSOR = process.env.APPLICANT_CURSOR ?? '';
  public static APPLICANT_LAST_RECORD_ID = process.env.APPLICANT_LAST_RECORD_ID ?? '';

  public static APPLICANT_DWN_ENDPOINTS = process.env.APPLICANT_DWN_ENDPOINTS?.split(',') ?? ApplicantConfig.DCX_ENDPOINTS.DWN_ENDPOINTS;
  public static APPLICANT_GATEWAY_URIS = process.env.APPLICANT_GATEWAY_URIS?.split(',') ?? ApplicantConfig.DCX_ENDPOINTS.GATEWAY_URIS;

  private static _APPLICANT_WEB5_PASSWORD = process.env.APPLICANT_WEB5_PASSWORD ?? '';
  static get APPLICANT_WEB5_PASSWORD(): string {
    return this._APPLICANT_WEB5_PASSWORD;
  }
  static set APPLICANT_WEB5_PASSWORD(password: string) {
    this._APPLICANT_WEB5_PASSWORD = password;
  }

  private static _APPLICANT_WEB5_RECOVERY_PHRASE = process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? '';
  static get APPLICANT_WEB5_RECOVERY_PHRASE(): string {
    return this._APPLICANT_WEB5_RECOVERY_PHRASE;
  }
  static set APPLICANT_WEB5_RECOVERY_PHRASE(recoveryPhrase: string) {
    this._APPLICANT_WEB5_RECOVERY_PHRASE = recoveryPhrase;
  }
}
