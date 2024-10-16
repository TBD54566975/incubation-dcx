import type { Readable } from 'readable-stream';
import { CID } from 'multiformats/cid';
/**
 * Utility class for creating CIDs. Exported for the convenience of developers.
 */
export declare class Cid {
    /**
     * Computes a V1 CID for the provided payload
     * @param codecCode - the codec to use. Defaults to cbor
     * @param multihashCode - the multihasher to use. Defaults to sha256
     * @returns payload CID
     * @throws {Error} codec is not supported
     * @throws {Error} encoding fails
     * @throws {Error} if hasher is not supported
     */
    static computeCid(payload: any, codecCode?: number, multihashCode?: number): Promise<string>;
    /**
     * Parses the given CID string into a {CID}.
     */
    static parseCid(str: string): CID;
    /**
     * @returns V1 CID of the DAG comprised by chunking data into unixfs DAG-PB encoded blocks
     */
    static computeDagPbCidFromBytes(content: Uint8Array): Promise<string>;
    /**
     * @returns V1 CID of the DAG comprised by chunking data into unixfs DAG-PB encoded blocks
     */
    static computeDagPbCidFromStream(dataStream: Readable): Promise<string>;
}
//# sourceMappingURL=cid.d.ts.map