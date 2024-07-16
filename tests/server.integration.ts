import DcxServer from '../src/dcx/index.js';
import CustomManifest from '../CUSTOM-MANIFEST.json';
const server = new DcxServer({});
server._
server.use('manifest', CustomManifest);

server.use('provider',
  {
    id: CustomManifest.output_descriptors[0].id,
    method: 'POST',
    endpoint: 'http://localhost:4000/api/v1/vc/data'
  }
);

server.use('dwn', 'http://localhost:3000/');
// const requestCredentialCustom = () => console.log('custom requestCredential handler');
// server.use('handler', { id: 'requestCredential', requestCredentialCustom });

await server.start();

process.on('SIGTERM', () => {
  server.stop();
});
