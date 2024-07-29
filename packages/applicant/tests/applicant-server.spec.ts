import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { DcxAgent, DcxIdentityVault } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import CustomManifest from '../../../CUSTOM-MANIFEST.json' assert { type: 'json' };
import { applicantConfig } from '../src/applicant-config.js';
import ApplicantServer, { Web5Manager } from '../src/index.js';

const applicantServer: ApplicantServer = new ApplicantServer({
  options: {
    issuers   : [],
    gateways  : [],
    dwns      : [],
    manifests : [],
    providers : [],
    handlers  : [],
  },
  config: {
    ...applicantConfig,
    APPLICANT_PORT                  : process.env.APPLICANT_PORT ?? '5000',
    APPLICANT_SERVICE_NAME          : process.env.APPLICANT_SERVICE_NAME ?? '@dcx-protocol/applicant',
    APPLICANT_SERVICE_ID            : process.env.APPLICANT_SERVICE_ID ?? 'dcx-applicant',
    APPLICANT_CURSOR                : process.env.APPLICANT_CURSOR ?? 'lastRecordId.applicant',
    APPLICANT_LAST_RECORD_ID        : process.env.APPLICANT_LAST_RECORD_ID ?? 'applicant-cursor.json',
    APPLICANT_WEB5_AGENT_DATA_PATH  : process.env.APPLICANT_WEB5_AGENT_DATA_PATH ?? `DATA/DCX/APPLICANT/AGENT`,
    _APPLICANT_WEB5_PASSWORD        : process.env.APPLICANT_WEB5_PASSWORD ?? '',
    _APPLICANT_WEB5_RECOVERY_PHRASE : process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? '',
  }
});
applicantServer.use('manifests', CustomManifest);

describe('ApplicantServer class', () => {
  describe('constructor with a custom manifest', () => {
    it('should contain static instance variables and a useOptions options object', () => {
      const _isPolling = applicantServer._isPolling;
      expect(_isPolling).to.not.be.null.and.not.be.undefined;
      expect(_isPolling).equals(false);
    });

    it('should contain property _isInitialized as a boolean equal to false', () => {
      const _isInitialized = applicantServer._isInitialized;
      expect(_isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof _isInitialized).equals('boolean');
      expect(_isInitialized).equals(false);
    });

    it('should contain property _isSetup as a boolean equal to false', () => {
      const _isSetup = applicantServer._isSetup;
      expect(_isSetup).to.not.be.null.and.not.be.undefined;
      expect(typeof _isSetup).equals('boolean');
      expect(_isSetup).to.be.equals(false);
    });

    it('should contain property _isTest as a boolean equal to false', () => {
      const _isTest = applicantServer._isTest;
      expect(_isTest).to.not.be.null.and.not.be.undefined;
      expect(typeof _isTest).equals('boolean');
      expect(_isTest).to.be.equals(false);
    });

    it('should contain property useOptions as an object containing 7 entries', () => {
      const useOptions = applicantServer.useOptions;
      expect(useOptions).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(useOptions)).to.have.lengthOf(7);
    });

    // describe('useOptions', () => {
    //   it('should contain property issuers as an array ', () => {
    //     const issuers = applicantServer.useOptions.issuers;
    //     expect(issuers).to.not.be.null.and.not.be.undefined;
    //     expect(issuers).to.be.an('array');
    //     expect(issuers).to.have.lengthOf(1);
    //   });

    //   it('should contain property', () => {
    //     const gateways = applicantServer.useOptions.gateways;
    //     expect(gateways).to.not.be.null.and.not.be.undefined;
    //     expect(gateways).to.be.an('array');
    //     expect(gateways).to.have.lengthOf(1);
    //   });

    //   it('should contain property', () => {
    //     const dwns = applicantServer.useOptions.dwns;
    //     expect(dwns).to.not.be.null.and.not.be.undefined;
    //     expect(dwns).to.be.an('array');
    //     expect(dwns).to.have.lengthOf(1);
    //   });

    //   it('should contain property', () => {
    //     const manifests = applicantServer.useOptions.manifests;
    //     expect(manifests).to.not.be.null.and.not.be.undefined;
    //     expect(manifests).to.be.an('array');
    //     expect(manifests).to.have.lengthOf(1);
    //   });

    //   it('should contain property', () => {
    //     const providers = applicantServer.useOptions.providers;
    //     expect(providers).to.not.be.null.and.not.be.undefined;
    //     expect(providers).to.be.an('array');
    //     expect(providers).to.have.lengthOf(1);
    //   });

    //   it('should contain property', () => {
    //     const handlers = applicantServer.useOptions.handlers;
    //     expect(handlers).to.not.be.null.and.not.be.undefined;
    //     expect(handlers).to.be.an('array');
    //     expect(handlers).to.have.lengthOf(1);
    //   });
    // });


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