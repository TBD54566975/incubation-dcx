
import { expect } from 'chai';
import dotenv from 'dotenv';
import { ApplicantConfig } from '../src/config';
dotenv.config({ path: '.env.applicant' });

describe('ApplicantConfig class', () => {
  describe('properties defined by process.env vars', () => {
    it('should contain property APPLICANT_LAST_RECORD_ID as a string', () => {
      const APPLICANT_LAST_RECORD_ID = ApplicantConfig.APPLICANT_LAST_RECORD_ID;
      expect(APPLICANT_LAST_RECORD_ID).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_LAST_RECORD_ID).to.be.an('string');
      console.log(`      ✔ APPLICANT_LAST_RECORD_ID=${APPLICANT_LAST_RECORD_ID}`);
    });

    it('should contain property APPLICANT_CURSOR as a string', () => {
      const APPLICANT_CURSOR = ApplicantConfig.APPLICANT_CURSOR;
      expect(APPLICANT_CURSOR).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_CURSOR).to.be.an('string');
      console.log(`      ✔ APPLICANT_CURSOR=${APPLICANT_CURSOR}`);
    });

    it('should contain property NODE_ENV as a string equal to "test" or "development"', () => {
      const APPLICANT_NODE_ENV = ApplicantConfig.APPLICANT_NODE_ENV;
      expect(APPLICANT_NODE_ENV).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_NODE_ENV).to.be.an('string');
      expect(APPLICANT_NODE_ENV).to.be.match(/(development|test)/);
      console.log(`      ✔ APPLICANT_NODE_ENV=${APPLICANT_NODE_ENV}`);
    });

    it('should contain property SERVICE_NAME as a string equal to "dcx"', () => {
      const SERVICE_NAME = ApplicantConfig.APPLICANT_SERVICE_NAME;
      expect(SERVICE_NAME).to.not.be.null.and.not.be.undefined;
      expect(SERVICE_NAME).to.be.an('string');
      expect(SERVICE_NAME).equals('dcx');
      console.log(`      ✔ SERVICE_NAME=${SERVICE_NAME}`);
    });

    it('should contain property SERVICE_ID as a string equal to "dcx"', () => {
      const SERVICE_ID = ApplicantConfig.APPLICANT_SERVICE_ID;
      expect(SERVICE_ID).to.not.be.null.and.not.be.undefined;
      expect(SERVICE_ID).to.be.an('string');
      expect(SERVICE_ID).equals('dcx');
      console.log(`      ✔ SERVICE_ID=${SERVICE_ID}`);
    });

    it('should contain property DEFAULT_ENDPOINTS as an object containing 3 key value pairs', () => {
      const DEFAULT_ENDPOINTS = ApplicantConfig.DCX_ENDPOINTS;
      expect(DEFAULT_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DEFAULT_ENDPOINTS)).to.have.lengthOf(3);
      console.log(`      ✔ DEFAULT_ENDPOINTS=`, DEFAULT_ENDPOINTS);
    });

    it('should contain property DEFAULT_DWN_ENDPOINTS as an array of length 2', () => {
      const DEFAULT_DWN_ENDPOINTS = ApplicantConfig.APPLICANT_DWN_ENDPOINTS;
      expect(DEFAULT_DWN_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_DWN_ENDPOINTS).to.be.an('array');
      expect(DEFAULT_DWN_ENDPOINTS).to.have.lengthOf(2);
      console.log(`      ✔ DEFAULT_DWN_ENDPOINTS=`, DEFAULT_DWN_ENDPOINTS);
    });

    it('should contain property DEFAULT_GATEWAY_URIS as an array of length 2', () => {
      const DEFAULT_GATEWAY_URIS = ApplicantConfig.APPLICANT_GATEWAY_URIS;
      expect(DEFAULT_GATEWAY_URIS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_GATEWAY_URIS).to.be.an('array');
      expect(DEFAULT_GATEWAY_URIS).to.have.lengthOf(2);
      console.log(`      ✔ DEFAULT_GATEWAY_URIS=`, DEFAULT_GATEWAY_URIS);
    });

    it('should contain property DEFAULT_TRUSTED_ISSUERS as an array of length 1', () => {
      const DEFAULT_TRUSTED_ISSUERS = ApplicantConfig.DCX_INPUT_ISSUERS;
      expect(DEFAULT_TRUSTED_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_TRUSTED_ISSUERS).to.be.an('array');
      expect(DEFAULT_TRUSTED_ISSUERS).to.have.lengthOf(1);
      console.log(`      ✔ DEFAULT_TRUSTED_ISSUERS=`, DEFAULT_TRUSTED_ISSUERS);
    });

    it('should contain property WEB5_PASSWORD as a string', () => {
      const WEB5_PASSWORD = ApplicantConfig.APPLICANT_WEB5_PASSWORD;
      expect(WEB5_PASSWORD).to.not.be.null.and.not.be.undefined;
      expect(WEB5_PASSWORD).to.be.an('string');
      console.log(`      ✔ WEB5_PASSWORD=${WEB5_PASSWORD}`);
    });

    it('should contain WEB5_RECOVERY_PHRASE as a string', () => {
      const WEB5_RECOVERY_PHRASE = ApplicantConfig.APPLICANT_WEB5_RECOVERY_PHRASE;
      expect(WEB5_RECOVERY_PHRASE).to.not.be.null.and.not.be.undefined;
      expect(WEB5_RECOVERY_PHRASE).to.be.an('string');
      console.log(`      ✔ WEB5_RECOVERY_PHRASE=${WEB5_RECOVERY_PHRASE}`);
    });
  });
});
