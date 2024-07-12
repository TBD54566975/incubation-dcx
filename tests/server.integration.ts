import { server } from "../src/dcx/index.js";
import CustomManifest from "../CUSTOM-MANIFEST.json";

server.use('manifest', CustomManifest.id, CustomManifest);

server.use('provider', 'localhost',
    {
        method: 'POST',
        endpoint: 'http://localhost:4000/api/v1/vc/data'
    }
);

server.use('issuer', 'mx',
    {
        name: 'MX Technologies',
        id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'
    }
);

server.use('gateway', 'dev',
    {
        id: 'localhost',
        uri: 'http://localhost:8305'
    }
);

await server.start();

process.on('SIGTERM', () => {
    server.stop();
});