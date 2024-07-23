import { expect } from 'chai';
import {DcxAgent} from '../src/core/agent.js';
import {DcxIdentityVault} from '../src/core/identity-vault.js';

describe('DcxAgent', () => {
  it('should be constructed', async () => {
    const agentVault = new DcxIdentityVault();
    expect(agentVault).to.not.be.undefined;
    expect(agentVault).to.be.instanceof(DcxIdentityVault);

    const agent = await DcxAgent.create({ agentVault });
    expect(agent).to.not.be.undefined;
    expect(agent).to.be.instanceof(DcxAgent);
  });
});