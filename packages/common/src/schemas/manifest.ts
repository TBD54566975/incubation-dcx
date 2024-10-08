export type ManifestSchema = typeof schema;

export const schema = {
  $id        : 'https://decentralized.cx/protocol/schemas/manifest',
  $schema    : 'http://json-schema.org/draft-07/schema',
  title      : 'Credential Manifest Record Schema',
  type       : 'object',
  properties : {
    id           : { type: 'string'},
    name         : { type: 'string'},
    description  : { type: 'string'},
    spec_version : { type: 'string'},
    issuer       : {
      type       : 'object',
      required   : ['id'],
      properties : {
        id     : { type: 'string' },
        name   : { type: 'string' },
        styles : { $ref: 'https://identity.foundation/wallet-rendering/schemas/entity-styles.json' },
      },
      additionalProperties : false,
    },
    output_descriptors : {
      type  : 'array',
      items : {
        type       : 'object',
        required   : ['id', 'schema'],
        properties : {
          id          : { type: 'string' },
          name        : { type: 'string' },
          description : { type: 'string' },
          schema      : { type: 'string' },
          display     : {
            type       : 'object',
            properties : {
              title       : { $ref: 'https://identity.foundation/wallet-rendering/schemas/display-mapping-object.json' },
              subtitle    : { $ref: 'https://identity.foundation/wallet-rendering/schemas/display-mapping-object.json' },
              description : { $ref: 'https://identity.foundation/wallet-rendering/schemas/display-mapping-object.json' },
              properties  : {
                type  : 'array',
                items : { $ref: 'https://identity.foundation/wallet-rendering/schemas/labeled-display-mapping-object.json' },
              },
            },
            additionalProperties : false,
          },
          styles : { $ref: 'https://identity.foundation/wallet-rendering/schemas/entity-styles.json' },
        },
        additionalProperties : false,
      },
    },
    presentation_definition : { $ref: 'https://identity.foundation/presentation-exchange/schemas/presentation-definition.json' },
    format                  : { $ref: 'https://identity.foundation/claim-format-registry/schemas/presentation-definition-claim-format-designations.json' },
  },
  required             : ['id', 'spec_version', 'issuer', 'output_descriptors'],
  additionalProperties : false,
};
