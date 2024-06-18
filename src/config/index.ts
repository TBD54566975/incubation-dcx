import dotenv from 'dotenv';
import { DcxServerError } from '../utils/error.js';

dotenv.config();
const CWD = process.cwd();

export class Config {
  public DCX_SECRETS_FILEPATH = `${CWD}/dcx-secrets.json`;
  public DHT_GATEWAY_ENDPOINT = process.env.DHT_GATEWAY_ENDPOINT || 'http://dev.dht.formfree.com:8305/';
  /**
   * @name OUTPUT_VC_DATA_PROVIDER the name of the 3rd party service called during VC issuance
   * @description The name of the service provider the DCX makes an API call to for data to issue response VC
   * @example 'vc_data_provider'
  */
  public OUTPUT_VC_DATA_PROVIDER = process.env.OUTPUT_VC_DATA_PROVIDER || '';
  /**
    * @name OUTPUT_VC_DATA_PROVIDER_ENDPOINT can be either 'vc_data_provider' or 'vc_issuer'
    * @description The full API endpoint of the {@link VC_DATA_PROVIDER} used by DCX to request VC data
    * @example 'https://api.vcdataprovider.com/v1/vc-data'
   */
  public OUTPUT_VC_DATA_PROVIDER_ENDPOINT = process.env.OUTPUT_VC_DATA_PROVIDER_ENDPOINT || '';
  public OUTPUT_VC_MANIFEST_FILENAME = process.env.OUTPUT_VC_MANIFEST_FILENAME || 'EXAMPLE-MANIFEST.json';
  public OUTPUT_VC_NAME = process.env.OUTPUT_VC_NAME || 'DCXVerifiableCredential';
  public OUTPUT_VC_ID = process.env.OUTPUT_VC_ID || 'dcx-verifiable-credential';
  public INPUT_VC_TRUSTED_ISSUERS = (process.env.INPUT_VC_TRUSTED_ISSUERS && JSON.parse(process.env.INPUT_VC_TRUSTED_ISSUERS))
    || [
      {
        "name": "mx",
        "did": "did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo"
      }
    ];
  public DWN_ENDPOINTS = process.env.DWN_ENDPOINTS?.split(',') || [];
  public DWN_LAST_RECORD_ID_FILEPATH = process.env.DWN_LAST_RECORD_ID_FILEPATH || `${CWD}/last-dwn-record-id.txt`;
  public DWN_CURSOR_FILEPATH = process.env.DWN_CURSOR_FILEPATH || `${CWD}/dwn-cursor.json`;
  public DCX_ISSUER_DID_FILEPATH = process.env.DCX_ISSUER_DID_FILEPATH || `${CWD}/portable-did.json`;
  private _CIPHER_KEY: Buffer;
  private _DWN_PASSWORD: string;
  private _DWN_RECOVERY_PHRASE: string;

  constructor() {
    this._CIPHER_KEY = Buffer.from(process.env.CIPHER_KEY || '', 'base64');
    this._DWN_PASSWORD = process.env.DWN_PASSWORD || '';
    this._DWN_RECOVERY_PHRASE = process.env.DWN_RECOVERY_PHRASE || '';
  }

  get CIPHER_KEY(): Buffer {
    return this._CIPHER_KEY;
  }

  set CIPHER_KEY(CIPHER_KEY: Buffer) {
    this._CIPHER_KEY = CIPHER_KEY;
  }

  get DWN_PASSWORD(): string {
    return this._DWN_PASSWORD;
  }

  set DWN_PASSWORD(DWN_PASSWORD: string) {
    this._DWN_PASSWORD = DWN_PASSWORD || '';
  }

  get DWN_RECOVERY_PHRASE(): string {
    return this._DWN_RECOVERY_PHRASE;
  }

  set DWN_RECOVERY_PHRASE(DWN_RECOVERY_PHRASE: string) {
    this._DWN_RECOVERY_PHRASE = DWN_RECOVERY_PHRASE || '';
  }
}

export type DcxServerConfig = typeof config;

export const config = new Config();

console.debug("config", config);

const NODE_ENV = process.env.NODE_ENV ?? "development";

if (NODE_ENV === 'production') {
  if (!(config.DWN_RECOVERY_PHRASE && config.DCX_ISSUER_DID_FILEPATH)) {
    throw new DcxServerError('DWN_RECOVERY_PHRASE and DCX_ISSUER_DID_FILEPATH cannot both be undefined', null)
  }
  if (!config.OUTPUT_VC_MANIFEST_FILENAME) {
    console.log("OUTPUT_VC_MANIFEST_FILENAME is required but not found in config", config.OUTPUT_VC_MANIFEST_FILENAME);
    throw new DcxServerError('OUTPUT_VC_MANIFEST_FILENAME is required but not found in config')
  }
  if (config.OUTPUT_VC_MANIFEST_FILENAME.toLowerCase().includes("example")) {
    console.log("OUTPUT_VC_MANIFEST_FILENAME set to default EXAMPLE-EXAMPLE-MANIFEST.json file", config.OUTPUT_VC_MANIFEST_FILENAME);
    throw new DcxServerError('OUTPUT_VC_MANIFEST_FILENAME cannot be default EXAMPLE-EXAMPLE-MANIFEST.json file in production');
  }
}