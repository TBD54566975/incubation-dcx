import { Handler, Manifest, Provider, TrustedIssuer } from '../index.js';

export type HandlerFunction = (...args: any[]) => any | Promise<any>;
export type DcxOptions = {
  handlers: Handler[];
  providers: Provider[];
  manifests: Manifest[];
  issuers: TrustedIssuer[];
  gateways: string[];
  dwns: string[];
};
