import { ProtocolsConfigureResponse, ProtocolsQueryResponse, Web5 } from '@web5/api';
import { DcxIdentityVault } from './dcx-identity-vault';
import { DcxAgent, DcxConfig, DcxOptions } from './index.js';
import { DcxRecordsQueryResponse, DcxRecordsReadResponse, RecordsParams } from './types/manager';

export interface DcxManager {
    isSetup: boolean;
    isInitialized: boolean;

    dcxOptions: DcxOptions;
    dcxConfig: DcxConfig;

    web5: Web5;
    agent: DcxAgent;
    agentVault: DcxIdentityVault;

    queryProtocols(): Promise<ProtocolsQueryResponse>;
    configureProtocols(): Promise<ProtocolsConfigureResponse>;
    queryRecords(params: {}): Promise<DcxRecordsQueryResponse>;
    readRecords(params: RecordsParams): Promise<DcxRecordsReadResponse>;
    createRecords(params: RecordsParams): Promise<DcxRecordsReadResponse>;
}