import crypto from 'crypto';
import { Web5 } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { config } from 'dotenv'; import { readFileToJSON } from '../utils/file-system.js';
import { DcxError } from '../error.js';
config();
const CWD = process.cwd();

const isValidVcManifestFile = async (vcManifestFilename: string) => {
  if (!vcManifestFilename) {
    throw new DcxError('VC_MANIFEST_FILENAME missing from .env')
  }
  const isDefaultManifestFile = vcManifestFilename.includes("MANIFEST")
  if (isDefaultManifestFile) {
    console.log("VC_MANIFEST_FILENAME is default MANIFEST file, checking contents ...");
    const fileData = await readFileToJSON(vcManifestFilename);
    if (!fileData || fileData.id.toLowerCase().includes('example'))
  }
}
export class Config {
  public _Web5?: Web5;
  public _Web5UserAgent?: Web5UserAgent;

  public DWN_RECOVERY_PHRASE_FILENAME = `${CWD}/src/config/recovery-phrase.txt`;
  public DWN_LAST_RECORD_ID_FILE = process.env.DWN_LAST_RECORD_ID_FILE || `${CWD}/lastRecordId`;
  public DWN_CURSOR_FILE = process.env.DWN_CURSOR_FILE || `${CWD}/cursor.json`;

  public DHT_GATEWAY_ENDPOINT = process.env.DHT_GATEWAY_ENDPOINT || '0.0.0.0:8305';
  public DWN_ENDPOINTS = process.env.DWN_ENDPOINTS?.split(',') || [];

  /**
   * @name OUTPUT_VC_DATA_PROVIDER the name of the 3rd party service called during VC issuance
   * @description The name of the service provider the DCX makes an API call to for data to issue response VC
   * @example 'vc_data_provider'
  */
  public OUTPUT_VC_DATA_PROVIDER = process.env.OUTPUT_VC_DATA_PROVIDER || 'dcx_vc_data_provider';
  /**
    * @name OUTPUT_VC_DATA_PROVIDER_ENDPOINT can be either 'vc_data_provider' or 'vc_issuer'
    * @description The full API endpoint of the {@link VC_DATA_PROVIDER} used by DCX to request VC data
    * @example 'https://api.vcdataprovider.com/v1/vc-data'
   */
  public OUTPUT_VC_DATA_PROVIDER_ENDPOINT = process.env.OUTPUT_VC_DATA_PROVIDER_ENDPOINT || '';
  public OUTPUT_VC_MANIFEST_FILENAME = process.env.OUTPUT_VC_MANIFEST_FILENAME || `${CWD}/src/protocol/handlers/MANIFEST.json`;
  public OUTPUT_VC_NAME = process.env.OUTPUT_VC_NAME || 'DCXVerifiableCredential';
  public OUTPUT_VC_ID = process.env.OUTPUT_VC_ID || 'dcx-verifiable-credential';
  public INPUT_VC_TRUSTED_ISSUERS = (process.env.INPUT_VC_TRUSTED_ISSUERS && JSON.parse(process.env.INPUT_VC_TRUSTED_ISSUERS))
    || [
      {
        "name": "mx",
        "did": "did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo"
      }
    ];

  private _CIPHER_KEY: Buffer;
  private _DWN_PASSWORD: string;
  private _DWN_RECOVERY_PHRASE: string;

  constructor() {
    this._CIPHER_KEY = Buffer.from(process.env.CIPHER_KEY ?? crypto.randomBytes(32).toString(), 'base64');
    this._DWN_PASSWORD = process.env.DWN_PASSWORD || '';
    this._DWN_RECOVERY_PHRASE = process.env.DWN_RECOVERY_PHRASE || '';

    if (!process.env.CIPHER_KEY) {
      console.log(`CIPHER_KEY missing from .env, new one created at ${CWD}/cipher-key.txt`, dcxConfig.CIPHER_KEY);
    }
  }

  get CIPHER_KEY(): Buffer {
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
console.debug("dcxConfig", dcxConfig);

if (process.env.NODE_ENV === 'production') {
  const filecheck = await isValidVcManifestFile(dcxConfig.OUTPUT_VC_MANIFEST_FILENAME)
  console.log("filecheck", filecheck);
}

/*
  TODO: work these async loading function into config class
  import { readFileToJSON, readFileToString } from './utils/file-system.js';
  public DWN_LAST_RECORD_ID = readFileToString(this.DWN_LAST_RECORD_ID_FILE).then(lastRecordId => lastRecordId).catch(console.error) ?? '';
    public DWN_CURSOR = readFileToJSON(this.DWN_CURSOR_FILE).then(cursor => cursor).catch(console.error) ?? {};
*/
