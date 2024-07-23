/* eslint-disable @typescript-eslint/no-var-requires */
const issuer = require('@dcx-protocol/issuer');
const ExampleManifest = require('../../../EXAMPLE-MANIFEST.json');

issuer.server.use('manifest', ExampleManifest);
issuer.server.use('provider',
  {
    id       : ExampleManifest.output_descriptors[0].id,
    method   : 'POST',
    endpoint : 'http://localhost:4000/api/v1/vc/data'
  }
);
issuer.server.use('dwn', 'http://localhost:3000/');

await issuer.server.start();

process.on('SIGTERM', () => {
  issuer.server.stop();
});
