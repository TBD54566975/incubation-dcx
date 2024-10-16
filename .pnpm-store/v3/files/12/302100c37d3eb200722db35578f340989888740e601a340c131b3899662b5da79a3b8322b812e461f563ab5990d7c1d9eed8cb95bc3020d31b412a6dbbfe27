/**
 * @packageDocumentation
 *
 * This module contains the protobuf definition of the UnixFS data structure found at the root of all UnixFS DAGs.
 *
 * The UnixFS spec can be found in the [ipfs/specs repository](http://github.com/ipfs/specs)
 *
 * @example Create a file composed of several blocks
 *
 * ```JavaScript
 * const data = new UnixFS({ type: 'file' })
 * data.addBlockSize(256) // add the size of each block
 * data.addBlockSize(256)
 * // ...
 * ```
 *
 * @example Create a directory that contains several files
 *
 * Creating a directory that contains several files is achieve by creating a unixfs element that identifies a MerkleDAG node as a directory. The links of that MerkleDAG node are the files that are contained in this directory.
 *
 * ```JavaScript
 * const data = new UnixFS({ type: 'directory' })
 * ```
 *
 * @example Create an unixfs Data element
 *
 * ```JavaScript
 * const data = new UnixFS([options])
 * ```
 *
 * `options` is an optional object argument that might include the following keys:
 *
 * - type (string, default `file`): The type of UnixFS entry.  Can be:
 *   - `raw`
 *   - `directory`
 *   - `file`
 *   - `metadata`
 *   - `symlink`
 *   - `hamt-sharded-directory`
 * - data (Uint8Array): The optional data field for this node
 * - blockSizes (Array, default: `[]`): If this is a `file` node that is made up of multiple blocks, `blockSizes` is a list numbers that represent the size of the file chunks stored in each child node. It is used to calculate the total file size.
 * - mode (Number, default `0644` for files, `0755` for directories/hamt-sharded-directories) file mode
 * - mtime (`Date`, `{ secs, nsecs }`, `{ Seconds, FractionalNanoseconds }`, `[ secs, nsecs ]`): The modification time of this node
 *
 * @example Add and remove a block size to the block size list
 *
 * ```JavaScript
 * data.addBlockSize(<size in bytes>)
 * ```
 *
 * ```JavaScript
 * data.removeBlockSize(<index>)
 * ```
 *
 * @example Get total fileSize
 *
 * ```JavaScript
 * data.fileSize() // => size in bytes
 * ```
 *
 * @example Marshal and unmarshal
 *
 * ```javascript
 * const marshaled = data.marshal()
 * const unmarshaled = Unixfs.unmarshal(marshaled)
 * ```
 *
 * @example Is this UnixFS entry a directory?
 *
 * ```JavaScript
 * const dir = new Data({ type: 'directory' })
 * dir.isDirectory() // true
 *
 * const file = new Data({ type: 'file' })
 * file.isDirectory() // false
 * ```
 *
 * @example Has an mtime been set?
 *
 * If no modification time has been set, no `mtime` property will be present on the `Data` instance:
 *
 * ```JavaScript
 * const file = new Data({ type: 'file' })
 * file.mtime // undefined
 *
 * Object.prototype.hasOwnProperty.call(file, 'mtime') // false
 *
 * const dir = new Data({ type: 'dir', mtime: new Date() })
 * dir.mtime // { secs: Number, nsecs: Number }
 * ```
 */
export interface Mtime {
    secs: bigint;
    nsecs?: number;
}
export type MtimeLike = Mtime | {
    Seconds: number;
    FractionalNanoseconds?: number;
} | [number, number] | Date;
export interface UnixFSOptions {
    type?: string;
    data?: Uint8Array;
    blockSizes?: bigint[];
    hashType?: bigint;
    fanout?: bigint;
    mtime?: Mtime;
    mode?: number;
}
declare class UnixFS {
    /**
     * Decode from protobuf https://github.com/ipfs/specs/blob/master/UNIXFS.md
     */
    static unmarshal(marshaled: Uint8Array): UnixFS;
    type: string;
    data?: Uint8Array;
    blockSizes: bigint[];
    hashType?: bigint;
    fanout?: bigint;
    mtime?: Mtime;
    private _mode?;
    private _originalMode;
    constructor(options?: UnixFSOptions);
    set mode(mode: number | undefined);
    get mode(): number | undefined;
    isDirectory(): boolean;
    addBlockSize(size: bigint): void;
    removeBlockSize(index: number): void;
    /**
     * Returns `0n` for directories or `data.length + sum(blockSizes)` for everything else
     */
    fileSize(): bigint;
    /**
     * encode to protobuf Uint8Array
     */
    marshal(): Uint8Array;
}
export { UnixFS };
//# sourceMappingURL=index.d.ts.map