sequence diagram generator: https://bramp.github.io/js-sequence-diagrams/
jison: https://github.com/zaach/jison

DCX Applicant->Applicant DWN: create dcx protocol
Applicant DWN-->DCX Applicant: return protocol create status
DCX Applicant->Applicant DWN: create subscription
Applicant DWN-->DCX Applicant: return record subscription
DCX Applicant->Issuer DWN: read credential manifest record
Issuer DWN-->DCX Applicant: return credential manifest record
DCX Applicant->Trusted Issuers: request credentials required by manifest
Trusted Issuers-->DCX Applicant: return requested credentials or alt response
DCX Applicant->Issuer DWN: create application record
Issuer DWN-->DCX Applicant: return record create status
DCX Applicant->Applicant DWN: read response record via subscription
DCX Applicant->Applicant DWN: read invoice record via subscription (optional)