import { Config } from '@dcx-protocol/common';

export class IssuerConfig extends Config {
  public static ISSUER_PORT = process.env.ISSUER_PORT ?? 4000;
  public static ISSUER_SERVICE_NAME = process.env.ISSUER_SERVICE_NAME ?? '@dcx-protocol/issuer';
  public static ISSUER_SERVICE_ID = process.env.ISSUER_SERVICE_ID ?? 'dcx-issuer';

  public static ISSUER_CURSOR = process.env.ISSUER_CURSOR ?? 'issuer-cursor.json';
  public static ISSUER_LAST_RECORD_ID = process.env.ISSUER_LAST_RECORD_ID ?? 'lastRecordId.issuer';

  public static ISSUER_DWN_ENDPOINTS = process.env.ISSUER_DWN_ENDPOINTS?.split(',') ?? Config.DCX_ENDPOINTS.DWN_ENDPOINTS;
  public static ISSUER_GATEWAY_URIS = process.env.ISSUER_GATEWAY_URIS?.split(',') ?? Config.DCX_ENDPOINTS.GATEWAY_URIS;

  public static ISSUER_WEB5_AGENT_DATA_PATH = process.env.ISSUER_WEB5_AGENT_DATA_PATH ?? `DATA/DCX/ISSUER/AGENT`;

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
