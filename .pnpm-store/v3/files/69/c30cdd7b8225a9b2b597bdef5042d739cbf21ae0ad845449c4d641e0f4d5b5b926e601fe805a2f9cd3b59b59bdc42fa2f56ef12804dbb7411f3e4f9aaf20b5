var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Encoder } from '../utils/encoder.js';
import { Message } from '../core/message.js';
/**
 * A class representing a Permission Request for a more convenient abstraction.
 */
export class PermissionRequest {
    static parse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionRequest = new PermissionRequest(message);
            return permissionRequest;
        });
    }
    constructor(message) {
        // properties derived from the generic DWN message properties
        this.id = message.recordId;
        this.requester = Message.getSigner(message);
        // properties from the data payload itself.
        const permissionRequestEncodedData = message.encodedData;
        const permissionRequestData = Encoder.base64UrlToObject(permissionRequestEncodedData);
        this.delegated = permissionRequestData.delegated;
        this.description = permissionRequestData.description;
        this.scope = permissionRequestData.scope;
        this.conditions = permissionRequestData.conditions;
    }
}
//# sourceMappingURL=permission-request.js.map