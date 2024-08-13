import { ProtocolsConfigureResponse, ProtocolsQueryResponse } from '@web5/api';
import { DcxConfig, DcxOptions, DcxRecordsQueryResponse, DcxRecordsReadResponse, RecordsParams } from './index.js';

export interface DcxManager {
    isSetup: boolean;
    isInitialized: boolean;

    dcxOptions: DcxOptions;
    dcxConfig: DcxConfig;

    queryProtocols(): Promise<ProtocolsQueryResponse>;
    configureProtocols(): Promise<ProtocolsConfigureResponse>;
    queryRecords(params: {}): Promise<DcxRecordsQueryResponse>;
    readRecords(params: RecordsParams): Promise<DcxRecordsReadResponse>;
    createRecords(params: RecordsParams): Promise<DcxRecordsReadResponse>;
}