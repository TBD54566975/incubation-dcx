import { schema as responseSchema } from '../schemas/response.js';
import { schema as invoiceSchema } from '../schemas/invoice.js';
import { schema as manifestSchema } from '../schemas/manifest.js';
import { schema as applicationSchema } from '../schemas/application.js';

export const protocol = {
  // full exchange protocol
  protocol  : 'https://formfree.github.io/.well-known/protocols/dvcx/credential-exchange.json',
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
    manifest: {
      $actions: [
        {
          who : 'anyone',
          can : [
            'read'
          ]
        },
        {
          who : 'author',
          of  : 'manifest',
          can : [
            'update'
          ]
        }
      ]
    },
    application: {
      $actions: [
        {
          who : 'anyone',
          can : [
            'create'
          ]
        },
        {
          who : 'author',
          of  : 'application',
          can : [
            'read'
          ]
        }
      ],
      response: {
        $actions: [
          {
            who : 'recipient',
            of  : 'application',
            can : [
              'create',
              'update'
            ]
          },
          {
            who : 'author',
            of  : 'application',
            can : [
              'read'
            ]
          }
        ]
      },
      invoice: {
        $actions: [
          {
            who : 'recipient',
            of  : 'application',
            can : [
              'create',
              'update'
            ]
          },
          {
            who : 'author',
            of  : 'application',
            can : [
              'read'
            ]
          }
        ]
      }
    }
  },
};
