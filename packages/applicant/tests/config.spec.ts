import { Config } from '@dcx-protocol/common';
import { expect } from 'chai';

describe('Config', () => {
  it('should have the correct environment variables', () => {
    const NODE_ENV = Config['NODE_ENV'];
    const SERVICE_NAME = Config['SERVICE_NAME'];
    const SERVICE_ID = Config['SERVICE_ID'];
    const DEFAULT_ENDPOINTS = Config['DEFAULT_ENDPOINTS'];
    const DEFAULT_DWN_ENDPOINTS = Config['DEFAULT_DWN_ENDPOINTS'];
    const DEFAULT_GATEWAY_URIS = Config['DEFAULT_GATEWAY_URIS'];
    const DEFAULT_TRUSTED_ISSUERS = Config['DEFAULT_TRUSTED_ISSUERS'];
    const DEFAULT_TRUSTED_ISSUER_DIDS = Config['DEFAULT_TRUSTED_ISSUER_DIDS'];
    const WEB5_PASSWORD = Config['WEB5_PASSWORD'];
    const WEB5_RECOVERY_PHRASE = Config['WEB5_RECOVERY_PHRASE'];

    expect(NODE_ENV).to.not.be.null.and.not.be.undefined;
    expect(NODE_ENV).to.be.an('string');
    expect(NODE_ENV).to.be.match(/(development|test)/).that;

    expect(NODE_ENV).to.not.be.null.and.not.be.undefined;
    expect(SERVICE_NAME).to.be.an('string');

    expect(SERVICE_ID).to.not.be.null.and.not.be.undefined;
    expect(SERVICE_ID).to.be.an('string');

    expect(DEFAULT_ENDPOINTS).to.not.be.null.and.not.be.undefined;
    expect(DEFAULT_ENDPOINTS).to.be.an('object');

    expect(DEFAULT_DWN_ENDPOINTS).to.not.be.null.and.not.be.undefined;
    expect(DEFAULT_DWN_ENDPOINTS).to.be.an('array');

    expect(DEFAULT_GATEWAY_URIS).to.not.be.null.and.not.be.undefined;
    expect(DEFAULT_GATEWAY_URIS).to.be.an('array');

    expect(DEFAULT_TRUSTED_ISSUERS).to.not.be.null.and.not.be.undefined;
    expect(DEFAULT_TRUSTED_ISSUERS).to.be.an('array');

    expect(DEFAULT_TRUSTED_ISSUER_DIDS).to.not.be.null.and.not.be.undefined;
    expect(DEFAULT_TRUSTED_ISSUER_DIDS).to.be.an('array');

    expect(WEB5_PASSWORD).to.not.be.null.and.not.be.undefined;
    expect(WEB5_PASSWORD).to.be.an('string');

    expect(WEB5_RECOVERY_PHRASE).to.not.be.null.and.not.be.undefined;
    expect(WEB5_RECOVERY_PHRASE).to.be.an('string');
  });
});