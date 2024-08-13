import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { dcxConfig, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import { expect } from 'chai';
import { DcxApplicant } from '../src/index.js';

process.env.NODE_ENV = 'test';

describe('DcxApplicant class', () => {

  const dcxApplicant = new DcxApplicant({
    config : {
      ...dcxConfig,
      web5Password       : process.env.APPLICANT_WEB5_PASSWORD ?? Mnemonic.createPassword(),
      web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
      agentDataPath      : 'DATA/DCX/APPLICANT/AGENT',
    }
  });

  after(async () => {
    await FileSystem.rm('DATA');
  });

  describe('has default properties that', () => {
    it('should include static property isSetup as a boolean equal to false', () => {
      const isSetup = dcxApplicant.isSetup;
      expect(isSetup).to.not.be.null.and.not.be.undefined;
      expect(isSetup).equals(false);
    });

    it('should include property isInitialized as a boolean equal to false', () => {
      const isInitialized = dcxApplicant.isInitialized;
      expect(isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof isInitialized).equals('boolean');
      expect(isInitialized).equals(false);
    });

    it('should include property options as an object containing 6 entries', () => {
      const options = dcxApplicant.options;
      expect(options).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(options)).to.have.lengthOf.gte(6);
    });

    describe('.initializeWeb5()', () => {
      it('should initialize the dcxApplicant web5 connection', async () => {
        await dcxApplicant.initializeWeb5();
        expect(dcxApplicant.isInitialized).equals(true);
      });

      it('should initialize the DcxApplicant', () => {
        expect(DcxApplicant.web5).to.not.be.null.and.not.be.undefined;
        expect(DcxApplicant.web5).to.be.instanceof(Web5);

        expect(DcxApplicant.agent).to.not.be.null.and.not.be.undefined;
        expect(DcxApplicant.agent).to.be.instanceof(Web5UserAgent);
      });
    });

    describe('.setupDwn()', () => {
      it('should setup the remote DWN', async () => {
        await dcxApplicant.setupDwn();
        expect(dcxApplicant.isSetup).equals(true);
      });
    });
  });
});