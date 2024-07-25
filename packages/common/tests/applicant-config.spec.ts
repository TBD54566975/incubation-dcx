
import { expect } from 'chai';
import dotenv from 'dotenv';
import { Config } from '../src/config';
dotenv.config({ path: '.env' });

describe('Config class', () => {
  describe('properties defined by process.env vars', () => {
    it('should contain property DEFAULT_ENDPOINTS as an object containing 3 key value pairs', () => {
      const DEFAULT_ENDPOINTS = Config.DCX_ENDPOINTS;
      expect(DEFAULT_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DEFAULT_ENDPOINTS)).to.have.lengthOf(3);
      console.log(`      ✔ DEFAULT_ENDPOINTS=`, DEFAULT_ENDPOINTS);
    });
    // DCX_NODE_ENV, DCX_HANDSHAKE_MANIFEST
    it('should contain property DEFAULT_TRUSTED_ISSUERS as an array of length 1', () => {
      const DEFAULT_TRUSTED_ISSUERS = Config.DCX_INPUT_ISSUERS;
      expect(DEFAULT_TRUSTED_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DEFAULT_TRUSTED_ISSUERS).to.be.an('array');
      expect(DEFAULT_TRUSTED_ISSUERS).to.have.lengthOf(1);
      console.log(`      ✔ DEFAULT_TRUSTED_ISSUERS=`, DEFAULT_TRUSTED_ISSUERS);
    });
  });
});
