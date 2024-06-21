import dotenv from 'dotenv';
dotenv.config();
<<<<<<< Updated upstream
console.log("process.cwd()", process.cwd())
export class DcxEnvConfig {
  public PORT = process.env.PORT || 3000;
  public EXTERNAL_PORT = process.env.EXTERNAL_PORT || 3000;
  public EXTERNAL_HOSTNAME = process.env.EXTERNAL_HOSTNAME || 'localhost';
  public SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange';
  public SERVICE_ID = process.env.SERVICE_ID || 'dcx';
  public DWN_LAST_RECORD_ID = `${process.cwd()}/lastRecordId`;
  public DWN_CURSOR = `${process.cwd()}/cursor.json`;
=======
export class DcxEnv {
  public static PORT = process.env.PORT || 3000;
  public static EXTERNAL_PORT = process.env.EXTERNAL_PORT || 3000;
  public static EXTERNAL_HOSTNAME = process.env.EXTERNAL_HOSTNAME || 'localhost';
  public static SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange';
  public static SERVICE_ID = process.env.SERVICE_ID || 'dcx';
  public static DWN_LAST_RECORD_ID = `${process.cwd()}/lastRecordId`;
  public static DWN_CURSOR = `${process.cwd()}/cursor.json`;
>>>>>>> Stashed changes

  public static DHT_GATEWAY_ENDPOINT = process.env.DHT_GATEWAY_ENDPOINT || 'http://dev.dht.formfree.com:8305/';
  public static DCX_DID_URI = process.env.DCX_DID_URI || '';
  public static DCX_DID_FILEPATH = process.env.DCX_DID_FILEPATH || '';
  public static DWN_ENDPOINTS = process.env.DWN_ENDPOINTS?.split(',') || ['https://dev.dwn.formfree.com/'];

  public static VC_DATA_PROVIDER = process.env.VC_DATA_PROVIDER || '';
  public static VC_ID = process.env.VC_ID || 'dcx-verifiable-credential';
  public static VC_NAME = process.env.VC_NAME || 'DCXVerifiableCredential';
  public static VC_DATA_PROVIDER_ENDPOINT = process.env.VC_DATA_PROVIDER_ENDPOINT || '';
  public static VC_TRUSTED_ISSUERS = (process.env.VC_TRUSTED_ISSUERS &&
    JSON.parse(process.env.VC_TRUSTED_ISSUERS)) || [
      {
        name: 'mx',
        did: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo',
      },
    ];

  // Private class variables
  private _CIPHER_KEY: Buffer = Buffer.from(process.env.CIPHER_KEY || '', 'base64');
  private _WEB5_CONNECT_PASSWORD: string = process.env.WEB5_CONNECT_PASSWORD || '';
  private _WEB5_CONNECT_RECOVERY_PHRASE: string = process.env.WEB5_CONNECT_RECOVERY_PHRASE || '';

  get CIPHER_KEY(): Buffer {
    return this._CIPHER_KEY;
  }
  set CIPHER_KEY(CIPHER_KEY: Buffer) {
    this._CIPHER_KEY = CIPHER_KEY;
  }

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

  get DcxEnv(): DcxEnv {
    return this;
  }
}

<<<<<<< Updated upstream
export const dcxEnvConfig = new DcxEnvConfig();
console.debug('dcxEnvConfig', dcxEnvConfig);
=======
// export const dcxEnvConfig = new DcxEnvConfig();
// console.debug('dcxEnvConfig', dcxEnvConfig);
>>>>>>> Stashed changes
