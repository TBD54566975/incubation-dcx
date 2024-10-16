var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Encoder from './Encoder.js';
import IonRequest from './IonRequest.js';
import IonSdkConfig from './IonSdkConfig.js';
import JsonCanonicalizer from './JsonCanonicalizer.js';
import Multihash from './Multihash.js';
/**
 * Class containing DID related operations.
 */
export default class IonDid {
    /**
     * Creates a long-form DID.
     * @param input.document The initial state to be associate with the ION DID to be created using a `replace` document patch action.
     */
    static createLongFormDid(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = yield IonRequest.createCreateRequest(input);
            const didUniqueSuffix = yield IonDid.computeDidUniqueSuffix(createRequest.suffixData);
            // Add the network portion if not configured for mainnet.
            let shortFormDid;
            if (IonSdkConfig.network === undefined || IonSdkConfig.network === 'mainnet') {
                shortFormDid = `did:ion:${didUniqueSuffix}`;
            }
            else {
                shortFormDid = `did:ion:${IonSdkConfig.network}:${didUniqueSuffix}`;
            }
            const initialState = {
                suffixData: createRequest.suffixData,
                delta: createRequest.delta
            };
            // Initial state must be canonicalized as per spec.
            const canonicalizedInitialStateBytes = JsonCanonicalizer.canonicalizeAsBytes(initialState);
            const encodedCanonicalizedInitialStateString = Encoder.encode(canonicalizedInitialStateBytes);
            const longFormDid = `${shortFormDid}:${encodedCanonicalizedInitialStateString}`;
            return longFormDid;
        });
    }
    /**
     * Computes the DID unique suffix given the encoded suffix data string.
     */
    static computeDidUniqueSuffix(suffixData) {
        return __awaiter(this, void 0, void 0, function* () {
            const canonicalizedStringBytes = JsonCanonicalizer.canonicalizeAsBytes(suffixData);
            const multihash = yield Multihash.hash(canonicalizedStringBytes, IonSdkConfig.hashAlgorithmInMultihashCode);
            const encodedMultihash = Encoder.encode(multihash);
            return encodedMultihash;
        });
    }
}
//# sourceMappingURL=IonDid.js.map