import { expect } from 'chai';
import { server } from '../src/index.js';
import IssuerServer from '../src/index.js';
import { Web5Manager } from '../src/web5-manager.js';

describe('IssuerServer', () => {
  let issuerServer: IssuerServer;
  const defaultParameters = [
    '_isPolling',
    '_isInitialized',
    '_isNewAgent',
    '_isTest',
    'useOptions',
  ];
  const nonNullPaths = ['issuers', 'gateways', 'dwns'];

  beforeEach(() => {
    issuerServer = new IssuerServer();
  });

  it('should initialize with default parameters', () => {
    expect(issuerServer).to.not.be.undefined;
    expect(issuerServer).to.be.instanceof(IssuerServer);
    defaultParameters.map((prop) => {
      expect(issuerServer).to.have.property(prop);
    });

    nonNullPaths.map((path) => {
      const option = IssuerServer.useOptions[path];
      expect(option).to.not.be.null;
      expect(option).to.not.be.undefined;
      expect(option).to.be.an('array');
      expect(option).to.be.an('array');
    });

    ['manifests', 'providers', 'handlers', ...nonNullPaths].map((path) => {
      const option = IssuerServer.useOptions[path];
      expect(option).to.not.be.undefined;
      expect(option).to.be.an('array');
    });
  });

  it('should import with default parameters', () => {
    expect(server).to.not.be.undefined;
    expect(server).to.be.instanceof(IssuerServer);
    defaultParameters.map((prop) => {
      expect(issuerServer).to.have.property(prop);
    });
  });

  describe('initialize()', () => {
    it('should initialize the server', async () => {
      await server.initialize();
      expect(server._isInitialized).to.be.true;
      expect(Web5Manager.web5).to.not.be.undefined;
      expect(Web5Manager.issuerAgent).to.not.be.undefined;
      expect(Web5Manager.issuerAgentVault).to.not.be.undefined;
    });
  });

});