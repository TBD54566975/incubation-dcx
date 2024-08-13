import { ProtocolsConfigureResponse, ProtocolsQueryResponse } from '@web5/api';
import { DcxOptions, DcxRecordsQueryResponse, DcxRecordsReadResponse, RecordsParams } from './index.js';

export interface DcxManager {
    options: DcxOptions;

    queryProtocols(): Promise<ProtocolsQueryResponse>;
    configureProtocols(): Promise<ProtocolsConfigureResponse>;
    queryRecords(params: {}): Promise<DcxRecordsQueryResponse>;
    readRecords(params: RecordsParams): Promise<DcxRecordsReadResponse>;
    createRecords?(params: RecordsParams): Promise<DcxRecordsReadResponse>;
}