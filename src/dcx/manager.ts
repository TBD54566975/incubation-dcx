import { Web5 } from '@web5/api';
import { DcxAgent } from './agent.js';
import { DidDhtManager } from './did-dht-manager.js';
import { DcxIdentityVault } from './identity-vault.js';

/**
 * DcxManager handles interactions between the DCX server and the Web5 platform
 */
export abstract class DcxManager {
  public static web5: Web5;
  public static connected: DidDhtManager;
  public static dcxAgent: DcxAgent;
  public static dcxAgentVault: DcxIdentityVault;
}
