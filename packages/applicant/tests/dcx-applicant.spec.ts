import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { FileSystem } from '@dcx-protocol/common';
import { Protocol, Web5 } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { expect } from 'chai';
import { applicantConfig } from '../src/dcx-applicant-config.js';
import { DcxApplicant } from '../src/index.js';

process.env.NODE_ENV = 'test';

describe('applicant = new DcxApplicant({ config: applicantConfig })', () => {
  applicantConfig.dwns = ['http://localhost:3000'];
  const applicant = new DcxApplicant({ config: applicantConfig });

  after(async () => {
    await FileSystem.rm('DATA');
  });

  /**
   * @description the status object for the DcxApplicant
   * @type {object} applicant.status; see {@link applicant.status}
   * @property {boolean} applicant.status.initialized
   * @property {boolean} applicant.status.setup
   */
  describe('applicant.status', () => {
    // Check applicant.status property "initialized"
    it('should contain property "initialized" as a boolean equal to false', () => {
      expect(applicant.status).to.have.property('initialized').that.is.a('boolean').and.to.be.false;
    });

    // Check applicant.status property "setup"
    it('should contain property "setup" as a boolean equal to false', () => {
      expect(applicant.status).to.have.property('setup').that.is.a('boolean').and.to.be.false;
    });
  });

  /**
   * @description the configuration object for the DcxApplicant
   * @type {object} see {@link applicant.config}
   * @property {boolean} applicant.config.web5Password
   * @property {boolean} applicant.config.web5RecoveryPhrase
   * @property {array} applicant.config.handlers
   * @property {array} applicant.config.providers
   * @property {array} applicant.config.manifests
   * @property {array} applicant.config.issuers
   * @property {array} applicant.config.gateways
   * @property {array} applicant.config.dwns
   */
  describe('applicant.config', () => {
    // Check applicant.config property "web5Password"
    it('should contain property "web5Password" as a string', () => {
      expect(applicant.config.web5Password).to.be.a('string');
    });

    // Check applicant.config property "web5RecoveryPhrase"
    it('should contain property "web5RecoveryPhrase" as a string', () => {
      expect(applicant.config.web5RecoveryPhrase).to.be.a('string');
    });

    // Check applicant.config property "handlers"
    it('should contain an array property "handlers" with length >= 0', () => {
      expect(applicant.config).to.have.property('handlers').that.is.an('array').and.has.lengthOf.gte(0);
    });

    // Check applicant.config property "providers"
    it('should contain an array property "providers" with length >= 0', () => {
      expect(applicant.config).to.have.property('providers').that.is.an('array').and.has.lengthOf.gte(0);
    });

    // Check applicant.config property "manifests"
    it('should contain an array property "manifests" with length >= 3', () => {
      expect(applicant.config).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(1);
    });

    // Check applicant.config property "issuers"
    it('should contain an array property "issuers" with length >= 2', () => {
      expect(applicant.config).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(1);
    });

    // Check applicant.config property "gateways"
    it('should contain an array property "gateways" with length >= 1', () => {
      expect(applicant.config).to.have.property('gateways').that.is.an('array').and.has.lengthOf.gte(1);
    });

    // Check applicant.config property "dwns"
    it('should contain an array property "dwns" with length >= 1', () => {
      expect(applicant.config).to.have.property('dwns').that.is.an('array').and.has.lengthOf.gte(1);
    });
  });

  describe('await applicant.initialize()', () => {
    it('should initialize applicant properties "web5" and "agent"', async () => {
      await applicant.initialize();
      expect(applicant.status.initialized).to.be.true;
      expect(applicant.web5).to.be.instanceof(Web5);
      expect(applicant.agent).to.be.instanceof(Web5UserAgent);
    });
  });

  describe('await applicant.setup()', () => {
    it('should setup the applicant dwn', async () => {
      await applicant.setup();
      expect(applicant.status.setup).to.be.true;
    });
  });

  describe('await applicant.queryProtocols()', () => {
    it('should query the applicant dwn for protocols', async () => {
      const { protocols } = await applicant.queryProtocols();
      expect(protocols).to.be.instanceof(Array);
    });
  });

  describe('await applicant.configureProtocols()', () => {
    it('should configure the applicant protocol in the applicant dwn', async () => {
      const { status, protocol } = await applicant.configureProtocols();
      expect(status).to.be.an('object');
      expect(protocol).to.be.instanceof(Protocol);

      const { code, detail } = status;
      expect(code).to.be.a('number').and.to.equal(202);
      expect(detail).to.be.a('string').and.to.equal('Accepted');
    });
  });

  describe('await applicant.queryRecords()', () => {
    it('should query the applicant dwn for records', async () => {
      const { records } = await applicant.queryRecords({ protocolPath: 'application/response' });
      expect(records).to.be.instanceof(Array);
    });
  });
});