import { DcxApplicant } from '@dcx-protocol/applicant';
import { DcxPath, DcxServerError, Handler, Issuer, Manifest, Provider } from '@dcx-protocol/common';
import { DcxIssuer } from '@dcx-protocol/issuer';
import { argv } from 'process';
import { ApplicantServer } from './index.js';
import { IssuerServer } from './issuer/index.js';

export interface IDcxServer {
    isTest    : boolean;
    isPolling : boolean;
    dcx       : DcxIssuer | DcxApplicant;
    server    : IssuerServer | ApplicantServer;

    use(path: string, ...args: any[]): void;
    useManifest(manifest: Manifest): void;
    useHandler(handler: Handler): void;
    useProvider(provider: Provider): void;
    useIssuer(issuer: Issuer): void;
    useDwn(dwn: string): void;
    useGateway(gateway: string): void;
}

export interface DcxServerParams {
    issuer?: DcxIssuer;
    applicant?: DcxApplicant
    type?: 'issuer' | 'applicant';
}

export class DcxServer implements IDcxServer {
  isPolling : boolean = false;
  isTest    : boolean = process.env.NODE_ENV?.includes('test') || argv.slice(2).some((arg) => ['--test', '-t'].includes(arg));

  dcx       : DcxIssuer | DcxApplicant;
  server    : IssuerServer | ApplicantServer;

  constructor(params: DcxServerParams) {
    if(params.type === 'applicant' || params.applicant) {
      this.dcx = params.applicant ?? new DcxApplicant({});
      this.server = new ApplicantServer({
        type      : 'applicant',
        applicant : this.dcx as DcxApplicant
      });
    } else if (params.type === 'issuer' || params.issuer) {
      this.dcx = params.issuer ?? new DcxIssuer({});
      this.server = new IssuerServer({
        type      : 'issuer',
        issuer    : this.dcx as DcxIssuer
      });
    } else {
      throw new DcxServerError('Invalid server params: must be pass type  "applicant" or "issuer" or must pass an applicant or issuer object');
    }
  }

  /**
   *
   * Sets the server options
   *
   * @param path The type of server option; see {@link DcxPath}
   * @param id Some unique, accessible identifier to map the obj to
   * @param obj The object to use; see {@link DcxOptions}
   * @example see README.md for usage information
   *
   */
  public use(path: DcxPath, ...args: any[]): void {
    const validPaths = ['gateways', 'dwns', 'issuers', 'manifests', 'providers', 'handlers'];
    if (!validPaths.includes(path)) {
      throw new DcxServerError(
        `Invalid server.use() name: ${path}. Must be one of: ${validPaths.join(', ')}`,
      );
    }
    if (validPaths.includes(path)) {
      this.dcx.options[path].push(...args);
    } else {
      throw new DcxServerError(`Invalid server.use() object: ${args}`);
    }
  }

  /**
   *
   * Sets the manifest to use
   *
   * @param id Some unique, accessible identifier for the manifest
   * @param manifest The credential manifest to use
   * @example see README.md for usage information
   *
   */
  public useManifest(manifest: Manifest): void {
    this.dcx.options.manifests.push(manifest);
  }

  /**
   *
   * Sets the handler to use
   *
   * @param id Some unique, accessible identifier for the handler
   * @param handler The handler to use
   * @example see README.md for usage information
   *
   */
  public useHandler(handler: Handler): void {
    this.dcx.options.handlers.push(handler);
  }

  /**
   *
   * Sets the provider to use
   *
   * @param id Some unique, accessible identifier for the provider
   * @param provider The provider to use
   * @example see README.md for usage information
   *
   */
  public useProvider(provider: Provider): void {
    this.dcx.options.providers.push(provider);
  }

  /**
   *
   * Sets the issuer to use
   *
   * @param id Some unique, accessible identifier for the issuer
   * @param issuer The issuer to use
   * @example see README.md for usage information
   *
   */
  public useIssuer(issuer: Issuer): void {
    this.dcx.options.issuers.push(issuer);
  }

  /**
   *
   * Sets the dwns to use
   *
   * @param dwn The dwn to use
   * @example see README.md for usage information
   *
   */
  public useDwn(dwn: string): void {
    this.dcx.options.dwns.push(dwn);
  }

  /**
   *
   * Sets the gateways to use
   *
   * @param gateway The gateway to use'
   * @example see README.md for usage information
   *
   */
  public useGateway(gateway: string): void {
    this.dcx.options.gateways.push(gateway);
  }
}