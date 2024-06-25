import server from './src/index';
import CustomManifest from './CUSTOM-MANIFEST.json';

server.useManifest('customManifest', CustomManifest);
server.start();