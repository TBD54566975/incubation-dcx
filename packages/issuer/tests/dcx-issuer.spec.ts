import { DcxAgent, dcxConfig, DcxIdentityVault, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { DcxIssuer } from '../src/index.js';

process.env.NODE_ENV = 'test';

describe('DcxIssuer class', () => {
  const issuer: DcxIssuer = new DcxIssuer({
    config  : {
      ...dcxConfig,
      issuer : {
        ...dcxConfig.issuer,
        web5Password       : process.env.ISSUER_WEB5_PASSWORD ?? Mnemonic.createPassword(),
        web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
        agentDataPath      : '__TEST_DATA__/DCX/ISSUER/AGENT',
      }
    }
  });

  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__');
  });

  describe('default properties', () => {
    it('should include property isInitialized as a boolean equal to false', () => {
      const isInitialized = issuer.isInitialized;
      expect(isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof isInitialized).equals('boolean');
      expect(isInitialized).equals(false);
    });

    it('should include property isSetup as a boolean equal to false', () => {
      const isSetup = issuer.isSetup;
      expect(isSetup).to.not.be.null.and.not.be.undefined;
      expect(typeof isSetup).equals('boolean');
      expect(isSetup).to.be.equals(false);
    });

    it('should include property useOptions as an object containing 6 entries', () => {
      const useOptions = issuer.options;
      expect(useOptions).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(useOptions)).to.have.lengthOf.gte(6);
    });
  });

  describe('.initialize()', () => {
    it('should initialize the issuer', async () => {
      await issuer.initializeWeb5();
      expect(issuer.isInitialized).equals(true);
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
      await issuer.setupDwn();
      expect(issuer.isSetup).equals(true);
    });
  });
});