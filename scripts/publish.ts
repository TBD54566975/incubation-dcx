import { execSync } from 'child_process';
import * as path from 'path';

async function publishPackage(packagePath: string, dryRun: boolean) {
    const packageDir = path.dirname(packagePath);
    const dryRunFlag = dryRun ? '--dry-run' : '';
    execSync(`cd ${packageDir} && pnpm publish ${dryRunFlag}`, { stdio: 'inherit' });
    console.log(`Published package from ${packagePath} ${dryRun ? '(dry run)' : ''}`);
}


async function publish() {
    const args = process.argv.slice(2);
    let dryRun = args.some(arg => ['--dry-run', '-d'].includes(arg));

    const packagePaths = [
        path.resolve(process.cwd(), 'package.json'),
        path.resolve(process.cwd(), 'packages/applicant/package.json'),
        path.resolve(process.cwd(), 'packages/common/package.json'),
        path.resolve(process.cwd(), 'packages/issuer/package.json'),
    ];

    for (const packagePath of packagePaths) {
        await publishPackage(packagePath, dryRun);
    }
}

publish()
    .then(process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
