import { Handler, Issuer, Manifest, Provider } from '../index.js';

export type HandlerFunction = (...args: any[]) => any | Promise<any>;
export type DcxOptions = {
  handlers: Handler[];
  providers: Provider[];
  manifests: Manifest[];
  issuers: Issuer[];
  gateways: string[];
  dwns: string[];
};
