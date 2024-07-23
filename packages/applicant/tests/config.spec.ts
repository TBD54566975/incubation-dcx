import { expect } from 'chai';
import { ApplicantConfig } from '../src/index.js';
// import { Config } from 'packages/common/src';

describe('ApplicantConfig', () => {
  it('should initialize with default parameters', async ()  =>{
    const applicantConfig = new ApplicantConfig();
    expect(applicantConfig).to.not.be.undefined;
    expect(applicantConfig).to.be.instanceof(ApplicantConfig);
    expect(applicantConfig).to.be.instanceof(ApplicantConfig.Config);
  });
});