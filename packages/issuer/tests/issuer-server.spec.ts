import { DcxAgent, DcxIdentityVault, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { dcxIssuerConfig, DcxIssuer } from '../src/index.js';

process.env.NODE_ENV = 'test';

describe('DcxIssuer class', () => {
  const dcxIssuer: DcxIssuer = new DcxIssuer({
    config: {
      ...dcxIssuerConfig,
      web5Password       : process.env.ISSUER_WEB5_PASSWORD ?? Mnemonic.createPassword(),
      web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
      agentDataPath      : '__TEST_DATA__/DCX/ISSUER/AGENT',
    }
  });

  after(async () => {
    await FileSystem.rmdir('__TEST_DATA__');
  });

  describe('default properties', () => {
    it('should include property isInitialized as a boolean equal to false', () => {
      const isInitialized = dcxIssuer.isInitialized;
      expect(isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof isInitialized).equals('boolean');
      expect(isInitialized).equals(false);
    });

    it('should include property isSetup as a boolean equal to false', () => {
      const isSetup = dcxIssuer.isSetup;
      expect(isSetup).to.not.be.null.and.not.be.undefined;
      expect(typeof isSetup).equals('boolean');
      expect(isSetup).to.be.equals(false);
    });

    it('should include property useOptions as an object containing 6 entries', () => {
      const useOptions = dcxIssuer.dcxOptions;
      expect(useOptions).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(useOptions)).to.have.lengthOf.gte(6);
    });
  });

  describe('.initialize()', () => {
    it('should initialize the dcxIssuer', async () => {
      await dcxIssuer.initializeWeb5();
      expect(dcxIssuer.isInitialized).equals(true);
    });

    it('should initialize the IssuerManager', () => {
      expect(DcxIssuer.web5).to.not.be.null.and.not.be.undefined;
      expect(DcxIssuer.web5).to.be.instanceof(Web5);

      expect(DcxIssuer.agent).to.not.be.null.and.not.be.undefined;
      expect(DcxIssuer.agent).to.be.instanceof(DcxAgent);

      expect(DcxIssuer.agentVault).to.not.be.null.and.not.be.undefined;
      expect(DcxIssuer.agentVault).to.be.instanceof(DcxIdentityVault);
    });
  });

  describe('.setupDwn()', () => {
    it('should setup the remote DWN', async () => {
      await dcxIssuer.setupDwn();
      expect(dcxIssuer.isSetup).equals(true);
    });
  });
});