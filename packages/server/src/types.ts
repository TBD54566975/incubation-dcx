import { DcxPath, Handler, Manifest, Provider, TrustedIssuer } from '@dcx-protocol/common';

export interface IServer {
    use(path: DcxPath, ...args: any[]): void;
    useManifest(manifest: Manifest): void;
    useHandler(handler: Handler): void;
    useProvider(provider: Provider): void;
    useIssuer(issuer: TrustedIssuer): void;
    useDwn(dwn: string): void;
    useGateway(gateway: string): void;
}