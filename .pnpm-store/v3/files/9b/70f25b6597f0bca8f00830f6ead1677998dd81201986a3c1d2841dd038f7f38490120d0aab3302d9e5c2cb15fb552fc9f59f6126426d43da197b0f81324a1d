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
import Sinon from 'sinon';
import chai, { expect } from 'chai';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
import { RecordsWriteHandler } from '../../src/handlers/records-write.js';
import { stubInterface } from 'ts-sinon';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { Time } from '../../src/utils/time.js';
import { DwnInterfaceName, DwnMethodName, Encoder, Jws, KeyDerivationScheme, Message, PermissionsProtocol } from '../../src/index.js';
chai.use(chaiAsPromised);
describe('RecordsWrite', () => {
    describe('create()', () => {
        it('should be able to create and authorize a valid RecordsWrite message', () => __awaiter(void 0, void 0, void 0, function* () {
            // testing `create()` first
            const alice = yield TestDataGenerator.generatePersona();
            const options = {
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                dateCreated: '2022-10-14T10:20:30.405060Z',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
                signer: Jws.createSigner(alice)
            };
            const recordsWrite = yield RecordsWrite.create(options);
            const message = recordsWrite.message;
            expect(message.authorization).to.exist;
            expect(message.descriptor.dataFormat).to.equal(options.dataFormat);
            expect(message.descriptor.dateCreated).to.equal(options.dateCreated);
            expect(message.recordId).to.equal(options.recordId);
            const messageStoreStub = stubInterface();
            yield RecordsWriteHandler['authorizeRecordsWrite'](alice.did, recordsWrite, messageStoreStub);
        }));
        it('should be able to auto-fill `datePublished` when `published` set to `true` but `datePublished` not given', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const options = {
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
                published: true,
                signer: Jws.createSigner(alice)
            };
            const recordsWrite = yield RecordsWrite.create(options);
            const message = recordsWrite.message;
            expect(message.descriptor.datePublished).to.exist;
        }));
        it('should not allow `data` and `dataCid` to be both defined or undefined', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            // testing `data` and `dataCid` both defined
            const options1 = {
                recipient: alice.did,
                data: TestDataGenerator.randomBytes(10),
                dataCid: yield TestDataGenerator.randomCborSha256Cid(),
                dataFormat: 'application/json',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
                published: true,
                signer: Jws.createSigner(alice)
            };
            const createPromise1 = RecordsWrite.create(options1);
            yield expect(createPromise1).to.be.rejectedWith(DwnErrorCode.RecordsWriteCreateDataAndDataCidMutuallyExclusive);
            // testing `data` and `dataCid` both undefined
            const options2 = {
                recipient: alice.did,
                // intentionally showing both `data` and `dataCid` are undefined
                // data                        : TestDataGenerator.randomBytes(10),
                // dataCid                     : await TestDataGenerator.randomCborSha256Cid(),
                dataFormat: 'application/json',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
                published: true,
                signer: Jws.createSigner(alice)
            };
            const createPromise2 = RecordsWrite.create(options2);
            yield expect(createPromise2).to.be.rejectedWith(DwnErrorCode.RecordsWriteCreateDataAndDataCidMutuallyExclusive);
        }));
        it('should required `dataCid` and `dataSize` to be both defined or undefined at the same time', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const options1 = {
                recipient: alice.did,
                dataCid: yield TestDataGenerator.randomCborSha256Cid(),
                // dataSize                  : 123, // intentionally missing
                dataFormat: 'application/json',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
                published: true,
                signer: Jws.createSigner(alice)
            };
            const createPromise1 = RecordsWrite.create(options1);
            yield expect(createPromise1).to.be.rejectedWith('`dataCid` and `dataSize` must both be defined or undefined at the same time');
            const options2 = {
                recipient: alice.did,
                data: TestDataGenerator.randomBytes(10),
                // dataCid                   : await TestDataGenerator.randomCborSha256Cid(), // intentionally missing
                dataSize: 123,
                dataFormat: 'application/json',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
                published: true,
                signer: Jws.createSigner(alice)
            };
            const createPromise2 = RecordsWrite.create(options2);
            yield expect(createPromise2).to.be.rejectedWith('`dataCid` and `dataSize` must both be defined or undefined at the same time');
        }));
        it('should auto-normalize protocol URL', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const options = {
                recipient: alice.did,
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                signer: Jws.createSigner(alice),
                protocol: 'example.com/',
                protocolPath: 'example',
                schema: 'http://foo.bar/schema'
            };
            const recordsWrite = yield RecordsWrite.create(options);
            const message = recordsWrite.message;
            expect(message.descriptor.protocol).to.eq('http://example.com');
        }));
        it('should required `protocol` and `protocolPath` to be both defined or undefined at the same time', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const options1 = {
                recipient: alice.did,
                protocol: 'http://example.com',
                // protocolPath                : 'foo/bar', // intentionally missing
                dataCid: yield TestDataGenerator.randomCborSha256Cid(),
                dataSize: 123,
                dataFormat: 'application/json',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
                signer: Jws.createSigner(alice)
            };
            const createPromise1 = RecordsWrite.create(options1);
            yield expect(createPromise1).to.be.rejectedWith('`protocol` and `protocolPath` must both be defined or undefined at the same time');
            const options2 = {
                recipient: alice.did,
                // protocol                    : 'http://example.com', // intentionally missing
                protocolPath: 'foo/bar',
                data: TestDataGenerator.randomBytes(10),
                dataCid: yield TestDataGenerator.randomCborSha256Cid(),
                dataSize: 123,
                dataFormat: 'application/json',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
                signer: Jws.createSigner(alice)
            };
            const createPromise2 = RecordsWrite.create(options2);
            yield expect(createPromise2).to.be.rejectedWith('`protocol` and `protocolPath` must both be defined or undefined at the same time');
        }));
        it('should be able to create a RecordsWrite successfully using a custom signer', () => __awaiter(void 0, void 0, void 0, function* () {
            // create a custom signer
            const hardCodedSignature = Encoder.stringToBytes('some_hard_coded_signature');
            class CustomSigner {
                constructor() {
                    this.keyId = 'did:example:alice#key1';
                    this.algorithm = 'unused';
                }
                sign(_content) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return hardCodedSignature;
                    });
                }
            }
            const signer = new CustomSigner();
            const options = {
                schema: 'http://any-schema.com',
                protocol: 'http://example.com',
                protocolPath: 'foo/bar',
                dataCid: yield TestDataGenerator.randomCborSha256Cid(),
                dataSize: 123,
                dataFormat: 'application/json',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
                signer
            };
            const recordsWrite = yield RecordsWrite.create(options);
            expect(recordsWrite.message.authorization.signature.signatures[0].signature).to.equal(Encoder.bytesToBase64Url(hardCodedSignature));
        }));
        it('should throw if attempting to use `protocols` key derivation encryption scheme on non-protocol-based record', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const dataEncryptionInitializationVector = TestDataGenerator.randomBytes(16);
            const dataEncryptionKey = TestDataGenerator.randomBytes(32);
            const encryptionInput = {
                initializationVector: dataEncryptionInitializationVector,
                key: dataEncryptionKey,
                keyEncryptionInputs: [{
                        publicKeyId: alice.keyId,
                        publicKey: alice.keyPair.publicJwk,
                        derivationScheme: KeyDerivationScheme.ProtocolPath
                    }]
            };
            // intentionally generating a record that is not protocol-based
            const createPromise = RecordsWrite.create({
                signer: Jws.createSigner(alice),
                dataFormat: 'application/json',
                data: TestDataGenerator.randomBytes(10),
                encryptionInput
            });
            yield expect(createPromise).to.be.rejectedWith(DwnErrorCode.RecordsWriteMissingProtocol);
        }));
        it('should throw if attempting to use `schemas` key derivation encryption scheme on a record without `schema`', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const dataEncryptionInitializationVector = TestDataGenerator.randomBytes(16);
            const dataEncryptionKey = TestDataGenerator.randomBytes(32);
            const encryptionInput = {
                initializationVector: dataEncryptionInitializationVector,
                key: dataEncryptionKey,
                keyEncryptionInputs: [{
                        publicKeyId: alice.keyId,
                        publicKey: alice.keyPair.publicJwk,
                        derivationScheme: KeyDerivationScheme.Schemas
                    }]
            };
            // intentionally generating a record that is without `schema`
            const createPromise = RecordsWrite.create({
                signer: Jws.createSigner(alice),
                dataFormat: 'application/octet-stream',
                data: TestDataGenerator.randomBytes(10),
                encryptionInput
            });
            yield expect(createPromise).to.be.rejectedWith(DwnErrorCode.RecordsWriteMissingSchema);
        }));
        it('should throw if delegated grant is given but signer is not given', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const bob = yield TestDataGenerator.generatePersona();
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol: 'chat'
            };
            const grantToBob = yield PermissionsProtocol.createGrant({
                signer: Jws.createSigner(alice),
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                description: 'Allow Bob to write as me in chat protocol',
                grantedTo: bob.did,
                scope
            });
            const createPromise = RecordsWrite.create({
                delegatedGrant: grantToBob.dataEncodedMessage,
                dataFormat: 'application/octet-stream',
                data: TestDataGenerator.randomBytes(10),
            });
            yield expect(createPromise).to.be.rejectedWith(DwnErrorCode.RecordsWriteCreateMissingSigner);
        }));
    });
    describe('createFrom()', () => {
        it('should create a RecordsWrite with `published` set to `true` with just `publishedDate` given', () => __awaiter(void 0, void 0, void 0, function* () {
            const { author, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({
                published: false
            });
            const write = yield RecordsWrite.createFrom({
                recordsWriteMessage: recordsWrite.message,
                datePublished: Time.getCurrentTimestamp(),
                signer: Jws.createSigner(author)
            });
            expect(write.message.descriptor.published).to.be.true;
        }));
        it('replace tags with updated tags, if tags do not exist in createFrom remove them', () => __awaiter(void 0, void 0, void 0, function* () {
            // create a record with tags
            const { author, message, recordsWrite } = yield TestDataGenerator.generateRecordsWrite({
                tags: {
                    tag1: ['value1', 'value2']
                }
            });
            expect(message.descriptor.tags).to.exist;
            expect(message.descriptor.tags.tag1).to.exist;
            expect(message.descriptor.tags.tag1).to.have.members(['value1', 'value2']);
            // update the record's tags
            const write = yield RecordsWrite.createFrom({
                recordsWriteMessage: recordsWrite.message,
                signer: Jws.createSigner(author),
                tags: {
                    tag2: ['value1', 'value2', 'value3']
                }
            });
            expect(write.message.descriptor.tags).to.exist;
            expect(write.message.descriptor.tags.tag1).to.not.exist;
            expect(write.message.descriptor.tags.tag2).to.exist;
            expect(write.message.descriptor.tags.tag2).to.have.members(['value1', 'value2', 'value3']);
            // update without tags
            const write2 = yield RecordsWrite.createFrom({
                recordsWriteMessage: write.message,
                signer: Jws.createSigner(author),
            });
            expect(write2.message.descriptor.tags).to.not.exist;
        }));
    });
    describe('parse()', () => {
        xit('should invoke JSON schema validation when parsing a RecordsWrite', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const recordsWrite = yield RecordsWrite.create({
                signer: Jws.createSigner(alice),
                dataFormat: 'application/octet-stream',
                data: TestDataGenerator.randomBytes(10),
            });
            const validateJsonSchemaSpy = Sinon.spy(Message, 'validateJsonSchema');
            yield RecordsWrite.parse(recordsWrite.message);
            expect(validateJsonSchemaSpy.called).to.be.true;
        }));
    });
    describe('isSignedByAuthorDelegate()', () => {
        it('should return false if the given RecordsWrite is not signed at all', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = new TextEncoder().encode('any data');
            const recordsWrite = yield RecordsWrite.create({
                protocol: 'unused',
                protocolPath: 'unused',
                schema: 'unused',
                dataFormat: 'unused',
                data
            });
            const isSignedByAuthorDelegate = recordsWrite.isSignedByAuthorDelegate;
            expect(isSignedByAuthorDelegate).to.be.false;
        }));
    });
    describe('isSignedByOwnerDelegate()', () => {
        it('should return false if the given RecordsWrite is not signed at all', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = new TextEncoder().encode('any data');
            const recordsWrite = yield RecordsWrite.create({
                protocol: 'unused',
                protocolPath: 'unused',
                schema: 'unused',
                dataFormat: 'unused',
                data
            });
            const isSignedByOwnerDelegate = recordsWrite.isSignedByOwnerDelegate;
            expect(isSignedByOwnerDelegate).to.be.false;
        }));
    });
    describe('isInitialWrite()', () => {
        it('should return false if given message is not a RecordsWrite', () => __awaiter(void 0, void 0, void 0, function* () {
            const { message } = yield TestDataGenerator.generateRecordsQuery();
            const isInitialWrite = yield RecordsWrite.isInitialWrite(message);
            expect(isInitialWrite).to.be.false;
        }));
    });
    describe('getEntryId()', () => {
        it('should throw if the given author is undefined', () => __awaiter(void 0, void 0, void 0, function* () {
            const { message } = yield TestDataGenerator.generateRecordsWrite();
            const author = undefined;
            expect(RecordsWrite.getEntryId(author, message.descriptor)).to.be.rejectedWith(DwnErrorCode.RecordsWriteGetEntryIdUndefinedAuthor);
        }));
    });
    describe('signAsOwner()', () => {
        it('should throw if the RecordsWrite is not signed by an author yet', () => __awaiter(void 0, void 0, void 0, function* () {
            const options = {
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                dateCreated: '2023-07-27T10:20:30.405060Z',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
            };
            const recordsWrite = yield RecordsWrite.create(options);
            expect(recordsWrite.author).to.not.exist;
            expect(recordsWrite.signaturePayload).to.not.exist;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            yield expect(recordsWrite.signAsOwner(Jws.createSigner(alice))).to.be.rejectedWith(DwnErrorCode.RecordsWriteSignAsOwnerUnknownAuthor);
            expect(recordsWrite.owner).to.be.undefined;
            expect(recordsWrite.ownerSignaturePayload).to.be.undefined;
        }));
    });
    describe('signAsOwnerDelegate()', () => {
        it('should throw if the RecordsWrite is not signed by an author yet', () => __awaiter(void 0, void 0, void 0, function* () {
            const options = {
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                dateCreated: '2023-07-27T10:20:30.405060Z',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
            };
            const recordsWrite = yield RecordsWrite.create(options);
            expect(recordsWrite.author).to.not.exist;
            expect(recordsWrite.signaturePayload).to.not.exist;
            // create a delegated grant
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const scope = {
                interface: DwnInterfaceName.Records,
                method: DwnMethodName.Write,
                protocol: 'chat'
            };
            const ownerDelegatedGrant = yield PermissionsProtocol.createGrant({
                signer: Jws.createSigner(alice),
                delegated: true,
                dateExpires: Time.createOffsetTimestamp({ seconds: 100 }),
                grantedTo: bob.did,
                scope
            });
            yield expect(recordsWrite.signAsOwnerDelegate(Jws.createSigner(bob), ownerDelegatedGrant.dataEncodedMessage))
                .to.be.rejectedWith(DwnErrorCode.RecordsWriteSignAsOwnerDelegateUnknownAuthor);
            expect(recordsWrite.owner).to.be.undefined;
            expect(recordsWrite.ownerSignaturePayload).to.be.undefined;
        }));
    });
    describe('ownerSignatureSigner()', () => {
        it('should return `undefined` if owner signature is not present in the message', () => __awaiter(void 0, void 0, void 0, function* () {
            const options = {
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                dateCreated: '2023-07-27T10:20:30.405060Z',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
            };
            const recordsWrite = yield RecordsWrite.create(options);
            expect(recordsWrite.ownerSignatureSigner).to.be.undefined;
        }));
    });
    describe('message', () => {
        it('should throw if attempting to access the message of a RecordsWrite that is not given authorization signature input', () => __awaiter(void 0, void 0, void 0, function* () {
            const options = {
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                dateCreated: '2023-07-27T10:20:30.405060Z',
                recordId: yield TestDataGenerator.randomCborSha256Cid(),
            };
            const recordsWrite = yield RecordsWrite.create(options);
            expect(recordsWrite.author).to.not.exist;
            expect(recordsWrite.signaturePayload).to.not.exist;
            expect(() => recordsWrite.message).to.throw(DwnErrorCode.RecordsWriteMissingSigner);
        }));
    });
});
//# sourceMappingURL=records-write.spec.js.map