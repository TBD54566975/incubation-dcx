import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { DcxAgent, DcxIdentityVault } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { issuerConfig, IssuerServer, IssuerManager } from '../src/index.js';

const issuerServer: IssuerServer = new IssuerServer({
  config: {
    ...issuerConfig,
    web5Password       : process.env.APPLICANT_WEB5_PASSWORD!,
    web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE!
  }
});
console.log('process.env', process.env);
console.log('issuerServer', issuerServer);

describe('IssuerServer class', () => {
  describe('constructor with a custom manifest', () => {
    it('should contain static instance variables and a useOptions options object', () => {
      const _isPolling = issuerServer._isPolling;
      expect(_isPolling).to.not.be.null.and.not.be.undefined;
      expect(_isPolling).equals(false);
    });

    it('should contain property _isInitialized as a boolean equal to false', () => {
      const _isInitialized = issuerServer._isInitialized;
      expect(_isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof _isInitialized).equals('boolean');
      expect(_isInitialized).equals(false);
    });

    it('should contain property _isSetup as a boolean equal to false', () => {
      const _isSetup = issuerServer._isSetup;
      expect(_isSetup).to.not.be.null.and.not.be.undefined;
      expect(typeof _isSetup).equals('boolean');
      expect(_isSetup).to.be.equals(false);
    });

    it('should contain property _isTest as a boolean equal to false', () => {
      const _isTest = issuerServer._isTest;
      expect(_isTest).to.not.be.null.and.not.be.undefined;
      expect(typeof _isTest).equals('boolean');
      expect(_isTest).to.be.equals(false);
    });

    it('should contain property useOptions as an object containing 6 entries', () => {
      const useOptions = issuerServer.useOptions;
      expect(useOptions).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(useOptions)).to.have.lengthOf.gte(6);
    });

    describe('.initialize()', () => {
      it('should initialize the applicantServer', async () => {
        await issuerServer.initialize();
        expect(issuerServer._isInitialized).equals(true);
      });

      it('should initialize the IssuerManager', () => {
        expect(IssuerManager.web5).to.not.be.null.and.not.be.undefined;
        expect(IssuerManager.web5).to.be.instanceof(Web5);

        expect(IssuerManager.issuerAgent).to.not.be.null.and.not.be.undefined;
        expect(IssuerManager.issuerAgent).to.be.instanceof(DcxAgent);

        expect(IssuerManager.issuerAgentVault).to.not.be.null.and.not.be.undefined;
        expect(IssuerManager.issuerAgentVault).to.be.instanceof(DcxIdentityVault);
      });
    });

    describe('.setupDwn()', () => {
      it('should setup the remote DWN', async () => {
        await issuerServer.setupDwn();
        expect(issuerServer._isSetup).equals(true);
      });
    });
  });
});

// describe('useOptions', () => {
//   it('should contain property issuers as an array ', () => {
//     const issuers = issuerServer.useOptions.issuers;
//     expect(issuers).to.not.be.null.and.not.be.undefined;
//     expect(issuers).to.be.an('array');
//     expect(issuers).to.have.lengthOf(1);
//   });

//   it('should contain property', () => {
//     const gateways = issuerServer.useOptions.gateways;
//     expect(gateways).to.not.be.null.and.not.be.undefined;
//     expect(gateways).to.be.an('array');
//     expect(gateways).to.have.lengthOf(1);
//   });

//   it('should contain property', () => {
//     const dwns = issuerServer.useOptions.dwns;
//     expect(dwns).to.not.be.null.and.not.be.undefined;
//     expect(dwns).to.be.an('array');
//     expect(dwns).to.have.lengthOf(1);
//   });

//   it('should contain property', () => {
//     const manifests = issuerServer.useOptions.manifests;
//     expect(manifests).to.not.be.null.and.not.be.undefined;
//     expect(manifests).to.be.an('array');
//     expect(manifests).to.have.lengthOf(1);
//   });

//   it('should contain property', () => {
//     const providers = issuerServer.useOptions.providers;
//     expect(providers).to.not.be.null.and.not.be.undefined;
//     expect(providers).to.be.an('array');
//     expect(providers).to.have.lengthOf(1);
//   });

//   it('should contain property', () => {
//     const handlers = issuerServer.useOptions.handlers;
//     expect(handlers).to.not.be.null.and.not.be.undefined;
//     expect(handlers).to.be.an('array');
//     expect(handlers).to.have.lengthOf(1);
//   });
// });