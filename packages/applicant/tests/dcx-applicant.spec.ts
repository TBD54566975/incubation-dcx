import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { dcxConfig, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { Protocol, Web5 } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { expect } from 'chai';
import { DcxApplicant } from '../src/index.js';

process.env.NODE_ENV = 'test';

const applicant = new DcxApplicant({
  config : {
    ...dcxConfig,
    dwnEndpoints      : ['http://localhost:3000'],
    applicant    : {
      web5Password       : process.env.APPLICANT_WEB5_PASSWORD ?? Mnemonic.createPassword(),
      web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
    }
  }
});

describe('DcxApplicant class', () => {

  afterEach(async () => {
    await FileSystem.rm('DATA');
  });

  describe('has default properties that', () => {
    it('should include static property isSetup as a boolean equal to false', () => {
      const isSetup = applicant.isSetup;
      expect(isSetup).to.not.be.null.and.not.be.undefined;
      expect(isSetup).equals(false);
    });

    it('should include property isInitialized as a boolean equal to false', () => {
      const isInitialized = applicant.isInitialized;
      expect(isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof isInitialized).equals('boolean');
      expect(isInitialized).equals(false);
    });

    it('should include property options as an object containing 6 entries', () => {
      const options = applicant.options;
      expect(options).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(options)).to.have.lengthOf.gte(6);
    });

    describe('.initializeWeb5()', () => {
      it('should initialize the applicant web5 connection', async () => {
        await applicant.initializeWeb5();
        expect(applicant.isInitialized).equals(true);
      });

      it('should initialize the DcxApplicant', () => {
        expect(applicant.web5).to.not.be.null.and.not.be.undefined;
        expect(applicant.web5).to.be.instanceof(Web5);

        expect(applicant.agent).to.not.be.null.and.not.be.undefined;
        expect(applicant.agent).to.be.instanceof(Web5UserAgent);
      });
    });

    describe('applicant.setupDwn()', () => {
      it('should setup the remote DWN', async () => {
        await applicant.setupDwn();
        expect(applicant.isSetup).equals(true);
      });
    });

    describe('applicant.queryProtocols()', () => {
      it('should query the remote DWN for protocols', async () => {
        const { protocols } = await applicant.queryProtocols();
        expect(protocols).to.not.be.null.and.not.be.undefined;
        expect(protocols).to.be.instanceof(Array);
      });
    });

    describe('applicant.configureProtocols()', () => {
      it('should configure the applicant protocol in the remote DWN', async () => {
        const { status, protocol } = await applicant.configureProtocols();
        expect(protocol).to.not.be.null.and.not.be.undefined;
        expect(protocol).to.be.instanceof(Protocol);
        const { code, detail } = status;
        expect(status).to.not.be.null.and.not.be.undefined;
        expect(typeof code).to.equal('number');
        expect(code).to.equals(202);
        expect(typeof detail).to.equal('string');
        expect(detail).to.equals('Accepted');
      });
    });

    describe('applicant.queryRecords()', () => {
      it('should query the remote DWN for records', async () => {
        const { records } = await applicant.queryRecords({ protocolPath: 'application/response' });
        expect(records).to.not.be.null.and.not.be.undefined;
        expect(records).to.be.instanceof(Array);
      });
    });
  });
});