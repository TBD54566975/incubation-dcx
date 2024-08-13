import {
  BearerDid,
  DidDht,
  DidDhtCreateOptions,
  DidRegistrationResult,
  DidResolutionResult,
  PortableDid,
} from '@web5/dids';
import { FileSystem } from './utils/file-system.js';
import { dcxConfig } from './dcx-config.js';
import { LocalKeyManager } from '@web5/crypto';

/**
 * DidDhtManager handles interactions between the DCX server and the DID
 */
export class DidDhtManager {
  did: string;
  bearerDid: BearerDid;

  constructor(bearerDid: BearerDid) {
    this.bearerDid = bearerDid;
    this.did  = bearerDid.uri;
  }

  async initKeyManagement(portableDid: PortableDid) {
    portableDid ??= await this.getPortableDid();
    // Determine which key manager to use based on the environment
    const keyManager = new LocalKeyManager() as any;
    // Create a new DID
    return !portableDid
      ? await this.createBearerDid(keyManager)
      : await this.importPortableDid({ portableDid, keyManager });
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

  public async getPortableDid(): Promise<PortableDid> {
    return this.bearerDid.export();
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
    gatewayUri ??= dcxConfig.endpoints.gateways[0];
    return await DidDht.publish({ did: this.bearerDid, gatewayUri });
  }

  /**
   *
   * Uses DidDht to handle importing a portable did bearer did; see {@link DidDht.import()}
   * @param didFilepath the path to the file containing the portable did object; see {@link PortableDid}
   * @returns BearerDid; see {@link BearerDid}
   */
  public async importPortableDidFromFile(didFilepath: string): Promise<BearerDid> {
    const portableDid = await FileSystem.readToJson(didFilepath);
    this.bearerDid = await this.importPortableDid({ portableDid });
    return this.bearerDid;
  }

  /**
   * Uses DidDht to handle instantiating bearer did from corresponding portable did; see {@link DidDht.import()}
   * @param portableDid a portable did object; see {@link PortableDid}
   * @returns BearerDid; see {@link BearerDid}
   */
  public async importPortableDid(params: { portableDid?: PortableDid, keyManager?: LocalKeyManager }): Promise<BearerDid> {
    params.portableDid ??= await this.getPortableDid();
    params.keyManager ??= new LocalKeyManager();
    this.bearerDid = await DidDht.import({ portableDid: params.portableDid, keyManager: params.keyManager });
    return this.bearerDid;
  }
}
