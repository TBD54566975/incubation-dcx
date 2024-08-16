import { VerifiableCredential } from '@web5/credentials';

export type RequestCredentialParams = {
    body : { vcs: VerifiableCredential[] | any },
    id?  : string
  }