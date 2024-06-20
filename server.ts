import { DcxServer } from './src/index';
import CustomManifest from './CUSTOM-MANIFEST.json';

const server = new DcxServer({});
server.useManifest('customManifest', CustomManifest);
server.start();