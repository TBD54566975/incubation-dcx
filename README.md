# Decentralized Credential Exchange (DCX)

DCX is both a protocol and a software package. The DCX protocol defines a process for verifiable credential exchange between user agents and issuers via DWN protocols. The DCX package is a FOSS npm package that implements the protocol in addition to a "credentials in, credentials out" asynchronous web server that manages protocol interactions between user agents and DWN servers. The goal of this project is to implement a well documented, abstractly designed npm package and merge it into the Web5 monorepo under the name `@web5/dcx`, so developers can `npm install @web5/dcx` into any javascript/typescript project and run a DCX server to participate in the DCX protocol.

## Package

The DCX package is a FOSS npm package used to bootstrap running a DCX issuer server. The package handles the connection between the DCX server and its corresponding DWN server and provides the following functionality:

1. DCX to DWN server connection - asynchronous communication between issuers and applicants
2. DCX to DHT gateway connection - asynchronous communication between issuers and DHT gateways
3. DID DHT key management - import/export/create DID DHT keys
4. DCX protocol & handlers - integrated with api handlers to facilitate required interactions with DWNs and 3rd parties

## Protocol

The DCX protocol is a DWN protocol designed to facilitate the decentralized exchange of credentials between issuers, applicants and their DWNs. The interactions between these actors is achieved by performing CRUD operations on DWNs in the form of DWN Records. Specifically, DWN records are used to facilitate decentralized communication between actors. These records contain informatino about required input VCs to desired output VCs.

The DCX protocol uses [Credential Manifests](https://identity.foundation/credential-manifest/) to achieve this communication between DCX actors such that issuers define manifests for applicants to read so they can understand what VCs are required in the exchange. Specifically, manifests describe the VC inputs and VC outputs of an Applicant and an Issuer. For more details on the interactions, see the diagrams in the [Architecture](#architecture) and [Sequence](#sequence) sections below.

[Protocol](./src/protocol/)
  - [`src/protocol/credential-issuer.ts`](./src/protocol/credential-issuer.ts) defines credential issuer protocol
  - [`src/protocol/credential-applicant.ts`](./src/protocol/credential-applicant.ts) defines credential applicant protocol

[Protocol Schemas](./src/protocol/schemas/)
  - [`src/protocol/schemas/invoice.ts`](./src/protocol/schemas/invoice.ts) defines the schema for invoice records
  - [`src/protocol/schemas/manifest.ts`](./src/protocol/schemas/manifest.ts) defines schema for manifest records
  - [`src/protocol/schemas/application.ts`](./src/protocol/schemas/application.ts) defines schema for application records
  - [`src/protocol/schemas/response.ts`](./src/protocol/schemas/response.ts) defines schema for response records

[Protocol Manifests](./src/protocol/manifests/)
  - [`src/protocol/manifests/EXAMPLE-MANIFEST.json`](./src/protocol/manifests/EXAMPLE-MANIFEST.json) defines an example manifest
  - **NOTE**: Manifests do not ship with the DCX package. Developers are required to provide their own manifests when building their DCX issuer server

## Architecture

![dcx-architecture](./docs/img/dcx-architecture.png)

#### Actors

- **DCX**: Protocol boundary within which actors communicate
- **DCX Issuer**: Web server running @web5/dcx and web5-js
- **Issuer DWN**: DCX Issuer's DWN server running dwn-sdk-js
- **DCX Applicant**: User client application running @web5/dcx and web5-js
- **Applicant DWN**: DCX Applicant's DWN server running dwn-sdk-js

#### Packages

- [web5-js](https://github.com/TBD54566975/web5-js)
- [@web5/dcx](https://github.com/TBD54566975/incubation-tblend)
- [dwn-sdk-js](https://github.com/TBD54566975/dwn-sdk-js)

## Sequence

#### Full Sequence

![dcx-full-sequence](./docs/img/dcx-full-sequence.png)

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

Notes:

1. Credential-issuer and credential-applicant protocols defines DWN record CRUD actions between Issuer and Applicant
2. under the credential-issuer manifest route
3. Subscription to receive incoming application records
4. Subscription to receive incoming response records
5. Defines required "credentials in" to receive desired "credentials out"
6. Credentials are acquired separately, outside of DCX protocol, from listed trusted issuers
7. Application record includes credentials that satisfy credential manifest mentioned in step 5
9. DCX Issuer validates credentials against credential manifest using DCX software handlers

#### Issuer Sequence

![dcx-issuer-sequence](./docs/img/dcx-issuer-sequence.png)

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

#### Applicant Sequence

![dcx-applicant-sequence](./docs/img/dcx-applicant-sequence.png)

1. DCX Applicant configures Applicant DWN with dcx protocol (issuer & applicant)
2. DCX Applicant creates subscription to Applicant DWN 
3. DCX Applicant reads credential manifest record from Issuer DWN
4. DCX Applicant acquires required credentials from issuers listed in manifest
5. DCX Applicant creates application record in Issuer DWN
6. DCX Applicant reads response record via Applicant DWN subscription
7. DCX Applicant reads invoice record via Applicant DWN subscription (optional)

## Use

```javascript
// issuer side
import {
  credentialIssuerProtocol,
  manifestSchema,
} from "@web5/credential-issuance-protocol";

// example use in protocol query
const { protocols } = await web5.dwn.protocols.query({
  from: did,
  message: {
    filter: {
      protocol: credentialIssuerProtocol.protocol,
    },
  },
});

// applicant side
import {
  credentialApplicantProtocol,
  manifestSchema,
  presentationSchema,
  responseSchema,
} from "@web5/credential-issuance-protocol";

// example use in write
const { record: applicationRecord, status: createStatus } =
  await web5?.web5.dwn.records.create({
    store: true,
    data: presentationResult.presentation,
    message: {
      recipient: issuerDid,
      schema: presentationSchema.$id,
      dataFormat: "application/json",
      protocol: credentialApplicantProtocol.protocol,
      protocolPath: "application",
    },
  });
```

## To Do

- [x] Create repo with documentation and diagrams
- [x] Credential issuer protocol handlers: [#5](https://github.com/TBD54566975/incubation-tblend/pull/5)
  - [x] Use env var to allow importing custom manifests: [#5](https://github.com/TBD54566975/incubation-tblend/pull/5)
  - [x] Create, read, update credential manifest records in DWN: [#5](https://github.com/TBD54566975/incubation-tblend/pull/5)
  - [x] Create and update responses to applications: [#5](https://github.com/TBD54566975/incubation-tblend/pull/5)
  - [x] Read applications, parse credentials and validate against manifest (presentation exchange): [#5](https://github.com/TBD54566975/incubation-tblend/pull/5)
  - [x] Request new credentials from trusted 3rd party issuers: [#5](https://github.com/TBD54566975/incubation-tblend/pull/5)
  - [x] Create new credentials from 3rd party data requests: [#5](https://github.com/TBD54566975/incubation-tblend/pull/5)
  - [ ] Create and update invoices as responses to applications
- [ ] DWN server connection and configuration
- [ ] DID key management (DID DHT)
  - [ ] Read existing keys
  - [ ] Create new keys
  - [ ] Update and delete new/existing keys
- [ ] DHT gateway connection 

## Project Resources

| Resource                                   | Description                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| [CODEOWNERS](./CODEOWNERS)                 | Outlines the project lead(s)                                                  |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Expected behavior for project contributors, promoting a welcoming environment |
| [CONTRIBUTING.md](./CONTRIBUTING.md)       | Developer guide to build, test, run, access CI, chat, discuss, file issues    |
| [GOVERNANCE.md](./GOVERNANCE.md)           | Project governance                                                            |
| [LICENSE](./LICENSE)                       | Apache License, Version 2.0                                                   |
