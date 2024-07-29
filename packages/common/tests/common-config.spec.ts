import { expect } from 'chai';
import dotenv from 'dotenv';
import { Config } from '../src/config';
dotenv.config({ path: '.env.test' });

describe('Config class', () => {
  describe('properties defined by process.env vars', () => {
    it('should contain property DCX_ENV as string equal to "test" or "development"', () => {
      const DCX_ENV = Config.DCX_ENV;
      expect(DCX_ENV).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENV).to.be.an('object');
      expect(Object.entries(DCX_ENV)).to.have.lengthOf(3);
      console.log(`      ✔ DCX_ENV=`, DCX_ENV);
    });

    it('should contain property DCX_ENDPOINTS as an object containing 3 entries', () => {
      const DCX_ENDPOINTS = Config.DCX_ENDPOINTS;
      expect(DCX_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DCX_ENDPOINTS)).to.have.lengthOf(3);
      console.log(`      ✔ DCX_ENDPOINTS=`, DCX_ENDPOINTS);
    });

    it('should contain property DCX_INPUT_ISSUERS as an object containing 3 entries', () => {
      const DCX_INPUT_ISSUERS = Config.DCX_INPUT_ISSUERS;
      expect(DCX_INPUT_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DCX_INPUT_ISSUERS).to.be.an('object');
      expect(Object.entries(DCX_INPUT_ISSUERS)).to.have.lengthOf(3);
      console.log(`      ✔ DCX_INPUT_ISSUERS=`, DCX_INPUT_ISSUERS);
    });

    it('should contain property DCX_HANDSHAKE_MANIFEST as an array of length 1', () => {
      const DCX_HANDSHAKE_MANIFEST = Config.DCX_HANDSHAKE_MANIFEST;
      expect(DCX_HANDSHAKE_MANIFEST).to.not.be.null.and.not.be.undefined;
      expect(DCX_HANDSHAKE_MANIFEST).to.be.an('array');
      expect(DCX_HANDSHAKE_MANIFEST).to.have.lengthOf(1);
      console.log(`      ✔ DCX_HANDSHAKE_MANIFEST=`, DCX_HANDSHAKE_MANIFEST);
    });
  });
});
