import sinon from 'sinon';
import { TestDataGenerator } from './test-data-generator.js';
import { UniversalResolver } from '@web5/dids';
/**
 * Utility class for generating stub for testing.
 */
export class TestStubGenerator {
    /**
     * Creates a {DidResolver} stub for testing.
     */
    static createDidResolverStub(persona) {
        // setting up a stub did resolver & message store
        const didResolutionResult = TestDataGenerator.createDidResolutionResult(persona);
        const resolveStub = sinon.stub();
        resolveStub.withArgs(persona.did).resolves(didResolutionResult);
        const didResolverStub = sinon.createStubInstance(UniversalResolver, { resolve: resolveStub });
        return didResolverStub;
    }
    /**
     * Stubs resolution results for the given personas.
     */
    static stubDidResolver(didResolver, personas) {
        const didToResolutionMap = new Map();
        for (const persona of personas) {
            const mockResolution = TestDataGenerator.createDidResolutionResult(persona);
            didToResolutionMap.set(persona.did, mockResolution);
        }
        sinon.stub(didResolver, 'resolve').callsFake((did) => {
            const mockResolution = didToResolutionMap.get(did);
            return new Promise((resolve, _reject) => {
                if (mockResolution === undefined) {
                    throw new Error('unexpected DID');
                }
                resolve(mockResolution);
            });
        });
    }
}
//# sourceMappingURL=test-stub-generator.js.map