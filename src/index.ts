export * from './core/agent.js';
export * from './core/config.js';
export * from './core/did-dht-manager.js';
export * from './core/dwn-manager.js';
export * from './core/handlers.js';
export * from './core/identity-vault.js';
export * from './core/manager.js';
export * from './core/server.js';

export { protocol as credentialApplicantProtocol } from './protocol/credential-applicant.js';
export { protocol as credentialIssuerProtocol } from './protocol/credential-issuer.js';
export { schema as presentationSchema } from './schemas/application.js';
export { schema as responseSchema } from './schemas/response.js';
export { schema as invoiceSchema } from './schemas/invoice.js';
export { schema as manifestSchema } from './schemas/manifest.js';

export type * from './types/cipher.js';
export type * from './types/dcx.js';
export type * from './types/did.js';
export type * from './types/web5.js';

export * from './utils/cipher.js';
export * from './utils/dwn.js';
export * from './utils/error.js';
export * from './utils/file-system.js';
export * from './utils/identity-vault.js';

export * from './utils/json.js';
export * from './utils/logger.js';
export * from './utils/objects.js';
export * from './utils/string.js';
export * from './utils/time.js';


import DcxServer from './core/server.js';
export default DcxServer;

export const server = new DcxServer();
