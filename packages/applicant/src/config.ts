import { Config } from '@dcx-protocol/common';
export class ApplicantConfig extends Config {
  constructor() {
    super();
  }

  public static NODE_ENV = process.env.NODE_ENV || 'development';
  public static SERVICE_NAME = process.env.SERVICE_NAME || 'decentralized credential exchange - applicant protocol';
  public static SERVICE_ID = process.env.SERVICE_ID || 'dcx-applicant-protocol';

  public static LAST_RECORD_ID = process.env.LAST_RECORD_ID ?? `${process.cwd()}/lastRecordId`;
  public static CURSOR = process.env.CURSOR ?? `${process.cwd()}/cursor.json`;

  static get ApplicantConfig(): ApplicantConfig {
    return this;
  }
}

export type ApplicantConfigType = InstanceType<typeof ApplicantConfig>;