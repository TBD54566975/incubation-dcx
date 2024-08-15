export type ApplicationSchema = typeof schema;

export const schema = {
  $id        : 'https://decentralized.cx/protocol/credential-exchange/schemas/application',
  $schema    : 'http://json-schema.org/draft-07/schema#',
  title      : 'Credential Application',
  type       : 'object',
  properties : {
    '@context' : {
      type        : 'array',
      items       : { type: 'string'},
      description : 'The @context of the application',
    },
    type : {
      type        : 'array',
      items       : { type: 'string'},
      description : 'The type property of the application',
    },
    presentation_submission : {
      type       : 'object',
      properties : {
        definition_id  : { type: 'string' },
        descriptor_map : {
          type  : 'array',
          items : {
            type       : 'object',
            properties : {
              id     : { type: 'string' },
              path   : { type: 'string' },
              format : { type: 'string' },
            },
          },
        },
      },
      description : 'The Verifiable Credentials that represent your application',
    },
    verifiableCredential : {
      type        : 'array',
      items       : { type: 'string' },
      description : 'The Verifiable Credentials to present in JWT format',
    },
  },
  required : ['@context', 'type', 'presentation_submission', 'verifiableCredential'],
};
