"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalKeyManager = void 0;
var common_1 = require("@web5/common");
var sha_2_js_1 = require("./algorithms/sha-2.js");
var ecdsa_js_1 = require("./algorithms/ecdsa.js");
var eddsa_js_1 = require("./algorithms/eddsa.js");
var jwk_js_1 = require("./jose/jwk.js");
/**
 * `supportedAlgorithms` is an object mapping algorithm names to their respective implementations
 * Each entry in this map specifies the algorithm name and its associated properties, including the
 * implementation class and any relevant names or identifiers for the algorithm. This structure
 * allows for easy retrieval and instantiation of algorithm implementations based on the algorithm
 * name or key specification. It facilitates the support of multiple algorithms within the
 * `LocalKeyManager` class.
 */
var supportedAlgorithms = {
    'Ed25519': {
        implementation: eddsa_js_1.EdDsaAlgorithm,
        names: ['Ed25519'],
    },
    'secp256k1': {
        implementation: ecdsa_js_1.EcdsaAlgorithm,
        names: ['ES256K', 'secp256k1'],
    },
    'secp256r1': {
        implementation: ecdsa_js_1.EcdsaAlgorithm,
        names: ['ES256', 'secp256r1'],
    },
    'SHA-256': {
        implementation: sha_2_js_1.Sha2Algorithm,
        names: ['SHA-256']
    }
};
var LocalKeyManager = /** @class */ (function () {
    function LocalKeyManager(params) {
        var _a;
        /**
         * A private map that stores instances of cryptographic algorithm implementations. Each key in
         * this map is an `AlgorithmConstructor`, and its corresponding value is an instance of a class
         * that implements a specific cryptographic algorithm. This map is used to cache and reuse
         * instances for performance optimization, ensuring that each algorithm is instantiated only once.
         */
        this._algorithmInstances = new Map();
        this._keyStore = (_a = params === null || params === void 0 ? void 0 : params.keyStore) !== null && _a !== void 0 ? _a : new common_1.MemoryStore();
    }
    /**
     * Generates a hash digest of the provided data.
     *
     * @remarks
     * A digest is the output of the hash function. It's a fixed-size string of bytes
     * that uniquely represents the data input into the hash function. The digest is often used for
     * data integrity checks, as any alteration in the input data results in a significantly
     * different digest.
     *
     * It takes the algorithm identifier of the hash function and data to digest as input and returns
     * the digest of the data.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const data = new Uint8Array([...]);
     * const digest = await keyManager.digest({ algorithm: 'SHA-256', data });
     * ```
     *
     * @param params - The parameters for the digest operation.
     * @param params.algorithm - The name of hash function to use.
     * @param params.data - The data to digest.
     *
     * @returns A Promise which will be fulfilled with the hash digest.
     */
    LocalKeyManager.prototype.digest = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var hasher, hash;
            var algorithm = _b.algorithm, data = _b.data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        hasher = this.getAlgorithm({ algorithm: algorithm });
                        return [4 /*yield*/, hasher.digest({ algorithm: algorithm, data: data })];
                    case 1:
                        hash = _c.sent();
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    /**
     * Exports a private key identified by the provided key URI from the local KMS.
     *
     * @remarks
     * This method retrieves the key from the key store and returns it. It is primarily used
     * for extracting keys for backup or transfer purposes.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const privateKey = await keyManager.exportKey({ keyUri });
     * ```
     *
     * @param params - Parameters for exporting the key.
     * @param params.keyUri - The key URI identifying the key to export.
     *
     * @returns A Promise resolving to the JWK representation of the exported key.
     */
    LocalKeyManager.prototype.exportKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKey;
            var keyUri = _b.keyUri;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getPrivateKey({ keyUri: keyUri })];
                    case 1:
                        privateKey = _c.sent();
                        return [2 /*return*/, privateKey];
                }
            });
        });
    };
    /**
     * Generates a new cryptographic key in the local KMS with the specified algorithm and returns a
     * unique key URI which can be used to reference the key in subsequent operations.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * console.log(keyUri); // Outputs the key URI
     * ```
     *
     * @param params - The parameters for key generation.
     * @param params.algorithm - The algorithm to use for key generation, defined in `SupportedAlgorithm`.
     *
     * @returns A Promise that resolves to the key URI, a unique identifier for the generated key.
     */
    LocalKeyManager.prototype.generateKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var keyGenerator, key, keyUri;
            var algorithm = _b.algorithm;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        keyGenerator = this.getAlgorithm({ algorithm: algorithm });
                        return [4 /*yield*/, keyGenerator.generateKey({ algorithm: algorithm })];
                    case 1:
                        key = _c.sent();
                        if ((key === null || key === void 0 ? void 0 : key.kid) === undefined) {
                            throw new Error('Generated key is missing a required property: kid');
                        }
                        keyUri = "".concat(jwk_js_1.KEY_URI_PREFIX_JWK).concat(key.kid);
                        // Store the key in the key store.
                        return [4 /*yield*/, this._keyStore.set(keyUri, key)];
                    case 2:
                        // Store the key in the key store.
                        _c.sent();
                        return [2 /*return*/, keyUri];
                }
            });
        });
    };
    /**
     * Computes the Key URI for a given public JWK (JSON Web Key).
     *
     * @remarks
     * This method generates a {@link https://datatracker.ietf.org/doc/html/rfc3986 | URI}
     * (Uniform Resource Identifier) for the given JWK, which uniquely identifies the key across all
     * `CryptoApi` implementations. The key URI is constructed by appending the
     * {@link https://datatracker.ietf.org/doc/html/rfc7638 | JWK thumbprint} to the prefix
     * `urn:jwk:`. The JWK thumbprint is deterministically computed from the JWK and is consistent
     * regardless of property order or optional property inclusion in the JWK. This ensures that the
     * same key material represented as a JWK will always yield the same thumbprint, and therefore,
     * the same key URI.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const publicKey = await keyManager.getPublicKey({ keyUri });
     * const keyUriFromPublicKey = await keyManager.getKeyUri({ key: publicKey });
     * console.log(keyUri === keyUriFromPublicKey); // Outputs `true`
     * ```
     *
     * @param params - The parameters for getting the key URI.
     * @param params.key - The JWK for which to compute the key URI.
     *
     * @returns A Promise that resolves to the key URI as a string.
     */
    LocalKeyManager.prototype.getKeyUri = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var jwkThumbprint, keyUri;
            var key = _b.key;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: key })];
                    case 1:
                        jwkThumbprint = _c.sent();
                        keyUri = "".concat(jwk_js_1.KEY_URI_PREFIX_JWK).concat(jwkThumbprint);
                        return [2 /*return*/, keyUri];
                }
            });
        });
    };
    /**
     * Retrieves the public key associated with a previously generated private key, identified by
     * the provided key URI.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const publicKey = await keyManager.getPublicKey({ keyUri });
     * ```
     *
     * @param params - The parameters for retrieving the public key.
     * @param params.keyUri - The key URI of the private key to retrieve the public key for.
     *
     * @returns A Promise that resolves to the public key in JWK format.
     */
    LocalKeyManager.prototype.getPublicKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKey, algorithm, keyGenerator, publicKey;
            var keyUri = _b.keyUri;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getPrivateKey({ keyUri: keyUri })];
                    case 1:
                        privateKey = _c.sent();
                        algorithm = this.getAlgorithmName({ key: privateKey });
                        keyGenerator = this.getAlgorithm({ algorithm: algorithm });
                        return [4 /*yield*/, keyGenerator.getPublicKey({ key: privateKey })];
                    case 2:
                        publicKey = _c.sent();
                        return [2 /*return*/, publicKey];
                }
            });
        });
    };
    /**
     * Imports a private key into the local KMS.
     *
     * @remarks
     * This method stores the provided JWK in the key store, making it available for subsequent
     * cryptographic operations. It is particularly useful for initializing the KMS with pre-existing
     * keys or for restoring keys from backups.
     *
     * Note that, if defined, the `kid` (key ID) property of the JWK is used as the key URI for the
     * imported key. If the `kid` property is not provided, the key URI is computed from the JWK
     * thumbprint of the key.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const privateKey = { ... } // A private key in JWK format
     * const keyUri = await keyManager.importKey({ key: privateKey });
     * ```
     *
     * @param params - Parameters for importing the key.
     * @param params.key - The private key to import to in JWK format.
     *
     * @returns A Promise resolving to the key URI, uniquely identifying the imported key.
     */
    LocalKeyManager.prototype.importKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKey, _c, _d, keyUri;
            var _e;
            var key = _b.key;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(0, jwk_js_1.isPrivateJwk)(key))
                            throw new TypeError('Invalid key provided. Must be a private key in JWK format.');
                        privateKey = structuredClone(key);
                        if (!((_e = 
                        // If the key ID is undefined, set it to the JWK thumbprint.
                        privateKey.kid) !== null && _e !== void 0)) return [3 /*break*/, 1];
                        _c = _e;
                        return [3 /*break*/, 3];
                    case 1:
                        // If the key ID is undefined, set it to the JWK thumbprint.
                        _d = privateKey;
                        return [4 /*yield*/, (0, jwk_js_1.computeJwkThumbprint)({ jwk: privateKey })];
                    case 2:
                        _c = (_d.kid = _f.sent());
                        _f.label = 3;
                    case 3:
                        // If the key ID is undefined, set it to the JWK thumbprint.
                        _c;
                        return [4 /*yield*/, this.getKeyUri({ key: privateKey })];
                    case 4:
                        keyUri = _f.sent();
                        // Store the key in the key store.
                        return [4 /*yield*/, this._keyStore.set(keyUri, privateKey)];
                    case 5:
                        // Store the key in the key store.
                        _f.sent();
                        return [2 /*return*/, keyUri];
                }
            });
        });
    };
    /**
     * Signs the provided data using the private key identified by the provided key URI.
     *
     * @remarks
     * This method uses the signature algorithm determined by the `alg` and/or `crv` properties of the
     * private key identified by the provided key URI to sign the provided data. The signature can
     * later be verified by parties with access to the corresponding public key, ensuring that the
     * data has not been tampered with and was indeed signed by the holder of the private key.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const data = new TextEncoder().encode('Message to sign');
     * const signature = await keyManager.sign({ keyUri, data });
     * ```
     *
     * @param params - The parameters for the signing operation.
     * @param params.keyUri - The key URI of the private key to use for signing.
     * @param params.data - The data to sign.
     *
     * @returns A Promise resolving to the digital signature as a `Uint8Array`.
     */
    LocalKeyManager.prototype.sign = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKey, algorithm, signer, signature;
            var keyUri = _b.keyUri, data = _b.data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getPrivateKey({ keyUri: keyUri })];
                    case 1:
                        privateKey = _c.sent();
                        algorithm = this.getAlgorithmName({ key: privateKey });
                        signer = this.getAlgorithm({ algorithm: algorithm });
                        signature = signer.sign({ data: data, key: privateKey });
                        return [2 /*return*/, signature];
                }
            });
        });
    };
    /**
     * Verifies a digital signature associated the provided data using the provided key.
     *
     * @remarks
     * This method uses the signature algorithm determined by the `alg` and/or `crv` properties of the
     * provided key to check the validity of a digital signature against the original data. It
     * confirms whether the signature was created by the holder of the corresponding private key and
     * that the data has not been tampered with.
     *
     * @example
     * ```ts
     * const keyManager = new LocalKeyManager();
     * const keyUri = await keyManager.generateKey({ algorithm: 'Ed25519' });
     * const data = new TextEncoder().encode('Message to sign');
     * const signature = await keyManager.sign({ keyUri, data });
     * const isSignatureValid = await keyManager.verify({ keyUri, data, signature });
     * ```
     *
     * @param params - The parameters for the verification operation.
     * @param params.key - The key to use for verification.
     * @param params.signature - The signature to verify.
     * @param params.data - The data to verify.
     *
     * @returns A Promise resolving to a boolean indicating whether the signature is valid.
     */
    LocalKeyManager.prototype.verify = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var algorithm, signer, isSignatureValid;
            var key = _b.key, signature = _b.signature, data = _b.data;
            return __generator(this, function (_c) {
                algorithm = this.getAlgorithmName({ key: key });
                signer = this.getAlgorithm({ algorithm: algorithm });
                isSignatureValid = signer.verify({ key: key, signature: signature, data: data });
                return [2 /*return*/, isSignatureValid];
            });
        });
    };
    /**
     * Retrieves an algorithm implementation instance based on the provided algorithm name.
     *
     * @remarks
     * This method checks if the requested algorithm is supported and returns a cached instance
     * if available. If an instance does not exist, it creates and caches a new one. This approach
     * optimizes performance by reusing algorithm instances across cryptographic operations.
     *
     * @example
     * ```ts
     * const signer = this.getAlgorithm({ algorithm: 'Ed25519' });
     * ```
     *
     * @param params - The parameters for retrieving the algorithm implementation.
     * @param params.algorithm - The name of the algorithm to retrieve.
     *
     * @returns An instance of the requested algorithm implementation.
     *
     * @throws Error if the requested algorithm is not supported.
     */
    LocalKeyManager.prototype.getAlgorithm = function (_a) {
        var _b;
        var algorithm = _a.algorithm;
        // Check if algorithm is supported.
        var AlgorithmImplementation = (_b = supportedAlgorithms[algorithm]) === null || _b === void 0 ? void 0 : _b['implementation'];
        if (!AlgorithmImplementation) {
            throw new Error("Algorithm not supported: ".concat(algorithm));
        }
        // Check if instance already exists for the `AlgorithmImplementation`.
        if (!this._algorithmInstances.has(AlgorithmImplementation)) {
            // If not, create a new instance and store it in the cache
            this._algorithmInstances.set(AlgorithmImplementation, new AlgorithmImplementation());
        }
        // Return the cached instance
        return this._algorithmInstances.get(AlgorithmImplementation);
    };
    /**
     * Determines the name of the algorithm based on the key's properties.
     *
     * @remarks
     * This method facilitates the identification of the correct algorithm for cryptographic
     * operations based on the `alg` or `crv` properties of a {@link Jwk | JWK}.
     *
     * @example
     * ```ts
     * const publicKey = { ... }; // Public key in JWK format
     * const algorithm = this.getAlgorithmName({ key: publicKey });
     * ```
     *
     * @param params - The parameters for determining the algorithm name.
     * @param params.key - A JWK containing the `alg` or `crv` properties.
     *
     * @returns The name of the algorithm associated with the key.
     *
     * @throws Error if the algorithm cannot be determined from the provided input.
     */
    LocalKeyManager.prototype.getAlgorithmName = function (_a) {
        var key = _a.key;
        var algProperty = key.alg;
        var crvProperty = key.crv;
        for (var algName in supportedAlgorithms) {
            var algorithmInfo = supportedAlgorithms[algName];
            if (algProperty && algorithmInfo.names.includes(algProperty)) {
                return algName;
            }
            else if (crvProperty && algorithmInfo.names.includes(crvProperty)) {
                return algName;
            }
        }
        throw new Error("Unable to determine algorithm based on provided input: alg=".concat(algProperty, ", crv=").concat(crvProperty));
    };
    /**
     * Retrieves a private key from the key store based on the provided key URI.
     *
     * @example
     * ```ts
     * const privateKey = this.getPrivateKey({ keyUri: 'urn:jwk:...' });
     * ```
     *
     * @param params - Parameters for retrieving the private key.
     * @param params.keyUri - The key URI identifying the private key to retrieve.
     *
     * @returns A Promise resolving to the JWK representation of the private key.
     *
     * @throws Error if the key is not found in the key store.
     */
    LocalKeyManager.prototype.getPrivateKey = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var privateKey;
            var keyUri = _b.keyUri;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._keyStore.get(keyUri)];
                    case 1:
                        privateKey = _c.sent();
                        if (!privateKey) {
                            throw new Error("Key not found: ".concat(keyUri));
                        }
                        return [2 /*return*/, privateKey];
                }
            });
        });
    };
    return LocalKeyManager;
}());
exports.LocalKeyManager = LocalKeyManager;
//# sourceMappingURL=local-key-manager.js.map