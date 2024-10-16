"use strict";
/**
 * NOTE: Added reference types here to avoid a `pnpm` bug during build.
 * https://github.com/TBD54566975/web5-js/pull/507
 */
/// <reference types="@tbd54566975/dwn-sdk-js" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.Record = void 0;
var agent_1 = require("@web5/agent");
var common_1 = require("@web5/common");
var utils_js_1 = require("./utils.js");
/**
 * The `Record` class encapsulates a single record's data and metadata, providing a more
 * developer-friendly interface for working with Decentralized Web Node (DWN) records.
 *
 * Methods are provided to read, update, and manage the record's lifecycle, including writing to
 * remote DWNs.
 *
 * Note: The `messageTimestamp` of the most recent RecordsWrite message is
 *       logically equivalent to the date/time at which a Record was most
 *       recently modified.  Since this Record class implementation is
 *       intended to simplify the developer experience of working with
 *       logical records (and not individual DWN messages) the
 *       `messageTimestamp` is mapped to `dateModified`.
 *
 * @beta
 */
var Record = exports.Record = /** @class */ (function () {
    function Record(agent, options) {
        this._agent = agent;
        // Store the author DID that originally signed the message as a convenience for developers, so
        // that they don't have to decode the signer's DID from the JWS.
        this._author = options.author;
        // Store the currently `connectedDid` so that subsequent message signing is done with the
        // connected DID's keys and DWN requests target the connected DID's DWN.
        this._connectedDid = options.connectedDid;
        // If the record was queried or read from a remote DWN, the `remoteOrigin` DID will be
        // defined. This value is used to send subsequent read requests to the same remote DWN in the
        // event the record's data payload was too large to be returned in query results. or must be
        // read again (e.g., if the data stream is consumed).
        this._remoteOrigin = options.remoteOrigin;
        // RecordsWriteMessage properties.
        this._attestation = options.attestation;
        this._authorization = options.authorization;
        this._contextId = options.contextId;
        this._descriptor = options.descriptor;
        this._encryption = options.encryption;
        this._initialWrite = options.initialWrite;
        this._recordId = options.recordId;
        this._protocolRole = options.protocolRole;
        if (options.encodedData) {
            // If `encodedData` is set, then it is expected that:
            // type is Blob if the Record object was instantiated by dwn.records.create()/write().
            // type is Base64 URL encoded string if the Record object was instantiated by dwn.records.query().
            // If it is a string, we need to Base64 URL decode to bytes and instantiate a Blob.
            this._encodedData = (typeof options.encodedData === 'string') ?
                new Blob([common_1.Convert.base64Url(options.encodedData).toUint8Array()], { type: this.dataFormat }) :
                options.encodedData;
        }
        if (options.data) {
            // If the record was created from a RecordsRead reply then it will have a `data` property.
            // If the `data` property is a web ReadableStream, convert it to a Node.js Readable.
            this._readableStream = common_1.Stream.isReadableStream(options.data) ?
                common_1.NodeStream.fromWebReadable({ readableStream: options.data }) :
                options.data;
        }
    }
    Object.defineProperty(Record.prototype, "_recordsWriteDescriptor", {
        /** The `RecordsWriteMessage` descriptor unless the record is in a deleted state */
        get: function () {
            if ((0, agent_1.isDwnMessage)(agent_1.DwnInterface.RecordsWrite, this.rawMessage)) {
                return this._descriptor;
            }
            return undefined; // returns undefined if the descriptor does not represent a RecordsWrite message.
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "_immutableProperties", {
        /** The `RecordsWrite` descriptor from the current record or the initial write if the record is in a delete state. */
        get: function () {
            return this._recordsWriteDescriptor || this._initialWrite.descriptor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "id", {
        // Getters for immutable Record properties.
        /** Record's ID */
        get: function () { return this._recordId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "contextId", {
        /** Record's context ID */
        get: function () { return this._contextId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "dateCreated", {
        /** Record's creation date */
        get: function () { return this._immutableProperties.dateCreated; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "parentId", {
        /** Record's parent ID */
        get: function () { return this._immutableProperties.parentId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "protocol", {
        /** Record's protocol */
        get: function () { return this._immutableProperties.protocol; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "protocolPath", {
        /** Record's protocol path */
        get: function () { return this._immutableProperties.protocolPath; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "recipient", {
        /** Record's recipient */
        get: function () { return this._immutableProperties.recipient; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "schema", {
        /** Record's schema */
        get: function () { return this._immutableProperties.schema; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "dataFormat", {
        // Getters for mutable DWN RecordsWrite properties that may be undefined in a deleted state.
        /** Record's data format */
        get: function () { var _a; return (_a = this._recordsWriteDescriptor) === null || _a === void 0 ? void 0 : _a.dataFormat; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "dataCid", {
        /** Record's CID */
        get: function () { var _a; return (_a = this._recordsWriteDescriptor) === null || _a === void 0 ? void 0 : _a.dataCid; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "dataSize", {
        /** Record's data size */
        get: function () { var _a; return (_a = this._recordsWriteDescriptor) === null || _a === void 0 ? void 0 : _a.dataSize; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "datePublished", {
        /** Record's published date */
        get: function () { var _a; return (_a = this._recordsWriteDescriptor) === null || _a === void 0 ? void 0 : _a.datePublished; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "published", {
        /** Record's published status (true/false) */
        get: function () { var _a; return (_a = this._recordsWriteDescriptor) === null || _a === void 0 ? void 0 : _a.published; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "tags", {
        /** Tags of the record */
        get: function () { var _a; return (_a = this._recordsWriteDescriptor) === null || _a === void 0 ? void 0 : _a.tags; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "author", {
        // Getters for for properties that depend on the current state of the Record.
        /** DID that is the logical author of the Record. */
        get: function () { return this._author; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "dateModified", {
        /** Record's modified date */
        get: function () { return this._descriptor.messageTimestamp; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "encryption", {
        /** Record's encryption */
        get: function () { return this._encryption; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "authorization", {
        /** Record's signatures attestation */
        get: function () { return this._authorization; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "attestation", {
        /** Record's signatures attestation */
        get: function () { return this._attestation; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "protocolRole", {
        /** Role under which the author is writing the record */
        get: function () { return this._protocolRole; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "deleted", {
        /** Record's deleted state (true/false) */
        get: function () { return (0, agent_1.isDwnMessage)(agent_1.DwnInterface.RecordsDelete, this.rawMessage); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "initialWrite", {
        /** Record's initial write if the record has been updated */
        get: function () { return this._initialWrite; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "rawMessage", {
        /**
         * Returns a copy of the raw `RecordsWriteMessage` that was used to create the current `Record` instance.
         */
        get: function () {
            var messageType = this._descriptor.interface + this._descriptor.method;
            var message;
            if (messageType === agent_1.DwnInterface.RecordsWrite) {
                message = JSON.parse(JSON.stringify({
                    contextId: this._contextId,
                    recordId: this._recordId,
                    descriptor: this._descriptor,
                    attestation: this._attestation,
                    authorization: this._authorization,
                    encryption: this._encryption,
                }));
            }
            else {
                message = JSON.parse(JSON.stringify({
                    descriptor: this._descriptor,
                    authorization: this._authorization,
                }));
            }
            (0, common_1.removeUndefinedProperties)(message);
            return message;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Record.prototype, "data", {
        /**
         * Returns the data of the current record.
         * If the record data is not available, it attempts to fetch the data from the DWN.
         * @returns a data stream with convenience methods such as `blob()`, `json()`, `text()`, and `stream()`, similar to the fetch API response
         * @throws `Error` if the record has already been deleted.
         *
         * @beta
         */
        get: function () {
            var self = this; // Capture the context of the `Record` instance.
            var dataObj = {
                /**
                 * Returns the data of the current record as a `Blob`.
                 *
                 * @returns A promise that resolves to a Blob containing the record's data.
                 * @throws If the record data is not available or cannot be converted to a `Blob`.
                 *
                 * @beta
                 */
                blob: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b, _c;
                        var _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _a = Blob.bind;
                                    _c = (_b = common_1.NodeStream).consumeToBytes;
                                    _d = {};
                                    return [4 /*yield*/, this.stream()];
                                case 1: return [4 /*yield*/, _c.apply(_b, [(_d.readable = _e.sent(), _d)])];
                                case 2: return [2 /*return*/, new (_a.apply(Blob, [void 0, [_e.sent()], { type: self.dataFormat }]))()];
                            }
                        });
                    });
                },
                /**
                 * Returns the data of the current record as a `Uint8Array`.
                 *
                 * @returns A Promise that resolves to a `Uint8Array` containing the record's data bytes.
                 * @throws If the record data is not available or cannot be converted to a byte array.
                 *
                 * @beta
                 */
                bytes: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _b = (_a = common_1.NodeStream).consumeToBytes;
                                    _c = {};
                                    return [4 /*yield*/, this.stream()];
                                case 1: return [4 /*yield*/, _b.apply(_a, [(_c.readable = _d.sent(), _c)])];
                                case 2: return [2 /*return*/, _d.sent()];
                            }
                        });
                    });
                },
                /**
                 * Parses the data of the current record as JSON and returns it as a JavaScript object.
                 *
                 * @returns A Promise that resolves to a JavaScript object parsed from the record's JSON data.
                 * @throws If the record data is not available, not in JSON format, or cannot be parsed.
                 *
                 * @beta
                 */
                json: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _b = (_a = common_1.NodeStream).consumeToJson;
                                    _c = {};
                                    return [4 /*yield*/, this.stream()];
                                case 1: return [4 /*yield*/, _b.apply(_a, [(_c.readable = _d.sent(), _c)])];
                                case 2: return [2 /*return*/, _d.sent()];
                            }
                        });
                    });
                },
                /**
                 * Returns the data of the current record as a `string`.
                 *
                 * @returns A promise that resolves to a `string` containing the record's text data.
                 * @throws If the record data is not available or cannot be converted to text.
                 *
                 * @beta
                 */
                text: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _b = (_a = common_1.NodeStream).consumeToText;
                                    _c = {};
                                    return [4 /*yield*/, this.stream()];
                                case 1: return [4 /*yield*/, _b.apply(_a, [(_c.readable = _d.sent(), _c)])];
                                case 2: return [2 /*return*/, _d.sent()];
                            }
                        });
                    });
                },
                /**
                 * Provides a `Readable` stream containing the record's data.
                 *
                 * @returns A promise that resolves to a Node.js `Readable` stream of the record's data.
                 * @throws If the record data is not available in-memory and cannot be fetched.
                 *
                 * @beta
                 */
                stream: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!self._encodedData) return [3 /*break*/, 1];
                                    /** If `encodedData` is set, it indicates that the Record was instantiated by
                                     * `dwn.records.create()`/`dwn.records.write()` or the record's data payload was small
                                     * enough to be returned in `dwn.records.query()` results. In either case, the data is
                                     * already available in-memory and can be returned as a Node.js `Readable` stream. */
                                    self._readableStream = common_1.NodeStream.fromWebReadable({ readableStream: self._encodedData.stream() });
                                    return [3 /*break*/, 6];
                                case 1:
                                    if (!!common_1.NodeStream.isReadable({ readable: self._readableStream })) return [3 /*break*/, 6];
                                    /** If the data stream for this `Record` instance has already been partially or fully
                                     * consumed, then the data must be fetched again from either: */
                                    _a = self;
                                    if (!self._remoteOrigin) return [3 /*break*/, 3];
                                    // A. ...a remote DWN if the record was originally queried from a remote DWN.
                                    return [4 /*yield*/, self.readRecordData({ target: self._remoteOrigin, isRemote: true })];
                                case 2:
                                    // A. ...a remote DWN if the record was originally queried from a remote DWN.
                                    _b = _c.sent();
                                    return [3 /*break*/, 5];
                                case 3: 
                                // B. ...a local DWN if the record was originally queried from the local DWN.
                                return [4 /*yield*/, self.readRecordData({ target: self._connectedDid, isRemote: false })];
                                case 4:
                                    // B. ...a local DWN if the record was originally queried from the local DWN.
                                    _b = _c.sent();
                                    _c.label = 5;
                                case 5:
                                    /** If the data stream for this `Record` instance has already been partially or fully
                                     * consumed, then the data must be fetched again from either: */
                                    _a._readableStream = _b;
                                    _c.label = 6;
                                case 6:
                                    if (!self._readableStream) {
                                        throw new Error('Record data is not available.');
                                    }
                                    return [2 /*return*/, self._readableStream];
                            }
                        });
                    });
                },
                /**
                 * Attaches callbacks for the resolution and/or rejection of the `Promise` returned by
                 * `stream()`.
                 *
                 * This method is a proxy to the `then` method of the `Promise` returned by `stream()`,
                 * allowing for a seamless integration with promise-based workflows.
                 * @param onFulfilled - A function to asynchronously execute when the `stream()` promise
                 *                      becomes fulfilled.
                 * @param onRejected - A function to asynchronously execute when the `stream()` promise
                 *                     becomes rejected.
                 * @returns A `Promise` for the completion of which ever callback is executed.
                 */
                then: function (onFulfilled, onRejected) {
                    return this.stream().then(onFulfilled, onRejected);
                },
                /**
                 * Attaches a rejection handler callback to the `Promise` returned by the `stream()` method.
                 * This method is a shorthand for `.then(undefined, onRejected)`, specifically designed for handling
                 * rejection cases in the promise chain initiated by accessing the record's data. It ensures that
                 * errors during data retrieval or processing can be caught and handled appropriately.
                 *
                 * @param onRejected - A function to asynchronously execute when the `stream()` promise
                 *                     becomes rejected.
                 * @returns A `Promise` that resolves to the value of the callback if it is called, or to its
                 *          original fulfillment value if the promise is instead fulfilled.
                 */
                catch: function (onRejected) {
                    return this.stream().catch(onRejected);
                }
            };
            return dataObj;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Stores the current record state as well as any initial write to the owner's DWN.
     *
     * @param importRecord - if true, the record will signed by the owner before storing it to the owner's DWN. Defaults to false.
     * @returns the status of the store request
     *
     * @beta
     */
    Record.prototype.store = function (importRecord) {
        if (importRecord === void 0) { importRecord = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if we are importing the record we sign it as the owner
                return [2 /*return*/, this.processRecord({ signAsOwner: importRecord, store: true })];
            });
        });
    };
    /**
     * Signs the current record state as well as any initial write and optionally stores it to the owner's DWN.
     * This is useful when importing a record that was signed by someone else into your own DWN.
     *
     * @param store - if true, the record will be stored to the owner's DWN after signing. Defaults to true.
     * @returns the status of the import request
     *
     * @beta
     */
    Record.prototype.import = function (store) {
        if (store === void 0) { store = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.processRecord({ store: store, signAsOwner: true })];
            });
        });
    };
    /**
     * Send the current record to a remote DWN by specifying their DID
     * If no DID is specified, the target is assumed to be the owner (connectedDID).
     * If an initial write is present and the Record class send cache has no awareness of it, the initial write is sent first
     * (vs waiting for the regular DWN sync)
     *
     * @param target - the optional DID to send the record to, if none is set it is sent to the connectedDid
     * @returns the status of the send record request
     * @throws `Error` if the record has already been deleted.
     *
     * @beta
     */
    Record.prototype.send = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var initialWrite, rawMessage, sendRequestOptions, reply;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        initialWrite = this._initialWrite;
                        target !== null && target !== void 0 ? target : (target = this._connectedDid);
                        if (!(initialWrite && !Record._sendCache.check(this._recordId, target))) return [3 /*break*/, 2];
                        rawMessage = __assign({}, initialWrite);
                        (0, common_1.removeUndefinedProperties)(rawMessage);
                        // Send the initial write to the target.
                        return [4 /*yield*/, this._agent.sendDwnRequest({
                                messageType: agent_1.DwnInterface.RecordsWrite,
                                author: this._connectedDid,
                                target: target,
                                rawMessage: rawMessage
                            })];
                    case 1:
                        // Send the initial write to the target.
                        _b.sent();
                        // Set the cache to maintain awareness that we don't need to send the initial write next time.
                        Record._sendCache.set(this._recordId, target);
                        _b.label = 2;
                    case 2:
                        if (!this.deleted) return [3 /*break*/, 3];
                        sendRequestOptions = {
                            messageType: agent_1.DwnInterface.RecordsDelete,
                            author: this._connectedDid,
                            target: target,
                            rawMessage: __assign({}, this.rawMessage)
                        };
                        return [3 /*break*/, 5];
                    case 3:
                        _a = {
                            messageType: agent_1.DwnInterface.RecordsWrite,
                            author: this._connectedDid,
                            target: target
                        };
                        return [4 /*yield*/, this.data.blob()];
                    case 4:
                        sendRequestOptions = (_a.dataStream = _b.sent(),
                            _a.rawMessage = __assign({}, this.rawMessage),
                            _a);
                        _b.label = 5;
                    case 5: return [4 /*yield*/, this._agent.sendDwnRequest(sendRequestOptions)];
                    case 6:
                        reply = (_b.sent()).reply;
                        return [2 /*return*/, reply];
                }
            });
        });
    };
    /**
     * Returns a JSON representation of the Record instance.
     * It's called by `JSON.stringify(...)` automatically.
     */
    Record.prototype.toJSON = function () {
        return {
            attestation: this.attestation,
            author: this.author,
            authorization: this.authorization,
            contextId: this.contextId,
            dataCid: this.dataCid,
            dataFormat: this.dataFormat,
            dataSize: this.dataSize,
            dateCreated: this.dateCreated,
            messageTimestamp: this.dateModified,
            datePublished: this.datePublished,
            encryption: this.encryption,
            parentId: this.parentId,
            protocol: this.protocol,
            protocolPath: this.protocolPath,
            protocolRole: this.protocolRole,
            published: this.published,
            recipient: this.recipient,
            recordId: this.id,
            schema: this.schema,
            tags: this.tags,
        };
    };
    /**
     * Convenience method to return the string representation of the Record instance.
     * Called automatically in string concatenation, String() type conversion, and template literals.
     */
    Record.prototype.toString = function () {
        var str = "Record: {\n";
        str += "  ID: ".concat(this.id, "\n");
        str += this.contextId ? "  Context ID: ".concat(this.contextId, "\n") : '';
        str += this.protocol ? "  Protocol: ".concat(this.protocol, "\n") : '';
        str += this.schema ? "  Schema: ".concat(this.schema, "\n") : '';
        // Only display data properties if the record has not been deleted.
        if (!this.deleted) {
            str += "  Data CID: ".concat(this.dataCid, "\n");
            str += "  Data Format: ".concat(this.dataFormat, "\n");
            str += "  Data Size: ".concat(this.dataSize, "\n");
        }
        str += "  Deleted: ".concat(this.deleted, "\n");
        str += "  Created: ".concat(this.dateCreated, "\n");
        str += "  Modified: ".concat(this.dateModified, "\n");
        str += "}";
        return str;
    };
    /**
     * Returns a pagination cursor for the current record given a sort order.
     *
     * @param sort the sort order to use for the pagination cursor.
     * @returns A promise that resolves to a pagination cursor for the current record.
     */
    Record.prototype.paginationCursor = function (sort) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, agent_1.isDwnMessage)(agent_1.DwnInterface.RecordsWrite, this.rawMessage) ? (0, agent_1.getPaginationCursor)(this.rawMessage, sort) : undefined];
            });
        });
    };
    /**
     * Update the current record on the DWN.
     * @param params - Parameters to update the record.
     * @returns the status of the update request
     * @throws `Error` if the record has already been deleted.
     *
     * @beta
     */
    Record.prototype.update = function (_a) {
        var dateModified = _a.dateModified, data = _a.data, params = __rest(_a, ["dateModified", "data"]);
        return __awaiter(this, void 0, void 0, function () {
            var _b, parentId, descriptor, parentContextId, updateMessage, dataBlob, mutableDescriptorProperties, agentResponse, message, status, responseMessage;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(0, agent_1.isDwnMessage)(agent_1.DwnInterface.RecordsWrite, this.rawMessage) && !this._initialWrite) {
                            throw new Error('If initial write is not set, the current rawRecord must be a RecordsWrite message.');
                        }
                        _b = this._recordsWriteDescriptor, parentId = _b.parentId, descriptor = __rest(_b, ["parentId"]);
                        parentContextId = parentId ? this._contextId.split('/').slice(0, -1).join('/') : undefined;
                        updateMessage = __assign(__assign(__assign({}, descriptor), params), { parentContextId: parentContextId, messageTimestamp: dateModified, recordId: this._recordId });
                        // NOTE: The original Record's tags are copied to the update message, so that the tags are not lost.
                        // However if a user passes new tags in the `RecordUpdateParams` object, they will overwrite the original tags.
                        // If the updated tag object is empty or set to null, we remove the tags property to avoid schema validation errors in the DWN SDK.
                        if ((0, common_1.isEmptyObject)(updateMessage.tags) || updateMessage.tags === null) {
                            delete updateMessage.tags;
                        }
                        if (data !== undefined) {
                            // If `data` is being updated then `dataCid` and `dataSize` must be undefined and the `data`
                            // value must be converted to a Blob and later passed as a top-level property to
                            // `agent.processDwnRequest()`.
                            delete updateMessage.dataCid;
                            delete updateMessage.dataSize;
                            (dataBlob = (0, utils_js_1.dataToBlob)(data, updateMessage.dataFormat).dataBlob);
                        }
                        mutableDescriptorProperties = new Set(['data', 'dataCid', 'dataSize', 'datePublished', 'messageTimestamp', 'published', 'tags']);
                        Record.verifyPermittedMutation(Object.keys(params), mutableDescriptorProperties);
                        // If `published` is set to false, ensure that `datePublished` is undefined. Otherwise, DWN SDK's schema validation
                        // will throw an error if `published` is false but `datePublished` is set.
                        if (params.published === false && updateMessage.datePublished !== undefined) {
                            delete updateMessage.datePublished;
                        }
                        return [4 /*yield*/, this._agent.processDwnRequest({
                                author: this._connectedDid,
                                dataStream: dataBlob,
                                messageParams: __assign({}, updateMessage),
                                messageType: agent_1.DwnInterface.RecordsWrite,
                                target: this._connectedDid,
                            })];
                    case 1:
                        agentResponse = _c.sent();
                        message = agentResponse.message, status = agentResponse.reply.status;
                        responseMessage = message;
                        if (200 <= status.code && status.code <= 299) {
                            // copy the original raw message to the initial write before we update the values.
                            if (!this._initialWrite) {
                                // If there is no initial write, we need to create one from the current record state.
                                // We checked in the beginning of the function that the rawMessage is a RecordsWrite message.
                                this._initialWrite = __assign({}, this.rawMessage);
                            }
                            // Only update the local Record instance mutable properties if the record was successfully (over)written.
                            this._authorization = responseMessage.authorization;
                            this._protocolRole = params.protocolRole;
                            mutableDescriptorProperties.forEach(function (property) {
                                _this._descriptor[property] = responseMessage.descriptor[property];
                            });
                            // Cache data.
                            if (data !== undefined) {
                                this._encodedData = dataBlob;
                            }
                        }
                        return [2 /*return*/, { status: status }];
                }
            });
        });
    };
    /**
     * Delete the current record on the DWN.
     * @param params - Parameters to delete the record.
     * @returns the status of the delete request
     */
    Record.prototype.delete = function (deleteParams) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, store, signAsOwner, dateModified, params, deleteOptions, agentResponse, message, status;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = deleteParams || {}, store = _a.store, signAsOwner = _a.signAsOwner, dateModified = _a.dateModified, params = __rest(_a, ["store", "signAsOwner", "dateModified"]);
                        deleteOptions = {
                            messageType: agent_1.DwnInterface.RecordsDelete,
                            author: this._connectedDid,
                            target: this._connectedDid,
                            store: store,
                            signAsOwner: signAsOwner
                        };
                        if (this.deleted) {
                            if (!this._initialWrite) {
                                // if the rawMessage is a `RecordsDelete` the initial message must be set.
                                // this should never happen, but we check as a form of defensive programming.
                                throw new Error('If initial write is not set, the current rawRecord must be a RecordsWrite message.');
                            }
                            // if we have a delete message we can just use it
                            deleteOptions.rawMessage = this.rawMessage;
                        }
                        else {
                            // otherwise we construct a delete message given the `RecordDeleteParams`
                            deleteOptions.messageParams = __assign(__assign({}, params), { recordId: this._recordId, messageTimestamp: dateModified });
                        }
                        return [4 /*yield*/, this._agent.processDwnRequest(deleteOptions)];
                    case 1:
                        agentResponse = _b.sent();
                        message = agentResponse.message, status = agentResponse.reply.status;
                        if (status.code !== 202) {
                            // If the delete was not successful, return the status.
                            return [2 /*return*/, { status: status }];
                        }
                        if (!this._initialWrite) {
                            // If there is no initial write, we need to create one from the current record state.
                            // We checked in the beginning of the function that the initialWrite is not set if the rawMessage is a RecordsDelete message.
                            // So we can safely assume that the rawMessage is a RecordsWrite message.
                            this._initialWrite = __assign({}, this.rawMessage);
                        }
                        // If the delete was successful, update the Record author to the author of the delete message.
                        this._author = (0, agent_1.getRecordAuthor)(message);
                        this._descriptor = message.descriptor;
                        this._authorization = message.authorization;
                        // clear out properties that are not relevant for a deleted record
                        this._encodedData = undefined;
                        this._encryption = undefined;
                        this._attestation = undefined;
                        return [2 /*return*/, { status: status }];
                }
            });
        });
    };
    /**
     * Handles the various conditions around there being an initial write, whether to store initial/current state,
     * and whether to add an owner signature to the initial write to enable storage when protocol rules require it.
     */
    Record.prototype.processRecord = function (_a) {
        var store = _a.store, signAsOwner = _a.signAsOwner;
        return __awaiter(this, void 0, void 0, function () {
            var initialWriteRequest, agentResponse_1, message_1, status_1, responseMessage_1, requestOptions, agentResponse, message, status, responseMessage;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this._initialWrite && ((signAsOwner && !this._initialWriteSigned) || (store && !this._initialWriteStored)))) return [3 /*break*/, 2];
                        initialWriteRequest = {
                            messageType: agent_1.DwnInterface.RecordsWrite,
                            rawMessage: this.initialWrite,
                            author: this._connectedDid,
                            target: this._connectedDid,
                            signAsOwner: signAsOwner,
                            store: store,
                        };
                        return [4 /*yield*/, this._agent.processDwnRequest(initialWriteRequest)];
                    case 1:
                        agentResponse_1 = _c.sent();
                        message_1 = agentResponse_1.message, status_1 = agentResponse_1.reply.status;
                        responseMessage_1 = message_1;
                        // If we are signing as owner, make sure to update the initial write's authorization, because now it will have the owner's signature on it
                        // set the stored or signed status to true so we don't process it again.
                        if (200 <= status_1.code && status_1.code <= 299) {
                            if (store)
                                this._initialWriteStored = true;
                            if (signAsOwner) {
                                this._initialWriteSigned = true;
                                this.initialWrite.authorization = responseMessage_1.authorization;
                            }
                        }
                        _c.label = 2;
                    case 2:
                        if (!this.deleted) return [3 /*break*/, 3];
                        requestOptions = {
                            messageType: agent_1.DwnInterface.RecordsDelete,
                            rawMessage: this.rawMessage,
                            author: this._connectedDid,
                            target: this._connectedDid,
                            signAsOwner: signAsOwner,
                            store: store,
                        };
                        return [3 /*break*/, 5];
                    case 3:
                        _b = {
                            messageType: agent_1.DwnInterface.RecordsWrite,
                            rawMessage: this.rawMessage,
                            author: this._connectedDid,
                            target: this._connectedDid
                        };
                        return [4 /*yield*/, this.data.blob()];
                    case 4:
                        requestOptions = (_b.dataStream = _c.sent(),
                            _b.signAsOwner = signAsOwner,
                            _b.store = store,
                            _b);
                        _c.label = 5;
                    case 5: return [4 /*yield*/, this._agent.processDwnRequest(requestOptions)];
                    case 6:
                        agentResponse = _c.sent();
                        message = agentResponse.message, status = agentResponse.reply.status;
                        responseMessage = message;
                        if (200 <= status.code && status.code <= 299) {
                            // If we are signing as the owner, make sure to update the current record state's authorization, because now it will have the owner's signature on it.
                            if (signAsOwner)
                                this._authorization = responseMessage.authorization;
                        }
                        return [2 /*return*/, { status: status }];
                }
            });
        });
    };
    /**
     * Fetches the record's data from the specified DWN.
     *
     * This private method is called when the record data is not available in-memory
     * and needs to be fetched from either a local or a remote DWN.
     * It makes a read request to the specified DWN and processes the response to provide
     * a Node.js `Readable` stream of the record's data.
     *
     * @param params - Parameters for fetching the record's data.
     * @param params.target - The DID of the DWN to fetch the data from.
     * @param params.isRemote - Indicates whether the target DWN is a remote node.
     * @returns A Promise that resolves to a Node.js `Readable` stream of the record's data.
     * @throws If there is an error while fetching or processing the data from the DWN.
     *
     * @beta
     */
    Record.prototype.readRecordData = function (_a) {
        var target = _a.target, isRemote = _a.isRemote;
        return __awaiter(this, void 0, void 0, function () {
            var readRequest, agentResponsePromise, status_2, record, dataStream, nodeReadable, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        readRequest = {
                            author: this._connectedDid,
                            messageParams: { filter: { recordId: this.id } },
                            messageType: agent_1.DwnInterface.RecordsRead,
                            target: target,
                        };
                        agentResponsePromise = isRemote ?
                            this._agent.sendDwnRequest(readRequest) :
                            this._agent.processDwnRequest(readRequest);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, agentResponsePromise];
                    case 2:
                        status_2 = (_b = (_c.sent()).reply, _b.status), record = _b.record;
                        if (status_2.code !== 200) {
                            throw new Error("".concat(status_2.code, ": ").concat(status_2.detail));
                        }
                        dataStream = record.data;
                        nodeReadable = common_1.Stream.isReadableStream(dataStream) ?
                            common_1.NodeStream.fromWebReadable({ readableStream: dataStream }) :
                            dataStream;
                        return [2 /*return*/, nodeReadable];
                    case 3:
                        error_1 = _c.sent();
                        throw new Error("Error encountered while attempting to read data: ".concat(error_1.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifies if the properties to be mutated are mutable.
     *
     * This private method is used to ensure that only mutable properties of the `Record` instance
     * are being changed. It checks whether the properties specified for mutation are among the
     * set of properties that are allowed to be modified. If any of the properties to be mutated
     * are not in the set of mutable properties, the method throws an error.
     *
     * @param propertiesToMutate - An iterable of property names that are intended to be mutated.
     * @param mutableDescriptorProperties - A set of property names that are allowed to be mutated.
     *
     * @throws If any of the properties in `propertiesToMutate` are not in `mutableDescriptorProperties`.
     *
     * @beta
     */
    Record.verifyPermittedMutation = function (propertiesToMutate, mutableDescriptorProperties) {
        var e_1, _a;
        try {
            for (var propertiesToMutate_1 = __values(propertiesToMutate), propertiesToMutate_1_1 = propertiesToMutate_1.next(); !propertiesToMutate_1_1.done; propertiesToMutate_1_1 = propertiesToMutate_1.next()) {
                var property = propertiesToMutate_1_1.value;
                if (!mutableDescriptorProperties.has(property)) {
                    throw new Error("".concat(property, " is an immutable property. Its value cannot be changed."));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (propertiesToMutate_1_1 && !propertiesToMutate_1_1.done && (_a = propertiesToMutate_1.return)) _a.call(propertiesToMutate_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * Cache to minimize the amount of redundant two-phase commits we do in store() and send()
     * Retains awareness of the last 100 records stored/sent for up to 100 target DIDs each.
     */
    Record._sendCache = utils_js_1.SendCache;
    return Record;
}());
//# sourceMappingURL=record.js.map