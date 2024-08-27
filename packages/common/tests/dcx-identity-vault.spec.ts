import { expect } from 'chai';
import { DcxIdentityVault, Mnemonic, FileSystem } from '../src/index.js';
import { LevelStore, MemoryStore } from '@web5/common';

type DxcxIdentityVaultStatus = { initialized: boolean; lastBackup: string | null; lastRestore: string | null };

process.env.NODE_ENV = 'test';

describe('DcxIdentityVault', () => {
  const location = '__TEST_DATA__/DCX/COMMON/AGENT/VAULT_STORE';
  const dwnEndpoints = ['http://localhost:3000'];
  let recoveryPhrase = Mnemonic.createRecoveryPhrase();
  let password = Mnemonic.createPassword();
  let vaultStatus: DxcxIdentityVaultStatus;
  let returnedRecoveryPhrase: string;

  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__', { recursive: true, force: true });
  });

  describe(`agentVault = new DcxIdentityVault({ location: ${location} })`, () => {
    recoveryPhrase = Mnemonic.createRecoveryPhrase();
    password = Mnemonic.createPassword();
    const agentVault = new DcxIdentityVault({ location });

    it('should be instanceof DcxIdentityVault', () => {
      expect(agentVault).to.be.instanceof(DcxIdentityVault);
    });

    it('should have property "store" as instanceof LevelStore', () => {
      expect(agentVault).to.have.property('store').that.is.instanceof(LevelStore);
    });

    it('should have property "keyDerivationWorkFactor" as number equal to 210_000', async () => {
      expect(agentVault).to.have.property('keyDerivationWorkFactor').that.is.a('number').and.equals(210_000);
    });

    describe('await agentVault.getStatus()', () => {
      it('should have status of initialized=false lastBackup=null lastRestore=null', async () => {
        vaultStatus = await agentVault.getStatus();
        expect(vaultStatus.initialized).to.be.false;
        expect(vaultStatus.lastBackup).to.be.null;
        expect(vaultStatus.lastRestore).to.be.null;
      });
    });

    describe('await agentVault.initialize({ password, recoveryPhrase, dwnEndpoints })', () => {
      it('should initialize successfully', async () => {
        returnedRecoveryPhrase = await agentVault.initialize({ password, recoveryPhrase, dwnEndpoints });
      });

      it('should return a matching recoveryPhrase', async () => {
        expect(returnedRecoveryPhrase).to.equal(recoveryPhrase);
      });

      it('should have property "contentEncryptionKey" after initialization', async () => {
        expect(agentVault).to.have.property('contentEncryptionKey');
      });

      it('should have updated status of initialized=true lastBackup=null lastRestore=null', async () => {
        vaultStatus = await agentVault.getStatus();
        expect(vaultStatus.initialized).to.be.true;
        expect(vaultStatus.lastBackup).to.be.null;
        expect(vaultStatus.lastRestore).to.be.null;
      });
    });
  });

  describe(`memoryVault = new DcxIdentityVault({ store: new MemoryStore(), location: ${location} })`, () => {
    recoveryPhrase = Mnemonic.createRecoveryPhrase();
    password = Mnemonic.createPassword();
    const memoryVault = new DcxIdentityVault({ store: new MemoryStore(), location });

    it('should be instanceof DcxIdentityVault', () => {
      expect(memoryVault).to.be.instanceof(DcxIdentityVault);
    });

    it('should have property "store" as instanceof MemoryStore', () => {
      expect(memoryVault).to.have.property('store').that.is.instanceof(MemoryStore);
    });

    it('should have property "keyDerivationWorkFactor" as number equal to 210_000', async () => {
      expect(memoryVault).to.have.property('keyDerivationWorkFactor').that.is.a('number').and.equals(210_000);
    });

    describe('await memoryVault.getStatus()', () => {
      it('should have status of initialized=false lastBackup=null lastRestore=null', async () => {
        vaultStatus = await memoryVault.getStatus();
        expect(vaultStatus.initialized).to.be.false;
        expect(vaultStatus.lastBackup).to.be.null;
        expect(vaultStatus.lastRestore).to.be.null;
      });
    });

    describe('await memoryVault.initialize({ password, recoveryPhrase, dwnEndpoints })', () => {
      it('should initialize successfully with params { password, recoveryPhrase, dwnEndpoints }', async () => {
        returnedRecoveryPhrase = await memoryVault.initialize({ password, recoveryPhrase, dwnEndpoints });
      });

      it('should return a matching recoveryPhrase', () => {
        expect(recoveryPhrase).to.equal(returnedRecoveryPhrase);
      });

      it('should have property "contentEncryptionKey" after initialization', () => {
        expect(memoryVault).to.have.property('contentEncryptionKey');
      });

      it('should have updated status of initialized=true lastBackup=null lastRestore=null', async () => {
        vaultStatus = await memoryVault.getStatus();
        expect(vaultStatus.initialized).to.be.true;
        expect(vaultStatus.lastBackup).to.be.null;
        expect(vaultStatus.lastRestore).to.be.null;
      });
    });
  });
});