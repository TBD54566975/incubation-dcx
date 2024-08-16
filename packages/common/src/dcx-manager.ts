import { ProtocolsConfigureResponse, ProtocolsQueryResponse } from '@web5/api';
import {
  DcxOptions,
  RecordCreateParams,
  RecordCreateResponse,
  RecordsCreateParams,
  RecordsCreateResponse,
  RecordsQueryParams,
  RecordsQueryResponse,
  RecordsReadParams,
  RecordsReadResponse
} from './index.js';

export interface DcxManager {
    options: DcxOptions;

    queryProtocols(): Promise<ProtocolsQueryResponse>;
    configureProtocols(): Promise<ProtocolsConfigureResponse>;
    queryRecords(params?: RecordsQueryParams): Promise<RecordsQueryResponse>;
    readRecords(params: RecordsReadParams): Promise<RecordsReadResponse>;
    createRecord(params: RecordCreateParams): Promise<RecordCreateResponse>;
    createRecords(params: RecordsCreateParams): Promise<RecordsCreateResponse>;

    initializeWeb5(): Promise<void>;
    setupDwn(): Promise<void>;
}