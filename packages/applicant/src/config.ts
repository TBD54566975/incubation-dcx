import dotenv from 'dotenv';
dotenv.config();

import { Config } from '../../common/src/index.js';

export class ApplicantConfig extends Config {
  constructor() {
    super();
  }

  public static NODE_ENV = process.env.NODE_ENV || 'development';
  public static SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange';
  public static SERVICE_ID = process.env.SERVICE_ID || 'dcx';

  public static LAST_RECORD_ID = process.env.LAST_RECORD_ID ?? `${process.cwd()}/lastRecordId`;
  public static CURSOR = process.env.CURSOR ?? `${process.cwd()}/cursor.json`;

  public static DEFAULT_DWN_ENDPOINTS = ['https://dwn.formfree.com/'];
  public static DEFAULT_GATEWAY_URIS = ['https://diddht.tbddev.org/'];
  public static DEFAULT_TRUSTED_ISSUERS = [{ name: 'mx', id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'},];
  public static DEFAULT_TRUSTED_ISSUER_DIDS = ApplicantConfig.DEFAULT_TRUSTED_ISSUERS.map((issuer: Issuer) => issuer.id);

  static get ApplicantConfig(): ApplicantConfig {
    return this;
  }
}

export type DcxApplicantConfig = InstanceType<typeof ApplicantConfig>;