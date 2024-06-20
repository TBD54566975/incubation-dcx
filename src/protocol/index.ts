import ExampleManifest from './manifests/EXAMPLE-MANIFEST.json';
export { ExampleManifest };

export { schema as presentationSchema } from './schemas/application.js';
export { schema as responseSchema } from './schemas/response.js';
export { schema as invoiceSchema } from './schemas/invoice.js';
export { schema as manifestSchema } from './schemas/manifest.js';
export * from './handlers.js';

export { protocol as credentialApplicantProtocol } from './credential-applicant.js';
export { protocol as credentialIssuerProtocol } from './credential-issuer.js';
