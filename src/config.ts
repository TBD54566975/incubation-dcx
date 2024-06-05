import { readFile } from "fs/promises";

const DWN_LAST_RECORD_ID_FILE = `${process.cwd()}/lastRecordId`;
const DWN_CURSOR_FILE = `${process.cwd()}/cursor.json`;

const DWN_LAST_RECORD_ID = await readFile(DWN_LAST_RECORD_ID_FILE) || '';
const DWN_CURSOR = await readFile(DWN_CURSOR_FILE) || '';

export class Config {
  public DWN_LAST_RECORD_ID_FILE = DWN_LAST_RECORD_ID_FILE;
  public DWN_CURSOR_FILE = DWN_CURSOR_FILE;
  public DWN_LAST_RECORD_ID = DWN_LAST_RECORD_ID;
  public DWN_CURSOR = DWN_CURSOR;
  public ISSUER_SERVICE_ENDPOINT = process.env.ISSUER_SERVICE_ENDPOINT || '';
  public DHT_GATEWAY_ENDPOINT = process.env.DHT_GATEWAY_ENDPOINT || '';
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