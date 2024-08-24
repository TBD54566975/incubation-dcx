import { LevelStore, MemoryStore } from '@web5/common';
import { expect } from 'chai';
import { DcxIdentityVault, FileSystem } from '../src/index.js';

describe('DcxIdentityVault class', () => {
  const location = '__TEST_DATA__/DCX_COMMON/AGENT/DATASTORE';

  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__', { recursive: true, force: true });
  });

  describe('takes two constructor arguments', () => {
    it('should initialize successfully with default IdentityVaultParams', () => {
      const defaultVault = new DcxIdentityVault();
      expect(defaultVault).to.be.instanceof(DcxIdentityVault);
      expect(defaultVault).to.have.property('store');
      expect(defaultVault).to.have.property('keyDerivationWorkFactor');
      expect(defaultVault).to.have.property('contentEncryptionKey');
    });

    it('should initialize successfully with default IdentityVaultParams', () => {
      const levelVault = new DcxIdentityVault({ store: new MemoryStore<string, string>() });
      expect(levelVault).to.be.instanceof(DcxIdentityVault);
      expect(levelVault).to.have.property('store');
      expect(levelVault).to.have.property('keyDerivationWorkFactor');
      expect(levelVault).to.have.property('contentEncryptionKey');
    });

    it('should initialize successfully with custom IdentityVaultParams', () => {
      const customAgentVault = new DcxIdentityVault({
        keyDerivationWorkFactor : 420_000,
        store                   : new LevelStore({ location }),
      });
      expect(customAgentVault).to.be.instanceof(DcxIdentityVault);
      expect(customAgentVault).to.have.property('store');
      expect(customAgentVault).to.have.property('keyDerivationWorkFactor');
      expect(customAgentVault).to.have.property('contentEncryptionKey');
    });
  });
});