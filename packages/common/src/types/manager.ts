import { DwnPaginationCursor, DwnResponseStatus } from '@web5/agent';
import { Record } from '@web5/api';
import { DcxConfig } from '../config';
import { CredentialManifest } from './dcx';
import { DcxOptions } from './options';

export type DcxRecordsQueryResponse = DwnResponseStatus & {
    records: Record[];
    cursor?: DwnPaginationCursor
};

export type DcxRecordsReadResponse = { records: CredentialManifest[] | any[] };

export type DcxRecordsCreateResponse = DcxRecordsReadResponse;

export type DcxRecordsFilterResponse = DcxRecordsReadResponse;

export type RecordsParams = { records: Record[] };
export type ManifestParams = { records: CredentialManifest[] };

export type DcxManagerParams = {
    options?: DcxOptions;
    config?: DcxConfig & { [key: string]: any };
};