import { responseSchema, invoiceSchema, manifestSchema, applicationSchema } from '@dcx-protocol/common';

export const dcxIssuer = {
  // issuer protocol is a subset of exchange protocol
  // used on server side to interact with applicant & issuer dwn
  protocol  : 'https://decentralized.cx/protocol/credential-exchange',
  published : false,
  types     : {
    application : {
      schema      : applicationSchema.$id,
      dataFormats : ['application/json'],
    },
    invoice : {
      schema      : invoiceSchema.$id,
      dataFormats : ['application/json'],
    },
    manifest : {
      schema      : manifestSchema.$id,
      dataFormats : ['application/json'],
    },
    response : {
      schema      : responseSchema.$id,
      dataFormats : ['application/json'],
    },
  },
  structure : {
    // issuers publish manifests to describe the data they can provide
    manifest : {
      $actions : [
        {
          who : 'anyone',
          can : ['read'],
        },
      ],
    },
    // applicants can apply for a credential
    application : {
      $actions : [
        {
          who : 'anyone',
          can : ['create'],
        },
        {
          who : 'author',
          of  : 'application',
          // is there an abstract use case instance where we'd want to let applicants update their application?
          can : ['read'],
        },
      ],
      // a credential response might be sent in response to an application
      response : {
        $actions : [
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
      invoice : {
        $actions : [
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
