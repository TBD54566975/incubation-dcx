import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { DcxServerError } from '../utils/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export class DcxEnvConfig {
  public PORT = process.env.PORT || 3000;
  public EXTERNAL_PORT = process.env.EXTERNAL_PORT || 3000;
  public EXTERNAL_HOSTNAME = process.env.EXTERNAL_HOSTNAME || 'localhost';
  public SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange';
  public SERVICE_ID = process.env.SERVICE_ID || 'dcx';
  public DWN_LAST_RECORD_ID = `${__dirname}/lastRecordId`;
  public DWN_CURSOR = `${__dirname}/cursor.json`;

  public DHT_GATEWAY_ENDPOINT =
    process.env.DHT_GATEWAY_ENDPOINT || 'https://dev.dht.formfree.com:8305/';
  public DCX_DID_URI = process.env.DCX_DID_URI || '';
  public DCX_DID_FILEPATH = process.env.DCX_DID_FILEPATH || '';
  public DWN_ENDPOINTS = process.env.DWN_ENDPOINTS?.split(',') || ['https://dev.dwn.formfree.com/'];

  public VC_DATA_PROVIDER = process.env.VC_DATA_PROVIDER || '';
  public VC_ID = process.env.VC_ID || 'dcx-verifiable-credential';
  public VC_NAME = process.env.VC_NAME || 'DCXVerifiableCredential';
  public VC_DATA_PROVIDER_ENDPOINT = process.env.VC_DATA_PROVIDER_ENDPOINT || '';
  public VC_TRUSTED_ISSUERS = (process.env.VC_TRUSTED_ISSUERS &&
    JSON.parse(process.env.VC_TRUSTED_ISSUERS)) || [
    {
      name: 'mx',
      did: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo',
    },
  ];

  // Private class variables
  private _CIPHER_KEY: Buffer;
  private _WEB5_CONNECT_PASSWORD: string;
  private _WEB5_CONNECT_RECOVERY_PHRASE: string;
  private _DCX_DID_JWK_D: string;

  constructor() {
    this._CIPHER_KEY = Buffer.from(process.env.CIPHER_KEY || '', 'base64');
    this._WEB5_CONNECT_PASSWORD = process.env.WEB5_CONNECT_PASSWORD || '';
    this._WEB5_CONNECT_RECOVERY_PHRASE = process.env.WEB5_CONNECT_RECOVERY_PHRASE || '';
    this._DCX_DID_JWK_D = process.env.DCX_DID_JWK_D || '';
  }

  get DCX_DID_JWK_D(): string {
    return this._DCX_DID_JWK_D;
  }

  get CIPHER_KEY(): Buffer {
    return this._CIPHER_KEY;
  }

  set CIPHER_KEY(CIPHER_KEY: Buffer) {
    this._CIPHER_KEY = CIPHER_KEY;
  }

  get WEB5_CONNECT_PASSWORD(): string {
    return this._WEB5_CONNECT_PASSWORD;
  }

  set WEB5_CONNECT_PASSWORD(WEB5_CONNECT_PASSWORD: string) {
    this._WEB5_CONNECT_PASSWORD = WEB5_CONNECT_PASSWORD || '';
  }

  get WEB5_CONNECT_RECOVERY_PHRASE(): string {
    return this._WEB5_CONNECT_RECOVERY_PHRASE;
  }

  set WEB5_CONNECT_RECOVERY_PHRASE(WEB5_CONNECT_RECOVERY_PHRASE: string) {
    this._WEB5_CONNECT_RECOVERY_PHRASE = WEB5_CONNECT_RECOVERY_PHRASE || '';
  }
}

export const dcxEnvConfig = new DcxEnvConfig();
export type DcxServerConfig = typeof dcxEnvConfig;
console.debug('dcxEnvConfig', dcxEnvConfig);
