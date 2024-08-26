import { expect } from 'chai';
import { DcxIdentityVault, Mnemonic, FileSystem } from '../src/index.js';
import { LevelStore, MemoryStore } from '@web5/common';

type DxcxIdentityVaultStatus = { initialized: boolean; lastBackup: string | null; lastRestore: string | null };

process.env.NODE_ENV = 'test';

describe('DcxIdentityVault', () => {
  const location = '__TEST_DATA__/DCX/AGENT/VAULT_STORE';
  const dwnEndpoints = ['http://localhost:3000'];
  let recoveryPhrase = Mnemonic.createRecoveryPhrase();
  let password = Mnemonic.createPassword();
  let vaultStatus: DxcxIdentityVaultStatus;
  let returnedRecoveryPhrase: string;

  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__', { recursive: true, force: true });
  });

  describe(`defaultVault = new DcxIdentityVault({ location: ${location} })`, () => {
    recoveryPhrase = Mnemonic.createRecoveryPhrase();
    password = Mnemonic.createPassword();
    const defaultVault = new DcxIdentityVault({ location });

    it('should be instanceof DcxIdentityVault', () => {
      expect(defaultVault).to.be.instanceof(DcxIdentityVault);
    });

    it('should have property "store" as instanceof LevelStore', () => {
      expect(defaultVault).to.have.property('store').that.is.instanceof(LevelStore);
    });

    it('should have property "keyDerivationWorkFactor" as number equal to 210_000', async () => {
      expect(defaultVault).to.have.property('keyDerivationWorkFactor').that.is.a('number').and.equals(210_000);
    });

    describe('await defaultVault.getStatus()', () => {
      it('should have status of initialized=false lastBackup=null lastRestore=null', async () => {
        vaultStatus = await defaultVault.getStatus();
        expect(vaultStatus.initialized).to.be.false;
        expect(vaultStatus.lastBackup).to.be.null;
        expect(vaultStatus.lastRestore).to.be.null;
      });
    });

    describe('await defaultVault.initialize({ password, recoveryPhrase, dwnEndpoints })', () => {
      it('should initialize successfully with params { password, recoveryPhrase, dwnEndpoints }', async () => {
        returnedRecoveryPhrase = await defaultVault.initialize({ password, recoveryPhrase, dwnEndpoints });
      });

      it('should return a matching recoveryPhrase', async () => {
        expect(recoveryPhrase).to.equal(returnedRecoveryPhrase);
      });

      it('should have property "contentEncryptionKey" after initialization', async () => {
        expect(defaultVault).to.have.property('contentEncryptionKey');
      });

      it('should have updated status of initialized=true lastBackup=null lastRestore=null', async () => {
        vaultStatus = await defaultVault.getStatus();
        expect(vaultStatus.initialized).to.be.true;
        expect(vaultStatus.lastBackup).to.be.null;
        expect(vaultStatus.lastRestore).to.be.null;
      });
    });
  });

  describe(`customVault = new DcxIdentityVault({ store: new MemoryStore(), location: ${location} })`, () => {
    recoveryPhrase = Mnemonic.createRecoveryPhrase();
    password = Mnemonic.createPassword();
    const customVault = new DcxIdentityVault({ store: new MemoryStore(), location });

    it('should be instanceof DcxIdentityVault', () => {
      expect(customVault).to.be.instanceof(DcxIdentityVault);
    });

    it('should have property "store" as instanceof MemoryStore', () => {
      expect(customVault).to.have.property('store').that.is.instanceof(MemoryStore);
    });

    it('should have property "keyDerivationWorkFactor" as number equal to 210_000', async () => {
      expect(customVault).to.have.property('keyDerivationWorkFactor').that.is.a('number').and.equals(210_000);
    });

    describe('await customVault.getStatus()', () => {
      it('should have status of initialized=false lastBackup=null lastRestore=null', async () => {
        vaultStatus = await customVault.getStatus();
        expect(vaultStatus.initialized).to.be.false;
        expect(vaultStatus.lastBackup).to.be.null;
        expect(vaultStatus.lastRestore).to.be.null;
      });
    });

    describe('await customVault.initialize({ password, recoveryPhrase, dwnEndpoints })', () => {
      it('should initialize successfully with params { password, recoveryPhrase, dwnEndpoints }', async () => {
        returnedRecoveryPhrase = await customVault.initialize({ password, recoveryPhrase, dwnEndpoints });
      });

      it('should return a matching recoveryPhrase', () => {
        expect(recoveryPhrase).to.equal(returnedRecoveryPhrase);
      });

      it('should have property "contentEncryptionKey" after initialization', () => {
        expect(customVault).to.have.property('contentEncryptionKey');
      });

      it('should have updated status of initialized=true lastBackup=null lastRestore=null', async () => {
        vaultStatus = await customVault.getStatus();
        expect(vaultStatus.initialized).to.be.true;
        expect(vaultStatus.lastBackup).to.be.null;
        expect(vaultStatus.lastRestore).to.be.null;
      });
    });
  });
});