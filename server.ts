import { DcxServer } from './src/index';
import CustomManifest from './CUSTOM-MANIFEST.json';

const server = new DcxServer({ needWeb5Init: true });
server.useManifest('customManifest', CustomManifest);
server.start();