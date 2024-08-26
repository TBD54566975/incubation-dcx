import { DcxAgent, dcxConfig, DcxIdentityVault, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { DcxIssuer } from '../src/index.js';

process.env.NODE_ENV = 'test';

describe('issuer = new DcxIssuer({ ... })', () => {
  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__');
  });

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
  const status = issuer.status;
  const options = issuer.options;

  // Check issuer property.status
  describe('issuer.status', () => {
    // Check issuer.status property "initialized"
    it('should contain property "initialized" as a boolean equal to false', () => {
      expect(status).to.have.property('initialized').that.is.a('boolean').and.to.be.false;
    });

    // Check issuer.status property "setup"
    it('should contain property "setup" as a boolean equal to false', () => {
      expect(status).to.have.property('setup').that.is.a('boolean').and.to.be.false;
    });

    // Check issuer.status property "error"
    it('should contain property "options" as an object containing 6 entries', () => {
      expect(options).to.be.an('object');
      expect(Object.entries(options)).to.have.lengthOf.gte(6);
    });
  });

  /**
   * @property {array} issuer.options.handlers
   * @property {array} issuer.options.providers
   * @property {array} issuer.options.manifests
   * @property {array} issuer.options.issuers
   * @property {array} issuer.options.gateways
   * @property {array} issuer.options.dwns
   */
  describe('issuer.options', () => {
    // Check issuer.options property "handlers"
    it('should contain an array property "handlers" with length >= 0', () => {
      expect(options).to.have.property('handlers').that.is.an('array').and.has.lengthOf.gte(0);
    });

    // Check issuer.options property "providers"
    it('should contain an array property "providers" with length >= 0', () => {
      expect(options).to.have.property('providers').that.is.an('array').and.has.lengthOf.gte(0);
    });

    // Check issuer.options property "manifests"
    it('should contain an array property "manifests" with length >= 3', () => {
      expect(options).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(1);
    });

    // Check issuer.options property "issuers"
    it('should contain an array property "issuers" with length >= 2', () => {
      expect(options).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(1);
    });

    // Check issuer.options property "gateways"
    it('should contain an array property "gateways" with length >= 1', () => {
      expect(options).to.have.property('gateways').that.is.an('array').and.has.lengthOf.gte(1);
    });

    // Check issuer.options property "dwns"
    it('should contain an array property "dwns" with length >= 1', () => {
      expect(options).to.have.property('dwns').that.is.an('array').and.has.lengthOf.gte(1);
    });
  });

  /**
   * @async @method issuer.initialize()
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
   * @async @method issuer.initialize()
   */
  describe('await issuer.setup()', () => {
    // Check issuer.setup()
    it('should setup the issuer protocol in local and remote dwn', async () => {
      await issuer.setup();
      expect(issuer.status.setup).equals(true);
    });
  });
});