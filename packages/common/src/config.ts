import { Issuer } from './types/dcx';
export class Config {
  public static PORT = process.env.PORT ?? 3000;
  public static NODE_ENV = process.env.NODE_ENV ?? 'development';
  public static SERVICE_NAME = process.env.SERVICE_NAME ?? 'dcx';
  public static SERVICE_ID = process.env.SERVICE_ID ?? 'dcx';
  public static LAST_RECORD_ID = process.env.LAST_RECORD_ID ?? '';
  public static CURSOR = process.env.CURSOR ?? '';
  public static GATEWAY_URIS = process.env.GATEWAY_URIS?.split(',');
  public static DWN_ENDPOINTS = process.env.DWN_ENDPOINTS?.split(',');
  public static DEFAULT_ENDPOINTS = {
    DWN     : ['https://dwn.formfree.com/', 'https://dwn.tbddev.org/beta'],
    DHT     : ['http://dev.dht.formfree.com:8305/', 'https://diddht.tbddev.org/'],
    ISSUERS : 'https://formfree.github.io/.well-known/issuers.json',
  };
  public static DEFAULT_DWN_ENDPOINTS = Config.DWN_ENDPOINTS ?? Config.DEFAULT_ENDPOINTS.DWN;
  public static DEFAULT_GATEWAY_URIS = Config.GATEWAY_URIS ?? Config.DEFAULT_ENDPOINTS.DHT;
  public static DEFAULT_TRUSTED_ISSUERS = [
    {
      'name' : 'mx',
      'id'   : 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'
    }
  ];
  public static DEFAULT_TRUSTED_ISSUER_DIDS = Config.DEFAULT_TRUSTED_ISSUERS.map((issuer: Issuer) => issuer.id);
  public static DEFAULT_EXAMPLE_MANIFEST = {
    'id'           : 'EXAMPLE-MANIFEST',
    'name'         : 'DCX Credential Manifest Example',
    'description'  : 'This is an example of a credential manifest used by DCX. This document should be replaced with your own version to satify the requirements of the credentials your DCX server expects as inputs and the desired output credential.',
    'spec_version' : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
    'issuer'       : {
      'id'   : '[replaced dynamically]',
      'name' : 'example-issuer'
    },
    'output_descriptors': [
      {
        'id'     : 'example-output-descriptor-id',
        'name'   : 'Example Output Descriptor Name',
        'schema' : 'https://example.com/schemas/ExampleOutputDescriptorSchema'
      }
    ],
    'format': {
      'jwt_vc': {
        'alg': ['EdDSA']
      }
    },
    'presentation_definition': {
      'id'                : 'example-presentation-definition-id',
      'input_descriptors' : [
        {
          'id'          : 'example-presentation-definition-input-descriptor-id',
          'purpose'     : 'Meant as an example to developers',
          'constraints' : {
            'fields': [
              {
                'path'   : ['$.type[*]'],
                'filter' : {
                  'type'    : 'string',
                  'pattern' : '^*$'
                }
              },
              {
                'path': [
                  '$.credentialSubject.some.unique.field1',
                  '$.credentialSubject.some.unique.field2',
                  '$.credentialSubject.some.unique.fieldn'
                ]
              }
            ]
          }
        }
      ]
    }
  };

  private static _WEB5_PASSWORD = process.env.WEB5_PASSWORD || '';
  static get WEB5_PASSWORD(): string {
    return this._WEB5_PASSWORD;
  }
  static set WEB5_PASSWORD(password: string) {
    this._WEB5_PASSWORD = password;
  }
  private static _WEB5_RECOVERY_PHRASE = process.env.WEB5_RECOVERY_PHRASE || '';
  static get WEB5_RECOVERY_PHRASE(): string {
    return this._WEB5_RECOVERY_PHRASE;
  }
  static set WEB5_RECOVERY_PHRASE(recoveryPhrase: string) {
    this._WEB5_RECOVERY_PHRASE = recoveryPhrase;
  }
}
