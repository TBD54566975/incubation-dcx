import { base64, bytes as baseBytes, hex as baseHex, str as baseStr, utf8 } from '@scure/base';
/**
 * TODO:
 * - Holes, simplify pointers. Hole is some sized element which is skipped at encoding,
 *   but later other elements can write to it by path
 * - Composite / tuple keys for dict
 * - Web UI for easier debugging. We can wrap every coder to something that would write
 *   start & end positions to; and we can colorize specific bytes used by specific coder
 */
// Useful default values
export const EMPTY = /* @__PURE__ */ new Uint8Array(); // Empty bytes array
export const NULL = /* @__PURE__ */ new Uint8Array([0]); // NULL
// Non constant-time equality check.
export function equalBytes(a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++)
        if (a[i] !== b[i])
            return false;
    return true;
}
export function isBytes(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
/**
 * Copies several Uint8Arrays into one.
 */
export function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        if (!isBytes(a))
            throw new Error('Uint8Array expected');
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
// Utils
// Small bitset structure to store position of ranges that have been read.
// Possible can be even more efficient by using some interval trees, but would be more complex
// Needs O(N/8) memory for parsing.
// Purpose: if there are pointers in parsed structure,
// they can cause read of two distinct ranges:
// [0-32, 64-128], which means 'pos' is not enough to handle them
const _bitset = {
    BITS: 32,
    FULL_MASK: -1 >>> 0, // 1<<32 will overflow
    len: (len) => Math.ceil(len / 32),
    create: (len) => new Uint32Array(_bitset.len(len)),
    clean: (bs) => bs.fill(0),
    debug: (bs) => Array.from(bs).map((i) => (i >>> 0).toString(2).padStart(32, '0')),
    checkLen: (bs, len) => {
        if (_bitset.len(len) === bs.length)
            return;
        throw new Error(`bitSet: wrong length=${bs.length}. Expected: ${_bitset.len(len)}`);
    },
    chunkLen: (bsLen, pos, len) => {
        if (pos < 0)
            throw new Error(`bitset: wrong pos=${pos}`);
        if (pos + len > bsLen)
            throw new Error(`bitSet: wrong range=${pos}/${len} of ${bsLen}`);
    },
    set: (bs, chunk, value, allowRewrite = true) => {
        if (!allowRewrite && (bs[chunk] & value) !== 0)
            return false;
        bs[chunk] |= value;
        return true;
    },
    pos: (pos, i) => ({
        chunk: Math.floor((pos + i) / 32),
        mask: 1 << (32 - ((pos + i) % 32) - 1),
    }),
    indices: (bs, len, invert = false) => {
        _bitset.checkLen(bs, len);
        const { FULL_MASK, BITS } = _bitset;
        const left = BITS - (len % BITS);
        const lastMask = left ? (FULL_MASK >>> left) << left : FULL_MASK;
        const res = [];
        for (let i = 0; i < bs.length; i++) {
            let c = bs[i];
            if (invert)
                c = ~c; // allows to gen unset elements
            // apply mask to last element, so we won't iterate non-existent items
            if (i === bs.length - 1)
                c &= lastMask;
            if (c === 0)
                continue; // fast-path
            for (let j = 0; j < BITS; j++) {
                const m = 1 << (BITS - j - 1);
                if (c & m)
                    res.push(i * BITS + j);
            }
        }
        return res;
    },
    range: (arr) => {
        const res = [];
        let cur;
        for (const i of arr) {
            if (cur === undefined || i !== cur.pos + cur.length)
                res.push((cur = { pos: i, length: 1 }));
            else
                cur.length += 1;
        }
        return res;
    },
    rangeDebug: (bs, len, invert = false) => `[${_bitset
        .range(_bitset.indices(bs, len, invert))
        .map((i) => `(${i.pos}/${i.length})`)
        .join(', ')}]`,
    setRange: (bs, bsLen, pos, len, allowRewrite = true) => {
        _bitset.chunkLen(bsLen, pos, len);
        const { FULL_MASK, BITS } = _bitset;
        // Try to set range with maximum efficiency:
        // - first chunk is always    '0000[1111]' (only right ones)
        // - middle chunks are set to '[1111 1111]' (all ones)
        // - last chunk is always     '[1111]0000' (only left ones)
        // - max operations:          (N/32) + 2 (first and last)
        const first = pos % BITS ? Math.floor(pos / BITS) : undefined;
        const lastPos = pos + len;
        const last = lastPos % BITS ? Math.floor(lastPos / BITS) : undefined;
        // special case, whole range inside single chunk
        if (first !== undefined && first === last)
            return _bitset.set(bs, first, (FULL_MASK >>> (BITS - len)) << (BITS - len - pos), allowRewrite);
        if (first !== undefined) {
            if (!_bitset.set(bs, first, FULL_MASK >>> pos % BITS, allowRewrite))
                return false; // first chunk
        }
        // middle chunks
        const start = first !== undefined ? first + 1 : pos / BITS;
        const end = last !== undefined ? last : lastPos / BITS;
        for (let i = start; i < end; i++)
            if (!_bitset.set(bs, i, FULL_MASK, allowRewrite))
                return false;
        if (last !== undefined && first !== last)
            if (!_bitset.set(bs, last, FULL_MASK << (BITS - (lastPos % BITS)), allowRewrite))
                return false; // last chunk
        return true;
    },
};
export class Reader {
    constructor(data, opts = {}, path = [], fieldPath = [], parent = undefined, parentOffset = 0) {
        this.data = data;
        this.opts = opts;
        this.path = path;
        this.fieldPath = fieldPath;
        this.parent = parent;
        this.parentOffset = parentOffset;
        this.pos = 0;
        this.bitBuf = 0;
        this.bitPos = 0;
    }
    enablePtr() {
        if (this.parent)
            return this.parent.enablePtr();
        if (this.bs)
            return;
        this.bs = _bitset.create(this.data.length);
        _bitset.setRange(this.bs, this.data.length, 0, this.pos, this.opts.allowMultipleReads);
    }
    markBytesBS(pos, len) {
        if (this.parent)
            return this.parent.markBytesBS(this.parentOffset + pos, len);
        if (!len)
            return true;
        if (!this.bs)
            return true;
        return _bitset.setRange(this.bs, this.data.length, pos, len, false);
    }
    markBytes(len) {
        const pos = this.pos;
        this.pos += len;
        const res = this.markBytesBS(pos, len);
        if (!this.opts.allowMultipleReads && !res)
            throw this.err(`multiple read pos=${this.pos} len=${len}`);
        return res;
    }
    err(msg) {
        return new Error(`Reader(${this.fieldPath.join('/')}): ${msg}`);
    }
    // read bytes by absolute offset
    absBytes(n) {
        if (n > this.data.length)
            throw new Error('absBytes: Unexpected end of buffer');
        return this.data.subarray(n);
    }
    // return reader using offset
    offsetReader(n) {
        return new Reader(this.absBytes(n), this.opts, this.path, this.fieldPath, this, n);
    }
    bytes(n, peek = false) {
        if (this.bitPos)
            throw this.err('readBytes: bitPos not empty');
        if (!Number.isFinite(n))
            throw this.err(`readBytes: wrong length=${n}`);
        if (this.pos + n > this.data.length)
            throw this.err('readBytes: Unexpected end of buffer');
        const slice = this.data.subarray(this.pos, this.pos + n);
        if (!peek)
            this.markBytes(n);
        return slice;
    }
    byte(peek = false) {
        if (this.bitPos)
            throw this.err('readByte: bitPos not empty');
        if (this.pos + 1 > this.data.length)
            throw this.err('readBytes: Unexpected end of buffer');
        const data = this.data[this.pos];
        if (!peek)
            this.markBytes(1);
        return data;
    }
    get leftBytes() {
        return this.data.length - this.pos;
    }
    isEnd() {
        return this.pos >= this.data.length && !this.bitPos;
    }
    length(len) {
        let byteLen;
        if (isCoder(len))
            byteLen = Number(len.decodeStream(this));
        else if (typeof len === 'number')
            byteLen = len;
        else if (typeof len === 'string')
            byteLen = getPath(this.path, len.split('/'));
        if (typeof byteLen === 'bigint')
            byteLen = Number(byteLen);
        if (typeof byteLen !== 'number')
            throw this.err(`Wrong length: ${byteLen}`);
        return byteLen;
    }
    // bits are read in BE mode (left to right): (0b1000_0000).readBits(1) == 1
    bits(bits) {
        if (bits > 32)
            throw this.err('BitReader: cannot read more than 32 bits in single call');
        let out = 0;
        while (bits) {
            if (!this.bitPos) {
                this.bitBuf = this.byte();
                this.bitPos = 8;
            }
            const take = Math.min(bits, this.bitPos);
            this.bitPos -= take;
            out = (out << take) | ((this.bitBuf >> this.bitPos) & (2 ** take - 1));
            this.bitBuf &= 2 ** this.bitPos - 1;
            bits -= take;
        }
        // Fix signed integers
        return out >>> 0;
    }
    find(needle, pos = this.pos) {
        if (!isBytes(needle))
            throw this.err(`find: needle is not bytes! ${needle}`);
        if (this.bitPos)
            throw this.err('findByte: bitPos not empty');
        if (!needle.length)
            throw this.err(`find: needle is empty`);
        // indexOf should be faster than full equalBytes check
        for (let idx = pos; (idx = this.data.indexOf(needle[0], idx)) !== -1; idx++) {
            if (idx === -1)
                return;
            const leftBytes = this.data.length - idx;
            if (leftBytes < needle.length)
                return;
            if (equalBytes(needle, this.data.subarray(idx, idx + needle.length)))
                return idx;
        }
        return;
    }
    finish() {
        if (this.opts.allowUnreadBytes)
            return;
        if (this.bitPos) {
            throw this.err(`${this.bitPos} bits left after unpack: ${baseHex.encode(this.data.slice(this.pos))}`);
        }
        if (this.bs && !this.parent) {
            const notRead = _bitset.indices(this.bs, this.data.length, true);
            if (notRead.length) {
                const formatted = _bitset
                    .range(notRead)
                    .map(({ pos, length }) => `(${pos}/${length})[${baseHex.encode(this.data.subarray(pos, pos + length))}]`)
                    .join(', ');
                throw this.err(`unread byte ranges: ${formatted} (total=${this.data.length})`);
            }
            else
                return; // all bytes read, everything is ok
        }
        // Default: no pointers enabled
        if (!this.isEnd()) {
            throw this.err(`${this.leftBytes} bytes ${this.bitPos} bits left after unpack: ${baseHex.encode(this.data.slice(this.pos))}`);
        }
    }
    fieldPathPush(s) {
        this.fieldPath.push(s);
    }
    fieldPathPop() {
        this.fieldPath.pop();
    }
}
export class Writer {
    constructor(path = [], fieldPath = []) {
        this.path = path;
        this.fieldPath = fieldPath;
        this.buffers = [];
        this.pos = 0;
        this.ptrs = [];
        this.bitBuf = 0;
        this.bitPos = 0;
    }
    err(msg) {
        return new Error(`Writer(${this.fieldPath.join('/')}): ${msg}`);
    }
    bytes(b) {
        if (this.bitPos)
            throw this.err('writeBytes: ends with non-empty bit buffer');
        this.buffers.push(b);
        this.pos += b.length;
    }
    byte(b) {
        if (this.bitPos)
            throw this.err('writeByte: ends with non-empty bit buffer');
        this.buffers.push(new Uint8Array([b]));
        this.pos++;
    }
    get buffer() {
        if (this.bitPos)
            throw this.err('buffer: ends with non-empty bit buffer');
        let buf = concatBytes(...this.buffers);
        for (let ptr of this.ptrs) {
            const pos = buf.length;
            buf = concatBytes(buf, ptr.buffer);
            const val = ptr.ptr.encode(pos);
            for (let i = 0; i < val.length; i++)
                buf[ptr.pos + i] = val[i];
        }
        return buf;
    }
    length(len, value) {
        if (len === null)
            return;
        if (isCoder(len))
            return len.encodeStream(this, value);
        let byteLen;
        if (typeof len === 'number')
            byteLen = len;
        else if (typeof len === 'string')
            byteLen = getPath(this.path, len.split('/'));
        if (typeof byteLen === 'bigint')
            byteLen = Number(byteLen);
        if (byteLen === undefined || byteLen !== value)
            throw this.err(`Wrong length: ${byteLen} len=${len} exp=${value}`);
    }
    bits(value, bits) {
        if (bits > 32)
            throw this.err('writeBits: cannot write more than 32 bits in single call');
        if (value >= 2 ** bits)
            throw this.err(`writeBits: value (${value}) >= 2**bits (${bits})`);
        while (bits) {
            const take = Math.min(bits, 8 - this.bitPos);
            this.bitBuf = (this.bitBuf << take) | (value >> (bits - take));
            this.bitPos += take;
            bits -= take;
            value &= 2 ** bits - 1;
            if (this.bitPos === 8) {
                this.bitPos = 0;
                this.buffers.push(new Uint8Array([this.bitBuf]));
                this.pos++;
            }
        }
    }
    fieldPathPush(s) {
        this.fieldPath.push(s);
    }
    fieldPathPop() {
        this.fieldPath.pop();
    }
}
// Immutable LE<->BE
const swap = (b) => Uint8Array.from(b).reverse();
export function checkBounds(p, value, bits, signed) {
    if (signed) {
        // [-(2**(32-1)), 2**(32-1)-1]
        const signBit = 2n ** (bits - 1n);
        if (value < -signBit || value >= signBit)
            throw p.err('sInt: value out of bounds');
    }
    else {
        // [0, 2**32-1]
        if (0n > value || value >= 2n ** bits)
            throw p.err('uInt: value out of bounds');
    }
}
// Wrap stream encoder into generic encoder
export function wrap(inner) {
    return {
        ...inner,
        encode: (value) => {
            const w = new Writer();
            inner.encodeStream(w, value);
            return w.buffer;
        },
        decode: (data, opts = {}) => {
            const r = new Reader(data, opts);
            const res = inner.decodeStream(r);
            r.finish();
            return res;
        },
    };
}
function getPath(objPath, path) {
    objPath = Array.from(objPath);
    let i = 0;
    for (; i < path.length; i++) {
        if (path[i] === '..')
            objPath.pop();
        else
            break;
    }
    let cur = objPath.pop();
    for (; i < path.length; i++) {
        if (!cur || cur[path[i]] === undefined)
            return undefined;
        cur = cur[path[i]];
    }
    return cur;
}
export function isCoder(elm) {
    return (elm !== null &&
        typeof elm === 'object' &&
        typeof elm.encode === 'function' &&
        typeof elm.encodeStream === 'function' &&
        typeof elm.decode === 'function' &&
        typeof elm.decodeStream === 'function');
}
// Coders (like in @scure/base) for common operations
// TODO:
// - move to base? very generic converters, not releated to base and packed
// - encode/decode -> from/to? coder->convert?
function dict() {
    return {
        encode: (from) => {
            const to = {};
            for (const [name, value] of from) {
                if (to[name] !== undefined)
                    throw new Error(`coders.dict: same key(${name}) appears twice in struct`);
                to[name] = value;
            }
            return to;
        },
        decode: (to) => Object.entries(to),
    };
}
// Safely converts bigint to number
// Sometimes pointers / tags use u64 or other big numbers which cannot be represented by number,
// but we still can use them since real value will be smaller than u32
const number = {
    encode: (from) => {
        if (from > BigInt(Number.MAX_SAFE_INTEGER))
            throw new Error(`coders.number: element bigger than MAX_SAFE_INTEGER=${from}`);
        return Number(from);
    },
    decode: (to) => {
        if (!Number.isSafeInteger(to))
            throw new Error('coders.number: element is not safe integer');
        return BigInt(to);
    },
};
function tsEnum(e) {
    return {
        encode: (from) => e[from],
        decode: (to) => e[to],
    };
}
function decimal(precision) {
    const decimalMask = 10n ** BigInt(precision);
    return {
        encode: (from) => {
            let s = (from < 0n ? -from : from).toString(10);
            let sep = s.length - precision;
            if (sep < 0) {
                s = s.padStart(s.length - sep, '0');
                sep = 0;
            }
            let i = s.length - 1;
            for (; i >= sep && s[i] === '0'; i--)
                ;
            let [int, frac] = [s.slice(0, sep), s.slice(sep, i + 1)];
            if (!int)
                int = '0';
            if (from < 0n)
                int = '-' + int;
            if (!frac)
                return int;
            return `${int}.${frac}`;
        },
        decode: (to) => {
            let neg = false;
            if (to.startsWith('-')) {
                neg = true;
                to = to.slice(1);
            }
            let sep = to.indexOf('.');
            sep = sep === -1 ? to.length : sep;
            const [intS, fracS] = [to.slice(0, sep), to.slice(sep + 1)];
            const int = BigInt(intS) * decimalMask;
            const fracLen = Math.min(fracS.length, precision);
            const frac = BigInt(fracS.slice(0, fracLen)) * 10n ** BigInt(precision - fracLen);
            const value = int + frac;
            return neg ? -value : value;
        },
    };
}
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
function match(lst) {
    return {
        encode: (from) => {
            for (const c of lst) {
                const elm = c.encode(from);
                if (elm !== undefined)
                    return elm;
            }
            throw new Error(`match/encode: cannot find match in ${from}`);
        },
        decode: (to) => {
            for (const c of lst) {
                const elm = c.decode(to);
                if (elm !== undefined)
                    return elm;
            }
            throw new Error(`match/decode: cannot find match in ${to}`);
        },
    };
}
// Reverse direction of coder
const reverse = (coder) => ({
    encode: coder.decode,
    decode: coder.encode,
});
export const coders = { dict, number, tsEnum, decimal, match, reverse };
// PackedCoders
export const bits = (len) => wrap({
    encodeStream: (w, value) => w.bits(value, len),
    decodeStream: (r) => r.bits(len),
});
// unsized bigint should be wrapped in container (bytes/etc)
// 0n = new Uint8Array([])
// 1n = new Uint8Array([1n])
// Please open issue, if you need different behavior for zero.
export const bigint = (size, le = false, signed = false, sized = true) => wrap({
    size: sized ? size : undefined,
    encodeStream: (w, value) => {
        if (typeof value !== 'bigint')
            throw w.err(`bigint: invalid value: ${value}`);
        let _value = BigInt(value);
        const bLen = BigInt(size);
        checkBounds(w, _value, 8n * bLen, !!signed);
        const signBit = 2n ** (8n * bLen - 1n);
        if (signed && _value < 0)
            _value = _value | signBit;
        let b = [];
        for (let i = 0; i < size; i++) {
            b.push(Number(_value & 255n));
            _value >>= 8n;
        }
        let res = new Uint8Array(b).reverse();
        if (!sized) {
            let pos = 0;
            for (pos = 0; pos < res.length; pos++)
                if (res[pos] !== 0)
                    break;
            res = res.subarray(pos); // remove leading zeros
        }
        w.bytes(le ? res.reverse() : res);
    },
    decodeStream: (r) => {
        const bLen = BigInt(size);
        // TODO: for le we can read until first zero?
        const value = r.bytes(sized ? size : Math.min(size, r.leftBytes));
        const b = le ? value : swap(value);
        const signBit = 2n ** (8n * bLen - 1n);
        let res = 0n;
        for (let i = 0; i < b.length; i++)
            res |= BigInt(b[i]) << (8n * BigInt(i));
        if (signed && res & signBit)
            res = (res ^ signBit) - signBit;
        checkBounds(r, res, 8n * bLen, !!signed);
        return res;
    },
});
export const U256LE = /* @__PURE__ */ bigint(32, true);
export const U256BE = /* @__PURE__ */ bigint(32, false);
export const I256LE = /* @__PURE__ */ bigint(32, true, true);
export const I256BE = /* @__PURE__ */ bigint(32, false, true);
export const U128LE = /* @__PURE__ */ bigint(16, true);
export const U128BE = /* @__PURE__ */ bigint(16, false);
export const I128LE = /* @__PURE__ */ bigint(16, true, true);
export const I128BE = /* @__PURE__ */ bigint(16, false, true);
export const U64LE = /* @__PURE__ */ bigint(8, true);
export const U64BE = /* @__PURE__ */ bigint(8, false);
export const I64LE = /* @__PURE__ */ bigint(8, true, true);
export const I64BE = /* @__PURE__ */ bigint(8, false, true);
// TODO: we can speed-up if integers are used. Unclear if it's worth to increase code size.
// Also, numbers can't use >= 32 bits.
export const int = (size, le = false, signed = false, sized = true) => {
    if (size > 6)
        throw new Error('int supports size up to 6 bytes (48 bits), for other use bigint');
    return apply(bigint(size, le, signed, sized), coders.number);
};
export const U32LE = /* @__PURE__ */ int(4, true);
export const U32BE = /* @__PURE__ */ int(4, false);
export const I32LE = /* @__PURE__ */ int(4, true, true);
export const I32BE = /* @__PURE__ */ int(4, false, true);
export const U16LE = /* @__PURE__ */ int(2, true);
export const U16BE = /* @__PURE__ */ int(2, false);
export const I16LE = /* @__PURE__ */ int(2, true, true);
export const I16BE = /* @__PURE__ */ int(2, false, true);
export const U8 = /* @__PURE__ */ int(1, false);
export const I8 = /* @__PURE__ */ int(1, false, true);
export const bool = /* @__PURE__ */ wrap({
    size: 1,
    encodeStream: (w, value) => w.byte(value ? 1 : 0),
    decodeStream: (r) => {
        const value = r.byte();
        if (value !== 0 && value !== 1)
            throw r.err(`bool: invalid value ${value}`);
        return value === 1;
    },
});
// Can be done w array, but specific implementation should be
// faster: no need to create js array of numbers.
export const bytes = (len, le = false) => wrap({
    size: typeof len === 'number' ? len : undefined,
    encodeStream: (w, value) => {
        if (!isBytes(value))
            throw w.err(`bytes: invalid value ${value}`);
        if (!isBytes(len))
            w.length(len, value.length);
        w.bytes(le ? swap(value) : value);
        if (isBytes(len))
            w.bytes(len);
    },
    decodeStream: (r) => {
        let bytes;
        if (isBytes(len)) {
            const tPos = r.find(len);
            if (!tPos)
                throw r.err(`bytes: cannot find terminator`);
            bytes = r.bytes(tPos - r.pos);
            r.bytes(len.length);
        }
        else
            bytes = r.bytes(len === null ? r.leftBytes : r.length(len));
        return le ? swap(bytes) : bytes;
    },
});
export const string = (len, le = false) => {
    const inner = bytes(len, le);
    return wrap({
        size: inner.size,
        encodeStream: (w, value) => inner.encodeStream(w, utf8.decode(value)),
        decodeStream: (r) => utf8.encode(inner.decodeStream(r)),
    });
};
export const cstring = /* @__PURE__ */ string(NULL);
export const hex = (len, le = false, withZero = false) => {
    const inner = bytes(len, le);
    return wrap({
        size: inner.size,
        encodeStream: (w, value) => {
            if (withZero && !value.startsWith('0x'))
                throw new Error('hex(withZero=true).encode input should start with 0x');
            const bytes = baseHex.decode(withZero ? value.slice(2) : value);
            return inner.encodeStream(w, bytes);
        },
        decodeStream: (r) => (withZero ? '0x' : '') + baseHex.encode(inner.decodeStream(r)),
    });
};
// Interoperability with base
export function apply(inner, b) {
    if (!isCoder(inner))
        throw new Error(`apply: invalid inner value ${inner}`);
    return wrap({
        size: inner.size,
        encodeStream: (w, value) => {
            let innerValue;
            try {
                innerValue = b.decode(value);
            }
            catch (e) {
                throw w.err('' + e);
            }
            return inner.encodeStream(w, innerValue);
        },
        decodeStream: (r) => {
            const innerValue = inner.decodeStream(r);
            try {
                return b.encode(innerValue);
            }
            catch (e) {
                throw r.err('' + e);
            }
        },
    });
}
// Additional check of values both on encode and decode steps.
// E.g. to force uint32 to be 1..10
export function validate(inner, fn) {
    if (!isCoder(inner))
        throw new Error(`validate: invalid inner value ${inner}`);
    return wrap({
        size: inner.size,
        encodeStream: (w, value) => inner.encodeStream(w, fn(value)),
        decodeStream: (r) => fn(inner.decodeStream(r)),
    });
}
export function lazy(fn) {
    return wrap({
        encodeStream: (w, value) => fn().encodeStream(w, value),
        decodeStream: (r) => fn().decodeStream(r),
    });
}
export const bytesFormatted = (len, fmt, le = false) => {
    const inner = bytes(len, le);
    return wrap({
        size: inner.size,
        encodeStream: (w, value) => inner.encodeStream(w, baseBytes(fmt, value)),
        decodeStream: (r) => baseStr(fmt, inner.decodeStream(r)),
    });
};
// Returns true if some marker exists, otherwise false. Xor argument flips behaviour
export const flag = (flagValue, xor = false) => wrap({
    size: flagValue.length,
    encodeStream: (w, value) => {
        if (!!value !== xor)
            w.bytes(flagValue);
    },
    decodeStream: (r) => {
        let hasFlag = r.leftBytes >= flagValue.length;
        if (hasFlag) {
            hasFlag = equalBytes(r.bytes(flagValue.length, true), flagValue);
            // Found flag, advance cursor position
            if (hasFlag)
                r.bytes(flagValue.length);
        }
        // hasFlag ^ xor
        return hasFlag !== xor;
    },
});
// Decode/encode only if flag found
export function flagged(path, inner, def) {
    if (!isCoder(inner))
        throw new Error(`flagged: invalid inner value ${inner}`);
    return wrap({
        encodeStream: (w, value) => {
            if (typeof path === 'string') {
                if (getPath(w.path, path.split('/')))
                    inner.encodeStream(w, value);
                else if (def)
                    inner.encodeStream(w, def);
            }
            else {
                path.encodeStream(w, !!value);
                if (!!value)
                    inner.encodeStream(w, value);
                else if (def)
                    inner.encodeStream(w, def);
            }
        },
        decodeStream: (r) => {
            let hasFlag = false;
            if (typeof path === 'string')
                hasFlag = getPath(r.path, path.split('/'));
            else
                hasFlag = path.decodeStream(r);
            // If there is a flag -- decode and return value
            if (hasFlag)
                return inner.decodeStream(r);
            else if (def)
                inner.decodeStream(r);
            return;
        },
    });
}
export function optional(flag, inner, def) {
    if (!isCoder(flag) || !isCoder(inner))
        throw new Error(`optional: invalid flag or inner value flag=${flag} inner=${inner}`);
    return wrap({
        size: def !== undefined && flag.size && inner.size ? flag.size + inner.size : undefined,
        encodeStream: (w, value) => {
            flag.encodeStream(w, !!value);
            if (value)
                inner.encodeStream(w, value);
            else if (def !== undefined)
                inner.encodeStream(w, def);
        },
        decodeStream: (r) => {
            if (flag.decodeStream(r))
                return inner.decodeStream(r);
            else if (def !== undefined)
                inner.decodeStream(r);
            return;
        },
    });
}
export function magic(inner, constant, check = true) {
    if (!isCoder(inner))
        throw new Error(`flagged: invalid inner value ${inner}`);
    return wrap({
        size: inner.size,
        encodeStream: (w, _value) => inner.encodeStream(w, constant),
        decodeStream: (r) => {
            const value = inner.decodeStream(r);
            if ((check && typeof value !== 'object' && value !== constant) ||
                (isBytes(constant) && !equalBytes(constant, value))) {
                throw r.err(`magic: invalid value: ${value} !== ${constant}`);
            }
            return;
        },
    });
}
export const magicBytes = (constant) => {
    const c = typeof constant === 'string' ? utf8.decode(constant) : constant;
    return magic(bytes(c.length), c);
};
export function constant(c) {
    return wrap({
        encodeStream: (_w, value) => {
            if (value !== c)
                throw new Error(`constant: invalid value ${value} (exp: ${c})`);
        },
        decodeStream: (_r) => c,
    });
}
function sizeof(fields) {
    let size = 0;
    for (let f of fields) {
        if (f.size === undefined)
            return;
        if (!Number.isSafeInteger(f.size))
            throw new Error(`sizeof: wrong element size=${size}`);
        size += f.size;
    }
    return size;
}
export function struct(fields) {
    if (Array.isArray(fields))
        throw new Error('Packed.Struct: got array instead of object');
    return wrap({
        size: sizeof(Object.values(fields)),
        encodeStream: (w, value) => {
            if (typeof value !== 'object' || value === null)
                throw w.err(`struct: invalid value ${value}`);
            w.path.push(value);
            for (let name in fields) {
                w.fieldPathPush(name);
                let field = fields[name];
                field.encodeStream(w, value[name]);
                w.fieldPathPop();
            }
            w.path.pop();
        },
        decodeStream: (r) => {
            let res = {};
            r.path.push(res);
            for (let name in fields) {
                r.fieldPathPush(name);
                res[name] = fields[name].decodeStream(r);
                r.fieldPathPop();
            }
            r.path.pop();
            return res;
        },
    });
}
export function tuple(fields) {
    if (!Array.isArray(fields))
        throw new Error(`Packed.Tuple: got ${typeof fields} instead of array`);
    return wrap({
        size: sizeof(fields),
        encodeStream: (w, value) => {
            if (!Array.isArray(value))
                throw w.err(`tuple: invalid value ${value}`);
            w.path.push(value);
            for (let i = 0; i < fields.length; i++) {
                w.fieldPathPush('' + i);
                fields[i].encodeStream(w, value[i]);
                w.fieldPathPop();
            }
            w.path.pop();
        },
        decodeStream: (r) => {
            let res = [];
            r.path.push(res);
            for (let i = 0; i < fields.length; i++) {
                r.fieldPathPush('' + i);
                res.push(fields[i].decodeStream(r));
                r.fieldPathPop();
            }
            r.path.pop();
            return res;
        },
    });
}
export function prefix(len, inner) {
    if (!isCoder(inner))
        throw new Error(`prefix: invalid inner value ${inner}`);
    if (isBytes(len))
        throw new Error(`prefix: len cannot be Uint8Array`);
    const b = bytes(len);
    return wrap({
        size: typeof len === 'number' ? len : undefined,
        encodeStream: (w, value) => {
            const wChild = new Writer(w.path, w.fieldPath);
            inner.encodeStream(wChild, value);
            b.encodeStream(w, wChild.buffer);
        },
        decodeStream: (r) => {
            const data = b.decodeStream(r);
            const ir = new Reader(data, r.opts, r.path, r.fieldPath);
            const res = inner.decodeStream(ir);
            ir.finish();
            return res;
        },
    });
}
export function array(len, inner) {
    if (!isCoder(inner))
        throw new Error(`array: invalid inner value ${inner}`);
    return wrap({
        size: typeof len === 'number' && inner.size ? len * inner.size : undefined,
        encodeStream: (w, value) => {
            if (!Array.isArray(value))
                throw w.err(`array: invalid value ${value}`);
            if (!isBytes(len))
                w.length(len, value.length);
            w.path.push(value);
            for (let i = 0; i < value.length; i++) {
                w.fieldPathPush('' + i);
                const elm = value[i];
                const startPos = w.pos;
                inner.encodeStream(w, elm);
                if (isBytes(len)) {
                    // Terminator is bigger than elm size, so skip
                    if (len.length > w.pos - startPos)
                        continue;
                    const data = w.buffer.subarray(startPos, w.pos);
                    // There is still possible case when multiple elements create terminator,
                    // but it is hard to catch here, will be very slow
                    if (equalBytes(data.subarray(0, len.length), len))
                        throw w.err(`array: inner element encoding same as separator. elm=${elm} data=${data}`);
                }
                w.fieldPathPop();
            }
            w.path.pop();
            if (isBytes(len))
                w.bytes(len);
        },
        decodeStream: (r) => {
            let res = [];
            if (len === null) {
                let i = 0;
                r.path.push(res);
                while (!r.isEnd()) {
                    r.fieldPathPush('' + i++);
                    res.push(inner.decodeStream(r));
                    r.fieldPathPop();
                    if (inner.size && r.leftBytes < inner.size)
                        break;
                }
                r.path.pop();
            }
            else if (isBytes(len)) {
                let i = 0;
                r.path.push(res);
                while (true) {
                    if (equalBytes(r.bytes(len.length, true), len)) {
                        // Advance cursor position if terminator found
                        r.bytes(len.length);
                        break;
                    }
                    r.fieldPathPush('' + i++);
                    res.push(inner.decodeStream(r));
                    r.fieldPathPop();
                }
                r.path.pop();
            }
            else {
                r.fieldPathPush('arrayLen');
                const length = r.length(len);
                r.fieldPathPop();
                r.path.push(res);
                for (let i = 0; i < length; i++) {
                    r.fieldPathPush('' + i);
                    res.push(inner.decodeStream(r));
                    r.fieldPathPop();
                }
                r.path.pop();
            }
            return res;
        },
    });
}
export function map(inner, variants) {
    if (!isCoder(inner))
        throw new Error(`map: invalid inner value ${inner}`);
    const variantNames = new Map();
    for (const k in variants)
        variantNames.set(variants[k], k);
    return wrap({
        size: inner.size,
        encodeStream: (w, value) => {
            if (typeof value !== 'string')
                throw w.err(`map: invalid value ${value}`);
            if (!(value in variants))
                throw w.err(`Map: unknown variant: ${value}`);
            inner.encodeStream(w, variants[value]);
        },
        decodeStream: (r) => {
            const variant = inner.decodeStream(r);
            const name = variantNames.get(variant);
            if (name === undefined)
                throw r.err(`Enum: unknown value: ${variant} ${Array.from(variantNames.keys())}`);
            return name;
        },
    });
}
export function tag(tag, variants) {
    if (!isCoder(tag))
        throw new Error(`tag: invalid tag value ${tag}`);
    return wrap({
        size: tag.size,
        encodeStream: (w, value) => {
            const { TAG, data } = value;
            const dataType = variants[TAG];
            if (!dataType)
                throw w.err(`Tag: invalid tag ${TAG.toString()}`);
            tag.encodeStream(w, TAG);
            dataType.encodeStream(w, data);
        },
        decodeStream: (r) => {
            const TAG = tag.decodeStream(r);
            const dataType = variants[TAG];
            if (!dataType)
                throw r.err(`Tag: invalid tag ${TAG}`);
            return { TAG, data: dataType.decodeStream(r) };
        },
    });
}
// Takes {name: [value, coder]}
export function mappedTag(tagCoder, variants) {
    if (!isCoder(tagCoder))
        throw new Error(`mappedTag: invalid tag value ${tag}`);
    const mapValue = {};
    const tagValue = {};
    for (const key in variants) {
        const v = variants[key];
        mapValue[key] = v[0];
        tagValue[key] = v[1];
    }
    return tag(map(tagCoder, mapValue), tagValue);
}
export function bitset(names, pad = false) {
    return wrap({
        encodeStream: (w, value) => {
            if (typeof value !== 'object' || value === null)
                throw w.err(`bitset: invalid value ${value}`);
            for (let i = 0; i < names.length; i++)
                w.bits(+value[names[i]], 1);
            if (pad && names.length % 8)
                w.bits(0, 8 - (names.length % 8));
        },
        decodeStream: (r) => {
            let out = {};
            for (let i = 0; i < names.length; i++)
                out[names[i]] = !!r.bits(1);
            if (pad && names.length % 8)
                r.bits(8 - (names.length % 8));
            return out;
        },
    });
}
export const ZeroPad = (_) => 0;
function padLength(blockSize, len) {
    if (len % blockSize === 0)
        return 0;
    return blockSize - (len % blockSize);
}
export function padLeft(blockSize, inner, padFn) {
    if (!isCoder(inner))
        throw new Error(`padLeft: invalid inner value ${inner}`);
    const _padFn = padFn || ZeroPad;
    if (!inner.size)
        throw new Error('padLeft with dynamic size argument is impossible');
    return wrap({
        size: inner.size + padLength(blockSize, inner.size),
        encodeStream: (w, value) => {
            const padBytes = padLength(blockSize, inner.size);
            for (let i = 0; i < padBytes; i++)
                w.byte(_padFn(i));
            inner.encodeStream(w, value);
        },
        decodeStream: (r) => {
            r.bytes(padLength(blockSize, inner.size));
            return inner.decodeStream(r);
        },
    });
}
export function padRight(blockSize, inner, padFn) {
    if (!isCoder(inner))
        throw new Error(`padRight: invalid inner value ${inner}`);
    const _padFn = padFn || ZeroPad;
    return wrap({
        size: inner.size ? inner.size + padLength(blockSize, inner.size) : undefined,
        encodeStream: (w, value) => {
            const pos = w.pos;
            inner.encodeStream(w, value);
            const padBytes = padLength(blockSize, w.pos - pos);
            for (let i = 0; i < padBytes; i++)
                w.byte(_padFn(i));
        },
        decodeStream: (r) => {
            const start = r.pos;
            const res = inner.decodeStream(r);
            r.bytes(padLength(blockSize, r.pos - start));
            return res;
        },
    });
}
// Pointers are scoped, next pointer in dereference chain is offseted by previous one.
// Not too generic, but, works fine for now.
export function pointer(ptr, inner, sized = false) {
    if (!isCoder(ptr))
        throw new Error(`pointer: invalid ptr value ${ptr}`);
    if (!isCoder(inner))
        throw new Error(`pointer: invalid inner value ${inner}`);
    if (!ptr.size)
        throw new Error('Pointer: unsized ptr');
    return wrap({
        size: sized ? ptr.size : undefined,
        encodeStream: (w, value) => {
            // TODO: by some reason it encodes array of pointers as [(ptr,val), (ptr, val)]
            // instead of [ptr, ptr][val, val]
            const start = w.pos;
            ptr.encodeStream(w, 0);
            w.ptrs.push({ pos: start, ptr, buffer: inner.encode(value) });
        },
        decodeStream: (r) => {
            const ptrVal = ptr.decodeStream(r);
            r.enablePtr();
            return inner.decodeStream(r.offsetReader(ptrVal));
        },
    });
}
// lineLen: gpg=64, ssh=70
export function base64armor(name, lineLen, inner, checksum) {
    const markBegin = `-----BEGIN ${name.toUpperCase()}-----`;
    const markEnd = `-----END ${name.toUpperCase()}-----`;
    return {
        encode(value) {
            const data = inner.encode(value);
            const encoded = base64.encode(data);
            let lines = [];
            for (let i = 0; i < encoded.length; i += lineLen) {
                const s = encoded.slice(i, i + lineLen);
                if (s.length)
                    lines.push(`${encoded.slice(i, i + lineLen)}\n`);
            }
            let body = lines.join('');
            if (checksum)
                body += `=${base64.encode(checksum(data))}\n`;
            return `${markBegin}\n\n${body}${markEnd}\n`;
        },
        decode(s) {
            let lines = s.replace(markBegin, '').replace(markEnd, '').trim().split('\n');
            lines = lines.map((l) => l.replace('\r', '').trim());
            const last = lines.length - 1;
            if (checksum && lines[last].startsWith('=')) {
                const body = base64.decode(lines.slice(0, -1).join(''));
                const cs = lines[last].slice(1);
                const realCS = base64.encode(checksum(body));
                if (realCS !== cs)
                    throw new Error(`Base64Armor: invalid checksum ${cs} instead of ${realCS}`);
                return inner.decode(body);
            }
            return inner.decode(base64.decode(lines.join('')));
        },
    };
}
// Does nothing at all
export const nothing = /* @__PURE__ */ magic(/* @__PURE__ */ bytes(0), EMPTY);
export function debug(inner) {
    if (!isCoder(inner))
        throw new Error(`debug: invalid inner value ${inner}`);
    const log = (name, rw, value) => {
        // @ts-ignore
        console.log(`DEBUG/${name}(${rw.fieldPath.join('/')}):`, { type: typeof value, value });
        return value;
    };
    return wrap({
        size: inner.size,
        encodeStream: (w, value) => inner.encodeStream(w, log('encode', w, value)),
        decodeStream: (r) => log('decode', r, inner.decodeStream(r)),
    });
}
// Internal methods for test purposes only
export const _TEST = /* @__PURE__ */ { _bitset };
