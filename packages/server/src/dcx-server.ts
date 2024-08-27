import { DcxApplicant } from '@dcx-protocol/applicant';
import { CredentialManifest, DcxPath, DcxServerError, Handler, Provider, stringifier, TrustedIssuer } from '@dcx-protocol/common';
import { DcxIssuer } from '@dcx-protocol/issuer';
import { ApplicantServer } from './applicant-server.js';
import { IssuerServer } from './issuer-server.js';
export interface IServer {
    use(path: DcxPath, ...args: any[]): void;
    useManifest(manifest: CredentialManifest): void;
    useHandler(handler: Handler): void;
    useProvider(provider: Provider): void;
    useIssuer(issuer: TrustedIssuer): void;
    useDwn(dwn: string): void;
    useGateway(gateway: string): void;
}

export type ServerParams = {
    issuer?: DcxIssuer;
    applicant?: DcxApplicant
    type?: 'issuer' | 'applicant';
}

/**
 * @class Server
 * @classdesc The Server class is used to setup the DCX server
 * @implements IServer
 * @param {ServerParams} params The server parameters
 * @param {DcxIssuer} params.issuer The issuer to use for the Server
 * @param {DcxApplicant} params.applicant The applicant to use for the Server
 * @param {string} params.type The type of server to use; either 'issuer' or 'applicant'
 * @example
 * import { Server } from '@dcx-protocol/server';
 * const server = new Server({ type: 'issuer' });
 * server.use('dwns', 'http://localhost:3000');
 * server.use('providers', providerOne);
 * await server.initilaize();
 * await server.model.setup();
 * await server.model.start();
 */
export class DcxServer implements IServer  {
  public listening: boolean = false;
  public testing: boolean = process.env.NODE_ENV?.includes('test') ?? false;

  private _dcx: DcxIssuer | DcxApplicant;
  private _server: IssuerServer | ApplicantServer;

  /**
   *
   * Setup the server with the provided options and config
   * @param params The server parameters; see {@link ServerParams}
   * @param params.type Required; The type of server to use; either 'issuer' or 'applicant'
   * @param params.applicant Optional; The applicant to use for the Server. Pass a custom DcxApplicant object if desired
   * @param params.issuer Optional; The issuer to use for the Ser\ver. Pass a custom DcxIssuer object if desired
   */
  constructor({ type, applicant, issuer }: ServerParams = {}) {
    if (issuer || type === 'issuer') {
      this._dcx = issuer ?? new DcxIssuer();
      this._server = new IssuerServer({ server: this, issuer: this._dcx });
    } else if(applicant || type === 'applicant') {
      this._dcx = applicant ?? new DcxApplicant();
      this._server = new ApplicantServer({ server: this, applicant: this._dcx });
    } else {
      throw new DcxServerError(
        `invalid server params: ${stringifier({ type, applicant, issuer })}` +
        'expected 1 of 3 optional params: "type" to be one of ["issuer", "applicant"], ' +
        '"issuer" to be DcxIssuer() or "applicant" to be DcxApplicant()'
      );
    }
  }

  get applicantServer(): ApplicantServer {
    if (!(this._server instanceof ApplicantServer)) {
      throw new DcxServerError('ApplicantServerNotFound - DcxServer is not an ApplicantServer');
    }
    return this._server;
  }

  get issuerServer(): IssuerServer {
    if (!(this._server instanceof IssuerServer)) {
      throw new DcxServerError('IssuerServerNotFound - DcxServer is not an IssuerServer');
    }
    return this._server;
  }

  get issuer(): DcxIssuer {
    if (!(this._dcx instanceof DcxIssuer)) {
      throw new DcxServerError('DcxIssuerNotFound - DcxServer is not an IssuerServer');
    }
    return this._dcx as DcxIssuer;
  }

  get applicant(): DcxApplicant {
    if (!(this._dcx instanceof DcxApplicant)) {
      throw new DcxServerError('DcxApplicantNotFound - DcxServer is not an ApplicantServer');
    }
    return this._dcx as DcxApplicant;
  }

  /**
   * Sets the server options
   * @param path The type of server option; see {@link DcxPath}
   * @param args The server options to use; see {@link DcxOptions}
   * @throws DcxServerError if the path is invalid
   * @example see docs/usage/README.md for usage information
   */
  public use(path: DcxPath, ...args: any[]): void {
    const validPaths = ['gateways', 'dwns', 'issuers', 'manifests', 'providers', 'handlers'];
    if (!validPaths.includes(path)) {
      throw new DcxServerError(
        `Invalid path: ${path} must be one of ${validPaths.join(', ')}`,
      );
    }
    this._dcx.config[path].unshift(...args);
  }

  /**
   * Sets the manifest to use
   * @param manifest The manifest to use; see {@link CredentialManifest}
   * @example see docs/usage/README.md for usage information
   */
  public useManifest(manifest: CredentialManifest): void {
    this._dcx.config.manifests.unshift(manifest);
  }

  /**
   * Sets the handler to use
   * @param handler The handler to use; see {@link Handler}
   * @example see docs/usage/README.md for usage information
   */
  public useHandler(handler: Handler): void {
    this._dcx.config.handlers.unshift(handler);
  }

  /**
   * Sets the provider to use
   * @param provider The provider to use; see {@link Provider}
   * @example see docs/usage/README.md for usage information
   */
  public useProvider(provider: Provider): void {
    this._dcx.config.providers.unshift(provider);
  }

  /**
   * Sets the issuer to use
   * @param issuer The issuer to use; see {@link TrustedIssuer}
   * @example see docs/usage/README.md for usage information
   */
  public useIssuer(issuer: TrustedIssuer): void {
    this._dcx.config.issuers.unshift(issuer);
  }

  /**
   * Sets the dwn(s) to use
   * @param dwn The dwn to use
   * @example see docs/usage/README.md for usage information
   */
  public useDwn(dwn: string): void {
    this._dcx.config.dwns.unshift(dwn);
  }

  /**
   * Sets the gateways to use
   * @param gateway The gateway to use'
   * @example see docs/usage/README.md for usage information
   */
  public useGateway(gateway: string): void {
    this._dcx.config.gateways.unshift(gateway);
  }
}