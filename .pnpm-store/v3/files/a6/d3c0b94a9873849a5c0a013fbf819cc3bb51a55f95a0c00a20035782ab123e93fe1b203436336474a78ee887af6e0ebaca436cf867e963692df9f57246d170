/// <reference types="node" />
import { PublicKey } from "./PublicKey";
export declare class PrivateKey {
    static fromHex(hex: string): PrivateKey;
    private readonly data;
    readonly publicKey: PublicKey;
    get secret(): Buffer;
    constructor(secret?: Uint8Array);
    toHex(): string;
    encapsulate(pk: PublicKey): Uint8Array;
    multiply(pk: PublicKey, compressed?: boolean): Uint8Array;
    equals(other: PrivateKey): boolean;
}
