
import { expect } from 'chai';
import dotenv from 'dotenv';
import { IssuerConfig } from '../src/config';
dotenv.config({ path: './.env' });

describe('IssuerConfig class', () => {
  describe('properties defined by process.env vars', () => {
    it('should contain property ISSUER_LAST_RECORD_ID as a string', () => {
      const ISSUER_LAST_RECORD_ID = IssuerConfig.ISSUER_LAST_RECORD_ID;
      expect(ISSUER_LAST_RECORD_ID).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_LAST_RECORD_ID).to.be.an('string');
      console.log(`      ✔ ISSUER_LAST_RECORD_ID=${ISSUER_LAST_RECORD_ID}`);
    });

    it('should contain property ISSUER_CURSOR as a string', () => {
      const ISSUER_CURSOR = IssuerConfig.ISSUER_CURSOR;
      expect(ISSUER_CURSOR).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_CURSOR).to.be.an('string');
      console.log(`      ✔ ISSUER_CURSOR=${ISSUER_CURSOR}`);
    });

    it('should contain property NODE_ENV as a string equal to "test" or "development"', () => {
      const ISSUER_NODE_ENV = IssuerConfig.ISSUER_NODE_ENV;
      expect(ISSUER_NODE_ENV).to.not.be.null.and.not.be.undefined;
      expect(ISSUER_NODE_ENV).to.be.an('string');
      expect(ISSUER_NODE_ENV).to.be.match(/(development|test)/);
      console.log(`      ✔ ISSUER_NODE_ENV=${ISSUER_NODE_ENV}`);
    });

    it('should contain property SERVICE_NAME as a string equal to "dcx"', () => {
      const SERVICE_NAME = IssuerConfig.ISSUER_SERVICE_NAME;
      expect(SERVICE_NAME).to.not.be.null.and.not.be.undefined;
      expect(SERVICE_NAME).to.be.an('string');
      expect(SERVICE_NAME).equals('dcx');
      console.log(`      ✔ SERVICE_NAME=${SERVICE_NAME}`);
    });

    it('should contain property SERVICE_ID as a string equal to "dcx"', () => {
      const SERVICE_ID = IssuerConfig.ISSUER_SERVICE_ID;
      expect(SERVICE_ID).to.not.be.null.and.not.be.undefined;
      expect(SERVICE_ID).to.be.an('string');
      expect(SERVICE_ID).equals('dcx');
      console.log(`      ✔ SERVICE_ID=${SERVICE_ID}`);
    });

    it('should contain property DEFAULT_ENDPOINTS as an object containing 3 key value pairs', () => {
      const DEFAULT_ENDPOINTS = IssuerConfig.DCX_ENDPOINTS;
      expect(DEFAULT_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DEFAULT_ENDPOINTS)).to.have.lengthOf(3);
      console.log(`      ✔ DEFAULT_ENDPOINTS=`, DEFAULT_ENDPOINTS);
    });

    it('should contain property DEFAULT_DWN_ENDPOINTS as an array of length 2', () => {
      const DEFAULT_DWN_ENDPOINTS = IssuerConfig.ISSUER_DWN_ENDPOINTS;
      expect(DEFAULT_DWN_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_DWN_ENDPOINTS).to.be.an('array');
      expect(DEFAULT_DWN_ENDPOINTS).to.have.lengthOf(2);
      console.log(`      ✔ DEFAULT_DWN_ENDPOINTS=`, DEFAULT_DWN_ENDPOINTS);
    });

    it('should contain property DEFAULT_GATEWAY_URIS as an array of length 2', () => {
      const DEFAULT_GATEWAY_URIS = IssuerConfig.ISSUER_GATEWAY_URIS;
      expect(DEFAULT_GATEWAY_URIS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_GATEWAY_URIS).to.be.an('array');
      expect(DEFAULT_GATEWAY_URIS).to.have.lengthOf(2);
      console.log(`      ✔ DEFAULT_GATEWAY_URIS=`, DEFAULT_GATEWAY_URIS);
    });

    it('should contain property DEFAULT_TRUSTED_ISSUERS as an array of length 1', () => {
      const DEFAULT_TRUSTED_ISSUERS = IssuerConfig.DCX_INPUT_ISSUERS;
      expect(DEFAULT_TRUSTED_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_TRUSTED_ISSUERS).to.be.an('array');
      expect(DEFAULT_TRUSTED_ISSUERS).to.have.lengthOf(1);
      console.log(`      ✔ DEFAULT_TRUSTED_ISSUERS=`, DEFAULT_TRUSTED_ISSUERS);
    });

    it('should contain property WEB5_PASSWORD as a string', () => {
      const WEB5_PASSWORD = IssuerConfig.ISSUER_WEB5_PASSWORD;
      expect(WEB5_PASSWORD).to.not.be.null.and.not.be.undefined;
      expect(WEB5_PASSWORD).to.be.an('string');
      console.log(`      ✔ WEB5_PASSWORD=${WEB5_PASSWORD}`);
    });

    it('should contain WEB5_RECOVERY_PHRASE as a string', () => {
      const WEB5_RECOVERY_PHRASE = IssuerConfig.ISSUER_WEB5_RECOVERY_PHRASE;
      expect(WEB5_RECOVERY_PHRASE).to.not.be.null.and.not.be.undefined;
      expect(WEB5_RECOVERY_PHRASE).to.be.an('string');
      console.log(`      ✔ WEB5_RECOVERY_PHRASE=${WEB5_RECOVERY_PHRASE}`);
    });
  });
});
