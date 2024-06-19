import { DcxServer } from "./src/index";
import CustomManifest from "./CUSTOM-MANIFEST.json";

const server = new DcxServer();
server.use("manifest", CustomManifest);
server.start();


/**
 * Ways to get a did key
 * 1. DCX_DID_URI or DCX_DID_JWK_D - store private key in env var and use it to somehow generate pubkey and did material
 * 2. DCX_DID_FILEPATH - store portable did file in project root and set path in env var
 * 3. store did uri in env var and use it to resolve the did document
 * 4. bring nothing and create a new did
 * 5. 
 */