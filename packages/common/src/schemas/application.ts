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
    credential_application : {
      id : {
        type        : 'string',
        description : 'A unique identifier, such as a UUID'
      },
      spec_version : {
        type : 'string',
        $ref : 'https://identity.foundation/credential-manifest/#versioning'
      },
      applicant : {
        type        : 'string',
        description : 'A URI which uniquely identifies the applicant such as their did'
      },
      manifest_id : {
        type        : 'string',
        description : 'The id of a valid Credential Manifest'
      },
      format : {
        jwt_vc : {
          alg : ['EdDSA']
        }
      },
      presentation_submission : {
        type       : 'object',
        properties : {
          id             : { type: 'string' },
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
    },
    verifiableCredential : {
      type        : 'array',
      items       : { type: 'string' },
      description : 'The Verifiable Credentials to present in JWT format',
    },
  },
  required : ['@context', 'type', 'presentation_submission', 'verifiableCredential'],
};
