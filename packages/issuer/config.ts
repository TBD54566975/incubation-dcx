import dotenv from 'dotenv';
dotenv.config();
import { Config } from '../common/index.js';

export class IssuerConfig extends Config {
  constructor() {
    super();
  }

  public static DEFAULT_DWN_ENDPOINTS = Config.DEFAULT_DWN_ENDPOINTS;
  public static DEFAULT_GATEWAY_URIS = Config.DEFAULT_GATEWAY_URIS; 
  public static DEFAULT_TRUSTED_ISSUERS = [{ name: 'mx', id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'},];
  public static DEFAULT_TRUSTED_ISSUER_DIDS = IssuerConfig.DEFAULT_TRUSTED_ISSUERS.map((issuer: Issuer) => issuer.id);

  public static SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange';
  public static SERVICE_ID = process.env.SERVICE_ID || 'dcx';

  public static LAST_RECORD_ID = process.env.LAST_RECORD_ID ?? `${process.cwd()}/lastRecordId`;
  public static CURSOR = process.env.CURSOR ?? `${process.cwd()}/cursor.json`;

  static get IssuerConfig(): IssuerConfig {
    return this;
  }
}

export type DcxIssuerConfig = InstanceType<typeof IssuerConfig>;