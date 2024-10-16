import { BearerDid } from '@web5/dids';
import { IdentityMetadata, PortableIdentity } from './types/identity.js';
/**
 * Represents a Web5 Identity with its DID and metadata.
 */
export declare class BearerIdentity {
    /** {@inheritDoc BearerDid} */
    did: BearerDid;
    /** {@inheritDoc DidMetadata} */
    metadata: IdentityMetadata;
    constructor({ did, metadata }: {
        did: BearerDid;
        metadata: IdentityMetadata;
    });
    /**
     * Converts a `BearerIdentity` object to a portable format containing the DID and metadata
     * associated with the Identity.
     *
     * @example
     * ```ts
     * // Assuming `identity` is an instance of BearerIdentity.
     * const portableIdentity = await identity.export();
     * // portableIdentity now contains the and metadata.
     * ```
     *
     * @returns A `PortableIdentity` containing the DID and metadata associated with the
     *          `BearerIdentity`.
     */
    export(): Promise<PortableIdentity>;
}
//# sourceMappingURL=bearer-identity.d.ts.map