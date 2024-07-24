import dotenv from 'dotenv';
import CustomManifest from '../../issuer/CUSTOM-MANIFEST.json';
import { server } from '../src/index.js';
dotenv.config({path: '../.env'});

server.use('manifest', CustomManifest);
server.use('provider',
  {
    id       : CustomManifest.output_descriptors[0].id,
    method   : 'POST',
    endpoint : 'http://localhost:4000/api/v1/vc/data'
  }
);
server.use('dwn', 'http://localhost:3000/');

await server.start();

process.on('SIGTERM', () => {
  server.stop();
});