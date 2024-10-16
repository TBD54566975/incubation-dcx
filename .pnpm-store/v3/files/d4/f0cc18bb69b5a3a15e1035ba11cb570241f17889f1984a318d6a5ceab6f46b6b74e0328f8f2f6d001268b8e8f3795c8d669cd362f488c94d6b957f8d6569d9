var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';
import { GeneralJwsBuilder } from '../../../src/jose/jws/general/builder.js';
import { GeneralJwsVerifier } from '../../../src/jose/jws/general/verifier.js';
import { Jws } from '../../../src/utils/jws.js';
import { PrivateKeySigner } from '../../../src/index.js';
import { signatureAlgorithms } from '../../../src/jose/algorithms/signing/signature-algorithms.js';
import sinon from 'sinon';
import { UniversalResolver } from '@web5/dids';
const { Ed25519, secp256k1 } = signatureAlgorithms;
const secp256r1 = signatureAlgorithms['P-256'];
chai.use(chaiAsPromised);
describe('General JWS Sign/Verify', () => {
    afterEach(() => {
        // restores all fakes, stubs, spies etc. not restoring causes a memory leak.
        // more info here: https://sinonjs.org/releases/v13/general-setup/
        sinon.restore();
    });
    it('should sign and verify secp256k1 signature using a key vector correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const { privateJwk, publicJwk } = yield secp256k1.generateKeyPair();
        const payloadBytes = new TextEncoder().encode('anyPayloadValue');
        const keyId = 'did:jank:alice#key1';
        const jwsBuilder = yield GeneralJwsBuilder.create(payloadBytes, [new PrivateKeySigner({ privateJwk, keyId })]);
        const jws = jwsBuilder.getJws();
        const mockResolutionResult = {
            didResolutionMetadata: {},
            didDocument: {
                verificationMethod: [{
                        id: keyId,
                        type: 'JsonWebKey2020',
                        controller: 'did:jank:alice',
                        publicKeyJwk: publicJwk
                    }]
            },
            didDocumentMetadata: {}
        };
        const resolverStub = sinon.createStubInstance(UniversalResolver, {
            // @ts-ignore
            resolve: sinon.stub().withArgs('did:jank:alice').resolves(mockResolutionResult),
        });
        const verificationResult = yield GeneralJwsVerifier.verifySignatures(jws, resolverStub);
        expect(verificationResult.signers.length).to.equal(1);
        expect(verificationResult.signers).to.include('did:jank:alice');
    }));
    it('should sign and verify secp256r1 signature using a key vector correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const { privateJwk, publicJwk } = yield secp256r1.generateKeyPair();
        const payloadBytes = new TextEncoder().encode('anyPayloadValue');
        const keyId = 'did:jank:alice#key1';
        const jwsBuilder = yield GeneralJwsBuilder.create(payloadBytes, [
            new PrivateKeySigner({ privateJwk, keyId }),
        ]);
        const jws = jwsBuilder.getJws();
        const mockResolutionResult = {
            didResolutionMetadata: {},
            didDocument: {
                verificationMethod: [
                    {
                        id: keyId,
                        type: 'JsonWebKey2020',
                        controller: 'did:jank:alice',
                        publicKeyJwk: publicJwk,
                    },
                ],
            },
            didDocumentMetadata: {},
        };
        const resolverStub = sinon.createStubInstance(UniversalResolver, {
            // @ts-ignore
            resolve: sinon
                .stub()
                .withArgs('did:jank:alice')
                .resolves(mockResolutionResult),
        });
        const verificationResult = yield GeneralJwsVerifier.verifySignatures(jws, resolverStub);
        expect(verificationResult.signers.length).to.equal(1);
        expect(verificationResult.signers).to.include('did:jank:alice');
    }));
    it('should sign and verify ed25519 signature using a key vector correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const { privateJwk, publicJwk } = yield Ed25519.generateKeyPair();
        const payloadBytes = new TextEncoder().encode('anyPayloadValue');
        const keyId = 'did:jank:alice#key1';
        const jwsBuilder = yield GeneralJwsBuilder.create(payloadBytes, [new PrivateKeySigner({ privateJwk, keyId })]);
        const jws = jwsBuilder.getJws();
        const mockResolutionResult = {
            didResolutionMetadata: {},
            didDocument: {
                verificationMethod: [{
                        id: 'did:jank:alice#key1',
                        type: 'JsonWebKey2020',
                        controller: 'did:jank:alice',
                        publicKeyJwk: publicJwk
                    }]
            },
            didDocumentMetadata: {}
        };
        const resolverStub = sinon.createStubInstance(UniversalResolver, {
            // @ts-ignore
            resolve: sinon.stub().withArgs('did:jank:alice').resolves(mockResolutionResult)
        });
        const verificationResult = yield GeneralJwsVerifier.verifySignatures(jws, resolverStub);
        expect(verificationResult.signers.length).to.equal(1);
        expect(verificationResult.signers).to.include('did:jank:alice');
    }));
    it('should support multiple signatures using different key types', () => __awaiter(void 0, void 0, void 0, function* () {
        const secp256k1Keys = yield secp256k1.generateKeyPair();
        const ed25519Keys = yield Ed25519.generateKeyPair();
        const alice = {
            did: 'did:jank:alice',
            privateJwk: secp256k1Keys.privateJwk,
            jwkPublic: secp256k1Keys.publicJwk,
            keyId: 'did:jank:alice#key1',
            mockResolutionResult: {
                didResolutionMetadata: {},
                didDocument: {
                    verificationMethod: [{
                            id: 'did:jank:alice#key1',
                            type: 'JsonWebKey2020',
                            controller: 'did:jank:alice',
                            publicKeyJwk: secp256k1Keys.publicJwk
                        }]
                },
                didDocumentMetadata: {}
            }
        };
        const bob = {
            did: 'did:jank:bob',
            privateJwk: ed25519Keys.privateJwk,
            jwkPublic: ed25519Keys.publicJwk,
            keyId: 'did:jank:bob#key1',
            mockResolutionResult: {
                didResolutionMetadata: {},
                didDocument: {
                    verificationMethod: [{
                            id: 'did:jank:bob#key1',
                            type: 'JsonWebKey2020',
                            controller: 'did:jank:bob',
                            publicKeyJwk: ed25519Keys.publicJwk,
                        }]
                },
                didDocumentMetadata: {}
            }
        };
        const signers = [
            new PrivateKeySigner({ privateJwk: alice.privateJwk, keyId: alice.keyId }),
            new PrivateKeySigner({ privateJwk: bob.privateJwk, keyId: bob.keyId })
        ];
        const payloadBytes = new TextEncoder().encode('anyPayloadValue');
        const jwsBuilder = yield GeneralJwsBuilder.create(payloadBytes, signers);
        const jws = jwsBuilder.getJws();
        const resolveStub = sinon.stub();
        resolveStub.withArgs('did:jank:alice').resolves(alice.mockResolutionResult);
        resolveStub.withArgs('did:jank:bob').resolves(bob.mockResolutionResult);
        const resolverStub = sinon.createStubInstance(UniversalResolver, {
            // @ts-ignore
            resolve: resolveStub
        });
        const verificationResult = yield GeneralJwsVerifier.verifySignatures(jws, resolverStub);
        expect(verificationResult.signers.length).to.equal(2);
        expect(verificationResult.signers).to.include(alice.did);
        expect(verificationResult.signers).to.include(bob.did);
    }));
    it('should not verify the same signature more than once', () => __awaiter(void 0, void 0, void 0, function* () {
        // scenario: include two signatures in the JWS,
        // repeated calls to verifySignature should only verify each of the signature once,
        // resulting total of 2 calls to `Jws.verifySignature()` and 2 calls to cache the results.
        const { privateJwk: privateJwkEd25519, publicJwk: publicJwkEd25519 } = yield Ed25519.generateKeyPair();
        const { privateJwk: privateJwkSecp256k1, publicJwk: publicJwkSecp256k1 } = yield secp256k1.generateKeyPair();
        const payloadBytes = new TextEncoder().encode('anyPayloadValue');
        const keyId1 = 'did:jank:alice#key1';
        const keyId2 = 'did:jank:alice#key2';
        const jwsBuilder = yield GeneralJwsBuilder.create(payloadBytes, [
            new PrivateKeySigner({ privateJwk: privateJwkEd25519, keyId: keyId1 }),
            new PrivateKeySigner({ privateJwk: privateJwkSecp256k1, keyId: keyId2 })
        ]);
        const jws = jwsBuilder.getJws();
        const mockResolutionResult = {
            didResolutionMetadata: {},
            didDocument: {
                verificationMethod: [{
                        id: 'did:jank:alice#key1',
                        type: 'JsonWebKey2020',
                        controller: 'did:jank:alice',
                        publicKeyJwk: publicJwkEd25519
                    }, {
                        id: 'did:jank:alice#key2',
                        type: 'JsonWebKey2020',
                        controller: 'did:jank:alice',
                        publicKeyJwk: publicJwkSecp256k1
                    }]
            },
            didDocumentMetadata: {}
        };
        const resolverStub = sinon.createStubInstance(UniversalResolver, {
            // @ts-ignore
            resolve: sinon.stub().withArgs('did:jank:alice').resolves(mockResolutionResult)
        });
        const verifySignatureSpy = sinon.spy(Jws, 'verifySignature');
        const cacheSetSpy = sinon.spy(GeneralJwsVerifier.singleton.cache, 'set');
        // intentionally calling verifySignatures() multiple times on the same JWS
        yield GeneralJwsVerifier.verifySignatures(jws, resolverStub);
        yield GeneralJwsVerifier.verifySignatures(jws, resolverStub);
        yield GeneralJwsVerifier.verifySignatures(jws, resolverStub);
        sinon.assert.calledTwice(verifySignatureSpy);
        sinon.assert.calledTwice(cacheSetSpy);
    }));
});
//# sourceMappingURL=general.spec.js.map