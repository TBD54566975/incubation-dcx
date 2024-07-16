export const schema = {
  $schema    : 'http://json-schema.org/draft-07/schema#',
  $id        : 'https://dcx.io/protocol/credential-issuance/schemas/response',
  title      : 'Credential Response',
  type       : 'object',
  properties : {
    id             : { type: 'string' },
    spec_version   : { type: 'string' },
    applicant      : { type: 'string' },
    manifest_id    : { type: 'string' },
    application_id : { type: 'string' },
    response       : {
      type       : 'object',
      properties : {
        descriptor_map: {
          type  : 'array',
          items : { $ref: '#/definitions/descriptor' },
        },
      },
      required             : ['descriptor_map'],
      additionalProperties : false,
    },
    denial: {
      type       : 'object',
      properties : {
        reason            : { type: 'string' },
        input_descriptors : {
          type     : 'array',
          minItems : 1,
          items    : { type: 'string' },
        },
      },
      required             : ['reason'],
      additionalProperties : false,
    },
  },
  oneOf: [
    {
      required: ['response'],
    },
    {
      required: ['denial'],
    },
  ],
  definitions: {
    descriptor: {
      type       : 'object',
      properties : {
        id          : { type: 'string' },
        path        : { type: 'string' },
        path_nested : {
          type : 'object',
          $ref : '#/definitions/descriptor',
        },
        format: {
          type : 'string',
          enum : ['jwt', 'jwt_vc', 'jwt_vp', 'ldp', 'ldp_vc', 'ldp_vp'],
        },
      },
      required             : ['id', 'path', 'format'],
      additionalProperties : false,
    },
  },
  required             : ['id', 'spec_version', 'manifest_id'],
  additionalProperties : false,
};
