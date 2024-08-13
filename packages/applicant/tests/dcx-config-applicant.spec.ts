import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expect } from 'chai';
import { dcxConfig } from '@dcx-protocol/common';

process.env.NODE_ENV = 'test';
const applicantConfig = dcxConfig.applicantProtocol;

describe('dcxConfig.applicantProtocol', () => {
  describe('defines configuration for both sides of the protocol using env vars and static vars', () => {
    it('should contain property web5Password as a string', () => {
      const web5Password = applicantConfig.web5Password;
      expect(web5Password).to.not.be.null.and.not.be.undefined;
      expect(web5Password).to.be.a('string');
    });

    it('should contain property web5RecoveryPhrase as a string', () => {
      const web5RecoveryPhrase = applicantConfig.web5RecoveryPhrase;
      expect(web5RecoveryPhrase).to.not.be.null.and.not.be.undefined;
      expect(web5RecoveryPhrase).to.be.a('string');
    });
  });
});
