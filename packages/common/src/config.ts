import { CredentialManifest } from './types/dcx';

export type DcxConfig = typeof config;

export const config =  {
  DCX_ENDPOINTS: {
    DWN_ENDPOINTS         : ['https://dwn.tbddev.org/beta'],
    GATEWAY_URIS          : ['https://diddht.tbddev.org/'],
    ISSUERS               : 'https://formfree.github.io/.well-known/issuers.json',
  },
  DCX_INPUT_ISSUERS: [
    {
      'name' : 'mx',
      'id'   : 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'
    },
    {
      'name' : 'formfree',
      'id'   : 'did:dht:hcf5e55bbm44s4oixp5z89wtxenxyk35su7f5pd4r5np93ikyowy'
    }
  ],
  DCX_HANDSHAKE_MANIFEST: {
    id            : 'DCX-HANDSHAKE-MANIFEST',
    name          : 'DCX Applicant-Issuer Handshake Manifest',
    description   : 'Basic handshake manifest used to establish a connection between a DCX applicant and a DCX issuer.',
    spec_version : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
    issuer       : {
      id       : 'https://formfree.github.io/.well-known/issuers/formfree.json',
      name     : 'FormFree',
      styles : {
        thumbnail: {
          uri : 'https://formfree.github.io/images/thumbnail.jpg',
          alt : 'FormFree Logo'
        },
        hero: {
          uri : 'https://formfree.github.io/images/hero.jpg',
          alt : 'FormFree Hero Image'
        },
        background : { color: '#FFFFFF' },
        text       : { color: '#000000' }
      }
    },
    output_descriptors: [{
      id     : 'dcx_handshake_output',
      name   : 'DCX Handshake Credential',
      schema : 'https://formfree.github.io/.well-known/credential/DcxHandshakeCredential.json'
    }],
    format                  : { jwt_vc: { alg: ['EdDSA'] } },
    presentation_definition : {
      id                  : 'dcx_handshake_presentation',
      input_descriptors : [
        {
          id            : 'dcx_handshake_input',
          purpose       : 'DCX Applicant initiates handshake proving did ownership',
          constraints : {
            fields: [{
              path   : ['$.type[*]'],
              filter : { type: 'string', pattern: '^*$' }
            },
            {
              path: [
                '$.credentialSubject.did',
                '$.credentialSubject.signature',
                '$.credentialSubject.message',
              ]
            }]
          }
        }
      ]
    }
  } as CredentialManifest,
  port               : process.env.ISSUER_PORT                      ?? 4000,
  serviceName        : process.env.ISSUER_SERVICE_NAME              ?? '@dcx-protocol/issuer',
  serviceId          : process.env.ISSUER_SERVICE_ID                ?? 'dcx-issuer',
  cursorFile         : process.env.ISSUER_CURSOR                    ?? 'issuer-cursor.json',
  lastRecordIdFile   : process.env.ISSUER_LAST_RECORD_ID            ?? 'lastRecordId.issuer',
  dwnEndpoints       : process.env.ISSUER_DWN_ENDPOINTS?.split(',') ?? ['https://dwn.tbddev.org/beta'],
  gatewayUris        : process.env.ISSUER_GATEWAY_URIS?.split(',')  ?? ['https://diddht.tbddev.org/'],
  agentDataPath      : process.env.ISSUER_WEB5_AGENT_DATA_PATH      ?? `DATA/DCX/ISSUER/AGENT`,
  web5Password       : process.env.ISSUER_WEB5_PASSWORD             ?? '',
  web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE      ?? '',
};