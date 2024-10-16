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
import sinon from 'sinon';
import chai, { expect } from 'chai';
import { DidKey } from '@web5/dids';
import { Dwn } from '../../src/dwn.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { Jws } from '../../src/utils/jws.js';
import { Records } from '../../src/utils/records.js';
import { RecordsRead } from '../../src/interfaces/records-read.js';
import { RecordsWrite } from '../../src/interfaces/records-write.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { UniversalResolver } from '@web5/dids';
import { DwnInterfaceName, DwnMethodName, Message, Time } from '../../src/index.js';
chai.use(chaiAsPromised);
export function testRecordsTags() {
    describe('Records Tags', () => {
        let didResolver;
        let messageStore;
        let dataStore;
        let resumableTaskStore;
        let eventLog;
        let eventStream;
        let dwn;
        // important to follow the `before` and `after` pattern to initialize and clean the stores in tests
        // so that different test suites can reuse the same backend store for testing
        before(() => __awaiter(this, void 0, void 0, function* () {
            didResolver = new UniversalResolver({ didResolvers: [DidKey] });
            const stores = TestStores.get();
            messageStore = stores.messageStore;
            dataStore = stores.dataStore;
            resumableTaskStore = stores.resumableTaskStore;
            eventLog = stores.eventLog;
            eventStream = TestEventStream.get();
            dwn = yield Dwn.create({ didResolver, messageStore, dataStore, eventLog, eventStream, resumableTaskStore });
        }));
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            sinon.restore(); // wipe all previous stubs/spies/mocks/fakes
            // clean up before each test rather than after so that a test does not depend on other tests to do the clean up
            yield messageStore.clear();
            yield dataStore.clear();
            yield resumableTaskStore.clear();
            yield eventLog.clear();
        }));
        after(() => __awaiter(this, void 0, void 0, function* () {
            yield dwn.close();
        }));
        describe('RecordsWrite with tags', () => {
            describe('protocol rules', () => {
                describe('ProtocolsConfigure', () => {
                    it('should support protocol tag types of string, number, integer, boolean and array types of numbers, integers and strings', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // configure a protocol with tags of string, number, boolean and array types of numbers and strings
                        const protocolDefinition = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        stringTag: {
                                            type: 'string',
                                        },
                                        numberType: {
                                            type: 'number',
                                        },
                                        integerType: {
                                            type: 'integer',
                                        },
                                        booleanType: {
                                            type: 'boolean',
                                        },
                                        stringArray: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                            }
                                        },
                                        numberArray: {
                                            type: 'array',
                                            items: {
                                                type: 'number',
                                            }
                                        },
                                        integerArray: {
                                            type: 'array',
                                            items: {
                                                type: 'integer',
                                            }
                                        },
                                    }
                                }
                            },
                        };
                        const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                        expect(configureReply.status.code).to.equal(202);
                    }));
                    it('should reject tags that have invalid schema definitions during create', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol definition with an invalid schema
                        const invalidSchemaProtocol = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        invalidTag: {
                                            type: 'array',
                                            items: {
                                                type: 'number'
                                            },
                                            contains: {
                                                type: 'number',
                                                minimum: 'ten', // should be a number
                                            }
                                        },
                                    }
                                }
                            },
                        };
                        const protocolConfigure = TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition: invalidSchemaProtocol,
                        });
                        yield expect(protocolConfigure).to.eventually.be.rejectedWith(DwnErrorCode.ProtocolsConfigureInvalidTagSchema);
                    }));
                    it('should reject tags that have invalid schema definitions during process', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol definition with an invalid schema
                        const invalidSchemaProtocol = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        invalidTag: {
                                            type: 'array',
                                            items: {
                                                type: 'number'
                                            },
                                            contains: {
                                                type: 'number',
                                                minimum: 'ten', // should be a number
                                            }
                                        },
                                    }
                                }
                            },
                        };
                        // manually craft the invalid ProtocolsConfigure message because our library will not let you create an invalid definition
                        const descriptor = {
                            interface: DwnInterfaceName.Protocols,
                            method: DwnMethodName.Configure,
                            messageTimestamp: Time.getCurrentTimestamp(),
                            definition: invalidSchemaProtocol
                        };
                        const authorization = yield Message.createAuthorization({
                            descriptor,
                            signer: Jws.createSigner(alice)
                        });
                        const protocolsConfigureMessage = { descriptor, authorization };
                        const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfigureMessage);
                        expect(protocolsConfigureReply.status.code).to.equal(400);
                        expect(protocolsConfigureReply.status.detail).to.contain(DwnErrorCode.ProtocolsConfigureInvalidTagSchema);
                        expect(protocolsConfigureReply.status.detail).to.contain(`foo/$tags/invalidTag/contains/minimum must be number`);
                    }));
                    describe('should reject invalid tag types', () => {
                        it('object', () => __awaiter(this, void 0, void 0, function* () {
                            const alice = yield TestDataGenerator.generateDidKeyPersona();
                            // protocol definition with unsupported tag type of object
                            const objectTagsType = {
                                protocol: 'http://example.com/protocol/withTags',
                                published: true,
                                types: {
                                    foo: {}
                                },
                                structure: {
                                    foo: {
                                        $tags: {
                                            objectTag: {
                                                type: 'object',
                                            },
                                        }
                                    }
                                },
                            };
                            // manually craft the invalid ProtocolsConfigure message because our library will not let you create an invalid definition
                            const descriptor = {
                                interface: DwnInterfaceName.Protocols,
                                method: DwnMethodName.Configure,
                                messageTimestamp: Time.getCurrentTimestamp(),
                                definition: objectTagsType
                            };
                            const authorization = yield Message.createAuthorization({
                                descriptor,
                                signer: Jws.createSigner(alice)
                            });
                            const protocolsConfigureMessage = { descriptor, authorization };
                            const objectTagsTypeConfigureReply = yield dwn.processMessage(alice.did, protocolsConfigureMessage);
                            expect(objectTagsTypeConfigureReply.status.code).to.equal(400);
                        }));
                        it('array of objects', () => __awaiter(this, void 0, void 0, function* () {
                            const alice = yield TestDataGenerator.generateDidKeyPersona();
                            // protocol definition with unsupported tag type array of objects
                            const objectArrayTagsType = {
                                protocol: 'http://example.com/protocol/withTags',
                                published: true,
                                types: {
                                    foo: {}
                                },
                                structure: {
                                    foo: {
                                        $tags: {
                                            objectArrayTag: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                }
                                            },
                                        }
                                    }
                                },
                            };
                            // manually craft the invalid ProtocolsConfigure message because our library will not let you create an invalid definition
                            const descriptor = {
                                interface: DwnInterfaceName.Protocols,
                                method: DwnMethodName.Configure,
                                messageTimestamp: Time.getCurrentTimestamp(),
                                definition: objectArrayTagsType
                            };
                            const authorization = yield Message.createAuthorization({
                                descriptor,
                                signer: Jws.createSigner(alice)
                            });
                            const protocolsConfigureMessage = { descriptor, authorization };
                            const objectArrayTagsTypeConfigureReply = yield dwn.processMessage(alice.did, protocolsConfigureMessage);
                            expect(objectArrayTagsTypeConfigureReply.status.code).to.equal(400);
                        }));
                        it('array of booleans', () => __awaiter(this, void 0, void 0, function* () {
                            const alice = yield TestDataGenerator.generateDidKeyPersona();
                            // protocol definition with unsupported tag type array of booleans
                            const booleanArrayTagsType = {
                                protocol: 'http://example.com/protocol/withTags',
                                published: true,
                                types: {
                                    foo: {}
                                },
                                structure: {
                                    foo: {
                                        $tags: {
                                            booleanArrayTag: {
                                                type: 'array',
                                                items: {
                                                    type: 'boolean',
                                                }
                                            },
                                        }
                                    }
                                },
                            };
                            const descriptor = {
                                interface: DwnInterfaceName.Protocols,
                                method: DwnMethodName.Configure,
                                messageTimestamp: Time.getCurrentTimestamp(),
                                definition: booleanArrayTagsType
                            };
                            const authorization = yield Message.createAuthorization({
                                descriptor,
                                signer: Jws.createSigner(alice)
                            });
                            const protocolsConfigureMessage = { descriptor, authorization };
                            const booleanArrayTagsTypeConfigureReply = yield dwn.processMessage(alice.did, protocolsConfigureMessage);
                            expect(booleanArrayTagsTypeConfigureReply.status.code).to.equal(400);
                        }));
                    });
                });
                it('should reject a record with a tag property that does not match the protocol definition tags', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // has a `knownTag` tag in the protocol definition
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    knownTag: {
                                        type: 'string',
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with an `unknownTag` tag.
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            unknownTag: 'some-value'
                        }
                    });
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(400);
                    expect(fooRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    // ensure the correct tag descriptor is in the error message
                    expect(fooRecordReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags must NOT have additional properties`);
                    // write a foo record with a `knownTag` tag.
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            knownTag: 'some-value'
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should reject a tag value that does not match the boolean type', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with a boolean type for a tag
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    draft: {
                                        type: 'boolean'
                                    }
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // `draft` should be a boolean type, but we are passing a string
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            draft: 'true'
                        }
                    });
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(400);
                    expect(fooRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(fooRecordReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/draft must be boolean`);
                    // positive test with a boolean
                    const fooRecord2 = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            draft: true
                        }
                    });
                    const fooRecord2Reply = yield dwn.processMessage(alice.did, fooRecord2.message, { dataStream: fooRecord2.dataStream });
                    expect(fooRecord2Reply.status.code).to.equal(202);
                }));
                it('should reject a tag value that does not match the number type', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with a number type for a tag
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    numberType: {
                                        type: 'number'
                                    }
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // `numberType` should be a number type, but we are passing a string
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberType: '1'
                        }
                    });
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(400);
                    expect(fooRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(fooRecordReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/numberType must be number`);
                    // positive tests with an integer number
                    const fooRecord2 = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberType: 1
                        }
                    });
                    const fooRecord2Reply = yield dwn.processMessage(alice.did, fooRecord2.message, { dataStream: fooRecord2.dataStream });
                    expect(fooRecord2Reply.status.code).to.equal(202);
                    // positive tests with a decimal number
                    const fooRecord3 = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberType: 1.5
                        }
                    });
                    const fooRecord3Reply = yield dwn.processMessage(alice.did, fooRecord3.message, { dataStream: fooRecord3.dataStream });
                    expect(fooRecord3Reply.status.code).to.equal(202);
                }));
                it('should reject a tag value that does not match the integer type', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with an integer type for a tag
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    count: {
                                        type: 'integer',
                                    }
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // `count` should be an integer type, but we are passing decimal number
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            count: 1.5
                        }
                    });
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(400);
                    expect(fooRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(fooRecordReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/count must be integer`);
                    // positive test with an integer
                    const fooRecord2 = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            count: 1
                        }
                    });
                    const fooRecord2Reply = yield dwn.processMessage(alice.did, fooRecord2.message, { dataStream: fooRecord2.dataStream });
                    expect(fooRecord2Reply.status.code).to.equal(202);
                }));
                it('should reject a record with a tag value that does not match a given enum in the protocol definition', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with an enum for a tag
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    status: {
                                        type: 'string',
                                        enum: ['draft', 'published', 'archived']
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with an `unknown_status` tag value.
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            status: 'unknown_status'
                        }
                    });
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(400);
                    expect(fooRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(fooRecordReply.status.detail).to
                        .contain(`${protocolDefinition.protocol}/foo/$tags/status must be equal to one of the allowed values`);
                    // ensure the correct tag descriptor path is in the error message
                    expect(fooRecordReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/status`);
                    // write a foo record with a valid `status` tag value.
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            status: 'draft'
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should reject a record with a tag value that is not within the `minimum` and `maximum` range', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with minimum and maximum for a number
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    score: {
                                        type: 'number',
                                        minimum: 0,
                                        maximum: 100
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with an `score` value less than 0.
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            score: -1,
                        }
                    });
                    // should fail
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(400);
                    expect(fooRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(fooRecordReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/score must be >= 0`);
                    // write a foo record with an `score` value greater than 100.
                    const fooRecord2 = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            score: 101,
                        }
                    });
                    // should fail
                    const fooRecord2Reply = yield dwn.processMessage(alice.did, fooRecord2.message, { dataStream: fooRecord2.dataStream });
                    expect(fooRecord2Reply.status.code).to.equal(400);
                    expect(fooRecord2Reply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(fooRecord2Reply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/score must be <= 100`);
                    // write a foo record with a maximum `score` of 100.
                    const validFooMaxRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            score: 100,
                        }
                    });
                    // should pass
                    const validFooMaxRecordReply = yield dwn.processMessage(alice.did, validFooMaxRecord.message, { dataStream: validFooMaxRecord.dataStream });
                    expect(validFooMaxRecordReply.status.code).to.equal(202);
                    // write a foo record with a maximum `score` of 0.
                    const validFooMinRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            score: 0,
                        }
                    });
                    // should pass
                    const validFooMinRecordReply = yield dwn.processMessage(alice.did, validFooMinRecord.message, { dataStream: validFooMinRecord.dataStream });
                    expect(validFooMinRecordReply.status.code).to.equal(202);
                    // write a foo record within the range
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            score: 50,
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should reject a record with a tag value that is not within the `exclusiveMinimum` and `exclusiveMaximum` range', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with exclusiveMinimum and exclusiveMaximum for a number
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    hours: {
                                        type: 'number',
                                        exclusiveMinimum: 0,
                                        exclusiveMaximum: 24
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with an hour at the exclusiveMaximum
                    const exclusiveMaxRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            hours: 24,
                        }
                    });
                    // should fail
                    const exclusiveMaxReply = yield dwn.processMessage(alice.did, exclusiveMaxRecord.message, { dataStream: exclusiveMaxRecord.dataStream });
                    expect(exclusiveMaxReply.status.code).to.equal(400);
                    expect(exclusiveMaxReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(exclusiveMaxReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/hours must be < 24`);
                    // write a foo record with an hour at the exclusiveMinimum
                    const exclusiveMinRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            hours: 0,
                        }
                    });
                    // should fail
                    const exclusiveMinReply = yield dwn.processMessage(alice.did, exclusiveMinRecord.message, { dataStream: exclusiveMinRecord.dataStream });
                    expect(exclusiveMinReply.status.code).to.equal(400);
                    expect(exclusiveMinReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(exclusiveMinReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/hours must be > 0`);
                    // write a foo record with an `hour` value within the range.
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            hours: 12,
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should reject tag values that are not within the `minLength` and `maxLength` values', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with minLength and maxLength for a string
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    stringWithLimit: {
                                        type: 'string',
                                        maxLength: 10,
                                        minLength: 5
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with a `stringWithLimit` value less than the minimum length
                    const minLengthRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            stringWithLimit: 'a', // less than 5
                        }
                    });
                    // should fail
                    const minLengthReply = yield dwn.processMessage(alice.did, minLengthRecord.message, { dataStream: minLengthRecord.dataStream });
                    expect(minLengthReply.status.code).to.equal(400);
                    expect(minLengthReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(minLengthReply.status.detail).to
                        .contain(`${protocolDefinition.protocol}/foo/$tags/stringWithLimit must NOT have fewer than 5 characters`);
                    // write a foo record with a `stringWithLimit` value greater than the maximum length
                    const maxLengthRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            stringWithLimit: 'abcdefghijklmnopqrstuvwxyz', //more than 10
                        }
                    });
                    // should fail
                    const maxLengthReply = yield dwn.processMessage(alice.did, maxLengthRecord.message, { dataStream: maxLengthRecord.dataStream });
                    expect(maxLengthReply.status.code).to.equal(400);
                    expect(maxLengthReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(maxLengthReply.status.detail).to
                        .contain(`${protocolDefinition.protocol}/foo/$tags/stringWithLimit must NOT have more than 10 characters`);
                    // write a foo record with a `stringWithLimit` value within the range
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            stringWithLimit: 'abcdef', // more than 5 less than 10
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should reject tag values that do not contain the number of items within the `minItems` and `maxItems` values', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with minItems and maxItems for an array of numbers
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    numberArray: {
                                        type: 'array',
                                        minItems: 2,
                                        maxItems: 3,
                                        items: {
                                            type: 'number',
                                        }
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with a `numberArray` value with only 1 item, less than the `minItems` specified of 2
                    const minLengthRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: [1] // less than 2
                        }
                    });
                    // should fail
                    const minLengthReply = yield dwn.processMessage(alice.did, minLengthRecord.message, { dataStream: minLengthRecord.dataStream });
                    expect(minLengthReply.status.code).to.equal(400);
                    expect(minLengthReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(minLengthReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/numberArray must NOT have fewer than 2 items`);
                    // write a foo record with a `numberArray` value with 4 items, more than the `maxItems` specified of 3
                    const maxLengthRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: [2, 4, 6, 8] // more than 3
                        }
                    });
                    // should fail
                    const maxLengthReply = yield dwn.processMessage(alice.did, maxLengthRecord.message, { dataStream: maxLengthRecord.dataStream });
                    expect(maxLengthReply.status.code).to.equal(400);
                    expect(maxLengthReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(maxLengthReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/numberArray must NOT have more than 3 items`);
                    // write a foo record with a `numberArray` value with 3 items, within the range
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: [2, 3, 4] // within the range
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should reject a value within an array that should only include numbers', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with an array of numbers
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    numberArray: {
                                        type: 'array',
                                        items: {
                                            type: 'number',
                                        }
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with a `numberArray` value with a string
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: ['a']
                        }
                    });
                    // should fail
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(400);
                    expect(fooRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(fooRecordReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/numberArray/0 must be number`);
                    // write a foo record with a `numberArray` value with a number (both integer and decimal)
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: [1, 1.5]
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should reject a value within an array that should only include integers', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with an array of numbers
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    numberArray: {
                                        type: 'array',
                                        items: {
                                            type: 'integer',
                                        }
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with a `numberArray` value with a decimal
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: [1, 1.5]
                        }
                    });
                    // should fail
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(400);
                    expect(fooRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(fooRecordReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags/numberArray/1 must be integer`);
                    // write a foo record with a `numberArray` value with values of integers
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: [1, 2]
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should reject tag values that do not contain the number of items within the `minContains` and `maxContains` values', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with minContains and maxContains for an array of numbers
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    numberArray: {
                                        type: 'array',
                                        items: {
                                            type: 'number',
                                        },
                                        contains: {
                                            type: 'number',
                                            minimum: 80,
                                            maximum: 100
                                        },
                                        minContains: 2,
                                        maxContains: 4
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with a `numberArray` value with only 1 item that matches contains contraint, less than the `minContains` of 2
                    // but additional items that would equal more than 2 items
                    const minLengthRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: [1, 2, 81] // only 1 item that matches contains constraint
                        }
                    });
                    // should fail
                    const minLengthReply = yield dwn.processMessage(alice.did, minLengthRecord.message, { dataStream: minLengthRecord.dataStream });
                    expect(minLengthReply.status.code).to.equal(400);
                    expect(minLengthReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(minLengthReply.status.detail)
                        .to.contain(`${protocolDefinition.protocol}/foo/$tags/numberArray must contain at least 2 and no more than 4 valid item(s)`);
                    // write a foo record with a `numberArray` value with 4 items, more than the `maxItems` specified of 3
                    const maxLengthRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: [81, 82, 83, 84, 85] // more than 4 match the contains constraint
                        }
                    });
                    // should fail
                    const maxLengthReply = yield dwn.processMessage(alice.did, maxLengthRecord.message, { dataStream: maxLengthRecord.dataStream });
                    expect(maxLengthReply.status.code).to.equal(400);
                    expect(maxLengthReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(maxLengthReply.status.detail)
                        .to.contain(`${protocolDefinition.protocol}/foo/$tags/numberArray must contain at least 2 and no more than 4 valid item(s)`);
                    // write a foo record with a `numberArray` value with 3 items, within the range
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            numberArray: [1, 2, 81, 82, 83] // 3 items match contains constraint, within the range
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should reject tag values that do not follow the constraints of the `uniqueItems` value', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with uniqueItems for an array of strings
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    uniqueStrings: {
                                        type: 'array',
                                        uniqueItems: true,
                                        items: {
                                            type: 'string',
                                        }
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record with a `uniqueStrings` value with duplicate items
                    const duplicateItemsRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            uniqueStrings: ['a', 'a'] // duplicate items
                        }
                    });
                    // should fail
                    const duplicateItemsReply = yield dwn.processMessage(alice.did, duplicateItemsRecord.message, { dataStream: duplicateItemsRecord.dataStream });
                    expect(duplicateItemsReply.status.code).to.equal(400);
                    // write a foo record with a `uniqueStrings` value with unique items
                    const uniqueItemsRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            uniqueStrings: ['a', 'b'] // unique items
                        }
                    });
                    // should pass
                    const uniqueItemsReply = yield dwn.processMessage(alice.did, uniqueItemsRecord.message, { dataStream: uniqueItemsRecord.dataStream });
                    expect(uniqueItemsReply.status.code).to.equal(202);
                }));
                it('should only accept a record containing tags required by $requiredTags', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with a required tag
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    $requiredTags: ['someRequiredTag'],
                                    someRequiredTag: {
                                        type: 'string',
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record without the required tag
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                    });
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(400);
                    expect(fooRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                    expect(fooRecordReply.status.detail).to.contain(`${protocolDefinition.protocol}/foo/$tags must have required property 'someRequiredTag'`);
                    // write a foo record with the required tag
                    const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            someRequiredTag: 'some-value'
                        }
                    });
                    // should pass
                    const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                    expect(validFooRecordReply.status.code).to.equal(202);
                }));
                it('should accept any tag if $allowUndefinedTags is set to true', () => __awaiter(this, void 0, void 0, function* () {
                    const alice = yield TestDataGenerator.generateDidKeyPersona();
                    // protocol with no required tags
                    const protocolDefinition = {
                        protocol: 'http://example.com/protocol/withTags',
                        published: true,
                        types: {
                            foo: {}
                        },
                        structure: {
                            foo: {
                                $tags: {
                                    $allowUndefinedTags: true,
                                    optionalTag: {
                                        type: 'string',
                                    },
                                }
                            }
                        },
                    };
                    // configure tags protocol
                    const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                        author: alice,
                        protocolDefinition,
                    });
                    const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                    expect(configureReply.status.code).to.equal(202);
                    // write a foo record without the required tag
                    const fooRecord = yield TestDataGenerator.generateRecordsWrite({
                        author: alice,
                        published: true,
                        protocol: protocolDefinition.protocol,
                        protocolPath: 'foo',
                        tags: {
                            randomTag: 'some-value'
                        }
                    });
                    const fooRecordReply = yield dwn.processMessage(alice.did, fooRecord.message, { dataStream: fooRecord.dataStream });
                    expect(fooRecordReply.status.code).to.equal(202);
                }));
                describe('contains', () => {
                    it('should reject a record tag that does not contain a value specified within the `enum` definition', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol with `enum` definition within `contains`
                        const protocolDefinition = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        status: {
                                            type: 'array',
                                            items: {
                                                type: 'string'
                                            },
                                            contains: {
                                                type: 'string',
                                                enum: ['complete', 'in-progress', 'backlog']
                                            }
                                        },
                                    }
                                }
                            },
                        };
                        // configure tags protocol
                        const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                        expect(configureReply.status.code).to.equal(202);
                        // write a foo record with a `status` value that is not represented in the `enum`
                        const invalidEnumRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                status: ['blocked'] // 'blocked' is not in the enum
                            }
                        });
                        // should fail
                        const invalidEnumReply = yield dwn.processMessage(alice.did, invalidEnumRecord.message, { dataStream: invalidEnumRecord.dataStream });
                        expect(invalidEnumReply.status.code).to.equal(400);
                        expect(invalidEnumReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(invalidEnumReply.status.detail)
                            .to.contain(`${protocolDefinition.protocol}/foo/$tags/status must contain at least 1 valid item(s)`);
                        // write a foo record that now adds a valid `status` value to the array
                        const validEnumRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                status: ['blocked', 'in-progress'] // at least one is within the array
                            }
                        });
                        // should pass
                        const validEnumReply = yield dwn.processMessage(alice.did, validEnumRecord.message, { dataStream: validEnumRecord.dataStream });
                        expect(validEnumReply.status.code).to.equal(202);
                    }));
                    it('should reject a record tag that does not contain a value within the `minimum` and `maximum` range ', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol with `minimum` and `maximum` definitions within `contains`
                        const protocolDefinition = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        containsNumbers: {
                                            type: 'array',
                                            items: {
                                                type: 'number'
                                            },
                                            contains: {
                                                type: 'number',
                                                minimum: 80,
                                                maximum: 100
                                            }
                                        },
                                    }
                                }
                            },
                        };
                        // configure tags protocol
                        const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                        expect(configureReply.status.code).to.equal(202);
                        // write a foo record with a `containsNumbers` value that does not have a number within the range
                        const minContainsRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                containsNumbers: [50, 101] // does not contain any numbers within the range
                            }
                        });
                        // should fail
                        const minContainsReply = yield dwn.processMessage(alice.did, minContainsRecord.message, { dataStream: minContainsRecord.dataStream });
                        expect(minContainsReply.status.code).to.equal(400);
                        expect(minContainsReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(minContainsReply.status.detail)
                            .to.contain(`${protocolDefinition.protocol}/foo/$tags/containsNumbers must contain at least 1 valid item(s)`);
                        // write a foo record with a `containsNumbers` value that has a number within the range
                        const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                containsNumbers: [50, 90, 101] // at least one number is within range
                            }
                        });
                        // should pass
                        const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                        expect(validFooRecordReply.status.code).to.equal(202);
                    }));
                    it('should reject a record tag that does not contain a value within the `exclusiveMinimum` and `exclusiveMaximum` range ', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol with `minimum` and `maximum` definitions within `contains`
                        const protocolDefinition = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        containsNumbers: {
                                            type: 'array',
                                            items: {
                                                type: 'number'
                                            },
                                            contains: {
                                                type: 'number',
                                                exclusiveMinimum: 80,
                                                exclusiveMaximum: 100
                                            }
                                        },
                                    }
                                }
                            },
                        };
                        // configure tags protocol
                        const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                        expect(configureReply.status.code).to.equal(202);
                        // write a foo record with a `containsNumbers` value that does not have a number within the range
                        const minContainsRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                containsNumbers: [80, 100] // does not contain any numbers within the range
                            }
                        });
                        // should fail
                        const minContainsReply = yield dwn.processMessage(alice.did, minContainsRecord.message, { dataStream: minContainsRecord.dataStream });
                        expect(minContainsReply.status.code).to.equal(400);
                        expect(minContainsReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(minContainsReply.status.detail)
                            .to.contain(`${protocolDefinition.protocol}/foo/$tags/containsNumbers must contain at least 1 valid item(s)`);
                        // write a foo record with a `containsNumbers` value that has a number within the range
                        const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                containsNumbers: [80, 90, 100] // at least one number is within range
                            }
                        });
                        // should pass
                        const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                        expect(validFooRecordReply.status.code).to.equal(202);
                    }));
                    it('should reject a record tag that does not contain a value within the `minLength` and `maxLength` range ', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol with `minLength` and `maxLength` definitions within `contains`
                        const protocolDefinition = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        nickNames: {
                                            type: 'array',
                                            items: {
                                                type: 'string'
                                            },
                                            contains: {
                                                type: 'string',
                                                maxLength: 10,
                                                minLength: 2,
                                            }
                                        },
                                    }
                                }
                            },
                        };
                        // configure tags protocol
                        const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                        expect(configureReply.status.code).to.equal(202);
                        // write a foo record with a `firstName` value that does not have a string within the range
                        const minContainsRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                nickNames: ['a', 'b'] // only contains first initial, will fail
                            }
                        });
                        // should fail
                        const minContainsReply = yield dwn.processMessage(alice.did, minContainsRecord.message, { dataStream: minContainsRecord.dataStream });
                        expect(minContainsReply.status.code).to.equal(400);
                        expect(minContainsReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(minContainsReply.status.detail).to
                            .contain(`${protocolDefinition.protocol}/foo/$tags/nickNames must contain at least 1 valid item(s)`);
                        // write a foo record with a `nickNames` value that has a string within the range
                        const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                nickNames: ['ali', 'a'] // at least one string is within range
                            }
                        });
                        // should pass
                        const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                        expect(validFooRecordReply.status.code).to.equal(202);
                    }));
                });
                describe('items', () => {
                    it('should reject a record tag that includes a value not specified within the `enum` definition', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol with `enum` definition within `items`
                        const protocolDefinition = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        status: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                enum: ['complete', 'in-progress', 'backlog', 'approved']
                                            },
                                        },
                                    }
                                }
                            },
                        };
                        // configure tags protocol
                        const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                        expect(configureReply.status.code).to.equal(202);
                        // write a foo record with a `status` value that is not represented in the `enum`
                        const invalidEnumRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                status: ['in-progress', 'blocked'] // 'blocked' is not in the enum
                            }
                        });
                        // should fail
                        const invalidEnumReply = yield dwn.processMessage(alice.did, invalidEnumRecord.message, { dataStream: invalidEnumRecord.dataStream });
                        expect(invalidEnumReply.status.code).to.equal(400);
                        expect(invalidEnumReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(invalidEnumReply.status.detail)
                            .to.contain(`${protocolDefinition.protocol}/foo/$tags/status/1 must be equal to one of the allowed values`);
                        // write a foo record that now includes only valid `status` values
                        const validEnumRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                status: ['complete', 'approved'] // both are in the enum
                            }
                        });
                        // should pass
                        const validEnumReply = yield dwn.processMessage(alice.did, validEnumRecord.message, { dataStream: validEnumRecord.dataStream });
                        expect(validEnumReply.status.code).to.equal(202);
                    }));
                    it('should reject a record tag which all items do not have a value within the `minimum` and `maximum` range ', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol with minContains and maxContains for an array of numbers
                        const protocolDefinition = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        numbers: {
                                            type: 'array',
                                            items: {
                                                type: 'number',
                                                minimum: 80,
                                                maximum: 100
                                            },
                                        },
                                    }
                                }
                            },
                        };
                        // configure tags protocol
                        const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                        expect(configureReply.status.code).to.equal(202);
                        // write a foo record with a `numbers` value that is less than the minimum
                        const minItemssRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                numbers: [50, 90] // contains an item less than the minimum
                            }
                        });
                        // should fail
                        const minItemsReply = yield dwn.processMessage(alice.did, minItemssRecord.message, { dataStream: minItemssRecord.dataStream });
                        expect(minItemsReply.status.code).to.equal(400);
                        expect(minItemsReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(minItemsReply.status.detail)
                            .to.contain(`${protocolDefinition.protocol}/foo/$tags/numbers/0 must be >= 80`);
                        // write a foo record with a `numbers` value that is more than the maximum
                        const maxItemssRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                numbers: [85, 105] // contains an item more than the maximum
                            }
                        });
                        // should fail
                        const maxItemsReply = yield dwn.processMessage(alice.did, maxItemssRecord.message, { dataStream: maxItemssRecord.dataStream });
                        expect(maxItemsReply.status.code).to.equal(400);
                        expect(maxItemsReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(maxItemsReply.status.detail)
                            .to.contain(`${protocolDefinition.protocol}/foo/$tags/numbers/1 must be <= 100`);
                        // write a foo record with a `numbers` value that are within the range
                        const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                numbers: [85, 90] // both items within range
                            }
                        });
                        // should pass
                        const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                        expect(validFooRecordReply.status.code).to.equal(202);
                    }));
                    it('should reject a record tag which all items do not have a value within the `exclusiveMinimum` and `exclusiveMaximum` range ', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol with minContains and maxContains for an array of numbers
                        const protocolDefinition = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        numbers: {
                                            type: 'array',
                                            items: {
                                                type: 'number',
                                                exclusiveMinimum: 80,
                                                exclusiveMaximum: 100
                                            },
                                        },
                                    }
                                }
                            },
                        };
                        // configure tags protocol
                        const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                        expect(configureReply.status.code).to.equal(202);
                        // write a foo record with a `numbers` value that is equal to than the exclusive minimum
                        const minItemsRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                numbers: [80, 90] // contains an item equal to the exclusive minimum
                            }
                        });
                        // should fail
                        const minItemsReply = yield dwn.processMessage(alice.did, minItemsRecord.message, { dataStream: minItemsRecord.dataStream });
                        expect(minItemsReply.status.code).to.equal(400);
                        expect(minItemsReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(minItemsReply.status.detail)
                            .to.contain(`${protocolDefinition.protocol}/foo/$tags/numbers/0 must be > 80`);
                        // write a foo record with a `numbers` value that is equal to than the exclusive maximum
                        const maxContainsRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                numbers: [90, 100] // contains an item that is equal to the exclusive maximum
                            }
                        });
                        // should fail
                        const maxItemsReply = yield dwn.processMessage(alice.did, maxContainsRecord.message, { dataStream: maxContainsRecord.dataStream });
                        expect(maxItemsReply.status.code).to.equal(400);
                        expect(maxItemsReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(maxItemsReply.status.detail)
                            .to.contain(`${protocolDefinition.protocol}/foo/$tags/numbers/1 must be < 100`);
                        // write a foo record with a `numbers` value that are within the range
                        const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                numbers: [81, 99] // both items within range
                            }
                        });
                        // should pass
                        const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                        expect(validFooRecordReply.status.code).to.equal(202);
                    }));
                    it('should reject a record tag that does not contain a value within the `minLength` and `maxLength` range ', () => __awaiter(this, void 0, void 0, function* () {
                        const alice = yield TestDataGenerator.generateDidKeyPersona();
                        // protocol with `minLength` and `maxLength` definitions within `contains`
                        const protocolDefinition = {
                            protocol: 'http://example.com/protocol/withTags',
                            published: true,
                            types: {
                                foo: {}
                            },
                            structure: {
                                foo: {
                                    $tags: {
                                        nickNames: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                maxLength: 10,
                                                minLength: 2,
                                            },
                                        },
                                    }
                                }
                            },
                        };
                        // configure tags protocol
                        const protocolConfigure = yield TestDataGenerator.generateProtocolsConfigure({
                            author: alice,
                            protocolDefinition,
                        });
                        const configureReply = yield dwn.processMessage(alice.did, protocolConfigure.message);
                        expect(configureReply.status.code).to.equal(202);
                        // write a foo record with a `firstName` value that does not have a string within the range
                        const minItemsRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                nickNames: ['ali', 'a'] // 'a' is too short
                            }
                        });
                        // should fail
                        const minItemsReply = yield dwn.processMessage(alice.did, minItemsRecord.message, { dataStream: minItemsRecord.dataStream });
                        expect(minItemsReply.status.code).to.equal(400);
                        expect(minItemsReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(minItemsReply.status.detail).to
                            .contain(`${protocolDefinition.protocol}/foo/$tags/nickNames/1 must NOT have fewer than 2 characters`);
                        // write a foo record with a `nickname` value this is too long
                        const maxItemsRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                nickNames: ['ali', 'alice-jane-mary'] // 'alice-jane-mary' is too long
                            }
                        });
                        // should fail
                        const maxItemsReply = yield dwn.processMessage(alice.did, maxItemsRecord.message, { dataStream: maxItemsRecord.dataStream });
                        expect(maxItemsReply.status.code).to.equal(400);
                        expect(maxItemsReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationTagsInvalidSchema);
                        expect(maxItemsReply.status.detail).to
                            .contain(`${protocolDefinition.protocol}/foo/$tags/nickNames/1 must NOT have more than 10 characters`);
                        // write a foo record with a `nickNames` value that has a string within the range
                        const validFooRecord = yield TestDataGenerator.generateRecordsWrite({
                            author: alice,
                            published: true,
                            protocol: protocolDefinition.protocol,
                            protocolPath: 'foo',
                            tags: {
                                nickNames: ['ali', 'allie'] // both items within range
                            }
                        });
                        // should pass
                        const validFooRecordReply = yield dwn.processMessage(alice.did, validFooRecord.message, { dataStream: validFooRecord.dataStream });
                        expect(validFooRecordReply.status.code).to.equal(202);
                    }));
                });
            });
            it('should be able to write a Record with tags', () => __awaiter(this, void 0, void 0, function* () {
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // create tags that represent `string[]`, `number[]`, `string`, `number`, or `boolean` values.
                const stringTag = 'string-value';
                const stringArrayTag = ['string-value', 'string-value2'];
                const numberTag = 54566975;
                const numberArrayTag = [0, 1, 2];
                const booleanTag = false;
                const tagsRecord1 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag,
                        numberTag,
                        booleanTag,
                        stringArrayTag,
                        numberArrayTag,
                    }
                });
                const tagsRecord1Reply = yield dwn.processMessage(alice.did, tagsRecord1.message, { dataStream: tagsRecord1.dataStream });
                expect(tagsRecord1Reply.status.code).to.equal(202);
                // verify the record was written
                const tagsRecord1Read = yield RecordsRead.create({
                    filter: {
                        recordId: tagsRecord1.message.recordId,
                    },
                    signer: Jws.createSigner(alice)
                });
                const tagsRecord1ReadReply = yield dwn.processMessage(alice.did, tagsRecord1Read.message);
                expect(tagsRecord1ReadReply.status.code).to.equal(200);
                expect(tagsRecord1ReadReply.record).to.not.be.undefined;
                expect(tagsRecord1ReadReply.record.descriptor.tags).to.deep.equal({ stringTag, numberTag, booleanTag, stringArrayTag, numberArrayTag });
            }));
            it('should overwrite tags when updating a Record', () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const tagsRecord1 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag: 'string-value',
                        numberTag: 54566975,
                        booleanTag: false,
                        stringArrayTag: ['string-value', 'string-value2'],
                        numberArrayTag: [0, 1, 2],
                    }
                });
                // write the record
                const tagsRecord1Reply = yield dwn.processMessage(alice.did, tagsRecord1.message, { dataStream: tagsRecord1.dataStream });
                expect(tagsRecord1Reply.status.code).to.equal(202);
                // verify the record was written
                const tagsRecord1Read = yield RecordsRead.create({
                    filter: {
                        recordId: tagsRecord1.message.recordId,
                    },
                    signer: Jws.createSigner(alice)
                });
                const tagsRecord1ReadReply = yield dwn.processMessage(alice.did, tagsRecord1Read.message);
                expect(tagsRecord1ReadReply.status.code).to.equal(200);
                expect(tagsRecord1ReadReply.record).to.not.be.undefined;
                expect(tagsRecord1ReadReply.record.descriptor.tags).to.deep.equal({
                    stringTag: 'string-value',
                    numberTag: 54566975,
                    booleanTag: false,
                    stringArrayTag: ['string-value', 'string-value2'],
                    numberArrayTag: [0, 1, 2],
                });
                // Sanity: Query for a tag value
                const tagsQueryMatch = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            stringTag: 'string-value'
                        }
                    }
                });
                const tagsQueryMatchReply = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply.status.code).to.equal(200);
                expect((_a = tagsQueryMatchReply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(1);
                expect(tagsQueryMatchReply.entries[0].recordId).to.equal(tagsRecord1.message.recordId);
                // update the record with new tags
                const updatedRecord = yield TestDataGenerator.generateFromRecordsWrite({
                    author: alice,
                    existingWrite: tagsRecord1.recordsWrite,
                    tags: { newTag: 'new-value' }
                });
                const updatedRecordReply = yield dwn.processMessage(alice.did, updatedRecord.message, { dataStream: updatedRecord.dataStream });
                expect(updatedRecordReply.status.code).to.equal(202, updatedRecordReply.status.detail);
                const updatedRecordReadReply = yield dwn.processMessage(alice.did, tagsRecord1Read.message);
                expect(updatedRecordReadReply.status.code).to.equal(200);
                expect(updatedRecordReadReply.record).to.not.be.undefined;
                expect(updatedRecordReadReply.record.descriptor.tags).to.deep.equal({ newTag: 'new-value' });
                // Sanity: Query for the old tag value should return no results
                const tagsQueryMatchReply2 = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply2.status.code).to.equal(200);
                expect((_b = tagsQueryMatchReply2.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(0);
            }));
            it('should not index tags when the record is not `latestBaseState`', () => __awaiter(this, void 0, void 0, function* () {
                const buildTagIndexSpy = sinon.spy(Records, 'buildTagIndexes');
                const constructIndexesSpy = sinon.spy(RecordsWrite.prototype, 'constructIndexes');
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // write a record with tags, this should trigger the `buildTagIndexes` method
                const tagsRecord1 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag: 'string-value',
                        numberTag: 54566975,
                        booleanTag: false,
                        stringArrayTag: ['string-value', 'string-value2'],
                        numberArrayTag: [0, 1, 2],
                    }
                });
                // write the record
                const tagsRecord1Reply = yield dwn.processMessage(alice.did, tagsRecord1.message, { dataStream: tagsRecord1.dataStream });
                expect(tagsRecord1Reply.status.code).to.equal(202);
                // verify that construct Indexes was called
                expect(constructIndexesSpy.callCount).to.equal(1);
                // verify that buildTagIndexes was called
                expect(buildTagIndexSpy.callCount).to.equal(1);
                // reset counters
                constructIndexesSpy.resetHistory();
                buildTagIndexSpy.resetHistory();
                // update the record without any tags this time
                const updatedRecord = yield TestDataGenerator.generateFromRecordsWrite({
                    author: alice,
                    existingWrite: tagsRecord1.recordsWrite,
                });
                const updatedRecordReply = yield dwn.processMessage(alice.did, updatedRecord.message, { dataStream: updatedRecord.dataStream });
                expect(updatedRecordReply.status.code).to.equal(202);
                // construct Indexes should be called once for the `initialWrite` and once for the updated write
                expect(constructIndexesSpy.callCount).to.equal(2);
                // verify that buildTagIndexes was not called at all
                expect(buildTagIndexSpy.callCount).to.equal(0);
            }));
        });
        describe('RecordsQuery filter for tags', () => {
            it('should be able to filter by string match', () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const stringTag = 'string-value';
                const tagsRecord1 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag,
                    }
                });
                const tagsRecord1Reply = yield dwn.processMessage(alice.did, tagsRecord1.message, { dataStream: tagsRecord1.dataStream });
                expect(tagsRecord1Reply.status.code).to.equal(202);
                const tagsQueryMatch = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            stringTag: 'string-value'
                        }
                    }
                });
                const tagsQueryMatchReply = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply.status.code).to.equal(200);
                expect((_a = tagsQueryMatchReply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(1);
                expect(tagsQueryMatchReply.entries[0].recordId).to.equal(tagsRecord1.message.recordId);
                // negative result same tag different value
                let tagsQueryNegative = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            stringTag: 'other-value'
                        }
                    }
                });
                let tagsQueryNegativeReply = yield dwn.processMessage(alice.did, tagsQueryNegative.message);
                expect(tagsQueryNegativeReply.status.code).to.equal(200);
                expect((_b = tagsQueryNegativeReply.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(0);
                // negative result different tag same value
                tagsQueryNegative = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            otherTag: 'string-value'
                        }
                    }
                });
                tagsQueryNegativeReply = yield dwn.processMessage(alice.did, tagsQueryNegative.message);
                expect(tagsQueryNegativeReply.status.code).to.equal(200);
                expect((_c = tagsQueryNegativeReply.entries) === null || _c === void 0 ? void 0 : _c.length).to.equal(0);
            }));
            it('should be able to filter by number match', () => __awaiter(this, void 0, void 0, function* () {
                var _d, _e, _f;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const numberTag = 54566975;
                // write a record with a numerical value tag
                const tagsRecord1 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        numberTag,
                    }
                });
                const tagsRecord1Reply = yield dwn.processMessage(alice.did, tagsRecord1.message, { dataStream: tagsRecord1.dataStream });
                expect(tagsRecord1Reply.status.code).to.equal(202);
                // do an exact match for the tag value
                const tagsQueryMatch = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            numberTag: 54566975,
                        }
                    }
                });
                const tagsQueryMatchReply = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply.status.code).to.equal(200);
                expect((_d = tagsQueryMatchReply.entries) === null || _d === void 0 ? void 0 : _d.length).to.equal(1);
                expect(tagsQueryMatchReply.entries[0].recordId).to.equal(tagsRecord1.message.recordId);
                // negative result same tag different value
                let tagsQueryNegative = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            numberTag: 54566974, // off by one
                        }
                    }
                });
                let tagsQueryNegativeReply = yield dwn.processMessage(alice.did, tagsQueryNegative.message);
                expect(tagsQueryNegativeReply.status.code).to.equal(200);
                expect((_e = tagsQueryNegativeReply.entries) === null || _e === void 0 ? void 0 : _e.length).to.equal(0);
                // negative result different tag same value
                tagsQueryNegative = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            otherTag: 54566975,
                        }
                    }
                });
                tagsQueryNegativeReply = yield dwn.processMessage(alice.did, tagsQueryNegative.message);
                expect(tagsQueryNegativeReply.status.code).to.equal(200);
                expect((_f = tagsQueryNegativeReply.entries) === null || _f === void 0 ? void 0 : _f.length).to.equal(0);
            }));
            it('should be able to filter by boolean match', () => __awaiter(this, void 0, void 0, function* () {
                // 1. Write a record with a boolean tag `booleanTag` set to true
                // 2. Write a record with a boolean tag `booleanTag` set to false.
                // 3. Query for records with a `booleanTag` set to true, and validate the result.
                // 4. Query for records with a `booleanTag` set to false, and validate the result.
                // 5. Query for records with a non existent boolean tag, should not return a result.
                var _g, _h, _j;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // write a record with a true boolean value tag
                const tagsRecordTrue = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        booleanTag: true,
                    }
                });
                const tagsRecordTrueReply = yield dwn.processMessage(alice.did, tagsRecordTrue.message, { dataStream: tagsRecordTrue.dataStream });
                expect(tagsRecordTrueReply.status.code).to.equal(202);
                // write a record with a false boolean value tag
                const tagsRecordFalse = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        booleanTag: false,
                    }
                });
                const tagsRecordFalseReply = yield dwn.processMessage(alice.did, tagsRecordFalse.message, { dataStream: tagsRecordFalse.dataStream });
                expect(tagsRecordFalseReply.status.code).to.equal(202);
                // query for records with a `booleanTag` set to true, should return the record with the true tag
                const tagsQueryMatchTrue = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            booleanTag: true
                        }
                    }
                });
                const tagsQueryMatchTrueReply = yield dwn.processMessage(alice.did, tagsQueryMatchTrue.message);
                expect(tagsQueryMatchTrueReply.status.code).to.equal(200);
                expect((_g = tagsQueryMatchTrueReply.entries) === null || _g === void 0 ? void 0 : _g.length).to.equal(1);
                expect(tagsQueryMatchTrueReply.entries[0].recordId).to.equal(tagsRecordTrue.message.recordId);
                // query for records with a `booleanTag` set to false, should return the record with the false tag
                const tagsQueryMatchFalse = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            booleanTag: false
                        }
                    }
                });
                const tagsQueryMatchFalseReply = yield dwn.processMessage(alice.did, tagsQueryMatchFalse.message);
                expect(tagsQueryMatchFalseReply.status.code).to.equal(200);
                expect((_h = tagsQueryMatchFalseReply.entries) === null || _h === void 0 ? void 0 : _h.length).to.equal(1);
                expect(tagsQueryMatchFalseReply.entries[0].recordId).to.equal(tagsRecordFalse.message.recordId);
                // negative result for a non existent boolean tag.
                const tagsQueryNegative = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            otherTag: true,
                        }
                    }
                });
                const tagsQueryNegativeReply = yield dwn.processMessage(alice.did, tagsQueryNegative.message);
                expect(tagsQueryNegativeReply.status.code).to.equal(200);
                expect((_j = tagsQueryNegativeReply.entries) === null || _j === void 0 ? void 0 : _j.length).to.equal(0);
            }));
            it('should be able to range filter by string value', () => __awaiter(this, void 0, void 0, function* () {
                var _k, _l, _m, _o;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // create four records with different first names
                const aliceRecord = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        firstName: 'alice'
                    }
                });
                const bobRecord = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        firstName: 'bob',
                    }
                });
                const carolRecord = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        firstName: 'carol',
                    }
                });
                const danielRecord = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        firstName: 'daniel',
                    }
                });
                const aliceReply = yield dwn.processMessage(alice.did, aliceRecord.message, { dataStream: aliceRecord.dataStream });
                expect(aliceReply.status.code).to.equal(202);
                const bobReply = yield dwn.processMessage(alice.did, bobRecord.message, { dataStream: bobRecord.dataStream });
                expect(bobReply.status.code).to.equal(202);
                const carolReply = yield dwn.processMessage(alice.did, carolRecord.message, { dataStream: carolRecord.dataStream });
                expect(carolReply.status.code).to.equal(202);
                const danielReply = yield dwn.processMessage(alice.did, danielRecord.message, { dataStream: danielRecord.dataStream });
                expect(danielReply.status.code).to.equal(202);
                // sanity query for all
                const queryForAll = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        schema: 'post'
                    }
                });
                const queryForAllReply = yield dwn.processMessage(alice.did, queryForAll.message);
                expect(queryForAllReply.status.code).to.equal(200);
                expect((_k = queryForAllReply.entries) === null || _k === void 0 ? void 0 : _k.length).to.equal(4); // all 4 records
                // query for first names that begin with 'a' and 'b'
                const queryForAtoB = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        schema: 'post',
                        tags: {
                            firstName: { gte: 'a', lt: 'c' }
                        }
                    }
                });
                const queryForAtoBReply = yield dwn.processMessage(alice.did, queryForAtoB.message);
                expect(queryForAtoBReply.status.code).to.equal(200);
                expect((_l = queryForAtoBReply.entries) === null || _l === void 0 ? void 0 : _l.length).to.equal(2);
                const atobRecordIds = queryForAtoBReply.entries.map(entry => entry.recordId);
                expect(atobRecordIds).to.have.members([aliceRecord.message.recordId, bobRecord.message.recordId]);
                // query for first names greater than 'bob'(exclusive of), and less than but inclusive of 'daniel'
                const queryForBtoD = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        schema: 'post',
                        tags: {
                            firstName: { gt: 'bob', lte: 'daniel' }
                        }
                    }
                });
                const queryForBtoDReply = yield dwn.processMessage(alice.did, queryForBtoD.message);
                expect(queryForBtoDReply.status.code).to.equal(200);
                expect((_m = queryForBtoDReply.entries) === null || _m === void 0 ? void 0 : _m.length).to.equal(2);
                const btodRecordIds = queryForBtoDReply.entries.map(entry => entry.recordId);
                expect(btodRecordIds).to.have.members([carolRecord.message.recordId, danielRecord.message.recordId]);
                // query for first names that begin with 'carol' onward (inclusive).
                const queryForCarolOnward = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        schema: 'post',
                        tags: {
                            firstName: { gte: 'carol' }
                        }
                    }
                });
                const queryForCarolOnwardReply = yield dwn.processMessage(alice.did, queryForCarolOnward.message);
                expect(queryForCarolOnwardReply.status.code).to.equal(200);
                expect((_o = queryForCarolOnwardReply.entries) === null || _o === void 0 ? void 0 : _o.length).to.equal(2);
                const onwardResults = queryForCarolOnwardReply.entries.map(entry => entry.recordId);
                expect(onwardResults).to.have.members([carolRecord.message.recordId, danielRecord.message.recordId]);
            }));
            it('should be able to filter by string prefix', () => __awaiter(this, void 0, void 0, function* () {
                var _p, _q;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // create two records that match the prefix 'string-'
                const tagsRecord1 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag: 'string-foo',
                    }
                });
                const tagsRecord2 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag: 'string-bar',
                    }
                });
                const tagsRecord1Reply = yield dwn.processMessage(alice.did, tagsRecord1.message, { dataStream: tagsRecord1.dataStream });
                expect(tagsRecord1Reply.status.code).to.equal(202);
                const tagsRecord2Reply = yield dwn.processMessage(alice.did, tagsRecord2.message, { dataStream: tagsRecord2.dataStream });
                expect(tagsRecord2Reply.status.code).to.equal(202);
                // control record that has a different prefix
                const tagsRecord3 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag: 'zaz-string', // comes after `string-` lexicographically
                    }
                });
                const tagsRecord3Reply = yield dwn.processMessage(alice.did, tagsRecord3.message, { dataStream: tagsRecord3.dataStream });
                expect(tagsRecord3Reply.status.code).to.equal(202);
                // a prefix search will return only the records matching the prefix
                const tagsQueryMatch = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            stringTag: { startsWith: 'string-' }
                        }
                    }
                });
                const tagsQueryMatchReply = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply.status.code).to.equal(200);
                expect((_p = tagsQueryMatchReply.entries) === null || _p === void 0 ? void 0 : _p.length).to.equal(2);
                const matchedRecords = tagsQueryMatchReply.entries.map(entry => entry.recordId);
                expect(matchedRecords).to.have.members([tagsRecord1.message.recordId, tagsRecord2.message.recordId]);
                // sanity/control: a regular range query will return all
                // since `zaz-string` comes lexicographically after `string-` it will appear in the result set
                const tagsQueryRange = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            stringTag: { gte: 'string-' } // range query instead of prefix
                        }
                    }
                });
                const tagsQueryRangeReply = yield dwn.processMessage(alice.did, tagsQueryRange.message);
                expect(tagsQueryRangeReply.status.code).to.equal(200);
                expect((_q = tagsQueryRangeReply.entries) === null || _q === void 0 ? void 0 : _q.length).to.equal(3); // returned all 3 records
            }));
            it('should be able to range filter by number value', () => __awaiter(this, void 0, void 0, function* () {
                var _r, _s, _t, _u, _v;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // create four records with different test scores
                const aliceRecord = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'test',
                    tags: {
                        firstName: 'alice',
                        score: 75,
                    }
                });
                const bobRecord = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'test',
                    tags: {
                        firstName: 'bob',
                        score: 80,
                    }
                });
                const carolRecord = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'test',
                    tags: {
                        firstName: 'carol',
                        score: 65,
                    }
                });
                const danielRecord = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'test',
                    tags: {
                        firstName: 'daniel',
                        score: 100,
                    }
                });
                const aliceReply = yield dwn.processMessage(alice.did, aliceRecord.message, { dataStream: aliceRecord.dataStream });
                expect(aliceReply.status.code).to.equal(202);
                const bobReply = yield dwn.processMessage(alice.did, bobRecord.message, { dataStream: bobRecord.dataStream });
                expect(bobReply.status.code).to.equal(202);
                const carolReply = yield dwn.processMessage(alice.did, carolRecord.message, { dataStream: carolRecord.dataStream });
                expect(carolReply.status.code).to.equal(202);
                const danielReply = yield dwn.processMessage(alice.did, danielRecord.message, { dataStream: danielRecord.dataStream });
                expect(danielReply.status.code).to.equal(202);
                // sanity query for all
                const queryForAll = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        schema: 'test'
                    }
                });
                const queryForAllReply = yield dwn.processMessage(alice.did, queryForAll.message);
                expect(queryForAllReply.status.code).to.equal(200);
                expect((_r = queryForAllReply.entries) === null || _r === void 0 ? void 0 : _r.length).to.equal(4); // all 4 records
                // query for all records that received higher than(not including) an 80
                // only one record should match
                const queryForHighGrade = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        schema: 'test',
                        tags: {
                            score: { gt: 80 }
                        }
                    }
                });
                const queryForHighReply = yield dwn.processMessage(alice.did, queryForHighGrade.message);
                expect(queryForHighReply.status.code).to.equal(200);
                expect((_s = queryForHighReply.entries) === null || _s === void 0 ? void 0 : _s.length).to.equal(1);
                expect(queryForHighReply.entries[0].recordId).to.equal(danielRecord.message.recordId);
                // query for all records that received higher (and including) a 75
                // three records should match
                const queryForPassingGrade = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        schema: 'test',
                        tags: {
                            score: { gte: 75 }
                        }
                    }
                });
                const queryForPassingGradeReply = yield dwn.processMessage(alice.did, queryForPassingGrade.message);
                expect(queryForPassingGradeReply.status.code).to.equal(200);
                expect((_t = queryForPassingGradeReply.entries) === null || _t === void 0 ? void 0 : _t.length).to.equal(3);
                const passingRecords = queryForPassingGradeReply.entries.map(entry => entry.recordId);
                expect(passingRecords).to.have.members([danielRecord.message.recordId, bobRecord.message.recordId, aliceRecord.message.recordId]);
                // query for poorly performing grades (65 and below, inclusive)
                const queryForPoorGrades = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        schema: 'test',
                        tags: {
                            score: { lte: 65 }
                        }
                    }
                });
                const queryForPoorGradesReply = yield dwn.processMessage(alice.did, queryForPoorGrades.message);
                expect(queryForPoorGradesReply.status.code).to.equal(200);
                expect((_u = queryForPoorGradesReply.entries) === null || _u === void 0 ? void 0 : _u.length).to.equal(1);
                expect(queryForPoorGradesReply.entries[0].recordId).to.equal(carolRecord.message.recordId);
                // query for passing grades that were not perfect scores
                const queryForRange = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        schema: 'test',
                        tags: {
                            score: { lt: 100, gte: 75 }
                        }
                    }
                });
                const queryForRangeReply = yield dwn.processMessage(alice.did, queryForRange.message);
                expect(queryForRangeReply.status.code).to.equal(200);
                expect((_v = queryForRangeReply.entries) === null || _v === void 0 ? void 0 : _v.length).to.equal(2);
                const rangeRecords = queryForRangeReply.entries.map(entry => entry.recordId);
                expect(rangeRecords).to.have.members([bobRecord.message.recordId, aliceRecord.message.recordId]);
            }));
            it('should return results based on the latest tag values', () => __awaiter(this, void 0, void 0, function* () {
                var _w, _x;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const tagsRecord1 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag: 'string-value',
                    }
                });
                const tagsRecord1Reply = yield dwn.processMessage(alice.did, tagsRecord1.message, { dataStream: tagsRecord1.dataStream });
                expect(tagsRecord1Reply.status.code).to.equal(202);
                const tagsQueryMatch = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            stringTag: 'string-value'
                        }
                    }
                });
                const tagsQueryMatchReply = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply.status.code).to.equal(200);
                expect((_w = tagsQueryMatchReply.entries) === null || _w === void 0 ? void 0 : _w.length).to.equal(1);
                expect(tagsQueryMatchReply.entries[0].recordId).to.equal(tagsRecord1.message.recordId);
                // update the record with new tags
                const updatedRecord = yield TestDataGenerator.generateFromRecordsWrite({
                    author: alice,
                    existingWrite: tagsRecord1.recordsWrite,
                    tags: { otherTag: 'other-value' } // new tags
                });
                const updatedRecordReply = yield dwn.processMessage(alice.did, updatedRecord.message, { dataStream: updatedRecord.dataStream });
                expect(updatedRecordReply.status.code).to.equal(202);
                // issuing the same query should return no results
                const tagsQueryMatchReply2 = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply2.status.code).to.equal(200);
                expect((_x = tagsQueryMatchReply2.entries) === null || _x === void 0 ? void 0 : _x.length).to.equal(0);
            }));
            it('should not return results if the record was updated with empty tags', () => __awaiter(this, void 0, void 0, function* () {
                var _y, _z;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                const tagsRecord1 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag: 'string-value',
                    }
                });
                const tagsRecord1Reply = yield dwn.processMessage(alice.did, tagsRecord1.message, { dataStream: tagsRecord1.dataStream });
                expect(tagsRecord1Reply.status.code).to.equal(202);
                const tagsQueryMatch = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            stringTag: 'string-value'
                        }
                    }
                });
                const tagsQueryMatchReply = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply.status.code).to.equal(200);
                expect((_y = tagsQueryMatchReply.entries) === null || _y === void 0 ? void 0 : _y.length).to.equal(1);
                expect(tagsQueryMatchReply.entries[0].recordId).to.equal(tagsRecord1.message.recordId);
                // update the record without any tags
                const updatedRecord = yield TestDataGenerator.generateFromRecordsWrite({
                    author: alice,
                    existingWrite: tagsRecord1.recordsWrite,
                });
                const updatedRecordReply = yield dwn.processMessage(alice.did, updatedRecord.message, { dataStream: updatedRecord.dataStream });
                expect(updatedRecordReply.status.code).to.equal(202);
                // issuing the same query should return no results
                const tagsQueryMatchReply2 = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply2.status.code).to.equal(200);
                expect((_z = tagsQueryMatchReply2.entries) === null || _z === void 0 ? void 0 : _z.length).to.equal(0);
            }));
        });
        describe('RecordsDelete with tags', () => {
            it('should delete record with tags', () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const alice = yield TestDataGenerator.generateDidKeyPersona();
                // create a record with a tag
                const tagsRecord1 = yield TestDataGenerator.generateRecordsWrite({
                    author: alice,
                    published: true,
                    schema: 'post',
                    tags: {
                        stringTag: 'string-value',
                    }
                });
                const tagsRecord1Reply = yield dwn.processMessage(alice.did, tagsRecord1.message, { dataStream: tagsRecord1.dataStream });
                expect(tagsRecord1Reply.status.code).to.equal(202);
                //sanity: query for the record
                const tagsQueryMatch = yield TestDataGenerator.generateRecordsQuery({
                    author: alice,
                    filter: {
                        tags: {
                            stringTag: 'string-value'
                        }
                    }
                });
                const tagsQueryMatchReply = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply.status.code).to.equal(200);
                expect((_a = tagsQueryMatchReply.entries) === null || _a === void 0 ? void 0 : _a.length).to.equal(1);
                expect(tagsQueryMatchReply.entries[0].recordId).to.equal(tagsRecord1.message.recordId);
                // delete the record
                const recordDelete = yield TestDataGenerator.generateRecordsDelete({
                    author: alice,
                    recordId: tagsRecord1.message.recordId,
                });
                const recordDeleteReply = yield dwn.processMessage(alice.did, recordDelete.message);
                expect(recordDeleteReply.status.code).to.equal(202);
                // issue the the same query should return no results
                const tagsQueryMatchReply2 = yield dwn.processMessage(alice.did, tagsQueryMatch.message);
                expect(tagsQueryMatchReply2.status.code).to.equal(200);
                expect((_b = tagsQueryMatchReply2.entries) === null || _b === void 0 ? void 0 : _b.length).to.equal(0);
            }));
        });
    });
}
//# sourceMappingURL=records-tags.spec.js.map