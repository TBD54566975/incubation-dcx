"use strict";
/*
  This file is run in dual environments to make installation of the Service Worker code easier.
  Be mindful that code placed in any open excution space may be evaluated multiple times in different contexts,
  so take care to gate additions to only activate code in the right env, such as a Service Worker scope or page window.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activatePolyfills = void 0;
var dids_1 = require("@web5/dids");
var DidResolver = new dids_1.UniversalResolver({ didResolvers: [dids_1.DidDht, dids_1.DidWeb] });
var didUrlRegex = /^https?:\/\/dweb\/([^/]+)\/?(.*)?$/;
var httpToHttpsRegex = /^http:/;
var trailingSlashRegex = /\/$/;
// This is in place to prevent our `bundler-bonanza` repo from failing for Node CJS builds
// Not sure if this is working as expected in all environments, crated an issue
// TODO: https://github.com/TBD54566975/web5-js/issues/767
function importMetaIfSupported() {
    try {
        return new Function('return import.meta')();
    }
    catch (_error) {
        return undefined;
    }
}
function getDwnEndpoints(did) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var didDocument, endpoints;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, DidResolver.resolve(did)];
                case 1:
                    didDocument = (_c.sent()).didDocument;
                    endpoints = (_b = (_a = didDocument === null || didDocument === void 0 ? void 0 : didDocument.service) === null || _a === void 0 ? void 0 : _a.find(function (service) { return service.type === 'DecentralizedWebNode'; })) === null || _b === void 0 ? void 0 : _b.serviceEndpoint;
                    return [2 /*return*/, (Array.isArray(endpoints) ? endpoints : [endpoints]).filter(function (url) { return url.startsWith('http'); })];
            }
        });
    });
}
function handleEvent(event, did, path, options) {
    return __awaiter(this, void 0, void 0, function () {
        var drl, responseCache, cachedResponse, match, cacheTime, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    drl = event.request.url.replace(httpToHttpsRegex, 'https:').replace(trailingSlashRegex, '');
                    return [4 /*yield*/, caches.open('drl')];
                case 1:
                    responseCache = _a.sent();
                    return [4 /*yield*/, responseCache.match(drl)];
                case 2:
                    cachedResponse = _a.sent();
                    if (!cachedResponse) return [3 /*break*/, 4];
                    if (!navigator.onLine)
                        return [2 /*return*/, cachedResponse];
                    return [4 /*yield*/, (options === null || options === void 0 ? void 0 : options.onCacheCheck(event, drl))];
                case 3:
                    match = _a.sent();
                    if (match) {
                        cacheTime = cachedResponse.headers.get('dwn-cache-time');
                        if (cacheTime && Date.now() < Number(cacheTime) + (Number(match.ttl) || 0)) {
                            return [2 /*return*/, cachedResponse];
                        }
                    }
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 9, , 10]);
                    if (!!path) return [3 /*break*/, 6];
                    return [4 /*yield*/, DidResolver.resolve(did)];
                case 5:
                    response = _a.sent();
                    return [2 /*return*/, new Response(JSON.stringify(response), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 6: return [4 /*yield*/, fetchResource(event, did, drl, path, responseCache, options)];
                case 7: return [2 /*return*/, _a.sent()];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    if (error_1 instanceof Response) {
                        return [2 /*return*/, error_1];
                    }
                    console.log("Error in DID URL fetch: ".concat(error_1));
                    return [2 /*return*/, new Response('DID URL fetch error', { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function fetchResource(event, did, drl, path, responseCache, options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoints, endpoints_1, endpoints_1_1, endpoint, url, response, match, error_2, e_1_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getDwnEndpoints(did)];
                case 1:
                    endpoints = _b.sent();
                    if (!(endpoints === null || endpoints === void 0 ? void 0 : endpoints.length)) {
                        throw new Response('DWeb Node resolution failed: no valid endpoints found.', { status: 530 });
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 11, 12, 13]);
                    endpoints_1 = __values(endpoints), endpoints_1_1 = endpoints_1.next();
                    _b.label = 3;
                case 3:
                    if (!!endpoints_1_1.done) return [3 /*break*/, 10];
                    endpoint = endpoints_1_1.value;
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 8, , 9]);
                    url = "".concat(endpoint.replace(trailingSlashRegex, ''), "/").concat(did, "/").concat(path);
                    return [4 /*yield*/, fetch(url, { headers: event.request.headers })];
                case 5:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, (options === null || options === void 0 ? void 0 : options.onCacheCheck(event, drl))];
                case 6:
                    match = _b.sent();
                    if (match) {
                        cacheResponse(drl, url, response, responseCache);
                    }
                    return [2 /*return*/, response];
                case 7:
                    console.log("DWN endpoint error: ".concat(response.status));
                    return [2 /*return*/, new Response('DWeb Node request failed', { status: response.status })];
                case 8:
                    error_2 = _b.sent();
                    console.log("DWN endpoint error: ".concat(error_2));
                    return [2 /*return*/, new Response('DWeb Node request failed: ' + error_2, { status: 500 })];
                case 9:
                    endpoints_1_1 = endpoints_1.next();
                    return [3 /*break*/, 3];
                case 10: return [3 /*break*/, 13];
                case 11:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 12:
                    try {
                        if (endpoints_1_1 && !endpoints_1_1.done && (_a = endpoints_1.return)) _a.call(endpoints_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function cacheResponse(drl, url, response, cache) {
    return __awaiter(this, void 0, void 0, function () {
        var clonedResponse, headers, modifiedResponse;
        return __generator(this, function (_a) {
            clonedResponse = response.clone();
            headers = new Headers(clonedResponse.headers);
            headers.append('dwn-cache-time', Date.now().toString());
            headers.append('dwn-composed-url', url);
            modifiedResponse = new Response(clonedResponse.body, { headers: headers });
            cache.put(drl, modifiedResponse);
            return [2 /*return*/];
        });
    });
}
/* Service Worker-based features */
function installWorker(options) {
    var _a, _b, _c;
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var workerSelf, registration, installUrl, error_3;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    workerSelf = self;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    if (!(typeof ServiceWorkerGlobalScope !== 'undefined' && workerSelf instanceof ServiceWorkerGlobalScope)) return [3 /*break*/, 2];
                    workerSelf.skipWaiting();
                    workerSelf.addEventListener('activate', function (event) {
                        // Claim clients to make the service worker take control immediately
                        event.waitUntil(workerSelf.clients.claim());
                    });
                    workerSelf.addEventListener('fetch', function (event) {
                        var match = event.request.url.match(didUrlRegex);
                        if (match) {
                            event.respondWith(handleEvent(event, match[1], match[2], options));
                        }
                    });
                    return [3 /*break*/, 5];
                case 2:
                    if (!((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _a === void 0 ? void 0 : _a.serviceWorker)) return [3 /*break*/, 4];
                    return [4 /*yield*/, navigator.serviceWorker.getRegistration('/')];
                case 3:
                    registration = _d.sent();
                    // You can only have one worker per path, so check to see if one is already registered
                    if (!registration) {
                        installUrl = options.path || (globalThis.document ? (_b = document === null || document === void 0 ? void 0 : document.currentScript) === null || _b === void 0 ? void 0 : _b.src : (_c = importMetaIfSupported()) === null || _c === void 0 ? void 0 : _c.url);
                        if (installUrl)
                            navigator.serviceWorker.register(installUrl, { type: 'module' }).catch(function (error) {
                                console.error('DWeb networking feature installation failed: ', error);
                            });
                    }
                    return [3 /*break*/, 5];
                case 4: throw new Error('DWeb networking features are not available for install in this environment');
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _d.sent();
                    console.error('Error in installing networking features:', error_3);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/* DOM Environment Features */
var loaderStyles = "\n  .drl-loading-overlay {\n    position: fixed;\n    inset: 0;\n    display: flex;\n    flex-wrap: wrap;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    font-size: 22px;\n    color: #fff;\n    background: rgba(0, 0, 0, 0.75);\n    backdrop-filter: blur(15px);\n    -webkit-backdrop-filter: blur(15px);\n    z-index: 1000000;\n  }\n\n  .drl-loading-overlay > div {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  .drl-loading-spinner {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n    .drl-loading-spinner div {\n      position: relative;\n      width: 2em;\n      height: 2em;\n      margin: 0.1em 0.25em 0 0;\n    }\n    .drl-loading-spinner div::after,\n    .drl-loading-spinner div::before {\n      content: '';  \n      box-sizing: border-box;\n      width: 100%;\n      height: 100%;\n      border-radius: 50%;\n      border: 0.1em solid #FFF;\n      position: absolute;\n      left: 0;\n      top: 0;\n      opacity: 0;\n      animation: drl-loading-spinner 2s linear infinite;\n    }\n    .drl-loading-spinner div::after {\n      animation-delay: 1s;\n    }\n\n  .drl-loading-overlay span {\n    --text-opacity: 2;\n    display: flex;\n    align-items: center;\n    margin: 2em auto 0;\n    padding: 0.2em 0.75em 0.25em;\n    text-align: center;\n    border-radius: 5em;\n    background: rgba(255 255 255 / 8%);\n    opacity: 0.8;\n    transition: opacity 0.3s ease;\n    cursor: pointer;\n  }\n\n    .drl-loading-overlay span:focus {\n      opacity: 1;\n    }\n\n    .drl-loading-overlay span:hover {\n      opacity: 1;\n    }\n\n    .drl-loading-overlay span::before {\n      content: \"\u2715 \";\n      margin: 0 0.4em 0 0;\n      color: red;\n      font-size: 65%;\n      font-weight: bold;\n    }\n\n    .drl-loading-overlay span::after {\n      content: \"stop\";\n      display: block;\n      font-size: 60%;\n      line-height: 0;\n      color: rgba(255 255 255 / 60%);\n    }\n\n    .drl-loading-overlay.new-tab-overlay span::after {\n      content: \"close\";\n    }\n  \n  @keyframes drl-loading-spinner {\n    0% {\n      transform: scale(0);\n      opacity: 1;\n    }\n    100% {\n      transform: scale(1);\n      opacity: 0;\n    }\n  }\n";
var tabContent = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Loading DRL...</title>\n  <style>\n    html, body {\n      background-color: #151518;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n      font-family: Arial, sans-serif;\n      text-align: center;\n    }\n    ".concat(loaderStyles, "\n  </style>\n</head>\n<body>\n  <div class=\"drl-loading-overlay new-tab-overlay\">\n    <div class=\"drl-loading-spinner\">\n      <div></div>\n      Loading DRL\n    </div>\n    <span onclick=\"window.close()\" tabindex=\"0\"></span>\n  </div>\n</body>\n</html>\n");
var elementsInjected = false;
function injectElements() {
    if (elementsInjected)
        return;
    var style = document.createElement('style');
    style.innerHTML = "\n    ".concat(loaderStyles, "\n\n    .drl-loading-overlay {\n      opacity: 0;\n      transition: opacity 0.3s ease;\n      pointer-events: none;\n    }\n\n    :root[drl-link-loading] .drl-loading-overlay {\n      opacity: 1;\n      pointer-events: all;\n    }\n  ");
    document.head.append(style);
    var overlay = document.createElement('div');
    overlay.classList.add('drl-loading-overlay');
    overlay.innerHTML = "\n    <div class=\"drl-loading-spinner\">\n      <div></div>\n      Loading DRL\n    </div> \n    <span tabindex=\"0\"></span>\n  ";
    overlay.lastElementChild.addEventListener('click', cancelNavigation);
    document.body.prepend(overlay);
    elementsInjected = true;
}
function cancelNavigation() {
    document.documentElement.removeAttribute('drl-link-loading');
    activeNavigation = null;
}
var activeNavigation;
var linkFeaturesActive = false;
function addLinkFeatures() {
    var _this = this;
    if (!linkFeaturesActive) {
        document.addEventListener('click', function (event) { return __awaiter(_this, void 0, void 0, function () {
            var anchor, href, match, did, path, openAsTab, tab, endpoints, url, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        anchor = event.target.closest('a');
                        if (!anchor) return [3 /*break*/, 4];
                        href = anchor.href;
                        match = href.match(didUrlRegex);
                        if (!match) return [3 /*break*/, 4];
                        did = match[1];
                        path = match[2];
                        openAsTab = anchor.target === '_blank';
                        event.preventDefault();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        tab = void 0;
                        if (openAsTab) {
                            tab = window.open('', '_blank');
                            tab.document.write(tabContent);
                        }
                        else {
                            activeNavigation = path;
                            // this is to allow for cached DIDs to instantly load without any flash of loading UI
                            setTimeout(function () { return document.documentElement.setAttribute('drl-link-loading', ''); }, 50);
                        }
                        return [4 /*yield*/, getDwnEndpoints(did)];
                    case 2:
                        endpoints = _a.sent();
                        if (!endpoints.length)
                            throw null;
                        url = "".concat(endpoints[0].replace(trailingSlashRegex, ''), "/").concat(did, "/").concat(path);
                        if (openAsTab) {
                            if (!tab.closed)
                                tab.location.href = url;
                        }
                        else if (activeNavigation === path) {
                            window.location.href = url;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        if (activeNavigation === path) {
                            cancelNavigation();
                        }
                        throw new Error("DID endpoint resolution failed for the DRL: ".concat(href));
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        document.addEventListener('pointercancel', resetContextMenuTarget);
        document.addEventListener('pointerdown', function (event) { return __awaiter(_this, void 0, void 0, function () {
            var target, drl, responseCache, response, url;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        target = event.composedPath()[0];
                        if (!((event.pointerType === 'mouse' && event.button === 2) ||
                            (event.pointerType === 'touch' && event.isPrimary))) return [3 /*break*/, 4];
                        resetContextMenuTarget();
                        if (!(target && ((_a = target === null || target === void 0 ? void 0 : target.src) === null || _a === void 0 ? void 0 : _a.match(didUrlRegex)))) return [3 /*break*/, 3];
                        contextMenuTarget = target;
                        target.__src__ = target.src;
                        drl = target.src.replace(httpToHttpsRegex, 'https:').replace(trailingSlashRegex, '');
                        return [4 /*yield*/, caches.open('drl')];
                    case 1:
                        responseCache = _b.sent();
                        return [4 /*yield*/, responseCache.match(drl)];
                    case 2:
                        response = _b.sent();
                        url = response.headers.get('dwn-composed-url');
                        if (url)
                            target.src = url;
                        target.addEventListener('pointerup', resetContextMenuTarget, { once: true });
                        _b.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        if (target === contextMenuTarget) {
                            resetContextMenuTarget();
                        }
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        linkFeaturesActive = true;
    }
}
var contextMenuTarget;
function resetContextMenuTarget(e) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((e === null || e === void 0 ? void 0 : e.type) === 'pointerup')) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (contextMenuTarget) {
                        contextMenuTarget.src = contextMenuTarget.__src__;
                        delete contextMenuTarget.__src__;
                        contextMenuTarget = null;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Activates various polyfills to enable Web5 features in Web environments.
 *
 * @param {object} [options={}] - Configuration options to control the activation of polyfills.
 * @param {boolean} [options.serviceWorker=true] - Option to avoid installation of the Service Worker. Defaults to true, installing the Service Worker.
 * @param {boolean} [options.injectStyles=true] - Option to skip injection of styles for UI related UX polyfills. Defaults to true, injecting styles.
 * @param {boolean} [options.links=true] - Option to skip activation of DRL link features. Defaults to true, activating link features.
 * @param {function} [options.onCacheCheck] - Callback function to handle cache check events, allowing fine-grained control over what DRL request to cache, and for how long.
 * @param {object} [options.onCacheCheck.event] - The event object passed to the callback.
 * @param {object} [options.onCacheCheck.route] - The route object passed to the callback.
 * @returns {object} [options.onCacheCheck.return] - The return object from the callback.
 * @returns {number} [options.onCacheCheck.return.ttl] - Time-to-live for the cached DRL response, in milliseconds.
 *
 * @returns {void}
 *
 * @example
 * // Activate all polyfills with default options, and cache every DRL for 1 minute
 * activatePolyfills({
 *   onCacheCheck(event, route){
 *     return {
 *       ttl: 60_000
 *     }
 *   }
 * });
 *
 * @example
 * // Activate polyfills, but without Service Worker activation
 * activatePolyfills({ serviceWorker: false });
*/
function activatePolyfills(options) {
    if (options === void 0) { options = {}; }
    if (options.serviceWorker !== false) {
        installWorker(options);
    }
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        if (options.injectStyles !== false) {
            if (document.readyState !== 'loading')
                injectElements();
            else {
                document.addEventListener('DOMContentLoaded', injectElements, { once: true });
            }
        }
        if (options.links !== false)
            addLinkFeatures();
    }
}
exports.activatePolyfills = activatePolyfills;
//# sourceMappingURL=web-features.js.map