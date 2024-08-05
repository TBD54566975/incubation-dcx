import { LevelStore } from '@web5/common';
import { expect } from 'chai';
import { DcxIdentityVault } from '../src/dcx-identity-vault.js';

describe('DcxIdentityVault class', () => {
  describe('takes two constructor arguments', () => {
    it('should initialize successfully with default IdentityVaultParams', () => {
      const defaultVault = new DcxIdentityVault();
      expect(defaultVault).to.not.be.null.and.not.be.undefined;
      expect(defaultVault).to.be.instanceof(DcxIdentityVault);
    });

    it('should initialize successfully with default IdentityVaultParams', () => {
      const levelVault = new DcxIdentityVault({
        store: new LevelStore({ location: '__TEST_DATA__/DCX_COMMON/AGENT/DATASTORE'
        }) });
      expect(levelVault).to.not.be.null.and.not.be.undefined;
      expect(levelVault).to.be.instanceof(DcxIdentityVault);
    });

    it('should initialize successfully with custom IdentityVaultParams', () => {
      const customAgentVault = new DcxIdentityVault({
        keyDerivationWorkFactor : 420_000,
        store                   : new LevelStore({ location: '__TEST_DATA__/DCX_COMMON/AGENT/DATASTORE' }),
      });
      expect(customAgentVault).to.not.be.null.and.not.be.undefined;
      expect(customAgentVault).to.be.instanceof(DcxIdentityVault);
    });
  });
});