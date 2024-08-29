import { expect } from 'chai';
import { DcxIdentityVault, Mnemonic, FileSystem } from '../src/index.js';
import { LevelStore, MemoryStore } from '@web5/common';
import { IdentityVaultBackup } from '@web5/agent';

process.env.NODE_ENV = 'test';

describe('DcxIdentityVault', () => {
  const dwnEndpoints = ['http://localhost:3000'];
  const location = '__VAULT_DATA__/DCX/COMMON/AGENT/VAULT_STORE';
  let vault: DcxIdentityVault;
  let backup: IdentityVaultBackup;

  after(async () => {
    await vault.store.close();
    await FileSystem.rm('__VAULT_DATA__', { recursive: true, force: true });
  });

  describe(`agentVault = new DcxIdentityVault({ location: ${location} })`, () => {
    const agentVault = vault = new DcxIdentityVault({ location });

    const password = Mnemonic.createPassword();
    const recoveryPhrase = Mnemonic.createRecoveryPhrase();

    after(async () => {
      await agentVault.store.close();
    });

    it('should be instanceof DcxIdentityVault', () => {
      expect(agentVault).to.be.instanceof(DcxIdentityVault);
    });

    it('should have property "store" as instanceof LevelStore', () => {
      expect(agentVault).to.have.property('store').that.is.instanceof(LevelStore);
    });

    it('should have property "keyDerivationWorkFactor" as number equal to 210_000', async () => {
      expect(agentVault).to.have.property('keyDerivationWorkFactor').that.is.a('number').and.equals(210_000);
    });

    it('should have status of initialized=false lastBackup=null lastRestore=null', async () => {
      const vaultStatus = await agentVault.getStatus();
      expect(vaultStatus.initialized).to.be.false;
      expect(vaultStatus.lastBackup).to.be.null;
      expect(vaultStatus.lastRestore).to.be.null;
    });

    it('initialize(): should  successfully initialize the agentVault', async () => {
      const initialize = await agentVault.initialize({ password, recoveryPhrase, dwnEndpoints });
      expect(initialize).to.equal(recoveryPhrase);
    });

    it('should have property "contentEncryptionKey" after initialization', () => {
      expect(agentVault).to.have.property('contentEncryptionKey');
    });

    it('getStatus(): should have a new status of initialized=true lastBackup=null lastRestore=null', async () => {
      const vaultStatus = await agentVault.getStatus();
      expect(vaultStatus.initialized).to.be.true;
      expect(vaultStatus.lastBackup).to.be.null;
      expect(vaultStatus.lastRestore).to.be.null;
    });

    it('backup(): should backup the agentVault', async () => {
      backup = await agentVault.backup();
    });

    it('lock(): should lock the agentVault', async () => {
      await agentVault.lock();
    });

    it('unlock(): should unlock the agentVault', async () => {
      await agentVault.unlock({ password });
    });

    it('restore(): should restore the agentVault', async () => {
      await agentVault.restore({ password, backup });
    });
  });


  describe(`memoryVault = new DcxIdentityVault({ store: new MemoryStore() })`, () => {
    const memoryVault = vault = new DcxIdentityVault({ store: new MemoryStore() });
    const password = Mnemonic.createPassword();
    const recoveryPhrase = Mnemonic.createRecoveryPhrase();

    after(async () => {
      await memoryVault.store.close();
    });

    it('should be instanceof DcxIdentityVault', () => {
      expect(memoryVault).to.be.instanceof(DcxIdentityVault);
    });

    it('should have property "store" as instanceof MemoryStore', () => {
      expect(memoryVault).to.have.property('store').that.is.instanceof(MemoryStore);
    });

    it('should have property "keyDerivationWorkFactor" as number equal to 210_000', async () => {
      expect(memoryVault).to.have.property('keyDerivationWorkFactor').that.is.a('number').and.equals(210_000);
    });

    it('should have status of initialized=false lastBackup=null lastRestore=null', async () => {
      const vaultStatus = await memoryVault.getStatus();
      expect(vaultStatus.initialized).to.be.false;
      expect(vaultStatus.lastBackup).to.be.null;
      expect(vaultStatus.lastRestore).to.be.null;
    });

    it('should initialize the memoryVault and return a matching recovery phrase', async () => {
      const initialize = await memoryVault.initialize({ password, recoveryPhrase, dwnEndpoints });
      expect(initialize).to.equal(recoveryPhrase);
    });

    it('should have property "contentEncryptionKey" after initialization', () => {
      expect(memoryVault).to.have.property('contentEncryptionKey');
    });

    it('should have a new status of initialized=true lastBackup=null lastRestore=null', async () => {
      const vaultStatus = await memoryVault.getStatus();
      expect(vaultStatus.initialized).to.be.true;
      expect(vaultStatus.lastBackup).to.be.null;
      expect(vaultStatus.lastRestore).to.be.null;
    });

    it('should backup the memoryVault', async () => {
      backup = await memoryVault.backup();
    });

    it('should lock the memoryVault', async () => {
      await memoryVault.lock();
    });

    it('should unlock the memoryVault', async () => {
      await memoryVault.unlock({ password });
    });

    it('should restore the memoryVault', async () => {
      await memoryVault.restore({ password, backup });
    });
  });
});