import { expect } from 'chai';
import dotenv from 'dotenv';
import { config as dcxConfig, Logger, stringifier } from '../src/index.js';
dotenv.config({ path: '.env.test' });

describe('Config class', () => {
  describe('with NODE_ENV defined dynamically and static, predefined properties', () => {
    it('should contain property DCX_ENV as a string matching "development" or "test"', () => {
      const DCX_ENV = dcxConfig.DCX_ENV;
      expect(DCX_ENV).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENV).to.be.a('string');
      expect(DCX_ENV).to.be.match(/(development|test)/);
      Logger.log(`      ✔ DCX_ENV=${DCX_ENV}`);
    });

    it('should contain property DCX_ENDPOINTS as an object containing 3 key value pairs', () => {
      const DCX_ENDPOINTS = dcxConfig.DCX_ENDPOINTS;
      expect(DCX_ENDPOINTS).to.not.be.null.and.not.be.undefined;
      expect(DCX_ENDPOINTS).to.be.an('object');
      expect(Object.entries(DCX_ENDPOINTS)).have.lengthOf.gte(3);
      Logger.log(`      ✔ DCX_ENDPOINTS=`, stringifier(DCX_ENDPOINTS));
    });

    it('should contain property DCX_INPUT_ISSUERS as an array of length >= 1', () => {
      const DCX_INPUT_ISSUERS = dcxConfig.DCX_INPUT_ISSUERS;
      expect(DCX_INPUT_ISSUERS).to.not.be.null.and.not.be.undefined;
      expect(DCX_INPUT_ISSUERS).to.be.an('array');
      expect(DCX_INPUT_ISSUERS).to.have.lengthOf.gte(1);
      Logger.log(`      ✔ DCX_INPUT_ISSUERS=`, stringifier(DCX_INPUT_ISSUERS));
    });

    it('should contain property DCX_HANDSHAKE_MANIFEST as an object with key value pair "id": "DCX-HANDSHAKE-MANIFEST"', () => {
      const DCX_HANDSHAKE_MANIFEST = dcxConfig.DCX_HANDSHAKE_MANIFEST;
      expect(DCX_HANDSHAKE_MANIFEST).to.not.be.null.and.not.be.undefined;
      expect(DCX_HANDSHAKE_MANIFEST).to.be.an('object');
      expect(DCX_HANDSHAKE_MANIFEST.id).to.equal('DCX-HANDSHAKE-MANIFEST');
      Logger.log(`      ✔ DCX_HANDSHAKE_MANIFEST=`, stringifier(DCX_HANDSHAKE_MANIFEST));
    });
  });
});