import { PortableDid, BearerDid, DidDht, DidDhtCreateOptions, DidDocument } from '@web5/dids';
import { readFile } from 'fs/promises';
import { DcxServerError } from './error.js';

export class DidManager {
  public static async resolveDid(didUri: string): Promise<DidDocument | null> {
    try {
      const didResolution = await DidDht.resolve(didUri);
      return didResolution.didDocument;
    } catch (error) {
      console.error(error);
      throw new DcxServerError('Failed to import did from file');
    }
  }

  /**
  * Uses DidDht to handle importing a portable did bearer did; see {@link DidDht.import()}
  * @param didFilepath the path to the file containing the portable did object; see {@link PortableDid}
  * @returns corresponding bearer did; see {@link BearerDid}
  */
  public static async importPortableDidFile(didFilepath: string): Promise<PortableDid> {
    try {

      const didFileString = (await readFile(didFilepath))?.toString();
      const portableDid = JSON.parse(didFileString);
      return await this.importPortableDid(portableDid);
    } catch (error: any) {
      console.error(error);
      throw new DcxServerError('Failed to import did from file');
    }
  }

  /**
   * Uses DidDht to handle importing a portable did bearer did; see {@link DidDht.import()}
   * @param didFilepath the path to the file containing the portable did object; see {@link PortableDid}
   * @returns corresponding bearer did; see {@link BearerDid}
   */
  public static async importPortableDid(portableDid: PortableDid): Promise<PortableDid> {
    try {
      if (!portableDid) {
        throw new DcxServerError('No portableDid provided');
      }
      const bearerDid = await DidDht.import({ portableDid });
      return await bearerDid.export();
    } catch (error: any) {
      console.error(error);
      throw new DcxServerError('Failed to import did from file');
    }
  }

  /**
   * Uses DidDht to handle instantiating bearer did from corresponding portable did; see {@link DidDht.import()}
   * @param portableDid a portable did object; see {@link PortableDid}
   * @returns a bearer did object; see {@link BearerDid}
   */
  public static async importBearerDid(portableDid: PortableDid): Promise<BearerDid> {
    try {
      if (!portableDid) {
        throw new DcxServerError('No portableDid provided');
      }
      return await DidDht.import({ portableDid });
    } catch (error: any) {
      console.error(error);
      throw new DcxServerError('Failed to import DID');
    }
  }

  /**
 * Uses DidDht to create a bearer did; see {@link DidDht.create()}
 * @param options The did dht create options; see {@link DidDhtCreateOptions}
 * @returns a bearer did object; see {@link BearerDid}
 */
  public static async createBearerDid(options: DidDhtCreateOptions<any>): Promise<BearerDid> {
    try {
      return await DidDht.create({ options });
    } catch (error: any) {
      console.error(error);
      throw new DcxServerError('Failed to create DID');
    }
  }

  /**
   * Handles exporting portable did from corresponding bearer did; see {@link BearerDid.export()}
   * @param bearerDid a bearer did object; see {@link BearerDid}
   * @returns a  did object; see {@link }
   */
  public static async exportPortableDid(bearerDid: BearerDid): Promise<PortableDid> {
    try {
      if (!bearerDid) {
        throw new DcxServerError('No bearerDid provided');
      }
      return await bearerDid.export();
    } catch (error: any) {
      console.error(error);
      throw new DcxServerError('Failed to import DID');
    }
  }
}
