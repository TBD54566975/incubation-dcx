import { Config, DcxAgent, DcxIdentityVault } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import ApplicantServer, { Web5Manager } from '../src/index.js';

describe('ApplicantServer', () => {

  before(() => {
    Config.WEB5_PASSWORD = 'pupil sound bid angle year speed';
    Config.WEB5_RECOVERY_PHRASE = 'typical galaxy dinosaur sure found attract enjoy recycle shoulder chicken hazard dream';
  });

  const applicantServer: ApplicantServer = new ApplicantServer();
  applicantServer.use('manifest', {
    'name'         : 'FormFree RIKI ATP',
    'description'  : 'FormFree RIKI ATP Credential Manifest',
    'id'           : 'ATP-REPORT',
    'spec_version' : 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
    'issuer'       : {
      'id'   : '[replaced dynamically]',
      'name' : 'FormFree RIKI ATP'
    },
    'output_descriptors': [
      {
        'id'     : 'atp-report',
        'name'   : 'ATP Report',
        'schema' : 'https://formfree.com/schemas/ATPReportCredential'
      }
    ],
    'format': {
      'jwt_vc': {
        'alg': [
          'EdDSA'
        ]
      }
    },
    'presentation_definition': {
      'id'                : 'atp-report-encrypted',
      'input_descriptors' : [
        {
          'id'          : 'atp-report-encrypted',
          'purpose'     : 'Report to decrypt',
          'constraints' : {
            'fields': [
              {
                'path': [
                  '$.type[*]'
                ],
                'filter': {
                  'type'    : 'string',
                  'pattern' : '^ATPReportEncryptedCredential$'
                }
              },
              {
                'path': [
                  '$.credentialSubject.encrypted'
                ]
              }
            ]
          }
        }
      ]
    }
  });

  describe('new ApplicantServer()', () => {
    it('should construct with valid parameters and options', () => {
      expect(applicantServer).to.not.be.null.and.not.be.undefined;
      expect(applicantServer).to.be.instanceof(ApplicantServer);

      expect(applicantServer).to.have.property('_isPolling');
      const _isPolling = applicantServer._isPolling;
      expect(_isPolling).to.not.be.null.and.not.be.undefined;
      expect(typeof _isPolling).equals('boolean');
      expect(_isPolling).equals(false);

      expect(applicantServer).to.have.property('_isInitialized');
      const _isInitialized = applicantServer._isInitialized;
      expect(_isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof _isInitialized).equals('boolean');
      expect(_isInitialized).equals(false);

      expect(applicantServer).to.have.property('_isSetup');
      const _isSetup = applicantServer._isSetup;
      expect(_isSetup).to.not.be.null.and.not.be.undefined;
      expect(typeof _isSetup).equals('boolean');
      expect(_isSetup).to.be.equals(false);

      expect(applicantServer).to.have.property('_isTest');
      const _isTest = applicantServer._isTest;
      expect(_isTest).to.not.be.null.and.not.be.undefined;
      expect(typeof _isTest).equals('boolean');
      expect(_isTest).to.be.equals(false);

      const useOptions = applicantServer.useOptions;
      expect(useOptions).to.not.be.null.and.not.be.undefined;
      expect(typeof useOptions).equal('object');
      expect(Object.keys(useOptions)).to.have.lengthOf(6);
      expect(Object.values(useOptions)).to.have.lengthOf(6);

      const issuers = applicantServer.useOptions.issuers;
      expect(issuers).to.not.be.null.and.not.be.undefined;
      expect(issuers).to.be.an('array');

      const gateways = applicantServer.useOptions.gateways;
      expect(gateways).to.not.be.null.and.not.be.undefined;
      expect(gateways).to.be.an('array');

      const dwns = applicantServer.useOptions.dwns;
      expect(dwns).to.not.be.null.and.not.be.undefined;
      expect(dwns).to.be.an('array');

      const manifests = applicantServer.useOptions.manifests;
      expect(manifests).to.not.be.null.and.not.be.undefined;
      expect(manifests).to.be.an('array');

      const providers = applicantServer.useOptions.providers;
      expect(providers).to.not.be.null.and.not.be.undefined;
      expect(providers).to.be.an('array');

      const handlers = applicantServer.useOptions.handlers;
      expect(handlers).to.not.be.null.and.not.be.undefined;
      expect(handlers).to.be.an('array');
    });


    describe('.initialize()', () => {
      it('should initialize the applicantServer', async () => {
        await applicantServer.initialize();
        expect(applicantServer._isInitialized).equals(true);
      });

      it('should initialize the Web5Manager', () => {
        expect(Web5Manager.web5).to.not.be.null.and.not.be.undefined;
        expect(Web5Manager.web5).to.be.instanceof(Web5);

        expect(Web5Manager.applicantAgent).to.not.be.null.and.not.be.undefined;
        expect(Web5Manager.applicantAgent).to.be.instanceof(DcxAgent);

        expect(Web5Manager.applicantAgentVault).to.not.be.null.and.not.be.undefined;
        expect(Web5Manager.applicantAgentVault).to.be.instanceof(DcxIdentityVault);
      });
    });

    describe('.setupDwn()', () => {
      it('should setup the remote DWN', async () => {
        await applicantServer.setupDwn();
        expect(applicantServer._isSetup).equals(true);
      });
    });
  });
});