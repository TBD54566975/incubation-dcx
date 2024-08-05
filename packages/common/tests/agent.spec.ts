import { BearerDid } from '@web5/dids';
import { expect } from 'chai';
import { config, DcxAgent, DcxIdentityVault, Mnemonic } from '../src/index.js';

describe('DcxAgent class', () => {
  let agentVault: DcxIdentityVault;
  let agent: DcxAgent;
  let password = Mnemonic.createPassword();
  let recoveryPhrase = Mnemonic.createRecoveryPhrase();
  let dwnEndpoints = config.DCX_ENDPOINTS.DWN_ENDPOINTS;

  before(() => {
    agentVault = new DcxIdentityVault();
    expect(agentVault).to.not.be.null.and.not.be.undefined;
    expect(agentVault).to.be.instanceof(DcxIdentityVault);
  });

  describe('.create({ agentVault })', () => {
    it('should return a non-null DcxAgent object', async () => {
      agent = await DcxAgent.create({ dataPath: '__TEST_DATA__/DCX_COMMON/AGENT', agentVault });
      expect(agent).to.not.be.null.and.not.be.undefined;
      expect(agent).to.be.instanceof(DcxAgent);
    });

    it('should return an agent with no agentDid and throw an error upon checking', () => {
      expect(() => agent.agentDid).to.throw(Error, /"agentDid" property is not set/);
    });

    it('should return an agent vault as an instance of DcxIdentityVault', () => {
      expect(agent.vault).to.be.instanceof(DcxIdentityVault);
    });
  });

  describe('.firstLaunch()', () => {
    it('should be true', async () => {
      const firstLaunch = await agent.firstLaunch();
      expect(firstLaunch).to.be.true;
    });
  });

  describe('.initialize({ password, recoveryPhrase, dwnEndpoints })', () => {
    it('should initialize successfully', async () => {
      const initRecoveryPhrase = await agent.initialize({ password, recoveryPhrase, dwnEndpoints });
      expect(initRecoveryPhrase).to.equal(recoveryPhrase);
    });

    it('should have a vault that is initialized', async () => {
      const isInitialized = await agent.vault.isInitialized();
      expect(isInitialized).to.be.true;
    });
  });

  describe('.start({ password })', () => {
    it('should start the agent successfully unlocking the vault', async () => {
      await agent.start({ password });
      const isLocked = agent.vault.isLocked();
      expect(isLocked).to.be.false;
    });

    it('should have an agentDid', async () => {
      expect(agent.agentDid).to.not.be.null.and.not.be.undefined;
      expect(agent.agentDid).to.be.instanceof(BearerDid);
    });
  });
});