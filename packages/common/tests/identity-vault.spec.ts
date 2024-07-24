import { expect } from 'chai';
import { DcxIdentityVault } from '../src/dcx-identity-vault.js';

describe('DcxIdentityVault', () => {
  it('should initialize with default parameters', () => {
    const agentVault = new DcxIdentityVault();
    expect(agentVault).to.not.be.undefined;
    expect(agentVault).to.be.instanceof(DcxIdentityVault);
  });
});