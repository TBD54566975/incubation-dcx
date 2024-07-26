import dotenv from 'dotenv';
dotenv.config({ path: '.env.applicant' });

import { expect } from 'chai';
import { ApplicantConfig } from '../src/applicant-config.js';

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

    it('should contain property APPLICANT_NODE_ENV as a string equal to "test" or "development"', () => {
      const APPLICANT_NODE_ENV = ApplicantConfig.APPLICANT_NODE_ENV;
      expect(APPLICANT_NODE_ENV).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_NODE_ENV).to.be.an('string');
      expect(APPLICANT_NODE_ENV).to.be.match(/(development|test)/);
      console.log(`      ✔ APPLICANT_NODE_ENV=${APPLICANT_NODE_ENV}`);
    });

    it('should contain property APPLICANT_SERVICE_NAME as a string equal to "DCX Applicant"', () => {
      const APPLICANT_SERVICE_NAME = ApplicantConfig.APPLICANT_SERVICE_NAME;
      expect(APPLICANT_SERVICE_NAME).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_SERVICE_NAME).to.be.an('string');
      expect(APPLICANT_SERVICE_NAME).equals('DCX Applicant');
      console.log(`      ✔ APPLICANT_SERVICE_NAME=${APPLICANT_SERVICE_NAME}`);
    });

    it('should contain property APPLICANT_SERVICE_ID as a string equal to "dcx-applicant"', () => {
      const APPLICANT_SERVICE_ID = ApplicantConfig.APPLICANT_SERVICE_ID;
      expect(APPLICANT_SERVICE_ID).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_SERVICE_ID).to.be.an('string');
      expect(APPLICANT_SERVICE_ID).equals('dcx-applicant');
      console.log(`      ✔ APPLICANT_SERVICE_ID=${APPLICANT_SERVICE_ID}`);
    });

    it('should contain property APPLICANT_DWN_ENDPOINTS as an array of length 2', () => {
      const APPLICANT_DWN_ENDPOINTS = ApplicantConfig.APPLICANT_DWN_ENDPOINTS;
      expect(APPLICANT_DWN_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_DWN_ENDPOINTS).to.be.an('array');
      expect(APPLICANT_DWN_ENDPOINTS).to.have.lengthOf(2);
      console.log(`      ✔ APPLICANT_DWN_ENDPOINTS=`, APPLICANT_DWN_ENDPOINTS);
    });

    it('should contain property APPLICANT_GATEWAY_URIS as an array of length 2', () => {
      const APPLICANT_GATEWAY_URIS = ApplicantConfig.APPLICANT_GATEWAY_URIS;
      expect(APPLICANT_GATEWAY_URIS).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_GATEWAY_URIS).to.be.an('array');
      expect(APPLICANT_GATEWAY_URIS).to.have.lengthOf(2);
      console.log(`      ✔ APPLICANT_GATEWAY_URIS=`, APPLICANT_GATEWAY_URIS);
    });

    it('should contain property APPLICANT_DCX_AGENT_DATA_PATH as a string equal to "DATA/DCX/APPLICANT/AGENT"', () => {
      const APPLICANT_DCX_AGENT_DATA_PATH = ApplicantConfig.APPLICANT_DCX_AGENT_DATA_PATH;
      expect(APPLICANT_DCX_AGENT_DATA_PATH).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_DCX_AGENT_DATA_PATH).to.be.an('array');
      expect(APPLICANT_DCX_AGENT_DATA_PATH).to.have.lengthOf(1);
      console.log(`      ✔ APPLICANT_DCX_AGENT_DATA_PATH=`, APPLICANT_DCX_AGENT_DATA_PATH);
    });

    it('should contain property APPLICANT_WEB5_PASSWORD as a string', () => {
      const APPLICANT_WEB5_PASSWORD = ApplicantConfig.APPLICANT_WEB5_PASSWORD;
      expect(APPLICANT_WEB5_PASSWORD).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_WEB5_PASSWORD).to.be.an('string');
      console.log(`      ✔ APPLICANT_WEB5_PASSWORD=${APPLICANT_WEB5_PASSWORD}`);
    });

    it('should contain APPLICANT_WEB5_RECOVERY_PHRASE as a string', () => {
      const APPLICANT_WEB5_RECOVERY_PHRASE = ApplicantConfig.APPLICANT_WEB5_RECOVERY_PHRASE;
      expect(APPLICANT_WEB5_RECOVERY_PHRASE).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_WEB5_RECOVERY_PHRASE).to.be.an('string');
      console.log(`      ✔ APPLICANT_WEB5_RECOVERY_PHRASE=${APPLICANT_WEB5_RECOVERY_PHRASE}`);
    });
  });

  describe('extends Config class', () => {
    it('should contain property DCX_ENDPOINTS inherited from Config class as an object containing 3 key value pairs', () => {
      const DCX_ENDPOINTS = ApplicantConfig.DCX_ENDPOINTS;
      expect(DCX_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DCX_ENDPOINTS)).to.have.lengthOf(3);
      console.log(`      ✔ DCX_ENDPOINTS=`, DCX_ENDPOINTS);
    });

    it('should contain property DCX_INPUT_ISSUERS inherited from Config class as an array of length 1', () => {
      const DCX_INPUT_ISSUERS = ApplicantConfig.DCX_INPUT_ISSUERS;
      expect(DCX_INPUT_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DCX_INPUT_ISSUERS).to.be.an('array');
      expect(DCX_INPUT_ISSUERS).to.have.lengthOf(1);
      console.log(`      ✔ DCX_INPUT_ISSUERS=`, DCX_INPUT_ISSUERS);
    });
  });
});
