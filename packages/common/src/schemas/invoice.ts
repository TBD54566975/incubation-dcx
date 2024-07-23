export type InvoiceSchema = typeof schema;

export const schema = {
  $id        : 'https://formfree.github.io/.well-known/schemas/dcx/invoice.json',
  $schema    : 'http://json-schema.org/draft-07/schema#',
  type       : 'object',
  properties : {
    url: {
      type: 'string',
    },
  },
};
