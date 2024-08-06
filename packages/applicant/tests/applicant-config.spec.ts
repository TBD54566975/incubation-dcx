import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expect } from 'chai';
import { applicantConfig } from '../src/config.js';

describe('ApplicantConfig class', () => {
  applicantConfig.DCX_ENV = 'test';

  describe('has properties defined by process.env vars and ', () => {
    it('should contain property APPLICANT_PORT as a number equal to 5000', () => {
      const APPLICANT_PORT = applicantConfig.port;
      expect(APPLICANT_PORT).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_PORT).to.be.a('number');
      expect(APPLICANT_PORT).equals(5000);
    });

    it('should contain property APPLICANT_SERVICE_NAME as a string equal to "@dcx-protocol/applicant"', () => {
      const APPLICANT_SERVICE_NAME = applicantConfig.serviceName;
      expect(APPLICANT_SERVICE_NAME).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_SERVICE_NAME).to.be.a('string');
      expect(APPLICANT_SERVICE_NAME).equals('@dcx-protocol/applicant');
    });

    it('should contain property APPLICANT_SERVICE_ID as a string equal to "dcx-applicant"', () => {
      const APPLICANT_SERVICE_ID = applicantConfig.serviceId;
      expect(APPLICANT_SERVICE_ID).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_SERVICE_ID).to.be.a('string');
      expect(APPLICANT_SERVICE_ID).equals('dcx-applicant');
    });

    it('should contain property APPLICANT_CURSOR as a string equal to applicant-cursor.json', () => {
      const APPLICANT_CURSOR = applicantConfig.cursorFile;
      expect(APPLICANT_CURSOR).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_CURSOR).to.be.a('string');
      expect(APPLICANT_CURSOR).equals('applicant-cursor.json');
    });

    it('should contain property APPLICANT_LAST_RECORD_ID as a string equal to lastRecordId.applicant', () => {
      const APPLICANT_LAST_RECORD_ID = applicantConfig.lastRecordIdFile;
      expect(APPLICANT_LAST_RECORD_ID).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_LAST_RECORD_ID).to.be.a('string');
      expect(APPLICANT_LAST_RECORD_ID).equals('lastRecordId.applicant');
    });

    it('should contain property APPLICANT_DWN_ENDPOINTS as an array of length 1', () => {
      const APPLICANT_DWN_ENDPOINTS = applicantConfig.dwnEndpoints;
      expect(APPLICANT_DWN_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_DWN_ENDPOINTS).to.be.an('array');
      expect(APPLICANT_DWN_ENDPOINTS).to.have.lengthOf.gte(1);
    });

    it('should contain property APPLICANT_GATEWAY_URIS as an array of length 1', () => {
      const APPLICANT_GATEWAY_URIS = applicantConfig.gatewayUris;
      expect(APPLICANT_GATEWAY_URIS).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_GATEWAY_URIS).to.be.an('array');
      expect(APPLICANT_GATEWAY_URIS).to.have.lengthOf.gte(1);
    });

    it('should contain property APPLICANT_WEB5_AGENT_DATA_PATH as a string equal to "DATA/DCX/APPLICANT/AGENT"', () => {
      const APPLICANT_WEB5_AGENT_DATA_PATH = applicantConfig.agentDataPath;
      expect(APPLICANT_WEB5_AGENT_DATA_PATH).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_WEB5_AGENT_DATA_PATH).to.be.a('string');
      expect(APPLICANT_WEB5_AGENT_DATA_PATH).equals('DATA/DCX/APPLICANT/AGENT');
    });

    it('should contain property APPLICANT_WEB5_PASSWORD as a string', () => {
      const APPLICANT_WEB5_PASSWORD = applicantConfig.web5Password;
      expect(APPLICANT_WEB5_PASSWORD).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_WEB5_PASSWORD).to.be.a('string');
    });

    it('should contain APPLICANT_WEB5_RECOVERY_PHRASE as a string', () => {
      const APPLICANT_WEB5_RECOVERY_PHRASE = applicantConfig.web5RecoveryPhrase;
      expect(APPLICANT_WEB5_RECOVERY_PHRASE).to.not.be.null.and.not.be.undefined;
      expect(APPLICANT_WEB5_RECOVERY_PHRASE).to.be.a('string');
    });
  });

  describe('extends Config class', () => {
    it('should contain property DCX_ENV inherited from Config class as a string matching "development" or "test"', () => {
      const DCX_ENV = applicantConfig.DCX_ENV;
      expect(DCX_ENV).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENV).to.be.a('string');
      expect(DCX_ENV).to.be.match(/(development|test)/);
    });

    it('should contain property DCX_ENDPOINTS inherited from Config class as an object containing 3 key value pairs', () => {
      const DCX_ENDPOINTS = applicantConfig.DCX_ENDPOINTS;
      expect(DCX_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DCX_ENDPOINTS)).have.lengthOf.gte(3);
    });

    it('should contain property DCX_INPUT_ISSUERS inherited from Config class as an array of length 1', () => {
      const DCX_INPUT_ISSUERS = applicantConfig.DCX_INPUT_ISSUERS;
      expect(DCX_INPUT_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DCX_INPUT_ISSUERS).to.be.an('array');
      expect(DCX_INPUT_ISSUERS).to.have.lengthOf.gte(1);
    });

    it('should contain property DCX_HANDSHAKE_MANIFEST inherited from Config class as an object of type ServerManifest', () => {
      const DCX_HANDSHAKE_MANIFEST = applicantConfig.DCX_HANDSHAKE_MANIFEST;
      expect(DCX_HANDSHAKE_MANIFEST).to.not.be.null.and.not.be.undefined;
      expect(DCX_HANDSHAKE_MANIFEST).to.be.an('object');
      expect(DCX_HANDSHAKE_MANIFEST.id).to.equal('DCX-HANDSHAKE-MANIFEST');
    });
  });
});
