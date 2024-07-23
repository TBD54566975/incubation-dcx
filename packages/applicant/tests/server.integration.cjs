/* eslint-disable @typescript-eslint/no-var-requires */
const dcx = require('@dcx-protocol/common');
const ExampleManifest = require('../EXAMPLE-MANIFEST.json');

const server = dcx.server;

server.use('manifest', ExampleManifest);
server.use('provider',
  {
    id       : ExampleManifest.output_descriptors[0].id,
    method   : 'POST',
    endpoint : 'http://localhost:4000/api/v1/vc/data'
  }
);
server.use('dwn', 'http://localhost:3000/');

server.start().catch(console.error);

process.on('SIGTERM', () => {
  server.stop();
});
