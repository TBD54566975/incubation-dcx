sequence diagram generator: https://bramp.github.io/js-sequence-diagrams/
jison: https://github.com/zaach/jison

DCX Issuer->Issuer DWN: configure dcx protocol
Issuer DWN-->DCX Issuer: return protocol create status
DCX Issuer->Issuer DWN: create manifest record
Issuer DWN-->DCX Issuer: return record create status
DCX Issuer->Issuer DWN: subscribe to record updates
Issuer DWN-->DCX Issuer: return record subscription
DCX Issuer->Issuer DWN: read application record via subscription
DCX Issuer->DCX Issuer: verify application record credentials 
DCX Issuer->Issuer DWN: create response record
Issuer DWN-->DCX Issuer: return record create status
DCX Issuer->Issuer DWN: create invoice record (optional)
Issuer DWN-->DCX Issuer: return record create status (optional)