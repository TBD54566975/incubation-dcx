import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expect } from 'chai';
import { issuerConfig } from '../src/index.js';

process.env.NODE_ENV = 'test';

describe('IssuerConfig', () => {

  it('should have property "cursorFile" as a string', () => {
    expect(issuerConfig.cursorFile).to.be.a('string');
  });

  it('should have property "lastRecordIdFile" as a string', () => {
    expect(issuerConfig.lastRecordIdFile).to.be.a('string');
  });

  it('should have property "agentDataPath" as a string', () => {
    expect(issuerConfig.agentDataPath).to.be.a('string');
  });

  it('should have property "web5Password" as a string', () => {
    expect(issuerConfig.web5Password).to.be.a('string');
  });

  it('should have property "web5RecoveryPhrase" as a string', () => {
    expect(issuerConfig.web5RecoveryPhrase).to.be.a('string');
  });

  it('should have property "handlers" as an array with length 0', () => {
    expect(issuerConfig.handlers).to.be.an('array').and.to.have.lengthOf(0);
  });

  it('should have property "providers" as an array with length 0', () => {
    expect(issuerConfig.providers).to.be.an('array').and.to.have.lengthOf(0);
  });

  it('should have property "manifests" as an array with length 1', () => {
    expect(issuerConfig.manifests).to.be.an('array').and.to.have.lengthOf(1);
  });

  it('should have property "issuers" as an array with length 2', () => {
    expect(issuerConfig.issuers).to.be.an('array').and.to.have.lengthOf(2);
  });

  it('should have property "gateways" as an array with length 1', () => {
    expect(issuerConfig.gateways).to.be.an('array').and.to.have.lengthOf(1);
  });

  it('should have property "dwns" as an array with length 1', () => {
    expect(issuerConfig.dwns).to.be.an('array').and.to.have.lengthOf(1);
  });
});
