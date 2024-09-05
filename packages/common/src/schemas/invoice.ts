export type InvoiceSchema = typeof schema;

export const schema = {
  $id        : 'https://decentralized.cx/protocol/schemas/invoice',
  $schema    : 'http://json-schema.org/draft-07/schema#',
  type       : 'object',
  title      : 'Invoice Record Schema',
  properties : {
    url : {
      type : 'string',
    },
  },
};
