import { Record } from '@web5/api';
import { CredentialManifest, ServerHandler } from '@dcx-protocol/common';

export class ApplicantHandlers {
  public static applicantHandlers: ServerHandler[];

  public static async processResponseRecord(responseRecord: Record, manifest: CredentialManifest){
    return { responseRecord, manifest };
  }
}