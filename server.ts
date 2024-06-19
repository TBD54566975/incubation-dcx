import { DcxServer } from "./src/index";
import CustomManifest from "./CUSTOM-MANIFEST.json";

const server = new DcxServer();
server.use("manifest", CustomManifest);
server.start();