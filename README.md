# NAME CHANGE: Decentralized Credential Exchange (DCX)

DCX has changed names and been broken up into 3 packages! The previous single package was `@formfree/dcx`.
The monorepo setup contains 3 packages:
    1. `@dvcx/applicant`: used by clients who want to interact with issuers
    2. `@dvcx/issuer`: used on the server side by issuers to accept and issue VCs to applicants
    3. `@dvcx/common`: library of shared code used by both sides of the protocol

For questions, comments or concerns, contact [@bnonni](https://github.com/bnonni)