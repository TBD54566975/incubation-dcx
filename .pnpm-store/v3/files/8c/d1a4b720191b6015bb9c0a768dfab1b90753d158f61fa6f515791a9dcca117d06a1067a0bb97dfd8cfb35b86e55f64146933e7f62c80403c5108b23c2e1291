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
import slackProtocolDefinition from '../vectors/protocol-definitions/slack.json' assert { type: 'json' };
import chai, { expect } from 'chai';
import { Dwn } from '../../src/dwn.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { Jws } from '../../src/utils/jws.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';
import { TestEventStream } from '../test-event-stream.js';
import { TestStores } from '../test-stores.js';
import { DidKey, UniversalResolver } from '@web5/dids';
import { RecordsQuery, RecordsRead } from '../../src/index.js';
chai.use(chaiAsPromised);
export function testNestedRoleScenarios() {
    describe('Nested role scenarios', () => {
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
        it('should support Slack-like protocol with community and gated channels', () => __awaiter(this, void 0, void 0, function* () {
            // scenario:
            // 1. Alice installs the Slack-like protocol
            // 2. Alice creates a community
            // 3. Alice can assign Bob as an `admin` in the community
            // 4. Bob can invoke his `admin` role to perform actions:
            //   4a. Bob can read the community record
            //   4b. Bob can create gated-channels 1 & 2 in the community
            // 5. Bob as the creator/author of the channels can add participants in the gated-channels
            //   5a. Bob can add himself and Carol as participants in the gated-channel 1
            //   5b. Bob can add himself and Daniel as participants in the gated-channel 2
            // 6. Carol can read the gated channel 2 record by invoking her child participant role to the gated channel 2
            // 7. Carol CANNOT add anyone as a participant in the gated-channel 2 since she is not a participant in the channel
            // 8. Carol CANNOT add Daniel as another participant in the gated-channel without invoking her role
            // 9. Carol can invoke her participant role to add Daniel as another participant in the gated-channel
            // 10. Bob can invoke the participant role to write a chat message in the channel
            // 11. Carol can invoke the participant role to read chat messages in the channel
            // 12. Carol can invoke the participant role to react to Bob's chat message in the channel
            // 13. Mallory CANNOT invoke the participant role (which she is not given) to read the chat messages in the channel
            // 14. Mallory CANNOT invoke the participant role (which she is not given) to write a chat message in the channel
            var _a, _b, _c;
            const alice = yield TestDataGenerator.generateDidKeyPersona();
            const bob = yield TestDataGenerator.generateDidKeyPersona();
            const carol = yield TestDataGenerator.generateDidKeyPersona();
            const daniel = yield TestDataGenerator.generateDidKeyPersona();
            const mallory = yield TestDataGenerator.generateDidKeyPersona(); // unauthorized person
            const protocolDefinition = slackProtocolDefinition;
            // 1. Alice installs the Slack-like protocol
            const protocolsConfig = yield TestDataGenerator.generateProtocolsConfigure({
                author: alice,
                protocolDefinition
            });
            const protocolsConfigureReply = yield dwn.processMessage(alice.did, protocolsConfig.message);
            expect(protocolsConfigureReply.status.code).to.equal(202);
            // 2. Alice creates a community
            const communityRecord = yield TestDataGenerator.generateRecordsWrite({
                author: alice,
                protocol: protocolDefinition.protocol,
                protocolPath: 'community'
            });
            const communityRecordReply = yield dwn.processMessage(alice.did, communityRecord.message, { dataStream: communityRecord.dataStream });
            expect(communityRecordReply.status.code).to.equal(202);
            // 3. Alice can assign Bob as an 'admin' in the community
            const communityAdminBobRecord = yield TestDataGenerator.generateRecordsWrite({
                author: alice,
                recipient: bob.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'community/admin',
                parentContextId: communityRecord.message.contextId,
            });
            const communityAdminBobRecordReply = yield dwn.processMessage(alice.did, communityAdminBobRecord.message, { dataStream: communityAdminBobRecord.dataStream });
            expect(communityAdminBobRecordReply.status.code).to.equal(202);
            // 4. Bob can invoke his `admin` role to perform actions:
            //   4a. Bob can read the community record
            const bobCommunityRead = yield RecordsRead.create({
                signer: Jws.createSigner(bob),
                protocolRole: 'community/admin',
                filter: {
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'community',
                    contextId: communityRecord.message.contextId
                }
            });
            const bobCommunityReadReply = yield dwn.processMessage(alice.did, bobCommunityRead.message);
            expect(bobCommunityReadReply.status.code).to.equal(200);
            expect((_a = bobCommunityReadReply.record) === null || _a === void 0 ? void 0 : _a.recordId).to.equal(communityRecord.message.recordId);
            //   4b. Bob can create gated-channels 1 & 2 in the community
            const channel1Record = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolRole: 'community/admin',
                protocolPath: 'community/gatedChannel',
                parentContextId: communityRecord.message.contextId
            });
            const channel1RecordReply = yield dwn.processMessage(alice.did, channel1Record.message, { dataStream: channel1Record.dataStream });
            expect(channel1RecordReply.status.code).to.equal(202);
            const channel2Record = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolRole: 'community/admin',
                protocolPath: 'community/gatedChannel',
                parentContextId: communityRecord.message.contextId
            });
            const channel2RecordReply = yield dwn.processMessage(alice.did, channel2Record.message, { dataStream: channel2Record.dataStream });
            expect(channel2RecordReply.status.code).to.equal(202);
            // 5. Bob as the creator/author of the channels can  add participants in the gated-channels
            // 5a. Bob can add himself and Carol as participants in the gated-channel 1
            const channel1ParticipantBobRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: bob.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'community/gatedChannel/participant',
                parentContextId: channel1Record.message.contextId,
            });
            const channel1ParticipantBobRecordReply = yield dwn.processMessage(alice.did, channel1ParticipantBobRecord.message, { dataStream: channel1ParticipantBobRecord.dataStream });
            expect(channel1ParticipantBobRecordReply.status.code).to.equal(202);
            const channel1ParticipantCarolRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: carol.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'community/gatedChannel/participant',
                parentContextId: channel1Record.message.contextId,
            });
            const channel1ParticipantCarolRecordReply = yield dwn.processMessage(alice.did, channel1ParticipantCarolRecord.message, { dataStream: channel1ParticipantCarolRecord.dataStream });
            expect(channel1ParticipantCarolRecordReply.status.code).to.equal(202);
            // 5b. Bob can add himself and Daniel as participants in the gated-channel 2
            const channel2ParticipantBobRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: bob.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'community/gatedChannel/participant',
                parentContextId: channel2Record.message.contextId,
            });
            const channel2ParticipantBobRecordReply = yield dwn.processMessage(alice.did, channel2ParticipantBobRecord.message, { dataStream: channel2ParticipantBobRecord.dataStream });
            expect(channel2ParticipantBobRecordReply.status.code).to.equal(202);
            const channel2ParticipantDanielRecord = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                recipient: daniel.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'community/gatedChannel/participant',
                parentContextId: channel2Record.message.contextId,
            });
            const channel2ParticipantDanielRecordReply = yield dwn.processMessage(alice.did, channel2ParticipantDanielRecord.message, { dataStream: channel2ParticipantDanielRecord.dataStream });
            expect(channel2ParticipantDanielRecordReply.status.code).to.equal(202);
            // 6. Carol can read the gated channel 1 record by invoking her child participant role to the gated channel 1
            const carolRead = yield RecordsRead.create({
                signer: Jws.createSigner(carol),
                protocolRole: 'community/gatedChannel/participant',
                filter: {
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'community/gatedChannel',
                    contextId: channel1Record.message.contextId
                }
            });
            const carolReadReply = yield dwn.processMessage(alice.did, carolRead.message);
            expect(carolReadReply.status.code).to.equal(200);
            expect((_b = carolReadReply.record) === null || _b === void 0 ? void 0 : _b.recordId).to.equal(channel1Record.message.recordId);
            // 7. Carol CANNOT add anyone as a participant in the gated-channel 2 since she is not a participant in the channel
            const participantCarolRecord = yield TestDataGenerator.generateRecordsWrite({
                author: carol,
                recipient: carol.did,
                protocol: protocolDefinition.protocol,
                protocolRole: 'community/gatedChannel/participant',
                protocolPath: 'community/gatedChannel/participant',
                parentContextId: channel2Record.message.contextId
            });
            const participantCarolRecordReply = yield dwn.processMessage(alice.did, participantCarolRecord.message, { dataStream: participantCarolRecord.dataStream });
            expect(participantCarolRecordReply.status.code).to.equal(401);
            expect(participantCarolRecordReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationMatchingRoleRecordNotFound);
            // 8. Carol CANNOT add Daniel as another participant in the gated-channel without invoking her role
            const participantDanielRecordAttempt1 = yield TestDataGenerator.generateRecordsWrite({
                author: carol,
                recipient: daniel.did,
                protocol: protocolDefinition.protocol,
                protocolPath: 'community/gatedChannel/participant',
                parentContextId: channel1Record.message.contextId,
            });
            const participantDanielRecordAttempt1Reply = yield dwn.processMessage(alice.did, participantDanielRecordAttempt1.message, { dataStream: participantDanielRecordAttempt1.dataStream });
            expect(participantDanielRecordAttempt1Reply.status.code).to.equal(401);
            expect(participantDanielRecordAttempt1Reply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationActionNotAllowed);
            // 9. Carol can invoke her participant role to add Daniel as another participant in the gated-channel
            const participantDanielRecordAttempt2 = yield TestDataGenerator.generateRecordsWrite({
                author: carol,
                recipient: daniel.did,
                protocol: protocolDefinition.protocol,
                protocolRole: 'community/gatedChannel/participant',
                protocolPath: 'community/gatedChannel/participant',
                parentContextId: channel1Record.message.contextId,
            });
            const participantDanielRecordAttempt2Reply = yield dwn.processMessage(alice.did, participantDanielRecordAttempt2.message, { dataStream: participantDanielRecordAttempt2.dataStream });
            expect(participantDanielRecordAttempt2Reply.status.code).to.equal(202);
            // 10. Bob can invoke the participant role to write a chat message in the channel
            const bobChatMessage = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolRole: 'community/gatedChannel/participant',
                protocolPath: 'community/gatedChannel/message',
                parentContextId: channel1Record.message.contextId
            });
            const bobChatMessageReply = yield dwn.processMessage(alice.did, bobChatMessage.message, { dataStream: bobChatMessage.dataStream });
            expect(bobChatMessageReply.status.code).to.equal(202);
            // 11. Carol can invoke the participant role to read chat messages in the channel
            const carolQuery = yield RecordsQuery.create({
                signer: Jws.createSigner(carol),
                protocolRole: 'community/gatedChannel/participant',
                filter: {
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'community/gatedChannel/message',
                    contextId: channel1Record.message.contextId
                }
            });
            const carolQueryReply = yield dwn.processMessage(alice.did, carolQuery.message);
            expect(carolQueryReply.status.code).to.equal(200);
            expect((_c = carolQueryReply.entries) === null || _c === void 0 ? void 0 : _c[0].recordId).to.equal(bobChatMessage.message.recordId);
            // 12. Carol can invoke the participant role to react to Bob's chat message in the channel
            const carolReaction = yield TestDataGenerator.generateRecordsWrite({
                author: bob,
                protocol: protocolDefinition.protocol,
                protocolRole: 'community/gatedChannel/participant',
                protocolPath: 'community/gatedChannel/message/reaction',
                parentContextId: bobChatMessage.message.contextId
            });
            const carolReactionReply = yield dwn.processMessage(alice.did, carolReaction.message, { dataStream: carolReaction.dataStream });
            expect(carolReactionReply.status.code).to.equal(202);
            // 13. Mallory CANNOT invoke the participant role (which she is not given) to read the chat messages in the channel
            const malloryQuery = yield RecordsQuery.create({
                signer: Jws.createSigner(mallory),
                protocolRole: 'community/gatedChannel/participant',
                filter: {
                    protocol: protocolDefinition.protocol,
                    protocolPath: 'community/gatedChannel/message',
                    contextId: channel1Record.message.contextId
                }
            });
            const malloryQueryReply = yield dwn.processMessage(alice.did, malloryQuery.message);
            expect(malloryQueryReply.status.code).to.equal(401);
            expect(malloryQueryReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationMatchingRoleRecordNotFound);
            // 14. Mallory CANNOT invoke the participant role (which she is not given) to write a chat message in the channel
            const malloryChatMessage = yield TestDataGenerator.generateRecordsWrite({
                author: mallory,
                protocol: protocolDefinition.protocol,
                protocolRole: 'community/gatedChannel/participant',
                protocolPath: 'community/gatedChannel/message',
                parentContextId: channel1Record.message.contextId
            });
            const malloryChatMessageReply = yield dwn.processMessage(alice.did, malloryChatMessage.message, { dataStream: malloryChatMessage.dataStream });
            expect(malloryChatMessageReply.status.code).to.equal(401);
            expect(malloryChatMessageReply.status.detail).to.contain(DwnErrorCode.ProtocolAuthorizationMatchingRoleRecordNotFound);
        }));
    });
}
//# sourceMappingURL=nested-roles.spec.js.map