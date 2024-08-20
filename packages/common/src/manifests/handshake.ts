export const DcxHandshakeManifest = {
  id           : 'dcx-handshake-manifest',
  name         : 'Dcx Handshake Manifest',
  description  : 'Defines the presentation requirements for proving ownership of a DID',
  spec_version : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
  issuer       : {
    id       : 'https://formfree.github.io/.well-known/issuers/formfree.json',
    name     : 'FormFree',
    styles : {
      thumbnail : {
        uri : 'https://formfree.github.io/images/thumbnail.jpg',
        alt : 'FormFree Logo'
      },
      hero : {
        uri : 'https://formfree.github.io/images/hero.jpg',
        alt : 'FormFree Hero Image'
      },
      background : {
        color : '#FFFFFF'
      },
      text : {
        color : '#000000'
      }
    }
  },
  output_descriptors : [
    {
      id     : 'dcx-handshake-output',
      name   : 'DcxHandshakeCredential',
      schema : 'https://formfree.github.io/.well-known/credential/DcxHandshakeCredential.json'
    }
  ],
  format : {
    jwt_vc : {
      alg : [
        'EdDSA'
      ]
    }
  },
  presentation_definition : {
    id                  : 'dcx-handshake-presentation',
    input_descriptors : [
      {
        id            : 'dcx-handshake-input',
        purpose       : 'applicant submits a plain text message and a signed version of that message to prove ownership of a DID',
        constraints : {
          fields : [
            {
              path : [
                '$.credentialSubject.signedMessage',
                '$.credentialSubject.message'
              ]
            }
          ]
        }
      }
    ]
  }
};