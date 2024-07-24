import { DcxAgent, DcxIdentityVault } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { expect } from 'chai';
import ApplicantServer, { Web5Manager } from '../src/index.js';

const applicantServer: ApplicantServer = new ApplicantServer();
describe('ApplicantServer', () => {

  it('should initialize with default options', () => {
    const issuers = applicantServer.useOptions['issuers'];
    const gateways = applicantServer.useOptions['gateways'];
    const dwns = applicantServer.useOptions['dwns'];
    const manifests = applicantServer.useOptions['manifests'];
    const providers = applicantServer.useOptions['providers'];
    const handlers = applicantServer.useOptions['handlers'];

    expect(applicantServer).to.not.be.null.and.not.be.undefined;
    expect(applicantServer).to.be.instanceof(ApplicantServer);

    expect(applicantServer).to.have.property('_isPolling');
    expect(applicantServer).to.have.property('_isInitialized');
    expect(applicantServer).to.have.property('_isSetup');
    expect(applicantServer).to.have.property('_isTest');
    expect(applicantServer).to.have.property('useOptions');

    expect(issuers).to.not.be.null.and.not.be.undefined;
    expect(issuers).to.be.an('array');

    expect(gateways).to.not.be.null.and.not.be.undefined;
    expect(gateways).to.be.an('array');

    expect(dwns).to.not.be.null.and.not.be.undefined;
    expect(dwns).to.be.an('array');

    expect(manifests).to.not.be.null.and.not.be.undefined;
    expect(manifests).to.be.an('array');

    expect(providers).to.not.be.null.and.not.be.undefined;
    expect(providers).to.be.an('array');

    expect(handlers).to.not.be.null.and.not.be.undefined;
    expect(handlers).to.be.an('array');
  });


  describe('.initialize()', () => {
    it('should initialize the applicantServer', async () => {
      await applicantServer.initialize();
      expect(applicantServer._isInitialized).equals(true);
    });

    it('should initialize the Web5Manager', () => {
      expect(Web5Manager.web5).to.not.be.null.and.not.be.undefined;
      expect(Web5Manager.web5).to.be.instanceof(Web5);

      expect(Web5Manager.applicantAgent).to.not.be.null.and.not.be.undefined;
      expect(Web5Manager.applicantAgent).to.be.instanceof(DcxAgent);

      expect(Web5Manager.applicantAgentVault).to.not.be.null.and.not.be.undefined;
      expect(Web5Manager.applicantAgentVault).to.be.instanceof(DcxIdentityVault);
    });

    // it('should setup the remote DWN', async () => {
    //   const _isSetup = await applicantServer.setupDwn();
    //   console.log('_isSetup', _isSetup);
    //   expect(_isSetup).equals(true);
    //   console.log('applicantServer._isSetup', applicantServer._isSetup);
    //   expect(applicantServer._isSetup).equals(true);
    // });
  });
});