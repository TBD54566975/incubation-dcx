import { config } from 'dotenv';
config();
export class Config {
  public DWN_LAST_RECORD_ID_FILE = process.env.DWN_LAST_RECORD_ID_FILE || `${process.cwd()}/lastRecordId`;
  public DWN_CURSOR_FILE = process.env.DWN_CURSOR_FILE || `${process.cwd()}/cursor.json`;

  public ISSUER_SERVICE_ENDPOINT = process.env.ISSUER_SERVICE_ENDPOINT || '';
  public TRUSTED_ISSUERS = (process.env.TRUSTED_ISSUERS && JSON.parse(process.env.TRUSTED_ISSUERS)) || [{ "name": "mx", "did": "did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo" }];

  public DHT_GATEWAY_ENDPOINT = process.env.DHT_GATEWAY_ENDPOINT || '0.0.0.0:8305';
  public DWN_ENDPOINTS = process.env.DWN_ENDPOINTS?.split(',') || [];

  private _CIPHER_KEY: string;
  private _DWN_PASSWORD: string;
  private _DWN_RECOVERY_PHRASE: string;

  constructor() {
    this._CIPHER_KEY = process.env.CIPHER_KEY || '';
    this._DWN_PASSWORD = process.env.DWN_PASSWORD || '';
    this._DWN_RECOVERY_PHRASE = process.env.DWN_RECOVERY_PHRASE || '';
  }

  get CIPHER_KEY(): string {
    return this._CIPHER_KEY;
  }

  get DWN_PASSWORD(): string {
    return this._DWN_PASSWORD;
  }

  get DWN_RECOVERY_PHRASE(): string {
    return this._DWN_RECOVERY_PHRASE;
  }
}

export const dcxConfig = new Config();

console.log("dcxConfig", dcxConfig)

/*
  TODO: work these async loading function into config class
  import { readFileToJSON, readFileToString } from './utils/file-system.js';
  public DWN_LAST_RECORD_ID = readFileToString(this.DWN_LAST_RECORD_ID_FILE).then(lastRecordId => lastRecordId).catch(console.error) ?? '';
    public DWN_CURSOR = readFileToJSON(this.DWN_CURSOR_FILE).then(cursor => cursor).catch(console.error) ?? {};
*/
