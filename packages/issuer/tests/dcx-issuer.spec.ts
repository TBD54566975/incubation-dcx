import { DcxAgent, DcxIdentityVault, FileSystem } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { DcxIssuer, issuerConfig } from '../src/index.js';

process.env.NODE_ENV = 'test';

describe('issuer = new DcxIssuer({ ... })', () => {
  issuerConfig.agentDataPath = '__TEST_DATA__/DCX/ISSUER/AGENT';
  const issuer: DcxIssuer = new DcxIssuer({ config: issuerConfig });

  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__');
  });

  // Check issuer property.status
  describe('issuer.status', () => {
    // Check issuer.status property "initialized"
    it('should contain property "initialized" as a boolean equal to false', () => {
      expect(issuer.status).to.have.property('initialized').that.is.a('boolean').and.to.be.false;
    });

    // Check issuer.status property "setup"
    it('should contain property "setup" as a boolean equal to false', () => {
      expect(issuer.status).to.have.property('setup').that.is.a('boolean').and.to.be.false;
    });
  });

  /**
   * @description the configuration object for the DcxIssuer
   * @type {object} see {@link issuerConfig}
   * @property {string} issuer.config.cursorFile
   * @property {string} issuer.config.lastRecordIdFile
   * @property {string} issuer.config.agentDataPath
   * @property {boolean} issuer.config.web5Password
   * @property {boolean} issuer.config.web5RecoveryPhrase
   * @property {array} issuer.config.handlers
   * @property {array} issuer.config.providers
   * @property {array} issuer.config.manifests
   * @property {array} issuer.config.issuers
   * @property {array} issuer.config.gateways
   * @property {array} issuer.config.dwns
   */
  describe('issuer.config', () => {
    // Check issuer.config property "cursorFile"
    it('should have property "cursorFile" as a string', () => {
      expect(issuer.config.cursorFile).to.be.a('string');
    });

    // Check issuer.config property "lastRecordIdFile"
    it('should have property "lastRecordIdFile" as a string', () => {
      expect(issuer.config.lastRecordIdFile).to.be.a('string');
    });

    // Check issuer.config property "agentDataPath"
    it('should have property "agentDataPath" as a string', () => {
      expect(issuer.config.agentDataPath).to.be.a('string');
    });

    // Check issuer.config property "web5Password"
    it('should contain property "web5Password" as a string', () => {
      expect(issuer.config.web5Password).to.be.a('boolean').and.to.be.false;
    });

    // Check issuer.config property "web5RecoveryPhrase"
    it('should contain property "web5RecoveryPhrase" as a string', () => {
      expect(issuer.config.web5RecoveryPhrase).to.be.a('boolean').and.to.be.false;
    });

    // Check issuer.config property "handlers"
    it('should contain an array property "handlers" with length >= 0', () => {
      expect(issuer.config).to.have.property('handlers').that.is.an('array').and.has.lengthOf.gte(0);
    });

    // Check issuer.config property "providers"
    it('should contain an array property "providers" with length >= 0', () => {
      expect(issuer.config).to.have.property('providers').that.is.an('array').and.has.lengthOf.gte(0);
    });

    // Check issuer.config property "manifests"
    it('should contain an array property "manifests" with length >= 3', () => {
      expect(issuer.config).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(1);
    });

    // Check issuer.config property "issuers"
    it('should contain an array property "issuers" with length >= 2', () => {
      expect(issuer.config).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(1);
    });

    // Check issuer.config property "gateways"
    it('should contain an array property "gateways" with length >= 1', () => {
      expect(issuer.config).to.have.property('gateways').that.is.an('array').and.has.lengthOf.gte(1);
    });

    // Check issuer.config property "dwns"
    it('should contain an array property "dwns" with length >= 1', () => {
      expect(issuer.config).to.have.property('dwns').that.is.an('array').and.has.lengthOf.gte(1);
    });
  });

  /**
   * @description method to initialize the DcxIssuer
   * @type {method} issuer.initialize(); see {@link DcxIssuer.initialize}
   */
  describe('await issuer.initialize()', () => {
    it('should initialize the DcxIssuer', async () => {
      await issuer.initialize();
      expect(issuer.status.initialized).equals(true);
    });

    it('should initialize the DcxIssuer properties: web5, agent and agentVault', () => {
      expect(issuer.web5).to.be.instanceof(Web5);
      expect(issuer.agent).to.be.instanceof(DcxAgent);
      expect(issuer.agentVault).to.be.instanceof(DcxIdentityVault);
    });
  });

  /**
   * @description method to setup the DcxIssuer Dwn
   * @type {method} issuer.setup(); see {@link DcxIssuer.setup}
   */
  describe('await issuer.setup()', () => {
    // Check issuer.setup()
    it('should setup the issuer protocol in local and remote dwn', async () => {
      await issuer.setup();
      expect(issuer.status.setup).equals(true);
    });
  });
});