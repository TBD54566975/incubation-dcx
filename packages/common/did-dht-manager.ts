import {
  BearerDid,
  DidDht,
  DidDhtCreateOptions,
  DidRegistrationResult,
  DidResolutionResult,
  PortableDid,
} from '@web5/dids';
import { FileSystem } from '../utils/file-system.js';
import { Config } from './config.js';
import IssuerServer from '../../issuer/server.js';

/**
 * DidDhtManager handles interactions between the DCX server and the DID
 */
export class DidDhtManager {
  public did: string;
  public bearerDid: BearerDid;
  public portableDid: PortableDid;

  constructor(did: string, bearerDid: BearerDid, portableDid: PortableDid) {
    this.did = did;
    this.bearerDid = bearerDid;
    this.portableDid = portableDid;
  }

  /**
   *
   * Uses DidDht to create BearerDid; see {@link DidDht.create()}
   * @param options The did dht create options object; see {@link DidDhtCreateOptions}
   * @returns BearerDid; see {@link BearerDid}
   */
  public async createBearerDid(options: DidDhtCreateOptions<any>): Promise<BearerDid> {
    this.bearerDid = await DidDht.create({ options });
    return this.bearerDid;
  }

  /**
   *
   * Uses DidDht and a didUri to resolve the corresponding didDocument; see {@link DidDht.resolve()}
   * @param didUri the uri to resolve
   * @returns DidResolutionResult; see {@link DidResolutionResult}
   */
  public async resolveDidDoc(didUri: string): Promise<DidResolutionResult> {
    return await DidDht.resolve(didUri);
  }

  /**
   *
   * @param gatewayUri the uri of the gateway to publish the did to
   * @returns DidRegistrationResult; see {@link DidRegistrationResult}
   */
  public async publishDidDoc(gatewayUri: string): Promise<DidRegistrationResult> {
    gatewayUri ??= IssuerServer.useOptions.gateways?.[0] ?? Config.DEFAULT_GATEWAY_URIS[0];
    return await DidDht.publish({ did: this.bearerDid, gatewayUri });
  }

  /**
   *
   * Uses DidDht to handle importing a portable did bearer did; see {@link DidDht.import()}
   * @param didFilepath the path to the file containing the portable did object; see {@link PortableDid}
   * @returns BearerDid; see {@link BearerDid}
   */
  public async importPortableDidFromFile(didFilepath: string): Promise<BearerDid> {
    this.portableDid = await FileSystem.readToJson(didFilepath);
    return await this.importPortableDid(this.portableDid);
  }

  /**
   * Uses DidDht to handle instantiating bearer did from corresponding portable did; see {@link DidDht.import()}
   * @param portableDid a portable did object; see {@link PortableDid}
   * @returns BearerDid; see {@link BearerDid}
   */
  public async importPortableDid(portableDid: PortableDid): Promise<BearerDid> {
    this.bearerDid = await DidDht.import({ portableDid: this.portableDid ?? portableDid });
    return this.bearerDid;
  }
}
