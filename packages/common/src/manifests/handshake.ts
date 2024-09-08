export const DcxHandshakeManifest = {
  id           : 'dcx-handshake-manifest:506a093652f5dec58394c2497602427d',
  name         : 'Dcx Handshake Manifest',
  description  : 'Defines the presentation requirements for proving ownership of a DID',
  spec_version : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
  issuer       : {
    id       : 'did:web:dcxprotocol.com',
    name     : 'dcxprotocol.com',
    styles : {
      thumbnail : {
        uri : 'https://dcxprotocol.com/images/thumbnail.jpg',
        alt : 'DCX Protocol Logo'
      },
      hero : {
        uri : 'https://dcxprotocol.com/images/hero.jpg',
        alt : 'DCX Protocol Hero Image'
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
      schema : 'https://dcxprotocol.com/.well-known/credential/DcxHandshakeCredential.json'
    }
  ],
  format : {
    jwt : {
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