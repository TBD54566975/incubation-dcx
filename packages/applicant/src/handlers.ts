import { Record } from '@web5/api';
import { CredentialManifest } from '@dcx-protocol/common';

export class ApplicantHandlers {
  public static async processResponseRecord(responseRecord: Record, manifest: CredentialManifest){
    return { responseRecord, manifest };
  }
}