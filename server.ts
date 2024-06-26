import server from './src/index';
import ATP_REPORT from './CUSTOM-MANIFEST.json';

const localProvider = {
    name: 'localhost',
    endpoint: 'http://localhost:3000',
    vc: { id: 'ATPReport', name: 'ATP Report' }
}

// server.useManifest(CustomManifest.id, CustomManifest);
server.use('manifests', 'ATP-REPORT', ATP_REPORT);

// server.useProvider('local', localProvider);
server.use('providers', 'local', localProvider);

// server.useIssuer('mx', { name: 'mx', did: 'did:web5:mx' });
server.use('issuers', 'mx', { name: 'mx', did: 'did:web5:mx' });

// server.useHandler('testHandler', () => console.log("test handler"));
server.use('handlers', 'testHandler', () => console.log("test handler"));

await server.start();

process.on('SIGTERM', () => {
    server.stop();
});
