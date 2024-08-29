import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expect } from 'chai';
import { dcxConfig } from '../src/index.js';

describe('DcxConfig', () => {

  it('should have entries of length >= 6', () => {
    expect(Object.entries(dcxConfig)).to.have.lengthOf.gte(6);
  });

  it('should have property "handlers" as an array with length 0', () => {
    expect(dcxConfig.handlers).to.be.an('array').and.to.have.lengthOf(0);
  });

  it('should have property "providers" as an array with length 0', () => {
    expect(dcxConfig.providers).to.be.an('array').and.to.have.lengthOf(0);
  });

  it('should have property "manifests" as an array with length 1', () => {
    expect(dcxConfig.manifests).to.be.an('array').and.to.have.lengthOf(1);
  });

  it('should have property "issuers" as an array with length 2', () => {
    expect(dcxConfig.issuers).to.be.an('array').and.to.have.lengthOf(2);
  });

  it('should have property "gateways" as an array with length 1', () => {
    expect(dcxConfig.gateways).to.be.an('array').and.to.have.lengthOf(1);
  });

  it('should have property "dwns" as an array with length 1', () => {
    expect(dcxConfig.dwns).to.be.an('array').and.to.have.lengthOf(1);
  });
});