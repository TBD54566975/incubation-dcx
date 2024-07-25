import { Config } from '@dcx-protocol/common';

export class IssuerConfig extends Config {
  public static ISSUER_PORT = process.env.PORT ?? 4000;
  public static ISSUER_NODE_ENV = process.env.ISSUER_NODE_ENV ?? 'development';
  public static ISSUER_SERVICE_NAME = process.env.ISSUER_SERVICE_NAME ?? 'DCX Issuer';
  public static ISSUER_SERVICE_ID = process.env.ISSUER_SERVICE_ID ?? 'dcx-issuer';

  public static ISSUER_CURSOR = process.env.ISSUER_CURSOR ?? '';
  public static ISSUER_LAST_RECORD_ID = process.env.ISSUER_LAST_RECORD_ID ?? '';

  public static ISSUER_DWN_ENDPOINTS = process.env.ISSUER_DWN_ENDPOINTS?.split(',') ?? IssuerConfig.DCX_ENDPOINTS.DWN_ENDPOINTS;
  public static ISSUER_GATEWAY_URIS = process.env.ISSUER_GATEWAY_URIS?.split(',') ?? IssuerConfig.DCX_ENDPOINTS.GATEWAY_URIS;

  private static _ISSUER_WEB5_PASSWORD = process.env.ISSUER_WEB5_PASSWORD ?? '';
  static get ISSUER_WEB5_PASSWORD(): string {
    return this._ISSUER_WEB5_PASSWORD;
  }
  static set ISSUER_WEB5_PASSWORD(password: string) {
    this._ISSUER_WEB5_PASSWORD = password;
  }

  private static _ISSUER_WEB5_RECOVERY_PHRASE = process.env.ISSUER_WEB5_RECOVERY_PHRASE ?? '';
  static get ISSUER_WEB5_RECOVERY_PHRASE(): string {
    return this._ISSUER_WEB5_RECOVERY_PHRASE;
  }
  static set ISSUER_WEB5_RECOVERY_PHRASE(recoveryPhrase: string) {
    this._ISSUER_WEB5_RECOVERY_PHRASE = recoveryPhrase;
  }
}
