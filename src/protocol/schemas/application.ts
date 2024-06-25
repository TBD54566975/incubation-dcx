export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://tblend.io/protocol/credential-issuance/schemas/presentation',
  type: 'object',
  properties: {
    '@context': {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'The @context of the presentation',
    },
    type: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'The type property of the presentation',
    },
    presentation_submission: {
      type: 'object',
      properties: {
        definition_id: {
          type: 'string',
        },
        descriptor_map: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              path: {
                type: 'string',
              },
              format: {
                type: 'string',
              },
            },
          },
        },
      },
      description: 'The Verifiable Credentials that represent your application',
    },
    verifiableCredential: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'The Verifiable Credentials to present in JWT format',
    },
  },
  required: ['@context', 'type', 'presentation_submission', 'verifiableCredential'],
};
