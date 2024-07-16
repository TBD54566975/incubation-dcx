# Decentralized Credential Exchange (DCX)

DCX is a new DWeb Node (DWN) procotol meant to facilitate the exchange of verifiable credentials between applicants and issuers. DCX is a "credentials in, credentials out" asynchronous web server that manages these interactions. The protocol is open and permissionless leveraging the benefits of DWNs, Verifiable Credentials (VCs) and many other powerful Web5 primitives. As mentioned above, the protocol is designed to facilitate the decentralized exchange of credentials between applicants, issuers and data providers; more specifically, DCX interacts with applicant and issuer DWNs performing CRUD operations on DWN Records. Different types of DWN record schemas are defined to represent different messages being sent to/from different actors. These records contain informatino about the VCs required as inputs to the DCX server to received as outputs different VCs.

[Credential Manifests](https://identity.foundation/credential-manifest/) are a big part of what makes DCX work. These documents outline key pieces of information:
1. The input credentials required by the issuer
2. The output credential(s) the applicant can expect
3. Data formatting preferences

> Credential Manifests are a resource format that defines preconditional requirements, Issuer style preferences, and other facets. User Agents utilize to help articulate and select the inputs necessary for processing and issuance of a specified credential.
> 
> A Credential Manifest is a document, hosted by an Issuer and consumed by User Agents, codifying the credentials that it issues in terms of pre-requisites and inputs. These can be static or dynamic, but their form and usage are detailed in this specification.

Applicants pull these manifest records from the issuer's DWN, so they can understand what VCs are required on their side of the exchange. For more details on protocol interactions between issuers and applicants, see the diagrams in the [Architecture](#architecture) and [Sequence](#sequence) sections below.

[Protocol](./src/protocol/)
  - [`src/protocol/credential-issuer.ts`](./src/protocol/credential-issuer.ts) defines credential issuer protocol
  - [`src/protocol/credential-applicant.ts`](./src/protocol/credential-applicant.ts) defines credential applicant protocol

[Record Schemas](./src/schemas/)
  - [`src/schemas/invoice.ts`](./src/schemas/invoice.ts) defines the schema for invoice records
  - [`src/schemas/manifest.ts`](./src/schemas/manifest.ts) defines schema for manifest records
  - [`src/schemas/application.ts`](./src/schemas/application.ts) defines schema for application records
  - [`src/schemas/response.ts`](./src/schemas/response.ts) defines schema for response records

[Credential Manifests](./EXAMPLE-MANIFEST.json)
  - [`EXAMPLE-MANIFEST.json`](./EXAMPLE-MANIFEST.json) defines an example manifest
  - **NOTE**: Manifests do not ship with the DCX package. Developers are required to provide their own manifests when building their DCX issuer server
  - See [Usage](#Usage) for how to provide manifests

## Docs & Diagrams

Additional docs & diagram files can be found in the [/docs](/docs) folder.

- [DEVELOPMENT.md](./docs/DEVELOPMENT.md) Lists current issues and PRs
- [SUMMARY.md](./docs/SUMMARY.md) Shorter summary about DCX

### Architecture Diagram

#### Actors
- **DCX**: Protocol boundary within which actors communicate
- **DCX Issuer**: Web server running @web5/dcx and web5-js
- **Issuer DWN**: DCX Issuer's DWN server running dwn-sdk-js
- **DCX Applicant**: User client application running @web5/dcx and web5-js
- **Applicant DWN**: DCX Applicant's DWN server running dwn-sdk-js

![dcx-architecture](./docs/img/dcx-architecture.png)

### Sequence Diagrams

#### Full Protocol

<details>

1.  DCX Issuer configures Issuer DWN with dcx protocol: credential-issuer and credential-applicant
2.  DCX Issuer creates credential manifest record in Issuer DWN
3.  DCX Issuer creates subscription to Issuer DWN
4.  DCX Applicant creates subscription to Applicant DWN 
5.  DCX Applicant reads credential manifest record from Issuer DWN 
6.  DCX Applicant acquires required credentials from issuers listed in manifest
7.  DCX Applicant creates application record in Issuer DWN
8.  DCX Issuer reads application record via Issuer DWN subscription
9.  DCX Issuer uses @web5/dcx to verify application record credentials against credential manifest 
10. DCX Issuer creates response record in Applicant DWN
11. DCX Applicant reads response record via Applicant DWN subscription
12. DCX Issuer creates invoice record in Applicant DWN
13. DCX Applicant reads invoice record via Applicant DWN subscription
</details>
<br />

![dcx-full-sequence](./docs/img/dcx-full-sequence.png)

<details>
<summary>Notes</summary>

1. Credential-issuer and credential-applicant protocols defines DWN record CRUD actions between Issuer and Applicant
2. under the credential-issuer manifest route
3. Subscription to receive incoming application records
4. Subscription to receive incoming response records
5. Defines required "credentials in" to receive desired "credentials out"
6. Credentials are acquired separately, outside of DCX protocol, from listed trusted issuers
7. Application record includes credentials that satisfy credential manifest mentioned in step 5
9. DCX Issuer validates credentials against credential manifest using DCX software handlers

</details>

#### Issuer Protocol

<details>

1. DCX Issuer configures Issuer DWN with dcx protocol (issuer & applicant)
2. DCX Issuer creates credential manifest record in Issuer DWN
3. DCX Issuer creates subscription to Issuer DWN
4. DCX Issuer reads application record via Issuer DWN subscription
5. DCX Issuer uses DCX software handlers to verify credentials against credential manifest
6. DCX Issuer configures DWN with DCX Issuer protocol
7. DCX Issuer creates DWN manifest record in own DWN to define required credentials to obtain other credentials
8. DCX Issuer subscribes to own DWN to listen for application records
9. DCX Issuer reads an incoming application record and validates against respective credential manifest
10. DCX Issuer creates application response or denial record and sends to applicant DWN
11. DCX Issuer creates invoice response record and sends to applicant DWN
</details>
<br />

![dcx-issuer-sequence](./docs/img/dcx-issuer-sequence.png)

#### Applicant Protocol

<details>

1. DCX Applicant configures Applicant DWN with dcx protocol (issuer & applicant)
2. DCX Applicant creates subscription to Applicant DWN 
3. DCX Applicant reads credential manifest record from Issuer DWN
4. DCX Applicant acquires required credentials from issuers listed in manifest
5. DCX Applicant creates application record in Issuer DWN
6. DCX Applicant reads response record via Applicant DWN subscription
7. DCX Applicant reads invoice record via Applicant DWN subscription (optional)
</details>
<br />

![dcx-applicant-sequence](./docs/img/dcx-applicant-sequence.png)


## Package Versions

| Name                                                 |                                                                Latest Version                                                                 |
| ---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------: |
| [@formfree/dcx](/src) | [![badge](https://img.shields.io/npm/v/@formfree/dcx)](https://www.npmjs.com/package/@formfree/dcx/common) |
<!-- | [@formfree/dcx](/src) | [![badge](https://img.shields.io/npm/v/@formfree/dcx)](https://www.npmjs.com/package/@formfree/dcx/common) | -->
<!-- | [@formfree/dcx](/src) | [![badge](https://img.shields.io/npm/v/@formfree/dcx)](https://www.npmjs.com/package/@formfree/dcx/common) | -->


## Usage

Import the `server` from `@formfree/dcx` and run `.start()` to simply run the server as-is.

```ts
import { server } from '@formfree/dcx';
await server.start();
```

You can also import the `DcxServer` class and pass options to customize the server
```ts
import DcxServer from "@formfree/dcx";

const server = new DcxServer({
    issuers: new Map([['issuer1', { name: 'issuer1', id: 'did:dht:issuer123xyz' }]]),
    manifests: new Map([/* Define your custom manifest entries */]),
    providers: new Map([/* Define your custom providers entries */]),
    handlers: new Map([/* Define your custom handlers entries */]),
    gateways: new Map([/* Define your custom gateways entries */])
});

await server.start();
```

However, using the server this was alone is limited to local development.
To customize local dev and/or prepare for prod, you must provide your own credential manifest(s).
You can leverate the `.use()` method on the server to define custom server options like custom manifests.

### Use Manifest

To define your own manifests, you can leverage `server.use('manifest' ... )` to pass in your own.
An example manifest can be found [here](./src/protocol/manifests/) to use for accepting and issuing VCs

```typescript
import CustomManifest from './CUSTOM-MANIFEST.json';
import { server } from '@formfree/dcx';

// Define manifest in local json file, import and pass into server
server.use('manifest', CustomManifest.id, CustomManifest);

// Or define manifest directly into .use method
server.use('manifest', 'dcx-credential-manifest-example', {
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

await server.start();
```

### Use Issuer

You can define your own set of trusted issuers using `server.use('issuer' ...`. The list of issuers defined will be used
when an application is processed. The issuers of the input VCs will be compared to this list. 
DCX defined 1 default issuer if none are provided. See [Config](./src/core/config.ts) or below example for details.

```ts
import { server } from './src/index';

server.use('issuer', 'mx',
    {
        name: 'MX Technologies',
        id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo'
    }
);

await server.start();
```

### Use Provider

You can define your own VC data providers using `server.use('provider' ...`. Ideally, you only define 1 provider, but
the server can handle multiple for different development contexts (i.e. development, testing, production).

```ts
import { server } from './src/index';

// development
server.use('provider', 'development',
    {
        method: 'POST',
        endpoint: 'http://localhost:4000/api/v1/vc/data'
    }
);

// production
server.use('provider', 'production',
     {
         name: "Some Third Party Provider",
         method: 'POST',
         endpoint: 'http://api.provider.com/v1/vc/data',
         headers: { 'Authorization': `Bearer ${process.env.PROVIDER_AUTHORIZATION_BEARER_TOKEN}`, }
     }
);

await server.start();
```

### Use Handler

You can define your own set of protocol handlers using `server.use('handler' ...`. The custom handlers you define should
either overwrite and/or work with the existing default ones. See [handlers.ts](./src/protocol/handlers.ts) for the inputs/outputs
expected by the default handlers. Default handler names are: `selectCredentials`, `verifyCredentials`, `requestCredential`, `issueCredential`.

```ts
import { server } from './src/index';

async function requestCredentialCustom(){ 
    return await fetch('http://api.example.com/v1/vc-data', /* ... */)
};
server.use('handler', 'requestCredential', requestCredentialCustom);

await server.start();
```

### Use Gateway

You can define your own DHT Gateway using `server.use('gateway' ...`. At the moment, this has no impact.
DCX defaults to using TBD or FormFree DHT gateways. This can be used to easily toggle between dev envs.

```ts
import { server } from './src/index';

// development
server.use('gateway', 'development',
    {
        id: 'localhost',
        uri: 'http://localhost:8305'
    }
);

// production
server.use('gateway', 'production',
    {
        id: 'your-production',
        uri: 'https://dht.your-production.com'
    }
);

await server.start();
```

Putting it all together into 1 example

```ts
import CustomManifest from './CUSTOM-MANIFEST.json';
import { server } from '@formfree/dcx';

server.use('manifest', CustomManifest.id, CustomManifest);
server.use('issuer', 'mx', { name: 'MX Technologies', id: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo' });
server.use('handler', 'requestCredential', () => { return await fetch('http://api.example.com/v1/vc-data', /* ... */) });
server.use('gateway', 'development', { id: 'localhost', uri: 'http://localhost:8305' });

await server.start();

process.on('SIGTERM', () => {
    server.stop();
});
```

## Project Resources

| Resource                                   | Description                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| [CODEOWNERS](./CODEOWNERS)                 | Outlines the project lead(s)                                                  |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Expected behavior for project contributors, promoting a welcoming environment |
| [CONTRIBUTING.md](./CONTRIBUTING.md)       | Developer guide to build, test, run, access CI, chat, discuss, file issues    |
| [GOVERNANCE.md](./GOVERNANCE.md)           | Project governance                                                            |
| [LICENSE](./LICENSE)                       | [![Apache License 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) |
