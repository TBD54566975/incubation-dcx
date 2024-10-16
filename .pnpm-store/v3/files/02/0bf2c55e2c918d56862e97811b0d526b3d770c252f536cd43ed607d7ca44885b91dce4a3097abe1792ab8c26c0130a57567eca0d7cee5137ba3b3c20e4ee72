import { PRNG, ULID, ULIDFactory } from "./types.js";
export declare function decodeTime(id: string): number;
export declare function detectPRNG(root?: any): PRNG;
export declare function encodeRandom(len: number, prng: PRNG): string;
export declare function encodeTime(now: number, len: number): string;
/**
 * Fix a ULID's Base32 encoding -
 * i and l (case-insensitive) will be treated as 1 and o (case-insensitive) will be treated as 0.
 * hyphens are ignored during decoding.
 * @param id
 * @returns The cleaned up ULID
 */
export declare function fixULIDBase32(id: string): string;
export declare function incrementBase32(str: string): string;
export declare function isValid(id: string): boolean;
export declare function monotonicFactory(prng?: PRNG): ULIDFactory;
export declare function randomChar(prng: PRNG): string;
export declare function replaceCharAt(str: string, index: number, char: string): string;
export declare function ulid(seedTime?: number, prng?: PRNG): ULID;
