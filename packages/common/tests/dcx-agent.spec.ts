import { BearerDid } from '@web5/dids';
import { expect } from 'chai';
import { DcxAgent, DcxIdentityVault, FileSystem, Mnemonic } from '../src/index.js';
import { LevelStore } from '@web5/common';

describe('DcxAgent', () => {
  const dataPath = '__TEST_DATA__/DCX/COMMON/AGENT';
  const password = Mnemonic.createPassword();
  const recoveryPhrase = Mnemonic.createRecoveryPhrase();
  const location = `${dataPath}/VAULT_STORE`;

  let agent: DcxAgent;

  after(async () => {
    await FileSystem.rm('__TEST_DATA__', { recursive: true, force: true });
  });

  describe('agent = await DcxAgent.create({ dataPath, agentVault: new DcxIdentityVault({ location }) })', () => {
    it('should be an instanceof DcxAgent', async () => {
      agent = await DcxAgent.create({ dataPath, agentVault: new DcxIdentityVault({ location }) });
      expect(agent).to.be.instanceof(DcxAgent);
    });

    it('should throw an error upon accessing the agentDid', () => {
      expect(() => agent.agentDid).to.throw(Error, /"agentDid" property is not set/);
    });

    describe('agent.vault', () => {
      it('should be an instanceof DcxIdentityVault', () => {
        expect(agent.vault).to.be.instanceof(DcxIdentityVault);
      });

      it('should be locked', () => {
        expect(agent.vault.isLocked()).to.be.true;
      });

      it('should have a store that is an instanceof LevelStore', () => {
        expect(agent.vault.store).to.be.instanceof(LevelStore);
      });
    });
  });

  describe('await agent.firstLaunch()', () => {
    it('should be true', async () => {
      expect(await agent.firstLaunch()).to.be.true;
    });
  });

  describe('await agent.initialize({ password, recoveryPhrase, dwnEndpoints })', () => {
    it('should initialize and return a matching recoveryPhrase', async () => {
      expect(await agent.initialize({ password, recoveryPhrase, dwnEndpoints: ['http://localhost:3000'] })).to.equal(recoveryPhrase);
    });

    it('should have a vault that is initialized', async () => {
      expect(await agent.vault.isInitialized()).to.be.true;
    });
  });

  describe('await agent.start({ password })', () => {
    it('should start the agent', async () => {
      await agent.start({ password });
    });

    it('should have an unlocked vault', () => {
      expect(agent.vault.isLocked()).to.be.false;
    });

    it('should have agentDid as instanceof BearerDid', () => {
      expect(agent.agentDid).to.be.instanceof(BearerDid);
    });
  });
});