export const EmailAddressManifest = {
  id           : 'email-address-mfa-manifest',
  name         : 'Email Address MFA Manifest',
  description  : 'Defines the presentation requirements for proving ownership of an email address',
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
      id     : 'email-address-mfa-credential',
      name   : 'EmailAddressCredential',
      schema : 'https://formfree.github.io/.well-known/credential/EmailAddressCredential.json'
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
    id                  : 'email-address-mfa-presentation',
    input_descriptors : [
      {
        id            : 'email-address-mfa-input-descriptor',
        purpose       : 'Prove ownership of an email address',
        constraints : {
          fields : [
            {
              path : [
                '$.credentialSubject.emailAddress',
                '$.credentialSubject.otp'
              ]
            }
          ]
        }
      }
    ]
  }
};