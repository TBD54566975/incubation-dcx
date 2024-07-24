import dotenv from 'dotenv';
import { Config } from '@dcx-protocol/common';
import { expect } from 'chai';

describe('Config', () => {
  before(() => {
    dotenv.config({ path: './.env' });
    Config.WEB5_PASSWORD = process.env.WEB5_PASSWORD!;
    Config.WEB5_RECOVERY_PHRASE = process.env.WEB5_RECOVERY_PHRASE!;
  });

  describe('properties', () => {

    it('should be defined with process.env variables', () => {
      const NODE_ENV = Config.NODE_ENV;
      expect(NODE_ENV).to.not.be.null.and.not.be.undefined;
      expect(NODE_ENV).to.be.an('string');
      expect(NODE_ENV).to.be.match(/(development|test)/).that;

      const SERVICE_NAME = Config.SERVICE_NAME;
      expect(NODE_ENV).to.not.be.null.and.not.be.undefined;
      expect(SERVICE_NAME).to.be.an('string');

      const SERVICE_ID = Config.SERVICE_ID;
      expect(SERVICE_ID).to.not.be.null.and.not.be.undefined;
      expect(SERVICE_ID).to.be.an('string');

      const DEFAULT_ENDPOINTS = Config.DEFAULT_ENDPOINTS;
      expect(DEFAULT_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_ENDPOINTS).to.be.an('object');

      const DEFAULT_DWN_ENDPOINTS = Config.DEFAULT_DWN_ENDPOINTS;
      expect(DEFAULT_DWN_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_DWN_ENDPOINTS).to.be.an('array');

      const DEFAULT_GATEWAY_URIS = Config.DEFAULT_GATEWAY_URIS;
      expect(DEFAULT_GATEWAY_URIS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_GATEWAY_URIS).to.be.an('array');

      const DEFAULT_TRUSTED_ISSUERS = Config.DEFAULT_TRUSTED_ISSUERS;
      expect(DEFAULT_TRUSTED_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_TRUSTED_ISSUERS).to.be.an('array');

      const DEFAULT_TRUSTED_ISSUER_DIDS = Config.DEFAULT_TRUSTED_ISSUER_DIDS;
      expect(DEFAULT_TRUSTED_ISSUER_DIDS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_TRUSTED_ISSUER_DIDS).to.be.an('array');

      const WEB5_PASSWORD = Config.WEB5_PASSWORD;
      expect(WEB5_PASSWORD).to.not.be.null.and.not.be.undefined;
      expect(WEB5_PASSWORD).to.be.an('string');

      const WEB5_RECOVERY_PHRASE = Config.WEB5_RECOVERY_PHRASE;
      expect(WEB5_RECOVERY_PHRASE).to.not.be.null.and.not.be.undefined;
      expect(WEB5_RECOVERY_PHRASE).to.be.an('string');
    });
  });
});