import * as P from 'micro-packed';
export type Bytes = Uint8Array;
export declare const mpi: P.BytesCoderStream<bigint> & P.BytesCoder<bigint>;
export declare const opaquempi: P.BytesCoderStream<Uint8Array> & P.BytesCoder<Uint8Array>;
export declare const oid: P.BytesCoderStream<string> & P.BytesCoder<string>;
export declare const PacketLen: P.BytesCoderStream<number> & P.BytesCoder<number>;
export declare const PubKeyPacket: P.CoderType<P.StructInput<{
    version: undefined;
    created: number;
    algo: P.Values<{
        EdDSA: {
            TAG: "EdDSA";
            data: P.StructInput<{
                curve: any;
                pub: any;
            }>;
        };
        ECDH: {
            TAG: "ECDH";
            data: P.StructInput<{
                curve: any;
                pub: any;
                params: any;
            }>;
        };
    }>;
}>>;
declare const SecretKeyPacket: P.CoderType<P.StructInput<{
    pub: P.StructInput<{
        version: any;
        created: any;
        algo: any;
    }>;
    type: P.Values<{
        plain: {
            TAG: "plain";
            data: P.StructInput<{
                secret: any;
            }>;
        };
        encrypted: {
            TAG: "encrypted";
            data: P.StructInput<{
                enc: any;
                S2K: any;
                iv: any;
                secret: any;
            }>;
        };
        encrypted2: {
            TAG: "encrypted2";
            data: P.StructInput<{
                enc: any;
                S2K: any;
                iv: any;
                secret: any;
            }>;
        };
    }>;
}>>;
type SecretKeyType = P.UnwrapCoder<typeof SecretKeyPacket>;
export declare const Stream: P.CoderType<any[]>;
export declare function decodeSecretKey(password: string, key: SecretKeyType): Promise<bigint>;
export declare const pubArmor: P.Coder<any[], string>;
export declare const privArmor: P.Coder<any[], string>;
export declare function formatPublic(edPriv: Bytes, cvPriv: Bytes, user: string, created?: number): Promise<string>;
export declare function formatPrivate(edPriv: Bytes, cvPriv: Bytes, user: string, password: string, created?: number, edSalt?: Uint8Array, edIV?: Uint8Array, cvSalt?: Uint8Array, cvIV?: Uint8Array): Promise<string>;
export declare function getKeys(privKey: Bytes, user: string, password: string, created?: number): Promise<{
    keyId: string;
    privateKey: string;
    publicKey: string;
}>;
export default getKeys;
//# sourceMappingURL=pgp.d.ts.map