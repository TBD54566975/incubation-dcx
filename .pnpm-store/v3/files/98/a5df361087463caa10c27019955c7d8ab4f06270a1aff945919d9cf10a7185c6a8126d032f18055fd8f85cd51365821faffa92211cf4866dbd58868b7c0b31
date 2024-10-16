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
 * A class representing a Permission Grant for a more convenient abstraction.
 */
export class PermissionGrant {
    static parse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionGrant = new PermissionGrant(message);
            return permissionGrant;
        });
    }
    constructor(message) {
        // properties derived from the generic DWN message properties
        this.id = message.recordId;
        this.grantor = Message.getSigner(message);
        this.grantee = message.descriptor.recipient;
        this.dateGranted = message.descriptor.dateCreated;
        // properties from the data payload itself.
        const permissionGrantEncoded = message.encodedData;
        const permissionGrant = Encoder.base64UrlToObject(permissionGrantEncoded);
        this.dateExpires = permissionGrant.dateExpires;
        this.delegated = permissionGrant.delegated;
        this.description = permissionGrant.description;
        this.requestId = permissionGrant.requestId;
        this.scope = permissionGrant.scope;
        this.conditions = permissionGrant.conditions;
    }
}
//# sourceMappingURL=permission-grant.js.map