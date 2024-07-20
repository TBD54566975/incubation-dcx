import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { FileSystem } from './utils/file-system';

const packageJsonExists = await FileSystem.exists(path.resolve(process.cwd(), 'package.json')) ;
let filePath;
if(packageJsonExists){
  const rootDir = path.resolve(__dirname, '../../../');
  filePath = path.join(rootDir, '.env');
} else {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, '../../../');
  filePath = path.join(rootDir, '.env');
}
dotenv.config({ path: filePath });

export class Config {
  public static NODE_ENV = process.env.NODE_ENV || 'development';
  public static TBD_DWN_ENDPOINT = 'https://dwn.formfree.com/';
  public static FF_DWN_ENDPOINT = 'https://dwn.formfree.com/';
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
  public static DEFAULT_DWN_ENDPOINTS = [Config.DEFAULT_ENDPOINTS.FF.DWN, Config.DEFAULT_ENDPOINTS.TBD.DWN];
  public static DEFAULT_GATEWAY_URIS = [Config.DEFAULT_ENDPOINTS.FF.GATEWAY, Config.DEFAULT_ENDPOINTS.TBD.GATEWAY];

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