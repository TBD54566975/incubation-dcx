import server from './src/index';
import CustomManifest from './CUSTOM-MANIFEST.json';

server.useManifest('customManifest', CustomManifest);
server.useProvider('localhost', {
    name: 'localhost',
    endpoint: 'http://localhost:3000',
    vc: {
        id: 'ATPReport',
        name: 'ATP Report'
    }
})
server.useIssuer('mx', { name: 'mx', did: 'did:web5:mx' });
server.useHandler('testHandler', () => console.log("test handler"));

await server.start();

process.on('SIGTERM', () => {
    server.stop();
});
