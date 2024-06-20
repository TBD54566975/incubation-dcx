import {
  PortableDid,
  BearerDid,
  DidDht,
  DidDhtCreateOptions,
  DidDocument,
  DidDocumentMetadata,
  DidRegistrationResult,
  DidResolutionResult,
} from '@web5/dids';
import { readFile } from 'fs/promises';
import { DcxDidError } from './error.js';
import { Ed25519, Jwk } from '@web5/crypto';
import { dcxEnvConfig } from '../config/index.js';

export class PortableDidBuilder implements PortableDid {
  uri: string;
  document: DidDocument;
  metadata: DidDocumentMetadata;
  privateKeys: Jwk[];

  constructor(
    uri: string,
    document: DidDocument,
    metadata: DidDocumentMetadata,
    privateKeys: Jwk[],
  ) {
    this.uri = uri;
    this.document = document;
    this.metadata = metadata;
    this.privateKeys = privateKeys;
  }
}

export type DidManagerConfig = {
  did: string;
  bearerDid: BearerDid;
  portableDid: PortableDid;
};

export const JWK_PRIVATE_KEY_FORMAT = { crv: 'Ed25519', kty: 'OKP', x: '' };

export class DidUtil {
  /**
   *
   * Uses Ed25519 to generate a private key; see {@link Ed25519.computePublicKey()}
   * @param privKey the private key to generate the public key from
   * @returns Jwk; see {@link Jwk}
   */
  public static async computeDidJwkPublicKey(privKey: string): Promise<Jwk> {
    try {
      const key = { ...JWK_PRIVATE_KEY_FORMAT, d: privKey } as Jwk;
      const keyPair = await Ed25519.computePublicKey({ key });
      return { ...keyPair, x: keyPair.x };
    } catch (error: any) {
      console.error('computeDidJwkPublicKey', error);
      throw new DcxDidError('Failed to compute public key');
    }
  }

  /**
   *
   * Uses DidDht to create BearerDid; see {@link DidDht.create()}
   * @param options The did dht create options object; see {@link DidDhtCreateOptions}
   * @returns BearerDid; see {@link BearerDid}
   */
  public async createBearerDid(options: DidDhtCreateOptions<any>): Promise<BearerDid> {
    try {
      return await DidDht.create({ options });
      // const portableDid = await bearerDid.export();
    } catch (error: any) {
      console.error('createBearerDid', error);
      throw new DcxDidError('Failed to create bearerDid');
    }
  }

  /**
   *
   * Uses DidDht and a didUri to resolve the corresponding didDocument; see {@link DidDht.resolve()}
   * @param didUri the uri to resolve
   * @returns DidResolutionResult; see {@link DidResolutionResult}
   */
  public async resolveDidDoc(didUri: string): Promise<DidResolutionResult> {
    try {
      return await DidDht.resolve(didUri);
    } catch (error) {
      console.error('resolveDidDoc', error);
      throw new DcxDidError('Failed to resolve didDocument using didUri');
    }
  }
}

export class DidManager extends DidUtil {
  public did: string;
  public bearerDid: BearerDid;
  public portableDid: PortableDid;

  constructor(config: DidManagerConfig) {
    super();
    this.bearerDid = config.bearerDid;
    this.portableDid = config.portableDid;
    this.did = config.did;
  }

  /**
   *
   * @param gatewayUri the uri of the gateway to publish the did to
   * @returns DidRegistrationResult; see {@link DidRegistrationResult}
   */
  public async publishDidDoc(
    gatewayUri: string = dcxEnvConfig.DHT_GATEWAY_ENDPOINT,
  ): Promise<DidRegistrationResult> {
    try {
      return await DidDht.publish({ did: this.bearerDid, gatewayUri });
    } catch (error) {
      console.error('publishDidDoc', error);
      throw new DcxDidError('Failed to publish did to gateway');
    }
  }

  /**
   *
   * Uses DidDht to handle importing a portable did bearer did; see {@link DidDht.import()}
   * @param didFilepath the path to the file containing the portable did object; see {@link PortableDid}
   * @returns BearerDid; see {@link BearerDid}
   */
  public async importPortableDidFromFile(didFilepath: string): Promise<BearerDid> {
    try {
      const didFileString = (await readFile(didFilepath))?.toString();
      const portableDid = JSON.parse(didFileString);
      this.portableDid = portableDid;
      return await this.importPortableDid(portableDid);
    } catch (error: any) {
      console.error('importPortableDidFromFile', error);
      throw new DcxDidError('Failed to import portableDid from didFilepath');
    }
  }

  /**
   * Uses DidDht to handle instantiating bearer did from corresponding portable did; see {@link DidDht.import()}
   * @param portableDid a portable did object; see {@link PortableDid}
   * @returns BearerDid; see {@link BearerDid}
   */
  public async importPortableDid(portableDid: PortableDid): Promise<BearerDid> {
    try {
      const bearerDid = await DidDht.import({ portableDid: this.portableDid ?? portableDid });
      this.bearerDid = bearerDid;
      return bearerDid;
    } catch (error: any) {
      console.error('importPortableDid', error);
      throw new DcxDidError('Failed to import portableDid');
    }
  }
}
