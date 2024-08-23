import { DcxApplicant } from '@dcx-protocol/applicant';
import { DcxAgent, DcxIdentityVault, DcxServerError, FileSystem, Mnemonic } from '@dcx-protocol/common';
import { DcxIssuer } from '@dcx-protocol/issuer';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import { ApplicantServer, IssuerServer, Server } from '../src/dcx-server.js';

process.env.NODE_ENV = 'test';


describe('Server', () => {
  afterEach(async () => {
    await FileSystem.rm('__TEST_DATA__');
  });

  describe('constructor: new Server()', () => {
    it('should throw an error', () => {
      expect(new Server()).to.throw(DcxServerError);
    });
  });

  describe('Server with type: "issuer" => IssuerServer', () => {
    const server: Server = new Server({ type: 'issuer' });

    describe('constructor: new Server({ type: "issuer" })', () => {
      it('should be defined as an instanceof Server', () => {
        expect(server).be.instanceof(Server);
      });

      it('should contain property dcx as an instance of DcxIssuer', () => {
        expect(server.dcx).to.be.instanceof(DcxIssuer);
      });

      it('should contain property issuer as an instanceof IssuerServer', () => {
        expect(server.issuer).be.instanceof(IssuerServer);
      });

      it('should not contain property applicant', () => {
        expect(server.applicant).to.be.undefined;
      });

      it('should contain property type', () => {
        expect(server.type).to.be.a('string').and.to.equal('issuer');
      });

      it('should contain property listening', () => {
        expect(server.listening).to.be.a('boolean').and.to.be.false;
      });

      it('should contain property testing', () => {
        expect(server.testing).to.be.a('boolean').and.to.be.true;
      });
    });
  });

  describe('Server with type: "applicant" => ApplicantServer', () => {
    const server: Server = new Server({ type: 'applicant' });

    describe('constructor: new Server({ type: "applicant" })', () => {
      it('should be defined as an instanceof Server', () => {
        expect(server).be.instanceof(Server);
      });

      it('should contain property dcx as an instance of DcxApplicant', () => {
        expect(server.dcx).to.be.instanceof(DcxApplicant);
      });

      it('should contain property applicant as an instanceof ApplicantServer', () => {
        expect(server.applicant).be.instanceof(ApplicantServer);
      });

      it('should not contain property issuer', () => {
        expect(server.issuer).to.be.undefined;
      });

      it('should contain property type', () => {
        expect(server.type).to.be.a('string').and.to.equal('applicant');
      });

      it('should contain property listening', () => {
        expect(server.listening).to.be.a('boolean').and.to.be.false;
      });

      it('should contain property testing', () => {
        expect(server.testing).to.be.a('boolean').and.to.be.true;
      });
    });
  });

  describe('Server with issuer: DcxIssuer => IssuerServer', () => {
    describe('constructor: new Server({ issuer: new DcxIssuer({}) })', () => {
      const server: Server = new Server({ issuer: new DcxIssuer({}) });
      const dcx = server.dcx as DcxIssuer;
      const issuer = server.issuer!;
      const options = issuer.options;
      const config = issuer.config;
      const status = issuer.status;

      it('should contain property dcx as an instanceof DcxIssuer', () => {
        expect(dcx).to.be.an.instanceof(DcxIssuer);
      });

      describe('server.issuer', () => {
        it('should be an instance of IssuerServer', () => {
          expect(issuer).to.be.an.instanceof(IssuerServer);
        });

        it('should contain an object property "options" with at least 6 entries', () => {
          expect(options).to.be.an('object');
          expect(Object.entries(options)).to.have.lengthOf.gte(6);
        });

        describe('issuer.options', () => {
          it('should contain an array property "handlers" with length >= 0', () => {
            expect(options).to.have.property('handlers').that.is.an('array').and.has.lengthOf.gte(0);
          });

          it('should contain an array property "providers" with length >= 0', () => {
            expect(options).to.have.property('providers').that.is.an('array').and.has.lengthOf.gte(0);
          });

          it('should contain an array property "manifests" with length >= 3', () => {
            expect(options).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(1);
          });

          it('should contain an array property "issuers" with length >= 2', () => {
            expect(options).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(1);
          });

          it('should contain an array property "gateways" with length >= 1', () => {
            expect(options).to.have.property('gateways').that.is.an('array').and.has.lengthOf.gte(1);
          });

          it('should contain an array property "dwns" with length >= 1', () => {
            expect(options).to.have.property('dwns').that.is.an('array').and.has.lengthOf.gte(1);
          });
        });

        it('should contain an object property "config"', () => {
          expect(config).to.be.an('object');
          expect(Object.entries(config)).to.have.lengthOf(9);
        });

        describe('issuer.config', () => {
          it('should contain 3 objects properties named: DcxHandshakeManifest, PhoneNumberManifest, EmailAddressManifest', () => {
            expect(config).to.have.property('DcxHandshakeManifest').that.is.an('object');
            expect(config).to.have.property('PhoneNumberManifest').that.is.an('object');
            expect(config).to.have.property('EmailAddressManifest').that.is.an('object');
          });

          it('should contain an array property "issuers" with length >= 2', () => {
            expect(config).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(2);
          });

          it('should contain an array property "manifests" with length >= 3', () => {
            expect(config).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(3);
          });

          it('should contain an array property "dwnEndpoints" with length >= 1', () => {
            expect(config).to.have.property('dwnEndpoints').that.is.an('array').and.has.lengthOf.gte(1);
          });

          it('should contain an array property "gatewayUris" with length >= 1', () => {
            expect(config).to.have.property('gatewayUris').that.is.an('array').and.has.lengthOf.gte(1);
          });

          it('should contain an object property "issuer" with entries length >= 5', () => {
            expect(config).to.have.property('issuer').that.is.an('array').and.has.lengthOf.gte(5);
          });

          it('should contain an array property "applicant" with length >= 2', () => {
            expect(config).to.have.property('applicant').that.is.an('array').and.has.lengthOf.gte(2);
          });
        });

        it('should contain an object property "status"', () => {
          expect(status).to.be.an('object');
          expect(Object.entries(status)).to.have.lengthOf(2);
        });

        describe('issuer.status', () => {
          it('should contain a boolean property "setup" equal to false', () => {
            expect(status).to.have.property('setup').that.is.a('boolean').and.equals(false);
          });

          it('should contain a boolean property "initialized" equal to false', () => {
            expect(status).to.have.property('initialized').that.is.a('boolean').and.equals(false);
          });
        });
      });

      describe('server.dcx.initialize()', () => {
        it('should initialize the DcxIssuer in the Server', async () => {
          dcx.config.issuer.web5Password = Mnemonic.createPassword();
          dcx.config.issuer.web5RecoveryPhrase = Mnemonic.createRecoveryPhrase();
          dcx.config.issuer.agentDataPath = '__TEST_DATA__/DCX/ISSUER/AGENT';
          await dcx.initialize();
          expect(dcx.status.initialized).equals(true);
        });

        it('should initialize the web5, agent and agentVault properties', () => {
          expect(dcx.web5).to.be.instanceof(Web5);
          expect(dcx.agent).to.be.instanceof(DcxAgent);
          expect(dcx.agentVault).to.be.instanceof(DcxIdentityVault);
        });
      });

      describe('server.dcx.setup()', () => {
        it('should setup the applicant dwn', async () => {
          await server.dcx.setup();
          expect(server.dcx.status.setup).equals(true);
        });
      });
    });
  });
});