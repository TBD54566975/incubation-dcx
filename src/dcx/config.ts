import dotenv from 'dotenv';
import { Issuer } from '../index.js';
dotenv.config();
export class Config {
  public static NODE_ENV = process.env.NODE_ENV || 'development';
  public static SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange';
  public static SERVICE_ID = process.env.SERVICE_ID || 'dcx';

  public static DWN_LAST_RECORD_ID = process.env.DWN_LAST_RECORD_ID ?? `${process.cwd()}/lastRecordId`;
  public static DWN_CURSOR = process.env.DWN_CURSOR ?? `${process.cwd()}/cursor.json`;
  public static DEFAULT_GATEWAY_URI = 'https://diddht.tbddev.org';
  public static DEFAULT_TRUSTED_ISSUERS = [
    {
      name: 'mx',
      id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo',
    },
  ];
  public static DEFAULT_TRUSTED_ISSUER_DIDS = Config.DEFAULT_TRUSTED_ISSUERS.map(
    (issuer: Issuer) => issuer.id,
  );

  // Secrets
  private _WEB5_CONNECT_PASSWORD: string = process.env.WEB5_CONNECT_PASSWORD || '';
  get WEB5_CONNECT_PASSWORD(): string {
    return this._WEB5_CONNECT_PASSWORD;
  }
  set WEB5_CONNECT_PASSWORD(password: string) {
    this._WEB5_CONNECT_PASSWORD = password;
  }

  private _WEB5_CONNECT_RECOVERY_PHRASE: string = process.env.WEB5_CONNECT_RECOVERY_PHRASE || '';
  get WEB5_CONNECT_RECOVERY_PHRASE(): string {
    return this._WEB5_CONNECT_RECOVERY_PHRASE;
  }
  set WEB5_CONNECT_RECOVERY_PHRASE(recoveryPhrase: string) {
    this._WEB5_CONNECT_RECOVERY_PHRASE = recoveryPhrase;
  }

  get Config(): Config {
    return this;
  }
}
