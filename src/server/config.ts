import dotenv from 'dotenv';
import { Issuer } from '../index.js';
dotenv.config();
export class Config {
  public static DWN_LAST_RECORD_ID = `${process.cwd()}/lastRecordId`;
  public static DWN_CURSOR = `${process.cwd()}/cursor.json`;

  public static VC_TRUSTED_ISSUERS = [
    {
      name: 'mx',
      id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo',
    },
  ];
  public static VC_TRUSTED_ISSUER_DIDS = Config.VC_TRUSTED_ISSUERS.map(
    (issuer: Issuer) => issuer.id,
  );

  public static NODE_ENV = process.env.NODE_ENV || 'development';
  
  public static PORT = process.env.PORT || 3000;
  public static EXTERNAL_PORT = process.env.EXTERNAL_PORT || 3000;
  public static EXTERNAL_HOSTNAME = process.env.EXTERNAL_HOSTNAME || 'localhost';
  public static SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange';
  public static SERVICE_ID = process.env.SERVICE_ID || 'dcx';

  public static DHT_GATEWAY_ENDPOINT = process.env.DHT_GATEWAY_ENDPOINT || 'http://localhost:8305/';
  public static DWN_ENDPOINTS = process.env.DWN_ENDPOINTS?.split(',') || ['http://localhost:3000'];

  // Private class variables
  private _WEB5_CONNECT_PASSWORD: string = process.env.WEB5_CONNECT_PASSWORD || '';
  private _WEB5_CONNECT_RECOVERY_PHRASE: string = process.env.WEB5_CONNECT_RECOVERY_PHRASE || '';

  get WEB5_CONNECT_PASSWORD(): string {
    return this._WEB5_CONNECT_PASSWORD;
  }
  set WEB5_CONNECT_PASSWORD(password: string) {
    this._WEB5_CONNECT_PASSWORD = password;
  }

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
