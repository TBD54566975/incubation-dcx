import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { dcxConfig, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { Protocol, Web5 } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { expect } from 'chai';
import { DcxApplicant } from '../src/index.js';

process.env.NODE_ENV = 'test';

describe('DcxApplicant', () => {
  const applicant = new DcxApplicant({
    config : {
      ...dcxConfig,
      dwnEndpoints : ['http://localhost:3000'],
      applicant    : {
        web5Password       : process.env.APPLICANT_WEB5_PASSWORD ?? Mnemonic.createPassword(),
        web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
      }
    }
  });

  after(async () => {
    await FileSystem.rm('DATA');
  });

  describe('applicant = new DcxApplicant({ ... })', () => {
    it('should contain property applicant.status.initialized as a boolean equal to false', () => {
      expect(applicant.status.initialized).to.be.a('boolean').and.to.be.false;
    });

    it('should contain property applicant.status.setup as a boolean equal to false', () => {
      expect(applicant.status.setup).to.be.a('boolean').and.to.be.false;
    });

    it('should contain property applicant.options as an object containing 6 entries', () => {
      expect(applicant.options).to.be.an('object');
      expect(Object.entries(applicant.options)).to.have.lengthOf.gte(6);
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
        expect(protocol).to.be.instanceof(Protocol);
        expect(status).to.be.an('object');

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
});