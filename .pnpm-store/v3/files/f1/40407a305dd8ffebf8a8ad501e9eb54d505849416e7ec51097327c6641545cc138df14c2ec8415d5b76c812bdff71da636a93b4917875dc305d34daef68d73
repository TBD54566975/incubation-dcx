"use strict";
/**
 * NOTE: Added reference types here to avoid a `pnpm` bug during build.
 * https://github.com/TBD54566975/web5-js/pull/507
 */
/// <reference types="@tbd54566975/dwn-sdk-js" />
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocol = void 0;
var agent_1 = require("@web5/agent");
/**
 * Encapsulates a DWN Protocol with its associated metadata and configuration.
 *
 * This class primarly exists to provide developers with a convenient way to configure/install
 * protocols on remote DWNs.
 */
var Protocol = /** @class */ (function () {
    /**
     * Constructs a new instance of the Protocol class.
     *
     * @param agent - The Web5Agent instance used for network interactions.
     * @param protocolsConfigureMessage - The configuration message containing the protocol details.
     * @param metadata - Metadata associated with the protocol, including the author and optional message CID.
     */
    function Protocol(agent, protocolsConfigureMessage, metadata) {
        this._agent = agent;
        this._metadata = metadata;
        this._protocolsConfigureMessage = protocolsConfigureMessage;
    }
    Object.defineProperty(Protocol.prototype, "definition", {
        /**
         * Retrieves the protocol definition from the protocol's configuration message.
         * @returns The protocol definition.
         */
        get: function () {
            return this._protocolsConfigureMessage.descriptor.definition;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Serializes the protocol's configuration message to JSON.
     * @returns The serialized JSON object of the protocol's configuration message.
     */
    Protocol.prototype.toJSON = function () {
        return this._protocolsConfigureMessage;
    };
    /**
     * Sends the protocol configuration to a remote DWN identified by the target DID.
     *
     * @param target - The DID of the target DWN to which the protocol configuration will be installed.
     * @returns A promise that resolves to an object containing the status of the send operation.
     */
    Protocol.prototype.send = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var reply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._agent.sendDwnRequest({
                            author: this._metadata.author,
                            messageCid: this._metadata.messageCid,
                            messageType: agent_1.DwnInterface.ProtocolsConfigure,
                            target: target,
                        })];
                    case 1:
                        reply = (_a.sent()).reply;
                        return [2 /*return*/, { status: reply.status }];
                }
            });
        });
    };
    return Protocol;
}());
exports.Protocol = Protocol;
//# sourceMappingURL=protocol.js.map