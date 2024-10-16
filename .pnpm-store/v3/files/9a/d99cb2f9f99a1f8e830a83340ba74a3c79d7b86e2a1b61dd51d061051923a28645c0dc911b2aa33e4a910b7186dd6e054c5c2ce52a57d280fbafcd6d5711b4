import * as P from 'micro-packed';
export type Bytes = Uint8Array;
export declare const mpi: P.CoderType<bigint>;
export declare const opaquempi: P.CoderType<Uint8Array>;
export declare const oid: P.CoderType<string>;
export declare const PacketLen: P.CoderType<number>;
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
export declare function decodeSecretKey(password: string, key: SecretKeyType): bigint;
export declare const pubArmor: P.Coder<any[], string>;
export declare const privArmor: P.Coder<any[], string>;
export declare function formatPublic(edPriv: Bytes, cvPriv: Bytes, user: string, createdAt?: number): string;
export declare function formatPrivate(edPriv: Bytes, cvPriv: Bytes, user: string, password: string, createdAt?: number, edSalt?: Uint8Array, edIV?: Uint8Array, cvSalt?: Uint8Array, cvIV?: Uint8Array): string;
/**
 * Derives PGP key ID from the private key.
 * PGP key depends on its date of creation.
 */
export declare function getKeyId(edPrivKey: Bytes, createdAt?: number): {
    edPubPacket: {
        readonly created: number;
        readonly algo: {
            readonly TAG: "EdDSA";
            readonly data: {
                readonly curve: "ed25519";
                readonly pub: bigint;
            };
        };
    };
    fingerprint: string;
    keyId: string;
    cvPubPacket: {
        readonly created: number;
        readonly algo: {
            readonly TAG: "ECDH";
            readonly data: {
                readonly curve: "curve25519";
                readonly pub: bigint;
                readonly params: {
                    readonly hash: "sha256";
                    readonly encryption: "aes128";
                };
            };
        };
    };
};
/**
 * Derives PGP private key, public key and fingerprint.
 * Uses S2K KDF, which means it's slow. Use `getKeyId` if you want to get key id in a fast way.
 * PGP key depends on its date of creation.
 * NOTE: gpg: warning: lower 3 bits of the secret key are not cleared
 * happens even for keys generated with GnuPG 2.3.6, because check looks at item as Opaque MPI, when it is just MPI:
 * https://dev.gnupg.org/rGdbfb7f809b89cfe05bdacafdb91a2d485b9fe2e0
 */
export declare function getKeys(privKey: Bytes, user: string, password: string, createdAt?: number): {
    keyId: string;
    privateKey: string;
    publicKey: string;
};
export default getKeys;
//# sourceMappingURL=pgp.d.ts.map