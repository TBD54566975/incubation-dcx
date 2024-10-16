import { Readable } from 'readable-stream';
/**
 * Utility class for readable data stream, intentionally named to disambiguate from ReadableStream, readable-stream, Readable etc.
 */
export declare class DataStream {
    /**
     * Reads the entire readable stream given into array of bytes.
     */
    static toBytes(readableStream: Readable): Promise<Uint8Array>;
    /**
     * Reads the entire readable stream and JSON parses it into an object.
     */
    static toObject(readableStream: Readable): Promise<object>;
    /**
     * Concatenates the array of bytes given into one Uint8Array.
     */
    private static concatenateArrayOfBytes;
    /**
     * Creates a readable stream from the bytes given.
     */
    static fromBytes(bytes: Uint8Array): Readable;
    /**
     * Creates a readable stream from the object given.
     */
    static fromObject(object: Record<string, any>): Readable;
    /**
     * Duplicates the given data stream into the number of streams specified so that multiple handlers can consume the same data stream.
     */
    static duplicateDataStream(dataStream: Readable, count: number): Readable[];
}
//# sourceMappingURL=data-stream.d.ts.map