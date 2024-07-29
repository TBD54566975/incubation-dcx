import dotenv from 'dotenv';
import CustomManifest from '../../../../CUSTOM-MANIFEST.json';
import { server } from '../../src/index.js';
dotenv.config({ path: '.env.test' });

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