import DcxServer from '../src/index.js';
import ExampleManifest from '../EXAMPLE-MANIFEST.json';

const server = new DcxServer();

server.use('manifest', ExampleManifest);
server.use('provider',
  {
    id       : ExampleManifest.output_descriptors[0].id,
    method   : 'POST',
    endpoint : 'http://localhost:4000/api/v1/vc/data'
  }
);
server.use('dwn', 'http://localhost:3000/');

await server.start();

process.on('SIGTERM', () => {
  server.stop();
});
