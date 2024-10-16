var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ProtocolAction } from '../../../../src/types/protocols-types.js';
import { expect } from 'chai';
import { Message } from '../../../../src/core/message.js';
import { TestDataGenerator } from '../../../utils/test-data-generator.js';
import { validateJsonSchema } from '../../../../src/schema-validator.js';
import { DwnInterfaceName, DwnMethodName } from '../../../../src/index.js';
describe('ProtocolsConfigure schema definition', () => {
    it('should throw if unknown actor is encountered in action rule', () => __awaiter(void 0, void 0, void 0, function* () {
        const protocolDefinition = {
            protocol: 'email',
            published: true,
            types: {
                email: {
                    schema: 'email',
                    dataFormats: ['text/plain']
                }
            },
            structure: {
                email: {
                    $actions: [
                        {
                            who: 'unknown',
                            can: [ProtocolAction.Create]
                        }
                    ]
                }
            }
        };
        const message = {
            descriptor: {
                interface: DwnInterfaceName.Protocols,
                method: DwnMethodName.Configure,
                messageTimestamp: '2022-10-14T10:20:30.405060Z',
                definition: protocolDefinition
            },
            authorization: TestDataGenerator.generateAuthorization()
        };
        expect(() => {
            Message.validateJsonSchema(message);
        }).throws('/$actions/0');
    }));
    describe('rule-set tests', () => {
        it('#183 - should throw if required `can` is missing in rule-set', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidRuleSet1 = {
                $actions: [{
                        who: 'author',
                        of: 'thread',
                        // can: ['read']  // intentionally missing
                    }]
            };
            const invalidRuleSet2 = {
                $actions: [{
                        who: 'recipient',
                        of: 'thread',
                        // can: ['read']  // intentionally missing
                    }]
            };
            for (const ruleSet of [invalidRuleSet1, invalidRuleSet2]) {
                expect(() => {
                    validateJsonSchema('ProtocolRuleSet', ruleSet);
                }).throws('/$actions/0');
            }
        }));
    });
});
//# sourceMappingURL=protocols-configure.spec.js.map