import { server } from '../src/dcx/index.js';
import CustomManifest from '../CUSTOM-MANIFEST.json';

server.use('manifest', CustomManifest);

server.use('provider', { method: 'POST', endpoint: 'http://localhost:4000/api/v1/vc/data' });

// const requestCredentialCustom = () => console.log('custom requestCredential handler');
// server.use('handler', { id: 'requestCredential', requestCredentialCustom });

await server.start();

process.on('SIGTERM', () => {
  server.stop();
});
