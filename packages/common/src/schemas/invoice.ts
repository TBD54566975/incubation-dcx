export type InvoiceSchema = typeof schema;

export const schema = {
  $id        : 'https://decentralized.cx/protocol/credential-exchange/schemas/invoice',
  $schema    : 'http://json-schema.org/draft-07/schema#',
  type       : 'object',
  properties : {
    url : {
      type : 'string',
    },
  },
};
