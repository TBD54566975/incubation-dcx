import { Issuer } from './types/dcx';
export class Config {
  public static PORT = process.env.PORT || 3000;
  public static NODE_ENV = process.env.NODE_ENV || 'development';
  public static EXTERNAL_PORT = process.env.EXTERNAL_PORT || 3000;
  public static SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange';
  public static SERVICE_ID = process.env.SERVICE_ID || 'dcx';
  public static LAST_RECORD_ID = process.env.LAST_RECORD_ID || '';
  public static CURSOR = process.env.CURSOR || '';
  public static DEFAULT_ENDPOINTS = {
    FF: {
      DWN        : 'https://dwn.formfree.com/',
      GATEWAY    : 'http://dev.dht.formfree.com:8305/'
    },
    TBD: {
      DWN        : 'https://dwn.formfree.com/',
      GATEWAY    : 'https://diddht.tbddev.org/'
    },
    ISSUERS: 'https://formfree.github.io/.well-known/issuers.json',
  };
  public static DEFAULT_DWN_ENDPOINTS = Config.NODE_ENV !== 'production' ? ['http://localhost:3000/'] : [Config.DEFAULT_ENDPOINTS.FF.DWN, Config.DEFAULT_ENDPOINTS.TBD.DWN];
  public static DEFAULT_GATEWAY_URIS = [Config.DEFAULT_ENDPOINTS.FF.GATEWAY, Config.DEFAULT_ENDPOINTS.TBD.GATEWAY];
  public static DEFAULT_TRUSTED_ISSUERS = [
    {
      'name' : 'mx',
      'id'   : 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'
    }
  ];
  public static DEFAULT_TRUSTED_ISSUER_DIDS = Config.DEFAULT_TRUSTED_ISSUERS.map((issuer: Issuer) => issuer.id);
  private static _WEB5_PASSWORD = process.env.WEB5_PASSWORD || '';
  static get WEB5_PASSWORD(): string {
    return this._WEB5_PASSWORD;
  }
  static set WEB5_PASSWORD(password: string) {
    this._WEB5_PASSWORD = password;
  }
  private static _WEB5_RECOVERY_PHRASE = process.env.WEB5_RECOVERY_PHRASE || '';
  static get WEB5_RECOVERY_PHRASE(): string {
    return this._WEB5_RECOVERY_PHRASE;
  }
  static set WEB5_RECOVERY_PHRASE(recoveryPhrase: string) {
    this._WEB5_RECOVERY_PHRASE = recoveryPhrase;
  }
}
