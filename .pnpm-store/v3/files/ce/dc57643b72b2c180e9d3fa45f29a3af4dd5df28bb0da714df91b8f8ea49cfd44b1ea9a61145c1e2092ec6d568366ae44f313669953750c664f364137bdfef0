var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Poller } from '../utils/poller.js';
import { TestEventStream } from '../test-event-stream.js';
import { Message, TestDataGenerator } from '../../src/index.js';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';
chai.use(chaiAsPromised);
// NOTE: We use `Poller.pollUntilSuccessOrTimeout` to poll for the expected results.
// In some cases, the EventStream is a coordinated pub/sub system and the messages/events are emitted over the network
// this means that the messages are not processed immediately and we need to wait for the messages to be processed
// before we can assert the results. The `pollUntilSuccessOrTimeout` function is a utility function that will poll until the expected results are met.
// It is also important to note that in some cases where we are testing a negative case (the message not arriving at the subscriber)
// we add an alternate subscription to await results within to give the EventStream ample time to process the message.
// Additionally in some of these cases the order in which messages are sent to be processed or checked may matter, and they are noted as such.
export function testEventStream() {
    describe('EventStream', () => {
        // saving the original `console.error` function to re-assign after tests complete
        const originalConsoleErrorFunction = console.error;
        let eventStream;
        before(() => __awaiter(this, void 0, void 0, function* () {
            eventStream = TestEventStream.get();
            yield eventStream.open();
            // do not print the console error statements from the emitter error
            console.error = (_) => { };
        }));
        beforeEach(() => {
            sinon.restore();
        });
        after(() => __awaiter(this, void 0, void 0, function* () {
            sinon.restore();
            console.error = originalConsoleErrorFunction;
            // Clean up after each test by closing and clearing the event stream
            yield eventStream.close();
        }));
        it('emits all messages to each subscriptions', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario: We create 2 separate subscriptions that listen to all messages
            // and we emit 3 messages. We expect both subscriptions to receive all 3 messages.
            const messageCids1 = [];
            const handler1 = (_tenant, event, _indexes) => __awaiter(this, void 0, void 0, function* () {
                const { message } = event;
                const messageCid = yield Message.getCid(message);
                messageCids1.push(messageCid);
            });
            const messageCids2 = [];
            const handler2 = (_tenant, event, _indexes) => __awaiter(this, void 0, void 0, function* () {
                const { message } = event;
                const messageCid = yield Message.getCid(message);
                messageCids2.push(messageCid);
            });
            const subscription1 = yield eventStream.subscribe('did:alice', 'sub-1', handler1);
            const subscription2 = yield eventStream.subscribe('did:alice', 'sub-2', handler2);
            const message1 = yield TestDataGenerator.generateRecordsWrite({});
            const message1Cid = yield Message.getCid(message1.message);
            eventStream.emit('did:alice', { message: message1.message }, {});
            const message2 = yield TestDataGenerator.generateRecordsWrite({});
            const message2Cid = yield Message.getCid(message2.message);
            eventStream.emit('did:alice', { message: message2.message }, {});
            const message3 = yield TestDataGenerator.generateRecordsWrite({});
            const message3Cid = yield Message.getCid(message3.message);
            eventStream.emit('did:alice', { message: message3.message }, {});
            // Use the Poller to poll until the expected results are met
            yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                expect(messageCids1).to.have.members([message1Cid, message2Cid, message3Cid]);
                expect(messageCids2).to.have.members([message1Cid, message2Cid, message3Cid]);
            }));
            yield subscription1.close();
            yield subscription2.close();
        }));
        it('does not receive messages if subscription is closed', () => __awaiter(this, void 0, void 0, function* () {
            // Scenario: We create two subscriptions that listen to all messages.
            //           The reason we create two is in order to allow for a negative test case.
            //           We send a message, validate that both handlers processed the message
            //           We then close one of the subscriptions, and send another message.
            //           Now we validate that only the handler of the subscription that is still open received the message.
            const sub1MessageCids = [];
            const handler1 = (_tenant, event, _indexes) => __awaiter(this, void 0, void 0, function* () {
                const { message } = event;
                const messageCid = yield Message.getCid(message);
                sub1MessageCids.push(messageCid);
            });
            const sub2MessageCids = [];
            const handler2 = (_tenant, event, _indexes) => __awaiter(this, void 0, void 0, function* () {
                const { message } = event;
                const messageCid = yield Message.getCid(message);
                sub2MessageCids.push(messageCid);
            });
            const subscription1 = yield eventStream.subscribe('did:alice', 'sub-1', handler1);
            const subscription2 = yield eventStream.subscribe('did:alice', 'sub-2', handler2);
            const message1 = yield TestDataGenerator.generateRecordsWrite({});
            const message1Cid = yield Message.getCid(message1.message);
            eventStream.emit('did:alice', { message: message1.message }, {});
            // Use the Poller to poll until the expected results are met
            yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                expect(sub1MessageCids).to.have.length(1);
                expect(sub1MessageCids).to.have.members([message1Cid]);
                expect(sub2MessageCids).to.have.length(1);
                expect(sub2MessageCids).to.have.members([message1Cid]);
            }));
            yield subscription1.close(); // close subscription 1
            const message2 = yield TestDataGenerator.generateRecordsWrite({});
            const message2Cid = yield Message.getCid(message2.message);
            eventStream.emit('did:alice', { message: message2.message }, {});
            // Use the Poller to poll until the expected results are met
            yield Poller.pollUntilSuccessOrTimeout(() => __awaiter(this, void 0, void 0, function* () {
                // subscription 2 should have received the message
                expect(sub2MessageCids.length).to.equal(2);
                expect(sub2MessageCids).to.have.members([message1Cid, message2Cid]);
                // subscription 1 should not have received the message
                expect(sub1MessageCids).to.have.length(1);
                expect(sub1MessageCids).to.have.members([message1Cid]);
            }));
            yield subscription2.close();
        }));
    });
}
//# sourceMappingURL=event-stream.spec.js.map