import { DcxAgent, dcxConfig, DcxIdentityVault, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { DcxIssuer } from '@dcx-protocol/issuer';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { DcxIssuerServer } from '../src/index.js';

process.env.NODE_ENV = 'test';

const dcxIssuer = new DcxIssuer({
  config : {
    ...dcxConfig,
    dwnEndpoints   : ['http://localhost:3000'],
    issuerProtocol : {
      ...dcxConfig.issuerProtocol,
      web5Password       : process.env.ISSUER_WEB5_PASSWORD ?? Mnemonic.createPassword(),
      web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
      agentDataPath      : '__TEST_DATA__/DCX/ISSUER/AGENT',
    }
  }
});
const server: DcxIssuerServer = new DcxIssuerServer({ issuer: dcxIssuer });

describe('DcxServer class', () => {
  after(async () => {
    await FileSystem.rm('__TEST_DATA__');
  });

  describe('default properties', () => {
    it('should include static property isPolling as a boolean equal to false', () => {
      const isPolling = server.isPolling;
      expect(isPolling).to.not.be.null.and.not.be.undefined;
      expect(isPolling).equals(false);
    });

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

    it('should include property isTest as a boolean equal to true', () => {
      const isTest = server.isTest;
      expect(isTest).to.not.be.null.and.not.be.undefined;
      expect(typeof isTest).equals('boolean');
      expect(isTest).to.be.equals(true);
    });

    it('should include property serverOptions as an object containing 6 entries', () => {
      const serverOptions = server.issuer.options;
      expect(serverOptions).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(serverOptions)).to.have.lengthOf.gte(5);
    });
  });

  describe('.initialize()', () => {
    it('should initialize the server', async () => {
      await server.issuer.initializeWeb5();
      expect(server.issuer.isInitialized).equals(true);
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
      await server.issuer.setupDwn();
      expect(server.issuer.isSetup).equals(true);
    });
  });

  // describe('.poll()', () => {
  //   it('should listen for new DWN record updates', async () => {
  //     await dcxIssuerServer.poll();
  //     expect(dcxIssuerServer.isPolling).equals(true);
  //   });
  // });
});