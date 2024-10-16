import IonPublicKeyModel from './models/IonPublicKeyModel.js';
import IonPublicKeyPurpose from './enums/IonPublicKeyPurpose.js';
import JwkEd25519 from './models/JwkEd25519.js';
import JwkEs256k from './models/JwkEs256k.js';
/**
 * Class containing operations related to keys used in ION.
 */
export default class IonKey {
    /**
     * Generates SECP256K1 key pair to be used in an operation.
     * Mainly used for testing.
     * @returns [publicKey, privateKey]
     */
    static generateEs256kDidDocumentKeyPair(input: {
        id: string;
        purposes?: IonPublicKeyPurpose[];
    }): Promise<[IonPublicKeyModel, JwkEs256k]>;
    /**
     * Generates SECP256K1 key pair for ION operation use.
     * @returns [publicKey, privateKey]
     */
    static generateEs256kOperationKeyPair(): Promise<[JwkEs256k, JwkEs256k]>;
    private static generateEs256kKeyPair;
    /**
     * Generates Ed25519 key pair to be used in an operation.
     * Mainly used for testing.
     * @returns [publicKey, privateKey]
     */
    static generateEd25519DidDocumentKeyPair(input: {
        id: string;
        purposes?: IonPublicKeyPurpose[];
    }): Promise<[IonPublicKeyModel, JwkEd25519]>;
    /**
     * Generates Ed25519 key pair for ION operation use.
     * @returns [publicKey, privateKey]
     */
    static generateEd25519OperationKeyPair(): Promise<[JwkEd25519, JwkEd25519]>;
    private static generateEd25519KeyPair;
    static isJwkEs256k(key: JwkEs256k | JwkEd25519): key is JwkEs256k;
    static isJwkEd25519(key: JwkEs256k | JwkEd25519): key is JwkEd25519;
}
//# sourceMappingURL=IonKey.d.ts.map