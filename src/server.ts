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
    /**
     *  1. Create and start Web5 instance locally, connect to remote DWN using password & recovery phrase
     *  2. Check if protocol is installed on remote DWN
     *  3. If protocol not installed, install it on remote DWN
     *  4. Query for manifest records in remote DWN
     *  5. Read each manifest record from DWN and check if credential-issuer protocol manifest installed
     *  6. Find unwritten manifests and write them to DWN
     *  7. If current cursor.json invalid, reset it
     *  8. Read protocol records from DWN
     *  9. If lastRecordId exists, skip ahead to that record id
     * 10. Process incoming records from DWN
     */
    const { web5, did, recoveryPhrase } = await Web5.connect({
        sync: 'off',
        techPreview: {
            dwnEndpoints: dcxConfig.DWN_ENDPOINTS,
        },
        password: dcxConfig.DWN_PASSWORD,
        recoveryPhrase: dcxConfig.DWN_RECOVERY_PHRASE,
    });
    console.log('Web5 connected!');
    console.log('web5 =>', web5);
    console.log('web5.agent =>', web5.agent);
    console.log('web5.did =>', web5.did);
    console.log('web5.dwn =>', web5.dwn);
    console.log('web5.vc =>', web5.vc);
    console.log('did =>', did);
    console.log('recoveryPhrase =>', recoveryPhrase);

    const { protocols } = await web5.dwn.protocols.query({
        from: did,
        message: {
            filter: {
                protocol: credentialIssuerProtocol.protocol,
            },
        },
    });
    console.log(`DWN has ${protocols.length} protocols available`);

    if (!protocols.length) {
        const { status: { code, detail }, protocol } = await web5.dwn.protocols.configure({
            message: { definition: credentialIssuerProtocol },
        });

        if (!code.toString().startsWith('2')) {
            console.error('Failed to configure credential issuer protocol locally', code, detail);
            throw new DcxDwnError(code, detail);
        }

        console.log(`Configured credential issuer protocol locally ${code} - ${detail}`);

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

    const unwrittenManifests = [Manifest].filter(
        (manifest) => !manifestsRead.find((manifestRead) => manifestRead?.id === manifest.id),
    );
    console.log(`Found ${unwrittenManifests.length} unwritten manifests`);

    if (!!unwrittenManifests.length) {
        const manifestWrites = await Promise.all(
            unwrittenManifests.map(async (manifest) => {
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

                const sendResult = await record?.send(did);
                console.log('Sent manifest to remote DWN', sendResult);

                return record;
            }),
        );
        console.log(`Wrote ${manifestWrites.length} manifests`);
    }

    let cursor = await readFileToJSON(dcxConfig.DWN_CURSOR_FILE);
    let lastRecordId = await readFileToString(dcxConfig.DWN_LAST_RECORD_ID_FILE);

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
            cursor = undefined;
        }

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