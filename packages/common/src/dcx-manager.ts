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

export type DcxManagerStatus = {
    setup       : boolean;
    initialized : boolean;
}
export interface DcxManager {
    options                                    : DcxOptions;
    status                                     : DcxManagerStatus;
    setup()                                    : Promise<void>;
    initialize()                               : Promise<void>;
    queryProtocols()                           : Promise<ProtocolsQueryResponse>;
    configureProtocols()                       : Promise<ProtocolsConfigureResponse>;
    queryRecords(params?: RecordsQueryParams)  : Promise<RecordsQueryResponse>;
    readRecords(params: RecordsReadParams)     : Promise<RecordsReadResponse>;
    createRecord(params: RecordCreateParams)   : Promise<RecordCreateResponse>;
    createRecords(params: RecordsCreateParams) : Promise<RecordsCreateResponse>;
}