"use strict";
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
exports.Web5 = void 0;
var did_api_js_1 = require("./did-api.js");
var dwn_api_js_1 = require("./dwn-api.js");
var agent_1 = require("@web5/agent");
var vc_api_js_1 = require("./vc-api.js");
var user_agent_1 = require("@web5/user-agent");
/**
 * The main Web5 API interface. It manages the creation of a DID if needed, the connection to the
 * local DWN and all the web5 main foundational APIs such as VC, syncing, etc.
 */
var Web5 = /** @class */ (function () {
    function Web5(_a) {
        var agent = _a.agent, connectedDid = _a.connectedDid;
        this.agent = agent;
        this.connectedDid = connectedDid;
        this.did = new did_api_js_1.DidApi({ agent: agent, connectedDid: connectedDid });
        this.dwn = new dwn_api_js_1.DwnApi({ agent: agent, connectedDid: connectedDid });
        this.vc = new vc_api_js_1.VcApi({ agent: agent, connectedDid: connectedDid });
    }
    /**
     * Connects to a {@link Web5Agent}. Defaults to creating a local {@link Web5UserAgent} if one
     * isn't provided.
     *
     * @param options - Optional overrides that can be provided when calling {@link Web5.connect}.
     * @returns A promise that resolves to a {@link Web5} instance and the connected DID.
     */
    Web5.connect = function (_a) {
        var _b, _c, _d;
        var _e = _a === void 0 ? {} : _a, agent = _e.agent, agentVault = _e.agentVault, connectedDid = _e.connectedDid, password = _e.password, recoveryPhrase = _e.recoveryPhrase, sync = _e.sync, techPreview = _e.techPreview, didCreateOptions = _e.didCreateOptions, registration = _e.registration;
        return __awaiter(this, void 0, void 0, function () {
            var userAgent, notConnected, identity, identities, existingIdentityCount, serviceEndpointNodes, _f, _g, serviceEndpointNodes, serviceEndpointNodes_1, serviceEndpointNodes_1_1, dwnEndpoint, serverInfo, e_1_1, error_1, web5;
            var _h, e_1, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        if (!(agent === undefined)) return [3 /*break*/, 27];
                        return [4 /*yield*/, user_agent_1.Web5UserAgent.create({ agentVault: agentVault })];
                    case 1:
                        userAgent = _k.sent();
                        agent = userAgent;
                        // Warn the developer and application user of the security risks of using a static password.
                        if (password === undefined) {
                            password = 'insecure-static-phrase';
                            console.warn('%cSECURITY WARNING:%c ' +
                                'You have not set a password, which defaults to a static, guessable value. ' +
                                'This significantly compromises the security of your data. ' +
                                'Please configure a secure, unique password.', 'font-weight: bold; color: red;', 'font-weight: normal; color: inherit;');
                        }
                        return [4 /*yield*/, userAgent.firstLaunch()];
                    case 2:
                        if (!_k.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, userAgent.initialize({ password: password, recoveryPhrase: recoveryPhrase })];
                    case 3:
                        recoveryPhrase = _k.sent();
                        _k.label = 4;
                    case 4: return [4 /*yield*/, userAgent.start({ password: password })];
                    case 5:
                        _k.sent();
                        notConnected = true;
                        if (!notConnected) return [3 /*break*/, 12];
                        identity = void 0;
                        return [4 /*yield*/, userAgent.identity.list()];
                    case 6:
                        identities = _k.sent();
                        existingIdentityCount = identities.length;
                        if (!(existingIdentityCount === 0)) return [3 /*break*/, 10];
                        serviceEndpointNodes = (_c = (_b = techPreview === null || techPreview === void 0 ? void 0 : techPreview.dwnEndpoints) !== null && _b !== void 0 ? _b : didCreateOptions === null || didCreateOptions === void 0 ? void 0 : didCreateOptions.dwnEndpoints) !== null && _c !== void 0 ? _c : ['https://dwn.tbddev.org/beta'];
                        return [4 /*yield*/, userAgent.identity.create({
                                didMethod: 'dht',
                                metadata: { name: 'Default' },
                                didOptions: {
                                    services: [
                                        {
                                            id: 'dwn',
                                            type: 'DecentralizedWebNode',
                                            serviceEndpoint: serviceEndpointNodes,
                                            enc: '#enc',
                                            sig: '#sig',
                                        }
                                    ],
                                    verificationMethods: [
                                        {
                                            algorithm: 'Ed25519',
                                            id: 'sig',
                                            purposes: ['assertionMethod', 'authentication']
                                        },
                                        {
                                            algorithm: 'secp256k1',
                                            id: 'enc',
                                            purposes: ['keyAgreement']
                                        }
                                    ]
                                }
                            })];
                    case 7:
                        // Generate a new Identity for the end-user.
                        identity = _k.sent();
                        _g = (_f = userAgent.identity).manage;
                        _h = {};
                        return [4 /*yield*/, identity.export()];
                    case 8: 
                    // The User Agent will manage the Identity, which ensures it will be available on future
                    // sessions.
                    return [4 /*yield*/, _g.apply(_f, [(_h.portableIdentity = _k.sent(), _h)])];
                    case 9:
                        // The User Agent will manage the Identity, which ensures it will be available on future
                        // sessions.
                        _k.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        if (existingIdentityCount === 1) {
                            // An existing identity was found in the User Agent's tenant.
                            identity = identities[0];
                        }
                        else {
                            throw new Error("connect() failed due to unexpected state: Expected 1 but found ".concat(existingIdentityCount, " stored identities."));
                        }
                        _k.label = 11;
                    case 11:
                        // Set the stored identity as the connected DID.
                        connectedDid = identity.did.uri;
                        _k.label = 12;
                    case 12:
                        if (!(registration !== undefined)) return [3 /*break*/, 25];
                        serviceEndpointNodes = (_d = techPreview === null || techPreview === void 0 ? void 0 : techPreview.dwnEndpoints) !== null && _d !== void 0 ? _d : didCreateOptions === null || didCreateOptions === void 0 ? void 0 : didCreateOptions.dwnEndpoints;
                        _k.label = 13;
                    case 13:
                        _k.trys.push([13, 24, , 25]);
                        _k.label = 14;
                    case 14:
                        _k.trys.push([14, 21, 22, 23]);
                        serviceEndpointNodes_1 = __values(serviceEndpointNodes), serviceEndpointNodes_1_1 = serviceEndpointNodes_1.next();
                        _k.label = 15;
                    case 15:
                        if (!!serviceEndpointNodes_1_1.done) return [3 /*break*/, 20];
                        dwnEndpoint = serviceEndpointNodes_1_1.value;
                        return [4 /*yield*/, userAgent.rpc.getServerInfo(dwnEndpoint)];
                    case 16:
                        serverInfo = _k.sent();
                        if (serverInfo.registrationRequirements.length === 0) {
                            // no registration required
                            return [3 /*break*/, 19];
                        }
                        // register the agent DID
                        return [4 /*yield*/, agent_1.DwnRegistrar.registerTenant(dwnEndpoint, agent.agentDid.uri)];
                    case 17:
                        // register the agent DID
                        _k.sent();
                        // register the connected Identity DID
                        return [4 /*yield*/, agent_1.DwnRegistrar.registerTenant(dwnEndpoint, connectedDid)];
                    case 18:
                        // register the connected Identity DID
                        _k.sent();
                        _k.label = 19;
                    case 19:
                        serviceEndpointNodes_1_1 = serviceEndpointNodes_1.next();
                        return [3 /*break*/, 15];
                    case 20: return [3 /*break*/, 23];
                    case 21:
                        e_1_1 = _k.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 23];
                    case 22:
                        try {
                            if (serviceEndpointNodes_1_1 && !serviceEndpointNodes_1_1.done && (_j = serviceEndpointNodes_1.return)) _j.call(serviceEndpointNodes_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 23:
                        // If no failures occurred, call the onSuccess callback
                        registration.onSuccess();
                        return [3 /*break*/, 25];
                    case 24:
                        error_1 = _k.sent();
                        // for any failure, call the onFailure callback with the error
                        registration.onFailure(error_1);
                        return [3 /*break*/, 25];
                    case 25:
                        if (!(sync !== 'off')) return [3 /*break*/, 27];
                        // First, register the user identity for sync.
                        return [4 /*yield*/, userAgent.sync.registerIdentity({ did: connectedDid })];
                    case 26:
                        // First, register the user identity for sync.
                        _k.sent();
                        // Enable sync using the specified interval or default.
                        sync !== null && sync !== void 0 ? sync : (sync = '2m');
                        userAgent.sync.startSync({ interval: sync })
                            .catch(function (error) {
                            console.error("Sync failed: ".concat(error));
                        });
                        _k.label = 27;
                    case 27:
                        web5 = new Web5({ agent: agent, connectedDid: connectedDid });
                        return [2 /*return*/, { web5: web5, did: connectedDid, recoveryPhrase: recoveryPhrase }];
                }
            });
        });
    };
    return Web5;
}());
exports.Web5 = Web5;
//# sourceMappingURL=web5.js.map