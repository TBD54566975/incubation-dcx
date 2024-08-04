import { expect } from 'chai';
import { DcxAgent } from '../src/dcx-agent.js';
import { DcxIdentityVault } from '../src/dcx-identity-vault.js';

describe('DcxAgent', () => {
  let agentVault: DcxIdentityVault;

  beforeEach(() => {
    agentVault = new DcxIdentityVault();
    expect(agentVault).to.not.be.undefined;
    expect(agentVault).to.be.instanceof(DcxIdentityVault);
  });

  it('should initialize with default parameters', async () => {
    const agent = await DcxAgent.create({ agentVault });
    expect(agent).to.not.be.undefined;
    expect(agent).to.be.instanceof(DcxAgent);
  });
});