export function isCipher(obj) {
    return (obj !== null && typeof obj === 'object'
        && 'encrypt' in obj && typeof obj.encrypt === 'function'
        && 'decrypt' in obj && typeof obj.decrypt === 'function');
}
export function isKeyExporter(obj) {
    return (obj !== null && typeof obj === 'object'
        && 'exportKey' in obj && typeof obj.exportKey === 'function');
}
export function isKeyImporter(obj) {
    return (obj !== null && typeof obj === 'object'
        && 'importKey' in obj && typeof obj.importKey === 'function');
}
export function isKeyWrapper(obj) {
    return (obj !== null && typeof obj === 'object'
        && 'wrapKey' in obj && typeof obj.wrapKey === 'function'
        && 'unwrapKey' in obj && typeof obj.unwrapKey === 'function');
}
//# sourceMappingURL=utils.js.map