import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expect } from 'chai';
import { dcxConfig } from '../src/index.js';

describe('dcxConfig', () => {
  describe('defines configuration for both sides of the protocol using env vars and static vars', () => {
    it('should contain property dcxConfig.endpoints as an object containing 2 key value pairs', () => {
      const endpoints = dcxConfig.endpoints;
      expect(endpoints).to.not.be.null.and.not.be.undefined;
      expect(endpoints).to.be.an('object');
      expect(Object.entries(endpoints)).have.lengthOf.gte(2);
    });

    it('should contain property dcxConfig.issuers as an array with a length of at least 1', () => {
      const issuers = dcxConfig.issuers;
      expect(issuers).to.not.be.null.and.not.be.undefined;
      expect(issuers).to.be.an('array');
      expect(issuers).to.have.lengthOf.gte(1);
    });

    it('should contain property dcxConfig.manifests as an array with at least 1 entry', () => {
      const manifests = dcxConfig.manifests;
      expect(manifests).to.not.be.null.and.not.be.undefined;
      expect(manifests).to.be.an('array');
      expect(Object.entries(manifests)).to.have.lengthOf.gte(1);
    });

    it('should contain property dcxConfig.dwnEndpoints as an object with at least 1 entry', () => {
      const dwnEndpoints = dcxConfig.dwnEndpoints;
      expect(dwnEndpoints).to.not.be.null.and.not.be.undefined;
      expect(dwnEndpoints).to.be.an('array');
      expect(Object.entries(dwnEndpoints)).to.have.lengthOf.gte(1);
    });

    it('should contain property dcxConfig.gatewayUris as an object with at least 1 entry', () => {
      const gatewayUris = dcxConfig.gatewayUris;
      expect(gatewayUris).to.not.be.null.and.not.be.undefined;
      expect(gatewayUris).to.be.an('array');
      expect(Object.entries(gatewayUris)).to.have.lengthOf.gte(1);
    });

    it('should contain property dcxConfig.issuer as an object with at least 5 entries', () => {
      const issuerProtocol = dcxConfig.issuer;
      expect(issuerProtocol).to.not.be.null.and.not.be.undefined;
      expect(issuerProtocol).to.be.an('object');
      expect(Object.entries(issuerProtocol)).to.have.lengthOf.gte(5);
    });

    it('should contain property dcxConfig.applicant as an object with at least 2 entries', () => {
      const dcxApplicantProtocol = dcxConfig.applicant;
      expect(dcxApplicantProtocol).to.not.be.null.and.not.be.undefined;
      expect(dcxApplicantProtocol).to.be.an('object');
      expect(Object.entries(dcxApplicantProtocol)).to.have.lengthOf.gte(2);
    });
  });
});