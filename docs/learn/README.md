# Learn

A large part of what makes DCX work are the following specs defined by the Decentralized Identity Foundation (DIF).
1. [Credential Manifest](https://identity.foundation/credential-manifest/#credential-manifest/) 
2. [Credential Application](https://identity.foundation/credential-manifest/#credential-application/)
3. [Credential Response](https://identity.foundation/credential-manifest/#credential-response/)

## Credential Manifest

[Credential Manifests](/EXAMPLE-MANIFEST.json)
  - [`EXAMPLE-MANIFEST.json`](/EXAMPLE-MANIFEST.json) defines an example manifest
  - **NOTE**: Manifests do not ship with the DCX package. Developers are required to provide their own manifests when building their DCX issuer server
  - See [/docs/usage/README.md](/docs/usage/README.md) for how to use your own manifests

> Credential Manifests are a resource format that defines preconditional requirements, Issuer style preferences, and other facets. User Agents utilize to help articulate and select the inputs necessary for processing and issuance of a specified credential.
> 
> A Credential Manifest is a document, hosted by an Issuer and consumed by User Agents, codifying the credentials that it issues in terms of pre-requisites and inputs. These can be static or dynamic, but their form and usage are detailed in this specification.

Applicants pull these manifest records from the issuer's DWN, so they can understand what VCs are required on their side of the exchange. For more details on protocol interactions between issuers and applicants, see the [Architecture Diagram](#architecture-diagram) and [Sequence Diagram](#sequence-diagram) sections below.

These objects outline key pieces of information used in the exchange of credentials between applicants and issuers:
1. The input credential(s) required by the applicant as inputs to the issuer
2. The output credential(s) issued by the issuer to the applicant
3. Various style preferences and data structuring requirements imposed by the manifest publisher (i.e. issuers)

## Credential Application

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

## Credential Response

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