// import dotenv from 'dotenv';
// dotenv.config({ path: '.env.test' });

import { Config, stringifier } from '@dcx-protocol/common';
import { expect } from 'chai';
import { ApplicantConfig, ApplicantSecrets } from '../src/applicant-config.js';

describe('ApplicantConfig class', () => {
  before(() => {
    Config.DCX_ENV = 'test';
    ApplicantConfig.APPLICANT_PORT                 = '5000';
    ApplicantConfig.APPLICANT_SERVICE_NAME         = '@dcx-protocol/applicant';
    ApplicantConfig.APPLICANT_SERVICE_ID           = 'dcx-applicant';
    ApplicantConfig.APPLICANT_CURSOR               = 'applicant-cursor.json';
    ApplicantConfig.APPLICANT_LAST_RECORD_ID       = 'lastRecordId.applicant';
    ApplicantSecrets.APPLICANT_WEB5_PASSWORD        = 'connect demand reflect connect vote demand';
    ApplicantSecrets.APPLICANT_WEB5_RECOVERY_PHRASE = 'laundry coast prepare turkey soup anxiety funny invest awesome bonus aisle boring';
    ApplicantSecrets.APPLICANT_WEB5_AGENT_DATA_PATH = 'DATA/DCX/APPLICANT/AGENT';
  });

  describe('properties defined by process.env vars', () => {
    it('should contain property APPLICANT_PORT as a string equal to 5000', () => {
      const APPLICANT_PORT = ApplicantConfig.APPLICANT_PORT;
      expect(APPLICANT_PORT).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_PORT).to.be.a('string');
      expect(APPLICANT_PORT).equals('5000');
      console.log(`      ✔ APPLICANT_PORT=${APPLICANT_PORT}`);
    });

    it('should contain property APPLICANT_SERVICE_NAME as a string equal to "@dcx-protocol/applicant"', () => {
      const APPLICANT_SERVICE_NAME = ApplicantConfig.APPLICANT_SERVICE_NAME;
      expect(APPLICANT_SERVICE_NAME).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_SERVICE_NAME).to.be.a('string');
      expect(APPLICANT_SERVICE_NAME).equals('@dcx-protocol/applicant');
      console.log(`      ✔ APPLICANT_SERVICE_NAME=${APPLICANT_SERVICE_NAME}`);
    });

    it('should contain property APPLICANT_SERVICE_ID as a string equal to "dcx-applicant"', () => {
      const APPLICANT_SERVICE_ID = ApplicantConfig.APPLICANT_SERVICE_ID;
      expect(APPLICANT_SERVICE_ID).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_SERVICE_ID).to.be.a('string');
      expect(APPLICANT_SERVICE_ID).equals('dcx-applicant');
      console.log(`      ✔ APPLICANT_SERVICE_ID=${APPLICANT_SERVICE_ID}`);
    });

    it('should contain property APPLICANT_CURSOR as a string equal to applicant-cursor.json', () => {
      const APPLICANT_CURSOR = ApplicantConfig.APPLICANT_CURSOR;
      expect(APPLICANT_CURSOR).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_CURSOR).to.be.a('string');
      expect(APPLICANT_CURSOR).equals('applicant-cursor.json');
      console.log(`      ✔ APPLICANT_CURSOR=${APPLICANT_CURSOR}`);
    });

    it('should contain property APPLICANT_LAST_RECORD_ID as a string equal to lastRecordId.applicant', () => {
      const APPLICANT_LAST_RECORD_ID = ApplicantConfig.APPLICANT_LAST_RECORD_ID;
      expect(APPLICANT_LAST_RECORD_ID).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_LAST_RECORD_ID).to.be.a('string');
      expect(APPLICANT_LAST_RECORD_ID).equals('lastRecordId.applicant');
      console.log(`      ✔ APPLICANT_LAST_RECORD_ID=${APPLICANT_LAST_RECORD_ID}`);
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

    it('should contain property APPLICANT_WEB5_AGENT_DATA_PATH as a string equal to "DATA/DCX/APPLICANT/AGENT"', () => {
      const APPLICANT_WEB5_AGENT_DATA_PATH = ApplicantConfig.APPLICANT_WEB5_AGENT_DATA_PATH;
      expect(APPLICANT_WEB5_AGENT_DATA_PATH).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_WEB5_AGENT_DATA_PATH).to.be.a('string');
      expect(APPLICANT_WEB5_AGENT_DATA_PATH).equals('DATA/DCX/APPLICANT/AGENT');
      console.log(`      ✔ APPLICANT_WEB5_AGENT_DATA_PATH=`, APPLICANT_WEB5_AGENT_DATA_PATH);
    });

    it('should contain property APPLICANT_WEB5_PASSWORD as a string', () => {
      const APPLICANT_WEB5_PASSWORD = ApplicantSecrets.APPLICANT_WEB5_PASSWORD;
      expect(APPLICANT_WEB5_PASSWORD).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_WEB5_PASSWORD).to.be.a('string');
      console.log(`      ✔ APPLICANT_WEB5_PASSWORD=${APPLICANT_WEB5_PASSWORD}`);
    });

    it('should contain APPLICANT_WEB5_RECOVERY_PHRASE as a string', () => {
      const APPLICANT_WEB5_RECOVERY_PHRASE = ApplicantSecrets.APPLICANT_WEB5_RECOVERY_PHRASE;
      expect(APPLICANT_WEB5_RECOVERY_PHRASE).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_WEB5_RECOVERY_PHRASE).to.be.a('string');
      console.log(`      ✔ APPLICANT_WEB5_RECOVERY_PHRASE=${APPLICANT_WEB5_RECOVERY_PHRASE}`);
    });
  });

  describe('extends Config class', () => {
    it('should contain property DCX_ENV inherited from Config class as a string matching "development" or "test"', () => {
      const DCX_ENV = ApplicantConfig.DCX_ENV;
      expect(DCX_ENV).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENV).to.be.a('string');
      expect(DCX_ENV).to.be.match(/(development|test)/);
      console.log(`      ✔ DCX_ENV=${DCX_ENV}`);
    });

    it('should contain property DCX_ENDPOINTS inherited from Config class as an object containing 3 key value pairs', () => {
      const DCX_ENDPOINTS = ApplicantConfig.DCX_ENDPOINTS;
      expect(DCX_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DCX_ENDPOINTS)).to.have.lengthOf(3);
      console.log(`      ✔ DCX_ENDPOINTS=`, stringifier(DCX_ENDPOINTS));
    });

    it('should contain property DCX_INPUT_ISSUERS inherited from Config class as an array of length 1', () => {
      const DCX_INPUT_ISSUERS = ApplicantConfig.DCX_INPUT_ISSUERS;
      expect(DCX_INPUT_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DCX_INPUT_ISSUERS).to.be.an('array');
      expect(DCX_INPUT_ISSUERS).to.have.lengthOf(1);
      console.log(`      ✔ DCX_INPUT_ISSUERS=`, stringifier(DCX_INPUT_ISSUERS));
    });

    it('should contain property DCX_HANDSHAKE_MANIFEST inherited from Config class as an object of type ServerManifest', () => {
      const DCX_HANDSHAKE_MANIFEST = ApplicantConfig.DCX_HANDSHAKE_MANIFEST;
      expect(DCX_HANDSHAKE_MANIFEST).to.not.be.null.and.not.be.undefined;
      expect(DCX_HANDSHAKE_MANIFEST).to.be.an('object');
      expect(DCX_HANDSHAKE_MANIFEST).to.have.lengthOf(1);
      // expect(DCX_HANDSHAKE_MANIFEST).to.be.instanceof(ServerManifest);
      console.log(`      ✔ DCX_HANDSHAKE_MANIFEST=`, stringifier(DCX_HANDSHAKE_MANIFEST));
    });
  });
});
