import { expect } from 'chai';
import IssuerServer, { server } from '../src/issuer-server.js';
import { Web5Manager } from '../src/web5-manager.js';

const issuerServer: IssuerServer = new IssuerServer();

describe('IssuerServer class', () => {
  describe('constructor', () => {
    it('should initialize with default options', () => {
      expect(issuerServer).to.have.property('_isPolling');
      expect(issuerServer).to.have.property('_isInitialized');
      expect(issuerServer).to.have.property('_isNewAgent');
      expect(issuerServer).to.have.property('_isTest');
      expect(issuerServer).to.have.property('useOptions');
      expect(issuerServer).to.have.property('issuers');
      expect(issuerServer).to.have.property('gateways');
      expect(issuerServer).to.have.property('dwns');

      expect(issuerServer).to.not.be.undefined;
      expect(issuerServer).to.be.instanceof(IssuerServer);

      const issuers = server.useOptions['issuers'];
      expect(issuers).to.not.be.null;

      const gateways = server.useOptions['gateways'];
      expect(gateways).to.not.be.undefined;

      const dwns = server.useOptions['dwns'];
      expect(dwns).to.be.an('array');

      const manifests = server.useOptions['manifests'];
      expect(manifests).to.be.an('array');

      const providers = server.useOptions['providers'];
      expect(providers).to.not.be.undefined;

      const handlers = server.useOptions['handlers'];
      expect(handlers).to.be.an('array');
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
});