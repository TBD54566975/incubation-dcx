import { Config } from '@dcx-protocol/common';
export class IssuerConfig extends Config {
  constructor() {
    super();
  }
  public static PORT = process.env.PORT || 3000;
  public static EXTERNAL_PORT = process.env.EXTERNAL_PORT || 3000;
  public static SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange';
  public static SERVICE_ID = process.env.SERVICE_ID || 'dcx';

  public static LAST_RECORD_ID = process.env.LAST_RECORD_ID ?? `${process.cwd()}/lastRecordId`;
  public static CURSOR = process.env.CURSOR ?? `${process.cwd()}/cursor.json`;

  static get IssuerConfig(): IssuerConfig {
    return this;
  }
}

export type DcxIssuerConfig = InstanceType<typeof IssuerConfig>;