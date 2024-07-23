import { expect } from 'chai';
import { server } from '../src/server.js';
import ApplicantServer from '../src/server.js';
import { Web5Manager } from '../src/web5-manager.js';

describe('ApplicantServer', () => {
  let applicantServer: ApplicantServer;
  const defaultParameters = [
    '_isPolling',
    '_isInitialized',
    '_isNewAgent',
    '_isTest',
    'useOptions',
  ];
  const nonNullPaths = ['issuers', 'gateways', 'dwns'];

  beforeEach(() => {
    applicantServer = new ApplicantServer();
  });

  it('should initialize with default parameters', () => {
    expect(applicantServer).to.not.be.undefined;
    expect(applicantServer).to.be.instanceof(ApplicantServer);
    defaultParameters.map((prop) => {
      expect(applicantServer).to.have.property(prop);
    });

    nonNullPaths.map((path) => {
      const option = applicantServer.useOptions[path];
      expect(option).to.not.be.null;
      expect(option).to.not.be.undefined;
      expect(option).to.be.an('array');
      expect(option).to.be.an('array');
    });

    ['manifests', 'providers', 'handlers', ...nonNullPaths].map((path) => {
      const option = applicantServer.useOptions[path];
      expect(option).to.not.be.undefined;
      expect(option).to.be.an('array');
    });
  });

  it('should import with default parameters', () => {
    expect(server).to.not.be.undefined;
    expect(server).to.be.instanceof(ApplicantServer);
    defaultParameters.map((prop) => {
      expect(applicantServer).to.have.property(prop);
    });
  });

  describe('initialize()', () => {
    it('should initialize the server', async () => {
      await server.initialize();
      expect(server._isInitialized).to.be.true;
      expect(Web5Manager.web5).to.not.be.undefined;
      expect(Web5Manager.applicantAgent).to.not.be.undefined;
      expect(Web5Manager.applicantAgentVault).to.not.be.undefined;
    });
  });

});