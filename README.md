# Decentralized Credential Exchange (DCX)

DCX is a new Decentralized Web Nodes (DWN) protocol that facilitates the decentralized exchange of borrower data for lender money seurely and privately and a npm package that implements the protocol as a one-click server solution. 

As an open, permissionless, "credentials in, credentials out" asynchronous web server, DCX leverages the strongest Web5 primitives: DWNs, Verifiable Credentials (VCs), Credential Manifests, Verifiable Presentations and Presentation Exchange amongst  other important Web5 primitives. DCX facilitates decentralized credential exchange by performing CRUD operations on both applicant and issuer DWNs. Different DWN record schemas represent various messages sent between actors, detailing the VCs required as inputs and outputs for the DCX server.

[Applicant](/packages/applicant)
- [`/packages/applicant/src/protocol.ts`](/packages/applicant/src/protocol.ts) credential applicant protocol definition
- [`/packages/applicant/src/handlers.ts`](/packages/applicant/src/handlers.ts) pre-defined credential applicant protocol handlers
- [`/packages/applicant/src/server.ts`](/packages/applicant/src/server.ts) pre-built server to run credential issuer side (TODO: applicant server code)

[Common](/packages/common) code shared between the issuer and applicant
- [`/packages/common/src/schemas/manifest.ts`](/packages/common/src/schemas/manifest.ts) DWN manifest record schema definition
- [`/packages/common/src/schemas/application.ts`](/packages/common/src/schemas/application.ts) DWN application record schema definition 
- [`/packages/common/src/schemas/response.ts`](/packages/common/src/schemas/response.ts) DWN response record schema definition
- [`/packages/common/src/schemas/invoice.ts`](/packages/common/src/schemas/invoice.ts) DWN invoice record schema definition

[Issuer](/packages/issuer)
- [`/packages/issuer/src/protocol.ts`](/packages/issuer/src/protocol.ts) credential issuer protocol definition
- [`/packages/issuer/src/handlers.ts`](/packages/issuer/src/handlers.ts) pre-defined credential issuer protocol handlers
- [`/packages/issuer/src/server.ts`](/packages/issuer/src/server.ts) pre-built server to run credential issuer side

[Credential Manifests](/EXAMPLE-MANIFEST.json)
  - [`EXAMPLE-MANIFEST.json`](/EXAMPLE-MANIFEST.json) defines an example manifest
  - **NOTE**: Manifests do not ship with the DCX package. Developers are required to provide their own manifests when building their DCX issuer server
  - See [Usage](#Usage) for how to provide manifests

A large part of what makes DCX work are the following specs defined by the Decentralized Identity Foundation (DIF).
1. [Credential Manifest](https://identity.foundation/credential-manifest/#credential-manifest/) 
2. [Credential Application](https://identity.foundation/credential-manifest/#credential-application/)
3. [Credential Response](https://identity.foundation/credential-manifest/#credential-response/)

### Credential Manifest

> Credential Manifests are a resource format that defines preconditional requirements, Issuer style preferences, and other facets. User Agents utilize to help articulate and select the inputs necessary for processing and issuance of a specified credential.
> 
> A Credential Manifest is a document, hosted by an Issuer and consumed by User Agents, codifying the credentials that it issues in terms of pre-requisites and inputs. These can be static or dynamic, but their form and usage are detailed in this specification.

Applicants pull these manifest records from the issuer's DWN, so they can understand what VCs are required on their side of the exchange. For more details on protocol interactions between issuers and applicants, see the [Architecture Diagram](#architecture-diagram) and [Sequence Diagram](#sequence-diagram) sections below.

These objects outline key pieces of information used in the exchange of credentials between applicants and issuers:
1. The input credential(s) required by the applicant as inputs to the issuer
2. The output credential(s) issued by the issuer to the applicant
3. Various style preferences and data structuring requirements imposed by the manifest publisher (i.e. issuers)

### Credential Application

> Credential Application are objects embedded within target claim negotiation formats that pass information from the Holder to the Issuer.
> 
> Credential Applications are JSON objects composed as follows:
> 
> - The object MUST contain an id property. The value of this property MUST be a unique identifier, such as a UUID.
> - The object MUST contain a spec_version property, and its value MUST be a valid spec URI according to the rules set in the versioning section.
> - The object MUST contain an applicant property, and its value MUST be a string. The value of this property MUST be a URI which uniquely identifies the applicant.
> - The object MUST contain a manifest_id property. The value of this property MUST be the id of a valid Credential Manifest.
> - The object MUST have a format property if the related Credential Manifest specifies a format property. Its value MUST be a subset of the format property in the Credential that this Credential Submission is related to. This object informs the Issuer which formats the Holder wants to receive the Claims in.
> - The Credential Application object MUST contain a presentation_submission property IF the related Credential Manifest contains a presentation_definition. Its value MUST be a valid Presentation Submission as defined in the Presentation Exchange specification:

### Credential Response

> Credential Responses are objects that encapsulate possible responses from a Credential Application, with two possible outcomes: fulfillment or denial. Fulfillment is the case where a Credential Application is accepted, and results in credential issuance. Fulfillments are embedded within target Claim negotiation formats that express how the outputs presented as proofs to a Holder are provided in accordance with the outputs specified in a Credential Manifest. Rejection is the case where a Credential Application is denied, and results in a response of pertitent information about the rejection. Embedded Credential Response objects MUST be located within target data format as the value of a credential_response property, which is composed and embedded as follows:

> - The object MUST be included at the top-level of an Embed Target, or in the specific location described in the Embed Locations table in the Embed Target section below.
> - The object MUST contain an id property. The value of this property MUST be a unique identifier, such as a UUID.
> - The object MUST contain a spec_version property, and its value MUST be a valid spec URI according to the rules set in the versioning section.
> - The object MUST contain an applicant property, and its valueMUST be a string. The value of this property MUST be a URI which uniquely identifies the applicant.
> - The object MUST contain a manifest_id property. The value of this property MUST be the id value of a valid Credential.
The object MAY contain an application_id property. If present, the value of this property MUST be the id value of a valid Credential Application.
> - The object MUST contain one of the following properties depending on whether the application is to be fulfilled or rejected.
>   - For fulfillment the object MUST contain a fulfillment property and its value MUST be an object composed as follows:
>       - The object MUST include a descriptor_map property. The value of this property MUST be an array of Output Descriptor Mapping Objects, just like Presentation Submission’s descriptor_map property as defined in the Presentation Exchange specification.
>   - For denial the object MUST contain a denial property and its value MUST be an object composed as follows:
>       - The object MUST contain a reason property . The value of this property MUST be a string which states why the Credential was not successful.
>       - The object MAY contain an input_descriptors property IF the related Credential Application contains a presentation_submission. It’s value MUST be an array of input_descriptor string identifiers from the descriptor_map property of a Presentation Submission, as defined in the Presentation Exchange specification, corresponding to the claims that failed to fulfill the Credential Application.

## Docs & Diagrams

Additional documentation including UML diagram files can be found in the [/docs](/docs) folder.

- [DEVELOPMENT.md](/docs/DEVELOPMENT.md) Lists current issues and PRs
- [SUMMARY.md](/docs/SUMMARY.md) Shorter summary about DCX

### Architecture Diagram

#### Actors
- **DCX**: Protocol boundary within which actors communicate
- **DCX Issuer**: Web server running @web5/dcx and web5-js
- **Issuer DWN**: DCX Issuer's DWN server running dwn-sdk-js
- **DCX Applicant**: User client application running @web5/dcx and web5-js
- **Applicant DWN**: DCX Applicant's DWN server running dwn-sdk-js

![dcx-architecture](/docs/img/dcx-architecture.png)

### Sequence Diagram

#### Full Protocol

<details>

1.  DCX Issuer configures Issuer DWN with dcx protocol
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

![dcx-full-sequence](/docs/img/dcx-full-sequence.png)

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

![dcx-issuer-sequence](/docs/img/dcx-issuer-sequence.png)

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

![dcx-applicant-sequence](/docs/img/dcx-applicant-sequence.png)


## Package Versions

| Name                                                 |                                                                Latest Version                                                                 |
| ---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------: |
| [@dcx-protocol/root](/) | [![badge](https://img.shields.io/npm/v/@dcx-protocol/root)](https://www.npmjs.com/package/@dcx-protocol/root) |
| [@dcx-protocol/applicant](/packages/applicant) | [![badge](https://img.shields.io/npm/v/@dcx-protocol/applicant)](https://www.npmjs.com/package/@dcx-protocol/applicant) |
| [@dcx-protocol/common](/packages/common) | [![badge](https://img.shields.io/npm/v/@dcx-protocol/common)](https://www.npmjs.com/package/@dcx-protocol/common) |
| [@dcx-protocol/issuer](/packages/issuer/) | [![badge](https://img.shields.io/npm/v/@dcx-protocol/issuer)](https://www.npmjs.com/package/@dcx-protocol/issuer) |

## Usage

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

const env = NODE_ENV || 'development';
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

## Project Resources

| Resource                                   | Description                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| [CODEOWNERS](./CODEOWNERS)                 | Outlines the project lead(s)                                                  |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Expected behavior for project contributors, promoting a welcoming environment |
| [CONTRIBUTING.md](./CONTRIBUTING.md)       | Developer guide to build, test, run, access CI, chat, discuss, file issues    |
| [GOVERNANCE.md](./GOVERNANCE.md)           | Project governance                                                            |
| [LICENSE](./LICENSE)                       | [![Apache License 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) |
