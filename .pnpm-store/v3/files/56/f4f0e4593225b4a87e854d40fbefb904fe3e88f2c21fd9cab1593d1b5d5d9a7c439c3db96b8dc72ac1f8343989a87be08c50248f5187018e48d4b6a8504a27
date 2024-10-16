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
import { Jws } from '../../src/index.js';
import { ProtocolsQuery } from '../../src/interfaces/protocols-query.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { Time } from '../../src/utils/time.js';
chai.use(chaiAsPromised);
describe('ProtocolsQuery', () => {
    describe('create()', () => {
        it('should use `messageTimestamp` as is if given', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const protocolsQuery = yield ProtocolsQuery.create({
                filter: { protocol: 'anyValue' },
                messageTimestamp: currentTime,
                signer: Jws.createSigner(alice),
            });
            expect(protocolsQuery.message.descriptor.messageTimestamp).to.equal(currentTime);
        }));
        it('should auto-normalize protocol URI', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const options = {
                recipient: alice.did,
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                signer: Jws.createSigner(alice),
                filter: { protocol: 'example.com/' },
                definition: dexProtocolDefinition
            };
            const protocolsConfig = yield ProtocolsQuery.create(options);
            const message = protocolsConfig.message;
            expect(message.descriptor.filter.protocol).to.eq('http://example.com');
        }));
    });
});
//# sourceMappingURL=protocols-query.spec.js.map