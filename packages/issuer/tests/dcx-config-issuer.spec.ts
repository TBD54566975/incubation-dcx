import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expect } from 'chai';
import { dcxConfig } from '@dcx-protocol/common';

process.env.NODE_ENV = 'test';
const issuerConfig = dcxConfig.issuer;

describe('dcxConfig.issuer', () => {
  describe('defines configuration for both sides of the protocol using env vars and static vars', () => {
    it('should contain property cursorFile as a string', () => {
      const cursorFile = issuerConfig.cursorFile;
      expect(cursorFile).to.not.be.null.and.not.be.undefined;
      expect(cursorFile).to.be.a('string');
    });

    it('should contain property lastRecordIdFile as a string', () => {
      const lastRecordIdFile = issuerConfig.lastRecordIdFile;
      expect(lastRecordIdFile).to.not.be.null.and.not.be.undefined;
      expect(lastRecordIdFile).to.be.a('string');
    });

    it('should contain property agentDataPath as a string', () => {
      const agentDataPath = issuerConfig.agentDataPath;
      expect(agentDataPath).to.not.be.null.and.not.be.undefined;
      expect(agentDataPath).to.be.a('string');
    });

    it('should contain property web5Password as a string', () => {
      const web5Password = issuerConfig.web5Password;
      expect(web5Password).to.not.be.null.and.not.be.undefined;
      expect(web5Password).to.be.a('string');
    });

    it('should contain property web5RecoveryPhrase as a string', () => {
      const web5RecoveryPhrase = issuerConfig.web5RecoveryPhrase;
      expect(web5RecoveryPhrase).to.not.be.null.and.not.be.undefined;
      expect(web5RecoveryPhrase).to.be.a('string');
    });
  });
});
