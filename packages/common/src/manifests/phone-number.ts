export const PhoneNumberManifest = {
  id           : 'PHONE-NUMBER-MFA-MANIFEST',
  name         : 'Phone Number MFA Manifest',
  description  : 'Defines the presentation requirements for proving ownership of a phone number',
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
      id     : 'phone-number-credential',
      name   : 'Phone Number Credential',
      schema : 'https://formfree.github.io/.well-known/credential/PhoneNumberCredential.json'
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
    id                  : 'phone-number-presentation',
    input_descriptors : [
      {
        id            : 'phone-number-input-descriptor',
        purpose       : 'Prove ownership of a phone number',
        constraints : {
          fields : [
            {
              path : [
                '$.credentialSubject.phoneNumber',
                '$.credentialSubject.otp'
              ]
            }
          ]
        }
      }
    ]
  }
};