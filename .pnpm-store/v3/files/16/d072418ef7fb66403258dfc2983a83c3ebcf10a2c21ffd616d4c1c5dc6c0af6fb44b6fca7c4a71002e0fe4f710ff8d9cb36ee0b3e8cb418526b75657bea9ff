var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DidApi } from './did-api.js';
import { DwnApi } from './dwn-api.js';
import { DwnRegistrar } from '@web5/agent';
import { VcApi } from './vc-api.js';
import { Web5UserAgent } from '@web5/user-agent';
/**
 * The main Web5 API interface. It manages the creation of a DID if needed, the connection to the
 * local DWN and all the web5 main foundational APIs such as VC, syncing, etc.
 */
export class Web5 {
    constructor({ agent, connectedDid }) {
        this.agent = agent;
        this.connectedDid = connectedDid;
        this.did = new DidApi({ agent, connectedDid });
        this.dwn = new DwnApi({ agent, connectedDid });
        this.vc = new VcApi({ agent, connectedDid });
    }
    /**
     * Connects to a {@link Web5Agent}. Defaults to creating a local {@link Web5UserAgent} if one
     * isn't provided.
     *
     * @param options - Optional overrides that can be provided when calling {@link Web5.connect}.
     * @returns A promise that resolves to a {@link Web5} instance and the connected DID.
     */
    static connect({ agent, agentVault, connectedDid, password, recoveryPhrase, sync, techPreview, didCreateOptions, registration } = {}) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (agent === undefined) {
                // A custom Web5Agent implementation was not specified, so use default managed user agent.
                const userAgent = yield Web5UserAgent.create({ agentVault });
                agent = userAgent;
                // Warn the developer and application user of the security risks of using a static password.
                if (password === undefined) {
                    password = 'insecure-static-phrase';
                    console.warn('%cSECURITY WARNING:%c ' +
                        'You have not set a password, which defaults to a static, guessable value. ' +
                        'This significantly compromises the security of your data. ' +
                        'Please configure a secure, unique password.', 'font-weight: bold; color: red;', 'font-weight: normal; color: inherit;');
                }
                // Initialize, if necessary, and start the agent.
                if (yield userAgent.firstLaunch()) {
                    recoveryPhrase = yield userAgent.initialize({ password, recoveryPhrase });
                }
                yield userAgent.start({ password });
                // TODO: Replace stubbed connection attempt once Connect Protocol has been implemented.
                // Attempt to Connect to localhost agent or via Connect Server.
                // userAgent.connect();
                const notConnected = true;
                if ( /* !userAgent.isConnected() */notConnected) {
                    // Connect attempt failed or was rejected so fallback to local user agent.
                    let identity;
                    // Query the Agent's DWN tenant for identity records.
                    const identities = yield userAgent.identity.list();
                    // If an existing identity is not found found, create a new one.
                    const existingIdentityCount = identities.length;
                    if (existingIdentityCount === 0) {
                        // Use the specified DWN endpoints or the latest TBD hosted DWN
                        const serviceEndpointNodes = (_b = (_a = techPreview === null || techPreview === void 0 ? void 0 : techPreview.dwnEndpoints) !== null && _a !== void 0 ? _a : didCreateOptions === null || didCreateOptions === void 0 ? void 0 : didCreateOptions.dwnEndpoints) !== null && _b !== void 0 ? _b : ['https://dwn.tbddev.org/beta'];
                        // Generate a new Identity for the end-user.
                        identity = yield userAgent.identity.create({
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
                        });
                        // The User Agent will manage the Identity, which ensures it will be available on future
                        // sessions.
                        yield userAgent.identity.manage({ portableIdentity: yield identity.export() });
                    }
                    else if (existingIdentityCount === 1) {
                        // An existing identity was found in the User Agent's tenant.
                        identity = identities[0];
                    }
                    else {
                        throw new Error(`connect() failed due to unexpected state: Expected 1 but found ${existingIdentityCount} stored identities.`);
                    }
                    // Set the stored identity as the connected DID.
                    connectedDid = identity.did.uri;
                }
                if (registration !== undefined) {
                    // If a registration object is passed, we attempt to register the AgentDID and the ConnectedDID with the DWN endpoints provided
                    const serviceEndpointNodes = (_c = techPreview === null || techPreview === void 0 ? void 0 : techPreview.dwnEndpoints) !== null && _c !== void 0 ? _c : didCreateOptions === null || didCreateOptions === void 0 ? void 0 : didCreateOptions.dwnEndpoints;
                    try {
                        for (const dwnEndpoint of serviceEndpointNodes) {
                            // check if endpoint needs registration
                            const serverInfo = yield userAgent.rpc.getServerInfo(dwnEndpoint);
                            if (serverInfo.registrationRequirements.length === 0) {
                                // no registration required
                                continue;
                            }
                            // register the agent DID
                            yield DwnRegistrar.registerTenant(dwnEndpoint, agent.agentDid.uri);
                            // register the connected Identity DID
                            yield DwnRegistrar.registerTenant(dwnEndpoint, connectedDid);
                        }
                        // If no failures occurred, call the onSuccess callback
                        registration.onSuccess();
                    }
                    catch (error) {
                        // for any failure, call the onFailure callback with the error
                        registration.onFailure(error);
                    }
                }
                // Enable sync, unless explicitly disabled.
                if (sync !== 'off') {
                    // First, register the user identity for sync.
                    yield userAgent.sync.registerIdentity({ did: connectedDid });
                    // Enable sync using the specified interval or default.
                    sync !== null && sync !== void 0 ? sync : (sync = '2m');
                    userAgent.sync.startSync({ interval: sync })
                        .catch((error) => {
                        console.error(`Sync failed: ${error}`);
                    });
                }
            }
            const web5 = new Web5({ agent, connectedDid });
            return { web5, did: connectedDid, recoveryPhrase };
        });
    }
}
//# sourceMappingURL=web5.js.map