# TODO

- Docs README explaining various concepts and ideas
- "How to use DCX" instructions
- Credential manifest json file guidance
- Any other nuances that are domain specific or not immediately obvious

DID
1. DCX_DID_URI or DCX_DID_JWK_D - store private key in env var and use it to somehow generate pubkey and did material
2. DCX_DID_FILEPATH - store portable did file in project root and set path in env var
3. Leave both above blank and let DCX create a new did

Code Flow (outdated)
1. Create and start Web5 instance locally, connect to remote DWN using password & recovery phrase
2. Check if protocol is installed on remote DWN
3. If protocol not installed, install it on remote DWN
4. Query for manifest records in remote DWN
5. Read each manifest record from DWN and check if credential-issuer protocol manifest installed
6. Find unwritten manifests and write them to DWN
7. If current cursor.json invalid, reset it
8. Read protocol records from DWN
9. If lastRecordId exists, skip ahead to that record id
10. Process incoming records from DWN
