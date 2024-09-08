import { createHash } from 'crypto';

const preimage = process.argv.slice(2)[0];
const hash = createHash('md5').update(preimage).digest('hex');
console.log(`${preimage}:${hash}`);
