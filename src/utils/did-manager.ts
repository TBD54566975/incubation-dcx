import { Ed25519, Jwk } from '@web5/crypto';
import {
  BearerDid,
  DidDht,
  DidDhtCreateOptions,
  DidRegistrationResult,
  DidResolutionResult,
  PortableDid
} from '@web5/dids';
import { readFile } from 'fs/promises';
import { dcxEnvConfig } from '../config/env-config.js';
import { DidManagerConfig, JWK_PRIVATE_KEY_FORMAT } from '../types/did.js';
import { handleAsyncErrors } from './error.js';

export class DidManagerBuilder {
  public did: string;
  public bearerDid: BearerDid;
  public portableDid: PortableDid;

  constructor(config: DidManagerConfig) {
    this.bearerDid = config.bearerDid;
    this.portableDid = config.portableDid;
    this.did = config.did;
  }
}
export class DidUtil extends DidManagerBuilder {
  /**
  *
  * Uses Ed25519 to generate a private key; see {@link Ed25519.computePublicKey()}
  * @param privKey the private key to generate the public key from
  * @returns Jwk; see {@link Jwk}
  */
  @handleAsyncErrors
  public static async computeDidJwkPublicKey(privKey: string): Promise<Jwk | void | TypedPropertyDescriptor<any>> {
    const key = { ...JWK_PRIVATE_KEY_FORMAT, d: privKey } as Jwk;
    const keyPair = await Ed25519.computePublicKey({ key });
    return { ...keyPair, x: keyPair.x } as Jwk;
  }

  /**
   *
   * Uses DidDht to create BearerDid; see {@link DidDht.create()}
   * @param options The did dht create options object; see {@link DidDhtCreateOptions}
   * @returns BearerDid; see {@link BearerDid}
   */
  @handleAsyncErrors
  public static async createBearerDid(options: DidDhtCreateOptions<any>): Promise<BearerDid> {
    return await DidDht.create({ options });
  }

  /**
   *
   * Uses DidDht and a didUri to resolve the corresponding didDocument; see {@link DidDht.resolve()}
   * @param didUri the uri to resolve
   * @returns DidResolutionResult; see {@link DidResolutionResult}
   */
  @handleAsyncErrors
  public static async resolveDidDoc(didUri: string): Promise<DidResolutionResult> {
    return await DidDht.resolve(didUri);
  }
}

export class DidManager extends DidUtil {
  /**
 *
 * @param gatewayUri the uri of the gateway to publish the did to
 * @returns DidRegistrationResult; see {@link DidRegistrationResult}
 */
  @handleAsyncErrors
  public async publishDidDoc(gatewayUri: string = dcxEnvConfig.DHT_GATEWAY_ENDPOINT): Promise<DidRegistrationResult> {
    return await DidDht.publish({ did: this.bearerDid, gatewayUri });
  }

  /**
   *
   * Uses DidDht to handle importing a portable did bearer did; see {@link DidDht.import()}
   * @param didFilepath the path to the file containing the portable did object; see {@link PortableDid}
   * @returns BearerDid; see {@link BearerDid}
   */
  @handleAsyncErrors
  public async importPortableDidFromFile(didFilepath: string): Promise<BearerDid> {
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
  @handleAsyncErrors
  public async importPortableDid(portableDid: PortableDid): Promise<BearerDid> {
    const bearerDid = await DidDht.import({ portableDid: this.portableDid ?? portableDid });
    this.bearerDid = bearerDid;
    return bearerDid;
  }
}
