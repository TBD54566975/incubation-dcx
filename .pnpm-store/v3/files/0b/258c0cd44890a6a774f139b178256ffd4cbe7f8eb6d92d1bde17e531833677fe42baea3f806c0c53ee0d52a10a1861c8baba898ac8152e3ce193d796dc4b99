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
import dexProtocolDefinition from '../vectors/protocol-definitions/dex.json' assert { type: 'json' };
import { Jws } from '../../src/utils/jws.js';
import { RecordsSubscribe } from '../../src/interfaces/records-subscribe.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { Time } from '../../src/utils/time.js';
chai.use(chaiAsPromised);
describe('RecordsSubscribe', () => {
    describe('create()', () => {
        it('should not allow published to be set to false with a datePublished filter also set', () => __awaiter(void 0, void 0, void 0, function* () {
            // test control
            const randomDate = TestDataGenerator.randomTimestamp();
            const recordQueryControl = TestDataGenerator.generateRecordsQuery({
                filter: { datePublished: { from: randomDate, }, published: true }
            });
            yield expect(recordQueryControl).to.eventually.not.be.rejected;
            const recordQueryRejected = TestDataGenerator.generateRecordsQuery({
                filter: { datePublished: { from: randomDate }, published: false }
            });
            yield expect(recordQueryRejected).to.eventually.be.rejectedWith('descriptor/filter/published: must be equal to one of the allowed values');
        }));
        it('should use `messageTimestamp` as is if given', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const recordsQuery = yield RecordsSubscribe.create({
                filter: { schema: 'anything' },
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
            });
            expect(recordsQuery.message.descriptor.messageTimestamp).to.equal(currentTime);
        }));
        it('should auto-normalize protocol URL', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const options = {
                recipient: alice.did,
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                signer: Jws.createSigner(alice),
                filter: { protocol: 'example.com/' },
                definition: dexProtocolDefinition
            };
            const recordsQuery = yield RecordsSubscribe.create(options);
            const message = recordsQuery.message;
            expect(message.descriptor.filter.protocol).to.eq('http://example.com');
        }));
        it('should auto-normalize schema URL', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const options = {
                recipient: alice.did,
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                signer: Jws.createSigner(alice),
                filter: { schema: 'example.com/' },
                definition: dexProtocolDefinition
            };
            const recordsQuery = yield RecordsSubscribe.create(options);
            const message = recordsQuery.message;
            expect(message.descriptor.filter.schema).to.eq('http://example.com');
        }));
    });
});
//# sourceMappingURL=records-subscribe.spec.js.map