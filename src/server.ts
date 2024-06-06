import { Web5 } from '@web5/api';
import { writeFile } from 'fs/promises';
import { dcxConfig } from './config.js';
import { DcxDwnError } from './error.js';
import { credentialIssuerProtocol, manifestSchema } from './protocol/index.js';
import Manifest from './protocol/manifests/MANIFEST.json';
import { readFileToJSON, readFileToString } from './utils/file-system.js';
import { processMessage } from './utils/processor.js';
import { Time } from './utils/time.js';

async function start() {
    // 1. Create and start Web5
    const { web5, did } = await Web5.connect({
        sync: 'off',
        techPreview: {
            dwnEndpoints: dcxConfig.DWN_ENDPOINTS,
        },
        password: dcxConfig.DWN_PASSWORD,
        recoveryPhrase: dcxConfig.DWN_RECOVERY_PHRASE,
    });
    console.log('Web5 connected');

    const portableDid = await web5.did.resolve(did);

    // 5.3 Check if protocol is installed on DWN
    const { protocols } = await web5.dwn.protocols.query({
        from: did,
        message: {
            filter: {
                protocol: credentialIssuerProtocol.protocol,
            },
        },
    });
    console.log(`DWN has ${protocols.length} protocols available`);

    // 5.4 If missing, install protocol to local DWN then sync to remote DWN
    if (!protocols.length) {
        const { status: { code, detail }, protocol } = await web5.dwn.protocols.configure({
            message: { definition: credentialIssuerProtocol },
        });

        if (!code.toString().startsWith('2')) {
            console.error('Failed to configure credential issuer protocol locally', code, detail);
            throw new DcxDwnError(code, detail);
        }

        console.log(`Configured credential issuer protocol locally ${code} - ${detail}`);

        // sync to remote
        const { status: protoSendStatus } = (await protocol?.send(did)) ?? {};
        const { code: protoSendCode = 500, detail: protoSendDetail = 'Failed' } = protoSendStatus ?? {};
        if (!protoSendCode.toString().startsWith('2')) {
            console.error('Failed to configure credential issuer protocol locally', protoSendStatus);
            throw new DcxDwnError(protoSendCode, protoSendDetail);
        }
        console.log(
            `Configured credential issuer protocol locally ${protoSendCode} - ${protoSendDetail}`,
        );
        console.log('Sent protocol to remote DWN', protoSendStatus);
    }

    // 6. Check if the credential issuer protocol manifest is installed
    const { records: manifestRecords = [] } =
        (await web5.dwn.records
            .query({
                from: did,
                message: {
                    filter: {
                        schema: manifestSchema.$id,
                        dataFormat: 'application/json',
                        protocol: credentialIssuerProtocol.protocol,
                        protocolPath: 'manifest',
                    },
                },
            })
            .catch((e) => console.warn('manifest records query error', e))) ?? {};

    console.log(`Found ${manifestRecords.length} manifests`);

    // 7. Read each manifest record from DWN
    const manifestsRead = await Promise.all(
        manifestRecords.map(async (manifestResponse) => {
            const { record } = await web5.dwn.records.read({
                from: did,
                message: {
                    filter: {
                        recordId: manifestResponse.id,
                    },
                },
            });
            return record.data.json();
        }),
    );
    console.log(`Read ${manifestsRead.length} manifest records`, manifestsRead);

    // 7.1 find unwritten manifests
    const unwrittenManifests = [Manifest].filter(
        (manifest) => !manifestsRead.find((manifestRead) => manifestRead?.id === manifest.id),
    );
    console.log(`Found ${unwrittenManifests.length} unwritten manifests`);

    // 7.2 write unwritten manifests
    if (!!unwrittenManifests.length) {
        const manifestWrites = await Promise.all(
            unwrittenManifests.map(async (manifest) => {
                // 7.2.1 set issuer dynamically
                manifest.issuer.id = did;

                const { record } = await web5.dwn.records.create({
                    store: false,
                    data: manifest,
                    message: {
                        schema: manifestSchema.$id,
                        dataFormat: 'application/json',
                        protocol: credentialIssuerProtocol.protocol,
                        protocolPath: 'manifest',
                        published: true,
                    },
                });

                // send to remote dwn
                const sendResult = await record?.send(did);
                console.log('Sent manifest to remote DWN', sendResult);

                return record;
            }),
        );
        console.log(`Wrote ${manifestWrites.length} manifests`);
    }

    // check for incoming requests
    let cursor = await readFileToJSON(dcxConfig.DWN_CURSOR_FILE);
    let lastRecordId = await readFileToString(dcxConfig.DWN_LAST_RECORD_ID_FILE);

    // Poll for new protocol messages
    while (true) {
        const { records = [], cursor: nextCursor } = await web5.dwn.records.query({
            from: did,
            message: {
                filter: {
                    protocol: credentialIssuerProtocol.protocol,
                },
                pagination: {
                    cursor,
                    limit: 1,
                },
            },
        });

        if (cursor && !records.length) {
            // reset invalid cursor
            cursor = undefined;
        }

        // read record data
        const recordReads = await Promise.all(
            records.map(async (recordResponse) => {
                const { record } = await web5.dwn.records.read({
                    from: did,
                    message: {
                        filter: {
                            recordId: recordResponse.id,
                        },
                    },
                });
                return record;
            }),
        );

        // process records
        for (const record of recordReads) {
            if (record.id != lastRecordId) {
                if (record.protocolPath === 'application') {
                    await processMessage(web5, did, record);
                } else {
                    console.log('Skipped message with protocol path', record.protocolPath);
                }
                lastRecordId = record.id;
                await writeFile(dcxConfig.DWN_LAST_RECORD_ID_FILE, lastRecordId);
            } else {
                await Time.sleep();
            }
        }

        if (nextCursor) {
            console.log('Updated cursor for next query', nextCursor);
            cursor = nextCursor;
            await writeFile(dcxConfig.DWN_CURSOR_FILE, cursor);
        }

        if (!recordReads.length) {
            await Time.sleep();
        }
    }

}

const server = { start };
export default server;