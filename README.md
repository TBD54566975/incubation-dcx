# Decentralized Credential Exchange (DCX)

[![codecov](https://codecov.io/github/TBD54566975/incubation-dcx/branch/main/graph/badge.svg?token=6PYX9498RD)](https://codecov.io/github/TBD54566975/incubation-dcx)

DCX is a new Decentralized Web Node (DWN) protocol that securely and privately facilitates the decentralized exchange of a user's verifiable credentials for different verifiable credential. The npm package implements each side of the protocol along with a common library and a server.

As an open, permissionless, "credentials in, credentials out" server, DCX as like a asynchronous web server. It leverages Decentralized Identity primitives via TBD's Web5 platform. Primitives leveraged by DCX include DIDs, VCs, DWNs and Presentation Exchange, which includes Credential Manifests, Credential Applications, Credential Responses and Verifiable Presentations (VPs). The concept is to facilitate a decentralized exchange of credentials via DWN records. DCX actors (applicants and issuers) perform CRUD operations on their own and the counterparty's DWNs to communicate. These records server as a form of request/response model but in a completely asynchronous manner. The DWNs involved are always-online servers that sync to the client on an interval. In this way, a user can submit an application to the issuer's DWN, go offline for hours and come back online to find a response to that application from the issuer in their DWN. DWN protocols outline who can do what to which records. The records involved with DCX include: application, manifest, response and invoice. These record schemas represent the structure of the messages sent between the actors' DWNs. Records include all the details needed to achieve this exchange including information about the applicant, what VCs are required from the applicant as inputs to the issuer, what VCs the issuer will respond with to the applicant and the structure of applications, responses and invoices.

To learn more about the components of DCX and the underlying primitives its built on, check out [/docs/learn/README.md](/docs/learn/README.md).

To learn more about the architecture and sequences of the DCX system, check out [/docs/diagrams/README.md](/docs/diagrams/README.md).

To learn how to use DCX in your own project, check out [/docs/usage/README.md](/docs/usage/README.md).

## Package Versions

|                   package                      |                             npm                           |                               issues                            |                               prs                            |
| ---------------------------------------------- | :-------------------------------------------------------: | :-------------------------------------------------------------: | :----------------------------------------------------------: |
| [@dcx-protocol/root](/)                        | [![NPM Package][root-npm-badge]][root-npm-link]           | [![Open Issues][root-issues-badge]][root-issues-link]           | [![Open PRs][root-pulls-badge]][root-pulls-link]             |
| [@dcx-protocol/applicant](/packages/applicant) | [![NPM Package][applicant-npm-badge]][applicant-npm-link] | [![Open Issues][applicant-issues-badge]][applicant-issues-link] | [![Open PRs][applicant-pulls-badge]][applicant-pulls-link]   |
| [@dcx-protocol/common](/packages/common)       | [![NPM Package][common-npm-badge]][common-npm-link]       | [![Open Issues][common-issues-badge]][common-issues-link]       | [![Open PRs][common-pulls-badge]][common-pulls-link]         |
| [@dcx-protocol/issuer](/packages/issuer/)      | [![NPM Package][issuer-npm-badge]][issuer-npm-link]       | [![Open Issues][issuer-issues-badge]][issuer-issues-link]       | [![Open PRs][issuer-pulls-badge]][issuer-pulls-link]         |
| [@dcx-protocol/server](/packages/server/)      | [![NPM Package][server-npm-badge]][server-npm-link]       | [![Open Issues][server-issues-badge]][server-issues-link]       | [![Open PRs][server-pulls-badge]][server-pulls-link]         |

## Project Resources

| Resource                                   | Description                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| [CODEOWNERS](./CODEOWNERS)                 | Outlines the project lead(s)                                                  |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Expected behavior for project contributors, promoting a welcoming environment |
| [CONTRIBUTING.md](./CONTRIBUTING.md)       | Developer guide to build, test, run, access CI, chat, discuss, file issues    |
| [GOVERNANCE.md](./GOVERNANCE.md)           | Project governance                                                            |
| [LICENSE](./LICENSE)                       | [![Apache License 2.0][apache-license-badge]](apache-license-link)            |

[apache-license-badge]: https://img.shields.io/badge/license-Apache%202.0-blue.svg
[apache-license-link]: https://opensource.org/licenses/Apache-2.0

[root-npm-badge]: https://img.shields.io/npm/v/@dcx-protocol/root.svg?&color=green&santize=true
[root-npm-link]: https://www.npmjs.com/package/@dcx-protocol/root
[root-issues-badge]: https://img.shields.io/github/issues/TBD54566975/incubation-dcx/package:%20root?label=issues
[root-issues-link]: https://github.com/TBD54566975/incubation-dcx/issues?q=is%3Aopen+is%3Aissue+label%3A%22package%3A+root%22
[root-pulls-badge]: https://img.shields.io/github/issues-pr/TBD54566975/incubation-dcx/package%3A%20root?label=PRs
[root-pulls-link]: https://github.com/TBD54566975/incubation-dcx/pulls?q=is%3Aopen+is%3Apr+label%3A%22package%3A+issuer%22

[applicant-npm-badge]: https://img.shields.io/npm/v/@dcx-protocol/applicant.svg?&color=green&santize=true
[applicant-npm-link]: https://www.npmjs.com/package/@dcx-protocol/applicant
[applicant-issues-badge]: https://img.shields.io/github/issues/TBD54566975/incubation-dcx/package:%20applicant?label=issues
[applicant-issues-link]: https://github.com/TBD54566975/incubation-dcx/issues?q=is%3Aopen+is%3Aissue+label%3A%22package%3A+applicant%22
[applicant-pulls-badge]: https://img.shields.io/github/issues-pr/TBD54566975/incubation-dcx/package%3A%20applicant?label=PRs
[applicant-pulls-link]: https://github.com/TBD54566975/incubation-dcx/pulls?q=is%3Aopen+is%3Apr+label%3A%22package%3A+issuer%22

[common-npm-badge]: https://img.shields.io/npm/v/@dcx-protocol/common.svg?&color=green&santize=true
[common-npm-link]: https://www.npmjs.com/package/@dcx-protocol/common
[common-issues-badge]: https://img.shields.io/github/issues/TBD54566975/incubation-dcx/package:%20common?label=issues
[common-issues-link]: https://github.com/TBD54566975/incubation-dcx/issues?q=is%3Aopen+is%3Aissue+label%3A%22package%3A+common%22
[common-pulls-badge]: https://img.shields.io/github/issues-pr/TBD54566975/incubation-dcx/package%3A%20common?label=PRs
[common-pulls-link]: https://github.com/TBD54566975/incubation-dcx/pulls?q=is%3Aopen+is%3Apr+label%3A%22package%3A+issuer%22

[issuer-npm-badge]: https://img.shields.io/npm/v/@dcx-protocol/issuer.svg?&color=green&santize=true
[issuer-npm-link]: https://www.npmjs.com/package/@dcx-protocol/issuer
[issuer-issues-badge]: https://img.shields.io/github/issues/TBD54566975/incubation-dcx/package:%20issuer?label=issues
[issuer-issues-link]: https://github.com/TBD54566975/incubation-dcx/issues?q=is%3Aopen+is%3Aissue+label%3A%22package%3A+issuer%22
[issuer-pulls-badge]: https://img.shields.io/github/issues-pr/TBD54566975/incubation-dcx/package%3A%20issuer?label=PRs
[issuer-pulls-link]: https://github.com/TBD54566975/incubation-dcx/pulls?q=is%3Aopen+is%3Apr+label%3A%22package%3A+issuer%22

[server-npm-badge]: https://img.shields.io/npm/v/@dcx-protocol/server.svg?&color=green&santize=true
[server-npm-link]: https://www.npmjs.com/package/@dcx-protocol/server
[server-issues-badge]: https://img.shields.io/github/issues/TBD54566975/incubation-dcx/package:%20server?label=issues
[server-issues-link]: https://github.com/TBD54566975/incubation-dcx/issues?q=is%3Aopen+is%3Aissue+label%3A%22package%3A+server%22
[server-pulls-badge]: https://img.shields.io/github/issues-pr/TBD54566975/incubation-dcx/package%3A%20server?label=PRs
[server-pulls-link]: https://github.com/TBD54566975/incubation-dcx/pulls?q=is%3Aopen+is%3Apr+label%3A%22package%3A+server%22
