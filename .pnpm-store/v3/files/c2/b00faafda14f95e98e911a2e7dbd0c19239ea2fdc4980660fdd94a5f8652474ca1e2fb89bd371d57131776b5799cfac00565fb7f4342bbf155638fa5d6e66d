export declare const MASTER_SECRET: Uint8Array;
export declare const HARDENED_OFFSET: number;
type Hex = Uint8Array | string;
interface HDKeyOpt {
    depth?: number;
    index?: number;
    parentFingerprint?: number;
    chainCode: Uint8Array;
    privateKey: Uint8Array;
}
export declare class HDKey {
    get publicKeyRaw(): Uint8Array;
    get publicKey(): Uint8Array;
    get pubHash(): Uint8Array;
    get fingerprint(): number;
    get fingerprintHex(): string;
    get parentFingerprintHex(): string;
    static fromMasterSeed(seed: Hex): HDKey;
    readonly depth: number;
    readonly index: number;
    readonly chainCode: Uint8Array;
    readonly parentFingerprint: number;
    readonly privateKey: Uint8Array;
    constructor(opt: HDKeyOpt);
    derive(path: string, forceHardened?: boolean): HDKey;
    deriveChild(index: number): HDKey;
    sign(message: Hex): Uint8Array;
    verify(message: Hex, signature: Hex): boolean;
}
export {};
//# sourceMappingURL=hdkey.d.ts.map