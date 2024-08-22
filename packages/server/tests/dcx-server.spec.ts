import { DcxAgent, DcxIdentityVault, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { DcxIssuer } from '@dcx-protocol/issuer';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { DcxServer } from '../src/index.js';

process.env.NODE_ENV = 'test';

const server: DcxServer = new DcxServer();

describe('DcxServer class', () => {
  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__');
  });

  describe('default properties', () => {
    it('should include static property isPolling as a boolean equal to false', () => {
      const isPolling = server.isPolling;
      expect(isPolling).to.not.be.null.and.not.be.undefined;
      expect(isPolling).equals(false);
    });

    it('should include property isInitialized as a boolean equal to false', () => {
      const isInitialized = server.dcx.isInitialized;
      expect(isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof isInitialized).equals('boolean');
      expect(isInitialized).equals(false);
    });

    it('should include property isSetup as a boolean equal to false', () => {
      const isSetup = server.dcx.isSetup;
      expect(isSetup).to.not.be.null.and.not.be.undefined;
      expect(typeof isSetup).equals('boolean');
      expect(isSetup).to.be.equals(false);
    });

    it('should include property isTest as a boolean equal to true', () => {
      const isTest = server.isTest;
      expect(isTest).to.not.be.null.and.not.be.undefined;
      expect(typeof isTest).equals('boolean');
      expect(isTest).to.be.equals(true);
    });

    it('should include property serverOptions as an object containing 6 entries', () => {
      const serverOptions = server.dcx.options;
      expect(serverOptions).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(serverOptions)).to.have.lengthOf.gte(5);
    });
  });

  describe('.initialize()', () => {
    it('should initialize the server', async () => {
      server.dcx.config.issuer.web5Password = Mnemonic.createPassword();
      server.dcx.config.issuer.web5RecoveryPhrase = Mnemonic.createRecoveryPhrase();
      server.dcx.config.issuer.agentDataPath = '__TEST_DATA__/DCX/ISSUER/AGENT';
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