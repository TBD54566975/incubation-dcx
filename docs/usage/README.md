# Usage
# ***OUTDATED*** - TODO: update usage guide
See below for how to install and use the DCX protocol.

## Install

To install the entire protocol suite
```bash
npm install @dcx-protocol/root
```

To install only the applicant side
```bash
npm install @dcx-protocol/common @dcx-protocol/applicant
```

To install only the issuer side
```bash
npm install @dcx-protocol/common @dcx-protocol/issuer
```

## Examples

Import the `server` from `@dcx-protocol/issuer` and run `.start()` to simply run the server as-is.

```ts
import { server } from '@dcx-protocol/issuer';
await server.start();
```

You can also import the `DcxServer` class and pass options to customize the server
```ts
import ExampleManifest from '@dcx-protocol/root';
import DcxServer from "@dcx-protocol/issuer";
const server = new DcxServer();

const server = new DcxServer({
    manifests: [ExampleManifest],
    providers: [{
        id: ExampleManifest.output_descriptors[0].id,
        method: 'POST',
        endpoint: 'http://localhost:4000/api/v1/vc/data'
    }],
    dwns: ['http://localhost:3000/']
});

await server.start();
```

However, using the server this was alone is limited to local development.
To customize local dev and/or prepare for prod, you must provide your own credential manifest(s).
You can leverate the `.use()` method on the server to define custom server options like custom manifests.

### Use Manifest

To define your own manifests, you can leverage `server.use('manifest' ... )` to pass in your own.
An example manifest can be found in the project root [`EXAMPLE-MANIFEST.json`](/EXAMPLE-MANIFEST.json)

```ts
import ExampleManifest from '@dcx-protocol/root';
import { server } from '@dcx-protocol/issuer';

// Define manifest in local json file, import and pass into server
server.use('manifest', ExampleManifest);

// Or define manifest directly into .use method
server.use('manifest',  {
    "id": "dcx-credential-manifest-example",
    "name": "DCX Credential Manifest Example",
    "description": "This is an example of a credential manifest used by DCX. This document should be replaced with your own version to satify the requirements of the credentials your DCX server expects as inputs and the desired output credential.",
    "spec_version": "https://identity.foundation/credential-manifest/spec/v1.0.0/",
    "issuer": {
        "id": "[replaced dynamically]",
        "name": "example-issuer"
    },
    "output_descriptors": [
        {
            "id": "example-output-descriptor-id",
            "name": "Example Output Descriptor Name",
            "schema": "https://example.com/schemas/ExampleOutputDescriptorSchema"
        }
    ],
    "format": {
        "jwt_vc": {
            "alg": [
                "EdDSA"
            ]
        }
    },
    "presentation_definition": {
        "id": "example-presentation-definition-id",
        "input_descriptors": [
            {
                "id": "example-presentation-definition-input-descriptor-id",
                "purpose": "Meant as an example to developers",
                "constraints": {
                    "fields": [
                        {
                            "path": [
                                "$.type[*]"
                            ],
                            "filter": {
                                "type": "string",
                                "pattern": "^*$"
                            }
                        },
                        {
                            "path": [
                                "$.credentialSubject.some.unique.field1",
                                "$.credentialSubject.some.unique.field2",
                                "$.credentialSubject.some.unique.fieldn"
                            ]
                        }
                    ]
                }
            }
        ]
    }
});

// Define provider that your DCX will make API calls to for VC data
server.use('provider',
  {
    id: ExampleManifest.output_descriptors[0].id,
    method: 'POST',
    endpoint: 'http://localhost:4000/api/v1/vc/data'
  }
);

// Define a list of DWN Endpoints
server.use('dwn', 'http://localhost:3000/');

await server.start();
```

### Use Issuer

You can define your own set of trusted issuers using `server.use('issuer' ...`. The list of issuers defined will be used
when an application is processed. The issuers of the input VCs will be compared to this list. DCX defines 1 default issuer if none are provided. See [/packages/common/src/config.ts](/packages/common/src/config.ts) and [/packages/issuer/src/config.ts](/packages/issuer/src/config.ts) for details.

```ts
import { server } from '@dcx-protocol/issuer';

server.use('issuer',
    {
        name: 'mx',
        id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'
    }
);

await server.start();
```

### Use Provider

You can define your own VC data providers using `server.use('provider' ...`. Ideally, you only define 1 provider, but
the server can handle multiple for different development contexts (i.e. development, testing, production).

```ts
import { server } from '@dcx-protocol/issuer';

const env = process.env.NODE_ENV || 'development';
// development
server.use('provider',
    {
        env,
        method: 'POST',
        endpoint: 'http://localhost:4000/api/v1/vc/data'
    }
);

// production
server.use('provider',
     {
        env,
        name: "Some Third Party Provider",
        method: 'POST',
        endpoint: 'http://api.provider.com/v1/vc/data',
        headers: { 'Authorization': `Bearer some-Bearer-Token`, }
     }
);

await server.start();
```

### Use Handler

You can define your own set of protocol handlers using `server.use('handler' ...`. The custom handlers you define should
either overwrite and/or work with the existing default ones. See [/packages/issuer/src/handlers.ts](/packages/issuer/src/handlers.ts) for the inputs/outputs expected by the default handlers. Default handler names are: `selectCredentials`, `verifyCredentials`, `requestCredential`, `issueCredential`.

```ts
import { server } from '@dcx-protocol/issuer';

async function requestCredentialCustom(){ 
    return await fetch('http://api.example.com/v1/vc-data', /* ... */)
};
server.use('handler', 'requestCredential', requestCredentialCustom);

await server.start();
```

### Use Gateway

You can define your own DHT Gateway using `server.use('gateway' ...`. At the moment, this has no impact.
DCX defaults to using TBD or FormFree DHT gateways.

```ts
import { server } from '@dcx-protocol/issuer';

// development
server.use('gateway', 'http://localhost:8305');

await server.start();
```

### Use DWN

You can define your own DWN endpoint using `server.use('dwn' ...`.
```ts
import { server } from '@dcx-protocol/issuer';

// development
server.use('dwn', 'http://localhost:3000');

await server.start();
```

## Full Example

Putting it all together into 1 example

```ts
import ExampleManifest from '@dcx-protocol/root';
import { server } from '@dcx-protocol/issuer';

server.use('manifest', ExampleManifest);
server.use('issuer', { name: 'MX Technologies', id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo' });
server.use('provider',
     {
        env,
        name: "Some Third Party Provider",
        method: 'POST',
        endpoint: 'http://api.provider.com/v1/vc/data',
        headers: { 'Authorization': `Bearer some-Bearer-Token`, }
     }
);
async function requestCredentialCustom(){ 
    return await fetch('http://api.example.com/v1/vc-data', /* ... */)
};
server.use('handler', 'requestCredential', requestCredentialCustom);
server.use('gateway', 'http://localhost:8305');
server.use('dwn', 'http://localhost:3000');
await server.start();
```