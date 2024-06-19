import { PortableDid, BearerDid, DidDht, DidDhtCreateOptions, DidDocument } from '@web5/dids';
import { readFile } from 'fs/promises';
import { DcxDidError } from './error.js';
import { Ed25519, Jwk } from '@web5/crypto';

export type DidDcxConfig = {
  did?: string;
  bearerDid?: BearerDid;
  portableDid?: PortableDid
}

export class DidDcxManager {
  did?: string;
  bearerDid?: BearerDid;
  portableDid?: PortableDid;

  constructor(config: DidDcxConfig = {}) {
    this.did = config.did;
    this.bearerDid = config.bearerDid;
    this.portableDid = config.portableDid;
  }

  /**
   * 
   * Uses DidDht to handle importing a portable did bearer did; see {@link DidDht.import()}
   * @param didFilepath the path to the file containing the portable did object; see {@link PortableDid}
   * @returns corresponding bearer did; see {@link BearerDid}
   */
  public async importPortableDidFromFile(didFilepath: string): Promise<BearerDid> {
    try {
      const didFileString = (await readFile(didFilepath))?.toString();
      const portableDid = JSON.parse(didFileString);
      this.portableDid = portableDid;
      return await this.importPortableDid(portableDid);
    } catch (error: any) {
      console.error('importPortableDidFromFile', error);
      throw new DcxDidError('Failed to import portableDid from didFilepath', this.did);
    }
  }

  /**
   * Uses DidDht to handle instantiating bearer did from corresponding portable did; see {@link DidDht.import()}
   * @param portableDid a portable did object; see {@link PortableDid}
   * @returns a bearer did object; see {@link BearerDid}
   */
  public async importPortableDid(portableDid: PortableDid): Promise<BearerDid> {
    try {
      this.bearerDid = await DidDht.import({ portableDid: this.portableDid ?? portableDid });
      return this.bearerDid
    } catch (error: any) {
      console.error('importPortableDid', error);
      throw new DcxDidError('Failed to import portableDid', this.did);
    }
  }
}

export const JWK_PRIVATE_KEY_FORMAT = { crv: "Ed25519", kty: "OKP", x: "" };
export class DidDcx extends DidDcxManager {
  /**
   * 
   * Uses Ed25519 to generate a private key; see {@link Ed25519.generatePrivateKey()}
   * @param privKey the private key to generate the public key from
   * @returns the public key object; see {@link Jwk}
   */
  public async computeDidJwkPublicKey(privKey: string): Promise<Jwk> {
    try {
      const key = { ...JWK_PRIVATE_KEY_FORMAT, d: privKey } as Jwk;
      const keyPair = await Ed25519.computePublicKey({ key });
      return { ...keyPair, x: keyPair.x }
    } catch (error: any) {
      console.error('computeDidJwkPublicKey', error);
      throw new DcxDidError('Failed to compute public key', this.did);
    }
  }

  /**
   * 
   * Uses DidDht and a didUri to resolve the corresponding didDocument; see {@link DidDht.resolve()}
   * @param didUri the uri to resolve
   * @returns DidDocument object or null; see {@link DidDocument}
   */
  public async resolveDid(didUri: string): Promise<DidDocument | null> {
    try {
      const didResolution = await DidDht.resolve(this.did ?? didUri);
      return didResolution.didDocument;
    } catch (error) {
      console.error('resolveDid', error);
      throw new DcxDidError('Failed to resolve didDocument using didUri', this.did);
    }
  }

  /**
   *
   * Uses DidDht to create a bearer did; see {@link DidDht.create()}
   * @param options The did dht create options; see {@link DidDhtCreateOptions}
   * @returns a bearer did object; see {@link BearerDid}
   */
  public async createBearerDid(options: DidDhtCreateOptions<any>): Promise<BearerDid> {
    try {
      this.bearerDid = await DidDht.create({ options });
      this.portableDid = await this.exportPortableDid(this.bearerDid);
      return this.bearerDid;
    } catch (error: any) {
      console.error('createBearerDid', error);
      throw new DcxDidError('Failed to create bearerDid', this.did);
    }
  }

  /**
   *
   * Handles exporting portable did from corresponding bearer did; see {@link BearerDid.export()}
   * @param bearerDid a bearer did object; see {@link BearerDid}
   * @returns a  did object; see {@link }
   */
  public async exportPortableDid(bearerDid: BearerDid): Promise<PortableDid> {
    try {
      bearerDid = this.bearerDid ?? bearerDid;
      this.portableDid = await bearerDid.export();
      return this.portableDid
    } catch (error: any) {
      console.error('exportPortableDid', error);
      throw new DcxDidError('Failed to export portableDid to bearerDid', this.did);
    }
  }
}

export const didManager = new DidDcxManager();
