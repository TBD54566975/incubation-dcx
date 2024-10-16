var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
import { isEmptyObject } from '@web5/common';
import { DwnInterface, getRecordAuthor } from '@web5/agent';
import { Record } from './record.js';
import { dataToBlob } from './utils.js';
import { Protocol } from './protocol.js';
/**
 * Interface to interact with DWN Records and Protocols
 */
export class DwnApi {
    constructor(options) {
        this.agent = options.agent;
        this.connectedDid = options.connectedDid;
    }
    /**
     * API to interact with DWN protocols (e.g., `dwn.protocols.configure()`).
     */
    get protocols() {
        return {
            /**
             * Configure method, used to setup a new protocol (or update) with the passed definitions
             */
            configure: (request) => __awaiter(this, void 0, void 0, function* () {
                const agentResponse = yield this.agent.processDwnRequest({
                    author: this.connectedDid,
                    messageParams: request.message,
                    messageType: DwnInterface.ProtocolsConfigure,
                    target: this.connectedDid
                });
                const { message, messageCid, reply: { status } } = agentResponse;
                const response = { status };
                if (status.code < 300) {
                    const metadata = { author: this.connectedDid, messageCid };
                    response.protocol = new Protocol(this.agent, message, metadata);
                }
                return response;
            }),
            /**
             * Query the available protocols
             */
            query: (request) => __awaiter(this, void 0, void 0, function* () {
                const agentRequest = {
                    author: this.connectedDid,
                    messageParams: request.message,
                    messageType: DwnInterface.ProtocolsQuery,
                    target: request.from || this.connectedDid
                };
                let agentResponse;
                if (request.from) {
                    agentResponse = yield this.agent.sendDwnRequest(agentRequest);
                }
                else {
                    agentResponse = yield this.agent.processDwnRequest(agentRequest);
                }
                const reply = agentResponse.reply;
                const { entries = [], status } = reply;
                const protocols = entries.map((entry) => {
                    const metadata = { author: this.connectedDid };
                    return new Protocol(this.agent, entry, metadata);
                });
                return { protocols, status };
            })
        };
    }
    /**
     * API to interact with DWN records (e.g., `dwn.records.create()`).
     */
    get records() {
        return {
            /**
             * Alias for the `write` method
             */
            create: (request) => __awaiter(this, void 0, void 0, function* () {
                return this.records.write(request);
            }),
            /**
             * Write a record based on an existing one (useful for updating an existing record)
             */
            createFrom: (request) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const _b = request.record.toJSON(), { author: inheritedAuthor } = _b, inheritedProperties = __rest(_b, ["author"]);
                // If `data` is being updated then `dataCid` and `dataSize` must not be present.
                if (request.data !== undefined) {
                    delete inheritedProperties.dataCid;
                    delete inheritedProperties.dataSize;
                }
                // If `published` is set to false, ensure that `datePublished` is undefined. Otherwise, DWN SDK's schema validation
                // will throw an error if `published` is false but `datePublished` is set.
                if (((_a = request.message) === null || _a === void 0 ? void 0 : _a.published) === false && inheritedProperties.datePublished !== undefined) {
                    delete inheritedProperties.datePublished;
                    delete inheritedProperties.published;
                }
                // If the request changes the `author` or message `descriptor` then the deterministic `recordId` will change.
                // As a result, we will discard the `recordId` if either of these changes occur.
                if (!isEmptyObject(request.message) || (request.author && request.author !== inheritedAuthor)) {
                    delete inheritedProperties.recordId;
                }
                return this.records.write({
                    data: request.data,
                    message: Object.assign(Object.assign({}, inheritedProperties), request.message),
                });
            }),
            /**
             * Delete a record
             */
            delete: (request) => __awaiter(this, void 0, void 0, function* () {
                const agentRequest = {
                    /**
                     * The `author` is the DID that will sign the message and must be the DID the Web5 app is
                     * connected with and is authorized to access the signing private key of.
                     */
                    author: this.connectedDid,
                    messageParams: request.message,
                    messageType: DwnInterface.RecordsDelete,
                    /**
                     * The `target` is the DID of the DWN tenant under which the delete will be executed.
                     * If `from` is provided, the delete operation will be executed on a remote DWN.
                     * Otherwise, the record will be deleted on the local DWN.
                     */
                    target: request.from || this.connectedDid
                };
                let agentResponse;
                if (request.from) {
                    agentResponse = yield this.agent.sendDwnRequest(agentRequest);
                }
                else {
                    agentResponse = yield this.agent.processDwnRequest(agentRequest);
                }
                const { reply: { status } } = agentResponse;
                return { status };
            }),
            /**
             * Query a single or multiple records based on the given filter
             */
            query: (request) => __awaiter(this, void 0, void 0, function* () {
                const agentRequest = {
                    /**
                     * The `author` is the DID that will sign the message and must be the DID the Web5 app is
                     * connected with and is authorized to access the signing private key of.
                     */
                    author: this.connectedDid,
                    messageParams: request.message,
                    messageType: DwnInterface.RecordsQuery,
                    /**
                     * The `target` is the DID of the DWN tenant under which the query will be executed.
                     * If `from` is provided, the query operation will be executed on a remote DWN.
                     * Otherwise, the local DWN will be queried.
                     */
                    target: request.from || this.connectedDid
                };
                let agentResponse;
                if (request.from) {
                    agentResponse = yield this.agent.sendDwnRequest(agentRequest);
                }
                else {
                    agentResponse = yield this.agent.processDwnRequest(agentRequest);
                }
                const reply = agentResponse.reply;
                const { entries, status, cursor } = reply;
                const records = entries.map((entry) => {
                    const recordOptions = Object.assign({ 
                        /**
                         * Extract the `author` DID from the record entry since records may be signed by the
                         * tenant owner or any other entity.
                         */
                        author: getRecordAuthor(entry), 
                        /**
                         * Set the `connectedDid` to currently connected DID so that subsequent calls to
                         * {@link Record} instance methods, such as `record.update()` are executed on the
                         * local DWN even if the record was returned by a query of a remote DWN.
                         */
                        connectedDid: this.connectedDid, 
                        /**
                         * If the record was returned by a query of a remote DWN, set the `remoteOrigin` to
                         * the DID of the DWN that returned the record. The `remoteOrigin` property will be used
                         * to determine which DWN to send subsequent read requests to in the event the data
                         * payload exceeds the threshold for being returned with queries.
                         */
                        remoteOrigin: request.from }, entry);
                    const record = new Record(this.agent, recordOptions);
                    return record;
                });
                return { records, status, cursor };
            }),
            /**
             * Read a single record based on the given filter
             */
            read: (request) => __awaiter(this, void 0, void 0, function* () {
                const agentRequest = {
                    /**
                     * The `author` is the DID that will sign the message and must be the DID the Web5 app is
                     * connected with and is authorized to access the signing private key of.
                     */
                    author: this.connectedDid,
                    messageParams: request.message,
                    messageType: DwnInterface.RecordsRead,
                    /**
                     * The `target` is the DID of the DWN tenant under which the read will be executed.
                     * If `from` is provided, the read operation will be executed on a remote DWN.
                     * Otherwise, the read will occur on the local DWN.
                     */
                    target: request.from || this.connectedDid
                };
                let agentResponse;
                if (request.from) {
                    agentResponse = yield this.agent.sendDwnRequest(agentRequest);
                }
                else {
                    agentResponse = yield this.agent.processDwnRequest(agentRequest);
                }
                const { reply: { record: responseRecord, status } } = agentResponse;
                let record;
                if (200 <= status.code && status.code <= 299) {
                    const recordOptions = Object.assign({ 
                        /**
                         * Extract the `author` DID from the record since records may be signed by the
                         * tenant owner or any other entity.
                         */
                        author: getRecordAuthor(responseRecord), 
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
                    record = new Record(this.agent, recordOptions);
                }
                return { record, status };
            }),
            /**
             * Writes a record to the DWN
             *
             * As a convenience, the Record instance returned will cache a copy of the data.  This is done
             * to maintain consistency with other DWN methods, like RecordsQuery, that include relatively
             * small data payloads when returning RecordsWrite message properties. Regardless of data
             * size, methods such as `record.data.stream()` will return the data when called even if it
             * requires fetching from the DWN datastore.
             */
            write: (request) => __awaiter(this, void 0, void 0, function* () {
                var _c;
                const { dataBlob, dataFormat } = dataToBlob(request.data, (_c = request.message) === null || _c === void 0 ? void 0 : _c.dataFormat);
                const agentResponse = yield this.agent.processDwnRequest({
                    author: this.connectedDid,
                    dataStream: dataBlob,
                    messageParams: Object.assign(Object.assign({}, request.message), { dataFormat }),
                    messageType: DwnInterface.RecordsWrite,
                    store: request.store,
                    target: this.connectedDid
                });
                const { message: responseMessage, reply: { status } } = agentResponse;
                let record;
                if (200 <= status.code && status.code <= 299) {
                    const recordOptions = Object.assign({ 
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
                    record = new Record(this.agent, recordOptions);
                }
                return { record, status };
            }),
        };
    }
}
//# sourceMappingURL=dwn-api.js.map