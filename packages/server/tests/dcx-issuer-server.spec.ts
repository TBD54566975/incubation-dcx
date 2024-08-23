import { DcxAgent, dcxConfig, DcxIdentityVault, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { DcxIssuer } from '@dcx-protocol/issuer';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { DcxServer } from '../src/index.js';

process.env.NODE_ENV = 'test';

const issuer = new DcxIssuer({
  config : {
    ...dcxConfig,
    dwnEndpoints   : ['http://localhost:3000'],
    issuer       : {
      ...dcxConfig.issuer,
      web5Password       : process.env.ISSUER_WEB5_PASSWORD ?? Mnemonic.createPassword(),
      web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
      agentDataPath      : '__TEST_DATA__/DCX/ISSUER/AGENT',
    }
  }
});
const server: DcxServer = new DcxServer({ issuer });

describe('DcxServer class', () => {
  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__');
  });

  describe('default properties', () => {
    it('should include static property running as a boolean equal to false', () => {
      const running = server.running;
      expect(running).to.not.be.null.and.not.be.undefined;
      expect(running).equals(false);
    });

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

    it('should include property testing as a boolean equal to true', () => {
      const testing = server.testing;
      expect(testing).to.not.be.null.and.not.be.undefined;
      expect(typeof testing).equals('boolean');
      expect(testing).to.be.equals(true);
    });

    it('should include property serverOptions as an object containing 6 entries', () => {
      const serverOptions = server.dcx.options;
      expect(serverOptions).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(serverOptions)).to.have.lengthOf.gte(5);
    });
  });

  describe('.initialize()', () => {
    it('should initialize the server', async () => {
      await server.dcx.initializeWeb5();
      expect(server.dcx.isInitialized).equals(true);
    });

    it('should initialize the DcxManager', () => {
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
      await server.dcx.setupDwn();
      expect(server.dcx.isSetup).equals(true);
    });
  });
});