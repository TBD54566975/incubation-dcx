# Decentralized Credential Exchange (DCX)

[![codecov](https://codecov.io/github/TBD54566975/incubation-dcx/branch/main/graph/badge.svg?token=6PYX9498RD)](https://codecov.io/github/TBD54566975/incubation-dcx)

DCX is a new Decentralized Web Nodes (DWN) protocol that facilitates the decentralized exchange of borrower data for lender money seurely and privately and a npm package that implements the protocol as a one-click server solution. 

As an open, permissionless, "credentials in, credentials out" asynchronous web server, DCX leverages the strongest Web5 primitives: DWNs, Verifiable Credentials (VCs), Credential Manifests, Verifiable Presentations and Presentation Exchange amongst  other important Web5 primitives. DCX facilitates decentralized credential exchange by performing CRUD operations on both applicant and issuer DWNs. Different DWN record schemas represent various messages sent between actors, detailing the VCs required as inputs and outputs for the DCX server.

To learn more about the components of DCX, check out [/docs/learn/README.md](/docs/learn/README.md).

To learn more about the architecture and sequences of DCX, check out [/docs/diagrams/README.md](/docs/diagrams/README.md).

To learn how to use DCX, check out [/docs/usage/README.md](/docs/usage/README.md).

## Package Versions

|                   package                      |                             npm                           |                               issues                            |
| ---------------------------------------------- | :-------------------------------------------------------: | :-------------------------------------------------------------: |
| [@dcx-protocol/root](/)                        | [![NPM Package][root-npm-badge]][root-npm-link]           | [![Open Issues][root-issues-badge]][root-issues-link]           |
| [@dcx-protocol/applicant](/packages/applicant) | [![NPM Package][applicant-npm-badge]][applicant-npm-link] | [![Open Issues][applicant-issues-badge]][applicant-issues-link] |
| [@dcx-protocol/common](/packages/common)       | [![NPM Package][common-npm-badge]][common-npm-link]       | [![Open Issues][common-issues-badge]][common-issues-link]       |
| [@dcx-protocol/issuer](/packages/issuer/)      | [![NPM Package][issuer-npm-badge]][issuer-npm-link]       | [![Open Issues][issuer-issues-badge]][issuer-issues-link]       |

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

[root-npm-badge]: https://img.shields.io/npm/v/@dcx-protocol/root.svg?&color=blue&santize=true
[root-npm-link]: https://www.npmjs.com/package/@dcx-protocol/root
[root-issues-badge]: https://img.shields.io/github/issues/TBD54566975/incubation-dcx/package:%20root?label=issues
[root-issues-link]: https://github.com/TBD54566975/incubation-dcx/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+root"

[applicant-npm-badge]: https://img.shields.io/npm/v/@dcx-protocol/applicant.svg?&color=blue&santize=true
[applicant-npm-link]: https://www.npmjs.com/package/@dcx-protocol/applicant
[applicant-issues-badge]: https://img.shields.io/github/issues/TBD54566975/incubation-dcx/package:%20applicant?label=issues
[applicant-issues-link]: https://github.com/TBD54566975/incubation-dcx/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+applicant"

[common-npm-badge]: https://img.shields.io/npm/v/@dcx-protocol/common.svg?&color=blue&santize=true
[common-npm-link]: https://www.npmjs.com/package/@dcx-protocol/common
[common-issues-badge]: https://img.shields.io/github/issues/TBD54566975/incubation-dcx/package:%20common?label=issues
[common-issues-link]: https://github.com/TBD54566975/incubation-dcx/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+common"

[issuer-npm-badge]: https://img.shields.io/npm/v/@dcx-protocol/issuer.svg?&color=blue&santize=true
[issuer-npm-link]: https://www.npmjs.com/package/@dcx-protocol/issuer
[issuer-issues-badge]: https://img.shields.io/github/issues/TBD54566975/incubation-dcx/package:%20issuer?label=issues
[issuer-issues-link]: https://github.com/TBD54566975/incubation-dcx/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+issuer"