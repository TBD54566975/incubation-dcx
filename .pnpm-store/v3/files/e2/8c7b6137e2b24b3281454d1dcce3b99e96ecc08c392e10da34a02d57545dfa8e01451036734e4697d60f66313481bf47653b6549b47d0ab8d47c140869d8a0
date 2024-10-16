import ISigner from './interfaces/ISigner.js';
import IonCreateRequestModel from './models/IonCreateRequestModel.js';
import IonDeactivateRequestModel from './models/IonDeactivateRequestModel.js';
import IonDocumentModel from './models/IonDocumentModel.js';
import IonPublicKeyModel from './models/IonPublicKeyModel.js';
import IonRecoverRequestModel from './models/IonRecoverRequestModel.js';
import IonServiceModel from './models/IonServiceModel.js';
import IonUpdateRequestModel from './models/IonUpdateRequestModel.js';
import JwkEs256k from './models/JwkEs256k.js';
/**
 * Class containing operations related to ION requests.
 */
export default class IonRequest {
    /**
     * Creates an ION DID create request.
     * @param input.document The initial state to be associate with the ION DID to be created using a `replace` document patch action.
     */
    static createCreateRequest(input: {
        recoveryKey: JwkEs256k;
        updateKey: JwkEs256k;
        document: IonDocumentModel;
    }): Promise<IonCreateRequestModel>;
    static createDeactivateRequest(input: {
        didSuffix: string;
        recoveryPublicKey: JwkEs256k;
        signer: ISigner;
    }): Promise<IonDeactivateRequestModel>;
    static createRecoverRequest(input: {
        didSuffix: string;
        recoveryPublicKey: JwkEs256k;
        nextRecoveryPublicKey: JwkEs256k;
        nextUpdatePublicKey: JwkEs256k;
        document: IonDocumentModel;
        signer: ISigner;
    }): Promise<IonRecoverRequestModel>;
    static createUpdateRequest(input: {
        didSuffix: string;
        updatePublicKey: JwkEs256k;
        nextUpdatePublicKey: JwkEs256k;
        signer: ISigner;
        servicesToAdd?: IonServiceModel[];
        idsOfServicesToRemove?: string[];
        publicKeysToAdd?: IonPublicKeyModel[];
        idsOfPublicKeysToRemove?: string[];
    }): Promise<IonUpdateRequestModel>;
    private static validateDidSuffix;
    private static validateDidDocumentKeys;
    private static validateServices;
    private static validateService;
    private static validateDeltaSize;
}
//# sourceMappingURL=IonRequest.d.ts.map