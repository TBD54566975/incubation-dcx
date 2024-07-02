/*
import DcxServer from './src/index';
const server = new DcxServer();
*/
import { Issuer, Provider, Manifest, Gateway } from './src/index';
import { ProtocolHandlers } from './src/index';
import { server } from './src/index';
/**
 * 
 * Use manifest lets you define the {@link Manifest} to use for your DCX server 
 */
server.use('manifest', 'ATP-REPORT',
    {
        "id": "ATP-REPORT",
        "name": "FormFree RIKI ATP",
        "description": "FormFree RIKI ATP Credential Manifest",
        "output_descriptors": [
            {
                "id": "atp-report",
                "name": "ATP Report",
                "schema": "https://formfree.com/schemas/ATPReportCredential"
            }
        ],
        "format": {
            "jwt_vc": {
                "alg": [
                    "EdDSA"
                ]
            }
        },
        "spec_version": "https://identity.foundation/credential-manifest/spec/v1.0.0/",
        "issuer": {
            "id": "[replaced dynamically]",
            "name": "FormFree RIKI ATP",
        },
        "presentation_definition": {
            "id": "atp-report-encrypted",
            "input_descriptors": [
                {
                    "id": "atp-report-encrypted",
                    "purpose": "Report to decrypt",
                    "constraints": {
                        "fields": [
                            {
                                "path": [
                                    "$.type[*]"
                                ],
                                "filter": {
                                    "type": "string",
                                    "pattern": "^ATPReportEncryptedCredential$"
                                }
                            },
                            {
                                "path": [
                                    "$.credentialSubject.encrypted"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    }
);

/**
 * 
 * Use provider lets you define a third party VC data {@link Provider} to use for your DCX server
 * @example
 * server.use('provider', 'someThirdPartyProvider',
 *      {
 *          name: "Some Third Party Provider",
 *          method: 'POST',
 *          endpoint: 'http://api.provider.com/v1/vc/data',
 *          headers: { 'Authorization': `Bearer ${process.env.PROVIDER_AUTHORIZATION_BEARER_TOKEN}`, }
 *      }
 * );
 * 
 * server.useProvider('someThirdPartyProvider',
 *      {
 *          name: "Some Third Party Provider",
 *          method: 'POST',
 *          endpoint: 'http://api.provider.com/v1/vc/data',
 *          headers: { 'Authorization': `Bearer ${process.env.PROVIDER_AUTHORIZATION_BEARER_TOKEN}`, }
 *      }
 * );
 * 
 */
server.use('provider', 'localhost',
    {
        method: 'POST',
        endpoint: 'http://localhost:4000/api/v1/vc/data'
    }
);

/**
 * 
 * Use issuer lets you define a VC {@link Issuer} to use for your DCX server
 * @example production
 * server.use('issuer', 'mx', 
 *      {
 *          name: 'MX Technologies',
 *          id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'
 *      }
 * );
 * 
 */
server.useIssuer('mx', { name: 'mx', id: 'did:web5:mx' });
server.use('issuer', 'mx',
    {
        name: 'MX Technologies',
        id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'
    }
);


/**
 * 
 * Write your own handlers to overwrite the existing default ones 
 * see src/protocol/handlers.ts for the default handlers
 *     {@link ProtocolHandlers.selectCredentials}
 *     {@link ProtocolHandlers.verifyCredentials} 
 *     {@link ProtocolHandlers.requestCredential}
 *     {@link ProtocolHandlers.issueCredential}
 * 
 */
const requestCredentialCustom = () => console.log("custom requestCredential handler");
server.use('handler', 'requestCredential', requestCredentialCustom);

/**
 * 
 * Use gateway lets you define the DHT {@link Gateway} to use for your DCX server
 * @example production
 * server.use('gateway', 'production',
 *      {
 *          id: 'your-production',
 *          uri: 'https://dht.your-production.com'
 *      }
 * );
 * 
 * server.useGateway('production',
 *      {
 *          id: 'your-production',
 *          uri: 'https://dht.your-production.com'
 *      }
 * );
 * 
 */
server.use('gateway', 'dev',
    {
        id: 'localhost',
        uri: 'http://localhost:8305'
    }
);

await server.start();

process.on('SIGTERM', () => {
    server.stop();
});