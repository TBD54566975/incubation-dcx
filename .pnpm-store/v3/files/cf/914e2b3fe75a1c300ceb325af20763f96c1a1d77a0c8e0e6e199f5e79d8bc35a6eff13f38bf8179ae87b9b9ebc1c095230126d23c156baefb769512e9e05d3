/**
 * A client for registering tenants with a DWN.
 */
export declare class DwnRegistrar {
    /**
     * Registers a new tenant with the given DWN.
     * NOTE: Assumes the user has already accepted the terms of service.
     * NOTE: Currently the DWN Server from `dwn-server` does not require user signature.
     * TODO: bring in types from `dwn-server`.
     */
    static registerTenant(dwnEndpoint: string, did: string): Promise<void>;
    /**
     * Computes the SHA-256 hash of the given array of strings.
     */
    static hashAsHexString(input: string): Promise<string>;
    /**
     * Finds a response nonce that qualifies the difficulty requirement for the given proof-of-work challenge and request data.
     */
    static findQualifiedResponseNonce(input: {
        maximumAllowedHashValue: string;
        challengeNonce: string;
        requestData: string;
    }): Promise<string>;
    /**
     * Generates 32 random bytes expressed as a HEX string.
     */
    static generateNonce(): Promise<string>;
}
//# sourceMappingURL=dwn-registrar.d.ts.map