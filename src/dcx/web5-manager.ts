import { Web5PlatformAgent } from '@web5/agent';
import { Web5 } from '@web5/api';
import { DidDhtManager } from './did-dht-manager.js';

/**
 * Web5Manager handles interactions between the DCX server and the Web5 platform
 */
export class Web5Manager {
  public static web5: Web5;
  public static agent: Web5PlatformAgent;
  public static connected: DidDhtManager;
}
