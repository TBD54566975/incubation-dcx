var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect } from 'chai';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { ed25519 } from '../../src/jose/algorithms/signing/ed25519.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
import { DwnInterfaceName, DwnMethodName, Jws, KeyDerivationScheme, PermissionsProtocol, Records, TestDataGenerator, Time } from '../../src/index.js';
describe('Records', () => {
    describe('deriveLeafPrivateKey()', () => {
        it('should throw if given private key is not supported', () => __awaiter(void 0, void 0, void 0, function* () {
            const derivedKey = {
                rootKeyId: 'unused',
                derivationScheme: KeyDerivationScheme.ProtocolPath,
                derivedPrivateKey: (yield ed25519.generateKeyPair()).privateJwk
            };
            yield expect(Records.derivePrivateKey(derivedKey, ['a'])).to.be.rejectedWith(DwnErrorCode.RecordsDerivePrivateKeyUnSupportedCurve);
        }));
    });
    describe('getAuthor()', () => {
        it('should return the author of RecordsWrite, RecordsDelete types', () => __awaiter(void 0, void 0, void 0, function* () {
            const bob = yield TestDataGenerator.generatePersona();
            // create a record message
            const { message: recordsWriteMessage } = yield TestDataGenerator.generateRecordsWrite({ author: bob });
            const recordsWriteAuthor = Records.getAuthor(recordsWriteMessage);
            expect(recordsWriteAuthor).to.equal(bob.did);
            // create a delete message
            const { message: recordsDeleteMessage } = yield TestDataGenerator.generateRecordsDelete({ author: bob });
            const recordsDeleteAuthor = Records.getAuthor(recordsDeleteMessage);
            expect(recordsDeleteAuthor).to.equal(bob.did);
        }));
        it('should get the author of a delegated message', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const deviceX = yield TestDataGenerator.generatePersona();
            // create a delegation scope from alice to deviceX for writing records in a protocol
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol: 'https://example.com/protocol/test',
            };
            // create the delegated grant message
            const bobGrant = yield PermissionsProtocol.createGrant({
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: deviceX.did,
                scope: scope,
                signer: Jws.createSigner(alice)
            });
            // create a record message using the grant
            const writeData = TestDataGenerator.randomBytes(32);
            const { message } = yield RecordsWrite.create({
                signer: Jws.createSigner(deviceX),
                delegatedGrant: bobGrant.dataEncodedMessage,
                protocol: 'https://example.com/protocol/test',
                protocolPath: 'test/path',
                dataFormat: 'application/json',
                data: writeData,
            });
            // expect message author to be alice
            const author = Records.getAuthor(message);
            expect(author).to.equal(alice.did);
        }));
    });
    describe('constructKeyDerivationPathUsingProtocolPathScheme()', () => {
        it('should throw if given a flat-space descriptor', () => __awaiter(void 0, void 0, void 0, function* () {
            const descriptor = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dataSize: 123,
                dateCreated: '2022-12-19T10:20:30.123456Z',
                messageTimestamp: '2022-12-19T10:20:30.123456Z',
            };
            expect(() => Records.constructKeyDerivationPathUsingProtocolPathScheme(descriptor))
                .to.throw(DwnErrorCode.RecordsProtocolPathDerivationSchemeMissingProtocol);
        }));
    });
    describe('constructKeyDerivationPathUsingProtocolContextScheme()', () => {
        it('should throw if not given contextId', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(() => Records.constructKeyDerivationPathUsingProtocolContextScheme(undefined))
                .to.throw(DwnErrorCode.RecordsProtocolContextDerivationSchemeMissingContextId);
        }));
    });
    describe('constructKeyDerivationPathUsingSchemasScheme()', () => {
        it('should throw if not given schema', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(() => Records.constructKeyDerivationPathUsingSchemasScheme(undefined))
                .to.throw(DwnErrorCode.RecordsSchemasDerivationSchemeMissingSchema);
        }));
    });
});
//# sourceMappingURL=records.spec.js.map