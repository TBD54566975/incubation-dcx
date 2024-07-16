import { server } from "../src/dcx/index.js";
import CustomManifest from "../CUSTOM-MANIFEST.json";

server.use('manifest', CustomManifest, CustomManifest.id);

server.use('provider', { method: 'POST', endpoint: 'http://localhost:4000/api/v1/vc/data' }, 'development');

server.use('issuer', { name: 'MX Technologies', id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo' }, 'development');

// server.use('gateway', ['']);

// server.use('dwn', ['']);

await server.start();

process.on('SIGTERM', () => {
    server.stop();
});