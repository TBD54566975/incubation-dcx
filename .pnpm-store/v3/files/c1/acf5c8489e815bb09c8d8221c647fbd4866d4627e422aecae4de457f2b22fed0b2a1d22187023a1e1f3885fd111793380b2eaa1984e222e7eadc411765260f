/**
 * Represents the various verification relationships defined in a DID document.
 *
 * These verification relationships indicate the intended usage of verification methods within a DID
 * document. Each relationship signifies a different purpose or context in which a verification
 * method can be used, such as authentication, assertionMethod, keyAgreement, capabilityDelegation,
 * and capabilityInvocation. The array provides a standardized set of relationship names for
 * consistent referencing and implementation across different DID methods.
 *
 * @see {@link https://www.w3.org/TR/did-core/#verification-relationships | DID Core Specification, § Verification Relationships}
 */
export var DidVerificationRelationship;
(function (DidVerificationRelationship) {
    /**
     * Specifies how the DID subject is expected to be authenticated. This is commonly used for
     * purposes like logging into a website or participating in challenge-response protocols.
     *
     * @see {@link https://www.w3.org/TR/did-core/#authentication | DID Core Specification, § Authentication}
     */
    DidVerificationRelationship["authentication"] = "authentication";
    /**
     * Specifies how the DID subject is expected to express claims, such as for issuing Verifiable
     * Credentials. This relationship is typically used when the DID subject is the issuer of a
     * credential.
     *
     * @see {@link https://www.w3.org/TR/did-core/#assertion | DID Core Specification, § Assertion}
     */
    DidVerificationRelationship["assertionMethod"] = "assertionMethod";
    /**
     * Specifies how an entity can generate encryption material to communicate confidentially with the
     * DID subject. Often used in scenarios requiring secure communication channels.
     *
     * @see {@link https://www.w3.org/TR/did-core/#key-agreement | DID Core Specification, § Key Agreement}
     */
    DidVerificationRelationship["keyAgreement"] = "keyAgreement";
    /**
     * Specifies a verification method used by the DID subject to invoke a cryptographic capability.
     * This is frequently associated with authorization actions, like updating the DID Document.
     *
     * @see {@link https://www.w3.org/TR/did-core/#capability-invocation | DID Core Specification, § Capability Invocation}
     */
    DidVerificationRelationship["capabilityInvocation"] = "capabilityInvocation";
    /**
     * Specifies a mechanism used by the DID subject to delegate a cryptographic capability to another
     * party. This can include delegating access to a specific resource or API.
     *
     * @see {@link https://www.w3.org/TR/did-core/#capability-delegation | DID Core Specification, § Capability Delegation}
     */
    DidVerificationRelationship["capabilityDelegation"] = "capabilityDelegation";
})(DidVerificationRelationship || (DidVerificationRelationship = {}));
//# sourceMappingURL=did-core.js.map