import { expect } from 'chai';
import { FileSystem, Logger } from '../src/index.js';

describe('FileSystem', () => {
  describe('findFileInProject()', () => {
    it('should find recovery.key', async ()  =>{
      const recoveryKey = await FileSystem.findFileInProject('recovery.key');
      expect(recoveryKey).to.not.be.undefined;
      expect(recoveryKey).to.be.a('string');
      Logger.debug('Found recovery.key!', recoveryKey);
    });

    it('should find password.key', async ()  =>{
      const passwordKey = await FileSystem.findFileInProject('password.key');
      expect(passwordKey).to.not.be.undefined;
      expect(passwordKey).to.be.a('string');
      Logger.debug('Found password.key!', passwordKey);
    });
  });
});