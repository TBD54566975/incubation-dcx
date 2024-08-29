import { DcxApplicant } from '@dcx-protocol/applicant';
import { DcxAgent, DcxIdentityVault, DcxServerError, FileSystem } from '@dcx-protocol/common';
import { DcxIssuer, issuerConfig } from '@dcx-protocol/issuer';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { ApplicantServer } from '../src/applicant-server.js';
import { DcxServer } from '../src/dcx-server.js';
import { IssuerServer } from '../src/issuer-server.js';

process.env.NODE_ENV = 'test';

/**
 * @class DcxServer
 * {@link DcxServer}
 * {@link DcxIssuer}
 * {@link IssuerServer}
 * {@link DcxApplicant}
 * {@link ApplicantServer}
 */
describe('DcxServer', () => {
  after(async () => {
    await FileSystem.rm('__TEST_DATA__');
    await FileSystem.rm('DATA');
  });

  it('should throw an error with empty constructor: new DcxServer() ', () => {
    expect(() => new DcxServer()).to.throw(DcxServerError);
  });

  /**
   * new DcxServer({ type: "issuer" })
   * @param {ServerParams} params.type = "issuer"
   */
  describe('server = new DcxServer({ type: "issuer" })', () => {
    const server = new DcxServer({ type: 'issuer' });

    it('should be defined as an instanceof DcxServer', () => {
      expect(server).be.instanceof(DcxServer);
    });

    it('should contain property server.issuerServer as an instanceof IssuerServer', () => {
      expect(server.issuerServer).be.instanceof(IssuerServer);
    });

    it('should contain property server.issuer as an instance of DcxIssuer', () => {
      expect(server.issuer).to.be.instanceof(DcxIssuer);
    });

    it('should throw DcxServerError when trying to access server.applicantServer', () => {
      expect(() => server.applicantServer).to.throw(DcxServerError);
    });

    it('should throw DcxServerError when trying to access server.applicant', () => {
      expect(() => server.applicant).to.throw(DcxServerError);
    });

    it('should contain property server.listening', () => {
      expect(server.listening).to.be.a('boolean').and.to.be.false;
    });

    it('should contain property server.testing', () => {
      expect(server.testing).to.be.a('boolean').and.to.be.true;
    });
  });

  /**
   * new DcxServer({ type: "applicant" })
   * @param {ServerParams} params.type = "applicant"
   *
   * @property {DcxServer} server
   * @property {ApplicantServer} server.applicantServer
   * @property {DcxApplicant} server.applicant
   * @property {DcxIssuer} server.issuer
   * @property {IssuerServer} server.issuerServer
   * @property {boolean} server.listening
   * @property {boolean} server.testing
   */
  describe('server = new DcxServer({ type: "applicant" });', () => {
    const server = new DcxServer({ type: 'applicant' });

    it('should be an instanceof DcxServer', () => {
      expect(server).be.instanceof(DcxServer);
    });

    it('should contain property "server.applicantServer" as an instanceof ApplicantServer', () => {
      expect(server.applicantServer).be.instanceof(ApplicantServer);
    });

    it('should contain property "server.applicant" as an instance of DcxApplicant', () => {
      expect(server.applicant).to.be.instanceof(DcxApplicant);
    });

    it('should throw DcxServerError when trying to access "server.issuerServer"', () => {
      expect(() => server.issuerServer).to.throw(DcxServerError);
    });

    it('should throw DcxServerError when trying to access "server.issuer"', () => {
      expect(() => server.issuer).to.throw(DcxServerError);
    });

    it('should contain property "server.listening"', () => {
      expect(server.listening).to.be.a('boolean').and.to.be.false;
    });

    it('should contain property "server.testing"', () => {
      expect(server.testing).to.be.a('boolean').and.to.be.true;
    });
  });

  describe('server = new DcxServer({ issuer: new DcxIssuer({ config: issuerConfig }) })', () => {
    issuerConfig.dwns = ['http://localhost:3000'];
    issuerConfig.agentDataPath = '__TEST_DATA__/SERVER/DCX/ISSUER/AGENT';

    const server = new DcxServer({ issuer: new DcxIssuer({ config: issuerConfig }) });

    it('should be an instanceof DcxServer', () => {
      expect(server).be.instanceof(DcxServer);
    });

    it('should contain property "issuerServer" as an instanceof IssuerServer', () => {
      expect(server.issuerServer).to.be.an.instanceof(IssuerServer);
    });

    describe('server.issuer', () => {
      // Check server.issuer instance
      it('should be an instanceof DcxIssuer', () => {
        expect(server.issuer).to.be.an.instanceof(DcxIssuer);
      });

      // check server.issuer property "config"
      it('should contain an object property "config"', () => {
        expect(server.issuer.config).to.be.an('object');
        expect(Object.entries(server.issuer.config)).to.have.lengthOf(11);
      });

      // check server.issuer property "status"
      it('should contain an object property "status"', () => {
        expect(server.issuer.status).to.be.an('object');
        expect(Object.entries(server.issuer.status)).to.have.lengthOf(2);
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
          expect(server.issuer.config).to.have.property('handlers').that.is.an('array').and.has.lengthOf.gte(0);
        });

        // Check server.issuer.options property "providers"
        it('should contain an array property "providers" with length >= 0', () => {
          expect(server.issuer.config).to.have.property('providers').that.is.an('array').and.has.lengthOf.gte(0);
        });

        // Check server.issuer.options property "manifests"
        it('should contain an array property "manifests" with length >= 3', () => {
          expect(server.issuer.config).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(1);
        });

        // Check server.issuer.options property "issuers"
        it('should contain an array property "issuers" with length >= 2', () => {
          expect(server.issuer.config).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(1);
        });

        // Check server.issuer.options property "gateways"
        it('should contain an array property "gateways" with length >= 1', () => {
          expect(server.issuer.config).to.have.property('gateways').that.is.an('array').and.has.lengthOf.gte(1);
        });

        // Check server.issuer.options property "dwns"
        it('should contain an array property "dwns" with length >= 1', () => {
          expect(server.issuer.config).to.have.property('dwns').that.is.an('array').and.has.lengthOf.gte(1);
        });

        // Check server.issuer.config property "cursorFile"
        it('should contain string property "cursorFile"', () => {
          expect(server.issuer.config).to.have.property('cursorFile').that.is.a('string');
        });

        // Check server.issuer.config property "lastRecordIdFile"
        it('should contain string property "lastRecordIdFile"', () => {
          expect(server.issuer.config).to.have.property('lastRecordIdFile').that.is.a('string');
        });

        // Check server.issuer.config property "agentDataPath"
        it('should contain string property "agentDataPath"', () => {
          expect(server.issuer.config).to.have.property('agentDataPath').that.is.a('string');
        });

        // Check server.issuer.config property "web5Password"
        it('should contain string property "web5Password"', () => {
          expect(server.issuer.config).to.have.property('web5Password').that.is.a('string');
        });

        // Check server.issuer.config property "web5RecoveryPhrase"
        it('should contain string property "web5RecoveryPhrase"', () => {
          expect(server.issuer.config).to.have.property('web5RecoveryPhrase').that.is.a('string');
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
          expect(server.issuer.status).to.have.property('setup').that.is.a('boolean').and.that.is.false;
        });

        // Check server.issuer.status property "initialized"
        it('should contain a boolean property "initialized" equal to false', () => {
          expect(server.issuer.status).to.have.property('initialized').that.is.a('boolean').and.that.is.false;
        });
      });
    });

    /**
     * see {@link DcxIssuer.initialize()}
     * @method server.issuer.initialize()
     */
    describe('await server.issuer.initialize()', () => {
      // Check the issuer initialized status post initialization
      it('should initialize the DcxIssuer', async () => {
        await server.issuer.initialize();
        expect(server.issuer.status.initialized).to.be.true;
        expect(server.issuer.web5).to.be.instanceof(Web5);
        expect(server.issuer.agent).to.be.instanceof(DcxAgent);
        expect(server.issuer.agentVault).to.be.instanceof(DcxIdentityVault);
      });
    });

    /**
       * see {@link DcxIssuer.setup}
       * @method server.issuer.setup()
       */
    describe('await server.issuer.setup()', () => {
      // Check the issuer setup status post setup
      it('should setup the issuer protocol in local and remote dwn', async () => {
        await server.issuer.setup();
        expect(server.issuer.status.setup).to.be.true;
      });
    });
  });
});