import type { Coder as BaseCoder } from '@scure/base';
/**
 * TODO:
 * - Holes, simplify pointers. Hole is some sized element which is skipped at encoding,
 *   but later other elements can write to it by path
 * - Composite / tuple keys for dict
 * - Web UI for easier debugging. We can wrap every coder to something that would write
 *   start & end positions to; and we can colorize specific bytes used by specific coder
 */
export declare const EMPTY: Uint8Array;
export declare const NULL: Uint8Array;
export declare function equalBytes(a: Uint8Array, b: Uint8Array): boolean;
export declare function isBytes(a: unknown): a is Bytes;
/**
 * Copies several Uint8Arrays into one.
 */
export declare function concatBytes(...arrays: Uint8Array[]): Uint8Array;
export type Bytes = Uint8Array;
export type Option<T> = T | undefined;
export interface Coder<F, T> {
    encode(from: F): T;
    decode(to: T): F;
}
export interface BytesCoder<T> extends Coder<T, Bytes> {
    size?: number;
    encode: (data: T) => Bytes;
    decode: (data: Bytes) => T;
}
export interface BytesCoderStream<T> {
    size?: number;
    encodeStream: (w: Writer, value: T) => void;
    decodeStream: (r: Reader) => T;
}
export type CoderType<T> = BytesCoderStream<T> & BytesCoder<T>;
export type Sized<T> = CoderType<T> & {
    size: number;
};
export type UnwrapCoder<T> = T extends CoderType<infer U> ? U : T;
export type Length = CoderType<number> | CoderType<bigint> | number | Bytes | string | null;
type ArrLike<T> = Array<T> | ReadonlyArray<T>;
export type TypedArray = Uint8Array | Int8Array | Uint8ClampedArray | Uint16Array | Int16Array | Uint32Array | Int32Array;
export type Writable<T> = T extends {} ? T extends TypedArray ? T : {
    -readonly [P in keyof T]: Writable<T[P]>;
} : T;
export type Values<T> = T[keyof T];
export type NonUndefinedKey<T, K extends keyof T> = T[K] extends undefined ? never : K;
export type NullableKey<T, K extends keyof T> = T[K] extends NonNullable<T[K]> ? never : K;
export type OptKey<T, K extends keyof T> = NullableKey<T, K> & NonUndefinedKey<T, K>;
export type ReqKey<T, K extends keyof T> = T[K] extends NonNullable<T[K]> ? K : never;
export type OptKeys<T> = Pick<T, {
    [K in keyof T]: OptKey<T, K>;
}[keyof T]>;
export type ReqKeys<T> = Pick<T, {
    [K in keyof T]: ReqKey<T, K>;
}[keyof T]>;
export type StructInput<T extends Record<string, any>> = {
    [P in keyof ReqKeys<T>]: T[P];
} & {
    [P in keyof OptKeys<T>]?: T[P];
};
export type StructRecord<T extends Record<string, any>> = {
    [P in keyof T]: CoderType<T[P]>;
};
export type StructOut = Record<string, any>;
export type PadFn = (i: number) => number;
export type ReaderOpts = {
    allowUnreadBytes?: boolean;
    allowMultipleReads?: boolean;
};
export declare class Reader {
    readonly data: Bytes;
    readonly opts: ReaderOpts;
    path: StructOut[];
    fieldPath: string[];
    private parent;
    parentOffset: number;
    pos: number;
    bitBuf: number;
    bitPos: number;
    private bs;
    constructor(data: Bytes, opts?: ReaderOpts, path?: StructOut[], fieldPath?: string[], parent?: Reader | undefined, parentOffset?: number);
    enablePtr(): void;
    private markBytesBS;
    private markBytes;
    err(msg: string): Error;
    absBytes(n: number): Uint8Array;
    offsetReader(n: number): Reader;
    bytes(n: number, peek?: boolean): Uint8Array;
    byte(peek?: boolean): number;
    get leftBytes(): number;
    isEnd(): boolean;
    length(len: Length): number;
    bits(bits: number): number;
    find(needle: Bytes, pos?: number): number | undefined;
    finish(): void;
    fieldPathPush(s: string): void;
    fieldPathPop(): void;
}
export declare class Writer {
    path: StructOut[];
    fieldPath: string[];
    private buffers;
    pos: number;
    ptrs: {
        pos: number;
        ptr: CoderType<number>;
        buffer: Bytes;
    }[];
    bitBuf: number;
    bitPos: number;
    constructor(path?: StructOut[], fieldPath?: string[]);
    err(msg: string): Error;
    bytes(b: Bytes): void;
    byte(b: number): void;
    get buffer(): Bytes;
    length(len: Length, value: number): void;
    bits(value: number, bits: number): void;
    fieldPathPush(s: string): void;
    fieldPathPop(): void;
}
export declare function checkBounds(p: Writer | Reader, value: bigint, bits: bigint, signed: boolean): void;
export declare function wrap<T>(inner: BytesCoderStream<T>): BytesCoderStream<T> & BytesCoder<T>;
export declare function isCoder<T>(elm: any): elm is CoderType<T>;
declare function dict<T>(): BaseCoder<[string, T][], Record<string, T>>;
type Enum = {
    [k: string]: number | string;
} & {
    [k: number]: string;
};
type EnumKeys<T extends Enum> = keyof T;
declare function tsEnum<T extends Enum>(e: T): BaseCoder<number, EnumKeys<T>>;
declare function decimal(precision: number): {
    encode: (from: bigint) => string;
    decode: (to: string) => bigint;
};
type BaseInput<F> = F extends BaseCoder<infer T, any> ? T : never;
type BaseOutput<F> = F extends BaseCoder<any, infer T> ? T : never;
/**
 * Allows to split big conditional coders into a small one; also sort of parser combinator:
 *
 *   `encode = [Ae, Be]; decode = [Ad, Bd]`
 *   ->
 *   `match([{encode: Ae, decode: Ad}, {encode: Be; decode: Bd}])`
 *
 * 1. It is easier to reason: encode/decode of specific part are closer to each other
 * 2. Allows composable coders and ability to add conditions on runtime
 * @param lst
 * @returns
 */
declare function match<L extends BaseCoder<unknown | undefined, unknown | undefined>[], I = {
    [K in keyof L]: NonNullable<BaseInput<L[K]>>;
}[number], O = {
    [K in keyof L]: NonNullable<BaseOutput<L[K]>>;
}[number]>(lst: L): BaseCoder<I, O>;
export declare const coders: {
    dict: typeof dict;
    number: BaseCoder<bigint, number>;
    tsEnum: typeof tsEnum;
    decimal: typeof decimal;
    match: typeof match;
    reverse: <F, T>(coder: Coder<F, T>) => Coder<T, F>;
};
export declare const bits: (len: number) => CoderType<number>;
export declare const bigint: (size: number, le?: boolean, signed?: boolean, sized?: boolean) => CoderType<bigint>;
export declare const U256LE: CoderType<bigint>;
export declare const U256BE: CoderType<bigint>;
export declare const I256LE: CoderType<bigint>;
export declare const I256BE: CoderType<bigint>;
export declare const U128LE: CoderType<bigint>;
export declare const U128BE: CoderType<bigint>;
export declare const I128LE: CoderType<bigint>;
export declare const I128BE: CoderType<bigint>;
export declare const U64LE: CoderType<bigint>;
export declare const U64BE: CoderType<bigint>;
export declare const I64LE: CoderType<bigint>;
export declare const I64BE: CoderType<bigint>;
export declare const int: (size: number, le?: boolean, signed?: boolean, sized?: boolean) => CoderType<number>;
export declare const U32LE: CoderType<number>;
export declare const U32BE: CoderType<number>;
export declare const I32LE: CoderType<number>;
export declare const I32BE: CoderType<number>;
export declare const U16LE: CoderType<number>;
export declare const U16BE: CoderType<number>;
export declare const I16LE: CoderType<number>;
export declare const I16BE: CoderType<number>;
export declare const U8: CoderType<number>;
export declare const I8: CoderType<number>;
export declare const bool: CoderType<boolean>;
export declare const bytes: (len: Length, le?: boolean) => CoderType<Bytes>;
export declare const string: (len: Length, le?: boolean) => CoderType<string>;
export declare const cstring: CoderType<string>;
export declare const hex: (len: Length, le?: boolean, withZero?: boolean) => CoderType<string>;
export declare function apply<T, F>(inner: CoderType<T>, b: BaseCoder<T, F>): CoderType<F>;
export declare function validate<T>(inner: CoderType<T>, fn: (elm: T) => T): CoderType<T>;
export declare function lazy<T>(fn: () => CoderType<T>): CoderType<T>;
type baseFmt = 'utf8' | 'hex' | 'base16' | 'base32' | 'base64' | 'base64url' | 'base58' | 'base58xmr';
export declare const bytesFormatted: (len: Length, fmt: baseFmt, le?: boolean) => BytesCoderStream<string> & BytesCoder<string>;
export declare const flag: (flagValue: Bytes, xor?: boolean) => CoderType<boolean>;
export declare function flagged<T>(path: string | BytesCoderStream<boolean>, inner: BytesCoderStream<T>, def?: T): CoderType<Option<T>>;
export declare function optional<T>(flag: BytesCoderStream<boolean>, inner: BytesCoderStream<T>, def?: T): CoderType<Option<T>>;
export declare function magic<T>(inner: CoderType<T>, constant: T, check?: boolean): CoderType<undefined>;
export declare const magicBytes: (constant: Bytes | string) => CoderType<undefined>;
export declare function constant<T>(c: T): CoderType<T>;
export declare function struct<T extends Record<string, any>>(fields: StructRecord<T>): CoderType<StructInput<T>>;
export declare function tuple<T extends ArrLike<CoderType<any>>, O = Writable<{
    [K in keyof T]: UnwrapCoder<T[K]>;
}>>(fields: T): CoderType<O>;
type PrefixLength = string | number | CoderType<number> | CoderType<bigint>;
export declare function prefix<T>(len: PrefixLength, inner: CoderType<T>): CoderType<T>;
export declare function array<T>(len: Length, inner: CoderType<T>): CoderType<T[]>;
export declare function map<T>(inner: CoderType<T>, variants: Record<string, T>): CoderType<string>;
export declare function tag<T extends Values<{
    [P in keyof Variants]: {
        TAG: P;
        data: UnwrapCoder<Variants[P]>;
    };
}>, TagValue extends string | number, Variants extends Record<TagValue, CoderType<any>>>(tag: CoderType<TagValue>, variants: Variants): CoderType<T>;
export declare function mappedTag<T extends Values<{
    [P in keyof Variants]: {
        TAG: P;
        data: UnwrapCoder<Variants[P][1]>;
    };
}>, TagValue extends string | number, Variants extends Record<string, [TagValue, CoderType<any>]>>(tagCoder: CoderType<TagValue>, variants: Variants): CoderType<T>;
export declare function bitset<Names extends readonly string[]>(names: Names, pad?: boolean): CoderType<Record<Names[number], boolean>>;
export declare const ZeroPad: PadFn;
export declare function padLeft<T>(blockSize: number, inner: CoderType<T>, padFn: Option<PadFn>): CoderType<T>;
export declare function padRight<T>(blockSize: number, inner: CoderType<T>, padFn: Option<PadFn>): CoderType<T>;
export declare function pointer<T>(ptr: CoderType<number>, inner: CoderType<T>, sized?: boolean): CoderType<T>;
export declare function base64armor<T>(name: string, lineLen: number, inner: Coder<T, Bytes>, checksum?: (data: Bytes) => Bytes): Coder<T, string>;
export declare const nothing: CoderType<undefined>;
export declare function debug<T>(inner: CoderType<T>): CoderType<T>;
export declare const _TEST: {
    _bitset: {
        BITS: number;
        FULL_MASK: number;
        len: (len: number) => number;
        create: (len: number) => Uint32Array;
        clean: (bs: Uint32Array) => Uint32Array;
        debug: (bs: Uint32Array) => string[];
        checkLen: (bs: Uint32Array, len: number) => void;
        chunkLen: (bsLen: number, pos: number, len: number) => void;
        set: (bs: Uint32Array, chunk: number, value: number, allowRewrite?: boolean) => boolean;
        pos: (pos: number, i: number) => {
            chunk: number;
            mask: number;
        };
        indices: (bs: Uint32Array, len: number, invert?: boolean) => number[];
        range: (arr: number[]) => {
            pos: number;
            length: number;
        }[];
        rangeDebug: (bs: Uint32Array, len: number, invert?: boolean) => string;
        setRange: (bs: Uint32Array, bsLen: number, pos: number, len: number, allowRewrite?: boolean) => boolean;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map