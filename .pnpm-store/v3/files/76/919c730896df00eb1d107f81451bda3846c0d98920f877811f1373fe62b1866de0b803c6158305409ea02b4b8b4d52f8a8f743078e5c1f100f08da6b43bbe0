import { JsonRpcRequest, JsonRpcResponse } from './json-rpc.js';
export interface JsonRpcSocketOptions {
    /** socket connection timeout in milliseconds */
    connectTimeout?: number;
    /** response timeout for rpc requests in milliseconds */
    responseTimeout?: number;
    /** optional connection close handler */
    onclose?: () => void;
    /** optional socket error handler */
    onerror?: (error?: any) => void;
}
/**
 * JSON RPC Socket Client for WebSocket request/response and long-running subscriptions.
 *
 * NOTE: This is temporarily copied over from https://github.com/TBD54566975/dwn-server/blob/main/src/json-rpc-socket.ts
 * This was done in order to avoid taking a dependency on the `dwn-server`, until a future time when there will be a `clients` package.
 */
export declare class JsonRpcSocket {
    private socket;
    private responseTimeout;
    private messageHandlers;
    private constructor();
    static connect(url: string, options?: JsonRpcSocketOptions): Promise<JsonRpcSocket>;
    close(): void;
    /**
     * Sends a JSON-RPC request through the socket and waits for a single response.
     */
    request(request: JsonRpcRequest): Promise<JsonRpcResponse>;
    /**
     * Sends a JSON-RPC request through the socket and keeps a listener open to read associated responses as they arrive.
     * Returns a close method to clean up the listener.
     */
    subscribe(request: JsonRpcRequest, listener: (response: JsonRpcResponse) => void): Promise<{
        response: JsonRpcResponse;
        close?: () => Promise<void>;
    }>;
    private closeSubscription;
    /**
     * Sends a JSON-RPC request through the socket. You must subscribe to a message listener separately to capture the response.
     */
    send(request: JsonRpcRequest): void;
}
//# sourceMappingURL=json-rpc-socket.d.ts.map