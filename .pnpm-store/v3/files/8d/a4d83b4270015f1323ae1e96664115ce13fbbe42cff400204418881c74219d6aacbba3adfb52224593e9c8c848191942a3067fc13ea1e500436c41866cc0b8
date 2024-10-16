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
import { DataStream } from '../utils/data-stream.js';
import { Encoder } from '../utils/encoder.js';
import { Message } from '../core/message.js';
import { messageReplyFromError } from '../core/message-reply.js';
import { PermissionsProtocol } from '../protocols/permissions.js';
import { ProtocolAuthorization } from '../core/protocol-authorization.js';
import { Records } from '../utils/records.js';
import { RecordsGrantAuthorization } from '../core/records-grant-authorization.js';
import { RecordsRead } from '../interfaces/records-read.js';
import { RecordsWrite } from '../interfaces/records-write.js';
import { DwnError, DwnErrorCode } from '../core/dwn-error.js';
import { DwnInterfaceName, DwnMethodName } from '../enums/dwn-interface-method.js';
export class RecordsReadHandler {
    constructor(didResolver, messageStore, dataStore) {
        this.didResolver = didResolver;
        this.messageStore = messageStore;
        this.dataStore = dataStore;
    }
    handle({ tenant, message }) {
        return __awaiter(this, void 0, void 0, function* () {
            let recordsRead;
            try {
                recordsRead = yield RecordsRead.parse(message);
            }
            catch (e) {
                return messageReplyFromError(e, 400);
            }
            // authentication
            try {
                if (recordsRead.author !== undefined) {
                    yield authenticate(message.authorization, this.didResolver);
                }
            }
            catch (e) {
                return messageReplyFromError(e, 401);
            }
            // get the latest active messages matching the supplied filter
            // only RecordsWrite messages will be returned due to 'isLatestBaseState' being set to true.
            const query = Object.assign({ interface: DwnInterfaceName.Records, isLatestBaseState: true }, Records.convertFilter(message.descriptor.filter));
            const { messages: existingMessages } = yield this.messageStore.query(tenant, [query]);
            if (existingMessages.length === 0) {
                return {
                    status: { code: 404, detail: 'Not Found' }
                };
            }
            else if (existingMessages.length > 1) {
                return messageReplyFromError(new DwnError(DwnErrorCode.RecordsReadReturnedMultiple, 'Multiple records exist for the RecordsRead filter'), 400);
            }
            const matchedRecordsWrite = existingMessages[0];
            try {
                yield RecordsReadHandler.authorizeRecordsRead(tenant, recordsRead, yield RecordsWrite.parse(matchedRecordsWrite), this.messageStore);
            }
            catch (error) {
                return messageReplyFromError(error, 401);
            }
            let data;
            if (matchedRecordsWrite.encodedData !== undefined) {
                const dataBytes = Encoder.base64UrlToBytes(matchedRecordsWrite.encodedData);
                data = DataStream.fromBytes(dataBytes);
                delete matchedRecordsWrite.encodedData;
            }
            else {
                const result = yield this.dataStore.get(tenant, matchedRecordsWrite.recordId, matchedRecordsWrite.descriptor.dataCid);
                if ((result === null || result === void 0 ? void 0 : result.dataStream) === undefined) {
                    return {
                        status: { code: 404, detail: 'Not Found' }
                    };
                }
                data = result.dataStream;
            }
            const record = Object.assign(Object.assign({}, matchedRecordsWrite), { data });
            // attach initial write if returned RecordsWrite is not initial write
            if (!(yield RecordsWrite.isInitialWrite(record))) {
                const initialWriteQueryResult = yield this.messageStore.query(tenant, [{ recordId: record.recordId, isLatestBaseState: false, method: DwnMethodName.Write }]);
                const initialWrite = initialWriteQueryResult.messages[0];
                delete initialWrite.encodedData; // defensive measure but technically optional because we do this when an update RecordsWrite takes place
                record.initialWrite = initialWrite;
            }
            const messageReply = {
                status: { code: 200, detail: 'OK' },
                record
            };
            return messageReply;
        });
    }
    ;
    /**
     * @param messageStore Used to check if the grant has been revoked.
     */
    static authorizeRecordsRead(tenant, recordsRead, matchedRecordsWrite, messageStore) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Message.isSignedByAuthorDelegate(recordsRead.message)) {
                yield recordsRead.authorizeDelegate(matchedRecordsWrite.message, messageStore);
            }
            const { descriptor } = matchedRecordsWrite.message;
            // if author is the same as the target tenant, we can directly grant access
            if (recordsRead.author === tenant) {
                return;
            }
            else if (descriptor.published === true) {
                // authentication is not required for published data
                return;
            }
            else if (recordsRead.author !== undefined && recordsRead.author === descriptor.recipient) {
                // The recipient of a message may always read it
                return;
            }
            else if (recordsRead.author !== undefined && recordsRead.signaturePayload.permissionGrantId !== undefined) {
                const permissionGrant = yield PermissionsProtocol.fetchGrant(tenant, messageStore, recordsRead.signaturePayload.permissionGrantId);
                yield RecordsGrantAuthorization.authorizeRead({
                    recordsReadMessage: recordsRead.message,
                    recordsWriteMessageToBeRead: matchedRecordsWrite.message,
                    expectedGrantor: tenant,
                    expectedGrantee: recordsRead.author,
                    permissionGrant,
                    messageStore
                });
            }
            else if (descriptor.protocol !== undefined) {
                yield ProtocolAuthorization.authorizeRead(tenant, recordsRead, matchedRecordsWrite, messageStore);
            }
            else {
                throw new DwnError(DwnErrorCode.RecordsReadAuthorizationFailed, 'message failed authorization');
            }
        });
    }
}
//# sourceMappingURL=records-read.js.map