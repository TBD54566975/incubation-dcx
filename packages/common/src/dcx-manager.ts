import { ProtocolsConfigureResponse, ProtocolsQueryResponse, Web5 } from '@web5/api';
import {
  DcxAgent,
  DcxConfig,
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

export type InitializeParams = {
  agent?: DcxAgent;
  web5?: Web5
}
export interface DcxManager {
    config                                     : DcxConfig;
    status                                     : DcxManagerStatus;
    setup()                                    : Promise<void>;
    initialize(params?: InitializeParams)      : Promise<void>;
    queryProtocols()                           : Promise<ProtocolsQueryResponse>;
    configureProtocols()                       : Promise<ProtocolsConfigureResponse>;
    queryRecords(params?: RecordsQueryParams)  : Promise<RecordsQueryResponse>;
    readRecords(params: RecordsReadParams)     : Promise<RecordsReadResponse>;
    createRecord(params: RecordCreateParams)   : Promise<RecordCreateResponse>;
    createRecords(params: RecordsCreateParams) : Promise<RecordsCreateResponse>;
}