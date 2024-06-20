import { server } from "./src/index";
import CustomManifest from "./CUSTOM-MANIFEST.json";

server.use("manifest", CustomManifest);
server.start();