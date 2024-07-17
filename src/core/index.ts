export * from './agent.js';
export * from './config.js';
export * from './did-dht-manager.js';
export * from './dwn-manager.js';
export * from './handlers.js';
export * from './identity-vault.js';
export * from './manager.js';
export * from './server.js';

import DcxServer from './server.js';
export default DcxServer;

import { server } from './server.js';
export { server };