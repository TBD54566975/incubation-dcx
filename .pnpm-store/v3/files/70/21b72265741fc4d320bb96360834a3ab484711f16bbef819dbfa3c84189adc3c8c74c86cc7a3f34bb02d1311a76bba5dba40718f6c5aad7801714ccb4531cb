import { Layerr } from 'layerr';

// These values should NEVER change. The values are precisely for
// generating ULIDs.
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford's Base32
const ENCODING_LEN = 32; // from ENCODING.length;
const TIME_MAX = 281474976710655; // from Math.pow(2, 48) - 1;
const TIME_LEN = 10;
const RANDOM_LEN = 16;
const ERROR_INFO = Object.freeze({
    source: "ulid"
});
function decodeTime(id) {
    if (id.length !== TIME_LEN + RANDOM_LEN) {
        throw new Layerr({
            info: {
                code: "DEC_TIME_MALFORMED",
                ...ERROR_INFO
            }
        }, "Malformed ULID");
    }
    const time = id
        .substr(0, TIME_LEN)
        .toUpperCase()
        .split("")
        .reverse()
        .reduce((carry, char, index) => {
        const encodingIndex = ENCODING.indexOf(char);
        if (encodingIndex === -1) {
            throw new Layerr({
                info: {
                    code: "DEC_TIME_CHAR",
                    ...ERROR_INFO
                }
            }, `Time decode error: Invalid character: ${char}`);
        }
        return (carry += encodingIndex * Math.pow(ENCODING_LEN, index));
    }, 0);
    if (time > TIME_MAX) {
        throw new Layerr({
            info: {
                code: "DEC_TIME_CHAR",
                ...ERROR_INFO
            }
        }, `Malformed ULID: timestamp too large: ${time}`);
    }
    return time;
}
function detectPRNG(root) {
    const rootLookup = root || detectRoot();
    const globalCrypto = (rootLookup && (rootLookup.crypto || rootLookup.msCrypto)) ||
        (null);
    if (typeof globalCrypto?.getRandomValues === "function") {
        return () => {
            const buffer = new Uint8Array(1);
            globalCrypto.getRandomValues(buffer);
            return buffer[0] / 0xff;
        };
    }
    else if (typeof globalCrypto?.randomBytes === "function") {
        return () => globalCrypto.randomBytes(1).readUInt8() / 0xff;
    }
    else ;
    throw new Layerr({
        info: {
            code: "PRNG_DETECT",
            ...ERROR_INFO
        }
    }, "Failed to find a reliable PRNG");
}
function detectRoot() {
    if (inWebWorker())
        return self;
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    return null;
}
function encodeRandom(len, prng) {
    let str = "";
    for (; len > 0; len--) {
        str = randomChar(prng) + str;
    }
    return str;
}
function encodeTime(now, len) {
    if (isNaN(now)) {
        throw new Layerr({
            info: {
                code: "ENC_TIME_NAN",
                ...ERROR_INFO
            }
        }, `Time must be a number: ${now}`);
    }
    else if (now > TIME_MAX) {
        throw new Layerr({
            info: {
                code: "ENC_TIME_SIZE_EXCEED",
                ...ERROR_INFO
            }
        }, `Cannot encode a time larger than ${TIME_MAX}: ${now}`);
    }
    else if (now < 0) {
        throw new Layerr({
            info: {
                code: "ENC_TIME_NEG",
                ...ERROR_INFO
            }
        }, `Time must be positive: ${now}`);
    }
    else if (Number.isInteger(now) === false) {
        throw new Layerr({
            info: {
                code: "ENC_TIME_TYPE",
                ...ERROR_INFO
            }
        }, `Time must be an integer: ${now}`);
    }
    let mod, str = "";
    for (let currentLen = len; currentLen > 0; currentLen--) {
        mod = now % ENCODING_LEN;
        str = ENCODING.charAt(mod) + str;
        now = (now - mod) / ENCODING_LEN;
    }
    return str;
}
/**
 * Fix a ULID's Base32 encoding -
 * i and l (case-insensitive) will be treated as 1 and o (case-insensitive) will be treated as 0.
 * hyphens are ignored during decoding.
 * @param id
 * @returns The cleaned up ULID
 */
function fixULIDBase32(id) {
    return id.replace(/i/gi, "1").replace(/l/gi, "1").replace(/o/gi, "0").replace(/-/g, "");
}
function incrementBase32(str) {
    let done = undefined, index = str.length, char, charIndex, output = str;
    const maxCharIndex = ENCODING_LEN - 1;
    while (!done && index-- >= 0) {
        char = output[index];
        charIndex = ENCODING.indexOf(char);
        if (charIndex === -1) {
            throw new Layerr({
                info: {
                    code: "B32_INC_ENC",
                    ...ERROR_INFO
                }
            }, "Incorrectly encoded string");
        }
        if (charIndex === maxCharIndex) {
            output = replaceCharAt(output, index, ENCODING[0]);
            continue;
        }
        done = replaceCharAt(output, index, ENCODING[charIndex + 1]);
    }
    if (typeof done === "string") {
        return done;
    }
    throw new Layerr({
        info: {
            code: "B32_INC_INVALID",
            ...ERROR_INFO
        }
    }, "Failed incrementing string");
}
function inWebWorker() {
    // @ts-ignore
    return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
}
function isValid(id) {
    return (typeof id === "string" &&
        id.length === TIME_LEN + RANDOM_LEN &&
        id
            .toUpperCase()
            .split("")
            .every(char => ENCODING.indexOf(char) !== -1));
}
function monotonicFactory(prng) {
    const currentPRNG = prng || detectPRNG();
    let lastTime = 0, lastRandom;
    return function _ulid(seedTime) {
        const seed = isNaN(seedTime) ? Date.now() : seedTime;
        if (seed <= lastTime) {
            const incrementedRandom = (lastRandom = incrementBase32(lastRandom));
            return encodeTime(lastTime, TIME_LEN) + incrementedRandom;
        }
        lastTime = seed;
        const newRandom = (lastRandom = encodeRandom(RANDOM_LEN, currentPRNG));
        return encodeTime(seed, TIME_LEN) + newRandom;
    };
}
function randomChar(prng) {
    let rand = Math.floor(prng() * ENCODING_LEN);
    if (rand === ENCODING_LEN) {
        rand = ENCODING_LEN - 1;
    }
    return ENCODING.charAt(rand);
}
function replaceCharAt(str, index, char) {
    if (index > str.length - 1) {
        return str;
    }
    return str.substr(0, index) + char + str.substr(index + 1);
}
function ulid(seedTime, prng) {
    const currentPRNG = prng || detectPRNG();
    const seed = isNaN(seedTime) ? Date.now() : seedTime;
    return encodeTime(seed, TIME_LEN) + encodeRandom(RANDOM_LEN, currentPRNG);
}

export { decodeTime, detectPRNG, encodeTime, fixULIDBase32, isValid, monotonicFactory, ulid };
