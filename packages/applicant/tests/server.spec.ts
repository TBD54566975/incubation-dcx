import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { DcxAgent, DcxIdentityVault } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { applicantConfig, ApplicantServer, ApplicantManager } from '../src/index.js';

const applicantServer: ApplicantServer = new ApplicantServer({
  config: {
    ...applicantConfig,
    DCX_ENV            : process.env.NODE_ENV ?? 'test',
    web5Password       : process.env.APPLICANT_WEB5_PASSWORD!,
    web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE!
  }
});

describe('ApplicantServer class', () => {
  describe('has default properties that', () => {
    it('should include static property _isPolling as a boolean equal to false', () => {
      const _isPolling = applicantServer._isPolling;
      expect(_isPolling).to.not.be.null.and.not.be.undefined;
      expect(_isPolling).equals(false);
    });

    it('should include property _isInitialized as a boolean equal to false', () => {
      const _isInitialized = applicantServer._isInitialized;
      expect(_isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof _isInitialized).equals('boolean');
      expect(_isInitialized).equals(false);
    });

    it('should include property _isSetup as a boolean equal to false', () => {
      const _isSetup = applicantServer._isSetup;
      expect(_isSetup).to.not.be.null.and.not.be.undefined;
      expect(typeof _isSetup).equals('boolean');
      expect(_isSetup).to.be.equals(false);
    });

    it('should include property _isTest as a boolean equal to false', () => {
      const _isTest = applicantServer._isTest;
      expect(_isTest).to.not.be.null.and.not.be.undefined;
      expect(typeof _isTest).equals('boolean');
      expect(_isTest).to.be.equals(true);
    });

    it('should include property useOptions as an object containing 6 entries', () => {
      const useOptions = applicantServer.useOptions;
      expect(useOptions).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(useOptions)).to.have.lengthOf.gte(6);
    });

    describe('.initialize()', () => {
      it('should initialize the applicantServer', async () => {
        await applicantServer.initialize();
        expect(applicantServer._isInitialized).equals(true);
      });

      it('should initialize the ApplicantManager', () => {
        expect(ApplicantManager.web5).to.not.be.null.and.not.be.undefined;
        expect(ApplicantManager.web5).to.be.instanceof(Web5);

        expect(ApplicantManager.applicantAgent).to.not.be.null.and.not.be.undefined;
        expect(ApplicantManager.applicantAgent).to.be.instanceof(DcxAgent);

        expect(ApplicantManager.applicantAgentVault).to.not.be.null.and.not.be.undefined;
        expect(ApplicantManager.applicantAgentVault).to.be.instanceof(DcxIdentityVault);
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

// describe('useOptions', () => {
//   it('should include property issuers as an array ', () => {
//     const issuers = applicantServer.useOptions.issuers;
//     expect(issuers).to.not.be.null.and.not.be.undefined;
//     expect(issuers).to.be.an('array');
//     expect(issuers).to.have.lengthOf(1);
//   });

//   it('should include property', () => {
//     const gateways = applicantServer.useOptions.gateways;
//     expect(gateways).to.not.be.null.and.not.be.undefined;
//     expect(gateways).to.be.an('array');
//     expect(gateways).to.have.lengthOf(1);
//   });

//   it('should include property', () => {
//     const dwns = applicantServer.useOptions.dwns;
//     expect(dwns).to.not.be.null.and.not.be.undefined;
//     expect(dwns).to.be.an('array');
//     expect(dwns).to.have.lengthOf(1);
//   });

//   it('should include property', () => {
//     const manifests = applicantServer.useOptions.manifests;
//     expect(manifests).to.not.be.null.and.not.be.undefined;
//     expect(manifests).to.be.an('array');
//     expect(manifests).to.have.lengthOf(1);
//   });

//   it('should include property', () => {
//     const providers = applicantServer.useOptions.providers;
//     expect(providers).to.not.be.null.and.not.be.undefined;
//     expect(providers).to.be.an('array');
//     expect(providers).to.have.lengthOf(1);
//   });

//   it('should include property', () => {
//     const handlers = applicantServer.useOptions.handlers;
//     expect(handlers).to.not.be.null.and.not.be.undefined;
//     expect(handlers).to.be.an('array');
//     expect(handlers).to.have.lengthOf(1);
//   });
// });