var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Encoder } from './encoder.js';
import { PassThrough, Readable } from 'readable-stream';
/**
 * Utility class for readable data stream, intentionally named to disambiguate from ReadableStream, readable-stream, Readable etc.
 */
export class DataStream {
    /**
     * Reads the entire readable stream given into array of bytes.
     */
    static toBytes(readableStream) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const chunks = [];
                readableStream.on('data', chunk => {
                    chunks.push(chunk);
                });
                readableStream.on('end', () => {
                    const uint8Array = DataStream.concatenateArrayOfBytes(chunks);
                    resolve(uint8Array);
                });
                readableStream.on('error', reject);
            });
        });
    }
    /**
     * Reads the entire readable stream and JSON parses it into an object.
     */
    static toObject(readableStream) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentBytes = yield DataStream.toBytes(readableStream);
            const contentObject = Encoder.bytesToObject(contentBytes);
            return contentObject;
        });
    }
    /**
     * Concatenates the array of bytes given into one Uint8Array.
     */
    static concatenateArrayOfBytes(arrayOfBytes) {
        // sum of individual array lengths
        const totalLength = arrayOfBytes.reduce((accumulatedValue, currentValue) => accumulatedValue + currentValue.length, 0);
        const result = new Uint8Array(totalLength);
        let length = 0;
        for (const bytes of arrayOfBytes) {
            result.set(bytes, length);
            length += bytes.length;
        }
        return result;
    }
    /**
     * Creates a readable stream from the bytes given.
     */
    static fromBytes(bytes) {
        // chunk up the bytes to simulate a more real-world like behavior
        const chunkLength = 100000;
        let currentIndex = 0;
        const readableStream = new Readable({
            read(_size) {
                // if this is the last chunk
                if (currentIndex + chunkLength > bytes.length) {
                    this.push(bytes.subarray(currentIndex));
                    this.push(null);
                }
                else {
                    this.push(bytes.subarray(currentIndex, currentIndex + chunkLength));
                    currentIndex = currentIndex + chunkLength;
                }
            }
        });
        return readableStream;
    }
    /**
     * Creates a readable stream from the object given.
     */
    static fromObject(object) {
        const bytes = Encoder.objectToBytes(object);
        return DataStream.fromBytes(bytes);
    }
    /**
     * Duplicates the given data stream into the number of streams specified so that multiple handlers can consume the same data stream.
     */
    static duplicateDataStream(dataStream, count) {
        const streams = [];
        for (let i = 0; i < count; i++) {
            const passThrough = new PassThrough();
            dataStream.pipe(passThrough);
            streams.push(passThrough);
        }
        return streams;
    }
}
//# sourceMappingURL=data-stream.js.map