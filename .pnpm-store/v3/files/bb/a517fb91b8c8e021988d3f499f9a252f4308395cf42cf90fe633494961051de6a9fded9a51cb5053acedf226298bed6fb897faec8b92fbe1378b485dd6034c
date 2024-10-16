import type { DwnRpc, DwnRpcRequest, DwnRpcResponse } from './dwn-rpc-types.js';
import { DwnServerInfoCache, ServerInfo } from './server-info-types.js';
/**
 * HTTP client that can be used to communicate with Dwn Servers
 */
export declare class HttpDwnRpcClient implements DwnRpc {
    private serverInfoCache;
    constructor(serverInfoCache?: DwnServerInfoCache);
    get transportProtocols(): string[];
    sendDwnRequest(request: DwnRpcRequest): Promise<DwnRpcResponse>;
    getServerInfo(dwnUrl: string): Promise<ServerInfo>;
}
//# sourceMappingURL=http-dwn-rpc-client.d.ts.map