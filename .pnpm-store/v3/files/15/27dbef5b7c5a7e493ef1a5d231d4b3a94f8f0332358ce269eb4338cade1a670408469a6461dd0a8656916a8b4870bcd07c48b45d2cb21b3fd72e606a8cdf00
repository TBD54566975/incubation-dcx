import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
export function validateProtocolUrlNormalized(url) {
    let normalized;
    try {
        normalized = normalizeProtocolUrl(url);
    }
    catch (_a) {
        normalized = undefined;
    }
    if (url !== normalized) {
        throw new DwnError(DwnErrorCode.UrlProtocolNotNormalized, `Protocol URI ${url} must be normalized.`);
    }
}
export function normalizeProtocolUrl(url) {
    // Keeping protocol normalization as a separate function in case
    // protocol and schema normalization diverge in the future
    return normalizeUrl(url);
}
export function validateSchemaUrlNormalized(url) {
    let normalized;
    try {
        normalized = normalizeSchemaUrl(url);
    }
    catch (_a) {
        normalized = undefined;
    }
    if (url !== normalized) {
        throw new DwnError(DwnErrorCode.UrlSchemaNotNormalized, `Schema URI ${url} must be normalized.`);
    }
}
export function normalizeSchemaUrl(url) {
    // Keeping schema normalization as a separate function in case
    // protocol and schema normalization diverge in the future
    return normalizeUrl(url);
}
function normalizeUrl(url) {
    let fullUrl;
    if (/^[^:]+:(\/{2})?[^\/].*/.test(url)) {
        fullUrl = url;
    }
    else {
        fullUrl = `http://${url}`;
    }
    try {
        const result = new URL(fullUrl);
        result.search = '';
        result.hash = '';
        return removeTrailingSlash(result.href);
    }
    catch (e) {
        throw new DwnError(DwnErrorCode.UrlProtocolNotNormalizable, 'Could not normalize protocol URI');
    }
}
function removeTrailingSlash(str) {
    if (str.endsWith('/')) {
        return str.slice(0, -1);
    }
    else {
        return str;
    }
}
//# sourceMappingURL=url.js.map