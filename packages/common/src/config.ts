import { CredentialManifest } from './types/dcx';

export class Config {
  public static DCX_ENV = process.env.NODE_ENV ?? 'development';
  public static DCX_ENDPOINTS = {
    DWN_ENDPOINTS         : ['https://dwn.formfree.com/', 'https://dwn.tbddev.org/beta'],
    GATEWAY_URIS          : ['http://dev.dht.formfree.com:8305/', 'https://diddht.tbddev.org/'],
    ISSUERS               : 'https://formfree.github.io/.well-known/issuers.json',
  };
  public static DCX_INPUT_ISSUERS = [
    {
      'name' : 'mx',
      'id'   : 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'
    }
  ];
  public static DCX_HANDSHAKE_MANIFEST = {
    id           : 'DCX-HANDSHAKE-MANIFEST',
    name         : 'DCX Applicant-Issuer Handshake Manifest',
    description  : 'Basic handshake manifest used to establish a connection between a DCX applicant and a DCX issuer.',
    spec_version : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
    issuer       : {
      id   : '',
      name : 'formfree'
    },
    output_descriptors: [
      {
        id     : 'dcx_handshake_output',
        name   : 'DCX Handshake Credential',
        schema : 'https://decentralized.cx/schemas/DCXHandshakeCredential'
      }
    ],
    format: {
      jwt_vc: {
        alg: ['EdDSA']
      }
    },
    presentation_definition: {
      id                : 'dcx-handshake-presentation-ca7f3e0e-10dd-4d0a-9539-29390a9c16e3',
      input_descriptors : [
        {
          id          : 'example-presentation-definition-input-descriptor-id',
          purpose     : 'Meant as an example to developers',
          constraints : {
            fields: [
              {
                path   : ['$.type[*]'],
                filter : {
                  type    : 'string',
                  pattern : '^*$'
                }
              },
              {
                path: []
              }
            ]
          }
        }
      ]
    }
  } as CredentialManifest;
}
