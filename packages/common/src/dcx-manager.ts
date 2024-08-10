import { DwnPaginationCursor, DwnResponseStatus } from '@web5/agent';
import { ProtocolsConfigureResponse, ProtocolsQueryResponse, Record, Web5 } from '@web5/api';
import { DcxIdentityVault } from './dcx-identity-vault';
import { CredentialManifest, DcxAgent, DcxConfig, DcxOptions } from './index.js';

type DcxRecordsQueryResponse = DwnResponseStatus & { records: Record[]; cursor?: DwnPaginationCursor }
type DcxRecordsReadResponse = { records: CredentialManifest[] | any[] };
type RecordsParams = { records: Record[] };

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

    queryRecords(): Promise<DcxRecordsQueryResponse>;

    readRecords(params: RecordsParams): Promise<DcxRecordsReadResponse>;

    createRecords(params: RecordsParams): Promise<ProtocolsConfigureResponse>;
}