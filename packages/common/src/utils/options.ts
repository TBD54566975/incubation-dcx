import { CredentialManifest, MX, TrustedIssuer } from '../index.js';

export type FindManifestParams = { manifests: CredentialManifest[]; name?: string; id?: string };
export type FindIssuerParams = Partial<TrustedIssuer> & { issuers: TrustedIssuer[] }
export type FindMissingManifestResponse = { missing: CredentialManifest[] };
export type FindMissingManifestParams = { dwnManifests: CredentialManifest[], localManifests: CredentialManifest[] };
export class OptionsUtil {
  /**
   *
   * Find a manifest by name or id
   *
   * @param param.name the name of the manifest to find
   * @param param.id the id of the manifest to find
   * @returns CredentialManifest or undefined; see {@link CredentialManifest}
   */
  public static findManifest({ manifests, name, id }: FindManifestParams): CredentialManifest | undefined {
    return manifests.find((manifest: CredentialManifest) => manifest.name === name || manifest.id  === id);
  }

  /**
   *
   * Find a manifest by name or id
   *
   * @param param.name the name of the manifest to find
   * @param param.id the id of the manifest to find
   * @returns CredentialManifest or undefined; see {@link CredentialManifest}
   */
  public static findManifests({ manifests, name, id }: FindManifestParams): CredentialManifest[] {
    return manifests.filter((manifest: CredentialManifest) => this.findManifest({ manifests, name, id })?.id === manifest.id);
  }

  /**
   *
   * Find issuer by name or id
   *
   * @param param.name the name of the issuer to find
   * @param param.id the id of the issuer to find
   * @returns TrustedIssuer; see {@link TrustedIssuer}
   */
  public static findIssuer({ issuers, name, id }: FindIssuerParams): TrustedIssuer {
    return issuers.find((issuer: TrustedIssuer) => issuer.name === name || issuer.id === id) ?? MX;
  }

  public static findMissingManifests({ dwnManifests, localManifests }: FindMissingManifestParams): FindMissingManifestResponse {
    const dwnManifestIds = new Set(dwnManifests.map(dwnManifest => dwnManifest.id));
    const missing = localManifests.filter(localManifest => !dwnManifestIds.has(localManifest.id));
    return { missing };
  }
}