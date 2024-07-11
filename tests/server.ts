import DcxServer from "../src";
const server = new DcxServer({
    issuers: new Map([['issuer1', { name: 'issuer1', id: 'did:dht:issuer123xyz' }]]),
    manifests: new Map([/* Define your custom manifests */]),
    providers: new Map([/* Define your custom providers */]),
    handlers: new Map([/* Define your custom handlers */]),
    gateways: new Map([/* Define your custom gateways */])
});
await server.start();