"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/esm/utils.js
var utils_exports = {};
__export(utils_exports, {
  extractDidFragment: () => extractDidFragment,
  getServices: () => getServices,
  getVerificationMethodByKey: () => getVerificationMethodByKey,
  getVerificationMethodTypes: () => getVerificationMethodTypes,
  getVerificationMethods: () => getVerificationMethods,
  getVerificationRelationshipsById: () => getVerificationRelationshipsById,
  isDidService: () => isDidService,
  isDidVerificationMethod: () => isDidVerificationMethod,
  isDwnDidService: () => isDwnDidService,
  keyBytesToMultibaseId: () => keyBytesToMultibaseId,
  multibaseIdToKeyBytes: () => multibaseIdToKeyBytes
});
module.exports = __toCommonJS(utils_exports);
var import_common = require("@web5/common");
var import_crypto = require("@web5/crypto");

// dist/esm/did-error.js
var DidError = class _DidError extends Error {
  /**
   * Constructs an instance of DidError, a custom error class for handling DID-related errors.
   *
   * @param code - A {@link DidErrorCode} representing the specific type of error encountered.
   * @param message - A human-readable description of the error.
   */
  constructor(code, message) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = "DidError";
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _DidError);
    }
  }
};
var DidErrorCode;
(function(DidErrorCode2) {
  DidErrorCode2["InvalidDid"] = "invalidDid";
  DidErrorCode2["MethodNotSupported"] = "methodNotSupported";
  DidErrorCode2["InternalError"] = "internalError";
  DidErrorCode2["InvalidDidDocument"] = "invalidDidDocument";
  DidErrorCode2["InvalidDidDocumentLength"] = "invalidDidDocumentLength";
  DidErrorCode2["InvalidDidUrl"] = "invalidDidUrl";
  DidErrorCode2["InvalidPreviousDidProof"] = "invalidPreviousDidProof";
  DidErrorCode2["InvalidPublicKey"] = "invalidPublicKey";
  DidErrorCode2["InvalidPublicKeyLength"] = "invalidPublicKeyLength";
  DidErrorCode2["InvalidPublicKeyType"] = "invalidPublicKeyType";
  DidErrorCode2["InvalidSignature"] = "invalidSignature";
  DidErrorCode2["NotFound"] = "notFound";
  DidErrorCode2["RepresentationNotSupported"] = "representationNotSupported";
  DidErrorCode2["UnsupportedPublicKeyType"] = "unsupportedPublicKeyType";
})(DidErrorCode || (DidErrorCode = {}));

// dist/esm/types/did-core.js
var DidVerificationRelationship;
(function(DidVerificationRelationship2) {
  DidVerificationRelationship2["authentication"] = "authentication";
  DidVerificationRelationship2["assertionMethod"] = "assertionMethod";
  DidVerificationRelationship2["keyAgreement"] = "keyAgreement";
  DidVerificationRelationship2["capabilityInvocation"] = "capabilityInvocation";
  DidVerificationRelationship2["capabilityDelegation"] = "capabilityDelegation";
})(DidVerificationRelationship || (DidVerificationRelationship = {}));

// dist/esm/utils.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function extractDidFragment(input) {
  if (typeof input !== "string")
    return void 0;
  if (input.length === 0)
    return void 0;
  return input.split("#").pop();
}
function getServices({ didDocument, id, type }) {
  var _a, _b;
  return (_b = (_a = didDocument === null || didDocument === void 0 ? void 0 : didDocument.service) === null || _a === void 0 ? void 0 : _a.filter((service) => {
    if (id && service.id !== id)
      return false;
    if (type && service.type !== type)
      return false;
    return true;
  })) !== null && _b !== void 0 ? _b : [];
}
function getVerificationMethodByKey(_a) {
  return __awaiter(this, arguments, void 0, function* ({ didDocument, publicKeyJwk, publicKeyMultibase }) {
    const verificationMethods = getVerificationMethods({ didDocument });
    for (let method of verificationMethods) {
      if (publicKeyJwk && method.publicKeyJwk) {
        const publicKeyThumbprint = yield (0, import_crypto.computeJwkThumbprint)({ jwk: publicKeyJwk });
        if (publicKeyThumbprint === (yield (0, import_crypto.computeJwkThumbprint)({ jwk: method.publicKeyJwk }))) {
          return method;
        }
      } else if (publicKeyMultibase && method.publicKeyMultibase) {
        if (publicKeyMultibase === method.publicKeyMultibase) {
          return method;
        }
      }
    }
    return null;
  });
}
function getVerificationMethods({ didDocument }) {
  var _a, _b;
  if (!didDocument)
    throw new TypeError(`Required parameter missing: 'didDocument'`);
  const verificationMethods = [];
  verificationMethods.push(...(_b = (_a = didDocument.verificationMethod) === null || _a === void 0 ? void 0 : _a.filter(isDidVerificationMethod)) !== null && _b !== void 0 ? _b : []);
  Object.keys(DidVerificationRelationship).forEach((relationship) => {
    var _a2, _b2;
    verificationMethods.push(...(_b2 = (_a2 = didDocument[relationship]) === null || _a2 === void 0 ? void 0 : _a2.filter(isDidVerificationMethod)) !== null && _b2 !== void 0 ? _b2 : []);
  });
  return verificationMethods;
}
function getVerificationMethodTypes({ didDocument }) {
  const verificationMethods = getVerificationMethods({ didDocument });
  const types = verificationMethods.map((method) => method.type);
  return [...new Set(types)];
}
function getVerificationRelationshipsById({ didDocument, methodId }) {
  const relationships = [];
  Object.keys(DidVerificationRelationship).forEach((relationship) => {
    if (Array.isArray(didDocument[relationship])) {
      const relationshipMethods = didDocument[relationship];
      const methodIdFragment = extractDidFragment(methodId);
      const containsMethodId = relationshipMethods.some((method) => {
        const isByReferenceMatch = extractDidFragment(method) === methodIdFragment;
        const isEmbeddedMethodMatch = isDidVerificationMethod(method) && extractDidFragment(method.id) === methodIdFragment;
        return isByReferenceMatch || isEmbeddedMethodMatch;
      });
      if (containsMethodId) {
        relationships.push(relationship);
      }
    }
  });
  return relationships;
}
function isDidService(obj) {
  if (!obj || typeof obj !== "object" || obj === null)
    return false;
  return "id" in obj && "type" in obj && "serviceEndpoint" in obj;
}
function isDwnDidService(obj) {
  if (!isDidService(obj))
    return false;
  if (obj.type !== "DecentralizedWebNode")
    return false;
  if (!("enc" in obj && "sig" in obj))
    return false;
  const isStringOrStringArray = (prop) => typeof prop === "string" || Array.isArray(prop) && prop.every((item) => typeof item === "string");
  return isStringOrStringArray(obj.enc) && isStringOrStringArray(obj.sig);
}
function isDidVerificationMethod(obj) {
  if (!obj || typeof obj !== "object" || obj === null)
    return false;
  if (!("id" in obj && "type" in obj && "controller" in obj))
    return false;
  if (typeof obj.id !== "string")
    return false;
  if (typeof obj.type !== "string")
    return false;
  if (typeof obj.controller !== "string")
    return false;
  return true;
}
function keyBytesToMultibaseId({ keyBytes, multicodecCode, multicodecName }) {
  const prefixedKey = import_common.Multicodec.addPrefix({
    code: multicodecCode,
    data: keyBytes,
    name: multicodecName
  });
  const prefixedKeyB58 = import_common.Convert.uint8Array(prefixedKey).toBase58Btc();
  const multibaseKeyId = import_common.Convert.base58Btc(prefixedKeyB58).toMultibase();
  return multibaseKeyId;
}
function multibaseIdToKeyBytes({ multibaseKeyId }) {
  try {
    const prefixedKeyB58 = import_common.Convert.multibase(multibaseKeyId).toBase58Btc();
    const prefixedKey = import_common.Convert.base58Btc(prefixedKeyB58).toUint8Array();
    const { code, data, name } = import_common.Multicodec.removePrefix({ prefixedData: prefixedKey });
    return { keyBytes: data, multicodecCode: code, multicodecName: name };
  } catch (error) {
    throw new DidError(DidErrorCode.InvalidDid, `Invalid multibase identifier: ${multibaseKeyId}`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractDidFragment,
  getServices,
  getVerificationMethodByKey,
  getVerificationMethodTypes,
  getVerificationMethods,
  getVerificationRelationshipsById,
  isDidService,
  isDidVerificationMethod,
  isDwnDidService,
  keyBytesToMultibaseId,
  multibaseIdToKeyBytes
});
//# sourceMappingURL=utils.js.map
