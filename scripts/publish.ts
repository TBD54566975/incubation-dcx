import { execSync } from 'child_process';
import * as path from 'path';

async function publishPackage(packagePath: string) {
    const packageDir = path.dirname(packagePath);
    execSync(`cd ${packageDir} && pnpm publish`, { stdio: 'inherit' });
    console.log(`Published package from ${packagePath}`);
}

async function publish() {
    const args = process.argv.slice(2);
    let doGit = false;

    for (const arg of args) {
        if (arg === '-g' || arg === '--git') {
            doGit = true;
        }
    }

    const packagePaths = [
        path.resolve(process.cwd(), 'package.json'),
        path.resolve(process.cwd(), 'packages/applicant/package.json'),
        path.resolve(process.cwd(), 'packages/common/package.json'),
        path.resolve(process.cwd(), 'packages/issuer/package.json'),
    ];

    for (const packagePath of packagePaths) {
        await publishPackage(packagePath);
    }

    if (doGit) {
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "chore: publish packages"', { stdio: 'inherit' });
        execSync('git tag -a "v$(date +%Y%m%d%H%M%S)" -m "Release $(date +%Y%m%d%H%M%S)"', { stdio: 'inherit' });
        execSync('git push --follow-tags', { stdio: 'inherit' });
    }
}

publish().catch(err => {
    console.error(err);
    process.exit(1);
});
