import * as path from 'path';
const rootDir = path.resolve(__dirname, '../../../');
const filePath = path.join(rootDir, '.env');

import dotenv from 'dotenv';
dotenv.config({path: filePath});
export class Config {
  public static NODE_ENV = process.env.NODE_ENV || 'development';

  public static DEFAULT_DWN_ENDPOINTS = ['https://dwn.formfree.com/'];
  public static DEFAULT_GATEWAY_URIS = ['https://diddht.tbddev.org/'];
  public static DEFAULT_TRUSTED_ISSUERS = [
    {
      name : 'mx',
      id   : 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo',
    },
  ];
  public static DEFAULT_TRUSTED_ISSUER_DIDS = Config.DEFAULT_TRUSTED_ISSUERS.map(
    (issuer) => issuer.id,
  );

  // Web5 password
  private static _WEB5_PASSWORD: string = process.env.WEB5_PASSWORD ?? '';
  static get WEB5_PASSWORD(): string {
    return this._WEB5_PASSWORD;
  }
  static set WEB5_PASSWORD(password: string) {
    this._WEB5_PASSWORD = password;
  }

  // Web5 recovery phrase
  private static _WEB5_RECOVERY_PHRASE: string = process.env.WEB5_RECOVERY_PHRASE ?? '';
  static get WEB5_RECOVERY_PHRASE(): string {
    return this._WEB5_RECOVERY_PHRASE;
  }
  static set WEB5_RECOVERY_PHRASE(recoveryPhrase: string) {
    this._WEB5_RECOVERY_PHRASE = recoveryPhrase;
  }

  static get Config(): Config {
    return this;
  }
}

export type CommonConfig = InstanceType<typeof Config>;