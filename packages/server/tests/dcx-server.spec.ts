import { DcxApplicant } from '@dcx-protocol/applicant';
import { DcxAgent, DcxIdentityVault, DcxServerError, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { DcxIssuer } from '@dcx-protocol/issuer';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { ApplicantServer } from '../src/applicant-server.js';
import { DcxServer } from '../src/dcx-server.js';
import { IssuerServer } from '../src/issuer-server.js';

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
      const issuer = server.issuer;
      const config = issuer.config;
      const status = issuer.status;

      /**
       * @property {IssuerServer} server.issuerServer
       */
      it('should contain property "issuerServer" as an instanceof IssuerServer', () => {
        expect(server.issuerServer).to.be.an.instanceof(IssuerServer);
      });

      /**
       * @property {DcxIssuer} server.issuer
       */
      describe('server.issuer', () => {

        // Check server.issuer instance
        it('should be an instanceof DcxIssuer', () => {
          expect(issuer).to.be.an.instanceof(DcxIssuer);
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
         * server.issuer.config; see {@link IssuerConfig}
         * @property {array} server.issuer.config.handlers
         * @property {array} server.issuer.config.providers
         * @property {array} server.issuer.config.manifests
         * @property {array} server.issuer.config.issuers
         * @property {array} server.issuer.config.gateways
         * @property {array} server.issuer.config.dwns
         */
        describe('server.issuer.config', () => {
          // Check server.issuer.options property "handlers"
          it('should contain an array property "handlers" with length >= 0', () => {
            expect(config).to.have.property('handlers').that.is.an('array').and.has.lengthOf.gte(0);
          });

          // Check server.issuer.options property "providers"
          it('should contain an array property "providers" with length >= 0', () => {
            expect(config).to.have.property('providers').that.is.an('array').and.has.lengthOf.gte(0);
          });

          // Check server.issuer.options property "manifests"
          it('should contain an array property "manifests" with length >= 3', () => {
            expect(config).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(1);
          });

          // Check server.issuer.options property "issuers"
          it('should contain an array property "issuers" with length >= 2', () => {
            expect(config).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(1);
          });

          // Check server.issuer.options property "gateways"
          it('should contain an array property "gateways" with length >= 1', () => {
            expect(config).to.have.property('gateways').that.is.an('array').and.has.lengthOf.gte(1);
          });

          // Check server.issuer.options property "dwns"
          it('should contain an array property "dwns" with length >= 1', () => {
            expect(config).to.have.property('dwns').that.is.an('array').and.has.lengthOf.gte(1);
          });

          // Check server.issuer.config property "cursorFile"
          it('should contain string property "cursorFile"', () => {
            expect(config).to.have.property('cursorFile').that.is.a('string');
          });

          // Check server.issuer.config property "lastRecordIdFile"
          it('should contain string property "lastRecordIdFile"', () => {
            expect(config).to.have.property('lastRecordIdFile').that.is.a('string');
          });

          // Check server.issuer.config property "agentDataPath"
          it('should contain string property "agentDataPath"', () => {
            expect(config).to.have.property('agentDataPath').that.is.a('string');
          });

          // Check server.issuer.config property "web5Password"
          it('should contain string property "web5Password"', () => {
            expect(config).to.have.property('web5Password').that.is.a('string');
          });

          // Check server.issuer.config property "web5RecoveryPhrase"
          it('should contain string property "web5RecoveryPhrase"', () => {
            expect(config).to.have.property('web5RecoveryPhrase').that.is.a('string');
          });
        });


        /**
         * server.issuer.status; see {@link DcxManagerStatus}
         * @property {boolean} server.issuer.status.setup
         * @property {boolean} server.issuer.status.initialized
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
       * see {@link DcxIssuer.initialize()}
       * @method server.issuer.initialize()
       */
      describe('await server.issuer.initialize()', () => {
        // Set the issuer config variables
        server.issuer.config.web5Password = Mnemonic.createPassword();
        server.issuer.config.web5RecoveryPhrase = Mnemonic.createRecoveryPhrase();
        server.issuer.config.agentDataPath = '__TEST_DATA__/DCX/ISSUER/AGENT';

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
       * see {@link DcxIssuer.setup}
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