import { responseSchema, invoiceSchema, manifestSchema, applicationSchema } from '../../common/schemas/index.js';

export const protocol = {
  // applicant protocol is a subset of exchange protocol
  protocol  : 'https://dcx.io/protocol/credential-applicant',
  published : false,
  types     : {
    application: {
      schema      : applicationSchema.$id,
      dataFormats : ['application/json'],
    },
    invoice: {
      schema      : invoiceSchema.$id,
      dataFormats : ['application/json'],
    },
    manifest: {
      schema      : manifestSchema.$id,
      dataFormats : ['application/json'],
    },
    response: {
      schema      : responseSchema.$id,
      dataFormats : ['application/json'],
    },
  },
  structure: {
    // issuers publish manifests to describe the data they can provide
    manifest    : {},
    // applicants can apply for a credential
    application : {
      // a credential response might be sent in response to an application
      response: {
        $actions: [
          {
            who : 'recipient',
            of  : 'application',
            can : ['create', 'update'],
          },
          {
            who : 'author',
            of  : 'application',
            can : ['read'],
          },
        ],
      },
      // an invoice might be sent in response to an application
      invoice: {
        $actions: [
          {
            who : 'recipient',
            of  : 'application',
            can : ['create', 'update'],
          },
          {
            who : 'author',
            of  : 'application',
            can : ['read'],
          },
        ],
      },
    },
  },
};
