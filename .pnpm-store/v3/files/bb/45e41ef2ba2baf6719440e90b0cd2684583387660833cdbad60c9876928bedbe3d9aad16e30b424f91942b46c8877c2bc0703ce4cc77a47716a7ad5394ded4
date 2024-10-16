"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeHex = exports.remove0x = void 0;
var utils_1 = require("@noble/ciphers/utils");
function remove0x(hex) {
    if (hex.startsWith("0x") || hex.startsWith("0X")) {
        return hex.slice(2);
    }
    return hex;
}
exports.remove0x = remove0x;
function decodeHex(hex) {
    return (0, utils_1.hexToBytes)(remove0x(hex));
}
exports.decodeHex = decodeHex;
