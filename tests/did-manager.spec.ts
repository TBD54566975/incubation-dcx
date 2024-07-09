import { expect } from 'chai';

import { DidManager } from '../src/core/web5-manager';

describe('DidManager', () => {
  const { did, bearerDid, portableDid } = new DidManager('', '', '');

  describe('createBearerDid', () => {
    it('uses DidDht to create a BearerDid object, set static class var bearerDid and return this.bearerDid', () => {

      expect(did).to.not.be.undefined;
      expect(bearerDid).to.not.be.undefined;
      expect(portableDid).to.not.be.undefined;

    });
  });
});