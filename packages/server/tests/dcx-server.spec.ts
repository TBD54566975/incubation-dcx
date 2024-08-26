import { DcxApplicant } from '@dcx-protocol/applicant';
import { DcxAgent, DcxIdentityVault, DcxServerError, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { DcxIssuer } from '@dcx-protocol/issuer';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { DcxServer } from '../src/dcx-server.js';
import { IssuerServer } from '../src/issuer-server.js';
import { ApplicantServer } from '../src/applicant-server.js';

process.env.NODE_ENV = 'test';

/**
 * DcxServer tests
 * {@link DcxServer}
 * {@link DcxIssuer}
 * {@link IssuerServer}
 * {@link DcxApplicant}
 * {@link ApplicantServer}
 */
describe('DcxServer', () => {
  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__');
  });

  it('should throw an error with empty constructor: new DcxServer() ', () => {
    expect(() => new DcxServer()).to.throw(DcxServerError);
  });

  describe('with { type: "issuer" }', () => {
    const server = new DcxServer({ type: 'issuer' });
    const issuerServer = server.issuerServer;
    const issuer = server.issuer;
    const listening = server.listening;
    const testing = server.testing;

    describe('server = new DcxServer({ type: "issuer" })', () => {
      it('should be defined as an instanceof DcxServer', () => {
        expect(server).be.instanceof(DcxServer);
      });

      it('should contain property server.issuerServer as an instanceof IssuerServer', () => {
        expect(issuerServer).be.instanceof(IssuerServer);
      });

      it('should contain property server.issuer as an instance of DcxIssuer', () => {
        expect(issuer).to.be.instanceof(DcxIssuer);
      });

      it('should throw DcxServerError when trying to access server.applicantServer', () => {
        expect(() => server.applicantServer).to.throw(DcxServerError);
      });

      it('should throw DcxServerError when trying to access server.applicant', () => {
        expect(() => server.applicant).to.throw(DcxServerError);
      });

      it('should contain property server.listening', () => {
        expect(listening).to.be.a('boolean').and.to.be.false;
      });

      it('should contain property server.testing', () => {
        expect(testing).to.be.a('boolean').and.to.be.true;
      });
    });
  });

  /**
   * @class DcxServer
   * @method constructor
   * @param {ServerParams} params.type = "issuer"; see {@link ServerParams}
   */
  describe('with { type: "applicant" }', () => {
    const server: DcxServer = new DcxServer({ type: 'applicant' });
    const applicantServer = server.applicantServer;
    const applicant = server.applicant;
    const listening = server.listening;
    const testing = server.testing;

    /**
     * @property {DcxServer} server
     * @property {ApplicantServer} server.applicantServer
     * @property {DcxApplicant} server.applicant
     * @property {DcxIssuer} server.issuer
     * @property {IssuerServer} server.issuerServer
     * @property {boolean} server.listening
     * @property {boolean} server.testing
     */
    describe('server = new DcxServer({ type: "applicant" })', () => {
      it('should be defined as an instanceof DcxServer', () => {
        expect(server).be.instanceof(DcxServer);
      });

      it('should contain property "server.applicantServer" as an instanceof ApplicantServer', () => {
        expect(applicantServer).be.instanceof(ApplicantServer);
      });

      it('should contain property "server.applicant" as an instance of DcxApplicant', () => {
        expect(applicant).to.be.instanceof(DcxApplicant);
      });

      it('should throw DcxServerError when trying to access "server.issuerServer"', () => {
        expect(() => server.issuerServer).to.throw(DcxServerError);
      });

      it('should throw DcxServerError when trying to access "server.issuer"', () => {
        expect(() => server.issuer).to.throw(DcxServerError);
      });

      it('should contain property "server.listening"', () => {
        expect(listening).to.be.a('boolean').and.to.be.false;
      });

      it('should contain property "server.testing"', () => {
        expect(testing).to.be.a('boolean').and.to.be.true;
      });
    });
  });

  describe('with { issuer: new DcxIssuer() }', () => {
    describe('server = new DcxServer({ issuer: new DcxIssuer() })', () => {
      const server: DcxServer = new DcxServer({ issuer: new DcxIssuer() });
      const issuerServer = server.issuerServer;
      const issuer = server.issuer;
      const options = issuer.options;
      const config = issuer.config;
      const status = issuer.status;

      /**
       * @property {IssuerServer} server.issuerServer
       */
      it('should contain property "server.issuerServer" as an instanceof IssuerServer', () => {
        expect(issuerServer).to.be.an.instanceof(IssuerServer);
      });

      /**
       * @property {DcxIssuer} server.issuer
       */
      describe('server.issuer', () => {

        // Check server.issuer instance
        it('should be an instanceof DcxIssuer', () => {
          expect(issuer).to.be.an.instanceof(DcxIssuer);
        });

        // Check server.issuer property "options"
        it('should contain an object property "options" with at least 6 entries', () => {
          expect(options).to.be.an('object');
          expect(Object.entries(options)).to.have.lengthOf.gte(6);
        });

        // check server.issuer property "config"
        it('should contain an object property "config"', () => {
          expect(config).to.be.an('object');
          expect(Object.entries(config)).to.have.lengthOf(9);
        });

        // check server.issuer property "status"
        it('should contain an object property "status"', () => {
          expect(status).to.be.an('object');
          expect(Object.entries(status)).to.have.lengthOf(2);
        });

        /**
         * @property {array} server.issuer.options.handlers
         * @property {array} server.issuer.options.providers
         * @property {array} server.issuer.options.manifests
         * @property {array} server.issuer.options.issuers
         * @property {array} server.issuer.options.gateways
         * @property {array} server.issuer.options.dwns
         */
        describe('server.issuer.options', () => {
          // Check server.issuer.options property "handlers"
          it('should contain an array property "handlers" with length >= 0', () => {
            expect(options).to.have.property('handlers').that.is.an('array').and.has.lengthOf.gte(0);
          });

          // Check server.issuer.options property "providers"
          it('should contain an array property "providers" with length >= 0', () => {
            expect(options).to.have.property('providers').that.is.an('array').and.has.lengthOf.gte(0);
          });

          // Check server.issuer.options property "manifests"
          it('should contain an array property "manifests" with length >= 3', () => {
            expect(options).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(1);
          });

          // Check server.issuer.options property "issuers"
          it('should contain an array property "issuers" with length >= 2', () => {
            expect(options).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(1);
          });

          // Check server.issuer.options property "gateways"
          it('should contain an array property "gateways" with length >= 1', () => {
            expect(options).to.have.property('gateways').that.is.an('array').and.has.lengthOf.gte(1);
          });

          // Check server.issuer.options property "dwns"
          it('should contain an array property "dwns" with length >= 1', () => {
            expect(options).to.have.property('dwns').that.is.an('array').and.has.lengthOf.gte(1);
          });
        });

        /**
         * server.issuer.config; see {@link DcxConfig}
         * @property {object} server.issuer.config.DcxHandshakeManifest
         * @property {object} server.issuer.config.PhoneNumberManifest
         * @property {object} server.issuer.config.EmailAddressManifest
         * @property {array} server.issuer.config.issuers
         * @property {array} server.issuer.config.manifests
         * @property {array} server.issuer.config.dwnEndpoints
         * @property {array} server.issuer.config.gatewayUris
         * @property {array} server.issuer.config.issuer
         * @property {array} server.issuer.config.applicant
         */
        describe('server.issuer.config', () => {
          // Check server.issuer.config property "DcxHandshakeManifest"
          it('should contain 3 objects properties named: DcxHandshakeManifest, PhoneNumberManifest, EmailAddressManifest', () => {
            expect(config).to.have.property('DcxHandshakeManifest').that.is.an('object');
            expect(config).to.have.property('PhoneNumberManifest').that.is.an('object');
            expect(config).to.have.property('EmailAddressManifest').that.is.an('object');
          });

          // Check server.issuer.config property "issuers"
          it('should contain an array property "issuers" with length >= 2', () => {
            expect(config).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(2);
          });

          // Check server.issuer.config property "manifests"
          it('should contain an array property "manifests" with length >= 3', () => {
            expect(config).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(3);
          });

          // Check server.issuer.config property "dwnEndpoints"
          it('should contain an array property "dwnEndpoints" with length >= 1', () => {
            expect(config).to.have.property('dwnEndpoints').that.is.an('array').and.has.lengthOf.gte(1);
          });

          // Check server.issuer.config property "gatewayUris"
          it('should contain an array property "gatewayUris" with length >= 1', () => {
            expect(config).to.have.property('gatewayUris').that.is.an('array').and.has.lengthOf.gte(1);
          });

          // Check server.issuer.config property "issuer"
          it('should contain an object property "issuer" with entries length >= 5', () => {
            expect(config).to.have.property('issuer').that.is.an('object');
            expect(Object.entries(config.issuer)).to.have.lengthOf.gte(5);
          });

          // Check server.issuer.config property "applicant"
          it('should contain an array property "applicant" with length >= 2', () => {
            expect(config).to.have.property('applicant').that.is.an('object');
            expect(Object.entries(config.applicant)).to.have.lengthOf.gte(2);
          });
        });


        /**
         * @property {object} server.issuer.status
         */
        describe('server.issuer.status', () => {
          // Check server.issuer.status property "setup"
          it('should contain a boolean property "setup" equal to false', () => {
            expect(status).to.have.property('setup').that.is.a('boolean').and.equals(false);
          });

          // Check server.issuer.status property "initialized"
          it('should contain a boolean property "initialized" equal to false', () => {
            expect(status).to.have.property('initialized').that.is.a('boolean').and.equals(false);
          });
        });
      });

      /**
       * @method server.issuer.initialize()
       */
      describe('server.issuer.initialize()', () => {
        // Set the issuer config variables
        server.issuer.config.issuer.web5Password = Mnemonic.createPassword();
        server.issuer.config.issuer.web5RecoveryPhrase = Mnemonic.createRecoveryPhrase();
        server.issuer.config.issuer.agentDataPath = '__TEST_DATA__/DCX/ISSUER/AGENT';

        // Check the issuer initialized status post initialization
        it('should initialize the DcxIssuer', async () => {
          await server.issuer.initialize();
          expect(server.issuer.status.initialized).to.be.true;
        });

        // Check the issuer web5, agent and agentVault post initialization
        it('should initialize the DcxIssuer properties: web5, agent and agentVault', () => {
          expect(server.issuer.web5).to.be.instanceof(Web5);
          expect(server.issuer.agent).to.be.instanceof(DcxAgent);
          expect(server.issuer.agentVault).to.be.instanceof(DcxIdentityVault);
        });
      });

      /**
       * @method server.issuer.setup()
       */
      describe('server.issuer.setup()', () => {
        // Check the issuer setup status post setup
        it('should setup the issuer protocol in local and remote dwn', async () => {
          await server.issuer.setup();
          expect(server.issuer.status.setup).to.be.true;
        });
      });
    });
  });
});