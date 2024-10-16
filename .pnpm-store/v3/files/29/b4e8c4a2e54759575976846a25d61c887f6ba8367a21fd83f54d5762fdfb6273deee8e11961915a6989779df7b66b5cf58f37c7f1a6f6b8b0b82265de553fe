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
import { Jws } from '../../src/index.js';
import { RecordsDelete } from '../../src/interfaces/records-delete.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { Time } from '../../src/utils/time.js';
chai.use(chaiAsPromised);
describe('RecordsDelete', () => {
    describe('create()', () => {
        it('should use `messageTimestamp` as is if given', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const recordsDelete = yield RecordsDelete.create({
                recordId: 'anything',
                signer: Jws.createSigner(alice),
                messageTimestamp: currentTime
            });
            expect(recordsDelete.message.descriptor.messageTimestamp).to.equal(currentTime);
        }));
        it('should auto-fill `messageTimestamp` if not given', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const recordsDelete = yield RecordsDelete.create({
                recordId: 'anything',
                signer: Jws.createSigner(alice)
            });
            expect(recordsDelete.message.descriptor.messageTimestamp).to.exist;
        }));
    });
});
//# sourceMappingURL=records-delete.spec.js.map