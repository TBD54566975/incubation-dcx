import * as P from 'micro-packed';
export declare const SSHString: P.CoderType<string>;
export declare const SSHBuf: P.CoderType<Uint8Array>;
export declare const SSHKeyType: P.CoderType<undefined>;
export declare const PublicKey: P.CoderType<P.StructInput<{
    keyType: undefined;
    pubKey: Uint8Array;
}>>;
export declare const AuthData: P.CoderType<P.StructInput<{
    nonce: Uint8Array;
    userAuthRequest: number;
    user: string;
    conn: string;
    auth: string;
    haveSig: number;
    keyType: undefined;
    pubKey: P.StructInput<{
        keyType: any;
        pubKey: any;
    }>;
}>>;
export type AuthDataType = P.UnwrapCoder<typeof AuthData>;
export declare const PrivateExport: P.Coder<P.StructInput<{
    magic: undefined;
    ciphername: undefined;
    kdfname: undefined;
    kdfopts: undefined;
    keys: P.StructInput<{
        pubKey: any;
        privKey: any;
    }>[];
}>, string>;
export declare function formatPublicKey(bytes: Uint8Array, comment?: string): string;
export declare function getFingerprint(bytes: Uint8Array): string;
export declare function getKeys(privateKey: Uint8Array, comment?: string, checkBytes?: Uint8Array): Promise<{
    publicKeyBytes: Uint8Array;
    publicKey: string;
    fingerprint: string;
    privateKey: string;
}>;
export declare function authSign(privateKey: Uint8Array, data: AuthDataType): Uint8Array;
export default getKeys;
//# sourceMappingURL=ssh.d.ts.map