var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Secp256k1 } from './secp256k1.js';
import { HdKey, KeyDerivationScheme } from '../utils/hd-key.js';
/**
 * Class containing Protocol related utility methods.
 */
export class Protocols {
    /**
     * Derives public encryptions keys and inject it in the `$encryption` property for each protocol path segment of the given Protocol definition,
     * then returns the final encryption-enabled protocol definition.
     * NOTE: The original definition passed in is unmodified.
     */
    static deriveAndInjectPublicEncryptionKeys(protocolDefinition, rootKeyId, privateJwk) {
        return __awaiter(this, void 0, void 0, function* () {
            // clone before modify
            const encryptionEnabledProtocolDefinition = JSON.parse(JSON.stringify(protocolDefinition));
            // a function that recursively creates and adds `$encryption` property to every rule set
            function addEncryptionProperty(ruleSet, parentKey) {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const key in ruleSet) {
                        // if we encounter a nested rule set (a property name that doesn't begin with '$'), recursively inject the `$encryption` property
                        if (!key.startsWith('$')) {
                            const derivedPrivateKey = yield HdKey.derivePrivateKey(parentKey, [key]);
                            const publicKeyJwk = yield Secp256k1.getPublicJwk(derivedPrivateKey.derivedPrivateKey);
                            ruleSet[key].$encryption = { rootKeyId, publicKeyJwk };
                            yield addEncryptionProperty(ruleSet[key], derivedPrivateKey);
                        }
                    }
                });
            }
            // inject encryption property starting from each root level record type
            const rootKey = {
                derivationScheme: KeyDerivationScheme.ProtocolPath,
                derivedPrivateKey: privateJwk,
                rootKeyId
            };
            const protocolLevelDerivedKey = yield HdKey.derivePrivateKey(rootKey, [KeyDerivationScheme.ProtocolPath, protocolDefinition.protocol]);
            yield addEncryptionProperty(encryptionEnabledProtocolDefinition.structure, protocolLevelDerivedKey);
            return encryptionEnabledProtocolDefinition;
        });
    }
}
//# sourceMappingURL=protocols.js.map