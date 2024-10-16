/// <reference types="node" />
import { PrivateKey } from "./PrivateKey";
export declare class PublicKey {
    static fromHex(hex: string): PublicKey;
    private readonly data;
    get uncompressed(): Buffer;
    get compressed(): Buffer;
    constructor(data: Uint8Array);
    toHex(compressed?: boolean): string;
    decapsulate(sk: PrivateKey): Uint8Array;
    equals(other: PublicKey): boolean;
}
