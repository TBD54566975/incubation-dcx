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
import { ProtocolAction } from '../../src/types/protocols-types.js';
import { ProtocolsConfigure } from '../../src/interfaces/protocols-configure.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { Time } from '../../src/utils/time.js';
import { DwnErrorCode, DwnInterfaceName, DwnMethodName, Message } from '../../src/index.js';
chai.use(chaiAsPromised);
describe('ProtocolsConfigure', () => {
    describe('parse()', () => {
        it('should throw if protocol definitions has record nesting more than 10 level deep', () => __awaiter(void 0, void 0, void 0, function* () {
            const definition = {
                published: true,
                protocol: 'http://example.com',
                types: {
                    foo: {},
                },
                structure: {}
            };
            // create a record hierarchy with 11 levels of nesting
            let currentLevel = definition.structure;
            for (let i = 0; i < 11; i++) {
                currentLevel.foo = {};
                currentLevel = currentLevel.foo;
            }
            // we need to manually created an invalid protocol definition,
            // because the SDK `create()` method will not allow us to create an invalid definition
            const descriptor = {
                interface: DwnInterfaceName.Protocols,
                method: DwnMethodName.Configure,
                messageTimestamp: Time.getCurrentTimestamp(),
                definition
            };
            const alice = yield TestDataGenerator.generatePersona();
            const authorization = yield Message.createAuthorization({
                descriptor,
                signer: Jws.createSigner(alice)
            });
            const message = { descriptor, authorization };
            const parsePromise = ProtocolsConfigure.parse(message);
            yield expect(parsePromise).to.be.rejectedWith(DwnErrorCode.ProtocolsConfigureRecordNestingDepthExceeded);
        }));
    });
    describe('create()', () => {
        it('should use `messageTimestamp` as is if given', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const currentTime = Time.getCurrentTimestamp();
            const definition = Object.assign({}, dexProtocolDefinition);
            const protocolsConfigure = yield ProtocolsConfigure.create({
                messageTimestamp: currentTime,
                definition,
                signer: Jws.createSigner(alice),
            });
            expect(protocolsConfigure.message.descriptor.messageTimestamp).to.equal(currentTime);
        }));
        it('should auto-normalize protocol URI', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const definition = Object.assign(Object.assign({}, dexProtocolDefinition), { protocol: 'example.com/' });
            const options = {
                recipient: alice.did,
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                signer: Jws.createSigner(alice),
                definition,
            };
            const protocolsConfig = yield ProtocolsConfigure.create(options);
            const message = protocolsConfig.message;
            expect(message.descriptor.definition.protocol).to.eq('http://example.com');
        }));
        it('should auto-normalize schema URIs', () => __awaiter(void 0, void 0, void 0, function* () {
            const alice = yield TestDataGenerator.generatePersona();
            const nonNormalizedDexProtocol = Object.assign({}, dexProtocolDefinition);
            nonNormalizedDexProtocol.types.ask.schema = 'ask';
            const options = {
                recipient: alice.did,
                data: TestDataGenerator.randomBytes(10),
                dataFormat: 'application/json',
                signer: Jws.createSigner(alice),
                protocol: 'example.com/',
                definition: nonNormalizedDexProtocol
            };
            const protocolsConfig = yield ProtocolsConfigure.create(options);
            const message = protocolsConfig.message;
            expect(message.descriptor.definition.types.ask.schema).to.eq('http://ask');
        }));
        describe('protocol definition validations', () => {
            it('should not allow a record in protocol structure to reference a non-existent record type', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        record: {},
                    },
                    structure: {
                        undeclaredRecord: {} // non-existent record type
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const createPromise = ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                yield expect(createPromise).to.be.rejectedWith(DwnErrorCode.ProtocolsConfigureInvalidRuleSetRecordType);
            }));
            it('should allow `role` property in an `action` to have protocol path to a role record.', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        rootRole: {},
                        firstLevel: {},
                        secondLevel: {}
                    },
                    structure: {
                        rootRole: {
                            $role: true,
                            secondLevel: {
                                $actions: [{
                                        role: 'rootRole',
                                        can: [ProtocolAction.Create]
                                    }]
                            }
                        },
                        firstLevel: {
                            $actions: [{
                                    role: 'rootRole',
                                    can: [ProtocolAction.Create]
                                }]
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const protocolsConfigure = yield ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                expect(protocolsConfigure.message.descriptor.definition).not.to.be.undefined;
            }));
            it('should allow `role` property in an `action` that have protocol path to a role record.', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        thread: {},
                        participant: {},
                        chat: {}
                    },
                    structure: {
                        thread: {
                            participant: {
                                $role: true,
                            },
                            chat: {
                                $actions: [{
                                        role: 'thread/participant',
                                        can: [ProtocolAction.Create]
                                    }]
                            }
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const protocolsConfigure = yield ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                expect(protocolsConfigure.message.descriptor.definition).not.to.be.undefined;
            }));
            it('rejects protocol definitions with `role` actions that contain invalid roles', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        foo: {},
                        bar: {},
                    },
                    structure: {
                        foo: {
                        // $role: true // deliberated omitted
                        },
                        bar: {
                            $actions: [{
                                    role: 'foo',
                                    can: ['read']
                                }]
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const createProtocolsConfigurePromise = ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                yield expect(createProtocolsConfigurePromise)
                    .to.be.rejectedWith(DwnErrorCode.ProtocolsConfigureRoleDoesNotExistAtGivenPath);
            }));
            it('rejects protocol definitions with actions that contain `of` and  `who` is `anyone`', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        message: {},
                    },
                    structure: {
                        message: {
                            $actions: [{
                                    who: 'anyone',
                                    of: 'message',
                                    can: ['read']
                                }]
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const createProtocolsConfigurePromise = ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                yield expect(createProtocolsConfigurePromise)
                    .to.be.rejectedWith(DwnErrorCode.ProtocolsConfigureInvalidActionOfNotAllowed);
            }));
            it('rejects protocol definitions with actions that have direct-recipient-can rules with actions other than delete or update', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        message: {},
                    },
                    structure: {
                        message: {
                            $actions: [{
                                    who: 'recipient',
                                    can: ['read'] // not allowed, should be either delete or update
                                }]
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const createProtocolsConfigurePromise = ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                yield expect(createProtocolsConfigurePromise)
                    .to.be.rejectedWith(DwnErrorCode.ProtocolsConfigureInvalidRecipientOfAction);
            }));
            it('rejects protocol definitions with actions that don\'t contain `of` and  `who` is `author`', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        message: {},
                    },
                    structure: {
                        message: {
                            $actions: [{
                                    who: 'author',
                                    // of : 'message', // Intentionally missing
                                    can: ['read']
                                }]
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const createProtocolsConfigurePromise = ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                yield expect(createProtocolsConfigurePromise)
                    .to.be.rejectedWith(DwnErrorCode.ProtocolsConfigureInvalidActionMissingOf);
            }));
            it('rejects protocol definitions with `can query` in non-role rules', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        message: {},
                    },
                    structure: {
                        message: {
                            $actions: [{
                                    who: 'author',
                                    of: 'message',
                                    can: ['query']
                                }]
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const createProtocolsConfigurePromise = ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                yield expect(createProtocolsConfigurePromise)
                    .to.be.rejected;
            }));
            it('allows $size min and max to be set on a protocol path', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        message: {},
                    },
                    structure: {
                        message: {
                            $size: {
                                min: 1,
                                max: 1000
                            }
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const protocolsConfigure = yield ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                expect(protocolsConfigure.message.descriptor.definition).not.to.be.undefined;
            }));
            it('allows $size max to be set on a protocol path (min defaults to 0)', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        message: {},
                    },
                    structure: {
                        message: {
                            $size: {
                                max: 1000
                            }
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const protocolsConfigure = yield ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                expect(protocolsConfigure.message.descriptor.definition).not.to.be.undefined;
            }));
            it('rejects $size when max is less than min', () => __awaiter(void 0, void 0, void 0, function* () {
                const definition = {
                    published: true,
                    protocol: 'http://example.com',
                    types: {
                        message: {},
                    },
                    structure: {
                        message: {
                            $size: {
                                min: 1000,
                                max: 1
                            }
                        }
                    }
                };
                const alice = yield TestDataGenerator.generatePersona();
                const createProtocolsConfigurePromise = ProtocolsConfigure.create({
                    signer: Jws.createSigner(alice),
                    definition
                });
                yield expect(createProtocolsConfigurePromise).to.eventually.be.rejectedWith(DwnErrorCode.ProtocolsConfigureInvalidSize);
            }));
        });
    });
});
//# sourceMappingURL=protocols-configure.spec.js.map