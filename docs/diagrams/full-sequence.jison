sequence diagram generator: https://bramp.github.io/js-sequence-diagrams/
jison: https://github.com/zaach/jison

DCX Issuer->Issuer DWN: configure dcx protocol
DCX Issuer->Issuer DWN: create manifest record
DCX Issuer->Issuer DWN: subscribe to record updates
DCX Applicant->Applicant DWN: configure dcx protocol
DCX Applicant->Applicant DWN: create subscription
DCX Applicant->Issuer DWN: read manifest record
DCX Applicant->Trusted Issuers: acquire credentials required by manifest
DCX Applicant->Issuer DWN: create application record
DCX Issuer->Issuer DWN: read application record via subscription
DCX Issuer->DCX Issuer: verify application record credentials
DCX Issuer->Applicant DWN: create application response record
DCX Applicant->Applicant DWN: read response record via subscription
DCX Issuer->Applicant DWN: create invoice record (optional)
DCX Applicant->Applicant DWN: read invoice record  (optional)