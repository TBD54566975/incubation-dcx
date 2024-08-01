import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import CustomManifest from '../../../../CUSTOM-MANIFEST.json';
import { IssuerServer, issuerConfig } from '../../src/index.js';

const server = new IssuerServer({ config: {
  ...issuerConfig,
  web5Password       : process.env.ISSUER_WEB5_PASSWORD!,
  web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE!
}});

server.use('manifests', CustomManifest);
server.use('providers',
  {
    id       : CustomManifest.output_descriptors[0].id,
    method   : 'POST',
    endpoint : 'http://localhost:4000/api/v1/vc/data'
  }
);
server.use('dwns', 'http://localhost:3000/');

await server.start();

process.on('SIGTERM', () => {
  server.stop();
});