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
    id      : 'email-address-mfa-presentation',
    name    : 'Email Address Presentation',
    purpose : 'Used to present proof that an applicant owns the enclosed email address by providing the enclosed otp',

    input_descriptors : [
      {
        id          : 'email-address-input-descriptor',
        purpose     : 'The holder of this credential has proven ownership of the enclosed email address by providing the correct one-time password (otp)',
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