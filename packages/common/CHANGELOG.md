# @dcx-protocol/common

## 6.0.0

### Major Changes

- e038aea: Eliminate redundancy between dcxConfig and dcxOptions #118
- c372861: Aligning all packages to same semver (5.0.1) due to upstream conflicts with versions

### Minor Changes

- c372861: Bugs: applicant and issuer #126
  - fixes major bug in applicant
    - BUG: Attempted import error: 'utils' is not exported from '@web5/crypto' (imported as 'cryptoUtils').
    - FIX: https://discord.com/channels/937858703112155166/969272658501976117/1278447654640029707
  - minor changes to common
  - fixes minor bug in issuer
  - aligns versions in all"
- 1d0fffc: slightly changes the dcx-config related to #118

### Patch Changes

- ac54bd2: initalizing the dcx monorepo
