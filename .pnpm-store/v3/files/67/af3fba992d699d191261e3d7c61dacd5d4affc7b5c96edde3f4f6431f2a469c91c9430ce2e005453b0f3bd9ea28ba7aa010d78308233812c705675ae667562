var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as URI from 'uri-js';
import ErrorCode from './ErrorCode.js';
import InputValidator from './InputValidator.js';
import IonError from './IonError.js';
import IonSdkConfig from './IonSdkConfig.js';
import JsonCanonicalizer from './JsonCanonicalizer.js';
import Multihash from './Multihash.js';
import OperationKeyType from './enums/OperationKeyType.js';
import OperationType from './enums/OperationType.js';
import PatchAction from './enums/PatchAction.js';
/**
 * Class containing operations related to ION requests.
 */
export default class IonRequest {
    /**
     * Creates an ION DID create request.
     * @param input.document The initial state to be associate with the ION DID to be created using a `replace` document patch action.
     */
    static createCreateRequest(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const recoveryKey = input.recoveryKey;
            const updateKey = input.updateKey;
            const didDocumentKeys = input.document.publicKeys;
            const services = input.document.services;
            // Validate recovery and update public keys.
            InputValidator.validateEs256kOperationKey(recoveryKey, OperationKeyType.Public);
            InputValidator.validateEs256kOperationKey(updateKey, OperationKeyType.Public);
            // Validate all given DID Document keys.
            IonRequest.validateDidDocumentKeys(didDocumentKeys);
            // Validate all given service.
            IonRequest.validateServices(services);
            const hashAlgorithmInMultihashCode = IonSdkConfig.hashAlgorithmInMultihashCode;
            const patches = [{
                    action: PatchAction.Replace,
                    document: input.document
                }];
            const delta = {
                updateCommitment: yield Multihash.canonicalizeThenDoubleHashThenEncode(updateKey, hashAlgorithmInMultihashCode),
                patches
            };
            IonRequest.validateDeltaSize(delta);
            const deltaHash = yield Multihash.canonicalizeThenHashThenEncode(delta, hashAlgorithmInMultihashCode);
            const suffixData = {
                deltaHash,
                recoveryCommitment: yield Multihash.canonicalizeThenDoubleHashThenEncode(recoveryKey, hashAlgorithmInMultihashCode)
            };
            const operationRequest = {
                type: OperationType.Create,
                suffixData: suffixData,
                delta: delta
            };
            return operationRequest;
        });
    }
    static createDeactivateRequest(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate DID suffix
            IonRequest.validateDidSuffix(input.didSuffix);
            // Validates recovery public key
            InputValidator.validateEs256kOperationKey(input.recoveryPublicKey, OperationKeyType.Public);
            const hashAlgorithmInMultihashCode = IonSdkConfig.hashAlgorithmInMultihashCode;
            const revealValue = yield Multihash.canonicalizeThenHashThenEncode(input.recoveryPublicKey, hashAlgorithmInMultihashCode);
            const dataToBeSigned = {
                didSuffix: input.didSuffix,
                recoveryKey: input.recoveryPublicKey
            };
            const compactJws = yield input.signer.sign({ alg: 'ES256K' }, dataToBeSigned);
            return {
                type: OperationType.Deactivate,
                didSuffix: input.didSuffix,
                revealValue: revealValue,
                signedData: compactJws
            };
        });
    }
    static createRecoverRequest(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate DID suffix
            IonRequest.validateDidSuffix(input.didSuffix);
            // Validate recovery public key
            InputValidator.validateEs256kOperationKey(input.recoveryPublicKey, OperationKeyType.Public);
            // Validate next recovery public key
            InputValidator.validateEs256kOperationKey(input.nextRecoveryPublicKey, OperationKeyType.Public);
            // Validate next update public key
            InputValidator.validateEs256kOperationKey(input.nextUpdatePublicKey, OperationKeyType.Public);
            // Validate all given DID Document keys.
            IonRequest.validateDidDocumentKeys(input.document.publicKeys);
            // Validate all given service.
            IonRequest.validateServices(input.document.services);
            const hashAlgorithmInMultihashCode = IonSdkConfig.hashAlgorithmInMultihashCode;
            const revealValue = yield Multihash.canonicalizeThenHashThenEncode(input.recoveryPublicKey, hashAlgorithmInMultihashCode);
            const patches = [{
                    action: PatchAction.Replace,
                    document: input.document
                }];
            const nextUpdateCommitmentHash = yield Multihash.canonicalizeThenDoubleHashThenEncode(input.nextUpdatePublicKey, hashAlgorithmInMultihashCode);
            const delta = {
                patches,
                updateCommitment: nextUpdateCommitmentHash
            };
            const deltaHash = yield Multihash.canonicalizeThenHashThenEncode(delta, hashAlgorithmInMultihashCode);
            const nextRecoveryCommitmentHash = yield Multihash.canonicalizeThenDoubleHashThenEncode(input.nextRecoveryPublicKey, hashAlgorithmInMultihashCode);
            const dataToBeSigned = {
                recoveryCommitment: nextRecoveryCommitmentHash,
                recoveryKey: input.recoveryPublicKey,
                deltaHash: deltaHash
            };
            const compactJws = yield input.signer.sign({ alg: 'ES256K' }, dataToBeSigned);
            return {
                type: OperationType.Recover,
                didSuffix: input.didSuffix,
                revealValue: revealValue,
                delta: delta,
                signedData: compactJws
            };
        });
    }
    static createUpdateRequest(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate DID suffix
            IonRequest.validateDidSuffix(input.didSuffix);
            // Validate update public key
            InputValidator.validateEs256kOperationKey(input.updatePublicKey, OperationKeyType.Public);
            // Validate next update public key
            InputValidator.validateEs256kOperationKey(input.nextUpdatePublicKey, OperationKeyType.Public);
            // Validate all given service.
            IonRequest.validateServices(input.servicesToAdd);
            // Validate all given DID Document keys.
            IonRequest.validateDidDocumentKeys(input.publicKeysToAdd);
            // Validate all given service id to remove.
            if (input.idsOfServicesToRemove !== undefined) {
                for (const id of input.idsOfServicesToRemove) {
                    InputValidator.validateId(id);
                }
            }
            // Validate all given public key id to remove.
            if (input.idsOfPublicKeysToRemove !== undefined) {
                for (const id of input.idsOfPublicKeysToRemove) {
                    InputValidator.validateId(id);
                }
            }
            const patches = [];
            // Create patches for add services
            const servicesToAdd = input.servicesToAdd;
            if (servicesToAdd !== undefined && servicesToAdd.length > 0) {
                const patch = {
                    action: PatchAction.AddServices,
                    services: servicesToAdd
                };
                patches.push(patch);
            }
            // Create patches for remove services
            const idsOfServicesToRemove = input.idsOfServicesToRemove;
            if (idsOfServicesToRemove !== undefined && idsOfServicesToRemove.length > 0) {
                const patch = {
                    action: PatchAction.RemoveServices,
                    ids: idsOfServicesToRemove
                };
                patches.push(patch);
            }
            // Create patches for adding public keys
            const publicKeysToAdd = input.publicKeysToAdd;
            if (publicKeysToAdd !== undefined && publicKeysToAdd.length > 0) {
                const patch = {
                    action: PatchAction.AddPublicKeys,
                    publicKeys: publicKeysToAdd
                };
                patches.push(patch);
            }
            // Create patch for removing public keys
            const idsOfPublicKeysToRemove = input.idsOfPublicKeysToRemove;
            if (idsOfPublicKeysToRemove !== undefined && idsOfPublicKeysToRemove.length > 0) {
                const patch = {
                    action: PatchAction.RemovePublicKeys,
                    ids: idsOfPublicKeysToRemove
                };
                patches.push(patch);
            }
            const hashAlgorithmInMultihashCode = IonSdkConfig.hashAlgorithmInMultihashCode;
            const revealValue = yield Multihash.canonicalizeThenHashThenEncode(input.updatePublicKey, hashAlgorithmInMultihashCode);
            const nextUpdateCommitmentHash = yield Multihash.canonicalizeThenDoubleHashThenEncode(input.nextUpdatePublicKey, hashAlgorithmInMultihashCode);
            const delta = {
                patches,
                updateCommitment: nextUpdateCommitmentHash
            };
            const deltaHash = yield Multihash.canonicalizeThenHashThenEncode(delta, hashAlgorithmInMultihashCode);
            const dataToBeSigned = {
                updateKey: input.updatePublicKey,
                deltaHash
            };
            const compactJws = yield input.signer.sign({ alg: 'ES256K' }, dataToBeSigned);
            return {
                type: OperationType.Update,
                didSuffix: input.didSuffix,
                revealValue,
                delta,
                signedData: compactJws
            };
        });
    }
    static validateDidSuffix(didSuffix) {
        Multihash.validateEncodedHashComputedUsingSupportedHashAlgorithm(didSuffix, 'didSuffix');
    }
    static validateDidDocumentKeys(publicKeys) {
        if (publicKeys === undefined) {
            return;
        }
        // Validate each public key.
        const publicKeyIdSet = new Set();
        for (const publicKey of publicKeys) {
            if (Array.isArray(publicKey.publicKeyJwk)) {
                throw new IonError(ErrorCode.DidDocumentPublicKeyMissingOrIncorrectType, `DID Document key 'publicKeyJwk' property is not a non-array object.`);
            }
            InputValidator.validateId(publicKey.id);
            // 'id' must be unique across all given keys.
            if (publicKeyIdSet.has(publicKey.id)) {
                throw new IonError(ErrorCode.DidDocumentPublicKeyIdDuplicated, `DID Document key with ID '${publicKey.id}' already exists.`);
            }
            publicKeyIdSet.add(publicKey.id);
            InputValidator.validatePublicKeyPurposes(publicKey.purposes);
        }
    }
    static validateServices(services) {
        if (services !== undefined && services.length !== 0) {
            const serviceIdSet = new Set();
            for (const service of services) {
                IonRequest.validateService(service);
                if (serviceIdSet.has(service.id)) {
                    throw new IonError(ErrorCode.DidDocumentServiceIdDuplicated, 'Service id has to be unique');
                }
                serviceIdSet.add(service.id);
            }
        }
    }
    static validateService(service) {
        InputValidator.validateId(service.id);
        const maxTypeLength = 30;
        if (service.type.length > maxTypeLength) {
            const errorMessage = `Service endpoint type length ${service.type.length} exceeds max allowed length of ${maxTypeLength}.`;
            throw new IonError(ErrorCode.ServiceTypeTooLong, errorMessage);
        }
        // Throw error if `serviceEndpoint` is an array.
        if (Array.isArray(service.serviceEndpoint)) {
            const errorMessage = 'Service endpoint value cannot be an array.';
            throw new IonError(ErrorCode.ServiceEndpointCannotBeAnArray, errorMessage);
        }
        if (typeof service.serviceEndpoint === 'string') {
            const uri = URI.parse(service.serviceEndpoint);
            if (uri.error !== undefined) {
                throw new IonError(ErrorCode.ServiceEndpointStringNotValidUri, `Service endpoint string '${service.serviceEndpoint}' is not a URI.`);
            }
        }
    }
    static validateDeltaSize(delta) {
        const deltaBytes = JsonCanonicalizer.canonicalizeAsBytes(delta);
        if (deltaBytes.length > IonSdkConfig.maxCanonicalizedDeltaSizeInBytes) {
            const errorMessage = `Delta of ${deltaBytes.length} bytes exceeded limit of ${IonSdkConfig.maxCanonicalizedDeltaSizeInBytes} bytes.`;
            throw new IonError(ErrorCode.DeltaExceedsMaximumSize, errorMessage);
        }
    }
}
//# sourceMappingURL=IonRequest.js.map