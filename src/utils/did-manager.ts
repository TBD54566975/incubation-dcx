import { PortableDid, BearerDid, DidDht, DidDhtCreateOptions, DidDocument } from '@web5/dids';
import { readFile } from 'fs/promises';
import { DcxServerError } from './error.js';

type DidManagerOptions = {
  did?: string;
  bearerDid?: BearerDid;
  portableDid?: PortableDid
}


export class DidImporter {
  did?: string;
  bearerDid?: BearerDid;
  portableDid?: PortableDid;

  constructor(didManagerOptions: DidManagerOptions = {}) {
    this.did = didManagerOptions.did;
    this.bearerDid = didManagerOptions.bearerDid;
    this.portableDid = didManagerOptions.portableDid;
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
      console.error('DidManager', 'importPortableDidFromFile', error);
      throw new DcxServerError('Failed to import portableDid from didFilepath', error);
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
      console.error('DidManager', 'importPortableDid', error);
      throw new DcxServerError('Failed to import portableDid', error);
    }
  }
}

export class DidManager extends DidImporter {
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
      console.error('DidManager', 'resolveDid', error);
      throw new DcxServerError('Failed to resolve didDocument using didUri', error);
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
      console.error('DidManager', 'createBearerDid', error);
      throw new DcxServerError('Failed to create bearerDid', error);
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
      console.error('DidManager', 'exportPortableDid', error);
      throw new DcxServerError('Failed to export portableDid to bearerDid', error);
    }
  }
}

export const didManager = new DidManager();
