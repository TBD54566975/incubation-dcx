var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { expect } from 'chai';
import { ProtocolAuthorization } from '../../src/core/protocol-authorization.js';
import { stubInterface } from 'ts-sinon';
import { TestDataGenerator } from '../utils/test-data-generator.js';
describe('ProtocolAuthorization', () => {
    describe('authorizeWrite()', () => {
        it('should throw if message references non-existent parent', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const { recordsWrite } = yield TestDataGenerator.generateRecordsWrite({
                author: alice,
                parentContextId: 'nonExistentParent',
            });
            // stub the message store
            const messageStoreStub = stubInterface();
            messageStoreStub.query.resolves({ messages: [] }); // simulate parent not in message store
            yield expect(ProtocolAuthorization.authorizeWrite(alice.did, recordsWrite, messageStoreStub)).to.be.rejectedWith(DwnErrorCode.ProtocolAuthorizationParentNotFoundConstructingRecordChain);
        }));
    });
    describe('getActionsSeekingARuleMatch()', () => {
        it('should return empty array if unknown message method type is given', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const deliberatelyCraftedInvalidMessage = {
                message: {
                    descriptor: {
                        method: 'invalid-method'
                    },
                }
            };
            const messageStoreStub = stubInterface();
            expect(ProtocolAuthorization['getActionsSeekingARuleMatch'](alice.did, deliberatelyCraftedInvalidMessage, messageStoreStub)).to.be.empty;
        }));
    });
});
//# sourceMappingURL=protocol-authorization.spec.js.map