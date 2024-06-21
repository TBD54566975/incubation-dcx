import {
  BearerDid,
  DidDht,
  DidDhtCreateOptions,
  DidRegistrationResult,
  DidResolutionResult,
  PortableDid,
} from '@web5/dids';
import { readFile } from 'fs/promises';
import { DcxEnv } from '../config/env.js';
import { AdditionalProperties } from '../types/dcx.js';

export class DidManager {
  public static did: string;
  public static bearerDid: BearerDid;
  public static portableDid: PortableDid & AdditionalProperties;

  /**
   *
   * Uses DidDht to create BearerDid; see {@link DidDht.create()}
   * @param options The did dht create options object; see {@link DidDhtCreateOptions}
   * @returns BearerDid; see {@link BearerDid}
   */
  // @handleAsyncErrors
  public static async createBearerDid(options: DidDhtCreateOptions<any>): Promise<BearerDid> {
    this.bearerDid = await DidDht.create({ options });
    return this.bearerDid;
  }

  /**
   *
   * Uses DidDht and a didUri to resolve the corresponding didDocument; see {@link DidDht.resolve()}
   * @param didUri the uri to resolve
   * @returns DidResolutionResult; see {@link DidResolutionResult}
   */
  // @handleAsyncErrors
  public static async resolveDidDoc(didUri: string): Promise<DidResolutionResult> {
    return await DidDht.resolve(didUri);
  }

  /**
   *
   * @param gatewayUri the uri of the gateway to publish the did to
   * @returns DidRegistrationResult; see {@link DidRegistrationResult}
   */
  // @handleAsyncErrors
  public static async publishDidDoc(
    gatewayUri: string = DcxEnv.DHT_GATEWAY_ENDPOINT,
  ): Promise<DidRegistrationResult> {
    return await DidDht.publish({ did: this.bearerDid, gatewayUri });
  }

  /**
   *
   * Uses DidDht to handle importing a portable did bearer did; see {@link DidDht.import()}
   * @param didFilepath the path to the file containing the portable did object; see {@link PortableDid}
   * @returns BearerDid; see {@link BearerDid}
   */
  // @handleAsyncErrors
  public static async importPortableDidFromFile(didFilepath: string): Promise<BearerDid> {
    const didFileString = (await readFile(didFilepath))?.toString();
    const portableDid = JSON.parse(didFileString);
    this.portableDid = portableDid;
    return await this.importPortableDid(portableDid);
  }

  /**
   * Uses DidDht to handle instantiating bearer did from corresponding portable did; see {@link DidDht.import()}
   * @param portableDid a portable did object; see {@link PortableDid}
   * @returns BearerDid; see {@link BearerDid}
   */
  // @handleAsyncErrors
  public static async importPortableDid(portableDid: PortableDid): Promise<BearerDid> {
    const bearerDid = await DidDht.import({ portableDid: this.portableDid ?? portableDid });
    this.bearerDid = bearerDid;
    return bearerDid;
  }
}
