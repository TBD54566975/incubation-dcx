import { Config } from '@dcx-protocol/common';
import { expect } from 'chai';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

describe('Config class', () => {
  describe('properties defined by process.env vars', () => {
    it('should contain property LAST_RECORD_ID as a string', () => {
      const LAST_RECORD_ID = Config.LAST_RECORD_ID;
      expect(LAST_RECORD_ID).to.not.be.null.and.not.be.undefined;
      expect(LAST_RECORD_ID).to.be.an('string');
      console.log(`      ✔ LAST_RECORD_ID=${LAST_RECORD_ID}`);
    });

    it('should contain property CURSOR as a string', () => {
      const CURSOR = Config.CURSOR;
      expect(CURSOR).to.not.be.null.and.not.be.undefined;
      expect(CURSOR).to.be.an('string');
      console.log(`      ✔ CURSOR=${CURSOR}`);
    });

    it('should contain property NODE_ENV as a string equal to "test" or "development"', () => {
      const NODE_ENV = Config.NODE_ENV;
      expect(NODE_ENV).to.not.be.null.and.not.be.undefined;
      expect(NODE_ENV).to.be.an('string');
      expect(NODE_ENV).to.be.match(/(development|test)/);
      console.log(`      ✔ NODE_ENV=${NODE_ENV}`);
    });

    it('should contain property SERVICE_NAME as a string equal to "dcx"', () => {
      const SERVICE_NAME = Config.SERVICE_NAME;
      expect(SERVICE_NAME).to.not.be.null.and.not.be.undefined;
      expect(SERVICE_NAME).to.be.an('string');
      expect(SERVICE_NAME).equals('dcx');
      console.log(`      ✔ SERVICE_NAME=${SERVICE_NAME}`);
    });

    it('should contain property SERVICE_ID as a string equal to "dcx"', () => {
      const SERVICE_ID = Config.SERVICE_ID;
      expect(SERVICE_ID).to.not.be.null.and.not.be.undefined;
      expect(SERVICE_ID).to.be.an('string');
      expect(SERVICE_ID).equals('dcx');
      console.log(`      ✔ SERVICE_ID=${SERVICE_ID}`);
    });

    it('should contain property DEFAULT_ENDPOINTS as an object containing 3 key value pairs', () => {
      const DEFAULT_ENDPOINTS = Config.DEFAULT_ENDPOINTS;
      expect(DEFAULT_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DEFAULT_ENDPOINTS)).to.have.lengthOf(3);
      console.log(`      ✔ DEFAULT_ENDPOINTS=`, DEFAULT_ENDPOINTS);
    });

    it('should contain property DEFAULT_DWN_ENDPOINTS as an array of length 2', () => {
      const DEFAULT_DWN_ENDPOINTS = Config.DEFAULT_DWN_ENDPOINTS;
      expect(DEFAULT_DWN_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_DWN_ENDPOINTS).to.be.an('array');
      expect(DEFAULT_DWN_ENDPOINTS).to.have.lengthOf(2);
      console.log(`      ✔ DEFAULT_DWN_ENDPOINTS=`, DEFAULT_DWN_ENDPOINTS);
    });

    it('should contain property DEFAULT_GATEWAY_URIS as an array of length 2', () => {
      const DEFAULT_GATEWAY_URIS = Config.DEFAULT_GATEWAY_URIS;
      expect(DEFAULT_GATEWAY_URIS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_GATEWAY_URIS).to.be.an('array');
      expect(DEFAULT_GATEWAY_URIS).to.have.lengthOf(2);
      console.log(`      ✔ DEFAULT_GATEWAY_URIS=`, DEFAULT_GATEWAY_URIS);
    });

    it('should contain property DEFAULT_TRUSTED_ISSUERS as an array of length 1', () => {
      const DEFAULT_TRUSTED_ISSUERS = Config.DEFAULT_TRUSTED_ISSUERS;
      expect(DEFAULT_TRUSTED_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_TRUSTED_ISSUERS).to.be.an('array');
      expect(DEFAULT_TRUSTED_ISSUERS).to.have.lengthOf(1);
      console.log(`      ✔ DEFAULT_TRUSTED_ISSUERS=`, DEFAULT_TRUSTED_ISSUERS);
    });

    it('should contain property DEFAULT_TRUSTED_ISSUER_DIDS as an array of length 1', () => {
      const DEFAULT_TRUSTED_ISSUER_DIDS = Config.DEFAULT_TRUSTED_ISSUER_DIDS;
      expect(DEFAULT_TRUSTED_ISSUER_DIDS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_TRUSTED_ISSUER_DIDS).to.be.an('array');
      expect(DEFAULT_TRUSTED_ISSUER_DIDS).to.have.lengthOf(1);
      console.log(`      ✔ DEFAULT_TRUSTED_ISSUER_DIDS=${DEFAULT_TRUSTED_ISSUER_DIDS}`);
    });

    it('should contain property WEB5_PASSWORD as a string', () => {
      const WEB5_PASSWORD = Config.WEB5_PASSWORD;
      expect(WEB5_PASSWORD).to.not.be.null.and.not.be.undefined;
      expect(WEB5_PASSWORD).to.be.an('string');
      console.log(`      ✔ WEB5_PASSWORD=${WEB5_PASSWORD}`);
    });

    it('should contain WEB5_RECOVERY_PHRASE as a string', () => {
      const WEB5_RECOVERY_PHRASE = Config.WEB5_RECOVERY_PHRASE;
      expect(WEB5_RECOVERY_PHRASE).to.not.be.null.and.not.be.undefined;
      expect(WEB5_RECOVERY_PHRASE).to.be.an('string');
      console.log(`      ✔ WEB5_RECOVERY_PHRASE=${WEB5_RECOVERY_PHRASE}`);
    });
  });
});
