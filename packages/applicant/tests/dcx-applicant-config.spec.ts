import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expect } from 'chai';
import { applicantConfig } from '../src/dcx-applicant-config.js';

process.env.NODE_ENV = 'test';

describe('ApplicantConfig', () => {
  it('should have property "web5Password" as a string', () => {
    expect(applicantConfig.web5Password).to.be.a('string');
  });

  it('should have property "web5RecoveryPhrase" as a string', () => {
    expect(applicantConfig.web5RecoveryPhrase).to.be.a('string');
  });

  it('should have property "handlers" as an array with length 0', () => {
    expect(applicantConfig.handlers).to.be.an('array').and.to.have.lengthOf(0);
  });

  it('should have property "providers" as an array with length 0', () => {
    expect(applicantConfig.providers).to.be.an('array').and.to.have.lengthOf(0);
  });

  it('should have property "manifests" as an array with length 3', () => {
    expect(applicantConfig.manifests).to.be.an('array').and.to.have.lengthOf(3);
  });

  it('should have property "issuers" as an array with length 2', () => {
    expect(applicantConfig.issuers).to.be.an('array').and.to.have.lengthOf(2);
  });

  it('should have property "gateways" as an array with length 1', () => {
    expect(applicantConfig.gateways).to.be.an('array').and.to.have.lengthOf(1);
  });

  it('should have property "dwns" as an array with length 1', () => {
    expect(applicantConfig.dwns).to.be.an('array').and.to.have.lengthOf(1);
  });
});
