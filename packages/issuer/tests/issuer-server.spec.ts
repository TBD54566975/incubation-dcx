import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { DcxAgent, DcxIdentityVault } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { issuerConfig, IssuerManager, IssuerServer } from '../src/index.js';

const issuerServer: IssuerServer = new IssuerServer({
  config: {
    ...issuerConfig,
    DCX_ENV            : process.env.NODE_ENV ?? 'test',
    web5Password       : process.env.ISSUER_WEB5_PASSWORD!,
    web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE!,
    agentDataPath      : '__TEST_DATA__/DCX/ISSUER/AGENT',
  }
});

describe('IssuerServer class', () => {
  describe('has default properties that', () => {
    it('should include static property _isPolling as a boolean equal to false', () => {
      const _isPolling = issuerServer._isPolling;
      expect(_isPolling).to.not.be.null.and.not.be.undefined;
      expect(_isPolling).equals(false);
    });

    it('should include property _isInitialized as a boolean equal to false', () => {
      const _isInitialized = issuerServer._isInitialized;
      expect(_isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof _isInitialized).equals('boolean');
      expect(_isInitialized).equals(false);
    });

    it('should include property _isSetup as a boolean equal to false', () => {
      const _isSetup = issuerServer._isSetup;
      expect(_isSetup).to.not.be.null.and.not.be.undefined;
      expect(typeof _isSetup).equals('boolean');
      expect(_isSetup).to.be.equals(false);
    });

    it('should include property _isTest as a boolean equal to false', () => {
      const _isTest = issuerServer._isTest;
      expect(_isTest).to.not.be.null.and.not.be.undefined;
      expect(typeof _isTest).equals('boolean');
      expect(_isTest).to.be.equals(true);
    });

    it('should include property useOptions as an object containing 6 entries', () => {
      const useOptions = issuerServer.useOptions;
      expect(useOptions).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(useOptions)).to.have.lengthOf.gte(6);
    });

    describe('.initialize()', () => {
      it('should initialize the issuerServer', async () => {
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