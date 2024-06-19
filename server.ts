import { config, DcxServer, DcxServerConfigurer } from "./src/index";

const server = new DcxServer();
server.use("manifest", { manifest: "MANIFEST.json" });
server.start();