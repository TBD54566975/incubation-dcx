import { CredentialManifest, FORMFREE, Issuer, ServerManifest } from '../index.js';

export class DcxUtils {
  /**
   *
   * Find a manifest by name or id
   *
   * @param param.name the name of the manifest to find
   * @param param.id the id of the manifest to find
   * @returns CredentialManifest or undefined; see {@link CredentialManifest}
   */
  public static findManifest({ manifests, name, id }: Partial<CredentialManifest> & { manifests: ServerManifest[] }): CredentialManifest | undefined {
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
  public static findManifests({ manifests, name, id }: Partial<CredentialManifest> & { manifests: ServerManifest[] }): CredentialManifest[] {
    return manifests.filter((manifest: CredentialManifest) => this.findManifest({ manifests, name, id })?.id === manifest.id);
  }

  /**
   *
   * Find issuer by name or id
   *
   * @param param.name the name of the issuer to find
   * @param param.id the id of the issuer to find
   * @returns Issuer or FORMFREE; see {@link Issuer}, {@link FORMFREE}
   */
  public static findIssuer({ issuers, name, id }: Partial<Issuer> & { issuers: Issuer[] }): Issuer {
    return issuers.find((issuer: Issuer) => issuer.name === name || issuer.id === id) ?? FORMFREE;
  }
}