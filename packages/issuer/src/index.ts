export * from './config.js';
export * from './handlers.js';
export { protocol as credentialIssuerProtocol } from './protocol.js';
export * from './web5-manager.js';

import IssuerServer from './server.js';
export default IssuerServer;

export const server = new IssuerServer();
