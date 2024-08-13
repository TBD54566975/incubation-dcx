import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expect } from 'chai';
import { dcxIssuerConfig } from '../src/index.js';

process.env.NODE_ENV = 'test';

describe('dcxIssuerConfig class', () => {
  describe('default properties', () => {
    it('should contain property ISSUER_PORT as a number equal to 5000', () => {
      const ISSUER_PORT = dcxIssuerConfig.port;
      expect(ISSUER_PORT).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_PORT).to.be.a('number');
      expect(ISSUER_PORT).equals(4000);
    });

    it('should contain property ISSUER_SERVICE_NAME as a string equal to "@dcx-protocol/issuer"', () => {
      const ISSUER_SERVICE_NAME = dcxIssuerConfig.serviceName;
      expect(ISSUER_SERVICE_NAME).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_SERVICE_NAME).to.be.a('string');
      expect(ISSUER_SERVICE_NAME).equals('@dcx-protocol/issuer');
    });

    it('should contain property ISSUER_SERVICE_ID as a string equal to "dcx-issuer"', () => {
      const ISSUER_SERVICE_ID = dcxIssuerConfig.serviceId;
      expect(ISSUER_SERVICE_ID).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_SERVICE_ID).to.be.a('string');
      expect(ISSUER_SERVICE_ID).equals('dcx-issuer');
    });

    it('should contain property ISSUER_CURSOR as a string equal to issuer-cursor.json', () => {
      const ISSUER_CURSOR = dcxIssuerConfig.cursorFile;
      expect(ISSUER_CURSOR).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_CURSOR).to.be.a('string');
      expect(ISSUER_CURSOR).equals('issuer-cursor.json');
    });

    it('should contain property ISSUER_LAST_RECORD_ID as a string equal to lastRecordId.issuer', () => {
      const ISSUER_LAST_RECORD_ID = dcxIssuerConfig.lastRecordIdFile;
      expect(ISSUER_LAST_RECORD_ID).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_LAST_RECORD_ID).to.be.a('string');
      expect(ISSUER_LAST_RECORD_ID).equals('lastRecordId.issuer');
    });

    it('should contain property ISSUER_DWN_ENDPOINTS as an array of length 2', () => {
      const ISSUER_DWN_ENDPOINTS = dcxIssuerConfig.dwnEndpoints;
      expect(ISSUER_DWN_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_DWN_ENDPOINTS).to.be.an('array');
      expect(ISSUER_DWN_ENDPOINTS).to.have.lengthOf.gte(1);
    });

    it('should contain property ISSUER_GATEWAY_URIS as an array of length 2', () => {
      const ISSUER_GATEWAY_URIS = dcxIssuerConfig.gatewayUris;
      expect(ISSUER_GATEWAY_URIS).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_GATEWAY_URIS).to.be.an('array');
      expect(ISSUER_GATEWAY_URIS).to.have.lengthOf.gte(1);
    });

    it('should contain property ISSUER_WEB5_AGENT_DATA_PATH as a string equal to "DATA/DCX/ISSUER/AGENT"', () => {
      const ISSUER_WEB5_AGENT_DATA_PATH = dcxIssuerConfig.agentDataPath;
      expect(ISSUER_WEB5_AGENT_DATA_PATH).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_WEB5_AGENT_DATA_PATH).to.be.a('string');
      expect(ISSUER_WEB5_AGENT_DATA_PATH).equals('DATA/DCX/ISSUER/AGENT');
    });

    it('should contain property ISSUER_WEB5_PASSWORD as a string', () => {
      const ISSUER_WEB5_PASSWORD = dcxIssuerConfig.web5Password;
      expect(ISSUER_WEB5_PASSWORD).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_WEB5_PASSWORD).to.be.a('string');
    });

    it('should contain ISSUER_WEB5_RECOVERY_PHRASE as a string', () => {
      const ISSUER_WEB5_RECOVERY_PHRASE = dcxIssuerConfig.web5RecoveryPhrase;
      expect(ISSUER_WEB5_RECOVERY_PHRASE).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_WEB5_RECOVERY_PHRASE).to.be.a('string');
    });
  });

  describe('extends Config class', () => {
    it('should contain property DCX_ENDPOINTS inherited from Config class as an object containing 3 key value pairs', () => {
      const DCX_ENDPOINTS = dcxIssuerConfig.DCX_ENDPOINTS;
      expect(DCX_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DCX_ENDPOINTS)).have.lengthOf.gte(3);
    });

    it('should contain property DCX_INPUT_ISSUERS inherited from Config class as an array of length 1', () => {
      const DCX_INPUT_ISSUERS = dcxIssuerConfig.DCX_INPUT_ISSUERS;
      expect(DCX_INPUT_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DCX_INPUT_ISSUERS).to.be.an('array');
      expect(DCX_INPUT_ISSUERS).to.have.lengthOf.gte(1);
    });

    it('should contain property DCX_HANDSHAKE_MANIFEST inherited from Config class as an object of type ServerManifest', () => {
      const DCX_HANDSHAKE_MANIFEST = dcxIssuerConfig.DCX_HANDSHAKE_MANIFEST;
      expect(DCX_HANDSHAKE_MANIFEST).to.not.be.null.and.not.be.undefined;
      expect(DCX_HANDSHAKE_MANIFEST).to.be.an('object');
      expect(DCX_HANDSHAKE_MANIFEST.id).to.equal('DCX-HANDSHAKE-MANIFEST');
    });
  });
});
