var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { authenticate } from '../core/auth.js';
import { Cid } from '../utils/cid.js';
import { DataStream } from '../utils/data-stream.js';
import { DwnConstant } from '../core/dwn-constant.js';
import { Encoder } from '../utils/encoder.js';
import { Message } from '../core/message.js';
import { messageReplyFromError } from '../core/message-reply.js';
import { PermissionsProtocol } from '../protocols/permissions.js';
import { ProtocolAuthorization } from '../core/protocol-authorization.js';
import { RecordsGrantAuthorization } from '../core/records-grant-authorization.js';
import { RecordsWrite } from '../interfaces/records-write.js';
import { StorageController } from '../store/storage-controller.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
export class RecordsWriteHandler {
    constructor(didResolver, messageStore, dataStore, eventLog, eventStream) {
        this.didResolver = didResolver;
        this.messageStore = messageStore;
        this.dataStore = dataStore;
        this.eventLog = eventLog;
        this.eventStream = eventStream;
    }
    handle({ tenant, message, dataStream }) {
        return __awaiter(this, void 0, void 0, function* () {
            let recordsWrite;
            try {
                recordsWrite = yield RecordsWrite.parse(message);
                // Protocol-authorized record specific validation
                if (message.descriptor.protocol !== undefined) {
                    yield ProtocolAuthorization.validateReferentialIntegrity(tenant, recordsWrite, this.messageStore);
                }
            }
            catch (e) {
                return messageReplyFromError(e, 400);
            }
            // authentication & authorization
            try {
                yield authenticate(message.authorization, this.didResolver);
                yield RecordsWriteHandler.authorizeRecordsWrite(tenant, recordsWrite, this.messageStore);
            }
            catch (e) {
                return messageReplyFromError(e, 401);
            }
            // get existing messages matching the `recordId`
            const query = {
                interface: DwnInterfaceName.Records,
                recordId: message.recordId
            };
            const { messages: existingMessages } = yield this.messageStore.query(tenant, [query]);
            // if the incoming write is not the initial write, then it must not modify any immutable properties defined by the initial write
            const newMessageIsInitialWrite = yield recordsWrite.isInitialWrite();
            let initialWrite;
            if (!newMessageIsInitialWrite) {
                try {
                    initialWrite = yield RecordsWrite.getInitialWrite(existingMessages);
                    RecordsWrite.verifyEqualityOfImmutableProperties(initialWrite, message);
                }
                catch (e) {
                    return messageReplyFromError(e, 400);
                }
            }
            const newestExistingMessage = yield Message.getNewestMessage(existingMessages);
            let incomingMessageIsNewest = false;
            let newestMessage; // keep reference of newest message for pruning later
            if (newestExistingMessage === undefined || (yield Message.isNewer(message, newestExistingMessage))) {
                incomingMessageIsNewest = true;
                newestMessage = message;
            }
            else { // existing message is the same age or newer than the incoming message
                newestMessage = newestExistingMessage;
            }
            if (!incomingMessageIsNewest) {
                return {
                    status: { code: 409, detail: 'Conflict' }
                };
            }
            try {
                if ((newestExistingMessage === null || newestExistingMessage === void 0 ? void 0 : newestExistingMessage.descriptor.method) === DwnMethodName.Delete) {
                    throw new DwnError(DwnErrorCode.RecordsWriteNotAllowedAfterDelete, 'RecordsWrite is not allowed after a RecordsDelete.');
                }
                // NOTE: We want to perform additional validation before storing the RecordsWrite.
                // This is necessary for core DWN RecordsWrite that needs additional processing and allows us to fail before the storing and post processing.
                //
                // Example: Ensures that the protocol tag of a permission revocation RecordsWrite and the parent grant's scoped protocol match.
                yield this.preProcessingForCoreRecordsWrite(tenant, message);
                // NOTE: We allow isLatestBaseState to be true ONLY if the incoming message comes with data, or if the incoming message is NOT an initial write
                // This would allow an initial write to be written to the DB without data, but having it not queryable,
                // because query implementation filters on `isLatestBaseState` being `true`
                // thus preventing a user's attempt to gain authorized access to data by referencing the dataCid of a private data in their initial writes,
                // See: https://github.com/TBD54566975/dwn-sdk-js/issues/359 for more info
                let isLatestBaseState = false;
                let messageWithOptionalEncodedData = message;
                if (dataStream !== undefined) {
                    messageWithOptionalEncodedData = yield this.processMessageWithDataStream(tenant, message, dataStream);
                    isLatestBaseState = true;
                }
                else {
                    // else data stream is NOT provided
                    // if the incoming message is not an initial write, and no dataStream is provided, we would allow it provided it passes validation
                    // processMessageWithoutDataStream() abstracts that logic
                    if (!newMessageIsInitialWrite) {
                        const newestExistingWrite = newestExistingMessage;
                        messageWithOptionalEncodedData = yield this.processMessageWithoutDataStream(tenant, message, newestExistingWrite);
                        isLatestBaseState = true;
                    }
                }
                const indexes = yield recordsWrite.constructIndexes(isLatestBaseState);
                yield this.messageStore.put(tenant, messageWithOptionalEncodedData, indexes);
                yield this.eventLog.append(tenant, yield Message.getCid(message), indexes);
                // NOTE: We only emit a `RecordsWrite` when the message is the latest base state.
                // Because we allow a `RecordsWrite` which is not the latest state to be written, but not queried, we shouldn't emit it either.
                // It will be emitted as a part of a subsequent next write, if it is the latest base state.
                if (this.eventStream !== undefined && isLatestBaseState) {
                    this.eventStream.emit(tenant, { message, initialWrite }, indexes);
                }
            }
            catch (error) {
                const e = error;
                if (e.code !== undefined) {
                    if (e.code === DwnErrorCode.RecordsWriteMissingEncodedDataInPrevious ||
                        e.code === DwnErrorCode.RecordsWriteMissingDataInPrevious ||
                        e.code === DwnErrorCode.RecordsWriteNotAllowedAfterDelete ||
                        e.code === DwnErrorCode.RecordsWriteDataCidMismatch ||
                        e.code === DwnErrorCode.RecordsWriteDataSizeMismatch ||
                        e.code.startsWith('PermissionsProtocolValidate') ||
                        e.code.startsWith('SchemaValidator')) {
                        return messageReplyFromError(error, 400);
                    }
                }
                // else throw
                throw error;
            }
            const messageReply = {
                // In order to discern between something that was accepted as a queryable write and something that was accepted
                // as an initial state we use separate response codes. See https://github.com/TBD54566975/dwn-sdk-js/issues/695
                // for more details.
                status: (newMessageIsInitialWrite && dataStream === undefined) ?
                    { code: 204, detail: 'No Content' } :
                    { code: 202, detail: 'Accepted' }
            };
            // delete all existing messages of the same record that are not newest, except for the initial write
            yield StorageController.deleteAllOlderMessagesButKeepInitialWrite(tenant, existingMessages, newestMessage, this.messageStore, this.dataStore, this.eventLog);
            yield this.postProcessingForCoreRecordsWrite(tenant, recordsWrite);
            return messageReply;
        });
    }
    ;
    /**
     * Performs additional necessary validation before storing the RecordsWrite if it is a core DWN RecordsWrite that needs additional processing.
     * For instance: a Permission revocation RecordsWrite.
     */
    preProcessingForCoreRecordsWrite(tenant, recordsWriteMessage) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // we validate the protocol tag of the revocation message against the grant's scoped protocol
            // to do this we will fetch the grant, and compare the the scoped protocol value to the protocol tag of the revocation message
            if (recordsWriteMessage.descriptor.protocol === PermissionsProtocol.uri &&
                recordsWriteMessage.descriptor.protocolPath === PermissionsProtocol.revocationPath) {
                // get the parentId of the revocation message, which is the permissionGrantId
                // fetch the grant in order to get the grant's protocol
                const permissionGrantId = recordsWriteMessage.descriptor.parentId;
                const grant = yield PermissionsProtocol.fetchGrant(tenant, this.messageStore, permissionGrantId);
                // get the protocol values of the revocation message from the protocol tag and the protocol from the grant scope if they are defined
                // compare the two values ensuring they must match
                const revokeTagProtocol = (_a = recordsWriteMessage.descriptor.tags) === null || _a === void 0 ? void 0 : _a.protocol;
                const grantProtocol = 'protocol' in grant.scope ? grant.scope.protocol : undefined;
                if (grantProtocol !== revokeTagProtocol) {
                    throw new DwnError(DwnErrorCode.PermissionsProtocolValidateRevocationProtocolTagMismatch, `Revocation protocol ${revokeTagProtocol} does not match grant protocol ${grantProtocol}`);
                }
            }
        });
    }
    static validateSchemaForCoreRecordsWrite(recordsWriteMessage, dataBytes) {
        if (recordsWriteMessage.descriptor.protocol === PermissionsProtocol.uri) {
            PermissionsProtocol.validateSchema(recordsWriteMessage, dataBytes);
        }
    }
    /**
     * Performs additional necessary tasks if the RecordsWrite handled is a core DWN RecordsWrite that need additional processing.
     * For instance: a Permission revocation RecordsWrite.
     */
    postProcessingForCoreRecordsWrite(tenant, recordsWrite) {
        return __awaiter(this, void 0, void 0, function* () {
            // If this message is a Permission revocation, we need to delete all grant-authorized messages with timestamp after revocation
            // TODO: https://github.com/TBD54566975/dwn-sdk-js/issues/716
            // This code is a direct copy and paste from the original PermissionsRevokeHandler (no longer exists),
            // but it appears that there was no test for it and it does not look like the code worked:
            // - not seeing `permissionGrantId` being an index
            // - not seeing `this.dataStore` being called to delete actual data
            // - test coverage is missing for the main delete logic
            if (recordsWrite.message.descriptor.protocol === PermissionsProtocol.uri &&
                recordsWrite.message.descriptor.protocolPath === PermissionsProtocol.revocationPath) {
                const permissionGrantId = recordsWrite.message.descriptor.parentId;
                const grantAuthorizedMessagesQuery = {
                    permissionGrantId,
                    dateCreated: { gte: recordsWrite.message.descriptor.messageTimestamp },
                };
                const { messages: grantAuthorizedMessagesAfterRevoke } = yield this.messageStore.query(tenant, [grantAuthorizedMessagesQuery]);
                const grantAuthorizedMessageCidsAfterRevoke = [];
                for (const grantAuthorizedMessage of grantAuthorizedMessagesAfterRevoke) {
                    const messageCid = yield Message.getCid(grantAuthorizedMessage);
                    yield this.messageStore.delete(tenant, messageCid);
                }
                this.eventLog.deleteEventsByCid(tenant, grantAuthorizedMessageCidsAfterRevoke);
            }
        });
    }
    /**
     * Returns a `RecordsQueryReplyEntry` with a copy of the incoming message and the incoming data encoded to `Base64URL`.
     */
    cloneAndAddEncodedData(message, dataBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const recordsWrite = Object.assign({}, message);
            recordsWrite.encodedData = Encoder.bytesToBase64Url(dataBytes);
            return recordsWrite;
        });
    }
    processMessageWithDataStream(tenant, message, dataStream) {
        return __awaiter(this, void 0, void 0, function* () {
            let messageWithOptionalEncodedData = message;
            // if data is below the threshold, we store it within MessageStore
            if (message.descriptor.dataSize <= DwnConstant.maxDataSizeAllowedToBeEncoded) {
                // validate data integrity before setting.
                const dataBytes = yield DataStream.toBytes(dataStream);
                const dataCid = yield Cid.computeDagPbCidFromBytes(dataBytes);
                RecordsWriteHandler.validateDataIntegrity(message.descriptor.dataCid, message.descriptor.dataSize, dataCid, dataBytes.length);
                RecordsWriteHandler.validateSchemaForCoreRecordsWrite(message, dataBytes);
                messageWithOptionalEncodedData = yield this.cloneAndAddEncodedData(message, dataBytes);
            }
            else {
                // split the dataStream into two: one for CID computation and one for storage
                const [dataStreamCopy1, dataStreamCopy2] = DataStream.duplicateDataStream(dataStream, 2);
                try {
                    // perform storage and CID computation in parallel
                    const [dataCid, DataStorePutResult] = yield Promise.all([
                        Cid.computeDagPbCidFromStream(dataStreamCopy1),
                        this.dataStore.put(tenant, message.recordId, message.descriptor.dataCid, dataStreamCopy2)
                    ]);
                    RecordsWriteHandler.validateDataIntegrity(message.descriptor.dataCid, message.descriptor.dataSize, dataCid, DataStorePutResult.dataSize);
                }
                catch (error) {
                    // unwind/delete data if we have issue with storage or the data failed integrity validation
                    yield this.dataStore.delete(tenant, message.recordId, message.descriptor.dataCid);
                    throw error;
                }
            }
            return messageWithOptionalEncodedData;
        });
    }
    processMessageWithoutDataStream(tenant, message, newestExistingWrite) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageWithOptionalEncodedData = Object.assign({}, message); // clone
            const { dataCid, dataSize } = message.descriptor;
            // Since incoming message is not an initial write, and no dataStream is provided, we first check integrity against newest existing write.
            // we preform the dataCid check in case a user attempts to gain access to data by referencing a different known dataCid,
            // so we insure that the data is already associated with the existing newest message
            // See: https://github.com/TBD54566975/dwn-sdk-js/issues/359 for more info
            RecordsWriteHandler.validateDataIntegrity(dataCid, dataSize, newestExistingWrite.descriptor.dataCid, newestExistingWrite.descriptor.dataSize);
            if (dataSize <= DwnConstant.maxDataSizeAllowedToBeEncoded) {
                // we encode the data from the original write if it is smaller than the data-store threshold
                if (newestExistingWrite.encodedData !== undefined) {
                    messageWithOptionalEncodedData.encodedData = newestExistingWrite.encodedData;
                }
                else {
                    throw new DwnError(DwnErrorCode.RecordsWriteMissingEncodedDataInPrevious, `No dataStream was provided and unable to get data from previous message`);
                }
            }
            else {
                // else just make sure the data is in the data store
                // attempt to retrieve the data from the previous message
                const DataStoreGetResult = yield this.dataStore.get(tenant, newestExistingWrite.recordId, message.descriptor.dataCid);
                if (DataStoreGetResult === undefined) {
                    throw new DwnError(DwnErrorCode.RecordsWriteMissingDataInPrevious, `No dataStream was provided and unable to get data from previous message`);
                }
            }
            return messageWithOptionalEncodedData;
        });
    }
    /**
     * Validates the expected `dataCid` and `dataSize` in the descriptor vs the received data.
     *
     * @throws {DwnError} with `DwnErrorCode.RecordsWriteDataCidMismatch`
     *                    if the data stream resulted in a data CID that mismatches with `dataCid` in the given message
     * @throws {DwnError} with `DwnErrorCode.RecordsWriteDataSizeMismatch`
     *                    if `dataSize` in `descriptor` given mismatches the actual data size
     */
    static validateDataIntegrity(expectedDataCid, expectedDataSize, actualDataCid, actualDataSize) {
        if (expectedDataCid !== actualDataCid) {
            throw new DwnError(DwnErrorCode.RecordsWriteDataCidMismatch, `actual data CID ${actualDataCid} does not match dataCid in descriptor: ${expectedDataCid}`);
        }
        if (expectedDataSize !== actualDataSize) {
            throw new DwnError(DwnErrorCode.RecordsWriteDataSizeMismatch, `actual data size ${actualDataSize} bytes does not match dataSize in descriptor: ${expectedDataSize}`);
        }
    }
    static authorizeRecordsWrite(tenant, recordsWrite, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            // if owner signature is given (`owner` is not `undefined`), it must be the same as the tenant DID
            if (recordsWrite.owner !== undefined && recordsWrite.owner !== tenant) {
                throw new DwnError(DwnErrorCode.RecordsWriteOwnerAndTenantMismatch, `Owner ${recordsWrite.owner} must be the same as tenant ${tenant} when specified.`);
            }
            if (recordsWrite.isSignedByAuthorDelegate) {
                yield recordsWrite.authorizeAuthorDelegate(messageStore);
            }
            if (recordsWrite.isSignedByOwnerDelegate) {
                yield recordsWrite.authorizeOwnerDelegate(messageStore);
            }
            if (recordsWrite.owner !== undefined) {
                // if incoming message is a write retained by this tenant, we by-design always allow
                // NOTE: the "owner === tenant" check is already done earlier in this method
                return;
            }
            else if (recordsWrite.author === tenant) {
                // if author is the same as the target tenant, we can directly grant access
                return;
            }
            else if (recordsWrite.author !== undefined && recordsWrite.signaturePayload.permissionGrantId !== undefined) {
                const permissionGrant = yield PermissionsProtocol.fetchGrant(tenant, messageStore, recordsWrite.signaturePayload.permissionGrantId);
                yield RecordsGrantAuthorization.authorizeWrite({
                    recordsWriteMessage: recordsWrite.message,
                    expectedGrantor: tenant,
                    expectedGrantee: recordsWrite.author,
                    permissionGrant,
                    messageStore
                });
            }
            else if (recordsWrite.message.descriptor.protocol !== undefined) {
                yield ProtocolAuthorization.authorizeWrite(tenant, recordsWrite, messageStore);
            }
            else {
                throw new DwnError(DwnErrorCode.RecordsWriteAuthorizationFailed, 'message failed authorization');
            }
        });
    }
}
//# sourceMappingURL=records-write.js.map