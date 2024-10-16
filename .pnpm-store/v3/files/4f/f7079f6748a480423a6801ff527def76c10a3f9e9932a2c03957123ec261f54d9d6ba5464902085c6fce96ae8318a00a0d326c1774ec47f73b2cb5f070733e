var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import { ArrayUtility } from '../../src/utils/array.js';
import { DataStream } from '../../src/index.js';
import { Encryption } from '../../src/utils/encryption.js';
import { expect } from 'chai';
import { Readable } from 'readable-stream';
import { Secp256k1 } from '../../src/utils/secp256k1.js';
import { etc as Secp256k1Etc } from '@noble/secp256k1';
import { TestDataGenerator } from './test-data-generator.js';
describe('Encryption', () => {
    describe('AES-256-CTR', () => {
        it('should be able to encrypt and decrypt a data stream correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = TestDataGenerator.randomBytes(32);
            const initializationVector = TestDataGenerator.randomBytes(16);
            const inputBytes = TestDataGenerator.randomBytes(1000000);
            const inputStream = DataStream.fromBytes(inputBytes);
            const cipherStream = yield Encryption.aes256CtrEncrypt(key, initializationVector, inputStream);
            const plaintextStream = yield Encryption.aes256CtrDecrypt(key, initializationVector, cipherStream);
            const plaintextBytes = yield DataStream.toBytes(plaintextStream);
            expect(ArrayUtility.byteArraysEqual(inputBytes, plaintextBytes)).to.be.true;
        }));
        it('should emit error on encrypt if the plaintext data stream emits an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = TestDataGenerator.randomBytes(32);
            const initializationVector = TestDataGenerator.randomBytes(16);
            let errorOccurred = false;
            // a mock plaintext stream
            const randomByteGenerator = asyncRandomByteGenerator({ totalIterations: 10, bytesPerIteration: 1 });
            const mockPlaintextStream = new Readable({
                read() {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (errorOccurred) {
                            return;
                        }
                        // MUST use async generator/iterator, else caller will repeatedly call `read()` in a blocking manner until `null` is returned
                        const { value } = yield randomByteGenerator.next();
                        this.push(value);
                    });
                }
            });
            const cipherStream = yield Encryption.aes256CtrEncrypt(key, initializationVector, mockPlaintextStream);
            const simulatedErrorMessage = 'Simulated error';
            // test that the `error` event from plaintext stream will propagate to the cipher stream
            const eventPromise = new Promise((resolve, _reject) => {
                cipherStream.on('error', (error) => {
                    expect(error).to.equal(simulatedErrorMessage);
                    errorOccurred = true;
                    resolve();
                });
            });
            // trigger the `error` in the plaintext stream
            mockPlaintextStream.emit('error', simulatedErrorMessage);
            yield eventPromise;
            expect(errorOccurred).to.be.true;
        }));
        it('should emit error on decrypt if the plaintext data stream emits an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = TestDataGenerator.randomBytes(32);
            const initializationVector = TestDataGenerator.randomBytes(16);
            let errorOccurred = false;
            // a mock cipher stream
            const randomByteGenerator = asyncRandomByteGenerator({ totalIterations: 10, bytesPerIteration: 1 });
            const mockCipherStream = new Readable({
                read() {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (errorOccurred) {
                            return;
                        }
                        // MUST use async generator/iterator, else caller will repeatedly call `read()` in a blocking manner until `null` is returned
                        const { value } = yield randomByteGenerator.next();
                        this.push(value);
                    });
                }
            });
            const plaintextStream = yield Encryption.aes256CtrDecrypt(key, initializationVector, mockCipherStream);
            const simulatedErrorMessage = 'Simulated error';
            // test that the `error` event from cipher stream will propagate to the plaintext stream
            const eventPromise = new Promise((resolve, _reject) => {
                plaintextStream.on('error', (error) => {
                    expect(error).to.equal(simulatedErrorMessage);
                    errorOccurred = true;
                    resolve();
                });
            });
            // trigger the `error` in the cipher stream
            mockCipherStream.emit('error', simulatedErrorMessage);
            yield eventPromise;
            expect(errorOccurred).to.be.true;
        }));
    });
    describe('ECIES-SECP256K1', () => {
        it('should be able to encrypt and decrypt given bytes correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const { publicKey, privateKey } = yield Secp256k1.generateKeyPairRaw();
            const originalPlaintext = TestDataGenerator.randomBytes(32);
            const encryptionOutput = yield Encryption.eciesSecp256k1Encrypt(publicKey, originalPlaintext);
            const decryptionInput = Object.assign({ privateKey }, encryptionOutput);
            const decryptedPlaintext = yield Encryption.eciesSecp256k1Decrypt(decryptionInput);
            expect(ArrayUtility.byteArraysEqual(originalPlaintext, decryptedPlaintext)).to.be.true;
        }));
        it('should be able to accept both compressed and uncompressed publicKeys', () => __awaiter(void 0, void 0, void 0, function* () {
            const originalPlaintext = TestDataGenerator.randomBytes(32);
            const h2b = Secp256k1Etc.hexToBytes;
            // Following test vector was taken from @noble/secp256k1 test file.
            // noble-secp256k1/main/test/vectors/secp256k1/privates.json
            const privateKey = h2b('9c7fc36bc106fd7df5e1078d03e34b9a045892abdd053ec69bfeb22327529f6c');
            const compressed = h2b('03936cb2bd56e681d360bbce6a3a7a1ccbf72f3ab8792edbc45fb08f55b929c588');
            const uncompressed = h2b('04936cb2bd56e681d360bbce6a3a7a1ccbf72f3ab8792edbc45fb08f55b929c588529b8cee53f7eff1da5fc0e6050d952b37d4de5c3b85e952dfe9d9e9b2b3b6eb');
            for (const publicKey of [compressed, uncompressed]) {
                const encrypted = yield Encryption.eciesSecp256k1Encrypt(publicKey, originalPlaintext);
                const decrypted = yield Encryption.eciesSecp256k1Decrypt(Object.assign({ privateKey }, encrypted));
                expect(ArrayUtility.byteArraysEqual(originalPlaintext, decrypted)).to.be.true;
            }
        }));
    });
});
/**
 * Generates iterations of random bytes
 */
function asyncRandomByteGenerator(input) {
    return __asyncGenerator(this, arguments, function* asyncRandomByteGenerator_1() {
        let i = 0;
        while (i < input.totalIterations) {
            yield yield __await(TestDataGenerator.randomBytes(input.bytesPerIteration));
            i++;
        }
        yield yield __await(null);
    });
}
//# sourceMappingURL=encryption.spec.js.map