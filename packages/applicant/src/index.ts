export * from './config.js';
export * from './handlers.js';
export { protocol as credentialApplicantProtocol } from './protocol.js';
export * from './server.js';
export * from './web5-manager.js';

import ApplicantServer from './server.js';
export default ApplicantServer;

export const server = new ApplicantServer();