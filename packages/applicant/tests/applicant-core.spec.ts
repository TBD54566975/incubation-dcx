import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { DcxAgent, DcxIdentityVault, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { applicantConfig, ApplicantCore } from '../src/index.js';

describe('ApplicantServer class', () => {
  applicantConfig.DCX_ENV = process.env.NODE_ENV ?? 'test';

  const dcxApplicant = new ApplicantCore({
    config: {
      ...applicantConfig,
      web5Password       : process.env.APPLICANT_WEB5_PASSWORD ?? Mnemonic.createPassword(),
      web5RecoveryPhrase : process.env.APPLICANT_WEB5_RECOVERY_PHRASE ?? Mnemonic.createRecoveryPhrase(),
      agentDataPath      : '__TEST_DATA__/DCX/APPLICANT/AGENT',
    }
  });

  after(async () => {
    await FileSystem.rmdir('__TEST_DATA__', { recursive: true, force: true });
  });

  describe('has default properties that', () => {
    it('should include static property _isSetup as a boolean equal to false', () => {
      const _isSetup = dcxApplicant._isSetup;
      expect(_isSetup).to.not.be.null.and.not.be.undefined;
      expect(_isSetup).equals(false);
    });

    it('should include property _isInitialized as a boolean equal to false', () => {
      const _isInitialized = dcxApplicant._isInitialized;
      expect(_isInitialized).to.not.be.null.and.not.be.undefined;
      expect(typeof _isInitialized).equals('boolean');
      expect(_isInitialized).equals(false);
    });

    it('should include property options as an object containing 6 entries', () => {
      const options = dcxApplicant.options;
      expect(options).to.not.be.null.and.not.be.undefined;
      expect(Object.entries(options)).to.have.lengthOf.gte(6);
    });

    describe('.initializeWeb5()', () => {
      it('should initialize the dcxApplicant web5 connection', async () => {
        await dcxApplicant.initializeWeb5();
        expect(dcxApplicant._isInitialized).equals(true);
      });

      it('should initialize the DcxApplicant', () => {
        expect(DcxApplicant.web5).to.not.be.null.and.not.be.undefined;
        expect(DcxApplicant.web5).to.be.instanceof(Web5);

        expect(DcxApplicant.agent).to.not.be.null.and.not.be.undefined;
        expect(DcxApplicant.agent).to.be.instanceof(DcxAgent);

        expect(DcxApplicant.agentVault).to.not.be.null.and.not.be.undefined;
        expect(DcxApplicant.agentVault).to.be.instanceof(DcxIdentityVault);
      });
    });

    describe('.setupDwn()', () => {
      it('should setup the remote DWN', async () => {
        await dcxApplicant.setupDwn();
        expect(dcxApplicant._isSetup).equals(true);
      });
    });
  });
});