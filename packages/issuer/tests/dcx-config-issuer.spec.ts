import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expect } from 'chai';
import { dcxConfig } from '@dcx-protocol/common';

process.env.NODE_ENV = 'test';

describe('dcxConfig', () => {
  // Check dcxConfig property "DcxHandshakeManifest"
  it('should contain 3 objects properties named: "DcxHandshakeManifest", "PhoneNumberManifest", "EmailAddressManifest"', () => {
    expect(dcxConfig).to.have.property('DcxHandshakeManifest').that.is.an('object');
    expect(dcxConfig).to.have.property('PhoneNumberManifest').that.is.an('object');
    expect(dcxConfig).to.have.property('EmailAddressManifest').that.is.an('object');
  });

  // Check dcxConfig property "issuers"
  it('should contain an array property "issuers" with length >= 2', () => {
    expect(dcxConfig).to.have.property('issuers').that.is.an('array').and.has.lengthOf.gte(2);
  });

  // Check dcxConfig property "manifests"
  it('should contain an array property "manifests" with length >= 3', () => {
    expect(dcxConfig).to.have.property('manifests').that.is.an('array').and.has.lengthOf.gte(3);
  });

  // Check dcxConfig property "dwnEndpoints"
  it('should contain an array property "dwnEndpoints" with length >= 1', () => {
    expect(dcxConfig).to.have.property('dwnEndpoints').that.is.an('array').and.has.lengthOf.gte(1);
  });

  // Check dcxConfig property "gatewayUris"
  it('should contain an array property "gatewayUris" with length >= 1', () => {
    expect(dcxConfig).to.have.property('gatewayUris').that.is.an('array').and.has.lengthOf.gte(1);
  });

  // Check dcxConfig property "issuer"
  it('should contain an object property "issuer" with entries length >= 5', () => {
    expect(dcxConfig).to.have.property('issuer').that.is.an('object');
    expect(Object.entries(dcxConfig.issuer)).to.have.lengthOf.gte(5);
  });

  // Check dcxConfig property "applicant"
  it('should contain an array property "applicant" with length >= 2', () => {
    expect(dcxConfig).to.have.property('applicant').that.is.an('object');
    expect(Object.entries(dcxConfig.applicant)).to.have.lengthOf.gte(2);
  });

  // Check dcxConfig.issuer
  describe('dcxConfig.issuer', () => {
    const issuer = dcxConfig.issuer;

    // Check dcxConfig.issuer property "cursorFile"
    it('should contain property "cursorFile" as a string', () => {
      expect(issuer.cursorFile).to.be.a('string');
    });

    // Check dcxConfig.issuer property "lastRecordIdFile"
    it('should contain property "lastRecordIdFile" as a string', () => {
      expect(issuer.lastRecordIdFile).to.be.a('string');
    });

    // Check dcxConfig.issuer property "agentDataPath"
    it('should contain property "agentDataPath" as a string', () => {
      expect(issuer.agentDataPath).to.be.a('string');
    });

    // Check dcxConfig.issuer property "web5Password"
    it('should contain property "web5Password" as a string', () => {
      expect(issuer.web5Password).to.be.a('string');
    });

    // Check dcxConfig.issuer property "web5RecoveryPhrase"
    it('should contain property "web5RecoveryPhrase" as a string', () => {
      expect(issuer.web5RecoveryPhrase).to.be.a('string');
    });
  });
});
