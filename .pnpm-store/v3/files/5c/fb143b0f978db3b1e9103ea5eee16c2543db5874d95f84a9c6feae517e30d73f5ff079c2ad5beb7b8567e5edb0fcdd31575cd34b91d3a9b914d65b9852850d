import type { DwnRpc, DwnRpcRequest, DwnRpcResponse } from './prototyping/clients/dwn-rpc-types.js';
import type { DwnServerInfoRpc, ServerInfo } from './prototyping/clients/server-info-types.js';
import { HttpDwnRpcClient } from './prototyping/clients/http-dwn-rpc-client.js';
import { WebSocketDwnRpcClient } from './prototyping/clients/web-socket-clients.js';
/**
 * Interface that can be implemented to communicate with {@link Web5Agent | Web5 Agent}
 * implementations via JSON-RPC.
 */
export interface DidRpc {
    get transportProtocols(): string[];
    sendDidRequest(request: DidRpcRequest): Promise<DidRpcResponse>;
}
export declare enum DidRpcMethod {
    Create = "did.create",
    Resolve = "did.resolve"
}
export type DidRpcRequest = {
    data: string;
    method: DidRpcMethod;
    url: string;
};
export type DidRpcResponse = {
    data?: string;
    ok: boolean;
    status: RpcStatus;
};
export type RpcStatus = {
    code: number;
    message: string;
};
export interface Web5Rpc extends DwnRpc, DidRpc, DwnServerInfoRpc {
}
/**
 * Client used to communicate with Dwn Servers
 */
export declare class Web5RpcClient implements Web5Rpc {
    private transportClients;
    constructor(clients?: Web5Rpc[]);
    get transportProtocols(): string[];
    sendDidRequest(request: DidRpcRequest): Promise<DidRpcResponse>;
    sendDwnRequest(request: DwnRpcRequest): Promise<DwnRpcResponse>;
    getServerInfo(dwnUrl: string): Promise<ServerInfo>;
}
export declare class HttpWeb5RpcClient extends HttpDwnRpcClient implements Web5Rpc {
    sendDidRequest(request: DidRpcRequest): Promise<DidRpcResponse>;
}
export declare class WebSocketWeb5RpcClient extends WebSocketDwnRpcClient implements Web5Rpc {
    sendDidRequest(_request: DidRpcRequest): Promise<DidRpcResponse>;
    getServerInfo(_dwnUrl: string): Promise<ServerInfo>;
}
//# sourceMappingURL=rpc-client.d.ts.map