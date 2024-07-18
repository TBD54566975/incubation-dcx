import { expect } from 'chai';
import {DcxIdentityVault} from '../src/core/identity-vault.js';
;
describe('DcxIdentityVault', () => {
  it('should be constructed', () => {
    const agentVault = new DcxIdentityVault();
    expect(agentVault).to.not.be.undefined;
    expect(agentVault).to.be.instanceof(DcxIdentityVault);
  });
});