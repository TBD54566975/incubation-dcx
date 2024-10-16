"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DwnApi = void 0;
var common_1 = require("@web5/common");
var agent_1 = require("@web5/agent");
var record_js_1 = require("./record.js");
var utils_js_1 = require("./utils.js");
var protocol_js_1 = require("./protocol.js");
/**
 * Interface to interact with DWN Records and Protocols
 */
var DwnApi = /** @class */ (function () {
    function DwnApi(options) {
        this.agent = options.agent;
        this.connectedDid = options.connectedDid;
    }
    Object.defineProperty(DwnApi.prototype, "protocols", {
        /**
         * API to interact with DWN protocols (e.g., `dwn.protocols.configure()`).
         */
        get: function () {
            var _this = this;
            return {
                /**
                 * Configure method, used to setup a new protocol (or update) with the passed definitions
                 */
                configure: function (request) { return __awaiter(_this, void 0, void 0, function () {
                    var agentResponse, message, messageCid, status, response, metadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.agent.processDwnRequest({
                                    author: this.connectedDid,
                                    messageParams: request.message,
                                    messageType: agent_1.DwnInterface.ProtocolsConfigure,
                                    target: this.connectedDid
                                })];
                            case 1:
                                agentResponse = _a.sent();
                                message = agentResponse.message, messageCid = agentResponse.messageCid, status = agentResponse.reply.status;
                                response = { status: status };
                                if (status.code < 300) {
                                    metadata = { author: this.connectedDid, messageCid: messageCid };
                                    response.protocol = new protocol_js_1.Protocol(this.agent, message, metadata);
                                }
                                return [2 /*return*/, response];
                        }
                    });
                }); },
                /**
                 * Query the available protocols
                 */
                query: function (request) { return __awaiter(_this, void 0, void 0, function () {
                    var agentRequest, agentResponse, reply, _a, entries, status, protocols;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                agentRequest = {
                                    author: this.connectedDid,
                                    messageParams: request.message,
                                    messageType: agent_1.DwnInterface.ProtocolsQuery,
                                    target: request.from || this.connectedDid
                                };
                                if (!request.from) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.agent.sendDwnRequest(agentRequest)];
                            case 1:
                                agentResponse = _b.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, this.agent.processDwnRequest(agentRequest)];
                            case 3:
                                agentResponse = _b.sent();
                                _b.label = 4;
                            case 4:
                                reply = agentResponse.reply;
                                _a = reply.entries, entries = _a === void 0 ? [] : _a, status = reply.status;
                                protocols = entries.map(function (entry) {
                                    var metadata = { author: _this.connectedDid };
                                    return new protocol_js_1.Protocol(_this.agent, entry, metadata);
                                });
                                return [2 /*return*/, { protocols: protocols, status: status }];
                        }
                    });
                }); }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DwnApi.prototype, "records", {
        /**
         * API to interact with DWN records (e.g., `dwn.records.create()`).
         */
        get: function () {
            var _this = this;
            return {
                /**
                 * Alias for the `write` method
                 */
                create: function (request) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.records.write(request)];
                    });
                }); },
                /**
                 * Write a record based on an existing one (useful for updating an existing record)
                 */
                createFrom: function (request) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, inheritedAuthor, inheritedProperties;
                    var _b;
                    return __generator(this, function (_c) {
                        _a = request.record.toJSON(), inheritedAuthor = _a.author, inheritedProperties = __rest(_a, ["author"]);
                        // If `data` is being updated then `dataCid` and `dataSize` must not be present.
                        if (request.data !== undefined) {
                            delete inheritedProperties.dataCid;
                            delete inheritedProperties.dataSize;
                        }
                        // If `published` is set to false, ensure that `datePublished` is undefined. Otherwise, DWN SDK's schema validation
                        // will throw an error if `published` is false but `datePublished` is set.
                        if (((_b = request.message) === null || _b === void 0 ? void 0 : _b.published) === false && inheritedProperties.datePublished !== undefined) {
                            delete inheritedProperties.datePublished;
                            delete inheritedProperties.published;
                        }
                        // If the request changes the `author` or message `descriptor` then the deterministic `recordId` will change.
                        // As a result, we will discard the `recordId` if either of these changes occur.
                        if (!(0, common_1.isEmptyObject)(request.message) || (request.author && request.author !== inheritedAuthor)) {
                            delete inheritedProperties.recordId;
                        }
                        return [2 /*return*/, this.records.write({
                                data: request.data,
                                message: __assign(__assign({}, inheritedProperties), request.message),
                            })];
                    });
                }); },
                /**
                 * Delete a record
                 */
                delete: function (request) { return __awaiter(_this, void 0, void 0, function () {
                    var agentRequest, agentResponse, status;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                agentRequest = {
                                    /**
                                     * The `author` is the DID that will sign the message and must be the DID the Web5 app is
                                     * connected with and is authorized to access the signing private key of.
                                     */
                                    author: this.connectedDid,
                                    messageParams: request.message,
                                    messageType: agent_1.DwnInterface.RecordsDelete,
                                    /**
                                     * The `target` is the DID of the DWN tenant under which the delete will be executed.
                                     * If `from` is provided, the delete operation will be executed on a remote DWN.
                                     * Otherwise, the record will be deleted on the local DWN.
                                     */
                                    target: request.from || this.connectedDid
                                };
                                if (!request.from) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.agent.sendDwnRequest(agentRequest)];
                            case 1:
                                agentResponse = _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, this.agent.processDwnRequest(agentRequest)];
                            case 3:
                                agentResponse = _a.sent();
                                _a.label = 4;
                            case 4:
                                status = agentResponse.reply.status;
                                return [2 /*return*/, { status: status }];
                        }
                    });
                }); },
                /**
                 * Query a single or multiple records based on the given filter
                 */
                query: function (request) { return __awaiter(_this, void 0, void 0, function () {
                    var agentRequest, agentResponse, reply, entries, status, cursor, records;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                agentRequest = {
                                    /**
                                     * The `author` is the DID that will sign the message and must be the DID the Web5 app is
                                     * connected with and is authorized to access the signing private key of.
                                     */
                                    author: this.connectedDid,
                                    messageParams: request.message,
                                    messageType: agent_1.DwnInterface.RecordsQuery,
                                    /**
                                     * The `target` is the DID of the DWN tenant under which the query will be executed.
                                     * If `from` is provided, the query operation will be executed on a remote DWN.
                                     * Otherwise, the local DWN will be queried.
                                     */
                                    target: request.from || this.connectedDid
                                };
                                if (!request.from) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.agent.sendDwnRequest(agentRequest)];
                            case 1:
                                agentResponse = _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, this.agent.processDwnRequest(agentRequest)];
                            case 3:
                                agentResponse = _a.sent();
                                _a.label = 4;
                            case 4:
                                reply = agentResponse.reply;
                                entries = reply.entries, status = reply.status, cursor = reply.cursor;
                                records = entries.map(function (entry) {
                                    var recordOptions = __assign({ 
                                        /**
                                         * Extract the `author` DID from the record entry since records may be signed by the
                                         * tenant owner or any other entity.
                                         */
                                        author: (0, agent_1.getRecordAuthor)(entry), 
                                        /**
                                         * Set the `connectedDid` to currently connected DID so that subsequent calls to
                                         * {@link Record} instance methods, such as `record.update()` are executed on the
                                         * local DWN even if the record was returned by a query of a remote DWN.
                                         */
                                        connectedDid: _this.connectedDid, 
                                        /**
                                         * If the record was returned by a query of a remote DWN, set the `remoteOrigin` to
                                         * the DID of the DWN that returned the record. The `remoteOrigin` property will be used
                                         * to determine which DWN to send subsequent read requests to in the event the data
                                         * payload exceeds the threshold for being returned with queries.
                                         */
                                        remoteOrigin: request.from }, entry);
                                    var record = new record_js_1.Record(_this.agent, recordOptions);
                                    return record;
                                });
                                return [2 /*return*/, { records: records, status: status, cursor: cursor }];
                        }
                    });
                }); },
                /**
                 * Read a single record based on the given filter
                 */
                read: function (request) { return __awaiter(_this, void 0, void 0, function () {
                    var agentRequest, agentResponse, _a, responseRecord, status, record, recordOptions;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                agentRequest = {
                                    /**
                                     * The `author` is the DID that will sign the message and must be the DID the Web5 app is
                                     * connected with and is authorized to access the signing private key of.
                                     */
                                    author: this.connectedDid,
                                    messageParams: request.message,
                                    messageType: agent_1.DwnInterface.RecordsRead,
                                    /**
                                     * The `target` is the DID of the DWN tenant under which the read will be executed.
                                     * If `from` is provided, the read operation will be executed on a remote DWN.
                                     * Otherwise, the read will occur on the local DWN.
                                     */
                                    target: request.from || this.connectedDid
                                };
                                if (!request.from) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.agent.sendDwnRequest(agentRequest)];
                            case 1:
                                agentResponse = _b.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, this.agent.processDwnRequest(agentRequest)];
                            case 3:
                                agentResponse = _b.sent();
                                _b.label = 4;
                            case 4:
                                _a = agentResponse.reply, responseRecord = _a.record, status = _a.status;
                                if (200 <= status.code && status.code <= 299) {
                                    recordOptions = __assign({ 
                                        /**
                                         * Extract the `author` DID from the record since records may be signed by the
                                         * tenant owner or any other entity.
                                         */
                                        author: (0, agent_1.getRecordAuthor)(responseRecord), 
                                        /**
                                         * Set the `connectedDid` to currently connected DID so that subsequent calls to
                                         * {@link Record} instance methods, such as `record.update()` are executed on the
                                         * local DWN even if the record was read from a remote DWN.
                                         */
                                        connectedDid: this.connectedDid, 
                                        /**
                                         * If the record was returned by reading from a remote DWN, set the `remoteOrigin` to
                                         * the DID of the DWN that returned the record. The `remoteOrigin` property will be used
                                         * to determine which DWN to send subsequent read requests to in the event the data
                                         * payload must be read again (e.g., if the data stream is consumed).
                                         */
                                        remoteOrigin: request.from }, responseRecord);
                                    record = new record_js_1.Record(this.agent, recordOptions);
                                }
                                return [2 /*return*/, { record: record, status: status }];
                        }
                    });
                }); },
                /**
                 * Writes a record to the DWN
                 *
                 * As a convenience, the Record instance returned will cache a copy of the data.  This is done
                 * to maintain consistency with other DWN methods, like RecordsQuery, that include relatively
                 * small data payloads when returning RecordsWrite message properties. Regardless of data
                 * size, methods such as `record.data.stream()` will return the data when called even if it
                 * requires fetching from the DWN datastore.
                 */
                write: function (request) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, dataBlob, dataFormat, agentResponse, responseMessage, status, record, recordOptions;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = (0, utils_js_1.dataToBlob)(request.data, (_b = request.message) === null || _b === void 0 ? void 0 : _b.dataFormat), dataBlob = _a.dataBlob, dataFormat = _a.dataFormat;
                                return [4 /*yield*/, this.agent.processDwnRequest({
                                        author: this.connectedDid,
                                        dataStream: dataBlob,
                                        messageParams: __assign(__assign({}, request.message), { dataFormat: dataFormat }),
                                        messageType: agent_1.DwnInterface.RecordsWrite,
                                        store: request.store,
                                        target: this.connectedDid
                                    })];
                            case 1:
                                agentResponse = _c.sent();
                                responseMessage = agentResponse.message, status = agentResponse.reply.status;
                                if (200 <= status.code && status.code <= 299) {
                                    recordOptions = __assign({ 
                                        /**
                                         * Assume the author is the connected DID since the record was just written to the
                                         * local DWN.
                                         */
                                        author: this.connectedDid, 
                                        /**
                                         * Set the `connectedDid` to currently connected DID so that subsequent calls to
                                         * {@link Record} instance methods, such as `record.update()` are executed on the
                                         * local DWN.
                                         */
                                        connectedDid: this.connectedDid, encodedData: dataBlob }, responseMessage);
                                    record = new record_js_1.Record(this.agent, recordOptions);
                                }
                                return [2 /*return*/, { record: record, status: status }];
                        }
                    });
                }); },
            };
        },
        enumerable: false,
        configurable: true
    });
    return DwnApi;
}());
exports.DwnApi = DwnApi;
//# sourceMappingURL=dwn-api.js.map